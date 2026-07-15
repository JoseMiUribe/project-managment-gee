'use strict';

const fs = require('fs');
const path = require('path');

const { parseRiesgos } = require('./parsers/riesgos');
const { parseDependencias } = require('./parsers/dependencias');
const { parseAcciones } = require('./parsers/acciones');
const { parseImpedimentos } = require('./parsers/impedimentos');
const { parseChangelog } = require('./parsers/changelog');
const { parseDailylogs } = require('./parsers/dailylog');
const { parseEpicas } = require('./parsers/epicas');
const { parseCapacidad } = require('./parsers/capacidad');
const { parseRoadmapTecnico } = require('./parsers/roadmapTecnico');
const { parseRoadmapCliente } = require('./parsers/roadmapCliente');
const { parseBacklogDetalle } = require('./parsers/backlogDetalle');
const { parseSprintBacklogs } = require('./parsers/sprintBacklog');
const { parseAnalisisJira } = require('./parsers/analisisJira');
const { parseLegacy } = require('./parsers/legacy');
const { parseRequisitos } = require('./parsers/requisitos');
const { parseCambiosPendientes } = require('./parsers/cambiosPendientes');
const { getLockedHuIds, isSprintActive } = require('./sprintLock');

const CACHE_FILE_NAME = '.pm-copilot-cache.json';

function ragKey(value) {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes('verde')) return 'verde';
  if (v.includes('amarillo')) return 'amarillo';
  if (v.includes('rojo')) return 'rojo';
  return null;
}

function countByRag(items, field) {
  const counts = { verde: 0, amarillo: 0, rojo: 0 };
  for (const item of items) {
    const key = ragKey(item[field]);
    if (key) counts[key]++;
  }
  return counts;
}

