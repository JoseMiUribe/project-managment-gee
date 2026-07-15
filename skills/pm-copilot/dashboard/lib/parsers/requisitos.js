'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');

const REL_DIR = 'output-paso-0';
const FILE_PETICIONES = 'peticiones-cliente.md';
const FILE_FUNCIONALES = 'requisitos-funcionales.md';
const FILE_NOFUNCIONALES = 'requisitos-nofuncionales.md';
const FILE_ZONAS = 'zonas-incertidumbre.md';

/**
 * Parsers de los 4 artefactos del Paso 0, según el formato exacto descrito
 * en prompts/paso-0/procesar-respuestas.md (punto g).
 *
 * Cada archivo es opcional: un proyecto recién empezado puede no tener
 * todavía, por ejemplo, requisitos-nofuncionales.md. Cada sub-parser
 * devuelve [] si su archivo no existe, sin romper el resto.
 */

function readFileIfExists(projectPath, fileName) {
  const filePath = path.join(projectPath, REL_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

// ---------- peticiones-cliente.md ----------
// | ID | Petición | Lo dijo el cliente | Prioridad subjetiva |

function mapPeticionRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    peticion: getCell(row, 'Petición') || getCell(row, 'Peticion') || '',
    loDijoElCliente: getCell(row, 'Lo dijo el cliente') || '',
    prioridadSubjetiva: getCell(row, 'Prioridad subjetiva') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parsePeticiones(projectPath) {
  try {
    const text = readFileIfExists(projectPath, FILE_PETICIONES);
    if (!text) return [];
    const tables = parseMarkdownTables(text);
    const table =
      findTableByHeading(tables, ['peticiones del cliente', 'peticiones']) ||
      tables.find((t) => t.headers.some((h) => /^id$/i.test(h.trim()))) ||
      null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapPeticionRow);
  } catch (err) {
    console.error(`[parsers/requisitos] Error parseando ${FILE_PETICIONES}:`, err.message);
    return [];
  }
}

// ---------- requisitos-funcionales.md ----------
// | ID | Módulo/Área | Descripción | Actor/Rol | Prioridad (MoSCoW) | Origen | Dependencias |
// Si hay legacy puede venir dividido en "Nuevos requisitos funcionales" y
// "Modificaciones a RFs existentes" (RF-XXX MOD) — se agregan ambas secciones.

function mapFuncionalRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    modulo: getCell(row, 'Módulo/Área') || getCell(row, 'Modulo/Area') || getCell(row, 'Módulo') || '',
    descripcion: getCell(row, 'Descripción') || '',
    actor: getCell(row, 'Actor/Rol') || getCell(row, 'Actor') || '',
    prioridad: getCell(row, 'Prioridad (MoSCoW)') || getCell(row, 'Prioridad') || '',
    origen: getCell(row, 'Origen') || '',
    dependencias: getCell(row, 'Dependencias') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function mapReglaNegocioRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    regla: getCell(row, 'Regla') || '',
    afectaA: getCell(row, 'Afecta a') || '',
  };
}

function parseFuncionales(projectPath) {
  try {
    const text = readFileIfExists(projectPath, FILE_FUNCIONALES);
    if (!text) return { items: [], reglasNegocio: [] };
    const tables = parseMarkdownTables(text);

    // Puede haber varias tablas de RF (tabla única, o "Nuevos" + "Modificaciones").
    const tablasRf = tables.filter((t) => t.headers.some((h) => /^id$/i.test(h.trim())) && t.headers.some((h) => /descripción|descripcion/i.test(h)));
    const items = [];
    for (const table of tablasRf) {
      for (const row of table.rows) {
        const id = (getCell(row, 'ID') || '').trim();
        if (!id || !/^RF-/i.test(id)) continue;
        items.push(mapFuncionalRow(row));
      }
    }

    const tablaReglas = findTableByHeading(tables, ['reglas de negocio']);
    const reglasNegocio = tablaReglas
      ? tablaReglas.rows.filter((r) => (getCell(r, 'ID') || '').trim() !== '').map(mapReglaNegocioRow)
      : [];

    return { items, reglasNegocio };
  } catch (err) {
    console.error(`[parsers/requisitos] Error parseando ${FILE_FUNCIONALES}:`, err.message);
    return { items: [], reglasNegocio: [] };
  }
}

