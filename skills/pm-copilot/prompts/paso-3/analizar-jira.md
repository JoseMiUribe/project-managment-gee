# Prompt: Analizar Estado de Jira (sprint, velocidad, bloqueos, riesgos)

> **Nivel:** 🧠 Diseño (interpretación) con partes mecánicas (extracción de datos) — extraer el estado es mecánico, pero decidir qué de eso es una señal de riesgo real requiere criterio. Ejecuta la interpretación en el modelo principal; la extracción de datos en bruto puede delegarse a un modelo económico si el volumen de issues es alto.

## Propósito

Dar al PM una lectura del estado real del sprint/proyecto en Jira — no para sustituir al equipo técnico (ellos gestionan sus tareas ahí directamente), sino para que el equipo de gestión detecte a tiempo lo que requiere intervención: bloqueos, dependencias que se están convirtiendo en bloqueos, desviación de velocidad, riesgo de no llegar al sprint.

**Este prompt es de solo lectura, sin excepción.** No mueve, edita ni comenta tareas en Jira — eso lo hace el equipo técnico con sus propias herramientas. Cualquier tarea, HU o funcionalidad ya asignada a un sprint iniciado es intocable desde este skill, ni siquiera pidiendo permiso: se reporta, nunca se modifica. Ver `prompts/paso-2/crear-en-jira.md` para la única operación de escritura que hace este skill (crear, antes de que algo entre en sprint) — y ahí también, todo lo que ya está en sprint queda fuera de alcance.

## Requisito previo

Conexión activa confirmada por `prompts/transversal/conectar-jira.md`, y `investigar/[proyecto]/config/jira-mapeo.md` con la trazabilidad EP-XXX/HU-XXX ↔ Jira.

## Datos a extraer

1. **Estado del sprint activo**: qué issues están To Do / En curso / Bloqueadas / Hechas, comparado contra lo planificado en `output-paso-3/sprint-backlog.md`
2. **Fechas y vencimientos**: qué issues tienen fecha límite vencida o próxima a vencer sin estar cerca de completarse
3. **Bloqueos explícitos**: issues marcadas como bloqueadas en Jira, con el motivo si está documentado ahí
4. **Estancamiento**: issues "En curso" sin actividad/comentarios/cambios de estado durante varios días (umbral: usa el que el PM considere razonable para este equipo, pregúntalo si no está definido)
5. **Historial de sprints cerrados**: puntos completados por sprint, para calcular velocidad real y compararla con la de `output-paso-2/capacidad-equipo/actual.md`
6. **Asignación**: qué issues no tienen responsable asignado a pocos días de necesitarse

## Interpretación (la parte que requiere criterio)

Para cada señal extraída, decide si merece escalarse al PM como riesgo/impedimento, y con qué urgencia:

| Señal en Jira | Traducción a GEE |
|---|---|
| Dependencia (`DP-XXX`) marcada como bloqueada o con fecha vencida en Jira | Proponer actualizar `output-paso-1/registro-dependencias.md` (subir criticidad, o pasar a `output-paso-1/registro-impedimentos.md` si ya está bloqueando trabajo activo) |
| Issue estancada varios días sin justificación visible | Proponer un riesgo nuevo (`R-XXX`) o marcar uno existente como materializándose |
| Velocidad real del sprint muy por debajo de `capacidad-equipo/actual.md` | Señalarlo como riesgo de no llegar al sprint; si es un patrón repetido en 2+ sprints, proponer recalibrar capacidad (`prompts/paso-2/procesar-capacidad.md`) con la velocidad real |
| Petición o cambio detectado en comentarios de Jira que no está en el backlog | Derivar a `prompts/paso-3/gestion-changelog.md` — no lo resuelvas aquí |

No conviertas cada dato en bruto en un riesgo automáticamente — usa criterio: una tarea bloqueada un día no es lo mismo que una bloqueada una semana. Prioriza lo que realmente compromete el sprint o el roadmap.

## Output

`investigar/[proyecto]/output-paso-3/analisis-jira-YYYY-MM-DD.md` con:
1. Resumen ejecutivo (2-3 frases): ¿el sprint va bien, en riesgo, o comprometido?
2. Tabla de estado por HU/tarea (planificado vs. real)
3. Bloqueos y estancamientos detectados, con la propuesta de actualización del GEE para cada uno
4. Velocidad real vs. capacidad estimada, con recomendación si hay desviación sostenida
5. Lista de propuestas concretas de actualización a `registro-riesgos.md` / `registro-dependencias.md` / `registro-impedimentos.md`, **pendientes de que el PM las confirme** — este prompt propone, no escribe directamente en el GEE sin pasar por esa confirmación (a diferencia de `daily-log.md`, que sí puede actualizar el GEE en la misma pasada porque parte de una conversación directa con el PM)

## Relación con `daily-log.md`

Si el proyecto usa Jira, ejecuta este prompt de análisis antes o durante el daily, y usa su output como base de las preguntas del daily en vez de partir solo de la memoria del PM — pero la conversación diaria sigue siendo la que decide qué se registra finalmente en el GEE.
