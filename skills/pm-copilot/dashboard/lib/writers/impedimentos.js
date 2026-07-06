'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/registro-impedimentos.md';

const FIELD_MAP = {
  impedimento: 'Impedimento',
  criticidad: 'Criticidad',
  fechaInicio: 'Fecha inicio',
  fechaFin: 'Fecha fin',
  responsable: 'Responsable',
  riesgoOrigen: 'Riesgo origen',
  dependenciaOrigen: 'Dependencia origen',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function writeImpedimento(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['impedimentos'], id, fields, { idPrefix: 'IM' });
}

module.exports = { writeImpedimento, REL_PATH, FIELD_MAP };
