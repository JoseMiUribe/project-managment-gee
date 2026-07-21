'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-equipos/personas.md';

function esSi(valor) {
  return /^s[ií]$/i.test((valor || '').trim());
}

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    nombre: getCell(row, 'Nombre') || '',
    equipoId: getCell(row, 'Equipo') || '',
    empresa: getCell(row, 'Empresa') || '',
    rol: getCell(row, 'Rol') || '',
    emailCorporativo: getCell(row, 'Email corporativo') || '',
    dedicacionPct: getCell(row, 'Dedicación (%)') || '',
    esGestor: esSi(getCell(row, 'Equipo de gestión')),
    activo: getCell(row, 'Activo') === '' ? true : esSi(getCell(row, 'Activo')),
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parsePersonas(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['personas', 'miembros del equipo']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/personas] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parsePersonas, REL_PATH };
