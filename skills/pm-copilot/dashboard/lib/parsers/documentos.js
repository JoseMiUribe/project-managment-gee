'use strict';

const fs = require('fs');
const path = require('path');
const { catalogar } = require('../documentCatalog');

const DIRS_A_ESCANEAR = [
  'output-paso-legacy',
  'output-paso-0',
  'output-paso-1',
  'output-paso-2',
  'output-paso-3',
  'output-paso-4',
  'output-paso-5',
  'output-transversal',
  'config',
];

const ARCHIVOS_RAIZ = ['00-documento-original.md', 'documentacion-proyecto.md', 'inventario-documentos-proyecto.md', 'documento-cierre-fase0.md'];

function listarMdRecursivo(dirAbs, dirRel, out) {
  let entries;
  try {
    entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  } catch (err) {
    return; // el directorio no existe todavía — normal si el proyecto no ha llegado a ese paso
  }
  for (const entry of entries) {
    const absPath = path.join(dirAbs, entry.name);
    const relPath = dirRel + '/' + entry.name;
    if (entry.isDirectory()) {
      listarMdRecursivo(absPath, relPath, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      out.push(relPath);
    }
  }
}

/**
 * Escanea el proyecto en busca de cada .md generado por el skill, sin
 * depender de que exista un parser dedicado para cada uno (a diferencia del
 * resto del dashboard, que solo sabe leer artefactos con forma de tabla).
 * Alimenta la pestaña "Documentos" — ver dashboard/lib/documentCatalog.js
 * para la explicación de cada tipo.
 *
 * @param {string} projectPath
 * @returns {Array<{ruta: string, paso: string, titulo: string, descripcion: string, tamano: number, modificadoEn: string|null}>}
 */
function listarDocumentos(projectPath) {
  const rutas = [];
  for (const dir of DIRS_A_ESCANEAR) {
    listarMdRecursivo(path.join(projectPath, dir), dir, rutas);
  }
  for (const archivo of ARCHIVOS_RAIZ) {
    if (fs.existsSync(path.join(projectPath, archivo))) rutas.push(archivo);
  }

  return rutas
    .map((rutaRelativa) => {
      const info = catalogar(rutaRelativa);
      let tamano = 0;
      let modificadoEn = null;
      try {
        const stat = fs.statSync(path.join(projectPath, rutaRelativa));
        tamano = stat.size;
        modificadoEn = stat.mtime.toISOString();
      } catch (err) {
        // no debería pasar (viene de un readdir sobre el mismo path) — no rompemos el listado si pasa
      }
      return { ruta: rutaRelativa, paso: info.paso, titulo: info.titulo, descripcion: info.descripcion, tamano, modificadoEn };
    })
    .sort((a, b) => a.paso.localeCompare(b.paso) || a.titulo.localeCompare(b.titulo));
}

module.exports = { listarDocumentos };
