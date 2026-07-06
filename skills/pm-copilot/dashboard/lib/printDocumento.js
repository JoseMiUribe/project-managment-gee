'use strict';

const path = require('path');

/**
 * Resuelve y valida una ruta relativa proporcionada por el usuario (query
 * param o body de una petición HTTP) contra el directorio del proyecto.
 *
 * Nunca debe servirse ni convertirse a PDF un archivo fuera del proyecto:
 * esta función es el único punto por el que debe pasar cualquier "ruta"
 * recibida desde fuera antes de tocar el filesystem.
 *
 * @param {string} projectPath ruta absoluta del proyecto (raíz permitida)
 * @param {string} rutaRelativa ruta relativa recibida del cliente
 * @returns {string} ruta absoluta, garantizada dentro de projectPath
 * @throws {Error} si la ruta intenta escapar del proyecto o no es un .md
 */
function resolveRutaDocumento(projectPath, rutaRelativa) {
  if (typeof rutaRelativa !== 'string' || rutaRelativa.trim() === '') {
    throw new Error('La ruta del documento no puede estar vacía.');
  }

  // Rechaza rutas absolutas explícitas (Windows: C:\..., POSIX: /...) y URLs.
  if (path.isAbsolute(rutaRelativa) || /^[a-zA-Z]+:\/\//.test(rutaRelativa)) {
    throw new Error('La ruta debe ser relativa al directorio del proyecto, no absoluta.');
  }

  if (!rutaRelativa.toLowerCase().endsWith('.md')) {
    throw new Error('Solo se pueden imprimir archivos markdown (.md).');
  }

  const raizProyecto = path.resolve(projectPath);
  const rutaResuelta = path.resolve(raizProyecto, rutaRelativa);

  // Confirma que la ruta resuelta queda DENTRO de la raíz del proyecto.
  // path.relative + comprobación de ".." cubre tanto "../../etc" como
  // trucos de mezcla de separadores; el prefijo del propio raiz cubre
  // el caso límite de que sea exactamente la raíz (no debería serlo, pero
  // por seguridad no se trata como "dentro").
  const relativa = path.relative(raizProyecto, rutaResuelta);
  const escapaDelProyecto =
    relativa === '' || relativa.startsWith('..') || path.isAbsolute(relativa);

  if (escapaDelProyecto) {
    throw new Error('Ruta inválida: no se permite acceder a archivos fuera del directorio del proyecto.');
  }

  return rutaResuelta;
}

function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renderiza un documento markdown suelto (prosa: títulos, listas, párrafos,
 * tablas normales, etc.) a una página HTML de solo lectura, con una hoja de
 * estilos mínima consistente con /print (lib/printView.js).
 *
 * Usa `marked` para el markdown -> HTML. Si por lo que sea `marked` no
 * estuviera instalado (p.ej. instalación a medias sin `npm install`), cae a
 * un fallback muy simple (envolver el markdown crudo en un <pre>) en vez de
 * tumbar el servidor.
 */
function renderDocumentoView(markdown, rutaRelativa) {
  let cuerpoHtml;
  try {
    const { marked } = require('marked');
    marked.setOptions({ gfm: true, breaks: false });
    cuerpoHtml = marked.parse(markdown);
  } catch (err) {
    console.error('[printDocumento] "marked" no disponible, usando fallback en texto plano:', err.message);
    cuerpoHtml = `<pre>${esc(markdown)}</pre>`;
  }

  const titulo = path.basename(rutaRelativa, '.md');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${esc(titulo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 24px 32px; font-size: 13px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin-top: 28px; border-bottom: 2px solid #333; padding-bottom: 4px; }
  h3 { font-size: 15px; margin-top: 20px; }
  h4 { font-size: 13px; margin-top: 16px; }
  .meta { color: #555; margin-bottom: 16px; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
  th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; }
  p { margin: 8px 0; }
  ul, ol { padding-left: 22px; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #ccc; margin: 8px 0; padding: 4px 12px; color: #555; }
  hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
  a { color: #1a5fb4; }
  @page { margin: 15mm 12mm; }
</style>
</head>
<body>
  <p class="meta">${esc(rutaRelativa)}</p>
  ${cuerpoHtml}
</body>
</html>`;
}

module.exports = { renderDocumentoView, resolveRutaDocumento };
