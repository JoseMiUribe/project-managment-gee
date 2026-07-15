'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-paso-1/changelog.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    titulo: getCell(row, 'Título') || '',
    descripcion: getCell(row, 'Descripción') || '',
    impacto: getCell(row, 'Impacto') || '',
    coste: getCell(row, 'Coste') || '',
    alcance: getCell(row, 'Alcance') || '',
    plazo: getCell(row, 'Plazo') || '',
    calidad: getCell(row, 'Calidad') || '',
    decision: getCell(row, 'Decisión') || '',
    comentarios: getCell(row, 'Comentarios') || '',
    riesgosGenerados: getCell(row, 'Riesgos generados') || '',
    dependenciasGeneradas: getCell(row, 'Dependencias generadas') || '',
    accionesGeneradas: getCell(row, 'Acciones generadas') || '',
    visibilidad: getCell(row, 'Visibilidad') || '',
    motivoDescarte: getCell(row, 'Motivo (descarte/eliminación)') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseChangelog(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['cambios de alcance', 'changelog']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/changelog] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseChangelog, REL_PATH };
