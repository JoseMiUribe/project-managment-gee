'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/changelog.md';

const FIELD_MAP = {
  titulo: 'Título',
  descripcion: 'Descripción',
  impacto: 'Impacto',
  coste: 'Coste',
  alcance: 'Alcance',
  plazo: 'Plazo',
  calidad: 'Calidad',
  decision: 'Decisión',
  comentarios: 'Comentarios',
  riesgosGenerados: 'Riesgos generados',
  dependenciasGeneradas: 'Dependencias generadas',
  accionesGeneradas: 'Acciones generadas',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function writeChangelogEntry(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['cambios de alcance', 'changelog'], id, fields, { idPrefix: 'SC' });
}

module.exports = { writeChangelogEntry, REL_PATH, FIELD_MAP };
