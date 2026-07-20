/**
 * JiraHistorico — copia persistente y "congelada" de lo que aparece en la
 * pestaña JiraImport (alimentada por el complemento "Jira Cloud for Sheets",
 * fórmula =JIRA(jql, campos) — ver README.md, sección "Analítica de Jira").
 * Deliberadamente FUERA del sistema genérico de TipoDescriptorsSheets.gs: no
 * es editable desde el dashboard, no la puebla la migración, y su upsert es
 * por clave natural (Key de Jira), no por ID autogenerado — no encaja en
 * ningún "kind" existente, y forzarla dentro de esa tabla compartida
 * arriesgaría el resto de tipos que sí dependen de ella para poco beneficio
 * real en un caso de uso único. Lector/escritor propios, en este archivo.
 *
 * Por qué existe esta copia en vez de leer JiraImport directamente: el JQL
 * de JiraImport está acotado a sprints abiertos (más una ventana de gracia
 * para sprints recién cerrados — ver README). En cuanto una incidencia deja
 * de aparecer ahí, desaparece para siempre de esa vista. JiraHistorico la
 * conserva.
 *
 * Semántica de "congelado" — deliberada, no un descuido: sincronizarJiraHistorico_
 * SOLO toca filas que siguen visibles en JiraImport en el momento de
 * sincronizar. Una vez que una incidencia deja de verse ahí, su fila aquí
 * deja de tocarse PARA SIEMPRE — sus valores quedan tal cual estaban la
 * última vez que se vio. Esto es lo que hace posible una "velocidad
 * histórica" estable: los puntos de un sprint ya cerrado no deben moverse
 * porque alguien edite esa incidencia en Jira meses después.
 */

var JIRA_HISTORICO_HOJA_ = 'JiraHistorico';
var JIRA_IMPORT_HOJA_ = 'JiraImport';

// Columnas de la pestaña JiraHistorico, en este orden exacto.
var JIRA_HISTORICO_COLUMNAS_ = [
  'Proyecto', 'Key', 'Resumen', 'Estado', 'EstadoCategoria', 'Asignado', 'Tipo',
  'Prioridad', 'Creada', 'Actualizada', 'Resuelta', 'StoryPoints', 'SprintsJSON',
  'EpicLink', 'PrimeraVezVisto', 'UltimaVezVisto',
];

// Columnas que produce la fórmula =JIRA(...) en JiraImport, en este orden
// exacto (ver README.md para el texto completo de la fórmula recomendada).
// La lectura es POSICIONAL, no por nombre de cabecera: el complemento
// traduce algunos campos a etiquetas en español ("Story Points", "Creada")
// y deja otros con el propio path con puntos ("status.name") sin ninguna
// regla predecible — un match por texto de cabecera sería más frágil que
// fijarse solo en la posición y comprobar que la fila 1 tiene forma de
// tabla real (ver leerFilasJiraImport_).
var JIRA_IMPORT_NUM_COLUMNAS_ = 14;
var JIRA_IMPORT_COL_KEY_ = 0;
var JIRA_IMPORT_COL_RESUMEN_ = 1;
var JIRA_IMPORT_COL_ESTADO_ = 2;
var JIRA_IMPORT_COL_ESTADO_CATEGORIA_ = 3;
var JIRA_IMPORT_COL_ASIGNADO_ = 4;
var JIRA_IMPORT_COL_TIPO_ = 5;
var JIRA_IMPORT_COL_PRIORIDAD_ = 6;
var JIRA_IMPORT_COL_CREADA_ = 7;
var JIRA_IMPORT_COL_ACTUALIZADA_ = 8;
var JIRA_IMPORT_COL_RESUELTA_ = 9;
var JIRA_IMPORT_COL_VENCIMIENTO_ = 10;
var JIRA_IMPORT_COL_STORYPOINTS_ = 11;
var JIRA_IMPORT_COL_SPRINT_ = 12;
var JIRA_IMPORT_COL_EPIC_ = 13;

// ============================================================================
// Normalización de fechas y nombres de sprint
// ============================================================================

