'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Helper genérico para escritura de filas en tablas markdown, compartido por
 * todos los writers de lib/writers/*.js.
 *
 * Estrategia: en vez de reconstruir el archivo a partir del AST parseado (lo
 * que arriesgaría perder formato/comentarios), operamos línea a línea sobre
 * el texto original:
 *  1. Localizamos el bloque de la tabla de datos por su heading (mismo
 *     criterio que el parser: buscamos el heading indicado y la tabla que
 *     viene inmediatamente después).
 *  2. Localizamos la fila por ID (columna "ID", primera columna) o añadimos
 *     una fila nueva al final del bloque de tabla.
 *  3. Actualizamos solo las celdas presentes en el payload de campos.
 *  4. Actualizamos la línea "**Fecha última actualización:** ..." de la
 *     cabecera del archivo.
 *  5. Escribimos el archivo de vuelta preservando el resto intacto.
 */

function splitRowCells(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

function buildRowLine(cells) {
  return `| ${cells.join(' | ')} |`;
}

function isSeparatorLine(line) {
  const cells = splitRowCells(line);
  return cells.length > 0 && cells.every((c) => /^:?-{1,}:?$/.test(c.trim()) || c.trim() === '');
}

/**
 * Encuentra el rango [headerLineIdx, lastRowLineIdx] de la tabla que sigue a
 * alguno de los headings indicados (heading buscado por substring
 * case-insensitive).
 *
 * Un documento puede tener varios headings que matcheen el mismo candidato
 * (ej. el propio título H1 "# Registro de Riesgos" contiene "riesgos", igual
 * que el heading real de la tabla "## Riesgos"). Por eso probamos TODOS los
 * headings que matchean, en orden, y nos quedamos con el primero que tenga
 * una tabla inmediatamente debajo (antes del siguiente heading) — igual que
 * hace `findTableByHeading` en markdownTable.js sobre las tablas ya parseadas.
 */
function findTableBlock(lines, headingCandidates) {
  const lowerCandidates = headingCandidates.map((c) => c.toLowerCase());
  const matchingHeadingIdxs = [];

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const headingText = headingMatch[2].trim().toLowerCase();
      if (lowerCandidates.some((c) => headingText.includes(c))) {
        matchingHeadingIdxs.push(i);
      }
    }
  }

  for (const headingLineIdx of matchingHeadingIdxs) {
    for (let i = headingLineIdx + 1; i < lines.length; i++) {
      if (lines[i].match(/^#{1,6}\s+/)) break; // siguiente heading, no hay tabla en este bloque
      if (lines[i].includes('|') && lines[i + 1] && isSeparatorLine(lines[i + 1])) {
        return locateFromHeaderLine(lines, i);
      }
    }
  }

  // Fallback: primera tabla del documento
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('|') && lines[i + 1] && isSeparatorLine(lines[i + 1])) {
      return locateFromHeaderLine(lines, i);
    }
  }

  return null;
}

function locateFromHeaderLine(lines, headerLineIdx) {
  const headers = splitRowCells(lines[headerLineIdx]);
  let lastRowIdx = headerLineIdx + 1; // separator line
  let j = headerLineIdx + 2;
  while (j < lines.length && lines[j].includes('|') && lines[j].trim() !== '') {
    lastRowIdx = j;
    j++;
  }
  return { headerLineIdx, separatorLineIdx: headerLineIdx + 1, lastRowLineIdx: lastRowIdx, headers };
}

/**
 * Actualiza la línea "**Fecha última actualización:** ..." si existe.
 */
function updateFechaActualizacion(lines, fechaISO) {
  for (let i = 0; i < lines.length; i++) {
    if (/\*\*Fecha última actualización:?\*\*/i.test(lines[i])) {
      lines[i] = lines[i].replace(/(\*\*Fecha última actualización:?\*\*\s*)(.*)$/i, `$1${fechaISO}`);
      return true;
    }
  }
  return false;
}

