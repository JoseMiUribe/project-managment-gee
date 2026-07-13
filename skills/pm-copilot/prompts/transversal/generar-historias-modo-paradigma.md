# Prompt: Generar Historias de Usuario vía Infinia (Modo Paradigma)

> **Nivel:** 🧠 Diseño — preparar el traspaso y validar lo que devuelve Infinia requiere criterio. Ejecuta en el modelo principal.

## Propósito

Este es el equivalente, en Modo Paradigma, de `prompts/paso-3/generar-backlog-detalle.md` (Modo Autónomo). Solo se ejecuta si `config/modo-trabajo.md` dice Paradigma. Infinia (u otro agente de empresa con memory bank propio) genera las historias de usuario leyendo directamente la documentación del proyecto en Drive — el skill prepara el traspaso, interpreta el resultado y lo persiste, porque **Infinia no tiene permisos de escritura en Drive**.

Este prompt está calibrado contra pruebas reales con Infinia (no es un diseño teórico) — ver `mejoras-pendientes.md` para el registro de esos experimentos y qué se aprendió de cada uno.

## Requisito previo

`investigar/[proyecto]/` debe vivir dentro de una carpeta ya sincronizada con Drive Desktop (sin esto Infinia no puede leer nada). Confírmalo con el PM si no está seguro.

## Procedimiento

### 1. Identifica qué épica(s) tocan generarse

Consulta `output-paso-2/roadmap-tecnico.md` para saber qué épica(s) caen en el horizonte inmediato — no generes historias de épicas lejanas todavía (mismo principio de `generar-backlog-detalle.md`: no inviertas detalle en algo que el proyecto puede invalidar antes de llegar ahí).

**Si hay conexión con Jira** (`config/jira-mapeo.md`), pide primero a Infinia (o comprueba tú mismo) si el equipo técnico ya tiene historias propias en esa épica — validado con un caso real que generar sin mirar esto produce HU "de producto puro" que el equipo reescribe en cuanto las ve, porque ellos trabajan a un nivel de detalle técnico mucho más concreto (nombres de tabla, políticas RLS, componentes reales). Si existen, pide a Infinia que iguale ese nivel de detalle en vez de aplicar un formato genérico.

### 2. Prepara el mensaje de traspaso

Dale a Infinia la ruta de Drive del proyecto y pídele explícitamente que lea:
- `documentacion-proyecto.md` (contexto técnico/arquitectura — validado que esto es suficiente, no hace falta un artefacto nuevo para el stack)
- `output-paso-0/requisitos-funcionales.md` y `requisitos-nofuncionales.md`
- `output-paso-2/epicas.md`
- `output-paso-2/config/dor-definition.md`

Pídele también, explícitamente:
- Que marque con el prefijo `[IA]` cualquier criterio, requisito o asunción que sea inferencia suya y no algo confirmado en los documentos — igual que el skill ya hace con los RNF implícitos del Paso 0. No debe mezclar sin marcar lo confirmado con lo deducido.
- Que, si hay backlog de Jira accesible, contraste los límites de la épica contra las historias ya existentes en otras épicas antes de darlos por buenos, y que declare explícitamente cualquier solape posible en vez de asumir que no lo hay.
- Que no infra-descomponga: si hay historias del equipo en épicas comparables, que use su granularidad como referencia, no un número arbitrariamente bajo.
- Que no incluya nombres de tabla/esquema, DDL, políticas RLS, ni ninguna decisión de tecnología o arquitectura que esté inventando — no le corresponde decidir el "cómo", solo el "qué" (salvo que refleje una decisión ya documentada por el equipo en una historia propia existente, citándola).
- **Tamaño y agrupación de cada historia** (regla validada con feedback real del equipo, ver `mejoras-pendientes.md`, entrada 2026-07-13 y la sección equivalente en `prompts/paso-3/generar-backlog-detalle.md`): una HU por flujo funcional completo end-to-end, ni fragmentada en pasos técnicos sueltos ni mezclando varios flujos distintos. **Caso especial — épicas de configuración/ajustes sin recorrido de usuario único** (ej. "Configuración de centro"): en vez de una HU por campo o por pantalla, agrupa por **límite de dependencia/riesgo de bloqueo compartido** — todo lo que comparte el mismo perfil de bloqueo (o su ausencia) va en la misma historia; lo que tiene un riesgo de dependencia distinto se separa, aunque esté en la misma pantalla. Esto es lo que permite al equipo avanzar en paralelo en vez de que una dependencia bloquee partes ya listas.
- Que numere las historias nuevas empezando por el siguiente `HU-XXX` libre en todo el proyecto (no solo en la épica) — comprueba `config/jira-mapeo.md` antes de indicarle el número de partida, para no repetir una colisión de identificador ya ocurrida antes.