// ---------- requisitos-nofuncionales.md ----------
// | ID | Descripción | Categoría | Origen | Prioridad (MoSCoW) |
// "implicito" = true si el Origen dice "Implícito, no confirmado por el cliente"

function esImplicito(origen) {
  if (!origen) return false;
  return /impl[ií]cito/i.test(origen);
}

function mapNoFuncionalRow(row) {
  const origen = getCell(row, 'Origen') || '';
  return {
    id: getCell(row, 'ID') || '',
    descripcion: getCell(row, 'Descripción') || '',
    categoria: getCell(row, 'Categoría') || '',
    origen,
    prioridad: getCell(row, 'Prioridad (MoSCoW)') || getCell(row, 'Prioridad') || '',
    implicito: esImplicito(origen),
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseNoFuncionales(projectPath) {
  try {
    const text = readFileIfExists(projectPath, FILE_NOFUNCIONALES);
    if (!text) return [];
    const tables = parseMarkdownTables(text);
    const table =
      findTableByHeading(tables, ['requisitos no funcionales']) ||
      tables.find((t) => t.headers.some((h) => /^id$/i.test(h.trim())) && t.headers.some((h) => /categor[ií]a/i.test(h))) ||
      null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapNoFuncionalRow);
  } catch (err) {
    console.error(`[parsers/requisitos] Error parseando ${FILE_NOFUNCIONALES}:`, err.message);
    return [];
  }
}

// ---------- zonas-incertidumbre.md ----------
// | ID | Zona | Descripción | Por qué es incierto | Afecta a | Pregunta para resolverlo | Recomendación por defecto (80/20) |
// ## Resumen: | Tipo | Cantidad |

function mapZonaRow(row) {
  return {
    id: getCell(row, 'ID') || '',
    zona: getCell(row, 'Zona') || '',
    descripcion: getCell(row, 'Descripción') || '',
    porQueEsIncierto: getCell(row, 'Por qué es incierto') || '',
    afecta: getCell(row, 'Afecta a') || '',
    pregunta: getCell(row, 'Pregunta para resolverlo') || '',
    recomendacionPorDefecto: getCell(row, 'Recomendación por defecto (80/20)') || getCell(row, 'Recomendación por defecto') || '',
    ultimaModificacion: getCell(row, 'Última modificación') || '',
    modificadoPor: getCell(row, 'Modificado por') || '',
  };
}

function parseZonasIncertidumbre(projectPath) {
  try {
    const text = readFileIfExists(projectPath, FILE_ZONAS);
    if (!text) return [];
    const tables = parseMarkdownTables(text);
    const table =
      findTableByHeading(tables, ['zonas identificadas', 'zonas de incertidumbre']) ||
      tables.find((t) => t.headers.some((h) => /^id$/i.test(h.trim())) && t.headers.some((h) => /incierto/i.test(h))) ||
      null;
    if (!table) return [];
    return table.rows
      .filter((r) => (getCell(r, 'ID') || '').trim() !== '')
      .map(mapZonaRow);
  } catch (err) {
    console.error(`[parsers/requisitos] Error parseando ${FILE_ZONAS}:`, err.message);
    return [];
  }
}

/**
 * @param {string} projectPath
 * @returns {Object}
 */
function parseRequisitos(projectPath) {
  const peticiones = parsePeticiones(projectPath);
  const funcionalesRaw = parseFuncionales(projectPath);
  const funcionales = funcionalesRaw.items;
  const noFuncionales = parseNoFuncionales(projectPath);
  const zonasIncertidumbre = parseZonasIncertidumbre(projectPath);

  const resumen = {
    totalPeticiones: peticiones.length,
    totalFuncionales: funcionales.length,
    totalNoFuncionales: noFuncionales.length,
    totalZonasIncertidumbre: zonasIncertidumbre.length,
    noFuncionalesImplicitos: noFuncionales.filter((r) => r.implicito).length,
  };

  return {
    peticiones,
    funcionales,
    reglasNegocio: funcionalesRaw.reglasNegocio,
    noFuncionales,
    zonasIncertidumbre,
    resumen,
  };
}

module.exports = {
  parseRequisitos,
  REL_DIR,
  FILE_PETICIONES,
  FILE_FUNCIONALES,
  FILE_NOFUNCIONALES,
  FILE_ZONAS,
};
