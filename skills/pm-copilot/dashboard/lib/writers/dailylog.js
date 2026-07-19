'use strict';

const fs = require('fs');
const path = require('path');
const { DAILYLOG_DIR } = require('../parsers/dailylog');

/**
 * Permite añadir una nota suelta al daily log del día (creando el archivo del
 * día si todavía no existe) sin tener que regenerar el daily completo con el
 * skill. Disponible desde el primer día del proyecto, no solo durante un
 * sprint activo — ver prompts/paso-4/daily-log.md.
 *
 * Cada nota queda atribuida a su autor (PM/ADL o "Skill" si la añade el
 * propio asistente) con fecha y hora, como prepara la trazabilidad para
 * cuando el dashboard tenga varios usuarios.
 */

function pad(n) {
  return String(n).padStart(2, '0');
}

function nowFechaHora() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowFecha() {
  return nowFechaHora().slice(0, 10);
}

function plantillaVacia(fecha) {
  return [
    `# Daily — ${fecha}`,
    '',
    '**Sprint — | Día — de —**',
    '',
    '## Progreso',
    '',
    '| HU | Estado | Lo que se hizo | Lo que se hará | Bloqueos |',
    '|---|---|---|---|---|',
    '',
    '## Actualizaciones GEE',
    '',
    'Ninguna.',
    '',
    '## Notas',
    '',
    '',
  ].join('\n');
}

/**
 * @param {string} projectPath
 * @param {string|null} fechaInput "YYYY-MM-DD", o null para usar hoy
 * @param {{autor: string, texto: string}} payload
 * @returns {{fecha: string, filePath: string, created: boolean}}
 */
function appendDailylogNota(projectPath, fechaInput, payload) {
  const texto = (payload && payload.texto) || '';
  if (!texto.trim()) {
    throw new Error('La nota no puede estar vacía.');
  }

  const fecha = fechaInput || nowFecha();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error(`Fecha inválida: "${fecha}" (se espera YYYY-MM-DD)`);
  }

  const dir = path.join(projectPath, DAILYLOG_DIR);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${fecha}.md`);

  const created = !fs.existsSync(filePath);
  let content = created ? plantillaVacia(fecha) : fs.readFileSync(filePath, 'utf8');

  const autorFinal = (payload.autor && payload.autor.trim()) || 'Sin especificar';
  // Asociación opcional con otros registros del GEE (riesgos/dependencias/
  // acciones/impedimentos/cambios de alcance) para poder trazar después qué
  // pasó y con qué se relacionaba — ver parsers/dailylog.js para el parseo
  // de vuelta. Se codifica como sufijo de la propia línea de la nota en vez
  // de añadir una columna/estructura nueva, para no romper el formato ya
  // existente de "## Notas" (una nota = una línea).
  const relacionados = Array.isArray(payload.relacionados) ? payload.relacionados.filter(Boolean) : [];
  const sufijoRelacion = relacionados.length ? ` (relacionado con: ${relacionados.join(', ')})` : '';
  const linea = `- **[${nowFechaHora()}] ${autorFinal}:** ${texto.trim()}${sufijoRelacion}`;

  const headingMatch = content.match(/^##\s+Notas\s*$/m);
  if (!headingMatch) {
    // No debería pasar con la plantilla propia, pero por si el archivo se
    // editó a mano sin sección "## Notas" — se añade al final en vez de fallar.
    content = content.replace(/\s*$/, '') + '\n\n## Notas\n\n' + linea + '\n';
  } else {
    const headingIdx = headingMatch.index;
    const headingLineEnd = content.indexOf('\n', headingIdx);
    const before = content.slice(0, headingLineEnd + 1);
    const afterHeading = content.slice(headingLineEnd + 1);
    const nextHeadingRel = afterHeading.search(/^##\s+/m);
    const sectionBody = nextHeadingRel === -1 ? afterHeading : afterHeading.slice(0, nextHeadingRel);
    const rest = nextHeadingRel === -1 ? '' : afterHeading.slice(nextHeadingRel);
    const newSectionBody = sectionBody.replace(/\s*$/, '') + '\n' + linea + '\n\n';
    content = before + newSectionBody + rest;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return { fecha, filePath, created };
}

module.exports = { appendDailylogNota };