/** Convierte un valor de celda (Date real o texto "DD/MM/AAAA" o ISO) a
 *  "AAAA-MM-DD" estable para guardar. Si no se puede interpretar, se guarda
 *  el texto tal cual — mejor conservar el dato en bruto que perderlo. */
function normalizarFecha_(valor) {
  if (!valor) return '';
  if (valor instanceof Date) {
    if (isNaN(valor.getTime())) return '';
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const texto = String(valor).trim();
  if (!texto) return '';
  const m = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3] + '-' + pad_(parseInt(m[2], 10), 2) + '-' + pad_(parseInt(m[1], 10), 2);
  const d = new Date(texto);
  if (!isNaN(d.getTime())) return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return texto;
}

var JIRA_MESES_ES_ = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };

/**
 * Parsea "Sprint 5 (20-31 jul 2026)" -> { nombre, numero, inicio, fin }
 * (Date o null si no hace match). Best-effort: si el formato no encaja
 * (p. ej. un sprint que cruza de mes), se devuelve con inicio/fin null —
 * sigue siendo válido como bucket de agrupación por nombre para la
 * velocidad histórica, solo se pierde la posibilidad de ordenar
 * cronológicamente o de desambiguar cuál es "el vigente" por fecha.
 */
function parsearNombreSprint_(nombre) {
  const texto = String(nombre || '');
  const numMatch = texto.match(/Sprint\s*(\d+)/i);
  const numero = numMatch ? parseInt(numMatch[1], 10) : null;

  // Mismo mes: "Sprint 5 (20-31 jul 2026)"
  let m = texto.match(/\((\d{1,2})-(\d{1,2})\s+([a-záéíóúñ]{3,4})\.?\s+(\d{4})\)/i);
  if (m) {
    const mesIdx = JIRA_MESES_ES_[m[3].toLowerCase().slice(0, 3)];
    if (mesIdx !== undefined) {
      const anio = parseInt(m[4], 10);
      return { nombre: texto, numero: numero, inicio: new Date(anio, mesIdx, parseInt(m[1], 10)), fin: new Date(anio, mesIdx, parseInt(m[2], 10)) };
    }
  }
  // Cruza de mes: "Sprint 5 (28 jun-5 jul 2026)"
  m = texto.match(/\((\d{1,2})\s+([a-záéíóúñ]{3,4})\.?\s*-\s*(\d{1,2})\s+([a-záéíóúñ]{3,4})\.?\s+(\d{4})\)/i);
  if (m) {
    const mesIni = JIRA_MESES_ES_[m[2].toLowerCase().slice(0, 3)];
    const mesFin = JIRA_MESES_ES_[m[4].toLowerCase().slice(0, 3)];
    if (mesIni !== undefined && mesFin !== undefined) {
      const anio = parseInt(m[5], 10);
      return { nombre: texto, numero: numero, inicio: new Date(anio, mesIni, parseInt(m[1], 10)), fin: new Date(anio, mesFin, parseInt(m[3], 10)) };
    }
  }
  return { nombre: texto, numero: numero, inicio: null, fin: null };
}

// ============================================================================
// Lectura de JiraImport (la fórmula =JIRA(...) en vivo)
// ============================================================================

/**
 * Lee las filas actuales de JiraImport, anclado en la celda A1 (donde vive
 * la fórmula =JIRA(...)) con getDataRegion, para seguir el tamaño real del
 * resultado matricial en vez de un rango fijo o getLastRow() de toda la
 * hoja. Devuelve null (sin lanzar) si la tabla no tiene forma de fiar, para
 * que el llamador aborte sin escribir nada.
 */
