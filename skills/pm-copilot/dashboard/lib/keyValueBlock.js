'use strict';

/**
 * Parser genérico de bloques clave-valor.
 *
 * Extrae pares de líneas con formato:
 *   **Clave:** valor
 *   - **Clave:** valor
 *   > **Clave:** valor
 *
 * Devuelve un objeto plano { "Clave": "valor", ... } con las claves tal cual
 * aparecen en el texto (sin normalizar a camelCase — eso lo hacen los
 * mappers específicos de cada parser).
 */

// La clave puede llevar los dos puntos DENTRO de los asteriscos (**Clave:**)
// o fuera (**Clave**:) — el grupo de captura excluye el ":" final en ambos
// casos y lo consume explícitamente después de cerrar los "**".
const KV_LINE_RE = /^\s*(?:[-*>]\s*)?\*\*([^*]+?):?\*\*\s*:?\s*(.*)$/;

/**
 * @param {string} block texto del bloque a analizar
 * @returns {Object<string, string>}
 */
function parseKeyValueBlock(block) {
  const result = {};
  if (!block || typeof block !== 'string') return result;

  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(KV_LINE_RE);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  }
  return result;
}

/**
 * Busca un valor por clave de forma case-insensitive y tolerante a espacios.
 */
function getValue(kvObject, keyName) {
  if (!kvObject) return undefined;
  const target = keyName.trim().toLowerCase();
  for (const key of Object.keys(kvObject)) {
    if (key.trim().toLowerCase() === target) {
      return kvObject[key];
    }
  }
  return undefined;
}

/**
 * Divide un texto largo en bloques a partir de un heading dado (regex),
 * útil para separar "### Sprint 1 — [Fechas]" ... "### Sprint 2 — ..." en
 * roadmap-tecnico.md. Devuelve un array de { title, body }.
 *
 * @param {string} text
 * @param {RegExp} headingRegex debe tener flag 'g' y un grupo de captura opcional para el título
 */
function splitByHeading(text, headingRegex) {
  if (!text) return [];
  const re = new RegExp(headingRegex.source, headingRegex.flags.includes('g') ? headingRegex.flags : headingRegex.flags + 'g');
  const matches = [...text.matchAll(re)];
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const title = (matches[i][1] || matches[i][0]).trim();
    const body = text.slice(start, end);
    blocks.push({ title, body });
  }
  return blocks;
}

module.exports = {
  parseKeyValueBlock,
  getValue,
  splitByHeading,
};
