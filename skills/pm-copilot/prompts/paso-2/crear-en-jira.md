# Prompt: Crear Épicas en Jira

> **Nivel:** ⚙️ Ejecutivo (una vez configurado el mapeo) — pero con una puerta de confirmación obligatoria antes de escribir en un sistema compartido. No lo automatices sin esa confirmación aunque la tarea en sí sea mecánica.

## Alcance de este prompt (importante, cambió)

**Este prompt solo crea épicas.** Ni sprints ni historias de usuario — eso ya no ocurre en el Paso 2. Las historias de usuario se generan y validan en el Paso 3 completo (`generar-backlog-detalle.md`, seguido de `subir-historias-a-jira.md`), que las sube directamente al backlog. Si vienes de una versión anterior de este skill donde este prompt también creaba HU/sprints, esa parte se ha movido — no la repliques aquí.

## Cuándo se ejecuta

Solo después de que el PM haya validado explícitamente `roadmap-cliente.md` y `roadmap-tecnico.md`. No crees en Jira contenido que todavía no está validado.

## Requisito previo

Ejecuta primero `prompts/transversal/conectar-jira.md` si no está ya confirmado que hay conexión activa y `investigar/[proyecto]/config/jira-project.md` existe con el mapeo de campos.

## Procedimiento

### 1. Resumen previo y confirmación (obligatorio, sin excepciones)

Antes de crear nada, muestra al PM un resumen exacto: cuántas épicas, con sus nombres y objetivos. Pide confirmación explícita ("¿confirmas que cree estas épicas en Jira?"). No proceda sin un sí explícito.

### 2. Comprobar idempotencia — y si ya está en sprint, no la toques

Si `investigar/[proyecto]/config/jira-mapeo.md` ya existe, léelo primero. Para cada `EP-XXX` que ya tenga un ID de Jira asociado:

- No la vuelvas a crear.
- **Comprueba si la épica (o alguna de sus historias ya subidas en Paso 3) está vinculada a un sprint activo.** Si es así, **no la modifiques bajo ningún concepto, ni siquiera pidiendo permiso** — repórtalo al PM y sigue sin tocarla.
- Si no está en sprint y su contenido cambió (por una cascada), pide permiso explícito para esa actualización concreta antes de aplicarla.

### 3. Crear las épicas con toda la información descriptiva necesaria

Cada `EP-XXX` → issue tipo Épica según el mapeo de `jira-project.md`, con una descripción completa y entendible sin tener que abrir `epicas.md` en paralelo:

- Nombre y objetivo de negocio (de `epicas.md`)
- Requisitos funcionales que incluye (RF-XXX, con una frase de qué cubre cada uno — no solo el ID)
- Dependencias con otras épicas, si las hay
- Riesgos GEE asociados (R-XXX, con una frase de qué riesgo es, no solo el ID)
- Prioridad (MoSCoW) y fase (MVP / Fase 2 / Condicional)
- Enlace o referencia a la sección correspondiente de `roadmap-tecnico.md` para contexto temporal

Cuanta más de esta información quede en el propio issue de Jira (no solo enlazada), más fácil será para el equipo técnico entenderla sin tener que ir a buscar el markdown original.

### 4. Registrar el mapeo de trazabilidad

Guarda o actualiza `investigar/[proyecto]/config/jira-mapeo.md` con la correspondencia `EP-XXX ↔ clave de Jira`, con fecha de creación/última sincronización. Este mismo archivo lo extenderá `subir-historias-a-jira.md` en el Paso 3 con las HU.

### 5. Nunca borres, y nunca edites nada sin permiso caso por caso

Si detectas que una épica ya no debería existir, **no la borres de Jira automáticamente** — indícaselo al PM y que sea él quien decida. Cualquier edición que no sea la creación inicial requiere permiso explícito caso por caso, y si la épica ya tiene contenido en sprint, la respuesta es directamente no, sin pedir permiso siquiera.

## Output

- Épicas creadas en Jira
- `investigar/[proyecto]/config/jira-mapeo.md` actualizado
- Resumen final al PM con los enlaces/claves de Jira

## Alcance explícito de este prompt

Solo crea épicas. Ni sprints, ni historias, ni actualización de estado de tareas — eso lo hacen `subir-historias-a-jira.md` (Paso 3) y el equipo técnico con sus propias herramientas. Para leer el estado del sprint, usa `prompts/paso-4/analizar-jira.md`, que es de solo lectura.