function leerFilasJiraImport_(hojaImport) {
  // OJO: getDataRegion(Dimension.ROWS) anclado en una celda 1x1 (A1) solo
  // expande VERTICALMENTE dentro de esa misma columna — no ensancha a las
  // demás columnas de la tabla. El resultado real era un rango de una sola
  // columna, que nunca podía tener las 14 columnas esperadas (bug real,
  // encontrado en producción: la sincronización abortaba siempre aunque
  // JiraImport tuviera datos perfectamente válidos). getDataRange() sobre
  // la propia hoja sí cubre todo el bloque de datos, en las dos dimensiones.
  const region = hojaImport.getDataRange();
  const valores = region.getValues();
  if (valores.length < 2) return null;

  const cabecera = valores[0];
  if (cabecera.length < JIRA_IMPORT_NUM_COLUMNAS_) return null;

  const filas = [];
  for (let i = 1; i < valores.length; i++) {
    const row = valores[i];
    const key = String(row[JIRA_IMPORT_COL_KEY_] || '').trim();
    if (!key) continue;
    if (!/^[A-Za-z][A-Za-z0-9]*-\d+$/.test(key)) continue; // fila rara (banner de error del complemento, etc.) — se ignora, no aborta el lote
    filas.push({
      key: key,
      resumen: row[JIRA_IMPORT_COL_RESUMEN_] || '',
      estado: row[JIRA_IMPORT_COL_ESTADO_] || '',
      estadoCategoria: row[JIRA_IMPORT_COL_ESTADO_CATEGORIA_] || '',
      asignado: row[JIRA_IMPORT_COL_ASIGNADO_] || '',
      tipo: row[JIRA_IMPORT_COL_TIPO_] || '',
      prioridad: row[JIRA_IMPORT_COL_PRIORIDAD_] || '',
      creada: normalizarFecha_(row[JIRA_IMPORT_COL_CREADA_]),
      actualizada: normalizarFecha_(row[JIRA_IMPORT_COL_ACTUALIZADA_]),
      resuelta: normalizarFecha_(row[JIRA_IMPORT_COL_RESUELTA_]),
      storyPoints: row[JIRA_IMPORT_COL_STORYPOINTS_],
      sprintsRaw: row[JIRA_IMPORT_COL_SPRINT_] || '',
      epicLink: row[JIRA_IMPORT_COL_EPIC_] || '',
    });
  }
  if (filas.length === 0) return null;
  return filas;
}

// ============================================================================
// Sincronización — upsert por (Proyecto, Key), nunca borra filas
// ============================================================================

function marcarErrorSyncJira_(mensaje) {
  PropertiesService.getScriptProperties().setProperty('jiraSyncError', new Date().toISOString() + ' — ' + mensaje);
  return { ok: false, error: mensaje };
}

function construirFilaJiraHistorico_(proyectoId, item, ahoraIso, filaExistente) {
  const colPrimeraVez = JIRA_HISTORICO_COLUMNAS_.indexOf('PrimeraVezVisto');
  const primeraVezVisto = filaExistente ? filaExistente[colPrimeraVez] : ahoraIso;
  const sprints = String(item.sprintsRaw || '').split(';').map(function (s) { return s.trim(); }).filter(Boolean);
  const valoresPorColumna = {
    Proyecto: proyectoId, Key: item.key, Resumen: item.resumen, Estado: item.estado,
    EstadoCategoria: item.estadoCategoria, Asignado: item.asignado, Tipo: item.tipo,
    Prioridad: item.prioridad, Creada: item.creada, Actualizada: item.actualizada,
    Resuelta: item.resuelta, StoryPoints: item.storyPoints === undefined ? '' : item.storyPoints,
    SprintsJSON: JSON.stringify(sprints), EpicLink: item.epicLink,
    PrimeraVezVisto: primeraVezVisto, UltimaVezVisto: ahoraIso,
  };
  return JIRA_HISTORICO_COLUMNAS_.map(function (col) { return valoresPorColumna[col]; });
}

/**
 * Vuelca lo que hay ahora mismo en JiraImport a JiraHistorico, en modo
 * upsert por (Proyecto, Key). Ver la nota de "congelado" al principio del
 * archivo — nunca borra ni re-toca una fila que ya no aparece en JiraImport.
 */
