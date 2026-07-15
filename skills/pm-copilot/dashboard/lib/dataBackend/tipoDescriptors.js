'use strict';

/**
 * Tabla única de metadatos por tipo de registro del GEE/Requisitos —
 * antes duplicada en cada `dashboard/lib/writers/*.js` (una `FIELD_MAP` +
 * `REL_PATH` + `idPrefix` por archivo). Centralizarla aquí es lo que permite
 * que tanto el backend local (`local.js`, Markdown) como el futuro backend
 * cloud (`cloud.js`, Firestore) compartan la misma noción de "qué tipos
 * existen y qué campos tiene cada uno" sin repetir la tabla dos veces.
 *
 * `headingCandidates`/`idPrefix`/`plantillaSiNoExiste` son específicos del
 * formato Markdown (los usa `tableWriter.js::upsertRow`) — el backend cloud
 * los ignora, pero conservarlos aquí en vez de en `local.js` evita tener que
 * mantener dos tablas sincronizadas.
 */
const TIPO_DESCRIPTORS = {
  riesgos: {
    relPath: 'output-paso-1/registro-riesgos.md',
    headingCandidates: ['riesgos'],
    idPrefix: 'R',
    fieldMap: {
      fechaAlta: 'Fecha alta',
      riesgo: 'Riesgo',
      consecuencia: 'Consecuencia',
      tipo: 'Tipo',
      probabilidad: 'Probabilidad',
      impacto: 'Impacto',
      ambito: 'Ámbito',
      respuesta: 'Respuesta',
      estado: 'Estado',
      coste: 'Coste',
      alcance: 'Alcance',
      plazo: 'Plazo',
      calidad: 'Calidad',
      mitigacion: 'Mitigación',
      responsable: 'Responsable',
      peso: 'Peso',
      rag: 'RAG',
      consideraciones: 'Consideraciones',
      relacionadoCon: 'Relacionado con',
      fechaUpdate: 'Fecha update',
      visibilidad: 'Visibilidad',
      motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  dependencias: {
    relPath: 'output-paso-1/registro-dependencias.md',
    headingCandidates: ['dependencias'],
    idPrefix: 'DP',
    fieldMap: {
      equipo: 'Equipo',
      dependencia: 'Dependencia',
      criticidadRag: 'Criticidad RAG',
      estado: 'Estado',
      fechaCompromiso: 'Fecha compromiso',
      riesgosAsociados: 'Riesgos asociados',
      tareaGestionJira: 'Tarea de gestión (Jira)',
      comentarios: 'Comentarios',
      visibilidad: 'Visibilidad',
      motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  acciones: {
    relPath: 'output-paso-1/registro-acciones.md',
    headingCandidates: ['acciones'],
    idPrefix: 'A',
    fieldMap: {
      accion: 'Acción',
      tipo: 'Tipo',
      riesgoAsociado: 'Riesgo asociado',
      dependenciaAsociada: 'Dependencia asociada',
      responsable: 'Responsable',
      deadline: 'Deadline',
      estado: 'Estado',
      visibilidad: 'Visibilidad',
      motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  impedimentos: {
    relPath: 'output-paso-1/registro-impedimentos.md',
    headingCandidates: ['impedimentos'],
    idPrefix: 'IM',
    fieldMap: {
      impedimento: 'Impedimento',
      criticidad: 'Criticidad',
      fechaInicio: 'Fecha inicio',
      fechaFin: 'Fecha fin',
      responsable: 'Responsable',
      riesgoOrigen: 'Riesgo origen',
      dependenciaOrigen: 'Dependencia origen',
      visibilidad: 'Visibilidad',
      motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  changelog: {
    relPath: 'output-paso-1/changelog.md',
    headingCandidates: ['cambios de alcance', 'changelog'],
    idPrefix: 'SC',
    fieldMap: {
      titulo: 'Título',
      descripcion: 'Descripción',
      impacto: 'Impacto',
      coste: 'Coste',
      alcance: 'Alcance',
      plazo: 'Plazo',
      calidad: 'Calidad',
      decision: 'Decisión',
      comentarios: 'Comentarios',
      riesgosGenerados: 'Riesgos generados',
      dependenciasGeneradas: 'Dependencias generadas',
      accionesGeneradas: 'Acciones generadas',
      visibilidad: 'Visibilidad',
      motivoDescarte: 'Motivo (descarte/eliminación)',
    },
  },
  peticiones: {
    relPath: 'output-paso-0/peticiones-cliente.md',
    headingCandidates: ['peticiones del cliente', 'peticiones'],
    idPrefix: 'PC',
    fieldMap: {
      peticion: 'Petición',
      loDijoElCliente: 'Lo dijo el cliente',
      prioridadSubjetiva: 'Prioridad subjetiva',
    },
    plantillaSiNoExiste: () =>
      [
        '# Peticiones del Cliente (en bruto)',
        '',
        '**Fecha última actualización:** —',
        '',
        '## Peticiones del cliente',
        '',
        '| ID | Petición | Lo dijo el cliente | Prioridad subjetiva | Última modificación | Modificado por |',
        '|---|---|---|---|---|---|',
        '',
        '## Notas adicionales',
        '',
      ].join('\n'),
  },
  funcionales: {
    relPath: 'output-paso-0/requisitos-funcionales.md',
    headingCandidates: ['requisitos funcionales'],
    idPrefix: 'RF',
    fieldMap: {
      modulo: 'Módulo/Área',
      descripcion: 'Descripción',
      actor: 'Actor/Rol',
      prioridad: 'Prioridad (MoSCoW)',
      origen: 'Origen',
      dependencias: 'Dependencias',
    },
    plantillaSiNoExiste: () =>
      [
        '# Requisitos Funcionales',
        '',
        '**Fecha última actualización:** —',
        '**Basado en:** peticiones-cliente.md',
        '',
        '## Requisitos funcionales',
        '',
        '| ID | Módulo/Área | Descripción | Actor/Rol | Prioridad (MoSCoW) | Origen | Dependencias | Última modificación | Modificado por |',
        '|---|---|---|---|---|---|---|---|---|',
        '',
      ].join('\n'),
  },
  nofuncionales: {
    relPath: 'output-paso-0/requisitos-nofuncionales.md',
    headingCandidates: ['requisitos no funcionales'],
    idPrefix: 'RNF',
    fieldMap: {
      descripcion: 'Descripción',
      categoria: 'Categoría',
      origen: 'Origen',
      prioridad: 'Prioridad (MoSCoW)',
    },
    plantillaSiNoExiste: () =>
      [
        '# Requisitos No Funcionales',
        '',
        '**Fecha última actualización:** —',
        '**Basado en:** requisitos-funcionales.md + peticiones-cliente.md + inferencia de RNF implícitos',
        '',
        '## Requisitos no funcionales',
        '',
        '| ID | Descripción | Categoría | Origen | Prioridad (MoSCoW) | Última modificación | Modificado por |',
        '|---|---|---|---|---|---|---|',
        '',
      ].join('\n'),
  },
  zonas: {
    relPath: 'output-paso-0/zonas-incertidumbre.md',
    headingCandidates: ['zonas identificadas', 'zonas de incertidumbre'],
    idPrefix: 'ZI',
    fieldMap: {
      zona: 'Zona',
      descripcion: 'Descripción',
      porQueEsIncierto: 'Por qué es incierto',
      afecta: 'Afecta a',
      pregunta: 'Pregunta para resolverlo',
      recomendacionPorDefecto: 'Recomendación por defecto (80/20)',
    },
    plantillaSiNoExiste: () =>
      [
        '# Zonas de Incertidumbre',
        '',
        '**Fecha última actualización:** —',
        '**Propósito:** Identificar lo que el cliente no sabe, no ha detallado o ha dejado ambiguo, y las asunciones que la IA tuvo que tomar.',
        '',
        '## Zonas identificadas',
        '',
        '| ID | Zona | Descripción | Por qué es incierto | Afecta a | Pregunta para resolverlo | Recomendación por defecto (80/20) | Última modificación | Modificado por |',
        '|---|---|---|---|---|---|---|---|---|',
        '',
      ].join('\n'),
  },
};

module.exports = { TIPO_DESCRIPTORS };
