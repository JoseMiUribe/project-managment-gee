'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_DIR = 'output-paso-legacy';
const FILE_NAME_V1 = 'mapa-proyecto.md';
const FILE_NAME_V2 = 'mapa-proyecto-v2.md';

/**
 * mapa-proyecto.md / mapa-proyecto-v2.md (Paso -1), según
 * templates/paso-legacy/mapa-proyecto.md:
 *   ## Resumen del análisis
 *   | Categoría | Cantidad | % |
 *   ## Detalle por aspecto
 *   | ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
 *
 * Si existe mapa-proyecto-v2.md (generado tras incorporar el feedback de la
 * entrevista, ver prompts/paso-legacy/subpaso-4-feedback.md) tiene prioridad
 * sobre el v1, por ser la versión actualizada.
 */

function mapAspectoRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    aspecto: getCell(row, 'Aspecto') || '',
    estado: getCell(row, 'Estado') || '',
    descripcion: getCell(row, 'Descripción') || '',
    fuentes: getCell(row, 'Fuentes') || '',
    recomendacion: getCell(row, 'Recomendación') || '',
  };
}

function estadoKey(raw) {
  if (!raw) return null;
  const v = raw.toLowerCase();
  if (v.includes('✅') || v.includes('claro')) return 'claro';
  if (v.includes('⚠') || v.includes('contradictori')) return 'contradictorio';
  if (v.includes('❓') || v.includes('ambigu')) return 'ambiguo';
  if (v.includes('🔲') || v.includes('inexistente')) return 'inexistente';
  return null;
}

function computeResumen(aspectos) {
  const resumen = { claro: 0, contradictorio: 0, ambiguo: 0, inexistente: 0 };
  for (const aspecto of aspectos) {
    const key = estadoKey(aspecto.estado);
    if (key) resumen[key]++;
  }
  return resumen;
}

function parseArchivo(filePath, version) {
  const text = fs.readFileSync(filePath, 'utf8');
  const tables = parseMarkdownTables(text);
  const tablaDetalle =
    findTableByHeading(tables, ['detalle por aspecto', 'detalle']) ||
    tables.find((t) => t.headers.some((h) => h.trim().toLowerCase() === 'aspecto')) ||
    null;

  const aspectos = tablaDetalle
    ? tablaDetalle.rows.filter((r) => (getCell(r, 'ID') || '').trim() !== '').map(mapAspectoRow)
    : [];

  return {
    version,
    aspectos,
    resumen: computeResumen(aspectos),
  };
}

/**
 * @param {string} projectPath
 * @returns {Object|null}
 */
function parseLegacy(projectPath) {
  try {
    const v2Path = path.join(projectPath, REL_DIR, FILE_NAME_V2);
    const v1Path = path.join(projectPath, REL_DIR, FILE_NAME_V1);

    if (fs.existsSync(v2Path)) {
      return parseArchivo(v2Path, 'v2');
    }
    if (fs.existsSync(v1Path)) {
      return parseArchivo(v1Path, 'v1');
    }
    return null;
  } catch (err) {
    console.error('[parsers/legacy] Error parseando mapa-proyecto:', err.message);
    return null;
  }
}

module.exports = { parseLegacy, REL_DIR, FILE_NAME_V1, FILE_NAME_V2 };
