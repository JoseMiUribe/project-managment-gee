/**
 * PM Copilot Dashboard — MODO NUBE (Google Apps Script + Google Sheets)
 *
 * Un único Web App desplegado UNA VEZ sirve a todos los clientes: cada
 * petición recibe `sheet` (ID de la Google Sheet del cliente) y `proyecto`
 * (identificador corto del engagement dentro de esa Sheet) como parámetros,
 * y abre dinámicamente el recurso correspondiente — nunca hay un recurso de
 * Google fijo por cliente en este código. El aislamiento entre clientes lo
 * garantiza el propio permiso de la Sheet (desplegado con "Ejecutar como: el
 * usuario que accede"), no ninguna lógica de autorización de aquí — ver
 * README.md, sección "Por qué un único Web App".
 *
 * Sustituye a dashboard/server.js (Express) + dashboard/lib/dataBackend/*.js
 * (modo local) para el caso "todo alojado en Google": no hay ningún servidor
 * Node corriendo en modo nube, este archivo ES el servidor. La forma del
 * snapshot que devuelve leerSnapshot() es deliberadamente idéntica a la de
 * dashboard/lib/buildSnapshot.js para que dashboard/cloud-apps-script/AppJs.html
 * (copia adaptada de dashboard/public/app.js) no necesite saber en qué modo
 * está corriendo.
 *
 * Lo que este modo NO cubre todavía (ver mejoras-pendientes.md):
 *   - Generación de PDF en servidor (Playwright no existe en Apps Script) —
 *     sustituido por "imprimir desde el navegador" (ver AppJs.html).
 *   - Contenido de documentos sueltos (Documentos es solo catálogo de
 *     metadatos, el .md real sigue viviendo en local/Drive Desktop).
 *   - Sincronización en vivo con Jira (analisisJira siempre null aquí).
 *   - Escritura de HU de sprint no bloqueadas (igual que en modo local: no
 *     implementado, 501).
 *   - Sincronización bidireccional con el markdown local (Fase 4 del plan).
 */

// ============================================================================
// Helpers genéricos de Sheets
// ============================================================================

function abrirSheet_(sheetId) {
  return SpreadsheetApp.openById(sheetId);
}

function obtenerHoja_(sheetId, nombreHoja) {
  const ss = abrirSheet_(sheetId);
  const sheet = ss.getSheetByName(nombreHoja);
  if (!sheet) {
    throw new Error('No existe la pestaña "' + nombreHoja + '" en esta Sheet. Ejecuta bootstrapClientSheet() una vez sobre ella antes de usarla (ver README.md).');
  }
  return sheet;
}

function pad_(n, longitud) {
  let s = String(n);
  while (s.length < longitud) s = '0' + s;
  return s;
}

function parseJsonSeguro_(valor, porDefecto) {
  if (valor === '' || valor === null || valor === undefined) return porDefecto;
  try {
    return JSON.parse(valor);
  } catch (err) {
    return porDefecto;
  }
}

function esVerdadero_(valor) {
  return valor === true || String(valor).trim().toLowerCase() === 'true';
}

/** Lee todas las filas de una pestaña como objetos {columna: valor}, en el
 *  orden de columnas declarado (posicional — no reordenar columnas a mano en
 *  la Sheet, ver README.md). Descarta filas completamente vacías. */
function leerFilasComoObjetos_(sheetId, nombreHoja, columnas) {
  const sheet = obtenerHoja_(sheetId, nombreHoja);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, columnas.length).getValues();
  const filas = [];
  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const vacia = row.every(function (c) { return c === '' || c === null || c === undefined; });
    if (vacia) continue;
    const obj = { _fila: i + 2 };
    columnas.forEach(function (col, idx) { obj[col] = row[idx]; });
    filas.push(obj);
  }
  return filas;
}

/** Filas de un tipo declarado en TIPO_DESCRIPTORS_SHEETS, ya filtradas por
 *  el proyecto pedido (una misma Sheet aloja varios engagements del cliente). */
