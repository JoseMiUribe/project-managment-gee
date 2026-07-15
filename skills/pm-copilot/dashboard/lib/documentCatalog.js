'use strict';

const path = require('path');

/**
 * Catálogo estático de los artefactos markdown que el skill puede generar en
 * un proyecto, por paso. Sirve para dar una explicación legible a cada
 * documento en la pestaña "Documentos" del dashboard y para agruparlo por
 * paso. Un archivo que no matchee ningún patrón de aquí se sigue listando
 * (nunca se oculta) — solo que sin descripción curada, ver `pasoPorCarpeta`.
 */
const CATALOGO = [
  // ---------- Paso Legacy ----------
  { pattern: /^output-paso-legacy\/inventario-fuentes\.md$/, paso: 'Legacy', titulo: 'Inventario de fuentes', descripcion: 'Tabla de todas las fuentes documentales aportadas, con tipo, fecha, autor y fiabilidad.' },
  { pattern: /^output-paso-legacy\/mapa-proyecto\.md$/, paso: 'Legacy', titulo: 'Mapa del proyecto (v1)', descripcion: 'Clasifica cada aspecto del proyecto legacy en Claro/Contradictorio/Ambiguo/Inexistente, con recomendación.' },
  { pattern: /^output-paso-legacy\/mapa-proyecto-v2\.md$/, paso: 'Legacy', titulo: 'Mapa del proyecto (v2)', descripcion: 'Versión actualizada del mapa del proyecto tras incorporar las respuestas de la entrevista al cliente.' },
  { pattern: /^output-paso-legacy\/cuestionarios\.md$/, paso: 'Legacy', titulo: 'Cuestionarios de entrevista', descripcion: 'Cuestionarios de negocio y técnico preparados para la entrevista al cliente.' },
  { pattern: /^output-paso-legacy\/documentacion-proyecto\.md$/, paso: 'Legacy', titulo: 'Documentación consolidada del legacy', descripcion: 'Visión, arquitectura, glosario, estado por componente y decisiones (ADRs) del proyecto legacy.' },
  { pattern: /^output-paso-legacy\/guia-(para-)?paso-0\.md$/, paso: 'Legacy', titulo: 'Guía para el Paso 0', descripcion: 'Guía priorizada de qué del legacy hay que resolver antes de capturar requisitos.' },

  // ---------- Paso 0 ----------
  { pattern: /^output-paso-0\/(cuestionario-combinado|guia-estandar-paso-0)\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Guía de entrevista al cliente', descripcion: 'Guía de entrevista adaptada al proyecto para capturar requisitos.' },
  { pattern: /^output-paso-0\/peticiones-cliente\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Peticiones del cliente (en bruto)', descripcion: 'Listado sin clasificar de cada petición, queja o comentario tal como lo dijo el cliente.' },
  { pattern: /^output-paso-0\/requisitos-funcionales\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Requisitos funcionales', descripcion: 'RF con módulo, actor, prioridad MoSCoW, origen y dependencias.' },
  { pattern: /^output-paso-0\/requisitos-nofuncionales\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Requisitos no funcionales', descripcion: 'RNF, incluidos los implícitos inferidos por la IA.' },
  { pattern: /^output-paso-0\/zonas-incertidumbre\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Zonas de incertidumbre', descripcion: 'Ambigüedades, contradicciones y asunciones de la IA, con pregunta para el cliente.' },
  { pattern: /^documento-cierre-fase0\.md$/, paso: 'Requisitos (Paso 0)', titulo: 'Documento de cierre de Fase 0', descripcion: 'Documento para que el cliente firme: alcance, RNF relevantes, fuera de alcance y asunciones.' },

  // ---------- Paso 1: GEE ----------
  { pattern: /^output-paso-1\/check-init\.md$/, paso: 'GEE (Paso 1)', titulo: 'Check-init', descripcion: 'Checklist de salud de arranque del proyecto, con semáforo y riesgos/acciones derivados.' },
  { pattern: /^output-paso-1\/info-riesgos\.md$/, paso: 'GEE (Paso 1)', titulo: 'Catálogo de riesgos comunes', descripcion: 'Catálogo reutilizable de riesgos habituales de consultoría aplicados a este proyecto.' },
  { pattern: /^output-paso-1\/registro-riesgos\.md$/, paso: 'GEE (Paso 1)', titulo: 'Registro de riesgos', descripcion: 'Riesgos formales del proyecto con probabilidad, impacto, RAG y mitigación.' },
  { pattern: /^output-paso-1\/riesgos-stakeholders\.md$/, paso: 'GEE (Paso 1)', titulo: 'Riesgos para stakeholders', descripcion: 'Versión en lenguaje llano de los riesgos, sin pesos ni jerga interna.' },
  { pattern: /^output-paso-1\/registro-dependencias\.md$/, paso: 'GEE (Paso 1)', titulo: 'Registro de dependencias', descripcion: 'Dependencias externas del proyecto con criticidad RAG y tarea de gestión en Jira.' },
  { pattern: /^output-paso-1\/registro-acciones\.md$/, paso: 'GEE (Paso 1)', titulo: 'Registro de acciones', descripcion: 'Acciones preventivas/correctivas vinculadas a riesgos o dependencias.' },
  { pattern: /^output-paso-1\/registro-impedimentos\.md$/, paso: 'GEE (Paso 1)', titulo: 'Registro de impedimentos', descripcion: 'Impedimentos de trabajo detectados durante la ejecución de sprints.' },
  { pattern: /^output-paso-1\/changelog\.md$/, paso: 'GEE (Paso 1)', titulo: 'Changelog (cambios de alcance)', descripcion: 'Cambios de alcance con impacto y decisión (Aceptado/Rechazado/Aplazado).' },

  // ---------- Paso 2: Roadmap + Capacidad ----------
  { pattern: /^output-paso-2\/epicas\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Épicas', descripcion: 'Épicas agrupando requisitos funcionales por valor de negocio, con prioridad y fase.' },
  { pattern: /^output-paso-2\/config\/dor-definition\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Definition of Ready', descripcion: 'Definición de "listo para entrar en sprint" acordada con el equipo.' },
  { pattern: /^output-paso-2\/config\/dod-definition\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Definition of Done', descripcion: 'Definición de "terminado" acordada con el equipo.' },
  { pattern: /^output-paso-2\/capacidad-equipo\/v\d+\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Capacidad del equipo (versión histórica)', descripcion: 'Versión inmutable del cálculo de capacidad del equipo. Nunca se sobrescribe.' },
  { pattern: /^output-paso-2\/capacidad-equipo\/actual\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Capacidad del equipo (actual)', descripcion: 'Puntero a la última versión de capacidad vigente.' },
  { pattern: /^output-paso-2\/roadmap-tecnico\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Roadmap técnico', descripcion: 'Roadmap detallado por sprints para equipo/PM.' },
  { pattern: /^output-paso-2\/roadmap-cliente\.md$/, paso: 'Roadmap (Paso 2)', titulo: 'Roadmap cliente', descripcion: 'Roadmap agregado en meses/trimestres para stakeholders no técnicos.' },

  // ---------- Paso 3: HU ----------
  { pattern: /^output-paso-3\/historias-generadas-.*\.md$/, paso: 'Historias (Paso 3)', titulo: 'Historias de usuario generadas', descripcion: 'HU con distinto nivel de detalle según su franja temporal.' },
  { pattern: /^output-paso-3\/sprints-propuestos\.md$/, paso: 'Historias (Paso 3)', titulo: 'Sprints propuestos', descripcion: 'Propuesta de sprints con fechas y Sprint Goal.' },

  // ---------- Paso 4: Sprints ----------
  { pattern: /^output-paso-4\/sprint-candidates\.md$/, paso: 'Sprints (Paso 4)', titulo: 'Candidatas a sprint', descripcion: 'Evaluación de cada HU candidata contra el DoR, con veredicto Ready/Pendiente/No Ready.' },
  { pattern: /^output-paso-4\/sprint-backlog(-\d+)?\.md$/, paso: 'Sprints (Paso 4)', titulo: 'Backlog del sprint', descripcion: 'HU seleccionadas para el sprint con subtareas técnicas y capacidad.' },
  { pattern: /^output-paso-4\/dailylog\/.*\.md$/, paso: 'Sprints (Paso 4)', titulo: 'Daily log', descripcion: 'Registro diario de progreso del sprint.' },
  { pattern: /^output-paso-4\/analisis-jira-.*\.md$/, paso: 'Sprints (Paso 4)', titulo: 'Análisis de Jira', descripcion: 'Lectura del estado del sprint en Jira: bloqueos, velocidad real.' },
  { pattern: /^output-paso-4\/review-sprint-\d+\.md$/, paso: 'Sprints (Paso 4)', titulo: 'Review del sprint', descripcion: 'Cierre del sprint: planificado vs. entregado.' },

  // ---------- Paso 5: Review y Retro ----------
  { pattern: /^output-paso-5\/review-sprint-\d+\.md$/, paso: 'Review y Retro (Paso 5)', titulo: 'Review del sprint', descripcion: 'Preparación de la sprint review con demo points.' },
  { pattern: /^output-paso-5\/lecciones-sprint-\d+\.md$/, paso: 'Review y Retro (Paso 5)', titulo: 'Retrospectiva del sprint', descripcion: 'Aciertos, mejoras y acciones para el siguiente sprint.' },

  // ---------- Transversal / raíz ----------
  { pattern: /^00-documento-original\.md$/, paso: 'Transversal', titulo: 'Documento original del cliente', descripcion: 'Documentación original aportada por el cliente, tal cual, al arrancar el proyecto.' },
  { pattern: /^documentacion-proyecto\.md$/, paso: 'Transversal', titulo: 'Documentación del proyecto', descripcion: 'Documento vivo del proyecto, actualizado en cada paso.' },
  { pattern: /^inventario-documentos-proyecto\.md$/, paso: 'Transversal', titulo: 'Inventario de documentos del proyecto', descripcion: 'Registro de documentación aparecida durante el proyecto, con análisis de impacto.' },
  { pattern: /^config\/jira-project\.md$/, paso: 'Transversal', titulo: 'Configuración de proyecto Jira', descripcion: 'URL/clave del proyecto Jira del cliente y mapeo de campos.' },
  { pattern: /^config\/jira-mapeo\.md$/, paso: 'Transversal', titulo: 'Mapeo con Jira', descripcion: 'Trazabilidad entre épicas/HU del skill y claves de issue de Jira.' },
  { pattern: /^config\/historial-prioridad-backlog\.md$/, paso: 'Transversal', titulo: 'Historial de prioridad del backlog', descripcion: 'Prioridad propuesta por el skill frente a la real observada.' },
  { pattern: /^config\/fuentes-contexto\/.*\.md$/, paso: 'Transversal', titulo: 'Fuente de contexto opcional', descripcion: 'Configuración de una fuente de contexto opcional para fundamentar HU/épicas.' },
  { pattern: /^output-transversal\/cambios-pendientes-dashboard\.md$/, paso: 'Transversal', titulo: 'Cambios pendientes del dashboard', descripcion: 'Ediciones hechas desde el dashboard, con estado de si ya se incorporaron a la cascada de actualización.' },
];

function pasoPorCarpeta(rutaNormalizada) {
  const m = rutaNormalizada.match(/^output-paso-(legacy|0|1|2|3|4|5)\//);
  if (!m) return 'Otros';
  const map = {
    legacy: 'Legacy',
    '0': 'Requisitos (Paso 0)',
    '1': 'GEE (Paso 1)',
    '2': 'Roadmap (Paso 2)',
    '3': 'Historias (Paso 3)',
    '4': 'Sprints (Paso 4)',
    '5': 'Review y Retro (Paso 5)',
  };
  return map[m[1]] || 'Otros';
}

/**
 * @param {string} rutaRelativa ruta relativa al proyecto, con "/" como separador
 * @returns {{ paso: string, titulo: string, descripcion: string }}
 */
function catalogar(rutaRelativa) {
  const encontrado = CATALOGO.find((e) => e.pattern.test(rutaRelativa));
  if (encontrado) return { paso: encontrado.paso, titulo: encontrado.titulo, descripcion: encontrado.descripcion };
  return {
    paso: pasoPorCarpeta(rutaRelativa),
    titulo: path.basename(rutaRelativa, '.md'),
    descripcion: 'Documento generado por el skill (sin descripción catalogada todavía).',
  };
}

module.exports = { catalogar };