Pídele que genere las historias de la épica indicada, **siempre** con este formato exacto (validado empíricamente, Infinia lo respeta si se le pide explícito):

- `Identificador: HU-XXX` (tres dígitos, **no** `US-XXX` — es la convención del resto del sistema)
- `Épica: EP-XXX` (como campo propio, no solo por agrupación visual)
- `Prioridad: [Must/Should/Could/Won't]`
- `Estimación sugerida: [N] puntos`
- Descripción Como/Quiero/Para
- Criterios de aceptación en Gherkin (Dado/Cuando/Entonces), mínimo 2 escenarios
- Requisitos Técnicos y de Seguridad y/o Dependencias (lo que aplique)
- Cumplimiento DoR: checklist contra los criterios reales de `dor-definition.md`, con un **Verdict** explícito (`READY` / `BLOCKED` y por qué)

Instrucción crítica de framing (validada en pruebas de volumen — sin esto la profundidad puede variar): dile explícitamente que **trate el resultado como una especificación técnica permanente que van a leer otros ingenieros durante meses, no como una respuesta de chat que se lee una vez**. No es una limitación real de Infinia, es una cuestión de cómo se le pide — con este framing la profundidad se mantiene o mejora aunque aumente el volumen.

### 3. Guarda la respuesta tú mismo

Infinia no puede escribir en Drive. Copia su respuesta completa (o pídele al PM que la pegue si la conversación con Infinia es aparte) y guárdala en:

`investigar/[proyecto]/output-paso-3/historias-generadas-{YYYY-MM-DD}.md`

No reformatees ni "limpies" el contenido de Infinia al guardarlo — pégalo tal cual. El formato varía ligeramente entre ejecuciones (encabezados, viñetas vs. checkboxes) y eso es esperado; `subir-historias-a-jira.md` está diseñado para ser tolerante a esa variación, no reescribas tú para "normalizarlo".

### 4. Valida antes de pasar al siguiente sub-paso

Antes de continuar a `subir-historias-a-jira.md`, comprueba con una lectura rápida:
- ¿Tiene cada historia los 5 campos obligatorios (Identificador, Épica, Prioridad, Estimación, Verdict DoR)?
- ¿Usa `HU-XXX`, no `US-XXX`?
- ¿Las dependencias entre historias son coherentes (si HU-002 depende de HU-001, ambas existen)?
- ¿La numeración empieza donde le indicaste (siguiente `HU-XXX` libre en todo el proyecto), sin colisionar con `config/jira-mapeo.md`?
- ¿Alguna historia incluye DDL, nombres de tabla/esquema, RLS o una decisión de arquitectura que Infinia esté inventando (no reflejada de una decisión ya tomada por el equipo)? Si es así, vuelve a Infinia y pide que la quite.
- Si la épica es de configuración/ajustes sin recorrido de usuario único: ¿agrupó Infinia por límite de dependencia/riesgo de bloqueo compartido, o fragmentó por campo/pantalla? Si fragmentó, pide que reagrupe antes de aceptar el resultado.
- Toda cita a un issue de Jira concreto (solape, dependencia) que aparezca en una historia: ¿la verificaste tú mismo contra Jira real, o solo confías en que Infinia dice haberlo comprobado? Verifícala antes de aceptar la historia — un solape con cita incorrecta es peor que no detectarlo.

Si falta algo, no lo rellenes tú inventando — vuelve a Infinia con el hueco concreto detectado y pide que lo complete.

## Regeneración de una historia concreta (parte del bucle de validación)

Cuando `validar-backlog-jira.md` detecte feedback sobre una historia específica, vuelve aquí solo para esa historia:
- Pide a Infinia que regenere **únicamente** esa historia, indicando explícitamente que las demás no deben repetirse ni tocarse.
- Pide que la marque con versión (`v1.1`, `v1.2`...) — Infinia ya lo hace espontáneamente si no se le indica lo contrario, fórzalo si no lo hace.
- Pide un resumen de 2-4 frases de qué cambió exactamente, acotado por sección (Descripción / Criterios / Requisitos técnicos / Dependencias / DoR) — esto es lo que permite que el equipo revise sin releer la historia entera.
- Sustituye solo esa historia en `historias-generadas-{fecha}.md` (o añade una nueva versión fechada, según prefiera el PM) — nunca reescribas el archivo completo perdiendo el resto de historias.

## Salida

`investigar/[proyecto]/output-paso-3/historias-generadas-{YYYY-MM-DD}.md`, con el mismo formato exacto que produce `prompts/paso-3/generar-backlog-detalle.md` en Modo Autónomo — `subir-historias-a-jira.md` no necesita saber qué modo lo generó.