function sincronizarJiraHistorico_(sheetId, proyectoId) {
  const lock = LockService.getScriptLock();
  const tieneLock = lock.tryLock(20000);
  if (!tieneLock) {
    return { ok: false, error: 'No se pudo obtener el bloqueo (otra sincronización en curso). Reintenta en un momento.' };
  }
  try {
    const ss = SpreadsheetApp.openById(sheetId);
    const hojaImport = ss.getSheetByName(JIRA_IMPORT_HOJA_);
    if (!hojaImport) {
      return marcarErrorSyncJira_('No existe la pestaña "' + JIRA_IMPORT_HOJA_ + '". Ejecuta crearHojaJiraImport primero.');
    }

    const filasImport = leerFilasJiraImport_(hojaImport);
    if (filasImport === null) {
      return marcarErrorSyncJira_('JiraImport no tiene forma de tabla válida ahora mismo (¿fórmula con error, sesión del complemento caducada, o sin resultados?). No se ha sincronizado nada — los datos anteriores se conservan.');
    }

    let hojaHistorico = ss.getSheetByName(JIRA_HISTORICO_HOJA_);
    if (!hojaHistorico) {
      hojaHistorico = ss.insertSheet(JIRA_HISTORICO_HOJA_);
      hojaHistorico.getRange(1, 1, 1, JIRA_HISTORICO_COLUMNAS_.length).setValues([JIRA_HISTORICO_COLUMNAS_]);
      hojaHistorico.setFrozenRows(1);
    }

    const lastRow = hojaHistorico.getLastRow();
    const existentes = lastRow >= 2 ? hojaHistorico.getRange(2, 1, lastRow - 1, JIRA_HISTORICO_COLUMNAS_.length).getValues() : [];
    const colKey = JIRA_HISTORICO_COLUMNAS_.indexOf('Key');
    const colProyecto = JIRA_HISTORICO_COLUMNAS_.indexOf('Proyecto');
    const indicePorClave = {};
    existentes.forEach(function (fila, i) { indicePorClave[fila[colProyecto] + '||' + fila[colKey]] = i; });

    const ahoraIso = new Date().toISOString();
    let creadas = 0, actualizadas = 0;

    filasImport.forEach(function (item) {
      const clave = proyectoId + '||' + item.key;
      const idx = indicePorClave[clave];
      const nuevaFila = construirFilaJiraHistorico_(proyectoId, item, ahoraIso, idx !== undefined ? existentes[idx] : null);
      if (idx !== undefined) {
        existentes[idx] = nuevaFila;
        actualizadas++;
      } else {
        existentes.push(nuevaFila);
        indicePorClave[clave] = existentes.length - 1;
        creadas++;
      }
    });

    if (existentes.length > 0) {
      hojaHistorico.getRange(2, 1, existentes.length, JIRA_HISTORICO_COLUMNAS_.length).setValues(existentes);
    }
    PropertiesService.getScriptProperties().deleteProperty('jiraSyncError');
    return { ok: true, creadas: creadas, actualizadas: actualizadas, vistasAhora: filasImport.length, totalHistorico: existentes.length };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// Lectura de JiraHistorico para el snapshot del dashboard
// ============================================================================

function leerJiraHistorico_(sheetId, proyectoId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName(JIRA_HISTORICO_HOJA_);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, JIRA_HISTORICO_COLUMNAS_.length).getValues();
  const idx = {};
  JIRA_HISTORICO_COLUMNAS_.forEach(function (col, i) { idx[col] = i; });
  const filas = [];
  values.forEach(function (row) {
    if (String(row[idx['Proyecto']] || '') !== String(proyectoId)) return;
    filas.push({
      key: row[idx['Key']], resumen: row[idx['Resumen']], estado: row[idx['Estado']],
      estadoCategoria: row[idx['EstadoCategoria']], asignado: row[idx['Asignado']], tipo: row[idx['Tipo']],
      prioridad: row[idx['Prioridad']], creada: row[idx['Creada']], actualizada: row[idx['Actualizada']],
      resuelta: row[idx['Resuelta']], storyPoints: row[idx['StoryPoints']],
      sprints: parseJsonSeguro_(row[idx['SprintsJSON']], []), epicLink: row[idx['EpicLink']],
      primeraVezVisto: row[idx['PrimeraVezVisto']], ultimaVezVisto: row[idx['UltimaVezVisto']],
    });
  });
  return filas;
}

// ============================================================================
// Los 4 cálculos — en tiempo de lectura, sin agregados guardados
// ============================================================================

function esDone_(item) {
  return String(item.estadoCategoria || '').toLowerCase() === 'done';
}

/**
 * Velocidad histórica: por cada nombre de sprint visto en cualquier
 * incidencia de JiraHistorico, suma de StoryPoints "done" vs. total. Una
 * incidencia que pasó por dos sprints cuenta en los dos — deliberado (sigue
 * siendo trabajo real de ambos), se avisa en la UI para que no se lea como
 * "no cuadra con el total de puntos único".
 */
function computeVelocidadHistoricaJira_(historico) {
  const porSprint = {};
  historico.forEach(function (item) {
    const pts = parseFloat(item.storyPoints) || 0;
    (item.sprints || []).forEach(function (nombreSprint) {
      if (!porSprint[nombreSprint]) porSprint[nombreSprint] = { nombre: nombreSprint, puntosHechos: 0, puntosTotal: 0 };
      porSprint[nombreSprint].puntosTotal += pts;
      if (esDone_(item)) porSprint[nombreSprint].puntosHechos += pts;
    });
  });
  const lista = Object.keys(porSprint).map(function (k) { return porSprint[k]; });
  lista.forEach(function (s) { s._parsed = parsearNombreSprint_(s.nombre); });
  lista.sort(function (a, b) {
    if (a._parsed.inicio && b._parsed.inicio) return a._parsed.inicio - b._parsed.inicio;
    if (a._parsed.numero !== null && b._parsed.numero !== null) return a._parsed.numero - b._parsed.numero;
    return a.nombre.localeCompare(b.nombre);
  });
  return lista.map(function (s) { return { nombre: s.nombre, puntosHechos: s.puntosHechos, puntosTotal: s.puntosTotal }; });
}

/**
 * Entrega por persona: agrupa por Asignado las incidencias con la
 * UltimaVezVisto más reciente (es decir, las que siguen visibles ahora
 * mismo en JiraImport — que ya viene filtrado a sprints abiertos + ventana
 * de gracia, así que no hace falta decidir "cuál" sprint es el vigente).
 */
function computeEntregaPorPersonaJira_(historico) {
  if (historico.length === 0) return [];
  const ultimaSync = historico.reduce(function (max, item) { return item.ultimaVezVisto > max ? item.ultimaVezVisto : max; }, '');
  const vigentes = historico.filter(function (item) { return item.ultimaVezVisto === ultimaSync; });
  const porPersona = {};
  vigentes.forEach(function (item) {
    const nombre = String(item.asignado || '').trim() || 'Sin asignar';
    if (!porPersona[nombre]) porPersona[nombre] = { nombre: nombre, total: 0, hechas: 0, puntosTotal: 0, puntosHechos: 0 };
    const pts = parseFloat(item.storyPoints) || 0;
    porPersona[nombre].total++;
    porPersona[nombre].puntosTotal += pts;
    if (esDone_(item)) {
      porPersona[nombre].hechas++;
      porPersona[nombre].puntosHechos += pts;
    }
  });
  return Object.keys(porPersona).map(function (k) {
    const p = porPersona[k];
    return {
      nombre: p.nombre, totalIncidencias: p.total, incidenciasHechas: p.hechas,
      puntosTotal: p.puntosTotal, puntosHechos: p.puntosHechos,
      pctCompletado: p.total ? Math.round((p.hechas / p.total) * 1000) / 10 : null,
    };
  });
}

/**
 * Cuellos de botella: incidencias no terminadas, ordenadas por días sin
 * tocar. Es una aproximación ("no se ha tocado hace N días"), NO tiempo real
 * en cada estado — eso pediría el historial de cambios de Jira, fuera de
 * alcance.
 */
function computeCuellosBotella_(historico, hoy) {
  const msPorDia = 24 * 60 * 60 * 1000;
  return historico
    .filter(function (item) { return !esDone_(item); })
    .map(function (item) {
      const actualizada = item.actualizada ? new Date(item.actualizada) : null;
      const dias = actualizada && !isNaN(actualizada.getTime()) ? Math.round((hoy - actualizada) / msPorDia) : null;
      return { key: item.key, resumen: item.resumen, asignado: item.asignado, estado: item.estado, diasSinTocar: dias };
    })
    .filter(function (item) { return item.diasSinTocar !== null; })
    .sort(function (a, b) { return b.diasSinTocar - a.diasSinTocar; });
}

/** Tiempos de ciclo: creación -> resolución, agrupado por tipo. */
function computeTiemposCiclo_(historico) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const porTipo = {};
  historico.forEach(function (item) {
    if (!item.resuelta || !item.creada) return;
    const creada = new Date(item.creada);
    const resuelta = new Date(item.resuelta);
    if (isNaN(creada.getTime()) || isNaN(resuelta.getTime())) return;
    const dias = (resuelta - creada) / msPorDia;
    if (dias < 0) return;
    const tipo = item.tipo || 'Sin tipo';
    if (!porTipo[tipo]) porTipo[tipo] = { tipo: tipo, total: 0, suma: 0 };
    porTipo[tipo].total++;
    porTipo[tipo].suma += dias;
  });
  return Object.keys(porTipo).map(function (k) {
    const t = porTipo[k];
    return { tipo: t.tipo, incidencias: t.total, mediaDias: Math.round((t.suma / t.total) * 10) / 10 };
  });
}

