'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const DAILYLOG_DIR = path.join('output-paso-4', 'dailylog');
const FILE_RE = /^(\d{4}-\d{2}-\d{2})\.md$/;

/**
 * Formato de daily log (ver prompts/paso-4/daily-log.md):
 *
 * # Daily — [YYYY-MM-DD]
 * **Sprint X | Día X de X**
 * ## Progreso
 * | HU | Estado | Lo que se hizo | Lo que se hará | Bloqueos |
 * ## Actualizaciones GEE
 * - **Nuevo impedimento IM-001**: ...
 * ## Notas
 * [texto libre]
 */

function parseProgresoRow(row) {
  return {
    hu: getCell(row, 'HU') || '',
    estado: getCell(row, 'Estado') || '',
    loQueSeHizo: getCell(row, 'Lo que se hizo') || '',
    loQueSeHara: getCell(row, 'Lo que se hará') || '',
    bloqueos: getCell(row, 'Bloqueos') || '',
  };
}

function parseActualizacionesGee(text) {
  const match = text.match(/^##\s+Actualizaciones GEE\s*\n+([\s\S]*?)(?:\n##\s|$)/m);
  if (!match) return [];
  const lines = match[1].split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      items.push(trimmed.replace(/^-\s*/, ''));
    }
  }
  return items;
}

function parseNotas(text) {
  const match = text.match(/^##\s+Notas\s*\n+([\s\S]*?)(?:\n##\s|$)/m);
  return match ? match[1].trim() : '';
}

function parseSprintDia(text) {
  const match = text.match(/\*\*Sprint\s*([^\|]*)\|\s*D[ií]a\s*([^\*]*)\*\*/i);
  if (!match) return { sprint: '', dia: '' };
  return { sprint: match[1].trim(), dia: match[2].trim() };
}

/**
 * "**Puntos restantes del sprint:** X pts (de Y pts comprometidos...)" —
 * alimenta el burndown real de la pestaña Sprint actual. Devuelve solo el
 * número (string vacío si no está presente, un daily antiguo o sin rellenar
 * no debe romper el resto del parseo).
 */
function parsePuntosRestantes(text) {
  const match = text.match(/\*\*Puntos restantes del sprint:?\*\*\s*(-?\d+(?:[.,]\d+)?)/i);
  return match ? match[1].replace(',', '.') : '';
}

function parseSingleDailylog(filePath, fecha) {
  const text = fs.readFileSync(filePath, 'utf8');
  const tables = parseMarkdownTables(text);
  const progresoTable = findTableByHeading(tables, ['progreso']);

  const { sprint, dia } = parseSprintDia(text);

  return {
    fecha,
    sprint,
    dia,
    puntosRestantes: parsePuntosRestantes(text),
    progreso: progresoTable
      ? progresoTable.rows.filter((r) => (getCell(r, 'HU') || '').trim() !== '').map(parseProgresoRow)
      : [],
    actualizacionesGee: parseActualizacionesGee(text),
    notas: parseNotas(text),
    archivo: filePath,
  };
}

/**
 * @param {string} projectPath
 * @returns {Array<Object>} ordenados por fecha descendente
 */
function parseDailylogs(projectPath) {
  try {
    const dir = path.join(projectPath, DAILYLOG_DIR);
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile());

    const logs = [];
    for (const entry of entries) {
      const match = entry.name.match(FILE_RE);
      if (!match) continue;
      try {
        logs.push(parseSingleDailylog(path.join(dir, entry.name), match[1]));
      } catch (err) {
        console.error(`[parsers/dailylog] Error parseando ${entry.name}:`, err.message);
      }
    }

    logs.sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
    return logs;
  } catch (err) {
    console.error('[parsers/dailylog] Error listando dailylogs:', err.message);
    return [];
  }
}

module.exports = { parseDailylogs, DAILYLOG_DIR };
