# Prompt: Conectar con Jira

> **Nivel:** 🧠 Diseño (configuración) — decidir el mapeo de campos entre este sistema y la instancia de Jira del cliente requiere criterio. La comprobación de conexión en sí es mecánica.

## Advertencia de seguridad — léela antes de hacer nada

**Este skill nunca debe pedir el token/API key de Jira para guardarlo él mismo en un archivo del proyecto.** Un token de API es un secreto: si se guarda en un `.md` dentro de `investigar/[proyecto]/`, puede acabar compartido, versionado en un repositorio, o visible en el historial de una conversación. Eso es exactamente el tipo de fuga que hay que evitar.

La forma correcta de que el PM "no tenga que dar los datos de conexión cada vez" **no es que el skill los almacene**, sino que la autenticación viva en una capa que el skill ni siquiera toca: un servidor MCP de Jira configurado una vez en Claude Code, o una variable de entorno del sistema operativo. En ambos casos, el skill solo usa la conexión ya autenticada; nunca ve ni guarda el token.

## Dos conexiones distintas — no las confundas

Hay dos consumidores de Jira en este sistema, con necesidades de conexión independientes:

1. **El skill, cuando lo ejecutas tú (Claude) dentro de una sesión de Claude Code.** Si el usuario ha habilitado un conector MCP de Jira/Atlassian para la sesión (como ocurre cuando te lo activan desde la propia interfaz), lo usas directamente — no hay ningún script ni configuración que montar de tu parte, la autenticación ya la gestiona el conector y tú nunca ves el token. Esto es lo que cubre el paso 1 de abajo.
2. **El dashboard**, que es un servidor Node/Express que corre como proceso aparte, fuera de esta sesión de Claude Code. **No puede usar el conector MCP de tu sesión** — necesita su propia conexión (servidor MCP propio configurado a nivel de máquina, o variables de entorno con las que hacer llamadas REST directas). Esto es lo que cubren las Opciones A/B del paso 2.

Si el dashboard no tiene conexión propia, no se queda sin datos de Jira por completo: el skill (con la conexión de la sesión) puede volcar una foto local de lo que haga falta — ver la sección "Si el dashboard no puede conectarse" más abajo.

## Procedimiento

### 1. Para el skill en esta sesión: comprueba si ya hay conexión disponible

Busca si existen herramientas de Jira/Atlassian ya conectadas en la sesión (en Claude Code, con `ToolSearch` usando palabras clave como "jira" o "atlassian"). Si existen, úsalas directamente para todo lo que ejecutes tú (`crear-en-jira.md`, `subir-historias-a-jira.md`, `validar-backlog-jira.md`, `crear-sprints-jira.md`, `analizar-jira.md`) — no hace falta nada más, no hay que montar ningún script de autenticación. Si no existen, dile al PM que puede habilitar el conector de Jira desde la propia interfaz de la sesión (así es como se hizo la primera vez) — no intentes tú conectarte por otra vía.

### 2. Para el dashboard (proceso aparte): si no hay conexión propia, guía al PM para configurarla (no lo hagas tú por él)

Explica estas dos opciones y pregunta cuál aplica:

**Opción A — Conector MCP de Jira (recomendada):**
1. El PM (o alguien de su equipo con permisos) instala un servidor MCP de Jira/Atlassian y lo registra en la configuración de Claude Code fuera de esta conversación.
2. El token de API se pasa como variable de entorno **al propio servidor MCP** en ese momento de configuración — nunca se escribe en el chat ni en un archivo del proyecto.
3. Una vez registrado, las herramientas de Jira aparecen disponibles en las siguientes sesiones automáticamente. El skill las detecta con el paso 1 de este prompt cada vez que las necesita.

**Opción B — API REST directa (si no hay MCP disponible):**
1. El token debe vivir como variable de entorno del sistema operativo del PM (ej. `JIRA_API_TOKEN`, `JIRA_EMAIL`, `JIRA_BASE_URL`), configurada una vez por el propio PM en su máquina.
2. El skill puede leer esas variables de entorno en tiempo de ejecución para hacer las llamadas REST (vía `Bash`/`PowerShell` con `curl`), pero **nunca debe pedir que se le pegue el valor del token en el chat para guardarlo** — si el PM lo pega igualmente, no lo escribas en ningún archivo; úsalo solo para la llamada puntual y descarta el valor.

Si el PM no tiene ninguna de las dos configurada todavía para el dashboard, no le bloquees el trabajo — el dashboard sigue funcionando con el resto de datos locales, solo le faltarán las vistas que dependen de Jira en vivo. Ofrécele la alternativa de la sección siguiente.

