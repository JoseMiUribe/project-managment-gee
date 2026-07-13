# Prompt: Generar Historias de Usuario

> **Nivel:** 🧠 Diseño — decidir cuánto detallar cada HU según su horizonte temporal, y redactar criterios técnicos concretos, requiere criterio. Ejecuta en el modelo principal.

## Propósito

Este es el **único** generador de historias de usuario del skill: el propio skill genera siempre las historias directamente, sobre las épicas ya validadas y creadas en Jira. No existe ya una bifurcación de "quién genera" — hasta el 2026-07-13 existía una alternativa vía Infinia (Modo Paradigma), retirada por decisión explícita del PM tras uso real insuficiente incluso con el prompt de traspaso ya mejorado (ver `mejoras-pendientes.md`, entradas 2026-07-09, 2026-07-10 y 2026-07-13). El prompt que la implementaba queda archivado en `archivo/prompts/transversal/generar-historias-modo-paradigma.md` como referencia histórica, no como alternativa activa.

Lo que sí sigue siendo opcional es **enriquecer** esta generación con fuentes de contexto reales del proyecto (ej. el repositorio de código, en solo lectura) — nunca como un generador alternativo, solo para fundamentar mejor lo que este mismo prompt produce. Ver `prompts/transversal/gestionar-fuentes-contexto.md`.

## Modo de generación

Todo lo que sigue en este documento describe el **Modo Estándar** de generación de historias. Si el PM pide generarlas en un modo con nombre (ej. "genera las historias en modo mapfre"), sigue primero `prompts/transversal/gestionar-modos-generacion.md` — aplica el Estándar de aquí como base, con las diferencias que declare ese modo. Si no se pide ningún modo, continúa directamente con el Estándar de abajo.

## Cuándo se ejecuta — siempre por petición explícita del PM

Solo se ejecuta cuando el PM lo pide explícitamente, y solo sobre épicas que ya estén **validadas y creadas en Jira** (`crear-en-jira.md`, Paso 2, cerrado). Nunca se dispara solo. Dos formas de invocación:

1. **"Genérame todas las HU"** — procesa todas las épicas ya creadas en Jira, aplicando la clasificación por franja del Paso 1 (Inmediata completa, Cercana media, Lejana placeholder). Es el comportamiento por defecto: no gasta esfuerzo de detalle en épicas lejanas que pueden cambiar antes de llegar su turno.
2. **"Genérame solo las historias de la épica X (y/o Y, Z...)"** — genera el **formato completo** (el mismo del Paso 2, no la versión reducida) para esas épicas concretas, **sin importar en qué franja las situaría el roadmap**. Es una petición explícita del PM: al nombrarlas, decide él mismo asumir el riesgo de detallar algo que el roadmap consideraría todavía lejano — no lo cuestiones, hazlo.

Si el PM no ha dicho cuál de las dos formas quiere, pregúntaselo antes de generar nada — no asumas "todas" por defecto.

## Input obligatorio

- `investigar/[proyecto]/output-paso-2/epicas.md`
- `investigar/[proyecto]/output-paso-2/roadmap-tecnico.md` (fuente de verdad de qué épica cae en qué sprint)
- `investigar/[proyecto]/output-paso-2/config/dor-definition.md`
- `investigar/[proyecto]/output-paso-1/registro-riesgos.md` y `registro-dependencias.md`
- `investigar/[proyecto]/documentacion-proyecto.md` (contexto técnico/arquitectura — úsalo para que los criterios de aceptación sean técnicamente concretos, no genéricos)
- `investigar/[proyecto]/output-paso-0/requisitos-funcionales.md` y `requisitos-nofuncionales.md`

Si `roadmap-tecnico.md` no existe todavía, detente: sin saber qué épica va en qué sprint no se puede decidir la profundidad de detalle. Pide primero cerrar `generar-roadmaps.md`.

## Paso 0 (obligatorio si hay conexión con Jira): mira lo que el equipo ya escribió antes de generar nada

Validado con un caso real (ver `mejoras-pendientes.md`, entrada del proyecto Eductrade/Polar): generar historias sin mirar primero cómo trabaja el equipo produce HU "de producto puro" (Como/Quiero/Para + Gherkin agnóstico) que el equipo técnico reescribe o descarta en cuanto las ve, porque ellos ya trabajan a nivel de detalle técnico real (nombres de tabla, políticas RLS, componentes concretos). Antes de generar historias nuevas de una épica:

