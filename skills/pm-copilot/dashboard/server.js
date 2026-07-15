'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const { PROJECT_PATH, PROJECT_NAME, PORT, CACHE_FILE, PORT_FILE } = require('./lib/config');
const { getLockedHuIds } = require('./lib/sprintLock');
const { generatePdf, generatePdfDeDocumento } = require('./lib/pdf');
const { renderPrintView } = require('./lib/printView');
const { renderDocumentoView, resolveRutaDocumento } = require('./lib/printDocumento');
const { stripContenidoInterno } = require('./lib/markdownClientStrip');
const { isJiraConfigured, credentialsAvailable, readProjectConfig, fetchJiraSnapshot } = require('./lib/jiraClient');
const { writeJiraSnapshotRecord } = require('./lib/writers/jiraSnapshotWriter');

const { getBackend } = require('./lib/dataBackend');
const { TIPO_DESCRIPTORS } = require('./lib/dataBackend/tipoDescriptors');

const app = express();
app.use(express.json());

// Resuelto una vez al arrancar el proceso: lee .pm-copilot.json si existe y
// decide local vs. cloud, con degradación automática a local si el modo
// cloud no está disponible por cualquier motivo — ver lib/dataBackend/index.js.
const backend = getBackend(PROJECT_PATH);

// Tipos cuyas ediciones se registran en el ledger de cambios pendientes
// (ver output-transversal/cambios-pendientes-dashboard.md) para que
// actualizar-cascada.md sepa qué cambió sin re-escanear todo el proyecto.
// El daily log queda fuera a propósito: no es un artefacto del que dependa
// ningún otro paso del pipeline (no aparece en la tabla de esa cascada).
const TIPOS_CON_CAMBIOS_PENDIENTES = new Set(Object.keys(TIPO_DESCRIPTORS));

function readCacheIfExists() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch (err) {
      console.error('[server] Caché corrupta, se regenerará:', err.message);
      return null;
    }
  }
  return null;
}

// --- GET /api/data ---------------------------------------------------------
app.get('/api/data', async (req, res) => {
  const cached = readCacheIfExists();
  if (cached) {
    return res.json(cached);
  }
  try {
    const snapshot = await backend.readSnapshot(PROJECT_PATH);
    res.json(snapshot);
  } catch (err) {
    console.error('[server] Error generando snapshot:', err);
    res.status(500).json({ error: 'Error generando el snapshot del proyecto', detail: err.message });
  }
});

// --- POST /api/sync ---------------------------------------------------------
// Si el proyecto tiene config/jira-project.json (URL, projectKey, boardId —
// nada secreto) y el proceso tiene JIRA_EMAIL/JIRA_API_TOKEN como variables
// de entorno, "Actualizar" trae el estado real de Jira en el momento del
// clic (épicas, sprints, historias) además de reparsear todo lo local
// (GEE, requisitos, capacidad, roadmap). Si Jira no está configurado, o la
// llamada falla, se hace un resync 100% local igual que antes y se avisa
// del motivo en la respuesta (nunca se rompe el dashboard por un fallo de
// Jira).
app.post('/api/sync', async (req, res) => {
  let liveJira = null;
  let jiraSyncWarning = null;

  if (isJiraConfigured(PROJECT_PATH)) {
    if (!credentialsAvailable()) {
      jiraSyncWarning =
        'config/jira-project.json existe pero faltan JIRA_EMAIL/JIRA_API_TOKEN como variables de entorno del proceso — mostrando solo datos locales.';
    } else {
      try {
        const cfg = readProjectConfig(PROJECT_PATH);
        liveJira = await fetchJiraSnapshot(cfg);
        try {
          writeJiraSnapshotRecord(PROJECT_PATH, liveJira);
        } catch (writeErr) {
          console.error('[server] No se pudo guardar el registro local de la sincronización con Jira:', writeErr.message);
        }
      } catch (err) {
        console.error('[server] Fallo consultando Jira en /api/sync:', err.message);
        jiraSyncWarning = 'No se pudo sincronizar con Jira (' + err.message + '). Mostrando el último estado local.';
      }
    }
  }

  try {
    const snapshot = await backend.readSnapshot(PROJECT_PATH, { liveJira });
    if (jiraSyncWarning) snapshot.jiraSyncWarning = jiraSyncWarning;
    res.json(snapshot);
  } catch (err) {
    console.error('[server] Error en /api/sync:', err);
    res.status(500).json({ error: 'Error reparseando el proyecto', detail: err.message });
  }
});

// --- Escritura GEE: PUT/POST /api/gee/:tipo(/:id) ---------------------------
app.put('/api/gee/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params;
  if (!TIPO_DESCRIPTORS[tipo]) {
    return res.status(404).json({ error: `Tipo de registro GEE desconocido: "${tipo}". Válidos: ${Object.keys(TIPO_DESCRIPTORS).join(', ')}` });
  }
  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para aplicar el cambio.' });
  }
  try {
    const { confirm, ...fields } = req.body;
    await backend.writeRow(PROJECT_PATH, tipo, id, fields, { origen: 'dashboard' });
    if (TIPOS_CON_CAMBIOS_PENDIENTES.has(tipo)) {
      await backend.logCambioPendiente(PROJECT_PATH, { artefacto: tipo, registroId: id, camposModificados: Object.keys(fields) });
    }
    const snapshot = await backend.readSnapshot(PROJECT_PATH);
    res.json(snapshot);
  } catch (err) {
    console.error(`[server] Error actualizando ${tipo}/${id}:`, err);
    res.status(500).json({ error: `Error actualizando ${tipo}/${id}`, detail: err.message });
  }
});

