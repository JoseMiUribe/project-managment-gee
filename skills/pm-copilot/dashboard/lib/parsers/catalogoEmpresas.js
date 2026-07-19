'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-equipos/catalogo-empresas.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    nombre: getCell(row, 'Nombre') || '',
  };
}

function parseCatalogoEmpresas(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['empresas', 'catálogo de empresas']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/catalogoEmpresas] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseCatalogoEmpresas, REL_PATH };
