# Prompt: Subir Historias de Usuario al Backlog de Jira

> **Nivel:** ⚙️ Ejecutivo (una vez parseado el archivo) — pero con confirmación obligatoria antes de escribir, igual que `crear-en-jira.md`.

## Propósito

Tomar `output-paso-3/historias-generadas-{fecha}.md` (generado por `prompts/paso-3/generar-backlog-detalle.md`) y crear las historias en el **backlog** de Jira — nunca en un sprint — con una prioridad inicial propuesta, dejando registro de esa propuesta para poder aprender de cómo el equipo la cambia después.

## Requisito previo

Conexión activa confirmada por `prompts/transversal/conectar-jira.md`, `config/jira-project.md` con el mapeo de campos, y `config/jira-mapeo.md` con la trazabilidad de épicas (`crear-en-jira.md`, Paso 2) — las historias se vinculan a la épica ya creada en Jira.

## Procedimiento

### 1. Parsea el archivo de historias de forma tolerante

El formato varía ligeramente entre ejecuciones (encabezados `###`/`####`, viñetas `*`/`-`, checkboxes `[x]`/texto plano para el Cumplimiento DoR) — nunca dependas de un patrón de línea exacto. Busca por:
- Bloques que empiecen por un identificador `HU-\d+` (en un heading o en una línea "Identificador: HU-XXX")
- Dentro de cada bloque, las etiquetas de campo por su nombre (`Épica:`, `Prioridad:`, `Estimación sugerida:`, `Verdict:`), no por su posición ni por el estilo de viñeta

Si una historia no tiene alguno de los campos obligatorios (Identificador, Épica, Prioridad, Estimación, Verdict), no la subas — repórtala al PM como incompleta y detente ahí para esa historia concreta, sigue con las demás.

### 2. Resumen previo y confirmación (obligatorio)

Antes de crear nada, muestra al PM: cuántas historias, agrupadas por épica, con su prioridad y Verdict (`✅ Ready`/`❌ No Ready`). Pide confirmación explícita antes de escribir en Jira — es un sistema compartido con el equipo técnico.

**Prefijo `[PROP]` (opcional, no por defecto):** por defecto las historias se suben sin ningún prefijo — la convención `[PROP]` de este skill se aplica de serie solo al Sprint Goal (`crear-sprints-jira.md`). Si el PM pide explícitamente marcar estas historias (o alguna épica en concreto) como propuestas, pregúntale primero si quiere el prefijo `[PROP]` en el título o prefiere subirlas tal cual antes de aplicarlo — no lo decidas por tu cuenta.

### 3. Crea en el backlog, nunca en un sprint

Cada historia → un issue en el backlog de Jira (tipo Historia, según `jira-project.md`), vinculado a su épica, con: título, descripción completa (Como/Quiero/Para + criterios Gherkin + requisitos técnicos/dependencias, todo en el cuerpo del issue), y una nota visible indicando el Verdict de DoR (ej. una etiqueta o el propio texto del issue). **No asignes ningún issue a un sprint** — eso lo decide el equipo más adelante, no este prompt.

### 4. Crea la tarea `[GESTIÓN]` si la historia quedó `❌ No Ready` por una dependencia externa sin tarea todavía

`generar-backlog-detalle.md` ya señala, al cerrar cada historia, si su Verdict `❌ No Ready` se debe a una dependencia **externa** del GEE (`DP-XXX`) que todavía no tiene tarea de gestión en Jira (columna "Tarea de gestión (Jira)" de `registro-dependencias.md` en `—`). No confundas esto con una dependencia técnica entre HU (esas nunca generan tarea).

Para cada caso señalado, **una vez ya creado el issue de la HU en el paso 3** (necesitas su clave de Jira para enlazarla):

1. Crea un issue tipo **Tarea** en el backlog con el prefijo `[GESTIÓN]` en el título (mismo patrón que `[PROP]`, sin necesidad de un tipo de issue nuevo), resumiendo la acción concreta de gestión que hay que realizar (a quién contactar, qué negociar/pedir/reclamar).
2. En la descripción, incluye al menos: la `DP-XXX` de origen (con su estado y criticidad RAG actuales), la acción concreta a realizar en pasos numerados, y una línea "Bloquea: `HU-XXX` (clave de Jira)" con la historia que depende de ella. Sigue el formato ya usado en la práctica en Eductrade/Polar (`UPEVUOWVWK-186`, `UPEVUOWVWK-187`) como referencia de tono y estructura.
3. Muestra el resumen al PM (cuántas tareas `[GESTIÓN]` se van a crear y por qué DP-XXX) junto con la confirmación del paso 2 — no pidas una segunda confirmación aparte.
4. Actualiza la columna "Tarea de gestión (Jira)" de `registro-dependencias.md` con la clave del issue recién creado, sustituyendo el `—`.
5. Si la `DP-XXX` ya tenía una tarea de gestión asociada (columna con una clave, no `—`), no crees una segunda — cita la existente en la descripción de la HU si `generar-backlog-detalle.md` no lo hizo ya.

### 5. Prioridad inicial propuesta

Ordena las historias en el backlog según el orden que propuso `generar-backlog-detalle.md`. Esto es una **propuesta**, no una decisión final.

### 6. Registra la propuesta en el historial (nunca se sobrescribe)

Añade una entrada nueva en `config/historial-prioridad-backlog.md` (plantilla en `templates/paso-3/historial-prioridad-backlog.md`) con: fecha, para cada HU su prioridad/orden propuesto por el skill, y el motivo (que ya declaró `generar-backlog-detalle.md` en su Paso 4). Esta es la primera entrada de lo que luego será un log acumulativo — cuando el equipo cambie el orden en Jira, `validar-backlog-jira.md` (o una futura sincronización) añade una entrada nueva comparando propuesto vs. real, nunca edita las anteriores.

### 7. Idempotencia

Si `historias-generadas-{fecha}.md` incluye una HU que ya tiene entrada en `jira-mapeo.md` (ya subida antes), no la vuelvas a crear — es una historia regenerada por el bucle de validación (`validar-backlog-jira.md` la actualiza, este prompt solo crea nuevas).

## Output

- Issues nuevos en el backlog de Jira
- Tareas `[GESTIÓN]` nuevas para dependencias externas sin cubrir todavía (si aplica)
- `config/jira-mapeo.md` actualizado con `HU-XXX ↔ clave de Jira`
- `registro-dependencias.md` actualizado con la clave de cada tarea `[GESTIÓN]` nueva
- Nueva entrada en `config/historial-prioridad-backlog.md`
- Resumen al PM: cuántas se crearon, cuántas quedaron pendientes por estar incompletas, cuántas tareas `[GESTIÓN]` se crearon y para qué DP-XXX

## Reglas

- Nunca borres ni edites destructivamente un issue que no hayas creado en esta misma ejecución.
- Nunca subas una historia de franja Lejana (placeholder) — solo Inmediata y, si están completas, Cercana.
- Si una historia tiene Verdict `❌ No Ready`, súbela igual (esa información es útil para el equipo), pero decláralo explícitamente en el resumen al PM.
- Nunca crees una tarea `[GESTIÓN]` duplicada para una `DP-XXX` que ya tenga una asociada — compruébalo siempre en `registro-dependencias.md` primero.
