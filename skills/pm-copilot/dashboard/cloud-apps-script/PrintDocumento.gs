/**
 * Vista de un documento suelto en modo nube ("?vista=documento&ruta=...").
 * Equivalente a /print/documento en modo local (dashboard/lib/printDocumento.js
 * + markdownClientStrip.js), pero leyendo el contenido de Drive (subido por
 * migrarDocumentos, ver Migracion.gs) en vez del disco local. El usuario
 * imprime a PDF con Ctrl+P, igual que con el informe completo (ver
 * doGeneratePdf en AppJs.html) — no hay generación de PDF en servidor aquí
 * tampoco.
 *
 * El markdown se renderiza a HTML en el propio navegador (no en el servidor):
 * Apps Script no tiene `marked` (es un paquete npm, no está disponible en su
 * runtime), así que se carga desde el mismo CDN ya usado para ECharts y se
 * llama `marked.parse()` en el cliente — el servidor solo entrega el texto
 * markdown ya recortado (si aplica) como una cadena JS segura.
 *
 * Decisión explícita (2026-07-17): la versión "cliente" NUNCA se anuncia
 * visualmente dentro del documento (nada de "Versión cliente" ni aviso
 * parecido) — al cliente le genera desconfianza ver ese aviso, como si se le
 * ocultara algo, aunque el recorte de contenido interno sea legítimo. Mismo
 * cambio aplicado en modo local (dashboard/lib/printDocumento.js).
 */

const MARCADOR_INTERNO_INICIO_RE = /^\s*<!--\s*interno:inicio\s*-->\s*$/i;
const MARCADOR_INTERNO_FIN_RE = /^\s*<!--\s*interno:fin\s*-->\s*$/i;

/** Copia de dashboard/lib/markdownClientStrip.js#stripContenidoInterno —
 *  pura manipulación de strings, portable tal cual. */
function stripContenidoInterno_(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const out = [];
  let dentro = false;
  for (const line of lines) {
    if (!dentro && MARCADOR_INTERNO_INICIO_RE.test(line)) { dentro = true; continue; }
    if (dentro && MARCADOR_INTERNO_FIN_RE.test(line)) { dentro = false; continue; }
    if (dentro) continue;
    out.push(line);
  }
  return out.join('\n');
}

/** Busca la fila de `ruta` en la pestaña Documentos y devuelve su
 *  DriveFileId (o null si el documento no existe o no se ha subido a Drive
 *  todavía — ver migrarDocumentos). */
function buscarDriveFileIdDeDocumento_(sheetId, proyectoId, ruta) {
  const filas = filasDe_(sheetId, proyectoId, 'documentos');
  const fila = filas.find(function (f) { return f['Ruta'] === ruta; });
  return fila ? fila['DriveFileId'] || null : null;
}

/** Lee el contenido de un documento ya subido a Drive. Lanza si no existe o
 *  no se ha subido todavía — el llamador (doGet) lo convierte en un mensaje
 *  de error legible. */
function leerContenidoDocumentoDrive_(sheetId, proyectoId, ruta) {
  const driveFileId = buscarDriveFileIdDeDocumento_(sheetId, proyectoId, ruta);
  if (!driveFileId) {
    throw new Error(
      'Este documento todavía no se ha subido a Drive. Ve a "?vista=migrar", sección 2 ' +
      '("Documentos"), y súbelo desde ahí antes de poder verlo aquí.'
    );
  }
  return DriveApp.getFileById(driveFileId).getBlob().getDataAsString('UTF-8');
}

