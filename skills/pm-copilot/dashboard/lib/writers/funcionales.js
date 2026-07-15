'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-0/requisitos-funcionales.md';

const FIELD_MAP = {
  modulo: 'Módulo/Área',
  descripcion: 'Descripción',
  actor: 'Actor/Rol',
  prioridad: 'Prioridad (MoSCoW)',
  origen: 'Origen',
  dependencias: 'Dependencias',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

/**
 * Escribe en la tabla "## Requisitos funcionales" — si el proyecto tiene
 * legacy y usa las subsecciones "Nuevos requisitos funcionales" /
 * "Modificaciones a RFs existentes" (ver prompts/paso-0/procesar-respuestas.md,
 * punto g), edita a mano esa fila desde el propio archivo: este writer
 * asume el formato de tabla única más común.
 */
function plantillaVacia() {
  return [
    '# Requisitos Funcionales',
    '',
    '**Fecha última actualización:** —',
    '**Basado en:** peticiones-cliente.md',
    '',
    '## Requisitos funcionales',
    '',
    '| ID | Módulo/Área | Descripción | Actor/Rol | Prioridad (MoSCoW) | Origen | Dependencias |',
    '|---|---|---|---|---|---|---|',
    '',
  ].join('\n');
}

function writeFuncional(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['requisitos funcionales'], id, fields, { idPrefix: 'RF', plantillaSiNoExiste: plantillaVacia });
}

module.exports = { writeFuncional, REL_PATH, FIELD_MAP };
