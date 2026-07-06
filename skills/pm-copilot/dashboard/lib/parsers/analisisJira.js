'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const OUTPUT_PASO_3_DIR = 'output-paso-3';
const FILE_RE = /^analisis-jira-(\d{4}-\d{2}-\d{2})\.md$/i;

/**
 * Formato (ver prompts/paso-3/analizar-jira.md), best-effort:
 * 1. Resumen ejecutivo (2-3 frases)
 * 2. Tabla de estado por HU/tarea (planificado vs. real)
 * 3. Bloqueos y estancamientos
 * 4. Velocidad real vs. capacidad estimada
 * 5. Propuestas de actualización al GEE
 *
 * No hay estructura de headings fija garantizada en el prompt, así que
 * buscamos por palabras clave tolerantes en los headings.
 */

function extractSectionByKeyword(text, keywordRegex) {
  const re = new RegExp(`^#{1,3}\\s*.*${keywordRegex}.*$`, 'im');
  const match = text.match(re);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/^#{1,3}\s+/m);
  return nextHeading >= 0 ? rest.slice(0, nextHeading) : rest;
}

function parseSingleAnalisis(filePath, fecha) {
  const text = fs.readFileSync(filePath, 'utf8');
  const tables = parseMarkdownTables(text);

  const resumenSection = extractSectionByKeyword(text, 'Resumen ejecutivo');
  const estadoTable = findTableByHeading(tables, ['estado por hu', 'tabla de estado', 'planificado vs']) || tables[0] || null;

  return {
    fecha,
    resumenEjecutivo: resumenSection.trim(),
    tablaEstado: estadoTable
      ? estadoTable.rows.map((row) => {
          const obj = {};
          for (const key of Object.keys(row)) obj[key] = row[key];
          return obj;
        })
      : [],
    archivo: filePath,
  };
}

/**
 * @param {string} projectPath
 * @returns {Array<Object>} ordenados por fecha descendente. Si no existe
 *   ningún archivo analisis-jira-*.md, devuelve [] (no es un error).
 */
function parseAnalisisJira(projectPath) {
  try {
    const dir = path.join(projectPath, OUTPUT_PASO_3_DIR);
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile());

    const analisis = [];
    for (const entry of entries) {
      const match = entry.name.match(FILE_RE);
      if (!match) continue;
      try {
        analisis.push(parseSingleAnalisis(path.join(dir, entry.name), match[1]));
      } catch (err) {
        console.error(`[parsers/analisisJira] Error parseando ${entry.name}:`, err.message);
      }
    }

    analisis.sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
    return analisis;
  } catch (err) {
    console.error('[parsers/analisisJira] Error listando análisis de Jira:', err.message);
    return [];
  }
}

module.exports = { parseAnalisisJira, OUTPUT_PASO_3_DIR };
