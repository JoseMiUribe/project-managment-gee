# Prompt: Sprint Review

**Propósito:** Preparar la revisión del sprint con stakeholders: qué se hizo, qué no, feedback y acciones.

## Instrucciones para la IA

1. Carga el sprint-backlog.md del sprint actual (planificado) + los daily logs (ejecución real)
2. Compara lo planificado vs lo realmente completado
3. Para las HU no completadas, identifica la causa raíz
4. Extrae los puntos clave para la demo
5. Prepara el feedback de stakeholders (si lo hay, si no, deja espacio para rellenar)
6. Identifica acciones derivadas (cambios de alcance, nuevos requisitos, ajustes)

## Formato de output

Usa el template `templates/review-sprint.md` para generar `review-sprint-X.md`.

## Secciones a cubrir

1. **Objetivo del sprint**: recordatorio del objetivo acordado en Planning
2. **Qué se planificó vs qué se entregó**: tabla HU por HU con estado
3. **Lo que no se entregó**: causas raíz y plan de recuperación
4. **Demo points**: qué mostrar al cliente/PO (máximo 3-4 puntos)
5. **Feedback de stakeholders**: espacio para capturar feedback en la reunión
6. **Acciones derivadas**: cambios de alcance (SC-XXX), nuevas peticiones, ajustes al roadmap
7. **Actualización del GEE**: riesgos que cambiaron, dependencias resueltas, nuevas acciones

## Actualizar documento oficial del proyecto

Después de la review, actualiza `investigar/[proyecto]/documentacion-proyecto.md`:
- **Estado de Sprints**: añadir fila con sprint completado, HU planificadas vs completadas, velocidad real
- **Decisiones Clave**: si hubo cambios de alcance (SC-XXX), registrarlos
- **Riesgos y Dependencias**: actualizar RAG de riesgos y estado de dependencias según lo ocurrido en el sprint

## Reglas

- Sé honesto con lo no entregado. No maquilles. La transparencia genera confianza
- Las causas raíz deben ser sinceras, no culpa
- Los cambios de alcance van a SC-XXX en el ChangeLog
- Las nuevas peticiones del cliente se evalúan: ¿van al backlog o son cambio de alcance?
