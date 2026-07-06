# Prompt: Conectar con Jira

> **Nivel:** 🧠 Diseño (configuración) — decidir el mapeo de campos entre este sistema y la instancia de Jira del cliente requiere criterio. La comprobación de conexión en sí es mecánica.

## Advertencia de seguridad — léela antes de hacer nada

**Este skill nunca debe pedir el token/API key de Jira para guardarlo él mismo en un archivo del proyecto.** Un token de API es un secreto: si se guarda en un `.md` dentro de `investigar/[proyecto]/`, puede acabar compartido, versionado en un repositorio, o visible en el historial de una conversación. Eso es exactamente el tipo de fuga que hay que evitar.

La forma correcta de que el PM "no tenga que dar los datos de conexión cada vez" **no es que el skill los almacene**, sino que la autenticación viva en una capa que el skill ni siquiera toca: un servidor MCP de Jira configurado una vez en Claude Code, o una variable de entorno del sistema operativo. En ambos casos, el skill solo usa la conexión ya autenticada; nunca ve ni guarda el token.

## Procedimiento

### 1. Comprueba si ya hay una conexión disponible

Busca si existen herramientas de Jira/Atlassian ya conectadas en la sesión (en Claude Code, con `ToolSearch` usando palabras clave como "jira" o "atlassian"; en otros entornos, revisa qué herramientas MCP están disponibles). Si existen, úsalas directamente — no hace falta nada más, salta al paso 3.

### 2. Si no hay conexión disponible, guía al PM para configurarla (no lo hagas tú por él)

Explica estas dos opciones y pregunta cuál aplica:

**Opción A — Conector MCP de Jira (recomendada):**
1. El PM (o alguien de su equipo con permisos) instala un servidor MCP de Jira/Atlassian y lo registra en la configuración de Claude Code fuera de esta conversación.
2. El token de API se pasa como variable de entorno **al propio servidor MCP** en ese momento de configuración — nunca se escribe en el chat ni en un archivo del proyecto.
3. Una vez registrado, las herramientas de Jira aparecen disponibles en las siguientes sesiones automáticamente. El skill las detecta con el paso 1 de este prompt cada vez que las necesita.

**Opción B — API REST directa (si no hay MCP disponible):**
1. El token debe vivir como variable de entorno del sistema operativo del PM (ej. `JIRA_API_TOKEN`, `JIRA_EMAIL`, `JIRA_BASE_URL`), configurada una vez por el propio PM en su máquina.
2. El skill puede leer esas variables de entorno en tiempo de ejecución para hacer las llamadas REST (vía `Bash`/`PowerShell` con `curl`), pero **nunca debe pedir que se le pegue el valor del token en el chat para guardarlo** — si el PM lo pega igualmente, no lo escribas en ningún archivo; úsalo solo para la llamada puntual y descarta el valor.

Si el PM no tiene ninguna de las dos configurada todavía, no continúes con `crear-en-jira.md` ni `analizar-jira.md` — indícaselo claramente y ofrécele ayuda para configurar la opción que prefiera, pero la configuración de credenciales la ejecuta él, no el skill.

### 3. Guarda solo lo que NO es secreto

Una vez hay conexión (por A o B), pregunta al PM y guarda en `investigar/[proyecto]/config/jira-project.md` únicamente:

- URL base de la instancia de Jira (ej. `https://paradigmadigital.atlassian.net`) — esto no es secreto, es una URL pública de la organización
- Clave del proyecto en Jira (ej. `PLEG`)
- Mapeo de campos: qué tipo de issue de Jira corresponde a "Épica" y cuál a "Historia de Usuario" en esta instancia concreta (varía entre organizaciones), qué campo se usa para Story Points/estimación, cómo se nombran los sprints
- Nombre del board/tablero si hay varios en el proyecto

Verifica el mapeo haciendo una lectura de prueba (ej. listar los tipos de issue del proyecto) antes de darlo por bueno — no asumas nombres de campo estándar sin comprobarlos contra la instancia real.

### 4. Antes de cada uso posterior

Cada vez que `crear-en-jira.md` o `analizar-jira.md` necesiten Jira, repite el paso 1 (confirmar que las herramientas siguen disponibles) antes de operar. Si dejaron de estar disponibles, detente y avisa — no inventes ni simules una respuesta de Jira.

## Estado de esta integración en este skill

Estos tres prompts (`conectar-jira.md`, `prompts/paso-2/crear-en-jira.md`, `prompts/paso-3/analizar-jira.md`) están **diseñados pero no verificados contra una instancia real** — se escribieron sin una conexión Jira activa disponible en el momento de construir el skill. La primera vez que se usen de verdad, trátalos como una beta: valida con el PM que el mapeo de campos y el formato de las llamadas encajan con su instancia concreta, y registra cualquier ajuste necesario en `mejoras-pendientes.md`.