app.post('/api/gee/:tipo', async (req, res) => {
  const { tipo } = req.params;
  if (!TIPO_DESCRIPTORS[tipo]) {
    return res.status(404).json({ error: `Tipo de registro GEE desconocido: "${tipo}". Válidos: ${Object.keys(TIPO_DESCRIPTORS).join(', ')}` });
  }
  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para crear el registro.' });
  }
  try {
    const { confirm, ...fields } = req.body;
    const result = await backend.writeRow(PROJECT_PATH, tipo, null, fields, { origen: 'dashboard' });
    if (TIPOS_CON_CAMBIOS_PENDIENTES.has(tipo)) {
      await backend.logCambioPendiente(PROJECT_PATH, { artefacto: tipo, registroId: result.id, camposModificados: [] });
    }
    const snapshot = await backend.readSnapshot(PROJECT_PATH);
    res.status(201).json({ createdId: result.id, snapshot });
  } catch (err) {
    console.error(`[server] Error creando registro en ${tipo}:`, err);
    res.status(500).json({ error: `Error creando registro en ${tipo}`, detail: err.message });
  }
});

// Regla de diseño explícita: este skill nunca borra automáticamente.
app.delete('/api/gee/*', (req, res) => {
  res.status(405).json({
    error:
      'Este skill nunca borra automáticamente. Si hay que eliminar un registro, edita el markdown directamente o pide al PM que lo confirme explícitamente por otro canal.',
  });
});

// --- POST /api/dailylog -----------------------------------------------------
// Añade una nota suelta al daily log del día (creando el archivo si hace
// falta) sin pasar por el skill — disponible desde el primer día del
// proyecto, no solo con un sprint activo. Requiere confirm:true igual que el
// resto de escrituras del GEE.
app.post('/api/dailylog', async (req, res) => {
  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, autor, texto } para añadir la nota.' });
  }
  try {
    const { confirm, fecha, ...payload } = req.body;
    const result = await backend.appendDailylog(PROJECT_PATH, fecha || null, payload);
    const snapshot = await backend.readSnapshot(PROJECT_PATH);
    res.status(201).json({ fecha: result.fecha, creado: result.created, snapshot });
  } catch (err) {
    console.error('[server] Error añadiendo nota al daily log:', err);
    res.status(500).json({ error: 'Error añadiendo la nota al daily log', detail: err.message });
  }
});

// --- PUT /api/sprint/hu/:id --------------------------------------------------
app.put('/api/sprint/hu/:id', (req, res) => {
  const { id } = req.params;
  const lockedIds = getLockedHuIds(PROJECT_PATH);

  if (lockedIds.has(id.trim())) {
    return res.status(423).json({
      error:
        'Esta HU está en un sprint activo, no se puede modificar desde el dashboard ni pidiendo permiso — gestiónalo con el equipo técnico directamente',
    });
  }

  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para aplicar el cambio.' });
  }

  // No hay un writer de sprint-backlog implementado (fuera del alcance
  // explícito de este backend: los sprint-backlog activos son intocables, y
  // los que no están activos se gestionan regenerando el artefacto con el
  // prompt correspondiente, no editando filas sueltas desde el dashboard).
  return res.status(501).json({
    error:
      'La edición de HU de sprint no bloqueadas no está implementada en este dashboard. Edita el sprint-backlog-N.md correspondiente directamente o usa los prompts del skill (sprint-planning.md).',
  });
});

// --- POST /api/pdf -----------------------------------------------------------
app.post('/api/pdf', async (req, res) => {
  try {
    const outputPath = await generatePdf(PROJECT_PATH, PORT);
    res.json({ path: outputPath });
  } catch (err) {
    console.error('[server] Error generando PDF:', err);
    res.status(500).json({ error: 'Error generando el PDF', detail: err.message });
  }
});

// --- GET /print --------------------------------------------------------------
app.get('/print', async (req, res) => {
  try {
    const cached = readCacheIfExists() || (await backend.readSnapshot(PROJECT_PATH));
    const html = renderPrintView(cached);
    res.type('html').send(html);
  } catch (err) {
    console.error('[server] Error renderizando /print:', err);
    res.status(500).send(`<pre>Error renderizando la vista de impresión: ${err.message}</pre>`);
  }
});

