/**
 * Copia casi verbatim de dashboard/lib/printView.js (modo local) — pura
 * generación de strings sin ninguna API de Node, portable tal cual a Apps
 * Script. Genera el HTML de solo lectura para la vista "informe" (equivalente
 * a /print en modo local), que el usuario abre en pestaña nueva e imprime a
 * PDF con Ctrl+P (ver doGeneratePdf en AppJs.html) — no hay generación de PDF
 * en el servidor en modo nube (no hay Playwright/Chromium disponible en Apps
 * Script). Llamada desde Code.gs#doGet cuando e.parameter.vista === 'informe'.
 *
 * Sin controles interactivos ni botones de edición. Todo en una sola página
 * larga, sección tras sección, reutilizando exactamente los mismos datos que
 * consume el dashboard interactivo (el snapshot de leerSnapshot en Code.gs).
 */

function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function table(headers, rows) {
  if (!rows || rows.length === 0) return '<p class="empty">Sin datos.</p>';
  const thead = `<tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>`;
  const tbody = rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('');
  return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}

function section(title, contentHtml) {
  return `<section class="pm-section"><h2>${esc(title)}</h2>${contentHtml}</section>`;
}

function renderRiesgos(riesgos) {
  return table(
    ['ID', 'Riesgo', 'Tipo', 'RAG', 'Estado', 'Responsable', 'Fecha update'],
    riesgos.map((r) => [r.id, r.riesgo, r.tipo, r.rag, r.estado, r.responsable, r.fechaUpdate])
  );
}

function renderDependencias(deps) {
  return table(
    ['ID', 'Equipo', 'Dependencia', 'Criticidad', 'Estado', 'Fecha compromiso'],
    deps.map((d) => [d.id, d.equipo, d.dependencia, d.criticidadRag, d.estado, d.fechaCompromiso])
  );
}

function renderAcciones(acciones) {
  return table(
    ['ID', 'Acción', 'Tipo', 'Responsable', 'Deadline', 'Estado'],
    acciones.map((a) => [a.id, a.accion, a.tipo, a.responsable, a.deadline, a.estado])
  );
}

function renderImpedimentos(imp) {
  return table(
    ['ID', 'Impedimento', 'Criticidad', 'Fecha inicio', 'Fecha fin', 'Responsable'],
    imp.map((i) => [i.id, i.impedimento, i.criticidad, i.fechaInicio, i.fechaFin, i.responsable])
  );
}

function renderChangelog(cl) {
  return table(
    ['ID', 'Título', 'Decisión', 'Comentarios'],
    cl.map((c) => [c.id, c.titulo, c.decision, c.comentarios])
  );
}

function renderEpicas(epicas) {
  return table(
    ['ID', 'Nombre', 'Objetivo', 'Prioridad', 'Fase'],
    epicas.map((e) => [e.id, e.nombre, e.objetivo, e.prioridad, e.fase])
  );
}

function renderSprints(sprints) {
  if (!sprints || sprints.length === 0) return '<p class="empty">Sin sprints registrados.</p>';
  return sprints
    .map((s) => {
      const huRows = table(
        ['HU', 'Título', 'Responsable', 'Estado', 'Bloqueada'],
        (s.hu || []).map((hu) => [hu.hu, hu.titulo, hu.responsable, hu.estado, hu.locked ? 'Sí (sprint activo)' : 'No'])
      );
      return `
        <div class="sprint-block">
          <h3>Sprint ${esc(s.numero)} ${s.activo ? '<span class="badge">ACTIVO</span>' : ''}</h3>
          <p><strong>Fechas:</strong> ${esc(s.fechas)} · <strong>Objetivo:</strong> ${esc(s.objetivo)}</p>
          <p><strong>Capacidad:</strong> ${esc(s.capacidadOcupada)} / ${esc(s.capacidadDisponible)}</p>
          ${huRows}
        </div>`;
    })
    .join('');
}

function renderLegacy(legacy) {
  if (!legacy) return '<p class="empty">Este proyecto no tiene análisis legacy (o no aplicaba).</p>';
  const r = legacy.resumen || {};
  const resumenHtml = `<p><strong>Resumen (${esc(legacy.version)}):</strong> ✅ Claro ${r.claro || 0} · ⚠️ Contradictorio ${r.contradictorio || 0} · ❓ Ambiguo ${r.ambiguo || 0} · 🔲 Inexistente ${r.inexistente || 0}</p>`;
  return (
    resumenHtml +
    table(
      ['ID', 'Aspecto', 'Estado', 'Descripción', 'Recomendación'],
      (legacy.aspectos || []).map((a) => [a.id, a.aspecto, a.estado, a.descripcion, a.recomendacion])
    )
  );
}

