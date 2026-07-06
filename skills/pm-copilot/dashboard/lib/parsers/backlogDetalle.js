'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, getCell } = require('../markdownTable');
const { splitByHeading, parseKeyValueBlock, getValue } = require('../keyValueBlock');

const REL_PATH = 'output-paso-2/backlog-detalle.md';

/**
 * backlog-detalle.md (ver prompts/paso-2/generar-backlog-detalle.md) tiene
 * tres secciones de nivel ## (Inmediata / Cercana / Lejana) con HU en
 * distinto nivel de detalle:
 *  - Inmediata: HU con ficha completa (formato similar a fichas de épicas,
 *    heading "### HU-XXX" + **Campo:** valor + Dado/Cuando/Entonces en texto libre)
 *  - Cercana: HU con título+descripción breve, puede venir en heading o en
 *    tabla simple
 *  - Lejana: solo placeholders, normalmente una lista con viñetas
 *
 * No hay una tabla fija garantizada, así que parseamos de forma best-effort:
 * 1. Buscamos primero fichas "### HU-XXX ..." dentro de la sección.
 * 2. Si no hay fichas, buscamos una tabla con columna HU.
 * 3. Si no hay tabla, buscamos líneas de lista "- HU-XXX: ..." (placeholders
 *    de la franja Lejana).
 */

function extractSection(text, sectionNameRegex) {
  const re = new RegExp(`^##\\s+.*${sectionNameRegex}[^\\n]*$`, 'im');
  const match = text.match(re);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  return nextHeading >= 0 ? rest.slice(0, nextHeading) : rest;
}

function parseFichas(sectionText) {
  const blocks = splitByHeading(sectionText, /^###\s+(HU-\d+[^\n]*)$/m);
  return blocks.map(({ title, body }) => {
    const kv = parseKeyValueBlock(body);
    const idMatch = title.match(/HU-\d+/i);
    return {
      id: idMatch ? idMatch[0].toUpperCase() : '',
      titulo: title.replace(/HU-\d+\s*[—:-]?\s*/i, '').trim(),
      epica: getValue(kv, 'Épica de origen') || getValue(kv, 'Epica de origen') || '',
      descripcion: '',
      criterios: body.trim(),
    };
  }).filter((h) => h.id);
}

function parseTablas(sectionText) {
  const tables = parseMarkdownTables(sectionText);
  const results = [];
  for (const table of tables) {
    const hasHuCol = table.headers.some((h) => h.trim().toLowerCase() === 'hu');
    if (!hasHuCol) continue;
    for (const row of table.rows) {
      const id = (getCell(row, 'HU') || '').trim();
      if (!id) continue;
      results.push({
        id,
        titulo: getCell(row, 'Título') || '',
        epica: getCell(row, 'Épica') || getCell(row, 'Epica') || '',
        descripcion: getCell(row, 'Descripción') || '',
        criterios: getCell(row, 'Criterio de aceptación') || '',
      });
    }
  }
  return results;
}

function parseListaPlaceholders(sectionText) {
  const lines = sectionText.split(/\r?\n/);
  const results = [];
  for (const line of lines) {
    const match = line.match(/^\s*[-*]\s*(HU-\d+)?\s*:?\s*(.*)$/i);
    if (match && (match[1] || /HU-\d+/i.test(line))) {
      const idMatch = line.match(/HU-\d+/i);
      results.push({
        id: idMatch ? idMatch[0].toUpperCase() : '',
        titulo: match[2] ? match[2].trim() : line.trim(),
        epica: '',
        descripcion: '',
        criterios: '',
      });
    }
  }
  return results.filter((h) => h.titulo || h.id);
}

function parseSection(sectionText) {
  if (!sectionText || !sectionText.trim()) return [];
  const fichas = parseFichas(sectionText);
  if (fichas.length > 0) return fichas;
  const tablas = parseTablas(sectionText);
  if (tablas.length > 0) return tablas;
  return parseListaPlaceholders(sectionText);
}

function parseBacklogDetalle(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return null;
    const text = fs.readFileSync(filePath, 'utf8');

    return {
      inmediata: parseSection(extractSection(text, 'Inmediata')),
      cercana: parseSection(extractSection(text, 'Cercana')),
      lejana: parseSection(extractSection(text, 'Lejana')),
    };
  } catch (err) {
    console.error(`[parsers/backlogDetalle] Error parseando ${REL_PATH}:`, err.message);
    return null;
  }
}

module.exports = { parseBacklogDetalle, REL_PATH };