function parsePts(value) {
  if (!value) return null;
  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

function computeSprintCompletionPct(sprintActivo) {
  if (!sprintActivo || !sprintActivo.hu || sprintActivo.hu.length === 0) return null;
  const total = sprintActivo.hu.length;
  const hechas = sprintActivo.hu.filter((hu) => /hecho|terminad|complet|✅/i.test(hu.estado || '')).length;
  return Math.round((hechas / total) * 1000) / 10;
}

function computeVelocidadPorSprint(sprints) {
  return sprints.map((sprint) => {
    const ocupada = parsePts(sprint.capacidadOcupada);
    return { sprint: sprint.numero, ptsCompletados: ocupada };
  });
}

/**
 * Fusiona las épicas locales (narrativa: objetivo, dependencias, riesgos,
 * prioridad, fase — datos que Jira no tiene) con lo que devuelve Jira en
 * vivo (clave real, estado real). Nunca se descarta la narrativa local por
 * no tener equivalente en Jira; nunca se descarta una épica que Jira ya
 * tenga aunque no esté (todavía) en epicas.md.
 */
function mergeEpicasConJira(epicasLocales, epicasJira) {
  if (!epicasJira || epicasJira.length === 0) return epicasLocales;
  const porId = new Map(epicasLocales.map((e) => [e.id.toUpperCase(), e]));
  for (const ej of epicasJira) {
    const key = ej.id.toUpperCase();
    if (porId.has(key)) {
      Object.assign(porId.get(key), { claveJira: ej.claveJira, estadoJira: ej.estadoJira });
    } else {
      porId.set(key, {
        id: ej.id,
        nombre: ej.nombreJira,
        objetivo: '',
        requisitos: '',
        dependencias: '',
        decisionPendiente: '',
        riesgosAsociados: '',
        prioridad: '',
        notas: 'Existe en Jira pero no en epicas.md local — añadida automáticamente en la sincronización.',
        fase: null,
        claveJira: ej.claveJira,
        estadoJira: ej.estadoJira,
      });
    }
  }
  return Array.from(porId.values());
}

/**
 * Orquesta todos los parsers sobre projectPath y devuelve el snapshot único.
 * También lo persiste como caché en `<projectPath>/.pm-copilot-cache.json`.
 *
 * @param {string} projectPath
 * @param {Object} [options]
 * @param {Object} [options.liveJira] snapshot en vivo de jiraClient.fetchJiraSnapshot
 *   (épicas, sprints, historias). Si se pasa, sustituye los sprints locales
 *   (basados en sprint-backlog-N.md) por el estado real de Jira, y añade
 *   claveJira/estadoJira a las épicas locales. Si no se pasa, el
 *   comportamiento es exactamente el de antes (100% local).
 * @returns {Object}
 */
function buildSnapshot(projectPath, options) {
  const liveJira = options && options.liveJira ? options.liveJira : null;

  const riesgos = parseRiesgos(projectPath);
  const dependencias = parseDependencias(projectPath);
  const acciones = parseAcciones(projectPath);
  const impedimentos = parseImpedimentos(projectPath);
  const changelog = parseChangelog(projectPath);
  const dailylogs = parseDailylogs(projectPath);

  const epicasLocales = parseEpicas(projectPath);
  const epicas = liveJira ? mergeEpicasConJira(epicasLocales, liveJira.epicas) : epicasLocales;
  const capacidadActual = parseCapacidad(projectPath);
  const roadmapTecnico = parseRoadmapTecnico(projectPath);
  const roadmapCliente = parseRoadmapCliente(projectPath);
  const backlogDetalle = parseBacklogDetalle(projectPath);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let sprints;
  if (liveJira) {
    // Fuente de verdad: Jira en vivo. El "activo" ya viene resuelto por
    // jiraClient a partir del estado real del sprint en el board (no por
    // fechas), y el bloqueo de HU se calcula sobre esas mismas HU.
    const lockedFromJira = new Set();
    for (const sprint of liveJira.sprints) {
      if (sprint.activo) {
        for (const hu of sprint.hu) if (hu.hu) lockedFromJira.add(hu.hu.trim());
      }
    }
    sprints = liveJira.sprints.map((sprint) => ({
      ...sprint,
      hu: sprint.hu.map((hu) => ({ ...hu, locked: hu.hu ? lockedFromJira.has(hu.hu.trim()) : false })),
      origen: 'jira',
    }));
  } else {
    const sprintsRaw = parseSprintBacklogs(projectPath);
    const lockedHuIds = getLockedHuIds(projectPath);
    sprints = sprintsRaw.map((sprint) => ({
      numero: sprint.numero,
      fechas: sprint.fechas,
      fechaInicio: sprint.fechaInicio,
      fechaFin: sprint.fechaFin,
      objetivo: sprint.objetivo,
      capacidadDisponible: sprint.capacidadDisponible,
      capacidadOcupada: sprint.capacidadOcupada,
      nuevosRiesgos: sprint.nuevosRiesgos,
      hu: sprint.hu.map((hu) => ({
        ...hu,
        locked: hu.hu ? lockedHuIds.has(hu.hu.trim()) : false,
      })),
      activo: isSprintActive(sprint, projectPath, today),
      origen: 'local',
    }));
  }

  const analisisJira = parseAnalisisJira(projectPath);

  const legacy = parseLegacy(projectPath);
  const paso0 = parseRequisitos(projectPath);
  const cambiosPendientes = parseCambiosPendientes(projectPath);

  const sprintActivo = sprints.find((s) => s.activo) || null;

  const metricas = {
    sprintCompletionPct: computeSprintCompletionPct(sprintActivo),
    riesgosPorRag: countByRag(riesgos, 'rag'),
    dependenciasPorCriticidad: countByRag(dependencias, 'criticidadRag'),
    velocidadPorSprint: computeVelocidadPorSprint(sprints),
    impedimentosAbiertos: impedimentos.filter((im) => !im.fechaFin || !im.fechaFin.trim()).length,
  };

  const snapshot = {
    proyecto: {
      nombre: path.basename(projectPath),
      rutaAbsoluta: path.resolve(projectPath),
      generadoEn: new Date().toISOString(),
      jiraSyncedAt: liveJira ? liveJira.obtenidoEn : null,
      jiraFuenteViva: Boolean(liveJira),
    },
    gee: {
      riesgos,
      dependencias,
      acciones,
      impedimentos,
      changelog,
      dailylogs,
    },
    roadmap: {
      epicas,
      capacidadActual,
      roadmapTecnico,
      roadmapCliente,
      backlogDetalle,
    },
    sprint: {
      sprints,
      analisisJira,
    },
    requisitos: {
      legacy,
      paso0,
    },
    cambiosPendientes,
    metricas,
  };

  try {
    const cachePath = path.join(projectPath, CACHE_FILE_NAME);
    fs.writeFileSync(cachePath, JSON.stringify(snapshot, null, 2), 'utf8');
  } catch (err) {
    console.error('[buildSnapshot] No se pudo escribir la caché:', err.message);
  }

  return snapshot;
}

module.exports = { buildSnapshot, CACHE_FILE_NAME };
