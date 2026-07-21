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
  // Mismo bug de /$/m que en parseNotas: se resuelve igual, sin depender de
  // que "$" distinga fin-de-texto de fin-de-línea bajo el flag "m".
  const headingMatch = text.match(/^##\s+Actualizaciones GEE\s*$/m);
  if (!headingMatch) return [];
  const afterHeading = text.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIdx = afterHeading.search(/\n##\s/);
  const body = nextHeadingIdx === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIdx);
  const lines = body.split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      items.push(trimmed.replace(/^-\s*/, ''));
    }
  }
  return items;
}

/**
 * "## Notas" es una lista de notas individuales, cada una
 * "- **[YYYY-MM-DD HH:MM] Autor:** texto" (ver prompts/paso-4/daily-log.md),
 * para poder atribuir cada nota a quién la escribió (PM/ADL o el propio
 * skill) y permitir añadir notas sueltas sin regenerar el daily entero.
 *
 * Compatibilidad: dailylogs antiguos (de antes de este formato) tienen la
 * sección como un párrafo de texto libre sin la lista — se devuelven como
 * una única nota con autor y fecha desconocidos en vez de perder el texto.
 */
function parseNotas(text) {
  // OJO: no usar /([\s\S]*?)(?:\n##\s|$)/m para capturar el cuerpo — bajo el
  // flag "m", "$" coincide con el final de CUALQUIER línea, no solo el final
  // del texto, así que la captura perezosa se corta en la primera nota y
  // descarta el resto (mismo bug ya corregido en roadmapCliente.js). En su
  // lugar, localizamos la cabecera y buscamos el siguiente "## " por
  // separado con .search(), que no tiene esa ambigüedad.
  const headingMatch = text.match(/^##\s+Notas\s*$/m);
  if (!headingMatch) return [];
  const afterHeading = text.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIdx = afterHeading.search(/\n##\s/);
  const body = (nextHeadingIdx === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIdx)).trim();
  if (!body) return [];

  const lineRe = /^-\s*\*\*\[([^\]]+)\]\s*([^:]+):\*\*\s*(.*)$/;
  // Sufijo opcional " (relacionado con: R-001, A-002)" al final de la propia
  // línea de la nota (ver writers/dailylog.js#appendDailylogNota) — se separa
  // del texto visible de la nota antes de mostrarla.
  const relacionSufijoRe = /\s*\(relacionado con:\s*([^)]+)\)\s*$/i;
  const lines = body.split(/\r?\n/);
  const notas = [];
  let huboFormatoNuevo = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = trimmed.match(lineRe);
    if (m) {
      huboFormatoNuevo = true;
      let texto = m[3].trim();
      let relacionados = [];
      const relMatch = texto.match(relacionSufijoRe);
      if (relMatch) {
        relacionados = relMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
        texto = texto.slice(0, relMatch.index).trim();
      }
      notas.push({ fechaHora: m[1].trim(), autor: m[2].trim(), texto, relacionados });
    } else if (huboFormatoNuevo && trimmed.startsWith('-')) {
      // continuación improbable de una nota anterior con formato distinto: se ignora en vez de romper el parseo
      continue;
    }
  }

  if (notas.length > 0) return notas;
  // Formato antiguo (texto libre, sin lista) — no se pierde el contenido.
  return [{ fechaHora: '', autor: '', texto: body, relacionados: [] }];
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