function filasDe_(sheetId, proyectoId, tipo) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
  const columnas = columnasDeHoja_(descriptor);
  const todas = leerFilasComoObjetos_(sheetId, descriptor.hoja, columnas);
  return todas.filter(function (f) { return String(f['Proyecto'] || '') === String(proyectoId); });
}

function siguienteId_(idsExistentes, idPrefix) {
  let max = 0;
  const re = new RegExp('^' + idPrefix + '-(\\d+)$', 'i');
  idsExistentes.forEach(function (id) {
    const m = String(id || '').match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  });
  return idPrefix + '-' + pad_(max + 1, 3);
}

// ============================================================================
// Lectura por tipo — traduce cada pestaña de vuelta a la misma forma de
// objeto que ya usan dashboard/lib/parsers/*.js en modo local, para que
// leerSnapshot() ensamble un objeto idéntico al de buildSnapshot.js.
// ============================================================================

function filaARegistro_(fila, descriptor) {
  const out = { id: fila['ID'] || '' };
  Object.keys(descriptor.campos).forEach(function (key) {
    out[key] = fila[descriptor.campos[key]] || '';
  });
  out.ultimaModificacion = fila['Última modificación'] || '';
  out.modificadoPor = fila['Modificado por'] || '';
  return out;
}

function leerRegistros_(sheetId, proyectoId, tipo) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
  return filasDe_(sheetId, proyectoId, tipo).map(function (f) { return filaARegistro_(f, descriptor); });
}

function leerEpicas_(sheetId, proyectoId) {
  return filasDe_(sheetId, proyectoId, 'epicas').map(function (f) {
    return {
      id: f['ID'] || '', nombre: f['Nombre'] || '', objetivo: f['Objetivo'] || '',
      requisitos: f['Requisitos'] || '', dependencias: f['Dependencias'] || '',
      decisionPendiente: f['DecisionPendiente'] || '', riesgosAsociados: f['RiesgosAsociados'] || '',
      prioridad: f['Prioridad'] || '', notas: f['Notas'] || '', fase: f['Fase'] || null,
    };
  });
}

function leerRoadmapClienteHitos_(sheetId, proyectoId) {
  return filasDe_(sheetId, proyectoId, 'roadmapClienteHitos').map(function (f) {
    return {
      numero: f['Numero'] || null, nombre: f['Nombre'] || '', queIncluye: f['QueIncluye'] || '',
      ventanaEstimada: f['VentanaEstimada'] || '', confianza: f['Confianza'] || '', dependeDe: f['DependeDe'] || '',
    };
  });
}

function leerRoadmapCliente_(sheetId, proyectoId) {
  const hitos = leerRoadmapClienteHitos_(sheetId, proyectoId);
  const filas = filasDe_(sheetId, proyectoId, 'roadmapClienteMeta');
  if (filas.length === 0) {
    return hitos.length
      ? { versionPara: '', fecha: '', proximaRevision: '', confianzaGlobal: '', resumenEjecutivo: '', hitos: hitos, premisas: [], nivelesConfianza: [] }
      : null;
  }
  const f = filas[0];
  return {
    versionPara: f['VersionPara'] || '', fecha: f['Fecha'] || '', proximaRevision: f['ProximaRevision'] || '',
    confianzaGlobal: f['ConfianzaGlobal'] || '', resumenEjecutivo: f['ResumenEjecutivo'] || '',
    hitos: hitos, premisas: parseJsonSeguro_(f['PremisasJSON'], []), nivelesConfianza: parseJsonSeguro_(f['NivelesConfianzaJSON'], []),
  };
}

function leerJsonUnico_(sheetId, proyectoId, tipo) {
  const filas = filasDe_(sheetId, proyectoId, tipo);
  if (filas.length === 0) return null;
  return parseJsonSeguro_(filas[0]['DatosJSON'], null);
}

function leerCapacidadActual_(sheetId, proyectoId) {
  const filas = filasDe_(sheetId, proyectoId, 'capacidad');
  const actual = filas.filter(function (f) { return esVerdadero_(f['EsActual']); })[0];
  if (!actual) return null;
  return parseJsonSeguro_(actual['DatosJSON'], null);
}

