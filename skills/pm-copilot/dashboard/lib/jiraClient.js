'use strict';

const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Cliente de Jira de solo lectura para el dashboard.
 *
 * Principio de seguridad (ver prompts/transversal/conectar-jira.md): el
 * token NUNCA vive en un archivo del proyecto ni pasa por el asistente.
 * Vive como variable de entorno del proceso que arranca `node server.js`
 * (JIRA_EMAIL, JIRA_API_TOKEN) — este módulo solo la lee en tiempo de
 * ejecución para construir la cabecera Authorization de cada petición.
 *
 * Este módulo NUNCA escribe en Jira (no hay ninguna llamada POST/PUT/DELETE
 * aquí) — coherente con el alcance de solo lectura de `analizar-jira.md`.
 */

const CONFIG_REL_PATH = path.join('config', 'jira-project.json');

function readProjectConfig(projectPath) {
  const configPath = path.join(projectPath, CONFIG_REL_PATH);
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error('[jiraClient] config/jira-project.json existe pero no es JSON válido:', err.message);
    return null;
  }
}

function isJiraConfigured(projectPath) {
  const cfg = readProjectConfig(projectPath);
  return Boolean(cfg && cfg.baseUrl && cfg.projectKey && cfg.boardId);
}

/**
 * Lee una variable de entorno con un fallback a consulta directa del
 * registro de Windows (usuario actual).
 *
 * Por qué existe este fallback: `process.env` solo refleja el bloque de
 * entorno heredado en el momento en que se creó el proceso de Node. Si el
 * usuario configura la variable (p. ej. con `setx`) y el proceso del
 * dashboard — o alguno de sus antecesores — ya estaba corriendo desde
 * antes, `process.env` puede quedar desactualizado indefinidamente aunque
 * se reinicien procesos intermedios. La consulta directa al registro
 * siempre devuelve el valor vigente. Es Windows-only (coherente con el
 * resto de este proyecto, que ya asume PowerShell); en otros sistemas
 * operativos se ignora el fallback y basta con `process.env`.
 */
function getWindowsUserEnvVar(name) {
  if (process.platform !== 'win32') return null;
  try {
    const out = execFileSync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', `[System.Environment]::GetEnvironmentVariable('${name}','User')`],
      { timeout: 5000 }
    )
      .toString()
      .trim();
    return out || null;
  } catch (err) {
    return null;
  }
}

function getCredential(name) {
  const fromProcess = (process.env[name] || '').trim();
  if (fromProcess) return fromProcess;
  return getWindowsUserEnvVar(name) || '';
}

function credentialsAvailable() {
  return Boolean(getCredential('JIRA_EMAIL') && getCredential('JIRA_API_TOKEN'));
}

function jiraRequest(baseUrl, apiPath, { method = 'GET', body } = {}) {
  return new Promise((resolve, reject) => {
    const email = getCredential('JIRA_EMAIL');
    const token = getCredential('JIRA_API_TOKEN');
    if (!email || !token) {
      return reject(
        new Error(
          'Faltan JIRA_EMAIL / JIRA_API_TOKEN como variables de entorno del proceso que ejecuta el dashboard. ' +
            'Configúralas en tu sistema (ver config/jira-project.md) y reinicia el dashboard.'
        )
      );
    }
    const auth = Buffer.from(email + ':' + token).toString('base64');
    const url = new URL(baseUrl.replace(/\/$/, '') + apiPath);
    const payload = body ? JSON.stringify(body) : null;

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method,
        headers: Object.assign(
          {
            Authorization: 'Basic ' + auth,
            Accept: 'application/json',
          },
          payload ? { 'Content-Type': 'application/json' } : {}
        ),
        timeout: 15000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : null);
            } catch (err) {
              reject(new Error('Respuesta de Jira no es JSON válido en ' + apiPath + ': ' + err.message));
            }
          } else {
            reject(new Error('Jira respondió ' + res.statusCode + ' en ' + apiPath + ': ' + data.slice(0, 500)));
          }
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout consultando Jira (' + apiPath + ')'));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * Descubre los IDs de campo (Epic Link, Sprint, Story Points, Epic Name)
 * inspeccionando /rest/api/3/field. Los campos personalizados varían de una
 * instancia de Jira a otra — nunca se asumen fijos.
 */
async function discoverFieldIds(baseUrl) {
  const fields = await jiraRequest(baseUrl, '/rest/api/3/field');
  const byCustomType = (substr) =>
    fields.find((f) => f.schema && f.schema.custom && f.schema.custom.includes(substr));

  const epicLink = byCustomType('gh-epic-link');
  const sprint = byCustomType('gh-sprint');
  const epicName = byCustomType('gh-epic-label');
  const storyPoints =
    fields.find(
      (f) =>
        f.schema &&
        f.schema.custom === 'com.atlassian.jira.plugin.system.customfieldtypes:float' &&
        /story\s*point/i.test(f.name || '')
    ) || fields.find((f) => /story\s*point/i.test(f.name || ''));

  return {
    epicLinkFieldId: epicLink ? epicLink.id : null,
    sprintFieldId: sprint ? sprint.id : null,
    epicNameFieldId: epicName ? epicName.id : null,
    storyPointsFieldId: storyPoints ? storyPoints.id : null,
  };
}

