'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-equipos/ausencias.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    personaId: getCell(row, 'Persona') || '',
    fechaInicio: getCell(row, 'Fecha inicio') || '',
    fechaFin: getCell(row, 'Fecha fin') || '',
    motivo: getCell(row, 'Motivo') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseAusencias(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['ausencias']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/ausencias] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseAusencias, REL_PATH };