function leerReglasNegocio_(sheetId, proyectoId) {
  return filasDe_(sheetId, proyectoId, 'reglasNegocio').map(function (f) {
    return { id: f['ID'] || '', regla: f['Regla'] || '', afectaA: f['AfectaA'] || '' };
  });
}

function esImplicito_(origen) {
  return /impl[ií]cito/i.test(String(origen || ''));
}

function leerRequisitosPaso0_(sheetId, proyectoId) {
  const peticiones = leerRegistros_(sheetId, proyectoId, 'peticiones');
  const funcionales = leerRegistros_(sheetId, proyectoId, 'funcionales');
  const noFuncionales = leerRegistros_(sheetId, proyectoId, 'nofuncionales').map(function (r) {
    return Object.assign({}, r, { implicito: esImplicito_(r.origen) });
  });
  const zonasIncertidumbre = leerRegistros_(sheetId, proyectoId, 'zonas');
  return {
    peticiones: peticiones,
    funcionales: funcionales,
    reglasNegocio: leerReglasNegocio_(sheetId, proyectoId),
    noFuncionales: noFuncionales,
    zonasIncertidumbre: zonasIncertidumbre,
    resumen: {
      totalPeticiones: peticiones.length,
      totalFuncionales: funcionales.length,
      totalNoFuncionales: noFuncionales.length,
      totalZonasIncertidumbre: zonasIncertidumbre.length,
      noFuncionalesImplicitos: noFuncionales.filter(function (r) { return r.implicito; }).length,
    },
  };
}

function sprintEstaActivo_(sprint, hoy) {
  if (!sprint.fechaFin) return true;
  const fin = new Date(sprint.fechaFin);
  const inicio = sprint.fechaInicio ? new Date(sprint.fechaInicio) : fin;
  if (hoy >= inicio && hoy <= fin) return true;
  return !sprint.revisionCerrada;
}

function leerSprints_(sheetId, proyectoId) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const sprintsRaw = filasDe_(sheetId, proyectoId, 'sprints').map(function (f) {
    return {
      numero: f['Numero'], fechas: f['Fechas'] || '', fechaInicio: f['FechaInicio'] || '', fechaFin: f['FechaFin'] || '',
      objetivo: f['Objetivo'] || '', capacidadDisponible: f['CapacidadDisponible'] || '', capacidadOcupada: f['CapacidadOcupada'] || '',
      revisionCerrada: esVerdadero_(f['RevisionCerrada']), nuevosRiesgos: parseJsonSeguro_(f['NuevosRiesgosJSON'], []),
    };
  });

  const husTodas = filasDe_(sheetId, proyectoId, 'sprintHu').map(function (f) {
    return {
      sprintNumero: f['SprintNumero'], hu: f['HU'] || '', epica: f['Epica'] || '', titulo: f['Titulo'] || '',
      estado: f['Estado'] || '', tallas: f['Tallas'] || '', subtareas: parseJsonSeguro_(f['SubtareasJSON'], []),
    };
  });

  return sprintsRaw
    .map(function (s) {
      const activo = sprintEstaActivo_(s, hoy);
      return {
        numero: s.numero, fechas: s.fechas, fechaInicio: s.fechaInicio, fechaFin: s.fechaFin,
        objetivo: s.objetivo, capacidadDisponible: s.capacidadDisponible, capacidadOcupada: s.capacidadOcupada,
        nuevosRiesgos: s.nuevosRiesgos, activo: activo, origen: 'local',
        hu: husTodas
          .filter(function (h) { return h.sprintNumero === s.numero; })
          .map(function (h) {
            return { hu: h.hu, epica: h.epica, titulo: h.titulo, estado: h.estado, tallas: h.tallas, subtareas: h.subtareas, locked: activo };
          }),
      };
    })
    .sort(function (a, b) { return (a.numero || 0) - (b.numero || 0); });
}

/** Mismo criterio que sprintLock.js#getLockedHuIds en modo local: el conjunto
 *  de IDs de HU que pertenecen a cualquier sprint activo ahora mismo. */
function idsHuBloqueadas_(sprints) {
  const ids = {};
  sprints.forEach(function (s) {
    if (!s.activo) return;
    s.hu.forEach(function (h) { if (h.hu) ids[h.hu.trim()] = true; });
  });
  return ids;
}

