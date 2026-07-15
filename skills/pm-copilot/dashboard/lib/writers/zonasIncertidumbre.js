'use strict';

const path = require('path');
const { upsertRow } = require('./tableWriter');

const REL_PATH = 'output-paso-0/zonas-incertidumbre.md';

const FIELD_MAP = {
  zona: 'Zona',
  descripcion: 'Descripción',
  porQueEsIncierto: 'Por qué es incierto',
  afecta: 'Afecta a',
  pregunta: 'Pregunta para resolverlo',
  recomendacionPorDefecto: 'Recomendación por defecto (80/20)',
};

function toColumnFields(payload) {
  const fields = {};
  for (const [key, value] of Object.entries(payload || {})) {
    const col = FIELD_MAP[key];
    if (col) fields[col] = value;
  }
  return fields;
}

function plantillaVacia() {
  return [
    '# Zonas de Incertidumbre',
    '',
    '**Fecha última actualización:** —',
    '**Propósito:** Identificar lo que el cliente no sabe, no ha detallado o ha dejado ambiguo, y las asunciones que la IA tuvo que tomar.',
    '',
    '## Zonas identificadas',
    '',
    '| ID | Zona | Descripción | Por qué es incierto | Afecta a | Pregunta para resolverlo | Recomendación por defecto (80/20) |',
    '|---|---|---|---|---|---|---|',
    '',
  ].join('\n');
}

function writeZonaIncertidumbre(projectPath, id, payload) {
  const filePath = path.join(projectPath, REL_PATH);
  const fields = toColumnFields(payload);
  return upsertRow(filePath, ['zonas identificadas', 'zonas de incertidumbre'], id, fields, { idPrefix: 'ZI', plantillaSiNoExiste: plantillaVacia });
}

module.exports = { writeZonaIncertidumbre, REL_PATH, FIELD_MAP };
