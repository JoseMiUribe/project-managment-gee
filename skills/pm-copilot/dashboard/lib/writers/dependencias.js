'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/registro-dependencias.md';

const FIELD_MAP = {
  equipo: 'Equipo',
  dependencia: 'Dependencia',
  criticidadRag: 'Criticidad RAG',
  sistema1: 'Sistema 1',
  sistema2: 'Sistema 2',
  sistema3: 'Sistema 3',
  estado: 'Estado',
  fechaCompromiso: 'Fecha compromiso',
  riesgosAsociados: 'Riesgos asociados',
  comentarios: 'Comentarios',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function writeDependencia(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['dependencias'], id, fields, { idPrefix: 'DP' });
}

module.exports = { writeDependencia, REL_PATH, FIELD_MAP };