1. Si hay conexión con Jira (`config/jira-mapeo.md` o acceso directo), **lee las historias que el equipo ya haya creado él mismo en esa épica** (identificables porque no llevan el prefijo `HU-XXX` del skill — el equipo usa su propia numeración, ej. `US-XXX`). Si existen, usa su nivel de detalle y estructura como referencia de estilo — no apliques el formato genérico de este prompt por defecto si el equipo ya estableció uno más técnico y concreto.
2. **Marca explícitamente qué es inferencia tuya y qué es confirmado.** Cuando un criterio de aceptación, un requisito técnico o una asunción salga de tu propio razonamiento (no de un RF/RNF/documento explícito), prefíjalo con `[IA]` dentro del propio texto — igual que ya se hace con los RNF implícitos en el Paso 0. No mezcles sin marcar lo que dijo el cliente/equipo con lo que dedujiste tú.
3. **No infra-descompongas.** Si el equipo ya tiene un número de historias propias en una épica similar o en la misma, usa eso como referencia de granularidad esperada — no generes menos historias de las que la complejidad real sugiere solo por seguir un patrón genérico.
4. **Contrasta los límites de la épica contra el backlog real de Jira antes de darlos por buenos**, si hay conexión. Si detectas que una historia que vas a generar podría solapar con algo que ya existe en otra épica (mismo dato o entidad, distinta agrupación), no asumas una respuesta: decláralo explícitamente en la propia historia (ej. "Posible solape con EP-XXX / clave de Jira — resolver antes de desarrollar") y repórtalo al PM.

Mantén siempre `HU-XXX` como identificador para lo que genera el skill, **incluso si el equipo usa otra convención** (ej. `US-XXX`) — es intencional: permite distinguir a simple vista, dentro del mismo backlog de Jira, qué se generó con este pipeline y qué creó el equipo directamente. No unifiques nomenclatura salvo que el PM lo pida explícitamente.

## Qué nivel de detalle y tamaño debe tener una HU — regla validada con feedback real del equipo

Aplica a toda HU que generes en el Paso 2 (franja Inmediata), no solo a la invocación en curso. Nace de feedback explícito del equipo tras varias rondas reales de generación con distintos enfoques (skill directo, luego Infinia) — ver `mejoras-pendientes.md`, entrada 2026-07-10. El equipo rechazó tanto HU demasiado atómicas (una por cada micro-paso técnico) como HU sobredimensionadas (varios flujos distintos mezclados en una sola).

**Tamaño correcto — una HU por flujo funcional completo:** cada historia debe cubrir un flujo end-to-end que el usuario reconozca como una unidad de valor usable por sí sola (ej. "un profesor califica un examen y el alumno ve la nota", no "guardar la nota en base de datos" por un lado y "notificar al alumno" por otro, como HU separadas). Ni la fragmentes en pasos técnicos sueltos, ni mezcles dos flujos distintos en la misma historia solo porque comparten pantalla o entidad.

**Caso especial — épicas de configuración/ajustes sin un recorrido de usuario único:** algunas épicas (ej. "Configuración de centro") no tienen un flujo end-to-end natural — son un conjunto de campos o capacidades independientes que el usuario completa en cualquier orden, no un recorrido con pasos secuenciales. Aplicar "un flujo funcional completo" a ciegas aquí lleva a dos errores igual de malos: fragmentar por campo (una HU para el logo, otra para el color, otra para el idioma...) o agrupar todo en una única HU gigante que cualquier dependencia bloquea entera.

Validado con feedback real del equipo (ver `mejoras-pendientes.md`, entrada 2026-07-13): en estos casos el criterio de agrupación correcto no es el campo ni la pantalla — es el **límite de dependencia/riesgo de bloqueo compartido**. Agrupa en la misma HU todo lo que comparte el mismo perfil de bloqueo (todo listo, o todo bloqueado por la misma causa); separa en HU distintas lo que tiene un riesgo de dependencia diferente, aunque viva en la misma pantalla o formulario. Esto maximiza el trabajo en paralelo del equipo: una dependencia que bloquea una parte no debe congelar partes ya listas para desarrollar.

Ejemplo: en una épica de configuración de centro, "colores de marca" y "logotipo" comparten el mismo perfil de dependencia (ninguna externa más allá de un mockup) → misma HU. "Ratios ATNE/ANE" depende de datos que el cliente aún no ha entregado → HU aparte, aunque esté en la misma pantalla de configuración, precisamente para no bloquear el resto.