function extractSprintNumero(nombreJira, fallbackId) {
  const match = String(nombreJira || '').match(/sprint\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : fallbackId;
}

/**
 * Trae el estado actual de épicas, sprints e historias del proyecto/board
 * indicados. Es de solo lectura: ninguna llamada de este módulo modifica
 * nada en Jira.
 *
 * @param {Object} cfg { baseUrl, projectKey, boardId, fieldIds? }
 * @returns {Promise<Object>} snapshot en bruto, listo para mapear en buildSnapshot
 */
async function fetchJiraSnapshot(cfg) {
  const { baseUrl, projectKey, boardId } = cfg;
  const fieldIds = cfg.fieldIds && Object.values(cfg.fieldIds).some(Boolean)
    ? cfg.fieldIds
    : await discoverFieldIds(baseUrl);

  const boardSprints = await jiraRequest(
    baseUrl,
    `/rest/agile/1.0/board/${boardId}/sprint?state=active,future,closed&maxResults=50`
  );

  const wantedFields = ['summary', 'issuetype', 'status', 'assignee']
    .concat([fieldIds.epicLinkFieldId, fieldIds.sprintFieldId, fieldIds.storyPointsFieldId].filter(Boolean));

  const searchBody = {
    jql: `project = ${projectKey} ORDER BY created ASC`,
    maxResults: 300,
    fields: wantedFields,
  };
  const searchResult = await jiraRequest(baseUrl, '/rest/api/3/search/jql', { method: 'POST', body: searchBody });
  const issues = (searchResult && searchResult.issues) || [];

  const epicas = issues
    .filter((i) => (i.fields.issuetype && i.fields.issuetype.name || '').toLowerCase() === 'epic')
    .map((i) => {
      const idMatch = (i.fields.summary || '').match(/EP-\d+/i);
      return {
        id: idMatch ? idMatch[0].toUpperCase() : i.key,
        claveJira: i.key,
        nombreJira: i.fields.summary || '',
        estadoJira: (i.fields.status && i.fields.status.name) || '',
      };
    });

  const epicKeyToId = {};
  for (const e of epicas) epicKeyToId[e.claveJira] = e.id;

  function resolveSprintIds(issue) {
    if (!fieldIds.sprintFieldId) return [];
    const raw = issue.fields[fieldIds.sprintFieldId];
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map((sp) => (typeof sp === 'object' && sp !== null ? Number(sp.id) : Number(sp))).filter((n) => !Number.isNaN(n));
  }

  const sprints = ((boardSprints && boardSprints.values) || []).map((s) => {
    const sprintIssues = issues.filter((i) => resolveSprintIds(i).includes(s.id));

    const hu = sprintIssues
      .filter((i) => (i.fields.issuetype && i.fields.issuetype.name || '').toLowerCase() !== 'epic')
      .map((i) => {
        const epicLinkValue = fieldIds.epicLinkFieldId ? i.fields[fieldIds.epicLinkFieldId] : null;
        const epicKey = typeof epicLinkValue === 'object' && epicLinkValue !== null ? epicLinkValue.key : epicLinkValue;
        return {
          hu: i.key,
          titulo: i.fields.summary || '',
          tallas:
            fieldIds.storyPointsFieldId && i.fields[fieldIds.storyPointsFieldId] != null
              ? String(i.fields[fieldIds.storyPointsFieldId])
              : '',
          tareas: '',
          responsable: (i.fields.assignee && i.fields.assignee.displayName) || '',
          estado: (i.fields.status && i.fields.status.name) || '',
          epicId: epicKey ? epicKeyToId[epicKey] || epicKey : null,
        };
      });

    const capacidadOcupada = hu.reduce((sum, h) => sum + (parseFloat(h.tallas) || 0), 0);

    return {
      numero: extractSprintNumero(s.name, s.id),
      nombreJira: s.name,
      fechas: (s.startDate ? s.startDate.slice(0, 10) : '?') + ' - ' + (s.endDate ? s.endDate.slice(0, 10) : '?'),
      fechaInicio: s.startDate ? s.startDate.slice(0, 10) : '',
      fechaFin: s.endDate ? s.endDate.slice(0, 10) : '',
      objetivo: s.goal || '',
      capacidadDisponible: '',
      capacidadOcupada: capacidadOcupada ? String(capacidadOcupada) : '',
      hu,
      nuevosRiesgos: [],
      estadoJira: s.state,
      activo: s.state === 'active',
    };
  });

  return {
    obtenidoEn: new Date().toISOString(),
    baseUrl,
    projectKey,
    boardId,
    fieldIdsUsados: fieldIds,
    epicas,
    sprints,
    totalIssues: issues.length,
  };
}

module.exports = {
  isJiraConfigured,
  credentialsAvailable,
  readProjectConfig,
  fetchJiraSnapshot,
  discoverFieldIds,
  CONFIG_REL_PATH,
};
