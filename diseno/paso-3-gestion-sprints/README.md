# Paso 3: Gestión de Sprints

## Propósito
Gestionar el ciclo completo de sprints (SCRUM / SCRUMBAN), desde la planificación hasta la review, manteniendo actualizado el GEE.

## Pipeline

### Sub-paso 3.1: Definition of Ready (DoR)
- **Input**: HU del backlog-detalle.md
- **Checklist DoR**:
  - ¿Descripción clara y completa?
  - ¿Criterios de aceptación definidos?
  - ¿Dependencias resueltas o no bloqueantes?
  - ¿Riesgos identificados?
  - ¿El equipo entiende el QUÉ? (esto se valida en refinamiento)
- **Output**: `sprint-candidates.md` con HU candidatas y su estado DoR

### Sub-paso 3.2: Refinamiento (opcional, antes del Planning)
- **Input**: sprint-candidates.md
- **Propósito**: El equipo técnico escucha las HU y pregunta dudas sobre el QUÉ
- **Output**: sprint-candidates.md actualizado (dudas resueltas, algunas HU vuelven a backlog si no están maduras)

### Sub-paso 3.3: Sprint Planning
- **Input**: HU que pasan DoR + velocidad del equipo (del Capacity Planner, cuando exista)
- **Proceso**: El equipo descompone cada HU en tareas técnicas. La IA puede:
  - Sugerir descomposición basada en histórico
  - Detectar dependencias entre tareas
  - Identificar riesgos que surgen de la descomposición técnica
- **Output**: `sprint-backlog.md`
  - Sprint: [número], fechas, objetivo
  - HU seleccionadas con sus tareas técnicas
  - Nuevos riesgos/dependencias detectados → actualizar GEE

### Sub-paso 3.4: Ejecución del Sprint
- DailyLog se alimenta cada día
- La IA puede:
  - Preguntar diariamente: "¿Hay algo que actualizar en el GEE?"
  - Detectar tareas bloqueadas → sugerir impedimento
  - Recordar dependencias próximas a vencer
  - Actualizar RAG de riesgos según avance

### Sub-paso 3.5: Sprint Review
- **Plantilla estándar** (mismo formato todas las veces):
  1. Objetivo del sprint
  2. Qué se planificó vs qué se entregó
  3. Lo que no se entregó y por qué
  4. Demo points clave
  5. Feedback de stakeholders
  6. Acciones derivadas (nuevos requisitos → ChangeLog)
- **Output**: `review-sprint-X.md`

### Sub-paso 3.6: Cierre y retrospectiva
- **Input**: review-sprint-X.md + datos de ejecución
- **Output**: `lecciones-sprint-X.md`
  - Lecciones aprendidas
  - Actualización de velocidad del equipo
  - Ajustes al roadmap si procede

## Integración con GEE
Durante la ejecución del sprint, el GEE se actualiza constantemente:
- Nuevas dependencias descubiertas → DP-XXX
- Riesgos que se materializan → IM-XXX
- Cambios de alcance del feedback → SC-XXX
- DailyLog con referencias a todo lo anterior