function leerDailylogs_(sheetId, proyectoId) {
  return filasDe_(sheetId, proyectoId, 'dailylogs')
    .map(function (f) {
      return {
        fecha: f['Fecha'] || '', sprint: f['Sprint'] || '', dia: f['Dia'] || '', puntosRestantes: f['PuntosRestantes'] || '',
        progreso: parseJsonSeguro_(f['ProgresoJSON'], []),
        actualizacionesGee: parseJsonSeguro_(f['ActualizacionesGeeJSON'], []),
        notas: parseJsonSeguro_(f['NotasJSON'], []),
      };
    })
    .sort(function (a, b) { return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0; });
}

function leerDocumentos_(sheetId, proyectoId) {
  return filasDe_(sheetId, proyectoId, 'documentos').map(function (f) {
    return {
      ruta: f['Ruta'] || '', titulo: f['Titulo'] || '', descripcion: f['Descripcion'] || '',
      paso: f['Paso'] || '', tamano: f['Tamano'] || '', modificadoEn: f['ModificadoEn'] || '',
    };
  });
}

function leerCambiosPendientes_(sheetId, proyectoId) {
  const items = filasDe_(sheetId, proyectoId, 'cambiosPendientes').map(function (f) {
    return {
      id: f['ID'] || '', fechaHora: f['Fecha/Hora'] || '', artefacto: f['Artefacto'] || '',
      registroId: f['Registro'] || '', camposModificados: f['Campos modificados'] || '', procesado: f['Procesado'] || '',
    };
  });
  const pendientesCount = items.filter(function (c) {
    const p = String(c.procesado || '').trim().toLowerCase();
    return p !== 'sí' && p !== 'si';
  }).length;
  return { items: items, pendientesCount: pendientesCount };
}

// ============================================================================
// Métricas — copia de la lógica de dashboard/lib/buildSnapshot.js
// ============================================================================

function ragKey_(value) {
  if (!value) return null;
  const v = String(value).toLowerCase();
  if (v.indexOf('verde') !== -1) return 'verde';
  if (v.indexOf('amarillo') !== -1) return 'amarillo';
  if (v.indexOf('rojo') !== -1) return 'rojo';
  return null;
}

function countByRag_(items, field) {
  const counts = { verde: 0, amarillo: 0, rojo: 0 };
  items.forEach(function (item) {
    const key = ragKey_(item[field]);
    if (key) counts[key]++;
  });
  return counts;
}

