'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');
const { parseKeyValueBlock, getValue } = require('../keyValueBlock');

const OUTPUT_PASO_4_DIR = 'output-paso-4';

/**
 * Convención de nombres (documentada en README.md):
 *   investigar/[proyecto]/output-paso-4/sprint-backlog-{N}.md   -> uno por sprint
 *   investigar/[proyecto]/output-paso-4/review-sprint-{N}.md    -> cierre de ese sprint
 *
 * Nota: antes de la reestructuración del pipeline (Paso 3 pasó a ser
 * "Generación y validación de HU" y esto se convirtió en Paso 4 "Gestión de
 * Sprints"), esta carpeta se llamaba output-paso-3. Si migras un proyecto
 * antiguo, renombra la carpeta en vez de mantener ambas.
 *
 * Fallback de compatibilidad: si existe un único `sprint-backlog.md` (sin
 * número, como en el template legacy de un solo sprint), se trata como
 * sprint número extraído de sus metadatos, o 1 si no se puede determinar.
 */
const SPRINT_BACKLOG_RE = /^sprint-backlog-(\d+)\.md$/i;
const SPRINT_BACKLOG_LEGACY = 'sprint-backlog.md';
const REVIEW_SPRINT_RE = /^review-sprint-(\d+)\.md$/i;

function listSprintBacklogFiles(projectPath) {
  const dir = path.join(projectPath, OUTPUT_PASO_4_DIR);
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile());

  const files = [];
  for (const entry of entries) {
    const match = entry.name.match(SPRINT_BACKLOG_RE);
    if (match) {
      files.push({ file: path.join(dir, entry.name), numero: parseInt(match[1], 10) });
    }
  }

  if (files.length === 0) {
    const legacyPath = path.join(dir, SPRINT_BACKLOG_LEGACY);
    if (fs.existsSync(legacyPath)) {
      files.push({ file: legacyPath, numero: null });
    }
  }

  return files;
}

function reviewExistsForSprint(projectPath, numero) {
  const dir = path.join(projectPath, OUTPUT_PASO_4_DIR);
  if (!fs.existsSync(dir)) return false;
  if (numero === null || numero === undefined) return false;
  const candidate = path.join(dir, `review-sprint-${numero}.md`);
  return fs.existsSync(candidate);
}

function parseHuRow(row) {
  return {
    hu: getCell(row, 'HU') || '',
    titulo: getCell(row, 'Título') || '',
    tallas: getCell(row, 'Tallas') || '',
    tareas: getCell(row, 'Tareas') || '',
    responsable: getCell(row, 'Responsable') || '',
    estado: getCell(row, 'Estado') || '',
  };
}

function parseNuevoRiesgoRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    riesgo: getCell(row, 'Riesgo') || '',
    afectaA: getCell(row, 'Afecta a') || '',
    accion: getCell(row, 'Acción') || '',
  };
}

/**
 * Extrae número de sprint desde el bloque de metadatos si no venía del nombre
 * de archivo (caso legacy sprint-backlog.md sin número).
 */
function extractNumeroFromHeader(headerBlock) {
  const raw = getValue(headerBlock, 'Sprint');
  if (!raw) return null;
  const match = raw.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parseSingleSprintFile(filePath, fallbackNumero) {
  const text = fs.readFileSync(filePath, 'utf8');

  // El bloque de metadatos son las líneas **Clave:** valor antes de "## HU seleccionadas"
  const headerEndIdx = text.search(/^##\s+HU seleccionadas/im);
  const headerText = headerEndIdx >= 0 ? text.slice(0, headerEndIdx) : text;
  const headerBlock = parseKeyValueBlock(headerText);

  const numero = fallbackNumero !== null && fallbackNumero !== undefined
    ? fallbackNumero
    : extractNumeroFromHeader(headerBlock);

  const fechasRaw = getValue(headerBlock, 'Fechas') || '';
  // formato esperado: "[inicio] — [fin]" con separador em-dash o guiones
  const fechasParts = fechasRaw.split(/—|–|-{1,2}(?!\d)/).map((s) => s.trim()).filter(Boolean);

  const tables = parseMarkdownTables(text);
  const huTable = findTableByHeading(tables, ['hu seleccionadas']) || tables[0] || null;
  const riesgosTable = findTableByHeading(tables, ['nuevos riesgos detectados']) || null;

  const hu = huTable
    ? huTable.rows
        .filter((r) => (getCell(r, 'HU') || '').trim() !== '')
        .map(parseHuRow)
    : [];

  const nuevosRiesgos = riesgosTable
    ? riesgosTable.rows
        .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
        .map(parseNuevoRiesgoRow)
    : [];

  return {
    numero,
    fechas: fechasRaw,
    fechaInicio: fechasParts[0] || '',
    fechaFin: fechasParts[1] || '',
    objetivo: getValue(headerBlock, 'Objetivo') || '',
    capacidadDisponible: getValue(headerBlock, 'Capacidad disponible') || '',
    capacidadOcupada: getValue(headerBlock, 'Capacidad ocupada') || '',
    hu,
    nuevosRiesgos,
    archivo: filePath,
  };
}

/**
 * @param {string} projectPath
 * @returns {Array<Object>} lista de sprints parseados (sin campo `activo`/`locked`,
 *   eso lo añade sprintLock.js / buildSnapshot.js)
 */
function parseSprintBacklogs(projectPath) {
  try {
    const files = listSprintBacklogFiles(projectPath);
    const sprints = files.map(({ file, numero }) => {
      try {
        return parseSingleSprintFile(file, numero);
      } catch (err) {
        console.error(`[parsers/sprintBacklog] Error parseando ${file}:`, err.message);
        return null;
      }
    }).filter(Boolean);

    sprints.sort((a, b) => (a.numero || 0) - (b.numero || 0));
    return sprints;
  } catch (err) {
    console.error('[parsers/sprintBacklog] Error listando sprint backlogs:', err.message);
    return [];
  }
}

module.exports = {
  parseSprintBacklogs,
  listSprintBacklogFiles,
  reviewExistsForSprint,
  OUTPUT_PASO_4_DIR,
  SPRINT_BACKLOG_RE,
  REVIEW_SPRINT_RE,
};
