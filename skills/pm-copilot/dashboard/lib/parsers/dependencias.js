'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-paso-1/registro-dependencias.md';

function mapRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    equipo: getCell(row, 'Equipo') || '',
    dependencia: getCell(row, 'Dependencia') || '',
    criticidadRag: getCell(row, 'Criticidad RAG') || '',
    estado: getCell(row, 'Estado') || '',
    fechaCompromiso: getCell(row, 'Fecha compromiso') || '',
    riesgosAsociados: getCell(row, 'Riesgos asociados') || '',
    tareaGestionJira: getCell(row, 'Tarea de gestión (Jira)') || '',
    comentarios: getCell(row, 'Comentarios') || '',
    visibilidad: getCell(row, 'Visibilidad') || '',
    motivoDescarte: getCell(row, 'Motivo (descarte/eliminación)') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseDependencias(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);
    const table = findTableByHeading(tables, ['dependencias']) || tables[0] || null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapRow);
  } catch (err) {
    console.error(`[parsers/dependencias] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseDependencias, REL_PATH };
