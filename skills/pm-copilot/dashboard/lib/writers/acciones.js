'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/registro-acciones.md';

const FIELD_MAP = {
  accion: 'Acción',
  tipo: 'Tipo',
  riesgoAsociado: 'Riesgo asociado',
  dependenciaAsociada: 'Dependencia asociada',
  responsable: 'Responsable',
  deadline: 'Deadline',
  estado: 'Estado',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function writeAccion(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['acciones'], id, fields, { idPrefix: 'A' });
}

module.exports = { writeAccion, REL_PATH, FIELD_MAP };
