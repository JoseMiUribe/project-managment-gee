/**
 * Fase 3 — Migración local → nube.
 *
 * Sin credenciales nuevas ni scripts locales adicionales: el snapshot ya
 * existe en cualquier proyecto local (es exactamente lo que devuelve
 * `GET /api/data` del dashboard local, dashboard/lib/buildSnapshot.js). El
 * PM lo copia a mano y lo pega en esta página (`?vista=migrar`), servida por
 * el mismo Web App — así toda la escritura ocurre ya autenticada en el
 * navegador del PM, sin necesitar ninguna credencial de Sheets API en un
 * script local.
 *
 * Comportamiento por tipo, deliberadamente distinto:
 *   - "registro" (GEE + Requisitos, editables desde el dashboard): UPSERT por
 *     ID. Si el registro ya existe en la Sheet (porque alguien lo editó ahí
 *     después de una migración anterior), su fila se actualiza pero nunca se
 *     duplica ni se sobrescribe con un ID distinto — se preserva el mismo ID
 *     que tenía en local.
 *   - todo lo demás (Épicas, RoadmapClienteHitos, Sprints+HU, Documentos,
 *     ReglasNegocio, RoadmapClienteMeta, RoadmapTecnico, Legacy, Capacidad,
 *     Dailylogs): estos tipos son de solo lectura también en modo local (el
 *     dashboard nunca los edita) — cada migración REEMPLAZA por completo las
 *     filas de ese proyecto con lo último del snapshot pegado. Repetir la
 *     migración es seguro y esperado (p.ej. tras regenerar el roadmap).
 *
 * Es seguro ejecutar esta migración varias veces sobre el mismo proyecto.
 */

