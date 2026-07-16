/**
 * Tabla única de metadatos por pestaña de la Google Sheet de un cliente —
 * el equivalente en modo nube de dashboard/lib/dataBackend/tipoDescriptors.js
 * (modo local). Code.gs es un motor genérico que lee esta tabla para saber
 * qué pestañas crear (bootstrapClientSheet), cómo leerlas (leerSnapshot) y
 * cuáles admiten escritura desde el dashboard — igual que tipoDescriptors.js
 * evitó tener que mantener 9 writers casi idénticos, esta tabla evita tener
 * que escribir ~20 funciones de lectura/escritura casi idénticas para cada
 * pestaña de la Sheet.
 *
 * `kind` determina el tratamiento genérico en Code.gs:
 *
 *   - "registro": una fila por registro, editable desde el dashboard (los 9
 *     tipos GEE/Requisitos de siempre). Reutiliza los mismos nombres de
 *     columna que ya usa dashboard/lib/dataBackend/tipoDescriptors.js#fieldMap
 *     en modo local, por continuidad conceptual entre ambos modos.
 *   - "ledger": registro append-only interno (CambiosPendientes) — nunca se
 *     edita una fila existente, cada llamada añade una fila nueva.
 *   - "catalogo": metadatos de solo lectura poblados por la migración
 *     (Documentos) — el dashboard los muestra pero no los edita.
 *   - "lectura-tabular": una fila por registro, poblada por la migración,
 *     sin ninguna vía de escritura desde el dashboard (Épicas, hitos del
 *     roadmap cliente, sprints y sus HU) — son de solo lectura también en
 *     modo LOCAL (el dashboard nunca los edita, solo los muestra).
 *   - "lectura-json": una fila por proyecto (o varias si `versionado` es
 *     true) con el objeto ya parseado completo en una columna JSON, en vez
 *     de normalizar en columnas — pragmático para datos heterogéneos y
 *     anidados (roadmap técnico, capacidad, legacy, metadatos del roadmap
 *     cliente) que hoy nadie edita fila a fila ni en local ni en la Sheet.
 *   - "dailylog": caso especial de "lectura-tabular" con tres columnas JSON
 *     (progreso/actualizacionesGee/notas) donde SOLO se admite añadir una
 *     nota nueva a `notas` desde el dashboard (mismo alcance que
 *     appendDailylogNota en modo local) — el resto de columnas las puebla
 *     la migración/el skill, nunca el dashboard.
 *
 * Todas las pestañas (salvo "lectura-json" con `versionado`) llevan una
 * columna `Proyecto` porque una misma Google Sheet aloja varios engagements
 * del mismo cliente (aislamiento por CLIENTE, no por proyecto — ver README).
 */

function camposComoColumnas_(campos) {
  return Object.keys(campos).map(function (k) { return campos[k]; });
}

