'use strict';

const fs = require('fs');
const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-transversal/cambios-pendientes-dashboard.md';

function pad(n) {
  return String(n).padStart(2, '0');
}

function nowFechaHora() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function plantillaVacia() {
  return [
    '# Cambios pendientes (dashboard)',
    '',
    '**Propósito:** registro append-only de cada edición hecha directamente desde el dashboard (fuera del flujo normal de prompts del skill). Permite que una sesión futura sepa exactamente qué cambió sin re-escanear todo el proyecto — ver `prompts/transversal/actualizar-cascada.md`, paso 1.',
    '',
    '## Cambios',
    '',
    '| ID | Fecha/Hora | Artefacto | Registro | Campos modificados | Procesado |',
    '|---|---|---|---|---|---|',
    '',
  ].join('\n');
}

/**
 * Registra una edición hecha desde el dashboard. Nunca actualiza una fila
 * existente — cada llamada añade una fila nueva (append-only), incluso si
 * el mismo registro se edita varias veces seguidas: la traza completa de
 * qué cambió y cuándo es más útil para `actualizar-cascada.md` que un
 * resumen colapsado.
 *
 * @param {string} projectPath
 * @param {{artefacto: string, registroId: string, camposModificados: string[]}} datos
 */
function logCambioPendiente(projectPath, datos) {
  const filePath = path.join(projectPath, REL_PATH);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, plantillaVacia(), 'utf8');
  }
  const campos = (datos.camposModificados || []).length ? datos.camposModificados.join(', ') : '(registro nuevo)';
  return upsertRow(
    filePath,
    ['cambios'],
    null,
    {
      'Fecha/Hora': nowFechaHora(),
      Artefacto: datos.artefacto,
      Registro: datos.registroId,
      'Campos modificados': campos,
      Procesado: 'No',
    },
    { idPrefix: 'CD' }
  );
}

module.exports = { logCambioPendiente, REL_PATH };
