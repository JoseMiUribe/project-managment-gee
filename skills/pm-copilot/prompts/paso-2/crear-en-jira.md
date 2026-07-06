# Prompt: Crear Épicas, Sprints e Historias en Jira

> **Nivel:** ⚙️ Ejecutivo (una vez configurado el mapeo) — pero con una puerta de confirmación obligatoria antes de escribir en un sistema compartido. No lo automatices sin esa confirmación aunque la tarea en sí sea mecánica.

## Cuándo se ejecuta

Solo después de que el PM haya validado explícitamente: `roadmap-cliente.md`, `roadmap-tecnico.md`, y al menos las HU de franja **Inmediata** (y preferiblemente **Cercana**) de `backlog-detalle.md`. No crees en Jira contenido que todavía no está validado — Jira es un sistema compartido con el equipo técnico, no un borrador.

## Requisito previo

Ejecuta primero `prompts/transversal/conectar-jira.md` si no está ya confirmado que hay conexión activa y `investigar/[proyecto]/config/jira-project.md` existe con el mapeo de campos.

## Procedimiento

### 1. Resumen previo y confirmación (obligatorio, sin excepciones)

Antes de crear nada, muestra al PM un resumen exacto de lo que se va a crear:
- Cuántas épicas, con sus nombres
- Cuántos sprints, con sus fechas/nombres según `roadmap-tecnico.md`
- Cuántas HU, agrupadas por épica

Pide confirmación explícita ("¿confirmas que cree esto en Jira?"). No proceda sin un sí explícito — a diferencia de un artefacto markdown local, esto tiene efecto inmediato en un sistema que ve el equipo técnico.

### 2. Comprobar idempotencia antes de crear — y si ya está en sprint, no la toques

Si `investigar/[proyecto]/config/jira-mapeo.md` ya existe (de una ejecución anterior de este prompt), léelo primero. Para cada EP-XXX/HU-XXX que ya tenga un ID de Jira asociado:

- No la vuelvas a crear.
- **Comprueba primero si el issue ya está asignado a un sprint activo o iniciado en Jira.** Si es así, **no lo modifiques bajo ningún concepto, ni siquiera pidiendo permiso** — a partir de ese momento es responsabilidad del equipo técnico. Repórtalo al PM en el resumen final (ej. "HU-014 cambió de contenido pero ya está en Sprint 3, no se actualizó en Jira; coordínalo directamente con el equipo si hace falta") y sigue sin tocarlo.
- Si el issue **todavía no está en ningún sprint** (sigue en el backlog de Jira) y su contenido cambió desde la última sincronización (por una cascada o un changelog), pide permiso explícito al PM para cada actualización concreta antes de aplicarla — nunca la apliques por defecto ni la agrupes con la creación de issues nuevos sin que quede clara la distinción entre "esto es nuevo" y "esto modifica algo existente".

### 3. Crear en este orden

1. **Épicas** (`EP-XXX` → issue tipo Épica según el mapeo de `jira-project.md`): nombre, descripción (objetivo + RF que incluye), prioridad
2. **Sprints**: según la secuencia de `roadmap-tecnico.md`, solo si no existen ya sprints activos con esos nombres/fechas en el board
3. **Historias de Usuario / funcionalidades** (`HU-XXX` → issue tipo Historia según el mapeo), vinculadas a su épica y asignadas al sprint que le corresponda según `backlog-detalle.md`. Incluye descripción completa y criterios de aceptación tal como están en `backlog-detalle.md`. **Solo crea las de franja Inmediata y Cercana** — las de franja Lejana son placeholders internos, no tiene sentido crearlas en Jira todavía (se crearán cuando `generar-backlog-detalle.md` las detalle al acercarse su sprint)

### 4. Registrar el mapeo de trazabilidad

Guarda o actualiza `investigar/[proyecto]/config/jira-mapeo.md` con la correspondencia `EP-XXX ↔ clave de Jira` y `HU-XXX ↔ clave de Jira`, con fecha de creación/última sincronización. Este archivo es lo que permite que `analizar-jira.md` y futuras ejecuciones de este mismo prompt sepan qué ya existe.

### 5. Nunca borres, y nunca edites nada sin permiso caso por caso

Si detectas que algo creado previamente por este prompt ya no debería existir (una HU se eliminó del backlog, una épica se descartó), **no la borres de Jira automáticamente**. Indícaselo al PM y que sea él quien decida y ejecute el borrado en Jira, o te confirme explícitamente que lo haga tú en esa operación concreta.

Esto aplica también a cualquier edición que no sea la creación inicial: nunca la hagas por defecto, pide permiso explícito para esa modificación concreta — y recuerda que si el issue ya está en sprint, la respuesta es directamente no, sin pedir permiso siquiera (regla del paso 2 de arriba).

## Output

- Épicas, sprints e HU creados en Jira según el mapeo
- `investigar/[proyecto]/config/jira-mapeo.md` actualizado
- Resumen final al PM de qué se creó, con los enlaces/claves de Jira

## Alcance explícito de este prompt

Este prompt **solo crea**. La actualización del estado de las tareas (en progreso, bloqueada, terminada) la hace el equipo técnico directamente en Jira con sus propias herramientas — este skill no debe tocar ni mover tareas creadas por el equipo. Para leer ese estado y analizarlo, usa `prompts/paso-3/analizar-jira.md`, que es de solo lectura.