function parsePts_(value) {
  if (!value) return null;
  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

function computeSprintCompletionPct_(sprintActivo) {
  if (!sprintActivo || !sprintActivo.hu || sprintActivo.hu.length === 0) return null;
  const total = sprintActivo.hu.length;
  const hechas = sprintActivo.hu.filter(function (hu) { return /hecho|terminad|complet|✅/i.test(hu.estado || ''); }).length;
  return Math.round((hechas / total) * 1000) / 10;
}

function computeVelocidadPorSprint_(sprints) {
  return sprints.map(function (sprint) {
    return { sprint: sprint.numero, ptsCompletados: parsePts_(sprint.capacidadOcupada) };
  });
}

function calcularMetricas_(riesgos, dependencias, impedimentos, sprints) {
  const sprintActivo = sprints.filter(function (s) { return s.activo; })[0] || null;
  return {
    sprintCompletionPct: computeSprintCompletionPct_(sprintActivo),
    riesgosPorRag: countByRag_(riesgos, 'rag'),
    dependenciasPorCriticidad: countByRag_(dependencias, 'criticidadRag'),
    velocidadPorSprint: computeVelocidadPorSprint_(sprints),
    impedimentosAbiertos: impedimentos.filter(function (im) { return !im.fechaFin || !String(im.fechaFin).trim(); }).length,
  };
}

// ============================================================================
// Snapshot completo — misma forma que dashboard/lib/buildSnapshot.js
// ============================================================================

function leerSnapshot(sheetId, proyectoId) {
  const riesgos = leerRegistros_(sheetId, proyectoId, 'riesgos');
  const dependencias = leerRegistros_(sheetId, proyectoId, 'dependencias');
  const acciones = leerRegistros_(sheetId, proyectoId, 'acciones');
  const impedimentos = leerRegistros_(sheetId, proyectoId, 'impedimentos');
  const changelog = leerRegistros_(sheetId, proyectoId, 'changelog');
  const dailylogs = leerDailylogs_(sheetId, proyectoId);

  const epicas = leerEpicas_(sheetId, proyectoId);
  const capacidadActual = leerCapacidadActual_(sheetId, proyectoId);
  const roadmapTecnico = leerJsonUnico_(sheetId, proyectoId, 'roadmapTecnico');
  const roadmapCliente = leerRoadmapCliente_(sheetId, proyectoId);

  const sprints = leerSprints_(sheetId, proyectoId);

  const legacy = leerJsonUnico_(sheetId, proyectoId, 'legacy');
  const paso0 = leerRequisitosPaso0_(sheetId, proyectoId);
  const cambiosPendientes = leerCambiosPendientes_(sheetId, proyectoId);
  const documentos = leerDocumentos_(sheetId, proyectoId);

  const metricas = calcularMetricas_(riesgos, dependencias, impedimentos, sprints);

  const ss = abrirSheet_(sheetId);

  return {
    proyecto: {
      nombre: proyectoId,
      rutaAbsoluta: '(nube) ' + ss.getName() + ' / ' + proyectoId,
      generadoEn: new Date().toISOString(),
      // La sincronización en vivo con Jira no está construida en modo nube
      // todavía (necesitaría su propia historia de autenticación desde Apps
      // Script) — ver mejoras-pendientes.md.
      jiraSyncedAt: null,
      jiraFuenteViva: false,
    },
    gee: { riesgos: riesgos, dependencias: dependencias, acciones: acciones, impedimentos: impedimentos, changelog: changelog, dailylogs: dailylogs },
    roadmap: { epicas: epicas, capacidadActual: capacidadActual, roadmapTecnico: roadmapTecnico, roadmapCliente: roadmapCliente },
    sprint: { sprints: sprints, analisisJira: null },
    requisitos: { legacy: legacy, paso0: paso0 },
    cambiosPendientes: cambiosPendientes,
    documentos: documentos,
    metricas: metricas,
  };
}

// ============================================================================
// Escritura — equivalente a dashboard/lib/dataBackend/local.js#writeRow
// ============================================================================

function escribirRegistro_(sheetId, proyectoId, tipo, id, camposSemanticos, meta) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const columnas = columnasRegistro_(descriptor);
  const numCols = columnas.length;
  const colId = columnas.indexOf('ID');
  const colProyecto = columnas.indexOf('Proyecto');

  const lastRow = sheet.getLastRow();
  let targetRowNum = -1;
  let valoresActuales = null;
  if (lastRow >= 2 && id) {
    const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][colId]) === String(id) && String(values[i][colProyecto]) === String(proyectoId)) {
        targetRowNum = i + 2;
        valoresActuales = values[i];
        break;
      }
    }
    if (targetRowNum === -1) {
      throw new Error('No se ha encontrado ningún registro con ID "' + id + '" en ' + descriptor.hoja + ' para el proyecto "' + proyectoId + '".');
    }
  }

  let idFinal = id;
  let creado = false;
  const fila = new Array(numCols).fill('');

  if (id) {
    for (let i = 0; i < numCols; i++) fila[i] = valoresActuales[i];
  } else {
    const existentes = filasDe_(sheetId, proyectoId, tipo).map(function (f) { return f['ID']; });
    idFinal = siguienteId_(existentes, descriptor.idPrefix);
    creado = true;
  }

  fila[colId] = idFinal;
  fila[colProyecto] = proyectoId;
  Object.keys(descriptor.campos).forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(camposSemanticos, key)) {
      fila[columnas.indexOf(descriptor.campos[key])] = camposSemanticos[key];
    }
  });
  fila[columnas.indexOf('Última modificación')] = new Date().toISOString();
  fila[columnas.indexOf('Modificado por')] = (meta && meta.origen) || 'skill';

  if (creado) {
    sheet.appendRow(fila);
  } else {
    sheet.getRange(targetRowNum, 1, 1, numCols).setValues([fila]);
  }
  return { id: idFinal, created: creado };
}

