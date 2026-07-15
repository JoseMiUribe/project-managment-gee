'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-transversal/cambios-pendientes-dashboard.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    fechaHora: getCell(row, 'Fecha/Hora') || '',
    artefacto: getCell(row, 'Artefacto') || '',
    registroId: getCell(row, 'Registro') || '',
    camposModificados: getCell(row, 'Campos modificados') || '',
    procesado: getCell(row, 'Procesado') || '',
  };
}

/**
 * @param {string} projectPath
 * @returns {{ items: Array<Object>, pendientesCount: number }}
 */
function parseCambiosPendientes(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return { items: [], pendientesCount: 0 };
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['cambios']) || tables[0] || null;
    if (!table) return { items: [], pendientesCount: 0 };
    const items = table.rows.filter((r) => (getCell(r, 'ID') || '').trim() !== '').map(mapRow);
    const pendientesCount = items.filter((c) => c.procesado.trim().toLowerCase() !== 'sí' && c.procesado.trim().toLowerCase() !== 'si').length;
    return { items, pendientesCount };
  } catch (err) {
    console.error(`[parsers/cambiosPendientes] Error parseando ${REL_PATH}:`, err.message);
    return { items: [], pendientesCount: 0 };
  }
}

module.exports = { parseCambiosPendientes, REL_PATH };