/**
 * @param {string} filePath
 * @param {string[]} headingCandidates headings donde buscar la tabla (ej. ['riesgos'])
 * @param {string|null} id ID a actualizar, o null para crear una fila nueva
 * @param {Object} fields payload de campos { "Nombre de columna": "valor" } (nombres EXACTOS de columna del markdown)
 * @param {Object} [options]
 * @param {string} [options.idPrefix] prefijo del ID (ej. "R") usado para generar el siguiente correlativo si id es null
 * @param {number} [options.idPadding] longitud del número correlativo (por defecto 3)
 * @param {() => string} [options.plantillaSiNoExiste] si el archivo no existe todavía (ej. un proyecto que
 *   arranca el Paso 0 dando de alta su primera petición directamente desde el dashboard, antes de que el
 *   prompt genere el archivo), se crea con este contenido antes de insertar la fila. Sin esto, dar de alta
 *   el primer registro de un archivo inexistente falla con ENOENT.
 * @returns {{ id: string, created: boolean }}
 */
function upsertRow(filePath, headingCandidates, id, fields, options = {}) {
  const idPadding = options.idPadding || 3;
  if (!fs.existsSync(filePath) && options.plantillaSiNoExiste) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, options.plantillaSiNoExiste(), 'utf8');
  }
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);

  const block = findTableBlock(lines, headingCandidates);
  if (!block) {
    throw new Error(`No se ha encontrado la tabla de datos en ${filePath} (headings buscados: ${headingCandidates.join(', ')})`);
  }

  const { headerLineIdx, lastRowLineIdx, headers } = block;
  const idColIdx = headers.findIndex((h) => h.trim().toLowerCase() === 'id');
  if (idColIdx === -1) {
    throw new Error(`La tabla en ${filePath} no tiene columna "ID"`);
  }

  let targetId = id;
  let created = false;

  if (!targetId) {
    // Generar siguiente correlativo
    let maxNum = 0;
    for (let i = headerLineIdx + 2; i <= lastRowLineIdx; i++) {
      if (isSeparatorLine(lines[i])) continue;
      const cells = splitRowCells(lines[i]);
      const cellId = (cells[idColIdx] || '').trim();
      const match = cellId.match(/-(\d+)$/);
      if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
    const nextNum = maxNum + 1;
    const prefix = options.idPrefix || (headers[idColIdx] || 'ID');
    targetId = `${prefix}-${String(nextNum).padStart(idPadding, '0')}`;
    created = true;
  }

  // Construye la fila de celdas completa (usa fields por nombre de columna;
  // si falta alguna columna en fields, se deja vacía en creación o se
  // preserva el valor existente en actualización).
  let rowLineIdx = -1;
  for (let i = headerLineIdx + 2; i <= lastRowLineIdx; i++) {
    if (isSeparatorLine(lines[i])) continue;
    const cells = splitRowCells(lines[i]);
    if ((cells[idColIdx] || '').trim() === targetId) {
      rowLineIdx = i;
      break;
    }
  }

  if (!created && rowLineIdx === -1) {
    throw new Error(`No se ha encontrado ningún registro con ID "${targetId}" en ${filePath}`);
  }

  if (created && rowLineIdx !== -1) {
    throw new Error(`El ID "${targetId}" ya existe en ${filePath}, no se puede crear duplicado`);
  }

  let newCells;
  if (created) {
    newCells = headers.map((h, idx) => {
      if (idx === idColIdx) return targetId;
      return (fields[h] !== undefined ? String(fields[h]) : '').trim() || '';
    });
  } else {
    const existingCells = splitRowCells(lines[rowLineIdx]);
    newCells = headers.map((h, idx) => {
      if (idx === idColIdx) return targetId;
      if (fields[h] !== undefined) return String(fields[h]).trim();
      return existingCells[idx] !== undefined ? existingCells[idx] : '';
    });
  }

  const newLine = buildRowLine(newCells);

  if (created) {
    lines.splice(lastRowLineIdx + 1, 0, newLine);
  } else {
    lines[rowLineIdx] = newLine;
  }

  const today = new Date();
  const fechaISO = today.toISOString().slice(0, 10);
  updateFechaActualizacion(lines, fechaISO);

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

  return { id: targetId, created };
}

module.exports = { upsertRow, findTableBlock, splitRowCells };