function escDocumento_(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** HTML de la vista de un documento — mismo estilo visual que
 *  dashboard/lib/printDocumento.js, sin ningún aviso de "versión cliente". */
function renderDocumentoViewCloud_(markdown, ruta) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escDocumento_(ruta)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 24px 32px; font-size: 13px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin-top: 28px; border-bottom: 2px solid #333; padding-bottom: 4px; }
  h3 { font-size: 15px; margin-top: 20px; }
  h4 { font-size: 13px; margin-top: 16px; }
  .meta { color: #555; margin-bottom: 16px; font-size: 12px; }
  /* table-layout: fixed reparte el ancho de forma pareja entre columnas en
     vez de que el navegador se lo dé casi todo a la columna con más texto y
     deje al resto casi sin espacio — que es justo lo que hacía que las
     celdas estrechas crecieran muchísimo en vertical. word-wrap/overflow-wrap
     dejan que el texto largo parta línea dentro de ese ancho fijo. Tablas con
     muchas columnas (como las del GEE en bruto) llevan letra más pequeña,
     ver .tabla-ancha más abajo. */
  table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 8px 0 16px; }
  th, td { border: 1px solid #ccc; padding: 3px 5px; text-align: left; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; }
  th { background: #f0f0f0; }
  /* Aplicado automáticamente a cualquier tabla con muchas columnas (ver el
     script al final) — reduce la letra para que quepa más por línea antes de
     tener que partir, sin tener que saber de antemano cuántas columnas trae
     cada documento. */
  table.tabla-ancha, table.tabla-ancha th, table.tabla-ancha td { font-size: 10px; }
  p { margin: 8px 0; }
  ul, ol { padding-left: 22px; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #ccc; margin: 8px 0; padding: 4px 12px; color: #555; }
  hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
  a { color: #1a5fb4; }
  /* size: landscape es una pista fuerte para el diálogo de impresión del
     navegador (Chrome la respeta por defecto) — evita que las tablas anchas
     salgan cortadas si alguien imprime sin fijarse en la orientación. */
  @page { size: landscape; margin: 15mm 12mm; }
  .btn-imprimir { position: fixed; top: 16px; right: 16px; padding: 8px 16px; font-size: 13px; background: #1a5fb4; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  @media print { .btn-imprimir { display: none; } }
</style>
</head>
<body>
  <button class="btn-imprimir" onclick="window.print()">🖨️ Imprimir</button>
  <p class="meta">${escDocumento_(ruta)}</p>
  <div id="cuerpo"><pre>${escDocumento_(markdown)}</pre></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    // El markdown crudo va ya seguro como cadena JS (JSON.stringify en el
    // servidor) — si marked no cargara por lo que sea (sin internet, CDN
    // caído), el <pre> de arriba ya muestra el texto plano como fallback.
    var markdownCrudo = ${JSON.stringify(markdown)};
    if (typeof marked !== "undefined") {
      marked.setOptions({ gfm: true, breaks: false });
      document.getElementById("cuerpo").innerHTML = marked.parse(markdownCrudo);
    }
    // Tablas con muchas columnas (típico de los registros del GEE en bruto:
    // ID + campos + Visibilidad/Motivo + auditoría) llevan letra más pequeña
    // (.tabla-ancha) para que quepa más por línea — sin necesitar saber de
    // antemano cuántas columnas trae cada documento.
    document.querySelectorAll("#cuerpo table").forEach(function (tabla) {
      var numColumnas = tabla.querySelector("tr") ? tabla.querySelector("tr").children.length : 0;
      if (numColumnas >= 8) tabla.classList.add("tabla-ancha");
    });
  </script>
</body>
</html>`;
}

/** Llamada desde doGet cuando e.parameter.vista === 'documento'. */
function renderVistaDocumento_(sheetId, proyectoId, ruta, version) {
  try {
    const markdownCrudo = leerContenidoDocumentoDrive_(sheetId, proyectoId, ruta);
    const markdown = version === 'cliente' ? stripContenidoInterno_(markdownCrudo) : markdownCrudo;
    return HtmlService.createHtmlOutput(renderDocumentoViewCloud_(markdown, ruta)).setTitle(ruta);
  } catch (err) {
    return HtmlService.createHtmlOutput('<pre>' + escDocumento_(err.message) + '</pre>');
  }
}
