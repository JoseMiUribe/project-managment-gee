'use strict';

const { parseSprintBacklogs, reviewExistsForSprint } = require('./parsers/sprintBacklog');

/**
 * Determina si un sprint es "activo" según estas reglas (cualquiera basta):
 *  - Su rango de fechas [inicio, fin] incluye la fecha de hoy.
 *  - No tiene fecha de fin declarada.
 *  - No existe un review-sprint-N.md correspondiente (señal de que no se ha
 *    cerrado formalmente, aunque las fechas ya hayan pasado).
 *
 * @param {Object} sprint objeto devuelto por parseSprintBacklogs
 * @param {string} projectPath
 * @param {Date} today
 */
function isSprintActive(sprint, projectPath, today) {
  const fin = parseFecha(sprint.fechaFin);
  const inicio = parseFecha(sprint.fechaInicio);

  if (!fin) return true; // sin fecha de fin -> se considera activo
  if (inicio && today >= inicio && today <= fin) return true;

  const hasReview = reviewExistsForSprint(projectPath, sprint.numero);
  if (!hasReview) return true;

  return false;
}

function parseFecha(str) {
  if (!str) return null;
  const match = String(str).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

/**
 * @param {string} projectPath
 * @returns {Set<string>} IDs de HU (HU-XXX) que están en algún sprint activo
 */
function getLockedHuIds(projectPath) {
  const sprints = parseSprintBacklogs(projectPath);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const locked = new Set();
  for (const sprint of sprints) {
    if (isSprintActive(sprint, projectPath, today)) {
      for (const hu of sprint.hu) {
        if (hu.hu) locked.add(hu.hu.trim());
      }
    }
  }
  return locked;
}

/**
 * @param {string} projectPath
 * @returns {Set<number>} números de sprint activos
 */
function getActiveSprintNumbers(projectPath) {
  const sprints = parseSprintBacklogs(projectPath);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const active = new Set();
  for (const sprint of sprints) {
    if (isSprintActive(sprint, projectPath, today)) {
      active.add(sprint.numero);
    }
  }
  return active;
}

module.exports = {
  getLockedHuIds,
  getActiveSprintNumbers,
  isSprintActive,
};