function migrarDesdeSnapshot(sheetId, proyectoId, snapshotJson) {
  try {
    const snapshot = JSON.parse(snapshotJson);
    const resumen = {};

    // --- 1) Tipos "registro": upsert por ID, preserva ediciones ya hechas en la nube ---
    const REGISTRO_FUENTES = {
      riesgos: snapshot.gee && snapshot.gee.riesgos,
      dependencias: snapshot.gee && snapshot.gee.dependencias,
      acciones: snapshot.gee && snapshot.gee.acciones,
      impedimentos: snapshot.gee && snapshot.gee.impedimentos,
      changelog: snapshot.gee && snapshot.gee.changelog,
      peticiones: snapshot.requisitos && snapshot.requisitos.paso0 && snapshot.requisitos.paso0.peticiones,
      funcionales: snapshot.requisitos && snapshot.requisitos.paso0 && snapshot.requisitos.paso0.funcionales,
      nofuncionales: snapshot.requisitos && snapshot.requisitos.paso0 && snapshot.requisitos.paso0.noFuncionales,
      zonas: snapshot.requisitos && snapshot.requisitos.paso0 && snapshot.requisitos.paso0.zonasIncertidumbre,
    };
    Object.keys(REGISTRO_FUENTES).forEach(function (tipo) {
      const items = REGISTRO_FUENTES[tipo] || [];
      let n = 0;
      items.forEach(function (item) {
        if (!item.id) return; // fila sin ID (no debería darse en local) -> se ignora
        migrarRegistro_(sheetId, proyectoId, tipo, item);
        n++;
      });
      resumen[tipo] = n;
    });

    // --- 2) Lectura tabular: reemplazo completo por proyecto ---
    const epicas = (snapshot.roadmap && snapshot.roadmap.epicas) || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'epicas', epicas.map(function (e) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.epicas.columnas, {
        Proyecto: proyectoId, ID: e.id, Nombre: e.nombre, Objetivo: e.objetivo, Requisitos: e.requisitos,
        Dependencias: e.dependencias, DecisionPendiente: e.decisionPendiente, RiesgosAsociados: e.riesgosAsociados,
        Prioridad: e.prioridad, Notas: e.notas, Fase: e.fase,
      });
    }));
    resumen.epicas = epicas.length;

    const hitos = (snapshot.roadmap && snapshot.roadmap.roadmapCliente && snapshot.roadmap.roadmapCliente.hitos) || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'roadmapClienteHitos', hitos.map(function (h) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.roadmapClienteHitos.columnas, {
        Proyecto: proyectoId, Numero: h.numero, Nombre: h.nombre, QueIncluye: h.queIncluye,
        VentanaEstimada: h.ventanaEstimada, Confianza: h.confianza, DependeDe: h.dependeDe,
      });
    }));
    resumen.roadmapClienteHitos = hitos.length;

    const reglas = (snapshot.requisitos && snapshot.requisitos.paso0 && snapshot.requisitos.paso0.reglasNegocio) || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'reglasNegocio', reglas.map(function (r) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.reglasNegocio.columnas, {
        Proyecto: proyectoId, ID: r.id, Regla: r.regla, AfectaA: r.afectaA,
      });
    }));
    resumen.reglasNegocio = reglas.length;

    // Documentos: upsert por Ruta (no reemplazo total) para no perder el
    // DriveFileId/DriveUrl que haya subido una migración de documentos
    // anterior (ver migrarDocumentos más abajo) — a diferencia del resto de
    // tipos "lectura tabular", aquí sí importa no perder ese dato al repetir
    // la migración de metadatos.
    const documentos = snapshot.documentos || [];
    documentos.forEach(function (d) { migrarDocumentoMetadata_(sheetId, proyectoId, d); });
    resumen.documentos = documentos.length;

    const sprints = (snapshot.sprint && snapshot.sprint.sprints) || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'sprints', sprints.map(function (s) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.sprints.columnas, {
        Proyecto: proyectoId, Numero: s.numero, Fechas: s.fechas, FechaInicio: s.fechaInicio, FechaFin: s.fechaFin,
        Objetivo: s.objetivo, CapacidadDisponible: s.capacidadDisponible, CapacidadOcupada: s.capacidadOcupada,
        RevisionCerrada: !s.activo, NuevosRiesgosJSON: JSON.stringify(s.nuevosRiesgos || []),
      });
    }));
    resumen.sprints = sprints.length;

    const husFilas = [];
    sprints.forEach(function (s) {
      (s.hu || []).forEach(function (h) {
        husFilas.push(construirFila_(TIPO_DESCRIPTORS_SHEETS.sprintHu.columnas, {
          Proyecto: proyectoId, SprintNumero: s.numero, HU: h.hu, Epica: h.epica, Titulo: h.titulo,
          Estado: h.estado, Tallas: h.tallas, SubtareasJSON: JSON.stringify(h.subtareas || []),
          Responsable: h.responsable || '',
        }));
      });
    });
    reemplazarFilasProyecto_(sheetId, proyectoId, 'sprintHu', husFilas);
    resumen.sprintHu = husFilas.length;

    const dailylogs = (snapshot.gee && snapshot.gee.dailylogs) || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'dailylogs', dailylogs.map(function (d) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.dailylogs.columnas, {
        Proyecto: proyectoId, Fecha: d.fecha, Sprint: d.sprint, Dia: d.dia, PuntosRestantes: d.puntosRestantes,
        ProgresoJSON: JSON.stringify(d.progreso || []), ActualizacionesGeeJSON: JSON.stringify(d.actualizacionesGee || []),
        NotasJSON: JSON.stringify(d.notas || []), 'Última modificación': new Date().toISOString(),
      });
    }));
    resumen.dailylogs = dailylogs.length;

    // --- 3) Lectura JSON-blob: reemplazo de una fila por proyecto ---
    if (snapshot.roadmap && snapshot.roadmap.roadmapCliente) {
      const rc = snapshot.roadmap.roadmapCliente;
      reemplazarFilasProyecto_(sheetId, proyectoId, 'roadmapClienteMeta', [construirFila_(TIPO_DESCRIPTORS_SHEETS.roadmapClienteMeta.columnas, {
        Proyecto: proyectoId, VersionPara: rc.versionPara, Fecha: rc.fecha, ProximaRevision: rc.proximaRevision,
        ConfianzaGlobal: rc.confianzaGlobal, ResumenEjecutivo: rc.resumenEjecutivo,
        PremisasJSON: JSON.stringify(rc.premisas || []), NivelesConfianzaJSON: JSON.stringify(rc.nivelesConfianza || []),
      })]);
      resumen.roadmapClienteMeta = 1;
    }

    if (snapshot.roadmap && snapshot.roadmap.roadmapTecnico) {
      reemplazarFilasProyecto_(sheetId, proyectoId, 'roadmapTecnico', [construirFila_(TIPO_DESCRIPTORS_SHEETS.roadmapTecnico.columnas, {
        Proyecto: proyectoId, DatosJSON: JSON.stringify(snapshot.roadmap.roadmapTecnico),
      })]);
      resumen.roadmapTecnico = 1;
    }

    if (snapshot.requisitos && snapshot.requisitos.legacy) {
      reemplazarFilasProyecto_(sheetId, proyectoId, 'legacy', [construirFila_(TIPO_DESCRIPTORS_SHEETS.legacy.columnas, {
        Proyecto: proyectoId, DatosJSON: JSON.stringify(snapshot.requisitos.legacy),
      })]);
      resumen.legacy = 1;
    }

    if (snapshot.roadmap && snapshot.roadmap.capacidadActual) {
      reemplazarFilasProyecto_(sheetId, proyectoId, 'capacidad', [construirFila_(TIPO_DESCRIPTORS_SHEETS.capacidad.columnas, {
        Proyecto: proyectoId, Version: 'actual', EsActual: true,
        FechaGeneracion: snapshot.roadmap.capacidadActual.fechaGeneracion || '',
        DatosJSON: JSON.stringify(snapshot.roadmap.capacidadActual),
      })]);
      resumen.capacidad = 1;
    }

    return ok_(resumen);
  } catch (err) {
    return fail_(500, 'Error migrando el snapshot: ' + err.message);
  }
}