// --- GET /print/documento -----------------------------------------------
// Vista HTML de solo lectura que renderiza a HTML un .md suelto cualquiera
// del proyecto (no un artefacto que el dashboard sepa parsear como tablas:
// prosa normal, p.ej. un documento de cierre de fase para el cliente).
app.get('/print/documento', (req, res) => {
  const rutaRelativa = req.query.ruta;
  if (!rutaRelativa || typeof rutaRelativa !== 'string') {
    return res.status(400).send('Falta el parámetro "ruta" (ruta relativa al .md dentro del proyecto).');
  }

  let rutaAbsoluta;
  try {
    rutaAbsoluta = resolveRutaDocumento(PROJECT_PATH, rutaRelativa);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  if (!fs.existsSync(rutaAbsoluta) || !fs.statSync(rutaAbsoluta).isFile()) {
    return res.status(404).send(`No se ha encontrado el archivo: ${rutaRelativa}`);
  }

  try {
    const version = req.query.version === 'cliente' ? 'cliente' : 'completa';
    const markdownRaw = fs.readFileSync(rutaAbsoluta, 'utf8');
    const markdown = version === 'cliente' ? stripContenidoInterno(markdownRaw) : markdownRaw;
    const html = renderDocumentoView(markdown, rutaRelativa, version);
    res.type('html').send(html);
  } catch (err) {
    console.error('[server] Error renderizando /print/documento:', err);
    res.status(500).send(`<pre>Error renderizando el documento: ${err.message}</pre>`);
  }
});

// --- GET /api/documento/md -------------------------------------------------
// Descarga el markdown crudo de un documento suelto, completo o en su
// versión cliente (sin los bloques marcados como "interno", ver
// lib/markdownClientStrip.js) — para cuando el destinatario quiere el .md,
// no un PDF.
app.get('/api/documento/md', (req, res) => {
  const rutaRelativa = req.query.ruta;
  if (!rutaRelativa || typeof rutaRelativa !== 'string') {
    return res.status(400).send('Falta el parámetro "ruta" (ruta relativa al .md dentro del proyecto).');
  }

  let rutaAbsoluta;
  try {
    rutaAbsoluta = resolveRutaDocumento(PROJECT_PATH, rutaRelativa);
  } catch (err) {
    return res.status(400).send(err.message);
  }

  if (!fs.existsSync(rutaAbsoluta) || !fs.statSync(rutaAbsoluta).isFile()) {
    return res.status(404).send(`No se ha encontrado el archivo: ${rutaRelativa}`);
  }

  try {
    const version = req.query.version === 'cliente' ? 'cliente' : 'completa';
    const markdownRaw = fs.readFileSync(rutaAbsoluta, 'utf8');
    const markdown = version === 'cliente' ? stripContenidoInterno(markdownRaw) : markdownRaw;
    const nombreBase = path.basename(rutaAbsoluta, '.md');
    const sufijo = version === 'cliente' ? '-cliente' : '';
    res.setHeader('Content-Disposition', `attachment; filename="${nombreBase}${sufijo}.md"`);
    res.type('text/markdown').send(markdown);
  } catch (err) {
    console.error('[server] Error sirviendo /api/documento/md:', err);
    res.status(500).send(`Error leyendo el documento: ${err.message}`);
  }
});

// --- POST /api/pdf/documento ----------------------------------------------
app.post('/api/pdf/documento', async (req, res) => {
  const rutaRelativa = req.body && req.body.ruta;
  if (!rutaRelativa || typeof rutaRelativa !== 'string') {
    return res.status(400).json({ error: 'Falta "ruta" en el body: { "ruta": "<ruta-relativa-al-md>" }' });
  }

  let rutaAbsoluta;
  try {
    rutaAbsoluta = resolveRutaDocumento(PROJECT_PATH, rutaRelativa);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (!fs.existsSync(rutaAbsoluta) || !fs.statSync(rutaAbsoluta).isFile()) {
    return res.status(404).json({ error: `No se ha encontrado el archivo: ${rutaRelativa}` });
  }

  try {
    const version = req.body && req.body.version === 'cliente' ? 'cliente' : 'completa';
    const outputPath = await generatePdfDeDocumento(rutaAbsoluta, rutaRelativa, PORT, version);
    res.json({ path: outputPath });
  } catch (err) {
    console.error('[server] Error generando PDF de documento:', err);
    res.status(500).json({ error: 'Error generando el PDF del documento', detail: err.message });
  }
});

// --- Estáticos -----------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// --- Arranque: puerto preferido con fallback automático si está ocupado ---
function listenOnAvailablePort(preferredPort, maxIntentos = 50) {
  let intento = 0;

  function tryListen(port) {
    const server = app.listen(port);

    server.once('listening', () => {
      console.log(`PM Copilot Dashboard escuchando en http://localhost:${port}`);
      console.log(`Proyecto analizado: ${PROJECT_NAME} (${PROJECT_PATH})`);
      try {
        fs.writeFileSync(PORT_FILE, String(port), 'utf8');
      } catch (err) {
        console.error('[server] No se pudo escribir el archivo .port:', err.message);
      }
    });

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE' && intento < maxIntentos) {
        intento += 1;
        console.warn(`[server] Puerto ${port} ocupado, probando ${port + 1}...`);
        tryListen(port + 1);
      } else {
        console.error('[server] No se pudo arrancar el servidor:', err.message);
        process.exit(1);
      }
    });
  }

  tryListen(preferredPort);
}

listenOnAvailablePort(PORT);
