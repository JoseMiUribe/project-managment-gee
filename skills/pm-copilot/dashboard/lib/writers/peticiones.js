'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-0/peticiones-cliente.md';

const FIELD_MAP = {
  peticion: 'Petición',
  loDijoElCliente: 'Lo dijo el cliente',
  prioridadSubjetiva: 'Prioridad subjetiva',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function plantillaVacia() {
  return [
    '# Peticiones del Cliente (en bruto)',
    '',
    '**Fecha última actualización:** —',
    '',
    '## Peticiones del cliente',
    '',
    '| ID | Petición | Lo dijo el cliente | Prioridad subjetiva |',
    '|---|---|---|---|',
    '',
    '## Notas adicionales',
    '',
  ].join('\n');
}

function writePeticion(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['peticiones del cliente', 'peticiones'], id, fields, { idPrefix: 'PC', plantillaSiNoExiste: plantillaVacia });
}

module.exports = { writePeticion, REL_PATH, FIELD_MAP };