Antes de cerrar cualquier HU de una épica sin recorrido de usuario único, pregúntate: ¿qué partes comparten exactamente el mismo bloqueo (o ausencia de él)? Esa es la frontera de la historia, no el campo ni la sección visual.

**Lo que SÍ debe llevar, con el máximo detalle posible (mejor pecar de más que de menos):**
- Descripción completa de lo que el usuario tiene que poder hacer, sin dejar huecos de interpretación
- Todos los inputs que el usuario percibe (campos, pantallas, acciones) y sus validaciones a nivel lógico/de negocio (qué se acepta, qué se rechaza, y por qué)
- Toda la lógica de negocio necesaria para que el flujo tenga sentido (reglas, cálculos, condiciones)
- Solapamientos y dependencias explícitas con otras HU (campo `Dependencias` del Paso 2 — no lo omitas ni lo minimices)

**Lo que NO debe llevar, salvo que ya exista como decisión tomada y documentada (nunca inventada por ti):**
- Nombres de tabla, esquema, endpoint, o cualquier detalle de implementación técnica que tú mismo estés decidiendo — no es tu rol decidir CÓMO se construye, solo QUÉ debe hacer el sistema desde la perspectiva del usuario y del negocio
- Elección de tecnología, framework, o decisiones de arquitectura de ningún tipo
- Excepción explícita: si el proyecto tiene registrada una fuente de contexto de repositorio de código (`config/fuentes-contexto/repo-codigo.md`, ver `prompts/transversal/gestionar-fuentes-contexto.md`), puedes fundamentar sugerencias técnicas superficiales en lo que ya existe realmente ahí (nunca inventarlas). Si no está registrada, esta capacidad queda fuera de alcance por defecto — no la asumas.

Esto no contradice el Paso 0 de arriba (mirar el estilo de HU que el equipo ya escribió): si el equipo mismo ya documentó una decisión técnica en una HU propia existente, es un hecho ya decidido, no una invención tuya — puedes reflejarlo como contexto. La diferencia es entre *reflejar* una decisión ya tomada por el equipo y *tomarla tú mismo* desde cero.

## Paso 1: clasifica cada épica en una franja temporal

Usa la secuencia de sprints de `roadmap-tecnico.md`:

| Franja | Definición | Profundidad de HU |
|---|---|---|
| **Inmediata** | Cae en el sprint actual o el siguiente | Completa (ver Paso 2) |
| **Cercana** | Cae dentro de 1-2 meses / próximos 3-4 sprints | Media |
| **Lejana** | Más allá, o marcada como Fase 2 / Condicional en `epicas.md` | Mínima (placeholder) |

Si una épica se solapa entre franjas, clasifica sus HU individualmente según en qué sprint caería cada una, no la épica entera de golpe. Solo genera con detalle completo las épicas en franja Inmediata en cada ejecución — no adelantes trabajo de las demás franjas más allá de lo indicado abajo.

**Excepción:** si el PM te pidió explícitamente una o varias épicas por nombre (invocación 2 de arriba), ignora la franja que les tocaría y genérales el formato completo del Paso 2 directamente — la clasificación por franja de este paso solo aplica a la invocación "todas".

## Paso 2: genera las historias de la franja Inmediata con el formato completo

Cada historia debe tener, obligatoriamente, estos campos — trátalo como un contrato fijo, no lo simplifiques:

- **Identificador:** `HU-XXX` (tres dígitos, correlativo)
- **Épica:** `EP-XXX`
- **Prioridad:** Must / Should / Could / Won't (hereda o deriva de la prioridad de la épica y del RF de origen en `epicas.md`)
- **Estimación sugerida:** [N] puntos, con una frase justificando la complejidad
- **Descripción:** Como [rol] / Quiero [acción] / Para [beneficio]
- **Criterios de Aceptación (Gherkin):** mínimo 2 escenarios en formato Dado/Cuando/Entonces, cubriendo con el máximo detalle posible los inputs que percibe el usuario, sus validaciones lógicas/de negocio, y las reglas de negocio implicadas — no te quedes corto por brevedad, pero sin implementación técnica (ver regla de tamaño/detalle de arriba)
- **Requisitos No Funcionales o de Seguridad aplicables** (si existen, derivados de un RNF ya definido en el Paso 0 — nunca una decisión de arquitectura que inventes tú) **y/o Dependencias** (con otras HU o con DP-XXX del GEE) — incluye lo que aplique, no fuerces ambas secciones si una no tiene contenido real
- **Cumplimiento DoR:** repasa cada criterio de `dor-definition.md` uno por uno y cierra con un **Verdict** explícito: `READY` (cumple todo lo obligatorio) o `BLOCKED` (indica qué lo bloquea — normalmente una dependencia de otra HU sin resolver)