const TIPO_DESCRIPTORS_SHEETS = {
  // --- Registro editable (GEE + Requisitos) — mismos campos que modo local ---
  riesgos: {
    kind: 'registro', hoja: 'Riesgos', idPrefix: 'R',
    campos: {
      fechaAlta: 'Fecha alta', riesgo: 'Riesgo', consecuencia: 'Consecuencia', tipo: 'Tipo',
      probabilidad: 'Probabilidad', impacto: 'Impacto', ambito: 'Ámbito', respuesta: 'Respuesta',
      estado: 'Estado', coste: 'Coste', alcance: 'Alcance', plazo: 'Plazo', calidad: 'Calidad',
      mitigacion: 'Mitigación', responsable: 'Responsable', peso: 'Peso', rag: 'RAG',
      consideraciones: 'Consideraciones', relacionadoCon: 'Relacionado con', fechaUpdate: 'Fecha update',
      visibilidad: 'Visibilidad', motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  dependencias: {
    kind: 'registro', hoja: 'Dependencias', idPrefix: 'DP',
    campos: {
      equipo: 'Equipo', dependencia: 'Dependencia', criticidadRag: 'Criticidad RAG', estado: 'Estado',
      fechaCompromiso: 'Fecha compromiso', riesgosAsociados: 'Riesgos asociados',
      tareaGestionJira: 'Tarea de gestión (Jira)', comentarios: 'Comentarios',
      visibilidad: 'Visibilidad', motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  acciones: {
    kind: 'registro', hoja: 'Acciones', idPrefix: 'A',
    campos: {
      accion: 'Acción', tipo: 'Tipo', riesgoAsociado: 'Riesgo asociado', dependenciaAsociada: 'Dependencia asociada',
      responsable: 'Responsable', deadline: 'Deadline', estado: 'Estado',
      visibilidad: 'Visibilidad', motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  impedimentos: {
    kind: 'registro', hoja: 'Impedimentos', idPrefix: 'IM',
    campos: {
      impedimento: 'Impedimento', criticidad: 'Criticidad', fechaInicio: 'Fecha inicio', fechaFin: 'Fecha fin',
      responsable: 'Responsable', riesgoOrigen: 'Riesgo origen', dependenciaOrigen: 'Dependencia origen',
      visibilidad: 'Visibilidad', motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  changelog: {
    kind: 'registro', hoja: 'Changelog', idPrefix: 'SC',
    campos: {
      titulo: 'Título', descripcion: 'Descripción', impacto: 'Impacto', coste: 'Coste', alcance: 'Alcance',
      plazo: 'Plazo', calidad: 'Calidad', decision: 'Decisión', comentarios: 'Comentarios',
      riesgosGenerados: 'Riesgos generados', dependenciasGeneradas: 'Dependencias generadas',
      accionesGeneradas: 'Acciones generadas', visibilidad: 'Visibilidad', motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  peticiones: {
    kind: 'registro', hoja: 'Peticiones', idPrefix: 'PC',
    campos: { peticion: 'Petición', loDijoElCliente: 'Lo dijo el cliente', prioridadSubjetiva: 'Prioridad subjetiva' },
  },
  funcionales: {
    kind: 'registro', hoja: 'RequisitosFuncionales', idPrefix: 'RF',
    campos: {
      modulo: 'Módulo/Área', descripcion: 'Descripción', actor: 'Actor/Rol', prioridad: 'Prioridad (MoSCoW)',
      origen: 'Origen', dependencias: 'Dependencias',
    },
  },
  nofuncionales: {
    kind: 'registro', hoja: 'RequisitosNoFuncionales', idPrefix: 'RNF',
    campos: { descripcion: 'Descripción', categoria: 'Categoría', origen: 'Origen', prioridad: 'Prioridad (MoSCoW)' },
  },
  zonas: {
    kind: 'registro', hoja: 'ZonasIncertidumbre', idPrefix: 'ZI',
    campos: {
      zona: 'Zona', descripcion: 'Descripción', porQueEsIncierto: 'Por qué es incierto', afecta: 'Afecta a',
      pregunta: 'Pregunta para resolverlo', recomendacionPorDefecto: 'Recomendación por defecto (80/20)',
    },
  },

  // --- Ledger interno (append-only, nunca se edita una fila existente) ---
  cambiosPendientes: {
    kind: 'ledger', hoja: 'CambiosPendientes', idPrefix: 'CD',
    columnas: ['ID', 'Proyecto', 'Fecha/Hora', 'Artefacto', 'Registro', 'Campos modificados', 'Procesado'],
  },

  // --- Catálogo de metadatos (poblado por migración, sin escritura desde el dashboard) ---
  documentos: {
    kind: 'catalogo', hoja: 'Documentos',
    columnas: ['Proyecto', 'Ruta', 'Titulo', 'Descripcion', 'Paso', 'Tamano', 'ModificadoEn'],
  },

  // --- Lectura tabular (poblado por migración, sin escritura desde el dashboard) ---
  epicas: {
    kind: 'lectura-tabular', hoja: 'Epicas',
    columnas: ['Proyecto', 'ID', 'Nombre', 'Objetivo', 'Requisitos', 'Dependencias', 'DecisionPendiente', 'RiesgosAsociados', 'Prioridad', 'Notas', 'Fase'],
  },
  roadmapClienteHitos: {
    kind: 'lectura-tabular', hoja: 'RoadmapClienteHitos',
    columnas: ['Proyecto', 'Numero', 'Nombre', 'QueIncluye', 'VentanaEstimada', 'Confianza', 'DependeDe'],
  },
  sprints: {
    kind: 'lectura-tabular', hoja: 'Sprints',
    columnas: ['Proyecto', 'Numero', 'Fechas', 'FechaInicio', 'FechaFin', 'Objetivo', 'CapacidadDisponible', 'CapacidadOcupada', 'RevisionCerrada', 'NuevosRiesgosJSON'],
  },
  sprintHu: {
    kind: 'lectura-tabular', hoja: 'SprintHU',
    columnas: ['Proyecto', 'SprintNumero', 'HU', 'Epica', 'Titulo', 'Estado', 'Tallas', 'SubtareasJSON'],
  },
  reglasNegocio: {
    // Sub-tabla opcional dentro de requisitos-funcionales.md en modo local
    // (parsers/requisitos.js#parseFuncionales) — no forma parte del tipo
    // "registro" funcionales (fieldMap no la incluye), así que necesita su
    // propia pestaña de solo lectura en vez de vivir dentro de RequisitosFuncionales.
    kind: 'lectura-tabular', hoja: 'ReglasNegocio',
    columnas: ['Proyecto', 'ID', 'Regla', 'AfectaA'],
  },

  // --- Lectura JSON-blob (datos heterogéneos/anidados, sin edición fila a fila ni en local) ---
  roadmapClienteMeta: {
    kind: 'lectura-json', hoja: 'RoadmapClienteMeta',
    columnas: ['Proyecto', 'VersionPara', 'Fecha', 'ProximaRevision', 'ConfianzaGlobal', 'ResumenEjecutivo', 'PremisasJSON', 'NivelesConfianzaJSON'],
  },
  roadmapTecnico: {
    kind: 'lectura-json', hoja: 'RoadmapTecnico',
    columnas: ['Proyecto', 'DatosJSON'],
  },
  legacy: {
    kind: 'lectura-json', hoja: 'Legacy',
    columnas: ['Proyecto', 'DatosJSON'],
  },
  capacidad: {
    kind: 'lectura-json', hoja: 'Capacidad', versionado: true,
    columnas: ['Proyecto', 'Version', 'EsActual', 'FechaGeneracion', 'DatosJSON'],
  },

  // --- Dailylogs: tabular con 3 columnas JSON; solo "notas" es escribible desde el dashboard ---
  dailylogs: {
    kind: 'dailylog', hoja: 'Dailylogs',
    columnas: ['Proyecto', 'Fecha', 'Sprint', 'Dia', 'PuntosRestantes', 'ProgresoJSON', 'ActualizacionesGeeJSON', 'NotasJSON', 'Última modificación'],
  },
};

/** Devuelve el orden completo de columnas de un descriptor "registro":
 *  ID, Proyecto, ...campos semánticos (en el orden declarado), auditoría. */
function columnasRegistro_(descriptor) {
  return ['ID', 'Proyecto'].concat(camposComoColumnas_(descriptor.campos), ['Última modificación', 'Modificado por']);
}

/** Orden de columnas real de la pestaña de un descriptor, sea cual sea su kind. */
function columnasDeHoja_(descriptor) {
  if (descriptor.kind === 'registro') return columnasRegistro_(descriptor);
  return descriptor.columnas;
}
