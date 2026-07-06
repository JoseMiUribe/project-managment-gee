'use strict';

/**
 * Parser genérico de tablas markdown.
 *
 * Recibe el texto completo de un archivo markdown y devuelve un array de
 * tablas encontradas, cada una como:
 *   {
 *     headingContext: "texto del heading más cercano antes de la tabla" | null,
 *     headers: ["Header 1", "Header 2", ...],
 *     rows: [ { "Header 1": "valor", "Header 2": "valor" }, ... ]
 *   }
 *
 * Es tolerante a:
 * - Filas separadoras (---, :--, --:, :-:)
 * - Celdas vacías
 * - Espacios sobrantes (hace trim de cada celda)
 * - Pipes de apertura/cierre opcionales
 */

function isSeparatorRow(cells) {
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-{1,}:?$/.test(c.trim()) || c.trim() === '');
}

function splitRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);

  const cells = [];
  let current = '';
  let escaping = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (escaping) {
      current += ch;
      escaping = false;
      continue;
    }
    if (ch === '\\') {
      escaping = true;
      current += ch;
      continue;
    }
    if (ch === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

function looksLikeTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  return true;
}

/**
 * @param {string} text Contenido completo del archivo markdown
 * @returns {Array<{headingContext: string|null, headers: string[], rows: Object[]}>}
 */
function parseMarkdownTables(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split(/\r?\n/);
  const tables = [];
  let lastHeading = null;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      lastHeading = headingMatch[2].trim();
      i++;
      continue;
    }

    if (looksLikeTableRow(line)) {
      // Candidate header row: next non-empty line must be a separator row.
      const headerCells = splitRow(line);
      const nextLine = lines[i + 1];
      if (nextLine !== undefined && looksLikeTableRow(nextLine) && isSeparatorRow(splitRow(nextLine))) {
        const headers = headerCells.map((h) => h.trim());
        const rows = [];
        let j = i + 2;
        while (j < lines.length && looksLikeTableRow(lines[j])) {
          const cells = splitRow(lines[j]);
          if (isSeparatorRow(cells)) {
            j++;
            continue;
          }
          const row = {};
          headers.forEach((h, idx) => {
            row[h] = cells[idx] !== undefined ? cells[idx].trim() : '';
          });
          rows.push(row);
          j++;
        }
        tables.push({
          headingContext: lastHeading,
          headers,
          rows,
        });
        i = j;
        continue;
      }
    }

    i++;
  }

  return tables;
}

/**
 * Busca la primera tabla cuyo headingContext contenga (case-insensitive) alguno
 * de los textos candidatos. Si no hay ningún heading que coincida, y solo hay
 * una tabla "de datos" (heurística: más de 0 filas o headers > 1), la devuelve
 * como fallback.
 *
 * @param {Array} tables resultado de parseMarkdownTables
 * @param {string[]} headingCandidates textos a buscar en el heading (case-insensitive)
 * @returns {{headingContext: string|null, headers: string[], rows: Object[]}|null}
 */
function findTableByHeading(tables, headingCandidates) {
  if (!tables || tables.length === 0) return null;
  const lowerCandidates = headingCandidates.map((c) => c.toLowerCase());

  for (const table of tables) {
    if (!table.headingContext) continue;
    const heading = table.headingContext.toLowerCase();
    if (lowerCandidates.some((c) => heading.includes(c))) {
      return table;
    }
  }

  return null;
}

/**
 * Devuelve el valor de una fila buscando el header de forma case-insensitive
 * y tolerante a espacios.
 */
function getCell(row, headerName) {
  if (!row) return undefined;
  const target = headerName.trim().toLowerCase();
  for (const key of Object.keys(row)) {
    if (key.trim().toLowerCase() === target) {
      return row[key];
    }
  }
  return undefined;
}

module.exports = {
  parseMarkdownTables,
  findTableByHeading,
  getCell,
};