Trata este documento como una especificación técnica permanente que van a leer otros ingenieros durante meses, no como una nota de trabajo — no resumas ni recortes por volumen aunque sean muchas historias de golpe.

## Paso 3: franjas Cercana y Lejana

### Franja Cercana — nivel medio

- `Identificador`, `Épica`, título y descripción breve (2-4 líneas)
- Criterio de aceptación de alto nivel (1-2 líneas, sin desglosar en Gherkin todavía)
- Dependencias conocidas a nivel de épica, sin más precisión
- Sin Cumplimiento DoR todavía — no tiene sentido evaluarlo sin criterios de aceptación completos

### Franja Lejana — solo placeholders

- Lista de "HU candidatas" dentro de cada épica lejana: una frase por HU, sin descripción ni criterios
- Márcalas explícitamente como `⏳ Pendiente de detallar — sujeta a cambios de alcance antes de llegar a su sprint`

## Paso 4: prioriza dentro de la franja Inmediata

Si hay más HU candidatas de las que caben en la capacidad del sprint (`capacidad-equipo/actual.md`), prioriza en este orden:

1. HU que desbloquean a otras HU (camino crítico de dependencias)
2. HU que resuelven o mitigan un riesgo con RAG 🔴 o 🟡 (`registro-riesgos.md`)
3. Valor de negocio de la épica de origen (prioridad ya asignada en `epicas.md`)
4. Tamaño/esfuerzo (a igualdad de lo anterior, prioriza HU más pequeñas)

Declara explícitamente el orden resultante y por qué una HU de menor valor pasó antes que una de mayor valor, cuando ocurra. Este orden es solo la **propuesta inicial** — en cuanto `subir-historias-a-jira.md` la suba y el equipo/PO la cambien en Jira, el skill no la vuelve a tocar (ver ese prompt).

## Output

`investigar/[proyecto]/output-paso-3/historias-generadas-{YYYY-MM-DD}.md`, con las historias de la franja Inmediata completas (formato de arriba), seguidas de las de Cercana y Lejana en sus niveles reducidos, todo en el mismo archivo.

## Reevaluación y regeneración de una historia concreta

- **Reevaluación completa:** cuando el roadmap técnico se regenere (`actualizar-cascada.md` o `gestion-changelog.md` en Paso 4), vuelve a ejecutar este prompt completo — no parchees el archivo existente a mano.
- **Regeneración de una sola historia** (parte del bucle de `validar-backlog-jira.md`): cuando haya feedback sobre una HU concreta, regenera **solo esa historia**. Márcala con versión (`v1.1`, `v1.2`...) y cierra con un resumen de 2-4 frases de qué cambió, acotado por sección (Descripción / Criterios / Requisitos técnicos / Dependencias / DoR) — el equipo tiene que poder revisar sin releer la historia entera. No repitas ni toques las demás historias del archivo.

## HU ya comprometidas en un sprint activo

Antes de regenerar, revisa `output-paso-4/sprint-backlog-{N}.md` de cualquier sprint ya iniciado. Ninguna HU que ya esté ahí dentro se toca ni se redetalla por este prompt. Si una HU en sprint activo necesitara cambiar, no la edites: repórtalo y deriva el caso a `prompts/paso-4/gestion-changelog.md`.

## Autoevaluación antes de cerrar

- ¿Ninguna HU de franja Lejana tiene más detalle del que le corresponde?
- ¿Todas las HU de franja Inmediata tienen los 6 campos obligatorios, incluido el Verdict de DoR?
- ¿Usaste `HU-XXX`, no otro formato de ID?
- ¿La priorización respeta dependencias y riesgos antes que valor puro, y lo dice explícitamente cuando se desvía del orden de valor?
- ¿Cada HU cubre exactamente un flujo funcional completo end-to-end — ni fragmentada en pasos técnicos sueltos ni mezclada con otro flujo distinto?
- Si la épica es de configuración/ajustes sin recorrido de usuario único: ¿agrupaste por límite de dependencia/riesgo de bloqueo compartido, en vez de por campo o por pantalla?
- ¿Alguna HU incluye una decisión técnica, de arquitectura o de tecnología que tú mismo hayas inventado (no reflejada de una decisión ya tomada por el equipo)? Si es así, quítala antes de cerrar.
