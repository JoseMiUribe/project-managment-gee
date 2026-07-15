'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-paso-1/registro-acciones.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    accion: getCell(row, 'Acción') || '',
    tipo: getCell(row, 'Tipo') || '',
    riesgoAsociado: getCell(row, 'Riesgo asociado') || '',
    dependenciaAsociada: getCell(row, 'Dependencia asociada') || '',
    responsable: getCell(row, 'Responsable') || '',
    deadline: getCell(row, 'Deadline') || '',
    estado: getCell(row, 'Estado') || '',
    visibilidad: getCell(row, 'Visibilidad') || '',
    motivoDescarte: getCell(row, 'Motivo (descarte/eliminación)') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseAcciones(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['acciones']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/acciones] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseAcciones, REL_PATH };
