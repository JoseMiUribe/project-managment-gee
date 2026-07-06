'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');
const { parseKeyValueBlock, getValue, splitByHeading } = require('../keyValueBlock');

const REL_PATH = 'output-paso-2/roadmap-cliente.md';

/**
 * Cada hito en roadmap-cliente.md es un heading "### Hito N: [Nombre] 🎯"
 * seguido de una tabla de 2 columnas SIN headers reales:
 *   | | |
 *   |---|---|
 *   | **Qué incluye** | ... |
 *   | **Ventana estimada** | ... |
 *   | **Confianza** | ... |
 *   | **Depende de** | ... |
 *
 * markdownTable.js trata la primera fila (vacía) como headers, así que las
 * cuatro filas de datos quedan todas bajo la misma clave "" (colisión) y se
 * perdería la etiqueta de cada una. Por eso aquí NO usamos
 * parseMarkdownTables: parseamos las líneas "| **Etiqueta** | valor |" a
 * mano, por posición de columna, dentro del cuerpo de cada hito.
 */
function parseRawTableRows(body) {
  const lines = body.split(/\r?\n/);
  const pairs = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    let inner = trimmed;
    if (inner.startsWith('|')) inner = inner.slice(1);
    if (inner.endsWith('|')) inner = inner.slice(0, -1);
    const cells = inner.split('|').map((c) => c.trim());
    if (cells.length < 2) continue;
    if (cells.every((c) => /^:?-{1,}:?$/.test(c) || c === '')) continue; // separador
    const label = cells[0].replace(/\*\*/g, '').trim();
    const value = (cells[1] || '').trim();
    if (label) pairs.push([label, value]);
  }
  return pairs;
}

function parseHitos(text) {
  const blocks = splitByHeading(text, /^###\s+(Hito\s+\d+[^\n]*)$/m);
  return blocks.map(({ title, body }) => {
    const fields = {};
    for (const [label, value] of parseRawTableRows(body)) {
      fields[label] = value;
    }

    const numMatch = title.match(/Hito\s+(\d+)/i);
    const nombreMatch = title.match(/Hito\s+\d+:\s*(.*)$/i);

    return {
      numero: numMatch ? parseInt(numMatch[1], 10) : null,
      nombre: nombreMatch ? nombreMatch[1].replace(/🎯/g, '').trim() : title,
      queIncluye: findField(fields, 'qué incluye') || '',
      ventanaEstimada: findField(fields, 'ventana estimada') || '',
      confianza: findField(fields, 'confianza') || '',
      dependeDe: findField(fields, 'depende de') || '',
    };
  });
}

function findField(fields, label) {
  const target = label.toLowerCase();
  for (const key of Object.keys(fields)) {
    if (key.toLowerCase().includes(target)) return fields[key];
  }
  return undefined;
}

function parseCabecera(text) {
  const headerEndIdx = text.search(/^##\s+Resumen ejecutivo/im);
  const headerText = headerEndIdx >= 0 ? text.slice(0, headerEndIdx) : text.slice(0, 800);
  return parseKeyValueBlock(headerText);
}

function parseResumenEjecutivo(text) {
  const match = text.match(/^##\s+Resumen ejecutivo\s*\n+([\s\S]*?)(?:\n##\s|\n---\s*\n|$)/m);
  return match ? match[1].trim() : '';
}

function parsePremisas(text) {
  const match = text.match(/^##\s+Premisas y condiciones\s*\n+([\s\S]*?)(?:\n##\s|$)/m);
  if (!match) return [];
  const lines = match[1].split(/\r?\n/);
  const premisas = [];
  for (const line of lines) {
    const m = line.match(/^\s*\d+\.\s*\*\*([^*]+)\*\*\s*—?\s*(.*)$/) || line.match(/^\s*\d+\.\s*(.*)$/);
    if (m) {
      if (m.length === 3) premisas.push({ condicion: m[1].trim(), detalle: m[2].trim() });
      else premisas.push({ condicion: m[1].trim(), detalle: '' });
    }
  }
  return premisas;
}

function parseRoadmapCliente(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return null;
    const text = fs.readFileSync(filePath, 'utf8');
    const cabecera = parseCabecera(text);

    const tables = parseMarkdownTables(text);
    const nivelesConfianzaTable = findTableByHeading(tables, ['niveles de confianza']);

    return {
      versionPara: getValue(cabecera, 'Versión para') || '',
      fecha: getValue(cabecera, 'Fecha') || '',
      proximaRevision: getValue(cabecera, 'Próxima revisión') || '',
      confianzaGlobal: getValue(cabecera, 'Confianza global') || '',
      resumenEjecutivo: parseResumenEjecutivo(text),
      hitos: parseHitos(text),
      premisas: parsePremisas(text),
      nivelesConfianza: nivelesConfianzaTable
        ? nivelesConfianzaTable.rows.map((r) => ({
            indicador: getCell(r, 'Indicador') || '',
            significado: getCell(r, 'Significado') || '',
          }))
        : [],
    };
  } catch (err) {
    console.error(`[parsers/roadmapCliente] Error parseando ${REL_PATH}:`, err.message);
    return null;
  }
}

module.exports = { parseRoadmapCliente, REL_PATH };
