'use strict';

/**
 * Convención de marcado para contenido "solo interno" (nunca para el
 * cliente) dentro de cualquier documento markdown del skill:
 *
 *   <!-- interno:inicio -->
 *   ... contenido que solo debe ver el equipo/ADL ...
 *   <!-- interno:fin -->
 *
 * Los marcadores son comentarios HTML (invisibles al renderizar markdown
 * normal) y deben ir cada uno en su propia línea. La "versión cliente" de un
 * documento retira estos bloques por completo; la versión completa los deja
 * intactos. Decisión explícita del usuario: convención en el propio
 * markdown, no un sistema de archivos o frontmatter aparte (ver
 * mejoras-pendientes.md, Fase E).
 */
const MARCADOR_INICIO = /^\s*<!--\s*interno:inicio\s*-->\s*$/i;
const MARCADOR_FIN = /^\s*<!--\s*interno:fin\s*-->\s*$/i;

/**
 * @param {string} markdown
 * @returns {string} el markdown sin los bloques marcados como internos
 */
function stripContenidoInterno(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let dentro = false;
  for (const line of lines) {
    if (!dentro && MARCADOR_INICIO.test(line)) {
      dentro = true;
      continue;
    }
    if (dentro && MARCADOR_FIN.test(line)) {
      dentro = false;
      continue;
    }
    if (dentro) continue;
    out.push(line);
  }
  return out.join('\n');
}

module.exports = { stripContenidoInterno };