function registrarCambioPendiente_(sheetId, proyectoId, entry) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS.cambiosPendientes;
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const existentes = filasDe_(sheetId, proyectoId, 'cambiosPendientes').map(function (f) { return f['ID']; });
  const id = siguienteId_(existentes, descriptor.idPrefix);
  const campos = (entry.camposModificados || []).length ? entry.camposModificados.join(', ') : '(registro nuevo)';
  const fechaHora = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Madrid', 'yyyy-MM-dd HH:mm');
  sheet.appendRow([id, proyectoId, fechaHora, entry.artefacto, entry.registroId, campos, 'No']);
  return { id: id };
}

function agregarNotaDailylog_(sheetId, proyectoId, fechaInput, payload) {
  const texto = (payload && payload.texto) || '';
  if (!texto.trim()) throw new Error('La nota no puede estar vacía.');

  const fecha = fechaInput || Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Madrid', 'yyyy-MM-dd');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error('Fecha inválida: "' + fecha + '" (se espera YYYY-MM-DD).');

  const descriptor = TIPO_DESCRIPTORS_SHEETS.dailylogs;
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const columnas = descriptor.columnas;
  const colProyecto = columnas.indexOf('Proyecto');
  const colFecha = columnas.indexOf('Fecha');
  const colNotas = columnas.indexOf('NotasJSON');
  const colUltimaMod = columnas.indexOf('Última modificación');

  const lastRow = sheet.getLastRow();
  let targetRowNum = -1;
  let filaActual = null;
  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, columnas.length).getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][colProyecto]) === String(proyectoId) && values[i][colFecha] === fecha) {
        targetRowNum = i + 2;
        filaActual = values[i];
        break;
      }
    }
  }

  const autorFinal = (payload.autor && String(payload.autor).trim()) || 'Sin especificar';
  const fechaHora = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Madrid', 'yyyy-MM-dd HH:mm');
  const notaNueva = { fechaHora: fechaHora, autor: autorFinal, texto: texto.trim() };

  const creado = targetRowNum === -1;
  const fila = creado ? new Array(columnas.length).fill('') : filaActual.slice();
  const notasPrevias = creado ? [] : parseJsonSeguro_(fila[colNotas], []);
  notasPrevias.push(notaNueva);

  fila[colProyecto] = proyectoId;
  fila[colFecha] = fecha;
  if (creado) {
    fila[columnas.indexOf('Sprint')] = '';
    fila[columnas.indexOf('Dia')] = '';
    fila[columnas.indexOf('PuntosRestantes')] = '';
    fila[columnas.indexOf('ProgresoJSON')] = JSON.stringify([]);
    fila[columnas.indexOf('ActualizacionesGeeJSON')] = JSON.stringify([]);
  }
  fila[colNotas] = JSON.stringify(notasPrevias);
  fila[colUltimaMod] = new Date().toISOString();

  if (creado) {
    sheet.appendRow(fila);
  } else {
    sheet.getRange(targetRowNum, 1, 1, columnas.length).setValues([fila]);
  }
  return { fecha: fecha, created: creado };
}

// ============================================================================
// Funciones expuestas a google.script.run (llamadas desde AppJs.html)
//
// Ninguna lanza excepciones a través del puente RPC — el detalle de un error
// (status, mensaje) no sobrevive bien esa frontera. Todas devuelven
// { ok: true, data } o { ok: false, status, error }, que AppJs.html
// desempaqueta a exactamente lo que devolvía res.json()/ApiError en modo
// local (ver runGoogleScript en AppJs.html).
// ============================================================================

function ok_(data) { return { ok: true, data: data }; }
function fail_(status, error) { return { ok: false, status: status, error: error }; }

function apiGetData(sheetId, proyectoId) {
  try {
    return ok_(leerSnapshot(sheetId, proyectoId));
  } catch (err) {
    return fail_(500, 'Error generando el snapshot del proyecto: ' + err.message);
  }
}

