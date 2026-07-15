'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/registro-dependencias.md';

const FIELD_MAP = {
  equipo: 'Equipo',
  dependencia: 'Dependencia',
  criticidadRag: 'Criticidad RAG',
  estado: 'Estado',
  fechaCompromiso: 'Fecha compromiso',
  riesgosAsociados: 'Riesgos asociados',
  tareaGestionJira: 'Tarea de gestión (Jira)',
  comentarios: 'Comentarios',
  visibilidad: 'Visibilidad',
  motivoDescarte: 'Motivo (descarte/eliminación)',
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
