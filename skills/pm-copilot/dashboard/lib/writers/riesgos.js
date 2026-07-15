'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-1/registro-riesgos.md';

const FIELD_MAP = {
  fechaAlta: 'Fecha alta',
  riesgo: 'Riesgo',
  consecuencia: 'Consecuencia',
  tipo: 'Tipo',
  probabilidad: 'Probabilidad',
  impacto: 'Impacto',
  ambito: 'Ámbito',
  respuesta: 'Respuesta',
  estado: 'Estado',
  coste: 'Coste',
  alcance: 'Alcance',
  plazo: 'Plazo',
  calidad: 'Calidad',
  mitigacion: 'Mitigación',
  responsable: 'Responsable',
  peso: 'Peso',
  rag: 'RAG',
  consideraciones: 'Consideraciones',
  relacionadoCon: 'Relacionado con',
  fechaUpdate: 'Fecha update',
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

/**
 * @param {string} projectPath
 * @param {string|null} id ID a actualizar (ej. "R-003"), o null para crear
 * @param {Object} payload campos en camelCase (ver FIELD_MAP)
 */
function writeRiesgo(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['riesgos'], id, fields, { idPrefix: 'R' });
}

module.exports = { writeRiesgo, REL_PATH, FIELD_MAP };