function apiPostSync(sheetId, proyectoId) {
  // No hay caché ni Jira en vivo en modo nube (la Sheet ya es la fuente
  // compartida) — "sincronizar" es exactamente releer la Sheet.
  return apiGetData(sheetId, proyectoId);
}

function apiPutGee(sheetId, proyectoId, tipo, id, body) {
  if (!TIPO_DESCRIPTORS_SHEETS[tipo] || TIPO_DESCRIPTORS_SHEETS[tipo].kind !== 'registro') {
    return fail_(404, 'Tipo de registro GEE desconocido: "' + tipo + '".');
  }
  if (body.confirm !== true) {
    return fail_(400, 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para aplicar el cambio.');
  }
  try {
    const fields = {};
    Object.keys(body).forEach(function (k) { if (k !== 'confirm') fields[k] = body[k]; });
    escribirRegistro_(sheetId, proyectoId, tipo, id, fields, { origen: 'dashboard' });
    registrarCambioPendiente_(sheetId, proyectoId, { artefacto: tipo, registroId: id, camposModificados: Object.keys(fields) });
    return ok_(leerSnapshot(sheetId, proyectoId));
  } catch (err) {
    return fail_(500, 'Error actualizando ' + tipo + '/' + id + ': ' + err.message);
  }
}

function apiPostGee(sheetId, proyectoId, tipo, body) {
  if (!TIPO_DESCRIPTORS_SHEETS[tipo] || TIPO_DESCRIPTORS_SHEETS[tipo].kind !== 'registro') {
    return fail_(404, 'Tipo de registro GEE desconocido: "' + tipo + '".');
  }
  if (body.confirm !== true) {
    return fail_(400, 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para crear el registro.');
  }
  try {
    const fields = {};
    Object.keys(body).forEach(function (k) { if (k !== 'confirm') fields[k] = body[k]; });
    const result = escribirRegistro_(sheetId, proyectoId, tipo, null, fields, { origen: 'dashboard' });
    registrarCambioPendiente_(sheetId, proyectoId, { artefacto: tipo, registroId: result.id, camposModificados: [] });
    return ok_({ createdId: result.id, snapshot: leerSnapshot(sheetId, proyectoId) });
  } catch (err) {
    return fail_(500, 'Error creando registro en ' + tipo + ': ' + err.message);
  }
}

function apiPostDailylog(sheetId, proyectoId, body) {
  if (body.confirm !== true) {
    return fail_(400, 'Falta confirmación explícita. Envía { "confirm": true, autor, texto } para añadir la nota.');
  }
  try {
    const payload = { autor: body.autor, texto: body.texto };
    const result = agregarNotaDailylog_(sheetId, proyectoId, body.fecha || null, payload);
    return ok_({ fecha: result.fecha, creado: result.created, snapshot: leerSnapshot(sheetId, proyectoId) });
  } catch (err) {
    return fail_(500, 'Error añadiendo la nota al daily log: ' + err.message);
  }
}

// Mismo alcance que server.js en modo local: las HU en un sprint activo
// nunca se pueden editar (423, incondicional); las que no están en un sprint
// activo tampoco tienen un writer real implementado todavía (501) — no es un
// recorte de este modo nube, el modo local tampoco lo tiene.
function apiPutSprintHu(sheetId, proyectoId, id, body) {
  try {
    const sprints = leerSprints_(sheetId, proyectoId);
    const bloqueadas = idsHuBloqueadas_(sprints);
    if (bloqueadas[String(id).trim()]) {
      return fail_(423, 'Esta HU está en un sprint activo, no se puede modificar desde el dashboard ni pidiendo permiso — gestiónalo con el equipo técnico directamente.');
    }
    if (body.confirm !== true) {
      return fail_(400, 'Falta confirmación explícita. Envía { "confirm": true, ...campos } para aplicar el cambio.');
    }
    return fail_(501, 'La edición de HU de sprint no bloqueadas no está implementada en este dashboard. Edita el sprint-backlog-N.md correspondiente directamente o usa los prompts del skill.');
  } catch (err) {
    return fail_(500, 'Error comprobando el estado del sprint: ' + err.message);
  }
}

// ============================================================================
// doGet — único punto de entrada HTTP del Web App
// ============================================================================

function doGet(e) {
  const sheetId = e.parameter.sheet;
  const proyectoId = e.parameter.proyecto;
  const vista = e.parameter.vista || 'dashboard';

  if (!sheetId || !proyectoId) {
    return HtmlService.createHtmlOutput(
      '<p style="font-family:sans-serif;padding:24px;">Falta el parámetro <code>sheet</code> y/o <code>proyecto</code> en la URL. ' +
      'Pide al PM el enlace correcto para este proyecto (ver .pm-copilot.json → cloud.webAppUrl en su copia local del skill).</p>'
    );
  }

  if (vista === 'informe') {
    try {
      const snapshot = leerSnapshot(sheetId, proyectoId);
      return HtmlService.createHtmlOutput(renderPrintView(snapshot)).setTitle('Informe PM Copilot — ' + proyectoId);
    } catch (err) {
      return HtmlService.createHtmlOutput('<pre>Error generando el informe: ' + err.message + '</pre>');
    }
  }

  // OJO: NO usar setXFrameOptionsMode(ALLOWALL) aquí. Ese modo es para permitir
  // incrustar la página dentro del iframe de OTRO sitio, que no es este caso
  // (el usuario abre la URL directamente) — y rompe el mecanismo interno de
  // google.script.run, que depende de un iframe sandbox de googleusercontent.com
  // con un origen concreto para comunicarse de vuelta con script.google.com.
  // Con ALLOWALL puesto, el servidor ejecuta perfectamente (confirmado
  // probando apiPostGee/apiGetData directamente en el editor) pero el
  // navegador nunca recibe la respuesta — la consola muestra
  // "dropping postMessage.. was from host https://script.google.com but
  // expected host https://*.googleusercontent.com". Dejar el modo por
  // defecto (DEFAULT) es lo correcto para un Web App que se abre en su
  // propia pestaña.
  const template = HtmlService.createTemplateFromFile('Index');
  template.sheetId = sheetId;
  template.proyectoId = proyectoId;
  return template
    .evaluate()
    .setTitle('PM Copilot — ' + proyectoId)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Usado por los scriptlets <?!= include('Archivo') ?> en Index.html. */
function include(nombreArchivo) {
  return HtmlService.createHtmlOutputFromFile(nombreArchivo).getContent();
}

// ============================================================================
// Aprovisionamiento — crea todas las pestañas necesarias en una Sheet en
// blanco. Guiado manualmente por el PM (ver README.md, paso "Crear la Sheet
// de un cliente nuevo"): recibe el ID de la Sheet explícitamente (no usa
// SpreadsheetApp.getActive()) para poder ejecutarse desde el MISMO proyecto
// Apps Script ya desplegado como Web App, sin necesitar un segundo script
// atado a cada Sheet. Como el editor de Apps Script no deja pasar argumentos
// al pulsar "Ejecutar" directamente sobre una función, el README pide crear
// una función de una línea (bootstrapNuevoCliente, con el ID pegado) y
// ejecutar ESA. Idempotente: volver a ejecutarla sobre una Sheet ya
// inicializada no toca las pestañas/filas que ya existan, solo crea las que
// falten.
// ============================================================================

function bootstrapClientSheet(sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  Object.keys(TIPO_DESCRIPTORS_SHEETS).forEach(function (tipo) {
    const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
    let sheet = ss.getSheetByName(descriptor.hoja);
    if (!sheet) {
      sheet = ss.insertSheet(descriptor.hoja);
    }
    const columnas = columnasDeHoja_(descriptor);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, columnas.length).setValues([columnas]);
      sheet.setFrozenRows(1);
    }
  });
  // La hoja "Sheet1" por defecto de Google Sheets, si sigue vacía y sin usar,
  // se retira para no dejar una pestaña confusa sin propósito.
  const porDefecto = ss.getSheetByName('Sheet1') || ss.getSheetByName('Hoja 1');
  if (porDefecto && porDefecto.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(porDefecto);
  }
  return 'Listo — ' + Object.keys(TIPO_DESCRIPTORS_SHEETS).length + ' pestañas verificadas/creadas.';
}
