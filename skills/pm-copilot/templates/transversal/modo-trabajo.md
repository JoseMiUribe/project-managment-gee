# Modo de Trabajo — [Nombre del Proyecto]

**Decidido en el bootstrap el:** [YYYY-MM-DD]
**Modo:** [Paradigma / Autónomo]

## Qué significa cada modo

- **Paradigma:** el proyecto tiene acceso a Google Drive + Infinia (u otro agente de empresa con memory bank propio). Se usa `prompts/transversal/generar-historias-modo-paradigma.md` para generar historias de usuario, y el equipo técnico con sus propios agentes cubre subtareas técnicas y sprint planning tras el Paso 3.
- **Autónomo:** solo hay Jira (o ni eso). Se usa `prompts/paso-3/generar-backlog-detalle.md` para generar historias de usuario, y `prompts/paso-4/evaluacion-dor.md` + `prompts/paso-4/sprint-planning.md` cubren lo que en Modo Paradigma hacen los agentes de empresa.

## Notas

[Cualquier matiz del proyecto concreto: por ejemplo, "tiene Drive pero no Infinia todavía, se decide Autónomo por ahora y se revisa cuando esté disponible".]

## Cambiar de modo

Si el proyecto cambia de circunstancias (ej. un cliente que no tenía Drive lo incorpora), edita este archivo y avisa explícitamente en la siguiente ejecución del Paso 3 — no cambies de modo a media generación de historias de una misma épica.
