'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Resuelve la ruta absoluta del proyecto a analizar.
 *
 * Prioridad:
 * 1. process.argv[2] (ruta a investigar/[proyecto]/, absoluta o relativa al cwd)
 * 2. Si no se pasa, busca un único subdirectorio dentro de ./investigar
 *    (relativo al cwd desde el que se lanzó `node server.js`) y lo usa.
 * 3. Si hay 0 o más de 1 subdirectorio, lanza un error explicando qué hacer.
 */
function resolveProjectPath() {
  const argPath = process.argv[2];

  if (argPath) {
    const resolved = path.resolve(process.cwd(), argPath);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
      throw new Error(
        `La ruta de proyecto indicada no existe o no es un directorio: ${resolved}\n` +
          'Uso: node server.js <ruta-a-investigar/mi-proyecto>'
      );
    }
    return resolved;
  }

  const investigarDir = path.resolve(process.cwd(), 'investigar');
  if (!fs.existsSync(investigarDir) || !fs.statSync(investigarDir).isDirectory()) {
    throw new Error(
      'No se ha indicado ruta de proyecto y no existe un directorio "investigar" en el cwd actual.\n' +
        'Uso: node server.js <ruta-a-investigar/mi-proyecto>\n' +
        `cwd actual: ${process.cwd()}`
    );
  }

  const entries = fs
    .readdirSync(investigarDir, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  if (entries.length === 0) {
    throw new Error(
      `No se ha encontrado ningún proyecto dentro de ${investigarDir}.\n` +
        'Especifica la ruta explícitamente: node server.js <ruta-a-investigar/mi-proyecto>'
    );
  }

  if (entries.length > 1) {
    const names = entries.map((e) => e.name).join(', ');
    throw new Error(
      `Se han encontrado varios proyectos dentro de ${investigarDir} (${names}).\n` +
        'Especifica cuál usar: node server.js investigar/<nombre-proyecto>'
    );
  }

  return path.join(investigarDir, entries[0].name);
}

/**
 * Calcula un puerto "preferido" determinista a partir de la ruta absoluta del
 * proyecto, para que el mismo proyecto tienda a abrir siempre en el mismo
 * puerto entre ejecuciones (cómodo para guardarlo como favorito del
 * navegador) y para que proyectos distintos no compitan por el mismo puerto
 * por defecto (4790) al tener varios dashboards abiertos a la vez.
 *
 * No es más que un hash simple (djb2) del path absoluto, normalizado a
 * minúsculas para que no dependa de mayúsculas/minúsculas en Windows,
 * mapeado al rango [4700, 5200).
 *
 * Esto es solo el punto de partida: si ese puerto está ocupado, el propio
 * servidor prueba el siguiente (ver `listenOnAvailablePort` en server.js).
 */
function hashProjectPathToPort(projectPath) {
  const RANGE_START = 4700;
  const RANGE_SIZE = 500; // rango: 4700-5199
  const normalized = projectPath.toLowerCase();

  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33 + normalized.charCodeAt(i)) >>> 0; // djb2, sin signo de 32 bits
  }

  return RANGE_START + (hash % RANGE_SIZE);
}

const PROJECT_PATH = resolveProjectPath();
const PROJECT_NAME = path.basename(PROJECT_PATH);

// Prioridad de puerto: PORT explícito del entorno > puerto determinista
// calculado a partir de la ruta del proyecto. Si ese puerto concreto está
// ocupado, server.js prueba los siguientes (+1) hasta encontrar uno libre.
const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : hashProjectPathToPort(PROJECT_PATH);

const CACHE_FILE = path.join(PROJECT_PATH, '.pm-copilot-cache.json');
const PORT_FILE = path.join(__dirname, '..', '.port');

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  PORT,
  CACHE_FILE,
  PORT_FILE,
  resolveProjectPath,
  hashProjectPathToPort,
};
