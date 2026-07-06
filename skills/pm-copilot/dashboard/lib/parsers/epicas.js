'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, getCell } = require('../markdownTable');
const { splitByHeading, parseKeyValueBlock, getValue } = require('../keyValueBlock');

const REL_PATH = 'output-paso-2/epicas.md';

/**
 * epicas.md, según el output esperado en prompts/paso-2/generar-epicas.md,
 * se estructura normalmente como tablas por sección (MVP / Condicional / Fase 2):
 *   | ID | Épica | Objetivo | Requisitos incluidos | Dependencias | Riesgos asociados | Prioridad |
 * pero puede venir también como fichas "### EP-XXX — Nombre" con líneas
 * **Campo:** valor. Soportamos ambos formatos.
 */

function mapTableRow(row, fase) {
  return {
    id: getCell(row, 'ID') || '',
    nombre: getCell(row, 'Épica') || getCell(row, 'Nombre') || '',
    objetivo: getCell(row, 'Objetivo') || '',
    requisitos: getCell(row, 'Requisitos incluidos') || '',
    dependencias: getCell(row, 'Dependencias') || '',
    decisionPendiente: getCell(row, 'Decisión pendiente') || '',
    riesgosAsociados: getCell(row, 'Riesgos asociados') || '',
    prioridad: getCell(row, 'Prioridad') || '',
    notas: getCell(row, 'Notas') || '',
    fase,
  };
}

function sectionFaseFromHeading(heading) {
  if (!heading) return null;
  const h = heading.toLowerCase();
  // Importante: comprobar "fase 2"/"post-mvp" ANTES que "mvp" a secas, porque
  // "Fase 2 (Post-MVP)" también contiene la subcadena "mvp".
  if (h.includes('fase 2') || h.includes('post-mvp')) return 'Fase 2';
  if (h.includes('condicional')) return 'Condicional';
  if (h.includes('mvp')) return 'MVP';
  return null;
}

function parseAsTables(text) {
  const tables = parseMarkdownTables(text);
  const epicas = [];
  for (const table of tables) {
    const fase = sectionFaseFromHeading(table.headingContext);
    const hasIdCol = table.headers.some((h) => h.trim().toLowerCase() === 'id');
    if (!hasIdCol) continue;
    for (const row of table.rows) {
      const id = (getCell(row, 'ID') || '').trim();
      if (!id || !/^EP-/i.test(id)) continue;
      epicas.push(mapTableRow(row, fase));
    }
  }
  return epicas;
}

function parseAsFichas(text) {
  const blocks = splitByHeading(text, /^###\s+(EP-\d+[^\n]*)$/m);
  return blocks.map(({ title, body }) => {
    const kv = parseKeyValueBlock(body);
    const idMatch = title.match(/EP-\d+/i);
    const nombreMatch = title.match(/EP-\d+\s*[—-]\s*(.*)$/);
    return {
      id: idMatch ? idMatch[0].toUpperCase() : '',
      nombre: nombreMatch ? nombreMatch[1].trim() : (getValue(kv, 'Nombre') || ''),
      objetivo: getValue(kv, 'Objetivo') || '',
      requisitos: getValue(kv, 'Requisitos que incluye') || getValue(kv, 'Requisitos incluidos') || '',
      dependencias: getValue(kv, 'Dependencias con otras épicas') || getValue(kv, 'Dependencias') || '',
      decisionPendiente: getValue(kv, 'Decisión pendiente') || '',
      riesgosAsociados: getValue(kv, 'Riesgos GEE asociados') || getValue(kv, 'Riesgos asociados') || '',
      prioridad: getValue(kv, 'Prioridad') || '',
      notas: '',
      fase: getValue(kv, 'Fase sugerida') || null,
    };
  }).filter((e) => e.id);
}

function parseEpicas(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');

    const tableResults = parseAsTables(text);
    if (tableResults.length > 0) return tableResults;

    return parseAsFichas(text);
  } catch (err) {
    console.error(`[parsers/epicas] Error parseando ${REL_PATH}:`, err.message);
    return [];
  }
}

module.exports = { parseEpicas, REL_PATH };