/** Upsert por ID para tipos "registro" — a diferencia de escribirRegistro_
 *  (que autogenera un ID nuevo o lanza si el ID pasado no existe), aquí el ID
 *  viene ya fijado por el markdown local y debe conservarse tal cual: si no
 *  existe todavía en la Sheet, se crea CON ESE ID (no se autogenera uno). */
function migrarRegistro_(sheetId, proyectoId, tipo, item) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const columnas = columnasRegistro_(descriptor);
  const numCols = columnas.length;
  const colId = columnas.indexOf('ID');
  const colProyecto = columnas.indexOf('Proyecto');

  const lastRow = sheet.getLastRow();
  let targetRowNum = -1;
  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][colId]) === String(item.id) && String(values[i][colProyecto]) === String(proyectoId)) {
        targetRowNum = i + 2;
        break;
      }
    }
  }

  const valores = { ID: item.id, Proyecto: proyectoId };
  Object.keys(descriptor.campos).forEach(function (key) {
    valores[descriptor.campos[key]] = item[key] !== undefined ? item[key] : '';
  });
  valores['Última modificación'] = item.ultimaModificacion || new Date().toISOString();
  valores['Modificado por'] = item.modificadoPor || 'migracion';

  const fila = construirFila_(columnas, valores);
  if (targetRowNum === -1) {
    sheet.appendRow(fila);
  } else {
    sheet.getRange(targetRowNum, 1, 1, numCols).setValues([fila]);
  }
}

/** Borra todas las filas de `tipo` que pertenezcan a `proyectoId` y añade las
 *  `filasNuevas` (arrays ya en el orden de columnas del descriptor). Usado
 *  para los tipos de solo lectura, donde no hace falta upsert fila a fila —
 *  la migración siempre refleja el último snapshot pegado para ese proyecto,
 *  sin tocar las filas de otros proyectos que compartan esta misma Sheet. */
function reemplazarFilasProyecto_(sheetId, proyectoId, tipo, filasNuevas) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS[tipo];
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const columnas = columnasDeHoja_(descriptor);
  // Reescribe la cabecera al esquema vigente antes de tocar filas — cubre el
  // caso de una Sheet ya migrada antes de que se añadiera una columna nueva
  // al final (p. ej. Responsable en SprintHU): sin esto, la fila 1 se
  // quedaría con las etiquetas antiguas para siempre aunque los datos ya
  // trajeran la columna nueva (la lectura es posicional, no por nombre de
  // cabecera, así que esto es solo cosmético, pero evita una Sheet confusa).
  sheet.getRange(1, 1, 1, columnas.length).setValues([columnas]);
  const colProyecto = columnas.indexOf('Proyecto');
  const lastRow = sheet.getLastRow();

  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, columnas.length).getValues();
    for (let i = values.length - 1; i >= 0; i--) {
      if (String(values[i][colProyecto]) === String(proyectoId)) {
        sheet.deleteRow(i + 2);
      }
    }
  }
  filasNuevas.forEach(function (fila) { sheet.appendRow(fila); });
}

