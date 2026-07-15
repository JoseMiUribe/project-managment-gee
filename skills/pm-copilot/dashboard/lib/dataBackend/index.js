'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = '.pm-copilot.json';

/**
 * Lee `.pm-copilot.json` de la raíz del proyecto si existe. No es un error
 * que no exista todavía — para cualquier proyecto de hoy (y hasta que la
 * fase de aprovisionamiento de modo cloud del skill exista), simplemente no
 * hay archivo y el proyecto es 100% local, que es el comportamiento por
 * defecto.
 */
function readCloudConfig(projectPath) {
  const configPath = path.join(projectPath, CONFIG_FILE_NAME);
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.warn(`[dataBackend] ${CONFIG_FILE_NAME} existe pero no se pudo leer (${err.message}) — usando backend local.`);
    return null;
  }
}

/**
 * Resuelve qué backend de datos usar para un proyecto. Nunca lanza: si el
 * proyecto no está configurado para modo cloud, o si lo está pero el backend
 * cloud no está disponible por cualquier motivo (todavía no existe, fallo de
 * conexión, credenciales ausentes...), degrada siempre a local — el modo
 * cloud es aditivo y opcional, nunca debe poder romper el dashboard.
 *
 * @param {string} projectPath
 * @returns {import('./contract').DataBackend}
 */
function getBackend(projectPath) {
  const config = readCloudConfig(projectPath);
  if (!config || config.modo !== 'nube') {
    return require('./local');
  }
  try {
    // eslint-disable-next-line global-require
    const cloud = require('./cloud');
    return cloud.init(config);
  } catch (err) {
    console.warn(`[dataBackend] Backend cloud no disponible (${err.message}) — usando backend local.`);
    return require('./local');
  }
}

module.exports = { getBackend, readCloudConfig, CONFIG_FILE_NAME };