### Si el dashboard no puede conectarse: exporta una foto local desde el skill

Muchas de las pestañas del dashboard (Requisitos, GEE, roadmap, capacidad) no necesitan Jira en absoluto — son datos locales del propio pipeline. Pero Sprint actual y Backlog sí son más ricas con datos de Jira en vivo. Si el dashboard no tiene su propia conexión, tú (con la conexión de la sesión, punto 1) puedes cubrir el hueco:

- Ejecuta `prompts/paso-4/analizar-jira.md` — ya escribe `output-paso-4/analisis-jira-YYYY-MM-DD.md`, que el dashboard lee sin necesitar conexión propia.
- `config/jira-mapeo.md` (que mantienen `crear-en-jira.md`, `subir-historias-a-jira.md` y `crear-sprints-jira.md`) también queda como archivo local legible por el dashboard.
- Dile explícitamente al PM que estos datos son una foto tomada por el skill en un momento dado, no en vivo — si quiere que el dashboard se actualice solo, tendrá que configurar la conexión propia del dashboard (Opción A/B arriba) en algún momento.

### 3. Guarda solo lo que NO es secreto

Una vez hay conexión (por A o B), pregunta al PM y guarda en `investigar/[proyecto]/config/jira-project.md` (documentación legible, para ti y para el PM):

- URL base de la instancia de Jira (ej. `https://paradigmadigital.atlassian.net`) — esto no es secreto, es una URL pública de la organización
- Clave del proyecto en Jira (ej. `PLEG`)
- Mapeo de campos: qué tipo de issue de Jira corresponde a "Épica" y cuál a "Historia de Usuario" en esta instancia concreta (varía entre organizaciones), qué campo se usa para Story Points/estimación, cómo se nombran los sprints
- Nombre del board/tablero si hay varios en el proyecto, y su ID numérico (lo necesitas para el punto siguiente; consíguelo listando los boards del proyecto)

Verifica el mapeo haciendo una lectura de prueba (ej. listar los tipos de issue del proyecto) antes de darlo por bueno — no asumas nombres de campo estándar sin comprobarlos contra la instancia real.

**Si además el PM va a usar la Opción B para el dashboard** (conexión REST propia, no MCP), guarda también `investigar/[proyecto]/config/jira-project.json` — es el archivo que el proceso del dashboard lee para decidir si intentar la sincronización en vivo (ninguno de estos tres campos es secreto):

```json
{
  "baseUrl": "https://paradigmadigital.atlassian.net",
  "projectKey": "PLEG",
  "boardId": 12
}
```

Es un archivo distinto y con un propósito distinto al `.md` de arriba: el `.md` es para que tú y el PM entendáis el mapeo de campos; el `.json` es el que lee en tiempo de ejecución el proceso Node del dashboard (`dashboard/lib/jiraClient.js`), que no puede parsear Markdown. Si el PM solo usa la Opción A (MCP) para el dashboard, no necesitas crear este `.json` — la conexión la gestiona el propio servidor MCP.

### 4. Antes de cada uso posterior

Cada vez que ejecutes cualquier prompt que toque Jira, repite el paso 1 (confirmar que las herramientas de la sesión siguen disponibles) antes de operar. Si dejaron de estar disponibles, detente y avisa — no inventes ni simules una respuesta de Jira.

## Estado de esta integración en este skill

`prompts/paso-2/crear-en-jira.md`, `prompts/paso-3/subir-historias-a-jira.md`, `prompts/paso-3/validar-backlog-jira.md` y `prompts/paso-3/crear-sprints-jira.md` (ejecutados por el skill, vía el conector de la sesión) están **diseñados pero no verificados de extremo a extremo contra una instancia real** — trátalos como beta y registra cualquier ajuste en `mejoras-pendientes.md`.

La lectura en vivo del lado del dashboard (`dashboard/lib/jiraClient.js`, Opción B) sí está verificada: usa la API Agile de Jira (`/rest/agile/1.0/board/{boardId}/sprint`) para leer Sprints reales (fechas, goal, estado) y la API core (`/rest/api/3/search/jql`) para issues, con descubrimiento dinámico de IDs de campos personalizados — confirma que el conector MCP de la sesión (Opción A, usado por `crear-sprints-jira.md`) soporta las mismas operaciones de Sprint la primera vez que lo ejecutes; si no, ajusta ese prompt para que el PM cree el sprint vacío a mano y el skill solo le ponga fechas/goal.