/** Construye una fila en el orden exacto de `columnas` a partir de un mapa
 *  {nombreColumna: valor} — columnas ausentes del mapa quedan en ''. */
function construirFila_(columnas, valoresPorColumna) {
  return columnas.map(function (col) {
    const v = valoresPorColumna[col];
    return v === undefined || v === null ? '' : v;
  });
}

/** Upsert por (Proyecto, Ruta) de los metadatos de un documento, preservando
 *  DriveFileId/DriveUrl de la fila existente si los hay (los rellena
 *  migrarDocumentos, no esta función) — así migrar el snapshot normal no
 *  pisa un enlace de Drive ya subido en una migración de documentos previa.
 *  No borra filas de documentos que ya no existan localmente (limitación
 *  conocida, ver README.md) — este skill nunca borra automáticamente. */
function migrarDocumentoMetadata_(sheetId, proyectoId, doc) {
  const descriptor = TIPO_DESCRIPTORS_SHEETS.documentos;
  const sheet = obtenerHoja_(sheetId, descriptor.hoja);
  const columnas = descriptor.columnas;
  const numCols = columnas.length;
  const colRuta = columnas.indexOf('Ruta');
  const colProyecto = columnas.indexOf('Proyecto');
  const colDriveFileId = columnas.indexOf('DriveFileId');
  const colDriveUrl = columnas.indexOf('DriveUrl');

  const lastRow = sheet.getLastRow();
  let targetRowNum = -1;
  let filaActual = null;
  if (lastRow >= 2) {
    const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    for (let i = 0; i < values.length; i++) {
      if (values[i][colRuta] === doc.ruta && String(values[i][colProyecto]) === String(proyectoId)) {
        targetRowNum = i + 2;
        filaActual = values[i];
        break;
      }
    }
  }

  const fila = construirFila_(columnas, {
    Proyecto: proyectoId, Ruta: doc.ruta, Titulo: doc.titulo, Descripcion: doc.descripcion,
    Paso: doc.paso, Tamano: doc.tamano, ModificadoEn: doc.modificadoEn,
    DriveFileId: filaActual ? filaActual[colDriveFileId] : '',
    DriveUrl: filaActual ? filaActual[colDriveUrl] : '',
  });

  if (targetRowNum === -1) {
    sheet.appendRow(fila);
  } else {
    sheet.getRange(targetRowNum, 1, 1, numCols).setValues([fila]);
  }
}

// ============================================================================
// Subida de documentos a Drive (contenido, no solo metadatos)
// ============================================================================

/** Carpeta "Documentos — <proyecto>" dentro de la misma carpeta de Drive que
 *  contiene la Sheet del cliente (así los documentos de cada proyecto quedan
 *  ordenados junto a su Sheet, no sueltos en la raíz de Drive). Idempotente:
 *  si ya existe, la reutiliza en vez de crear una duplicada. */
function obtenerCarpetaDocumentos_(sheetId, proyectoId) {
  const archivoSheet = DriveApp.getFileById(sheetId);
  const padres = archivoSheet.getParents();
  const carpetaBase = padres.hasNext() ? padres.next() : DriveApp.getRootFolder();
  const nombreCarpeta = 'Documentos — ' + proyectoId;
  const existentes = carpetaBase.getFoldersByName(nombreCarpeta);
  if (existentes.hasNext()) return existentes.next();
  return carpetaBase.createFolder(nombreCarpeta);
}

/** Ruta relativa ("output-paso-1/registro-riesgos.md") -> nombre de archivo
 *  plano válido en Drive (Drive no tiene carpetas reales dentro de un
 *  DriveApp.createFile, así que se aplana con " — " en vez de "/"). */
