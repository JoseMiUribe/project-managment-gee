'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, getCell } = require('../markdownTable');
const { parseKeyValueBlock, getValue } = require('../keyValueBlock');

const REL_PATH = 'output-paso-2/capacidad-equipo/actual.md';

/**
 * El output real de procesar-capacidad.md reutiliza la estructura de
 * plantilla-capacidad.md (secciones numeradas 1-8) pero con los valores ya
 * calculados, más una cabecera con fecha de generación, motivo de
 * actualización y diff cualitativo (ver prompts/paso-2/procesar-capacidad.md).
 * Parseamos de forma flexible: localizamos cada sección numerada por su
 * heading y extraemos tablas + pares clave-valor sueltos, sin asumir texto
 * literal exacto.
 */

function extractSection(text, headingRegexFragment) {
  const re = new RegExp(`^##\\s*${headingRegexFragment}[^\\n]*$`, 'im');
  const match = text.match(re);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  return nextHeading >= 0 ? rest.slice(0, nextHeading) : rest;
}

function parseCabecera(text) {
  const headerEndIdx = text.search(/^##\s+/m);
  const headerText = headerEndIdx >= 0 ? text.slice(0, headerEndIdx) : text.slice(0, 500);
  return parseKeyValueBlock(headerText);
}

/**
 * Extrae pares de líneas de lista simples "- Campo: valor" (sin negrita),
 * usadas en las secciones 2 y 3 de plantilla-capacidad.md. Ignora líneas de
 * checkbox ("- [x] ...") porque no son pares clave-valor.
 */
function extractSimpleListPairs(sectionText) {
  const pairs = {};
  if (!sectionText) return pairs;
  const lines = sectionText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^-\s*\[[ xX]\]/.test(trimmed)) continue; // checkbox, no es clave-valor
    const match = trimmed.match(/^-\s*([^:]+):\s*(.*)$/);
    if (match) pairs[match[1].trim()] = match[2].trim();
  }
  return pairs;
}

function tableRowsAsObjects(sectionText) {
  const tables = parseMarkdownTables(sectionText);
  if (tables.length === 0) return [];
  return tables[0].rows;
}

function parseCapacidad(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return null;
    const text = fs.readFileSync(filePath, 'utf8');

    const cabecera = parseCabecera(text);

    const seccion1 = extractSection(text, '1\\.\\s*Miembros del equipo');
    const seccion2 = extractSection(text, '2\\.\\s*Composici[oó]n t[eé]cnica');
    const seccion3 = extractSection(text, '3\\.?\\w*\\.?\\s*Velocidad del equipo');
    const seccion4 = extractSection(text, '4\\.\\s*Disponibilidad');
    const seccion5 = extractSection(text, '5\\.\\s*Conocimientos t[eé]cnicos');
    const seccion6 = extractSection(text, '6\\.\\s*Riesgos sobre la capacidad');
    const seccion7 = extractSection(text, '7\\.\\s*DoD del proyecto');
    const seccion8 = extractSection(text, '8\\.\\s*Notas adicionales');

    const miembros = tableRowsAsObjects(seccion1).map((row) => ({
      nombre: getCell(row, 'Nombre') || '',
      rolPrincipal: getCell(row, 'Rol principal') || '',
      especialidad: getCell(row, 'Especialidad (FE/BE/QA/DevOps/Diseño/PM)') || getCell(row, 'Especialidad') || '',
      seniority: getCell(row, 'Seniority (Jr/Sr/Staff)') || getCell(row, 'Seniority') || '',
      dedicacionPct: getCell(row, 'Dedicación (% al proyecto)') || getCell(row, 'Dedicación') || '',
      compartido: getCell(row, '¿Compartido con otro proyecto?') || '',
    }));

    // Estas secciones no usan el formato "**Clave:** valor" sino líneas de
    // lista simples "- Campo: valor" (ver templates/paso-2/plantilla-capacidad.md),
    // así que se extraen con una regex de línea dedicada en vez de keyValueBlock.
    const composicionTecnica = extractSimpleListPairs(seccion2);
    const velocidad = extractSimpleListPairs(seccion3);

    const disponibilidad = tableRowsAsObjects(seccion4).map((row) => ({
      fechaInicio: getCell(row, 'Fecha inicio') || '',
      fechaFinPrevista: getCell(row, 'Fecha fin prevista') || '',
      bajaPermiso: getCell(row, '¿Alguien de baja/permiso planificado?') || '',
      festivos: getCell(row, '¿Festivos/cierres que afecten?') || '',
    }));

    const conocimientos = tableRowsAsObjects(seccion5).map((row) => ({
      tecnologia: getCell(row, 'Tecnología') || '',
      laConoce: getCell(row, '¿El equipo la conoce?') || '',
      necesitaFormacion: getCell(row, 'Necesita formación') || '',
      quienLaSabe: getCell(row, 'Quién la sabe') || '',
    }));

    const riesgosCapacidad = tableRowsAsObjects(seccion6).map((row) => ({
      riesgo: getCell(row, 'Riesgo') || '',
      impactoEnCapacidad: getCell(row, 'Impacto en capacidad') || '',
      probabilidad: getCell(row, 'Probabilidad') || '',
    }));

    return {
      fechaGeneracion: getValue(cabecera, 'Fecha de generación') || getValue(cabecera, 'Fecha de cumplimentación') || '',
      motivoActualizacion: getValue(cabecera, 'Motivo de la actualización') || getValue(cabecera, 'Motivo') || '',
      diffCualitativo: getValue(cabecera, 'Diff cualitativo') || '',
      proyecto: getValue(cabecera, 'Proyecto') || '',
      miembros,
      composicionTecnica,
      velocidad,
      disponibilidad,
      conocimientos,
      riesgosCapacidad,
      dodExiste: seccion7.trim(),
      notas: seccion8.trim(),
      raw: {
        seccion1, seccion2, seccion3, seccion4, seccion5, seccion6, seccion7, seccion8,
      },
    };
  } catch (err) {
    console.error(`[parsers/capacidad] Error parseando ${REL_PATH}:`, err.message);
    return null;
  }
}

module.exports = { parseCapacidad, REL_PATH };