function renderRequisitos(paso0) {
  if (!paso0) return '<p class="empty">Todavía no se ha capturado el Paso 0.</p>';
  const r = paso0.resumen || {};
  const resumenHtml = `<p><strong>Resumen:</strong> ${r.totalFuncionales || 0} RF · ${r.totalNoFuncionales || 0} RNF (${r.noFuncionalesImplicitos || 0} implícitos sin confirmar) · ${r.totalZonasIncertidumbre || 0} zonas de incertidumbre</p>`;
  const rf = table(
    ['ID', 'Módulo', 'Descripción', 'Actor', 'Prioridad', 'Dependencias'],
    (paso0.funcionales || []).map((f) => [f.id, f.modulo, f.descripcion, f.actor, f.prioridad, f.dependencias])
  );
  const rnf = table(
    ['ID', 'Descripción', 'Categoría', 'Prioridad', '¿Implícito?'],
    (paso0.noFuncionales || []).map((n) => [n.id, n.descripcion, n.categoria, n.prioridad, n.implicito ? 'Sí, no confirmado por el cliente' : 'No'])
  );
  const zi = table(
    ['ID', 'Zona', 'Pregunta pendiente', 'Recomendación por defecto'],
    (paso0.zonasIncertidumbre || []).map((z) => [z.id, z.zona || z.descripcion, z.pregunta, z.recomendacionPorDefecto])
  );
  return (
    resumenHtml +
    '<h3>Requisitos funcionales</h3>' + rf +
    '<h3>Requisitos no funcionales</h3>' + rnf +
    '<h3>Zonas de incertidumbre</h3>' + zi
  );
}

function renderMetricas(m) {
  if (!m) return '<p class="empty">Sin métricas.</p>';
  const rag = m.riesgosPorRag || {};
  const dep = m.dependenciasPorCriticidad || {};
  return `
    <ul class="metrics-list">
      <li><strong>% avance sprint activo:</strong> ${m.sprintCompletionPct !== null && m.sprintCompletionPct !== undefined ? m.sprintCompletionPct + '%' : 'N/D'}</li>
      <li><strong>Riesgos por RAG:</strong> Verde ${rag.verde || 0} · Amarillo ${rag.amarillo || 0} · Rojo ${rag.rojo || 0}</li>
      <li><strong>Dependencias por criticidad:</strong> Verde ${dep.verde || 0} · Amarillo ${dep.amarillo || 0} · Rojo ${dep.rojo || 0}</li>
      <li><strong>Impedimentos abiertos:</strong> ${m.impedimentosAbiertos || 0}</li>
    </ul>`;
}

function renderPrintView(snapshot) {
  const { proyecto, gee, roadmap, sprint, metricas, requisitos } = snapshot;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Informe PM Copilot — ${esc(proyecto.nombre)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 24px 32px; font-size: 13px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 16px; margin-top: 28px; border-bottom: 2px solid #333; padding-bottom: 4px; }
  h3 { font-size: 14px; margin-top: 16px; }
  .meta { color: #555; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
  th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; }
  .empty { color: #888; font-style: italic; }
  .badge { background: #ffd43b; color: #333; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
  .sprint-block { margin-bottom: 20px; page-break-inside: avoid; }
  .metrics-list { list-style: none; padding: 0; }
  .metrics-list li { margin-bottom: 4px; }
  .pm-section { page-break-inside: avoid; }
  @page { margin: 15mm 12mm; }
</style>
</head>
<body>
  <h1>Informe de Proyecto — ${esc(proyecto.nombre)}</h1>
  <p class="meta">Generado el ${esc(new Date(proyecto.generadoEn).toLocaleString('es-ES'))} · Ruta: ${esc(proyecto.rutaAbsoluta)}</p>

  ${section('Métricas clave', renderMetricas(metricas))}
  ${section('Análisis Legacy (Paso -1)', renderLegacy(requisitos && requisitos.legacy))}
  ${section('Requisitos del cliente (Paso 0)', renderRequisitos(requisitos && requisitos.paso0))}
  ${section('Riesgos', renderRiesgos(gee.riesgos))}
  ${section('Dependencias', renderDependencias(gee.dependencias))}
  ${section('Acciones', renderAcciones(gee.acciones))}
  ${section('Impedimentos', renderImpedimentos(gee.impedimentos))}
  ${section('Changelog de alcance', renderChangelog(gee.changelog))}
  ${section('Épicas', renderEpicas(roadmap.epicas))}
  ${section('Sprints', renderSprints(sprint.sprints))}
</body>
</html>`;
}
