'use strict';

const fs = require('fs');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const FILE_NAME = 'registro-riesgos.md';
const REL_PATH = 'output-paso-1/registro-riesgos.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    fechaAlta: getCell(row, 'Fecha alta') || '',
    riesgo: getCell(row, 'Riesgo') || '',
    consecuencia: getCell(row, 'Consecuencia') || '',
    tipo: getCell(row, 'Tipo') || '',
    probabilidad: getCell(row, 'Probabilidad') || '',
    impacto: getCell(row, 'Impacto') || '',
    ambito: getCell(row, 'Ámbito') || '',
    respuesta: getCell(row, 'Respuesta') || '',
    estado: getCell(row, 'Estado') || '',
    coste: getCell(row, 'Coste') || '',
    alcance: getCell(row, 'Alcance') || '',
    plazo: getCell(row, 'Plazo') || '',
    calidad: getCell(row, 'Calidad') || '',
    mitigacion: getCell(row, 'Mitigación') || '',
    responsable: getCell(row, 'Responsable') || '',
    peso: getCell(row, 'Peso') || '',
    rag: getCell(row, 'RAG') || '',
    consideraciones: getCell(row, 'Consideraciones') || '',
    relacionadoCon: getCell(row, 'Relacionado con') || '',
    fechaUpdate: getCell(row, 'Fecha update') || '',
    visibilidad: getCell(row, 'Visibilidad') || '',
    motivoDescarte: getCell(row, 'Motivo (descarte/eliminación)') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

/**
 * @param {string} projectPath
 * @returns {Array<Object>}
 */
function parseRiesgos(projectPath) {
  try {
    const filePath = require('path').join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['riesgos']) || tables[tables.length - 1] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/riesgos] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseRiesgos, FILE_NAME, REL_PATH };
