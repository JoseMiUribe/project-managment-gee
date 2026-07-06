'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const { PROJECT_PATH, PROJECT_NAME, PORT, CACHE_FILE, PORT_FILE } = require('./lib/config');
const { buildSnapshot } = require('./lib/buildSnapshot');
const { getLockedHuIds } = require('./lib/sprintLock');
const { generatePdf, generatePdfDeDocumento } = require('./lib/pdf');
const { renderPrintView } = require('./lib/printView');
const { renderDocumentoView, resolveRutaDocumento } = require('./lib/printDocumento');

const { writeRiesgo } = require('./lib/writers/riesgos');
const { writeDependencia } = require('./lib/writers/dependencias');
const { writeAccion } = require('./lib/writers/acciones');
const { writeImpedimento } = require('./lib/writers/impedimentos');
const { writeChangelogEntry } = require('./lib/writers/changelog');

const app = express();
app.use(express.json());

const WRITERS = {
  riesgos: writeRiesgo,
  dependencias: writeDependencia,
  acciones: writeAccion,
  impedimentos: writeImpedimento,
  changelog: writeChangelogEntry,
};

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
app.get('/api/data', (req, res) => {
  const cached = readCacheIfExists();
  if (cached) {
    return res.json(cached);
  }
  try {
    const snapshot = buildSnapshot(PROJECT_PATH);
    res.json(snapshot);
  } catch (err) {
    console.error('[server] Error generando snapshot:', err);
    res.status(500).json({ error: 'Error generando el snapshot del proyecto', detail: err.message });
  }
});

// --- POST /api/sync ---------------------------------------------------------
app.post('/api/sync', (req, res) => {
  try {
    const snapshot = buildSnapshot(PROJECT_PATH);
    res.json(snapshot);
  } catch (err) {
    console.error('[server] Error en /api/sync:', err);
    res.status(500).json({ error: 'Error reparseando el proyecto', detail: err.message });
  }
});

// --- Escritura GEE: PUT/POST /api/gee/:tipo(/:id) ---------------------------
app.put('/api/gee/:tipo/:id', (req, res) => {
  const { tipo, id } = req.params;
  const writer = WRITERS[tipo];
  if (!writer) {
    return res.status(404).json({ error: `Tipo de registro GEE desconocido: "${tipo}". Válidos: ${Object.keys(WRITERS).join(', ')}` });
  }
  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para aplicar el cambio.' });
  }
  try {
    const { confirm, ...fields } = req.body;
    writer(PROJECT_PATH, id, fields);
    const snapshot = buildSnapshot(PROJECT_PATH);
    res.json(snapshot);
  } catch (err) {
    console.error(`[server] Error actualizando ${tipo}/${id}:`, err);
    res.status(500).json({ error: `Error actualizando ${tipo}/${id}`, detail: err.message });
  }
});

app.post('/api/gee/:tipo', (req, res) => {
  const { tipo } = req.params;
  const writer = WRITERS[tipo];
  if (!writer) {
    return res.status(404).json({ error: `Tipo de registro GEE desconocido: "${tipo}". Válidos: ${Object.keys(WRITERS).join(', ')}` });
  }
  if (req.body.confirm !== true) {
    return res.status(400).json({ error: 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para crear el registro.' });
  }
  try {
    const { confirm, ...fields } = req.body;
    const result = writer(PROJECT_PATH, null, fields);
    const snapshot = buildSnapshot(PROJECT_PATH);
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
app.get('/print', (req, res) => {
  try {
    const cached = readCacheIfExists() || buildSnapshot(PROJECT_PATH);
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
    const markdown = fs.readFileSync(rutaAbsoluta, 'utf8');
    const html = renderDocumentoView(markdown, rutaRelativa);
    res.type('html').send(html);
  } catch (err) {
    console.error('[server] Error renderizando /print/documento:', err);
    res.status(500).send(`<pre>Error renderizando el documento: ${err.message}</pre>`);
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
    const outputPath = await generatePdfDeDocumento(rutaAbsoluta, rutaRelativa, PORT);
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
