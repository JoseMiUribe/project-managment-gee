'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-0/requisitos-nofuncionales.md';

const FIELD_MAP = {
  descripcion: 'Descripción',
  categoria: 'Categoría',
  origen: 'Origen',
  prioridad: 'Prioridad (MoSCoW)',
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
    '# Requisitos No Funcionales',
    '',
    '**Fecha última actualización:** —',
    '**Basado en:** requisitos-funcionales.md + peticiones-cliente.md + inferencia de RNF implícitos',
    '',
    '## Requisitos no funcionales',
    '',
    '| ID | Descripción | Categoría | Origen | Prioridad (MoSCoW) |',
    '|---|---|---|---|---|',
    '',
  ].join('\n');
}

function writeNoFuncional(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['requisitos no funcionales'], id, fields, { idPrefix: 'RNF', plantillaSiNoExiste: plantillaVacia });
}

module.exports = { writeNoFuncional, REL_PATH, FIELD_MAP };
