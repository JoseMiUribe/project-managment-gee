> **⚠️ ARCHIVADO (2026-07-13) — plantilla ya no en uso.** La bifurcación Autónomo/Paradigma que este archivo registraba desapareció al retirarse Infinia como generador (ver `mejoras-pendientes.md`, entrada 2026-07-13): ahora solo existe un camino de generación (`prompts/paso-3/generar-backlog-detalle.md`). Si un proyecto existente tiene un `config/modo-trabajo.md` creado con esta plantilla antes de esa fecha, ya no se lee ni condiciona nada — puedes archivarlo o borrarlo del proyecto sin que afecte al pipeline. Se conserva aquí solo como referencia histórica.

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
