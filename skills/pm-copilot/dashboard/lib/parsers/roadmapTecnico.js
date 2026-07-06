'use strict';

const fs = require('fs');
const path = require('path');
const { parseMarkdownTables, findTableByHeading, getCell } = require('../markdownTable');
const { parseKeyValueBlock, getValue, splitByHeading } = require('../keyValueBlock');

const REL_PATH = 'output-paso-2/roadmap-tecnico.md';

function parseResumenCapacidad(tables) {
  const table = findTableByHeading(tables, ['resumen de capacidad']);
  if (!table) return null;
  const resumen = {};
  for (const row of table.rows) {
    const metrica = getCell(row, 'Métrica');
    const valor = getCell(row, 'Valor');
    if (metrica) resumen[metrica.trim()] = (valor || '').trim();
  }
  return resumen;
}

function parseSprintsSection(text) {
  // Bloques "### Sprint N — [Fechas]" hasta el siguiente "### " o el próximo "## "
  const blocks = splitByHeading(text, /^###\s+(Sprint\s+\d+[^\n]*)$/m);
  return blocks.map(({ title, body }) => {
    // El body incluye la propia línea de heading ("### Sprint N — ...") como
    // primera línea; hay que saltarla entera (no solo 1 carácter) antes de
    // buscar el siguiente heading de nivel 2 o 3, si no el regex se
    // re-matchea contra sí mismo en la posición 0.
    const firstLineEnd = body.indexOf('\n');
    const afterFirstLine = firstLineEnd >= 0 ? body.slice(firstLineEnd + 1) : '';
    const nextHeadingIdx = afterFirstLine.search(/^#{2,3}\s+/m);
    const scoped = nextHeadingIdx >= 0 ? afterFirstLine.slice(0, nextHeadingIdx) : afterFirstLine;

    const kv = parseKeyValueBlock(scoped);
    const numMatch = title.match(/Sprint\s+(\d+)/i);
    const fechasMatch = title.match(/—\s*(.*)$/) || title.match(/-\s*(.*)$/);

    // Asignación: líneas tipo "- [Nombre/perfil]: [HU-XXX, HU-XXX]"
    const asignacion = [];
    const asigSection = scoped.match(/\*\*Asignación:\*\*([\s\S]*?)(?:\n\*\*|$)/);
    if (asigSection) {
      const lines = asigSection[1].split(/\r?\n/);
      for (const line of lines) {
        const m = line.match(/^\s*-\s*([^:]+):\s*(.*)$/);
        if (m) asignacion.push({ quien: m[1].trim(), hus: m[2].trim() });
      }
    }

    return {
      numero: numMatch ? parseInt(numMatch[1], 10) : null,
      fechas: fechasMatch ? fechasMatch[1].trim() : '',
      objetivo: getValue(kv, 'Objetivo') || '',
      capacidadDisponible: getValue(kv, 'Capacidad disponible') || '',
      huEpicasPlanificadas: getValue(kv, 'HU/épicas planificadas') || '',
      dependenciasAResolver: getValue(kv, 'Dependencias a resolver') || '',
      accionesDeRiesgo: getValue(kv, 'Acciones de riesgo') || '',
      asignacion,
      riesgosDelSprint: getValue(kv, 'Riesgos del sprint') || '',
    };
  });
}

function mapDeadlineDependencia(row) {
  return {
    dp: getCell(row, 'DP') || '',
    descripcion: getCell(row, 'Descripción') || '',
    fechaLimite: getCell(row, 'Fecha límite') || '',
    sprint: getCell(row, '¿En qué sprint?') || getCell(row, 'Sprint') || '',
    responsable: getCell(row, 'Responsable de resolver') || getCell(row, 'Responsable') || '',
    estado: getCell(row, 'Estado') || '',
  };
}

function mapDeadlineAccion(row) {
  return {
    a: getCell(row, 'A') || '',
    descripcion: getCell(row, 'Descripción') || '',
    fechaLimite: getCell(row, 'Fecha límite') || '',
    sprint: getCell(row, 'Sprint') || '',
    responsable: getCell(row, 'Responsable') || '',
    estado: getCell(row, 'Estado') || '',
  };
}

function mapHitoTecnico(row) {
  return {
    hito: getCell(row, 'Hito') || '',
    fecha: getCell(row, 'Fecha') || '',
    sprint: getCell(row, 'Sprint') || '',
    queValida: getCell(row, '¿Qué valida?') || '',
  };
}

function mapRiesgoRoadmap(row) {
  return {
    riesgo: getCell(row, 'Riesgo') || '',
    impactoEnFechas: getCell(row, 'Impacto en fechas') || '',
    planContingencia: getCell(row, 'Plan de contingencia') || '',
  };
}

function parseRoadmapTecnico(projectPath) {
  try {
    const filePath = path.join(projectPath, REL_PATH);
    if (!fs.existsSync(filePath)) return null;
    const text = fs.readFileSync(filePath, 'utf8');
    const tables = parseMarkdownTables(text);

    const deadlinesDependencias = findTableByHeading(tables, ['deadlines de dependencias']);
    const deadlinesAcciones = findTableByHeading(tables, ['deadlines de acciones de riesgo']);
    const hitosTecnicos = findTableByHeading(tables, ['hitos técnicos', 'hitos tecnicos']);
    const riesgosRoadmap = findTableByHeading(tables, ['riesgos con impacto en el roadmap']);
    const proximasRevisiones = findTableByHeading(tables, ['próximos hitos de revisión', 'proximos hitos de revision']);

    return {
      resumenCapacidad: parseResumenCapacidad(tables),
      sprints: parseSprintsSection(text),
      deadlinesDependencias: deadlinesDependencias
        ? deadlinesDependencias.rows.filter((r) => (getCell(r, 'DP') || '').trim() !== '').map(mapDeadlineDependencia)
        : [],
      deadlinesAcciones: deadlinesAcciones
        ? deadlinesAcciones.rows.filter((r) => (getCell(r, 'A') || '').trim() !== '').map(mapDeadlineAccion)
        : [],
      hitosTecnicos: hitosTecnicos
        ? hitosTecnicos.rows.filter((r) => (getCell(r, 'Hito') || '').trim() !== '').map(mapHitoTecnico)
        : [],
      riesgosConImpacto: riesgosRoadmap
        ? riesgosRoadmap.rows.filter((r) => (getCell(r, 'Riesgo') || '').trim() !== '').map(mapRiesgoRoadmap)
        : [],
      proximasRevisiones: proximasRevisiones
        ? proximasRevisiones.rows.map((r) => ({
            fecha: getCell(r, 'Fecha') || '',
            queSeRevisa: getCell(r, 'Qué se revisa') || '',
          }))
        : [],
    };
  } catch (err) {
    console.error(`[parsers/roadmapTecnico] Error parseando ${REL_PATH}:`, err.message);
    return null;
  }
}

module.exports = { parseRoadmapTecnico, REL_PATH };
