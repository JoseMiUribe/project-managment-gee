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

    const documentos = snapshot.documentos || [];
    reemplazarFilasProyecto_(sheetId, proyectoId, 'documentos', documentos.map(function (d) {
      return construirFila_(TIPO_DESCRIPTORS_SHEETS.documentos.columnas, {
        Proyecto: proyectoId, Ruta: d.ruta, Titulo: d.titulo, Descripcion: d.descripcion,
        Paso: d.paso, Tamano: d.tamano, ModificadoEn: d.modificadoEn,
      });
    }));
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
  <div class="aviso">
    1) Abre el dashboard <strong>local</strong> de este proyecto y ve a <code>/api/data</code> en el navegador (con el dashboard local ya arrancado).<br>
    2) Copia TODO el JSON de esa página (Ctrl+A, Ctrl+C).<br>
    3) Pégalo aquí abajo y pulsa "Migrar".<br><br>
    Es seguro repetirlo: los registros del GEE/Requisitos se actualizan por ID (nunca se duplican, ni se pisan ediciones ya hechas en la nube). El resto de pestañas de solo lectura (Épicas, Roadmap, Capacidad, Sprints, Documentos) se reemplazan enteras con lo último del snapshot pegado — son de solo lectura también en modo local, así que no hay nada que perder ahí.
  </div>
  <textarea id="snapshot" placeholder="Pega aquí el JSON de /api/data..."></textarea>
  <p><button id="btn-migrar">Migrar</button></p>
  <div id="resultado"></div>
  <script>
    var MIGRAR_CONFIG = { sheetId: ${JSON.stringify(sheetId)}, proyectoId: ${JSON.stringify(proyectoId)} };
    document.getElementById('btn-migrar').addEventListener('click', function () {
      var btn = this;
      var textarea = document.getElementById('snapshot');
      var resultado = document.getElementById('resultado');
      var texto = textarea.value.trim();
      if (!texto) { resultado.textContent = 'Pega primero el JSON del snapshot.'; return; }
      btn.disabled = true;
      btn.textContent = 'Migrando…';
      resultado.textContent = '';
      google.script.run
        .withSuccessHandler(function (resultJson) {
          btn.disabled = false;
          btn.textContent = 'Migrar';
          try {
            var result = JSON.parse(resultJson);
            if (result.ok === false) {
              resultado.textContent = 'Error: ' + result.error;
            } else {
              resultado.textContent = 'Migración completada:\\n' + JSON.stringify(result.data, null, 2);
            }
          } catch (e) {
            resultado.textContent = 'Respuesta inesperada del servidor: ' + resultJson;
          }
        })
        .withFailureHandler(function (err) {
          btn.disabled = false;
          btn.textContent = 'Migrar';
          resultado.textContent = 'Error inesperado: ' + (err && err.message);
        })
        .migrarDesdeSnapshot(MIGRAR_CONFIG.sheetId, MIGRAR_CONFIG.proyectoId, texto);
    });
  </script>
</body>
</html>`;
}