function nombreArchivoDrive_(rutaRelativa) {
  return String(rutaRelativa || 'documento.md').replace(/\//g, ' — ');
}

/**
 * Sube (o actualiza si ya existe) el CONTENIDO de cada documento a la carpeta
 * de Drive del proyecto, y guarda el ID/URL resultante en la pestaña
 * Documentos — a partir de ahí `renderDocumentoRow` en AppJs.html puede
 * enlazar directamente a Drive para ver/descargar.
 *
 * Fuente del JSON: GET /api/documentos/exportar del dashboard LOCAL (no
 * /api/data — ese solo trae metadatos, sin contenido). Idempotente: repetirlo
 * actualiza el contenido de los archivos ya subidos (por Ruta) en vez de
 * crear duplicados — así es como se "mantienen actualizados" tras
 * regenerar un documento en local.
 *
 * @param {string} sheetId
 * @param {string} proyectoId
 * @param {string} documentosJson JSON de { documentos: [{ruta,titulo,descripcion,paso,tamano,modificadoEn,contenido}] }
 */
function migrarDocumentos(sheetId, proyectoId, documentosJson) {
  try {
    const payload = JSON.parse(documentosJson);
    const documentos = payload.documentos || [];
    const carpeta = obtenerCarpetaDocumentos_(sheetId, proyectoId);

    const descriptor = TIPO_DESCRIPTORS_SHEETS.documentos;
    const sheet = obtenerHoja_(sheetId, descriptor.hoja);
    const columnas = descriptor.columnas;
    const numCols = columnas.length;
    const colRuta = columnas.indexOf('Ruta');
    const colProyecto = columnas.indexOf('Proyecto');
    const colDriveFileId = columnas.indexOf('DriveFileId');
    const colDriveUrl = columnas.indexOf('DriveUrl');

    let subidos = 0;
    let actualizados = 0;
    let sinContenido = 0;

    documentos.forEach(function (doc) {
      if (!doc.contenido) { sinContenido++; return; } // no se pudo leer en local -> se deja tal cual, no se sube vacío

      const lastRow = sheet.getLastRow();
      let targetRowNum = -1;
      let filaActual = null;
      if (lastRow >= 2) {
        const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
        for (let i = 0; i < values.length; i++) {
          if (values[i][colRuta] === doc.ruta && String(values[i][colProyecto]) === String(proyectoId)) {
            targetRowNum = i + 2;
            filaActual = values[i];
            break;
          }
        }
      }

      const driveFileIdExistente = filaActual ? filaActual[colDriveFileId] : '';
      let file;
      if (driveFileIdExistente) {
        file = DriveApp.getFileById(driveFileIdExistente);
        file.setContent(doc.contenido);
        actualizados++;
      } else {
        file = carpeta.createFile(nombreArchivoDrive_(doc.ruta), doc.contenido, MimeType.PLAIN_TEXT);
        subidos++;
      }

      const filaNueva = construirFila_(columnas, {
        Proyecto: proyectoId, Ruta: doc.ruta, Titulo: doc.titulo, Descripcion: doc.descripcion,
        Paso: doc.paso, Tamano: doc.tamano, ModificadoEn: doc.modificadoEn,
        DriveFileId: file.getId(), DriveUrl: file.getUrl(),
      });
      if (targetRowNum === -1) {
        sheet.appendRow(filaNueva);
      } else {
        sheet.getRange(targetRowNum, 1, 1, numCols).setValues([filaNueva]);
      }
    });

    return ok_({ subidos: subidos, actualizados: actualizados, sinContenido: sinContenido, carpeta: carpeta.getUrl() });
  } catch (err) {
    return fail_(500, 'Error subiendo documentos a Drive: ' + err.message);
  }
}

function escMigracion_(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Página servida en ?vista=migrar — pegar el JSON de /api/data del
 *  dashboard local y migrarlo a esta Sheet/proyecto. */
function renderMigratePage(sheetId, proyectoId) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Migrar a la nube — ${escMigracion_(proyectoId)}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 900px; margin: 24px auto; padding: 0 16px; color: #1a1a1a; }
  h1 { font-size: 20px; }
  textarea { width: 100%; height: 320px; font-family: monospace; font-size: 12px; box-sizing: border-box; }
  button { padding: 10px 18px; font-size: 14px; background: #1a5fb4; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  button:disabled { opacity: 0.6; cursor: default; }
  #resultado { margin-top: 16px; white-space: pre-wrap; font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 4px; }
  .aviso { background: #fff7ed; border: 1px solid #fdba74; border-radius: 4px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; }
</style>
</head>
<body>
  <h1>Migrar datos locales a esta Sheet — proyecto "${escMigracion_(proyectoId)}"</h1>

  <h2>1. Datos (GEE, Requisitos, Épicas, Roadmap, Capacidad, Sprints...)</h2>
  <div class="aviso">
    1) Abre el dashboard <strong>local</strong> de este proyecto y ve a <code>/api/data</code> en el navegador (con el dashboard local ya arrancado).<br>
    2) Copia TODO el JSON de esa página (Ctrl+A, Ctrl+C).<br>
    3) Pégalo aquí abajo y pulsa "Migrar datos".<br><br>
    Es seguro repetirlo: los registros del GEE/Requisitos se actualizan por ID (nunca se duplican, ni se pisan ediciones ya hechas en la nube). El resto de pestañas de solo lectura (Épicas, Roadmap, Capacidad, Sprints) se reemplazan enteras con lo último del snapshot pegado — son de solo lectura también en modo local, así que no hay nada que perder ahí. Los metadatos de Documentos se actualizan por ruta, sin perder ningún enlace de Drive ya subido en el paso 2.
  </div>
  <textarea id="snapshot" placeholder="Pega aquí el JSON de /api/data..."></textarea>
  <p><button id="btn-migrar">Migrar datos</button></p>
  <div id="resultado"></div>

  <h2>2. Documentos (subirlos a Drive para poder verlos/descargarlos)</h2>
  <div class="aviso">
    1) En el dashboard local, ve a <code>/api/documentos/exportar</code> (nota: <code>/exportar</code>, no <code>/api/data</code> — este incluye el CONTENIDO de cada documento, no solo el catálogo).<br>
    2) Copia TODO el JSON.<br>
    3) Pégalo aquí abajo y pulsa "Subir documentos a Drive".<br><br>
    Sube cada <code>.md</code> a una carpeta de Drive junto a esta Sheet ("Documentos — ${escMigracion_(proyectoId)}"), y guarda el enlace en la pestaña Documentos — la pestaña "Documentos" del dashboard mostrará un botón "Ver/Descargar" para cada uno. Es seguro repetirlo: actualiza el contenido de los archivos ya subidos (por ruta) en vez de duplicarlos — así se "mantienen actualizados" tras regenerar un documento en local.
  </div>
  <textarea id="documentos" placeholder="Pega aquí el JSON de /api/documentos/exportar..."></textarea>
  <p><button id="btn-migrar-documentos">Subir documentos a Drive</button></p>
  <div id="resultado-documentos"></div>

  <script>
    var MIGRAR_CONFIG = { sheetId: ${JSON.stringify(sheetId)}, proyectoId: ${JSON.stringify(proyectoId)} };

    function ejecutarMigracion(idBoton, textoBoton, idTextarea, idResultado, nombreFuncion) {
      var btn = document.getElementById(idBoton);
      btn.addEventListener('click', function () {
        var textarea = document.getElementById(idTextarea);
        var resultado = document.getElementById(idResultado);
        var texto = textarea.value.trim();
        if (!texto) { resultado.textContent = 'Pega primero el JSON.'; return; }
        btn.disabled = true;
        btn.textContent = 'Procesando…';
        resultado.textContent = '';
        google.script.run
          .withSuccessHandler(function (resultJson) {
            btn.disabled = false;
            btn.textContent = textoBoton;
            try {
              var result = JSON.parse(resultJson);
              if (result.ok === false) {
                resultado.textContent = 'Error: ' + result.error;
              } else {
                resultado.textContent = 'Completado:\\n' + JSON.stringify(result.data, null, 2);
              }
            } catch (e) {
              resultado.textContent = 'Respuesta inesperada del servidor: ' + resultJson;
            }
          })
          .withFailureHandler(function (err) {
            btn.disabled = false;
            btn.textContent = textoBoton;
            resultado.textContent = 'Error inesperado: ' + (err && err.message);
          })
          [nombreFuncion](MIGRAR_CONFIG.sheetId, MIGRAR_CONFIG.proyectoId, texto);
      });
    }

    ejecutarMigracion('btn-migrar', 'Migrar datos', 'snapshot', 'resultado', 'migrarDesdeSnapshot');
    ejecutarMigracion('btn-migrar-documentos', 'Subir documentos a Drive', 'documentos', 'resultado-documentos', 'migrarDocumentos');
  </script>
</body>
</html>`;
}
