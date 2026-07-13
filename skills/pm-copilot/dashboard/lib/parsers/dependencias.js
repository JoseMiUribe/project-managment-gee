'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_PATH = 'output-paso-1/registro-dependencias.md';

function mapRow(row) {
  const sistema1 = getCell(row, 'Sistema 1') || '';
  const sistema2 = getCell(row, 'Sistema 2') || '';
  const sistema3 = getCell(row, 'Sistema 3') || '';
  // Campo derivado de solo lectura para el dashboard (columna "Sistemas"):
  // combina sistema1/2/3 en un único texto legible. No sustituye a los
  // campos individuales (se mantienen para quien los necesite por separado),
  // y no se escribe de vuelta — editar sistemas por separado se hace tocando
  // el markdown o los campos sistema1/2/3 si en el futuro se exponen sueltos.
  const sistemas = [sistema1, sistema2, sistema3].filter((s) => s && s !== '—').join(', ');
  return {
    id: getCell(row, 'ID') || '',
    equipo: getCell(row, 'Equipo') || '',
    dependencia: getCell(row, 'Dependencia') || '',
    criticidadRag: getCell(row, 'Criticidad RAG') || '',
    sistema1,
    sistema2,
    sistema3,
    sistemas,
    estado: getCell(row, 'Estado') || '',
    fechaCompromiso: getCell(row, 'Fecha compromiso') || '',
    riesgosAsociados: getCell(row, 'Riesgos asociados') || '',
    tareaGestionJira: getCell(row, 'Tarea de gestión (Jira)') || '',
    comentarios: getCell(row, 'Comentarios') || '',
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
