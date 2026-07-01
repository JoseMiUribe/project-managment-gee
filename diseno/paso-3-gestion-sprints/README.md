# Paso 3: Gestión de Sprints

## Propósito
Gestionar el ciclo completo de sprints (SCRUM / SCRUMBAN), desde la planificación hasta la review, manteniendo actualizado el GEE.

## DoR y DoD: configurables por proyecto

DoR y DoD **no están hardcodeados** en el pipeline. Se definen por proyecto:

1. Al empezar un proyecto, la IA pregunta al equipo: "¿Qué DoR y DoD queréis usar?"
2. Si no tienen preferencia, se ofrecen los templates base:
   - `templates/dor-definition.md`
   - `templates/dod-definition.md`
3. El equipo adapta los templates a su realidad
4. Se guardan como `[proyecto]/config/dor-definition.md` y `[proyecto]/config/dod-definition.md`
5. La IA los usa en cada sprint como checklist

## Pipeline

### Sub-paso 3.1: Evaluación DoR
- **Input**: HU del backlog-detalle.md + `dor-definition.md` del proyecto
- **Proceso**: Evaluar cada HU contra el DoR acordado. Las que no pasan vuelven a refinamiento
- **Prompt**: `prompts/evaluacion-dor.md`
- **Output**: `sprint-candidates.md` con HU candidatas y su estado DoR

### Sub-paso 3.2: Sprint Planning
- **Input**: HU que pasan DoR + capacidad-equipo.md + GEE (riesgos, dependencias, acciones)
- **Proceso**: 
  1. Seleccionar HU para el sprint según capacidad disponible
  2. Descomponer cada HU en tareas técnicas
  3. Asignar responsable por especialidad (FE/BE/QA)
  4. Detectar dependencias entre tareas del sprint
  5. Identificar nuevos riesgos que surgen de la descomposición
- **Prompt**: `prompts/sprint-planning.md`
- **Output**: `sprint-backlog.md` (según template `templates/sprint-backlog.md`)

### Sub-paso 3.3: Ejecución del Sprint (Daily Log)
- **Proceso**: La IA pregunta diariamente:
  - ¿Qué se hizo ayer?
  - ¿Qué se hará hoy?
  - ¿Hay bloqueos?
  - ¿Hay novedades para el GEE (riesgos, dependencias, cambios)?
- **Prompt**: `prompts/daily-log.md`
- **Output**: `dailylog/YYYY-MM-DD.md` por cada daily

### Sub-paso 3.4: Sprint Review
- **Proceso**: Revisión con stakeholders del sprint completado
- **Prompt**: `prompts/sprint-review.md`
- **Output**: `review-sprint-X.md` (según template `templates/review-sprint.md`)

### Sub-paso 3.5: Retrospectiva
- **Proceso**: El equipo reflexiona sobre qué mejorar
- **Prompt**: `prompts/retrospectiva.md`
- **Output**: `lecciones-sprint-X.md` (según template `templates/retrospectiva.md`)

## Integración con GEE
Durante la ejecución del sprint, el GEE se actualiza constantemente:
- Nuevas dependencias descubiertas → DP-XXX
- Riesgos que se materializan → IM-XXX
- Cambios de alcance del feedback → SC-XXX
- DailyLog con referencias a todo lo anterior
- Al final del sprint, revisar qué riesgos cambiaron de estado

## Dependencias con otros pasos
| Este sub-paso necesita | Del paso | Artefacto |
|---|---|---|
| HU priorizadas | Paso 2.4 | backlog-detalle.md |
| Capacidad del equipo | Paso 2.1bis | capacidad-equipo.md |
| Riesgos y dependencias activas | Paso 1 | riesgo/registro-riesgos.md, registro-dependencias.md |
| DoR/DoD del proyecto | Config proyecto | config/dor-definition.md, config/dod-definition.md |
