'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-equipos/equipos.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    nombre: getCell(row, 'Nombre') || '',
    ambito: getCell(row, 'Ámbito') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseEquipos(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['equipos']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/equipos] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseEquipos, REL_PATH };
