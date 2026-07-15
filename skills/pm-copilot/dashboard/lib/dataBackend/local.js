'use strict';

const path = require('path');
const { buildSnapshot } = require('../buildSnapshot');
const { upsertRow } = require('../writers/tableWriter');
const { appendDailylogNota } = require('../writers/dailylog');
const { logCambioPendiente: logCambioPendienteMd } = require('../writers/cambiosPendientes');
const { TIPO_DESCRIPTORS } = require('./tipoDescriptors');

/**
 * Backend "de siempre": Markdown + `fs`, sin ningún cambio de comportamiento
 * respecto al código que reemplaza — ver dashboard/lib/writers/tableWriter.js
 * para el detalle de cómo se localiza/edita/crea una fila. La única adición
 * real de esta fase son las dos columnas de auditoría (`Última modificación`,
 * `Modificado por`), que se estampan aquí, no en cada tipo — así no hace
 * falta repetirlas en las 9 entradas de tipoDescriptors.js.
 */

function toColumnFields(payload, fieldMap) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = fieldMap[key];
    if (col) fields[col] = value;
  }
  return fields;
}

async function readSnapshot(projectPath, options) {
  return buildSnapshot(projectPath, options);
}

async function writeRow(projectPath, tipo, id, fields, meta) {
  const descriptor = TIPO_DESCRIPTORS[tipo];
  if (!descriptor) {
    throw new Error(`Tipo de registro desconocido: "${tipo}"`);
  }
  const filePath = path.join(projectPath, descriptor.relPath);
  const mappedFields = toColumnFields(fields, descriptor.fieldMap);
  // Estampado de auditoría en cada escritura — groundwork para el modo
  // cloud (ver mejoras-pendientes.md): permite saber si la última mano que
  // tocó una fila fue el skill o el propio dashboard, y cuándo.
  mappedFields['Última modificación'] = new Date().toISOString();
  mappedFields['Modificado por'] = (meta && meta.origen) || 'skill';
  return upsertRow(filePath, descriptor.headingCandidates, id, mappedFields, {
    idPrefix: descriptor.idPrefix,
    plantillaSiNoExiste: descriptor.plantillaSiNoExiste,
  });
}

async function appendDailylog(projectPath, fecha, payload) {
  return appendDailylogNota(projectPath, fecha, payload);
}

async function logCambioPendiente(projectPath, entry) {
  return logCambioPendienteMd(projectPath, entry);
}

function kind() {
  return 'local';
}

module.exports = { readSnapshot, writeRow, appendDailylog, logCambioPendiente, kind };
