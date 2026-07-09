'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Deja constancia local de cada sincronización en vivo con Jira, con el
 * mismo formato/ubicación que `prompts/paso-4/analizar-jira.md` ya espera
 * (`output-paso-4/analisis-jira-YYYY-MM-DD.md`), para que quede trazabilidad
 * de qué se leyó y cuándo, aunque la fuente de verdad en pantalla sea la
 * llamada en vivo, no este archivo.
 *
 * Si ya existe un archivo del mismo día, se sobrescribe (una sincronización
 * por día es lo razonable para el registro; el detalle en vivo siempre se
 * pide de nuevo al pulsar "Actualizar").
 */
function writeJiraSnapshotRecord(projectPath, jiraData) {
  const dir = path.join(projectPath, 'output-paso-4');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  const filePath = path.join(dir, `analisis-jira-${today}.md`);

  const totalHu = jiraData.sprints.reduce((sum, s) => sum + s.hu.length, 0);
  const activo = jiraData.sprints.find((s) => s.activo);

  const lines = [];
  lines.push(`# Análisis de Jira — ${today}`);
  lines.push('');
  lines.push('## Resumen ejecutivo');
  lines.push('');
  lines.push(
    `Sincronización en vivo desde el dashboard (${jiraData.obtenidoEn}), solo lectura. ` +
      `${jiraData.epicas.length} épicas, ${jiraData.sprints.length} sprints, ${totalHu} historias leídas de ${jiraData.projectKey}. ` +
      (activo
        ? `Sprint activo en Jira: "${activo.nombreJira}" (${activo.hu.length} historias).`
        : 'Ningún sprint marcado como activo en Jira en este momento.')
  );
  lines.push('');
  lines.push('## Estado por HU');
  lines.push('');
  lines.push('| Clave Jira | Épica | Sprint | Estado | Responsable | Puntos |');
  lines.push('|---|---|---|---|---|---|');
  for (const sprint of jiraData.sprints) {
    for (const hu of sprint.hu) {
      lines.push(
        `| ${hu.hu} | ${hu.epicId || '—'} | ${sprint.nombreJira || sprint.numero} | ${hu.estado || '—'} | ${hu.responsable || '—'} | ${hu.tallas || '—'} |`
      );
    }
  }
  lines.push('');

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  return filePath;
}

module.exports = { writeJiraSnapshotRecord };