// ============================================================================
// Configuración del trigger automático — mismo patrón "ejecuta esto una vez"
// que bootstrapNuevoCliente / crearHojaJiraImport (ver Code.gs)
// ============================================================================

var JIRA_SYNC_PROP_SHEET_ID_ = 'jiraSyncSheetId';
var JIRA_SYNC_PROP_PROYECTO_ID_ = 'jiraSyncProyectoId';
var JIRA_SYNC_TRIGGER_HANDLER_ = 'triggerSincronizarJiraHistorico';

/**
 * Configuración de una sola vez: guarda sheetId/proyectoId en las
 * propiedades del script (los triggers por tiempo invocan su función sin
 * argumentos) y crea un disparador periódico. Segura de volver a ejecutar —
 * borra cualquier trigger anterior con el mismo manejador antes de crear
 * uno nuevo, para no acumular disparadores duplicados.
 */
function configurarSyncJiraAutomatico(sheetId, proyectoId, horas) {
  const intervaloHoras = horas || 2;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === JIRA_SYNC_TRIGGER_HANDLER_) ScriptApp.deleteTrigger(t);
  });
  const props = PropertiesService.getScriptProperties();
  props.setProperty(JIRA_SYNC_PROP_SHEET_ID_, sheetId);
  props.setProperty(JIRA_SYNC_PROP_PROYECTO_ID_, proyectoId);
  ScriptApp.newTrigger(JIRA_SYNC_TRIGGER_HANDLER_).timeBased().everyHours(intervaloHoras).create();
  const resultado = sincronizarJiraHistorico_(sheetId, proyectoId);
  return 'Trigger creado (cada ' + intervaloHoras + 'h). Primera sincronización: ' + JSON.stringify(resultado);
}

/** Función invocada por el trigger por tiempo — sin argumentos a propósito. */
function triggerSincronizarJiraHistorico() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty(JIRA_SYNC_PROP_SHEET_ID_);
  const proyectoId = props.getProperty(JIRA_SYNC_PROP_PROYECTO_ID_);
  if (!sheetId || !proyectoId) {
    console.error('triggerSincronizarJiraHistorico: faltan propiedades — ejecuta configurarSyncJiraAutomatico primero.');
    return;
  }
  sincronizarJiraHistorico_(sheetId, proyectoId);
}
