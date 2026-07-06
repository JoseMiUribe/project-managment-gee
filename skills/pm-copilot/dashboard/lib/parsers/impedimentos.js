'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-paso-1/registro-impedimentos.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    impedimento: getCell(row, 'Impedimento') || '',
    criticidad: getCell(row, 'Criticidad') || '',
    fechaInicio: getCell(row, 'Fecha inicio') || '',
    fechaFin: getCell(row, 'Fecha fin') || '',
    responsable: getCell(row, 'Responsable') || '',
    riesgoOrigen: getCell(row, 'Riesgo origen') || '',
    dependenciaOrigen: getCell(row, 'Dependencia origen') || '',
  };
}

function parseImpedimentos(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['impedimentos']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/impedimentos] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseImpedimentos, REL_PATH };
