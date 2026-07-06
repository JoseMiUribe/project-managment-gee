/* ==========================================================================
   PM Copilot Dashboard — lógica de frontend
   Vanilla JS, sin build step. Contrato de API fijo (ver SKILL / spec):
     GET  /api/data
     POST /api/sync
     PUT  /api/gee/:tipo/:id       body { confirm: true, ...campos }
     POST /api/gee/:tipo           body { confirm: true, ...campos }
     PUT  /api/sprint/hu/:id       body { confirm: true, ...campos } (puede devolver 423)
     POST /api/pdf                 -> { path }
   ========================================================================== */

(function () {
  "use strict";

  /** Estado global en memoria con el último snapshot recibido del backend. */
  let state = null;

  /** Charts ECharts instanciados, indexados por id de contenedor, para poder hacer resize/dispose. */
  const chartInstances = {};

  const ECHARTS_AVAILABLE = typeof echarts !== "undefined";

  // ------------------------------------------------------------------
  // Utilidades genéricas
  // ------------------------------------------------------------------

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /** Extrae el primer número de un valor que puede venir como texto libre,
   *  p.ej. "30 pts (según `output-paso-2/capacidad-equipo/` v1)" -> 30.
   *  Los campos de capacidad/roadmap se redactan en markdown, no son
   *  garantizados como número puro. */
  function extraerNumero(value) {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    const match = String(value).match(/-?\d+([.,]\d+)?/);
    if (!match) return 0;
    return Number(match[0].replace(",", ".")) || 0;
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Devuelve texto seguro para mostrar, con un placeholder si no hay dato. */
  function fmt(value, placeholder) {
    if (value === null || value === undefined || value === "") {
      return placeholder !== undefined ? placeholder : "—";
    }
    return String(value);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        if (key === "class") node.className = attrs[key];
        else if (key === "html") node.innerHTML = attrs[key];
        else if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach((c) => {
      if (c) node.appendChild(c);
    });
    return node;
  }

  function showToast(message, type) {
    const container = qs("#toast-container");
    const toast = el("div", { class: "toast" + (type ? " toast-" + type : "") });
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function setBtnLoading(btn, loading, loadingText) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> <span class="btn-label">' + (loadingText || "Cargando…") + "</span>";
      btn.disabled = true;
    } else {
      if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
      btn.disabled = false;
    }
  }

  /** RAG normalizado: acepta "verde"/"green"/"🟢" etc. y devuelve clave canónica + emoji. */
  function normalizeRag(raw) {
    if (!raw) return { key: "gris", emoji: "⚪", label: "Sin dato" };
    const v = String(raw).toLowerCase();
    if (v.includes("verde") || v.includes("green") || v.includes("🟢")) {
      return { key: "verde", emoji: "🟢", label: "Verde" };
    }
    if (v.includes("amarillo") || v.includes("yellow") || v.includes("ambar") || v.includes("ámbar") || v.includes("🟡")) {
      return { key: "amarillo", emoji: "🟡", label: "Amarillo" };
    }
    if (v.includes("rojo") || v.includes("red") || v.includes("🔴")) {
      return { key: "rojo", emoji: "🔴", label: "Rojo" };
    }
    return { key: "gris", emoji: "⚪", label: fmt(raw) };
  }

  /** Compara la palabra "núcleo" de una opción de <select> contra el valor
   *  guardado, ignorando emoji/prefijos en cualquiera de los dos lados
   *  (el markdown puede guardar "🟡 Amarillo" o "Amarillo" a secas). Evita
   *  que un desajuste de formato deje el <select> en su primera opción por
   *  defecto y sobrescriba el valor real al guardar. */
  function palabraNucleo(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
  }
  function opcionCoincideConValor(opcion, valorActual) {
    const opcionNucleo = palabraNucleo(opcion);
    const valorNucleo = palabraNucleo(valorActual);
    if (!opcionNucleo || !valorNucleo) return false;
    return valorNucleo.includes(opcionNucleo) || opcionNucleo.includes(valorNucleo);
  }

  function ragBadge(raw) {
    const r = normalizeRag(raw);
    return '<span class="badge-rag rag-' + r.key + '">' + r.emoji + " " + escapeHtml(r.label) + "</span>";
  }

  function estadoBadge(raw) {
    if (!raw) return '<span class="badge-estado">—</span>';
    return '<span class="badge-estado">' + escapeHtml(raw) + "</span>";
  }

  function emptyState(icon, title, subtitle) {
    return (
      '<div class="empty-state"><div class="empty-icon">' +
      icon +
      "</div><p><strong>" +
      escapeHtml(title) +
      "</strong></p>" +
      (subtitle ? "<p>" + escapeHtml(subtitle) + "</p>" : "") +
      "</div>"
    );
  }

  function emptyInline(text) {
    return '<div class="empty-state-inline">' + escapeHtml(text) + "</div>";
  }

  // ------------------------------------------------------------------
  // Llamadas a la API
  // ------------------------------------------------------------------

  async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await safeJson(res);
      throw new ApiError(res.status, body);
    }
    return res.json();
  }

  async function apiSend(method, url, body) {
    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    if (!res.ok) {
      const respBody = await safeJson(res);
      throw new ApiError(res.status, respBody);
    }
    return res.json();
  }

  async function safeJson(res) {
    try {
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function ApiError(status, body) {
    this.status = status;
    this.body = body;
    this.message = (body && (body.error || body.message)) || "Error de red (" + status + ")";
  }
  ApiError.prototype = Object.create(Error.prototype);

  // ------------------------------------------------------------------
  // Carga inicial y sync
  // ------------------------------------------------------------------

  async function loadInitial() {
    try {
      // Al cargar la página forzamos un sync completo, tal como pide el contrato.
      state = await apiSend("POST", "/api/sync");
      renderAll();
    } catch (err) {
      console.error("Fallo cargando /api/sync inicial, probando /api/data", err);
      try {
        state = await apiGet("/api/data");
        renderAll();
        showToast("No se pudo forzar la sincronización inicial, mostrando el último snapshot disponible.", "warn");
      } catch (err2) {
        console.error(err2);
        renderFatalError(err2);
      }
    }
  }

  async function doSync() {
    const btn = qs("#btn-sync");
    setBtnLoading(btn, true, "Actualizando…");
    try {
      state = await apiSend("POST", "/api/sync");
      renderAll();
      showToast("Datos actualizados.", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar: " + err.message, "error");
    } finally {
      setBtnLoading(btn, false);
    }
  }

  async function doGeneratePdf(triggerBtn) {
    const btn = triggerBtn || qs("#btn-pdf");
    setBtnLoading(btn, true, "Generando PDF…");
    try {
      const result = await apiSend("POST", "/api/pdf");
      const path = result && result.path ? result.path : "(ruta no informada por el servidor)";
      showToast("Informe PDF generado en: " + path, "success");
    } catch (err) {
      console.error(err);
      showToast("Error al generar el PDF: " + err.message, "error");
    } finally {
      setBtnLoading(btn, false);
    }
  }

  function renderFatalError(err) {
    const main = document.querySelector(".tabs-nav");
    if (main) main.insertAdjacentHTML(
      "afterend",
      '<div class="card" style="margin:24px;"><div class="empty-state"><div class="empty-icon">⚠️</div>' +
        "<p><strong>No se pudo cargar el dashboard.</strong></p>" +
        "<p>" + escapeHtml(err.message || String(err)) + "</p>" +
        "<p>Comprueba que el servidor Express local esté en marcha.</p></div></div>"
    );
  }

  // ------------------------------------------------------------------
  // Render orquestador
  // ------------------------------------------------------------------

  function renderAll() {
    if (!state) return;
    renderHeader();
    renderSprintTab();
    renderProyectoTab();
    renderGeeAll();
    renderRequisitosTab();
  }

  function renderHeader() {
    const proyecto = state.proyecto || {};
    qs("#project-nombre").textContent = fmt(proyecto.nombre, "Proyecto sin nombre");
    qs("#project-ruta").textContent = fmt(proyecto.rutaAbsoluta, "");
    qs("#project-generado-en").textContent = fmt(proyecto.generadoEn, "nunca");
  }

  // ------------------------------------------------------------------
  // TAB: Sprint actual
  // ------------------------------------------------------------------

  function getSprintActivo() {
    const sprints = (state.sprint && state.sprint.sprints) || [];
    return sprints.find((s) => s.activo) || null;
  }

  function renderSprintTab() {
    const sprintActivo = getSprintActivo();
    const sinDatos = qs("#sprint-sin-datos");
    const contenido = qs("#sprint-contenido");

    if (!sprintActivo) {
      sinDatos.classList.remove("hidden");
      contenido.classList.add("hidden");
      return;
    }
    sinDatos.classList.add("hidden");
    contenido.classList.remove("hidden");

    qs("#sprint-numero").textContent = sprintActivo.numero !== undefined ? "#" + sprintActivo.numero : "";
    qs("#sprint-objetivo").textContent = fmt(sprintActivo.objetivo, "Sin objetivo definido");
    qs("#sprint-fechas").textContent = fmt(sprintActivo.fechas, "");

    const disponible = extraerNumero(sprintActivo.capacidadDisponible);
    const ocupada = extraerNumero(sprintActivo.capacidadOcupada);
    qs("#sprint-cap-disponible").textContent = disponible ? disponible : "—";
    qs("#sprint-cap-ocupada").textContent = ocupada ? ocupada : "—";

    const pct = disponible > 0 ? Math.round((ocupada / disponible) * 100) : 0;
    const fill = qs("#sprint-progress-fill");
    fill.style.width = Math.min(pct, 100) + "%";
    fill.classList.toggle("over", pct > 100);
    qs("#sprint-progress-label").textContent =
      disponible > 0
        ? ocupada + " / " + disponible + " pts ocupados (" + pct + "%)"
        : "Sin capacidad disponible registrada";

    // Análisis Jira reciente
    const analisis = (state.sprint && state.sprint.analisisJira) || [];
    const jiraCard = qs("#sprint-jira-card");
    if (analisis.length > 0) {
      const ultimo = analisis[analisis.length - 1];
      jiraCard.classList.remove("hidden");
      const resumen = ultimo.resumenEjecutivo || ultimo.resumen || ultimo.texto || JSON.stringify(ultimo);
      qs("#sprint-jira-resumen").innerHTML =
        "<p>" + escapeHtml(typeof resumen === "string" ? resumen : JSON.stringify(resumen)) + "</p>";
    } else {
      jiraCard.classList.add("hidden");
    }

    const hus = sprintActivo.hu || [];
    renderSprintEstadoChart(hus);
    renderSprintResumenLateral(hus);
    renderSprintTablaHu(hus);
  }

  function renderSprintEstadoChart(hus) {
    const counts = { Pendiente: 0, "En curso": 0, Bloqueada: 0, Hecho: 0 };
    hus.forEach((hu) => {
      const estado = normalizeEstadoHu(hu.estado);
      if (counts[estado] === undefined) counts[estado] = 0;
      counts[estado]++;
    });

    const container = qs("#chart-sprint-estado");
    if (hus.length === 0) {
      container.innerHTML = emptyInline("No hay HU en el sprint activo todavía.");
      return;
    }
    if (!ECHARTS_AVAILABLE) {
      container.innerHTML = chartUnavailableMarkup();
      return;
    }
    const chart = getOrCreateChart("chart-sprint-estado");
    const data = Object.keys(counts)
      .filter((k) => counts[k] > 0)
      .map((k) => ({ name: k, value: counts[k] }));

    chart.setOption({
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      color: ["#9ca3af", "#2563eb", "#dc2626", "#16a34a"],
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          data: data,
          label: { formatter: "{b}: {c}" },
        },
      ],
    });
  }

  function normalizeEstadoHu(raw) {
    if (!raw) return "Pendiente";
    const v = String(raw).toLowerCase();
    if (v.includes("bloque")) return "Bloqueada";
    if (v.includes("curso") || v.includes("progreso") || v.includes("progress")) return "En curso";
    if (v.includes("hecho") || v.includes("done") || v.includes("completa")) return "Hecho";
    return "Pendiente";
  }

  function renderSprintResumenLateral(hus) {
    const total = hus.length;
    const bloqueadas = hus.filter((h) => normalizeEstadoHu(h.estado) === "Bloqueada").length;
    const hechas = hus.filter((h) => normalizeEstadoHu(h.estado) === "Hecho").length;
    const lockedCount = hus.filter((h) => h.locked).length;
    const container = qs("#sprint-resumen-lateral");
    if (total === 0) {
      container.innerHTML = emptyInline("Sin HU en el sprint.");
      return;
    }
    container.innerHTML =
      "<p><strong>" + total + "</strong> historias en total</p>" +
      "<p><strong>" + hechas + "</strong> completadas</p>" +
      "<p><strong>" + bloqueadas + "</strong> bloqueadas</p>" +
      (lockedCount > 0 ? "<p>🔒 <strong>" + lockedCount + "</strong> bloqueadas para edición (sprint activo)</p>" : "");
  }

  function renderSprintTablaHu(hus) {
    const tbody = qs("#tabla-sprint-hu tbody");
    tbody.innerHTML = "";
    if (hus.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5">' + emptyInline("No hay historias de usuario en el sprint activo.") + "</td></tr>";
      return;
    }
    hus.forEach((hu) => {
      const tr = document.createElement("tr");
      if (hu.locked) tr.classList.add("row-locked");
      tr.innerHTML =
        "<td>" + escapeHtml(fmt(hu.id || hu.hu)) + "</td>" +
        "<td>" + escapeHtml(fmt(hu.titulo || hu.nombre)) + "</td>" +
        "<td>" + estadoBadge(hu.estado) + "</td>" +
        "<td>" + escapeHtml(fmt(hu.puntos || hu.puntosHistoria || hu.tallas)) + "</td>" +
        "<td>" + (hu.locked ? '<span class="locked-badge">🔒 En sprint activo</span>' : "") + "</td>";
      tbody.appendChild(tr);
    });
  }

  // ------------------------------------------------------------------
  // TAB: Proyecto
  // ------------------------------------------------------------------

  function renderProyectoTab() {
    renderVelocidadChart();
    renderEpicas();
    renderRoadmapCliente();
    renderCapacidadActual();
  }

  function renderVelocidadChart() {
    const container = qs("#chart-velocidad");
    const data = (state.metricas && state.metricas.velocidadPorSprint) || [];
    if (!data || data.length === 0) {
      container.innerHTML = emptyInline("Todavía no hay histórico de velocidad (se necesitan sprints completados).");
      return;
    }
    if (!ECHARTS_AVAILABLE) {
      container.innerHTML = chartUnavailableMarkup();
      return;
    }
    const chart = getOrCreateChart("chart-velocidad");
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: "category",
        data: data.map((d) => "Sprint " + d.sprint),
      },
      yAxis: { type: "value", name: "Pts" },
      series: [
        {
          type: "line",
          data: data.map((d) => d.ptsCompletados),
          smooth: true,
          color: "#2563eb",
          areaStyle: { opacity: 0.08 },
        },
      ],
    });
  }

  function renderEpicas() {
    const container = qs("#epicas-lista");
    const epicas = (state.roadmap && state.roadmap.epicas) || [];
    if (!epicas || epicas.length === 0) {
      container.innerHTML = emptyState("🗺️", "Todavía no se ha generado el roadmap de épicas.", "Se generará en el paso 2 del proceso (generar-epicas).");
      return;
    }
    container.innerHTML = epicas
      .map((ep) => {
        const fase = ep.fase || ep.faseRoadmap || "";
        const faseClass = fase && fase.toLowerCase().includes("mvp") ? " tag-fase-mvp" : "";
        const prioridad = ep.prioridad || "";
        const prioClass = prioridad && prioridad.toLowerCase().includes("alta") ? " tag-prioridad-alta" : "";
        return (
          '<div class="epica-card">' +
          '<div class="epica-card-header">' +
          "<strong>" + escapeHtml(fmt(ep.nombre || ep.titulo || ep.id)) + "</strong>" +
          '<div class="epica-tags">' +
          (fase ? '<span class="tag' + faseClass + '">' + escapeHtml(fase) + "</span>" : "") +
          (prioridad ? '<span class="tag' + prioClass + '">' + escapeHtml(prioridad) + "</span>" : "") +
          "</div></div>" +
          (ep.descripcion ? '<div class="epica-desc">' + escapeHtml(ep.descripcion) + "</div>" : "") +
          "</div>"
        );
      })
      .join("");
  }

  function renderRoadmapCliente() {
    const container = qs("#roadmap-cliente-contenido");
    const roadmapCliente = state.roadmap && state.roadmap.roadmapCliente;
    if (!roadmapCliente) {
      container.innerHTML = emptyState("📅", "Todavía no se ha generado el roadmap de cliente.", "Se generará en el paso 2 del proceso (generar-roadmaps).");
      return;
    }
    const hitos = roadmapCliente.hitos || roadmapCliente.milestones || [];
    if (!hitos.length) {
      container.innerHTML = emptyInline("El roadmap de cliente existe pero no tiene hitos definidos todavía.");
      return;
    }
    container.innerHTML =
      '<ul class="timeline-list">' +
      hitos
        .map((h) => {
          const confianza = confianzaEmoji(h.confianza || h.nivelConfianza);
          return (
            "<li><span class=\"timeline-confianza\">" + confianza + "</span>" +
            '<div class="timeline-body"><strong>' + escapeHtml(fmt(h.nombre || h.titulo)) + "</strong>" +
            "<span>" + escapeHtml(fmt(h.fecha)) + (h.descripcion ? " — " + escapeHtml(h.descripcion) : "") + "</span>" +
            "</div></li>"
          );
        })
        .join("") +
      "</ul>";
  }

  function confianzaEmoji(raw) {
    if (!raw) return "❔";
    const v = String(raw).toLowerCase();
    if (v.includes("✅") || v.includes("alta") || v.includes("high")) return "✅";
    if (v.includes("⚠") || v.includes("media") || v.includes("medium")) return "⚠️";
    if (v.includes("🔥") || v.includes("baja") || v.includes("low") || v.includes("riesgo")) return "🔥";
    // Si ya viene el emoji tal cual en el campo, se devuelve tal cual.
    if (raw === "✅" || raw === "⚠️" || raw === "🔥") return raw;
    return "❔";
  }

  /** Da formato legible a un valor de capacidad que puede ser texto plano,
   *  un objeto clave-valor (ej. composicionTecnica) o un array de fichas
   *  (ej. miembros, disponibilidad). Nunca deja que un objeto/array llegue
   *  a concatenarse directo en un template string (produce "[object Object]"). */
  function formatearValorCapacidad(value) {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (typeof value[0] === "object") {
        return value
          .map((item) =>
            Object.keys(item)
              .filter((k) => item[k])
              .map((k) => humanizeKey(k) + ": " + escapeHtml(fmt(item[k])))
              .join(" · ")
          )
          .map((line) => "<div>" + line + "</div>")
          .join("");
      }
      return escapeHtml(value.join(", "));
    }
    if (typeof value === "object") {
      const keys = Object.keys(value).filter((k) => value[k]);
      if (keys.length === 0) return null;
      return keys.map((k) => humanizeKey(k) + ": " + escapeHtml(fmt(value[k]))).join(", ");
    }
    return escapeHtml(fmt(value));
  }

  function renderCapacidadActual() {
    const container = qs("#capacidad-actual-contenido");
    const cap = state.roadmap && state.roadmap.capacidadActual;
    if (!cap) {
      container.innerHTML = emptyState("⚙️", "Todavía no se ha calculado la capacidad del equipo.", "Se genera en el paso 2 (cuestionario/procesar-capacidad).");
      return;
    }
    // "raw" es el texto original sin procesar, guardado por el backend solo
    // como respaldo de depuración — no es apto para mostrarse en el dashboard.
    const entries = Object.keys(cap).filter((k) => k !== "raw" && cap[k] !== null && cap[k] !== undefined);
    const bloques = entries
      .map((k) => ({ key: k, html: formatearValorCapacidad(cap[k]) }))
      .filter((e) => e.html !== null);
    if (bloques.length === 0) {
      container.innerHTML = emptyInline("Capacidad registrada pero sin campos con datos.");
      return;
    }
    container.innerHTML =
      '<div class="grid-3">' +
      bloques
        .map(
          (e) =>
            '<div class="stat-block"><div class="stat-label">' +
            escapeHtml(humanizeKey(e.key)) +
            '</div><div class="stat-value" style="font-size:14px; font-weight:400;">' +
            e.html +
            "</div></div>"
        )
        .join("") +
      "</div>";
  }

  function humanizeKey(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());
  }

  // ------------------------------------------------------------------
  // Charts helpers
  // ------------------------------------------------------------------

  function chartUnavailableMarkup() {
    return (
      '<div class="chart-unavailable">Ejecuta <code>npm run setup</code> para habilitar los gráficos (falta vendor/echarts.min.js).</div>'
    );
  }

  function getOrCreateChart(containerId) {
    const container = qs("#" + containerId);
    // Aseguramos que el contenedor no tenga el markup de "no disponible" de un render previo.
    if (!container.querySelector("canvas") && container.getAttribute("_echarts_instance_")) {
      // ya inicializado por echarts, nada que hacer
    }
    if (chartInstances[containerId]) {
      return chartInstances[containerId];
    }
    container.innerHTML = "";
    const chart = echarts.init(container);
    chartInstances[containerId] = chart;
    return chart;
  }

  function resizeAllCharts() {
    Object.keys(chartInstances).forEach((id) => {
      try {
        chartInstances[id].resize();
      } catch (e) {
        /* noop */
      }
    });
  }

  // ------------------------------------------------------------------
  // TAB: GEE — configuración declarativa por tipo
  // ------------------------------------------------------------------

  /**
   * Definición de columnas por tipo GEE. Cada columna: { key, label, type, editable }
   * type: "text" | "textarea" | "select" | "date" | "number"
   * Estos campos se basan estrictamente en el contrato de /api/data dado.
   */
  const GEE_CONFIG = {
    riesgos: {
      apiTipo: "riesgos",
      dataKey: "riesgos",
      tablaWrap: "riesgos-tabla-wrap",
      formId: "form-nuevo-riesgo",
      titulo: "riesgo",
      columns: [
        { key: "id", label: "ID", editable: false },
        { key: "fechaAlta", label: "Fecha alta", type: "date" },
        { key: "riesgo", label: "Riesgo", type: "textarea" },
        { key: "consecuencia", label: "Consecuencia", type: "textarea" },
        { key: "tipo", label: "Tipo", type: "text" },
        { key: "probabilidad", label: "Probabilidad", type: "text" },
        { key: "impacto", label: "Impacto", type: "text" },
        { key: "ambito", label: "Ámbito", type: "text" },
        { key: "respuesta", label: "Respuesta", type: "text" },
        { key: "estado", label: "Estado", type: "text" },
        { key: "rag", label: "RAG", type: "select", options: ["🟢 Verde", "🟡 Amarillo", "🔴 Rojo"], render: (v) => ragBadge(v) },
        { key: "mitigacion", label: "Mitigación", type: "textarea" },
        { key: "responsable", label: "Responsable", type: "text" },
        { key: "peso", label: "Peso", type: "text" },
        { key: "consideraciones", label: "Consideraciones", type: "textarea" },
        { key: "relacionadoCon", label: "Relacionado con", type: "text" },
        { key: "fechaUpdate", label: "Últ. actualización", type: "date", editable: false },
      ],
    },
    dependencias: {
      apiTipo: "dependencias",
      dataKey: "dependencias",
      tablaWrap: "dependencias-tabla-wrap",
      formId: "form-nueva-dependencia",
      titulo: "dependencia",
      columns: [
        { key: "id", label: "ID", editable: false },
        { key: "equipo", label: "Equipo", type: "text" },
        { key: "dependencia", label: "Dependencia", type: "textarea" },
        { key: "criticidadRag", label: "Criticidad", type: "select", options: ["🟢 Verde", "🟡 Amarillo", "🔴 Rojo"], render: (v) => ragBadge(v) },
        { key: "sistemas", label: "Sistemas", type: "text" },
        { key: "estado", label: "Estado", type: "text" },
        { key: "fechaCompromiso", label: "Fecha compromiso", type: "date" },
        { key: "riesgosAsociados", label: "Riesgos asociados", type: "text" },
        { key: "comentarios", label: "Comentarios", type: "textarea" },
      ],
    },
    acciones: {
      apiTipo: "acciones",
      dataKey: "acciones",
      tablaWrap: "acciones-tabla-wrap",
      formId: "form-nueva-accion",
      titulo: "acción",
      columns: [
        { key: "id", label: "ID", editable: false },
        { key: "accion", label: "Acción", type: "textarea" },
        { key: "tipo", label: "Tipo", type: "text" },
        { key: "riesgoAsociado", label: "Riesgo asociado", type: "text" },
        { key: "dependenciaAsociada", label: "Dependencia asociada", type: "text" },
        { key: "responsable", label: "Responsable", type: "text" },
        { key: "deadline", label: "Deadline", type: "date" },
        { key: "estado", label: "Estado", type: "text" },
      ],
    },
    impedimentos: {
      apiTipo: "impedimentos",
      dataKey: "impedimentos",
      tablaWrap: "impedimentos-tabla-wrap",
      formId: "form-nuevo-impedimento",
      titulo: "impedimento",
      columns: [
        { key: "id", label: "ID", editable: false },
        { key: "impedimento", label: "Impedimento", type: "textarea" },
        { key: "criticidad", label: "Criticidad", type: "select", options: ["🟢 Verde", "🟡 Amarillo", "🔴 Rojo"], render: (v) => ragBadge(v) },
        { key: "fechaInicio", label: "Fecha inicio", type: "date" },
        { key: "fechaFin", label: "Fecha fin", type: "date" },
        { key: "responsable", label: "Responsable", type: "text" },
        { key: "riesgoOrigen", label: "Riesgo origen", type: "text" },
        { key: "dependenciaOrigen", label: "Dependencia origen", type: "text" },
      ],
    },
    changelog: {
      apiTipo: "changelog",
      dataKey: "changelog",
      tablaWrap: "changelog-tabla-wrap",
      formId: "form-nuevo-changelog",
      titulo: "cambio de alcance",
      columns: [
        { key: "id", label: "ID", editable: false },
        { key: "titulo", label: "Título", type: "text" },
        { key: "descripcion", label: "Descripción", type: "textarea" },
        { key: "impacto", label: "Impacto", type: "text" },
        { key: "coste", label: "Coste", type: "text" },
        { key: "alcance", label: "Alcance", type: "text" },
        { key: "plazo", label: "Plazo", type: "text" },
        { key: "calidad", label: "Calidad", type: "text" },
        { key: "decision", label: "Decisión", type: "text" },
        { key: "comentarios", label: "Comentarios", type: "textarea" },
        { key: "riesgosGenerados", label: "Riesgos generados", type: "text" },
        { key: "dependenciasGeneradas", label: "Dependencias generadas", type: "text" },
        { key: "accionesGeneradas", label: "Acciones generadas", type: "text" },
      ],
    },
  };

  function renderGeeAll() {
    renderRiesgosRagChart();
    Object.keys(GEE_CONFIG).forEach((tipo) => renderGeeTable(tipo));
    renderDailyLog();
  }

  function renderRiesgosRagChart() {
    const container = qs("#chart-riesgos-rag");
    const counts = (state.metricas && state.metricas.riesgosPorRag) || null;
    if (!counts) {
      container.innerHTML = emptyInline("Sin datos de riesgos por RAG todavía.");
      return;
    }
    const total = (counts.verde || 0) + (counts.amarillo || 0) + (counts.rojo || 0);
    if (total === 0) {
      container.innerHTML = emptyInline("No hay riesgos registrados todavía.");
      return;
    }
    if (!ECHARTS_AVAILABLE) {
      container.innerHTML = chartUnavailableMarkup();
      return;
    }
    const chart = getOrCreateChart("chart-riesgos-rag");
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: "category", data: ["Verde", "Amarillo", "Rojo"] },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: [
            { value: counts.verde || 0, itemStyle: { color: "#16a34a" } },
            { value: counts.amarillo || 0, itemStyle: { color: "#ca8a04" } },
            { value: counts.rojo || 0, itemStyle: { color: "#dc2626" } },
          ],
          barWidth: "50%",
        },
      ],
    });
  }

  // ---------- Render genérico de tabla editable GEE ----------

  function renderGeeTable(tipo) {
    const cfg = GEE_CONFIG[tipo];
    const wrap = qs("#" + cfg.tablaWrap);
    const rows = (state.gee && state.gee[cfg.dataKey]) || [];

    if (!rows || rows.length === 0) {
      wrap.innerHTML = emptyState("📭", "Todavía no hay ningún registro de " + cfg.titulo + ".", 'Usa el botón "+ Nuevo ' + cfg.titulo + '" para crear el primero.');
      ensureNewRecordForm(tipo);
      return;
    }

    const table = el("table", { class: "data-table" });
    const thead = el("thead");
    const headRow = el("tr");
    cfg.columns.forEach((col) => headRow.appendChild(el("th", { text: col.label })));
    headRow.appendChild(el("th", { text: "" }));
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el("tbody");
    rows.forEach((row) => {
      tbody.appendChild(buildGeeRow(tipo, cfg, row));
    });
    table.appendChild(tbody);

    wrap.innerHTML = "";
    wrap.appendChild(table);

    ensureNewRecordForm(tipo);
  }

  function buildGeeRow(tipo, cfg, row) {
    const tr = el("tr", { "data-id": String(row.id) });
    tr.dataset.editing = "false";

    cfg.columns.forEach((col) => {
      const td = el("td", { "data-key": col.key });
      td.appendChild(document.createTextNode(""));
      renderCellReadonly(td, col, row);
      tr.appendChild(td);
    });

    const tdActions = el("td", { class: "cell-actions" });
    const btnEdit = el("button", { class: "btn btn-sm", text: "Editar" });
    const btnSave = el("button", { class: "btn btn-sm btn-primary hidden", text: "Guardar cambios" });
    const btnCancel = el("button", { class: "btn btn-sm hidden", text: "Cancelar" });

    btnEdit.addEventListener("click", () => enterEditMode(tr, cfg, row, btnEdit, btnSave, btnCancel));
    btnCancel.addEventListener("click", () => exitEditMode(tr, cfg, row, btnEdit, btnSave, btnCancel));
    btnSave.addEventListener("click", () => saveRowEdits(tipo, cfg, row, tr, btnEdit, btnSave, btnCancel));

    tdActions.appendChild(btnEdit);
    tdActions.appendChild(btnSave);
    tdActions.appendChild(btnCancel);
    tr.appendChild(tdActions);

    return tr;
  }

  function renderCellReadonly(td, col, row) {
    const value = row[col.key];
    if (col.render) {
      td.innerHTML = col.render(value);
    } else {
      td.textContent = fmt(value, "—");
    }
  }

  function enterEditMode(tr, cfg, row, btnEdit, btnSave, btnCancel) {
    tr.dataset.editing = "true";
    cfg.columns.forEach((col) => {
      const td = tr.querySelector('td[data-key="' + col.key + '"]');
      if (col.editable === false) {
        return; // permanece readonly (ID, fechaUpdate, etc.)
      }
      const currentValue = row[col.key] || "";
      let input;
      if (col.type === "textarea") {
        input = el("textarea");
        input.value = currentValue;
      } else if (col.type === "select") {
        input = el("select");
        // El valor guardado puede venir con emoji/prefijo (ej. "🟡 Amarillo")
        // mientras las opciones del <select> son texto plano ("Amarillo") —
        // comparamos por inclusión, no por igualdad exacta, para no perder
        // la selección real y sobrescribir sin querer con la primera opción.
        (col.options || []).forEach((opt) => {
          const optionEl = el("option", { value: opt, text: opt });
          if (opcionCoincideConValor(opt, currentValue)) optionEl.selected = true;
          input.appendChild(optionEl);
        });
      } else {
        input = el("input", { type: col.type === "date" ? "text" : "text" });
        input.value = currentValue;
        if (col.type === "date") input.placeholder = "YYYY-MM-DD";
      }
      input.dataset.fieldKey = col.key;
      td.innerHTML = "";
      td.appendChild(input);
    });
    btnEdit.classList.add("hidden");
    btnSave.classList.remove("hidden");
    btnCancel.classList.remove("hidden");
  }

  function exitEditMode(tr, cfg, row, btnEdit, btnSave, btnCancel) {
    tr.dataset.editing = "false";
    cfg.columns.forEach((col) => {
      const td = tr.querySelector('td[data-key="' + col.key + '"]');
      renderCellReadonly(td, col, row);
    });
    btnEdit.classList.remove("hidden");
    btnSave.classList.add("hidden");
    btnCancel.classList.add("hidden");
  }

  async function saveRowEdits(tipo, cfg, row, tr, btnEdit, btnSave, btnCancel) {
    const updates = {};
    cfg.columns.forEach((col) => {
      if (col.editable === false) return;
      const input = tr.querySelector('[data-field-key="' + col.key + '"]');
      if (input) updates[col.key] = input.value;
    });

    const confirmed = window.confirm("¿Confirmas este cambio en " + cfg.titulo + " " + row.id + "?");
    if (!confirmed) return;

    setBtnLoading(btnSave, true, "Guardando…");
    try {
      const payload = Object.assign({ confirm: true }, updates);
      state = await apiSend("PUT", "/api/gee/" + cfg.apiTipo + "/" + encodeURIComponent(row.id), payload);
      renderAll();
      showToast("Cambio guardado en " + cfg.titulo + " " + row.id + ".", "success");
    } catch (err) {
      console.error(err);
      showToast("No se pudo guardar: " + err.message, "error");
      setBtnLoading(btnSave, false);
    }
  }

  // ---------- Formulario "+ Nuevo registro" ----------

  function ensureNewRecordForm(tipo) {
    const cfg = GEE_CONFIG[tipo];
    const container = qs("#" + cfg.formId);
    if (container.dataset.built === "true") return;
    container.dataset.built = "true";

    const grid = el("div", { class: "form-grid" });
    const editableCols = cfg.columns.filter((c) => c.editable !== false);
    editableCols.forEach((col) => {
      const field = el("div", { class: "form-field" });
      field.appendChild(el("label", { text: col.label }));
      let input;
      if (col.type === "textarea") {
        input = el("textarea");
      } else if (col.type === "select") {
        input = el("select");
        input.appendChild(el("option", { value: "", text: "—" }));
        (col.options || []).forEach((opt) => input.appendChild(el("option", { value: opt, text: opt })));
      } else {
        input = el("input", { type: "text" });
        if (col.type === "date") input.placeholder = "YYYY-MM-DD";
      }
      input.dataset.fieldKey = col.key;
      field.appendChild(input);
      grid.appendChild(field);
    });
    container.appendChild(grid);

    const actions = el("div", { class: "form-actions" });
    const btnCreate = el("button", { class: "btn btn-primary btn-sm", text: "Crear " + cfg.titulo });
    const btnCancel = el("button", { class: "btn btn-sm", text: "Cancelar" });
    btnCreate.addEventListener("click", () => createNewRecord(tipo, cfg, container, btnCreate));
    btnCancel.addEventListener("click", () => container.classList.remove("open"));
    actions.appendChild(btnCreate);
    actions.appendChild(btnCancel);
    container.appendChild(actions);
  }

  async function createNewRecord(tipo, cfg, container, btnCreate) {
    const inputs = qsa("[data-field-key]", container);
    const payload = { confirm: true };
    inputs.forEach((input) => {
      payload[input.dataset.fieldKey] = input.value;
    });

    const confirmed = window.confirm("¿Confirmas la creación de este nuevo " + cfg.titulo + "?");
    if (!confirmed) return;

    setBtnLoading(btnCreate, true, "Creando…");
    try {
      state = await apiSend("POST", "/api/gee/" + cfg.apiTipo, payload);
      renderAll();
      showToast("Nuevo " + cfg.titulo + " creado.", "success");
      container.classList.remove("open");
      inputs.forEach((input) => {
        input.value = "";
      });
    } catch (err) {
      console.error(err);
      showToast("No se pudo crear: " + err.message, "error");
    } finally {
      setBtnLoading(btnCreate, false);
    }
  }

  // ---------- Daily log (solo lectura) ----------

  function renderDailyLog() {
    const container = qs("#dailylog-lista");
    const logs = (state.gee && state.gee.dailylogs) || [];
    if (!logs || logs.length === 0) {
      container.innerHTML = emptyState("📓", "Todavía no hay entradas de daily log.", "Se generan con el prompt paso-3/daily-log.");
      return;
    }
    const sorted = logs.slice().sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
    container.innerHTML = sorted
      .map(
        (entry, idx) =>
          "<details class=\"daily-entry\"" + (idx === 0 ? " open" : "") + "><summary>" +
          escapeHtml(fmt(entry.fecha, "Fecha desconocida")) +
          "</summary><pre>" +
          escapeHtml(fmt(entry.raw, "(sin contenido)")) +
          "</pre></details>"
      )
      .join("");
  }

  // ------------------------------------------------------------------
  // TAB: Requisitos (Paso -1 legacy + Paso 0) — SOLO LECTURA
  //
  // A diferencia de la pestaña GEE, aquí no hay edición ni formularios de
  // alta: el usuario no lo pidió para estos datos, y añadir edición
  // implicaría escribir writers nuevos para output-paso-legacy/ y
  // output-paso-0/ que quedan fuera de este encargo. Sigue el mismo patrón
  // de renderizado de solo lectura que la pestaña "Proyecto".
  // ------------------------------------------------------------------

  function renderRequisitosTab() {
    renderLegacySection();
    renderPaso0Section();
  }

  // ---------- Análisis Legacy (Paso -1) ----------

  const LEGACY_ESTADO_INFO = {
    claro: { emoji: "✅", label: "Claro", color: "#16a34a", clase: "legacy-claro" },
    contradictorio: { emoji: "⚠️", label: "Contradictorio", color: "#ca8a04", clase: "legacy-contradictorio" },
    ambiguo: { emoji: "❓", label: "Ambiguo", color: "#7c3aed", clase: "legacy-ambiguo" },
    inexistente: { emoji: "🔲", label: "Inexistente", color: "#6b7280", clase: "legacy-inexistente" },
  };

  function legacyEstadoKey(raw) {
    if (!raw) return null;
    const v = String(raw).toLowerCase();
    if (v.includes("✅") || v.includes("claro")) return "claro";
    if (v.includes("⚠") || v.includes("contradictori")) return "contradictorio";
    if (v.includes("❓") || v.includes("ambigu")) return "ambiguo";
    if (v.includes("🔲") || v.includes("inexistente")) return "inexistente";
    return null;
  }

  function legacyEstadoBadge(raw) {
    const key = legacyEstadoKey(raw);
    const info = LEGACY_ESTADO_INFO[key];
    if (!info) return '<span class="badge-estado">' + escapeHtml(fmt(raw)) + "</span>";
    return '<span class="badge-estado ' + info.clase + '">' + info.emoji + " " + escapeHtml(info.label) + "</span>";
  }

  function renderLegacySection() {
    const sinDatos = qs("#legacy-sin-datos");
    const contenido = qs("#legacy-contenido");
    const legacy = state.requisitos && state.requisitos.legacy;

    if (!legacy) {
      sinDatos.classList.remove("hidden");
      contenido.classList.add("hidden");
      sinDatos.innerHTML = emptyState(
        "🗂️",
        "Todavía no se ha hecho análisis legacy, o el proyecto no lo necesitaba.",
        "Se genera en el Paso -1 (mapa-proyecto.md) cuando el proyecto parte de documentación o sistemas existentes."
      );
      return;
    }
    sinDatos.classList.add("hidden");
    contenido.classList.remove("hidden");

    qs("#legacy-version-nota").textContent =
      legacy.version === "v2"
        ? "Versión actualizada tras la entrevista con el cliente (mapa-proyecto-v2.md)."
        : "Versión inicial, todavía sin incorporar feedback de entrevista (mapa-proyecto.md).";

    renderLegacyResumenChart(legacy.resumen);
    renderLegacyResumenLateral(legacy.resumen);
    renderLegacyTabla(legacy.aspectos);
  }

  function renderLegacyResumenChart(resumen) {
    const container = qs("#chart-legacy-resumen");
    const total = ["claro", "contradictorio", "ambiguo", "inexistente"].reduce((acc, k) => acc + (resumen[k] || 0), 0);
    if (!resumen || total === 0) {
      container.innerHTML = emptyInline("Sin aspectos clasificados todavía.");
      return;
    }
    if (!ECHARTS_AVAILABLE) {
      container.innerHTML = chartUnavailableMarkup();
      return;
    }
    const chart = getOrCreateChart("chart-legacy-resumen");
    const data = ["claro", "contradictorio", "ambiguo", "inexistente"]
      .filter((k) => (resumen[k] || 0) > 0)
      .map((k) => ({ name: LEGACY_ESTADO_INFO[k].label, value: resumen[k], itemStyle: { color: LEGACY_ESTADO_INFO[k].color } }));
    chart.setOption({
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          data: data,
          label: { formatter: "{b}: {c}" },
        },
      ],
    });
  }

  function renderLegacyResumenLateral(resumen) {
    const container = qs("#legacy-resumen-lateral");
    const total = ["claro", "contradictorio", "ambiguo", "inexistente"].reduce((acc, k) => acc + (resumen[k] || 0), 0);
    if (!resumen || total === 0) {
      container.innerHTML = emptyInline("Sin datos de resumen.");
      return;
    }
    container.innerHTML = ["claro", "contradictorio", "ambiguo", "inexistente"]
      .map((k) => {
        const info = LEGACY_ESTADO_INFO[k];
        return "<p>" + info.emoji + " <strong>" + (resumen[k] || 0) + "</strong> " + info.label + "</p>";
      })
      .join("");
  }

  function renderLegacyTabla(aspectos) {
    const wrap = qs("#legacy-tabla-wrap");
    if (!aspectos || aspectos.length === 0) {
      wrap.innerHTML = emptyInline("No hay aspectos detallados en el mapa del proyecto.");
      return;
    }
    const rows = aspectos
      .map(
        (a) =>
          "<tr><td>" +
          escapeHtml(fmt(a.id)) +
          "</td><td>" +
          escapeHtml(fmt(a.aspecto)) +
          "</td><td>" +
          legacyEstadoBadge(a.estado) +
          "</td><td>" +
          escapeHtml(fmt(a.descripcion)) +
          "</td><td>" +
          escapeHtml(fmt(a.fuentes)) +
          "</td><td>" +
          escapeHtml(fmt(a.recomendacion)) +
          "</td></tr>"
      )
      .join("");
    wrap.innerHTML =
      '<table class="data-table"><thead><tr>' +
      "<th>ID</th><th>Aspecto</th><th>Estado</th><th>Descripción</th><th>Fuentes</th><th>Recomendación</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>";
  }

  // ---------- Requisitos del cliente (Paso 0) ----------

  function renderPaso0Section() {
    const paso0 = state.requisitos && state.requisitos.paso0;
    renderPaso0Resumen(paso0);
    renderPeticionesTabla(paso0);
    renderFuncionalesTabla(paso0);
    renderNoFuncionalesTabla(paso0);
    renderZonasIncertidumbre(paso0);
  }

  function renderPaso0Resumen(paso0) {
    const container = qs("#paso0-resumen");
    const resumen = paso0 && paso0.resumen;
    if (!resumen || (resumen.totalPeticiones === 0 && resumen.totalFuncionales === 0 && resumen.totalNoFuncionales === 0 && resumen.totalZonasIncertidumbre === 0)) {
      container.innerHTML = emptyInline("Todavía no se ha procesado el Paso 0 (peticiones/requisitos del cliente).");
      return;
    }
    const partes = [
      resumen.totalPeticiones + " peticiones",
      resumen.totalFuncionales + " RF",
      resumen.totalNoFuncionales +
        " RNF" +
        (resumen.noFuncionalesImplicitos > 0 ? " (" + resumen.noFuncionalesImplicitos + " implícitos sin confirmar)" : ""),
      resumen.totalZonasIncertidumbre + " zonas de incertidumbre",
    ];
    container.innerHTML = "<p><strong>" + partes.join(" · ") + "</strong></p>";
  }

  function moscowBadge(raw) {
    if (!raw) return "";
    const v = String(raw).toLowerCase();
    let clase = "";
    if (v.includes("must")) clase = "tag-prioridad-alta";
    else if (v.includes("should")) clase = "tag-fase-mvp";
    return '<span class="tag' + (clase ? " " + clase : "") + '">' + escapeHtml(raw) + "</span>";
  }

  function renderPeticionesTabla(paso0) {
    const wrap = qs("#peticiones-tabla-wrap");
    const items = (paso0 && paso0.peticiones) || [];
    if (items.length === 0) {
      wrap.innerHTML = emptyState("📥", "Todavía no hay peticiones del cliente registradas.", "Se generan en el Paso 0 (procesar-respuestas) a partir de la entrevista o notas del cliente.");
      return;
    }
    const rows = items
      .map(
        (p) =>
          "<tr><td>" +
          escapeHtml(fmt(p.id)) +
          "</td><td>" +
          escapeHtml(fmt(p.peticion)) +
          "</td><td>" +
          escapeHtml(fmt(p.loDijoElCliente)) +
          "</td><td>" +
          escapeHtml(fmt(p.prioridadSubjetiva)) +
          "</td></tr>"
      )
      .join("");
    wrap.innerHTML =
      '<table class="data-table"><thead><tr>' +
      "<th>ID</th><th>Petición</th><th>Lo dijo el cliente</th><th>Prioridad subjetiva</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>";
  }

  function renderFuncionalesTabla(paso0) {
    const wrap = qs("#rf-tabla-wrap");
    const items = (paso0 && paso0.funcionales) || [];
    if (items.length === 0) {
      wrap.innerHTML = emptyState("🧩", "Todavía no hay requisitos funcionales registrados.", "Se generan en el Paso 0 (procesar-respuestas) a partir de las peticiones del cliente.");
      return;
    }
    const rows = items
      .map(
        (rf) =>
          "<tr><td>" +
          escapeHtml(fmt(rf.id)) +
          "</td><td>" +
          escapeHtml(fmt(rf.modulo)) +
          "</td><td>" +
          escapeHtml(fmt(rf.descripcion)) +
          "</td><td>" +
          escapeHtml(fmt(rf.actor)) +
          "</td><td>" +
          moscowBadge(rf.prioridad) +
          "</td><td>" +
          escapeHtml(fmt(rf.origen)) +
          "</td><td>" +
          escapeHtml(fmt(rf.dependencias)) +
          "</td></tr>"
      )
      .join("");
    wrap.innerHTML =
      '<table class="data-table"><thead><tr>' +
      "<th>ID</th><th>Módulo/Área</th><th>Descripción</th><th>Actor/Rol</th><th>Prioridad</th><th>Origen</th><th>Dependencias</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>";
  }

  function renderNoFuncionalesTabla(paso0) {
    const wrap = qs("#rnf-tabla-wrap");
    const items = (paso0 && paso0.noFuncionales) || [];
    if (items.length === 0) {
      wrap.innerHTML = emptyState("⚙️", "Todavía no hay requisitos no funcionales registrados.", "Se generan en el Paso 0 (procesar-respuestas), incluyendo los RNF implícitos inferidos por la IA.");
      return;
    }
    const rows = items
      .map(
        (rnf) =>
          "<tr" +
          (rnf.implicito ? ' class="row-implicito"' : "") +
          "><td>" +
          escapeHtml(fmt(rnf.id)) +
          "</td><td>" +
          escapeHtml(fmt(rnf.descripcion)) +
          "</td><td>" +
          escapeHtml(fmt(rnf.categoria)) +
          "</td><td>" +
          (rnf.implicito ? "⚠️ " : "") +
          escapeHtml(fmt(rnf.origen)) +
          "</td><td>" +
          moscowBadge(rnf.prioridad) +
          "</td></tr>"
      )
      .join("");
    wrap.innerHTML =
      '<table class="data-table"><thead><tr>' +
      "<th>ID</th><th>Descripción</th><th>Categoría</th><th>Origen</th><th>Prioridad</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      (items.some((r) => r.implicito)
        ? '<p class="text-muted" style="margin-top:8px;">⚠️ = RNF implícito, inferido por la IA y todavía no confirmado por el cliente (ver Zonas de Incertidumbre).</p>'
        : "");
  }

  function renderZonasIncertidumbre(paso0) {
    const container = qs("#zi-lista");
    const items = (paso0 && paso0.zonasIncertidumbre) || [];
    if (items.length === 0) {
      container.innerHTML = emptyState("❔", "Todavía no hay zonas de incertidumbre registradas.", "Se generan en el Paso 0 (procesar-respuestas) a partir de ambigüedades, contradicciones y asunciones de la IA.");
      return;
    }
    container.innerHTML = items
      .map(
        (zi) =>
          '<div class="epica-card">' +
          '<div class="epica-card-header">' +
          "<strong>" + escapeHtml(fmt(zi.id)) + (zi.zona ? " — " + escapeHtml(fmt(zi.zona)) : "") + "</strong>" +
          (zi.porQueEsIncierto ? '<span class="tag">' + escapeHtml(zi.porQueEsIncierto) + "</span>" : "") +
          "</div>" +
          (zi.descripcion ? '<div class="epica-desc">' + escapeHtml(zi.descripcion) + "</div>" : "") +
          (zi.afecta ? "<p class=\"text-muted\"><strong>Afecta a:</strong> " + escapeHtml(zi.afecta) + "</p>" : "") +
          (zi.pregunta ? "<p><strong>❓ Pregunta pendiente:</strong> " + escapeHtml(zi.pregunta) + "</p>" : "") +
          (zi.recomendacionPorDefecto ? "<p><strong>💡 Recomendación por defecto (80/20):</strong> " + escapeHtml(zi.recomendacionPorDefecto) + "</p>" : "") +
          "</div>"
      )
      .join("");
  }

  // ------------------------------------------------------------------
  // Manejo de error 423 (Locked) para edición de HU de sprint
  // Nota: la pestaña "Sprint actual" en este MVP muestra las HU en modo
  // solo lectura (con el candado 🔒 cuando locked === true), pero dejamos
  // preparado el helper por si se añade edición de HU fuera de sprint activo
  // en una iteración futura, respetando el contrato PUT /api/sprint/hu/:id.
  // ------------------------------------------------------------------

  async function updateHu(id, updates) {
    try {
      const payload = Object.assign({ confirm: true }, updates);
      state = await apiSend("PUT", "/api/sprint/hu/" + encodeURIComponent(id), payload);
      renderAll();
      showToast("HU " + id + " actualizada.", "success");
    } catch (err) {
      if (err.status === 423) {
        showToast("Esta HU está en sprint activo, no se puede editar desde aquí.", "warn");
      } else {
        showToast("No se pudo actualizar la HU: " + err.message, "error");
      }
    }
  }

  // ------------------------------------------------------------------
  // Navegación por pestañas
  // ------------------------------------------------------------------

  function setupTabs() {
    qsa(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa(".tab-btn").forEach((b) => b.classList.remove("active"));
        qsa(".tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        qs("#" + btn.dataset.tab).classList.add("active");
        resizeAllCharts();
      });
    });

    qsa(".subtab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa(".subtab-btn").forEach((b) => b.classList.remove("active"));
        qsa(".subtab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        qs("#" + btn.dataset.subtab).classList.add("active");
        resizeAllCharts();
      });
    });

    qsa("[data-toggle-form]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = qs("#" + btn.dataset.toggleForm);
        target.classList.toggle("open");
      });
    });
  }

  function setupHeaderButtons() {
    qs("#btn-sync").addEventListener("click", doSync);
    qs("#btn-pdf").addEventListener("click", doGeneratePdf);
    // Botón "Exportar requisitos a PDF" de la pestaña Requisitos: usa el mismo
    // POST /api/pdf que el botón global (informe completo), que desde la
    // integración final incluye también la sección "Requisitos" (legacy +
    // Paso 0) en lib/printView.js.
    const btnPdfRequisitos = qs("#btn-pdf-requisitos");
    if (btnPdfRequisitos) {
      btnPdfRequisitos.addEventListener("click", async () => {
        await doGeneratePdf(btnPdfRequisitos);
      });
    }
  }

  window.addEventListener("resize", debounce(resizeAllCharts, 150));

  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  // ------------------------------------------------------------------
  // Bootstrap
  // ------------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    if (!ECHARTS_AVAILABLE) {
      console.warn("echarts no está disponible (vendor/echarts.min.js no encontrado). Ejecuta npm run setup.");
    }
    setupTabs();
    setupHeaderButtons();
    loadInitial();
  });
})();
