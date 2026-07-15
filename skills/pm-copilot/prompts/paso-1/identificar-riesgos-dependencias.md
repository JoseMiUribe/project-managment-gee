# Prompt: Identificación de Riesgos, Dependencias y Acciones (Framework GEE)

> **Nivel:** 🧠 Diseño — identificar riesgos reales (no genéricos) requiere entender el proyecto concreto. No delegar a modelo económico.

## Propósito

Poblar el núcleo del Framework GEE: `registro-riesgos.md`, `registro-dependencias.md`, `registro-acciones.md`, `info-riesgos.md` y `riesgos-stakeholders.md`, a partir de los requisitos y zonas de incertidumbre del Paso 0, el resultado del Check Init, y el contexto legacy si existe. El objetivo no es rellenar una plantilla: es anticipar de forma realista qué puede salir mal en este proyecto concreto y dejar un plan de mitigación accionable, con trazabilidad completa (riesgo → acción, dependencia → riesgo, etc.).

No generes riesgos de relleno ("puede haber retrasos") sin conectarlos a una causa concreta del proyecto. Cada riesgo debe poder justificarse señalando qué requisito, qué zona de incertidumbre, qué punto del Check Init o qué patrón conocido de consultoría lo origina.

## Catálogo META (usar exactamente estos valores, no inventar otros)

| Concepto | Valores | Pesos |
|---|---|---|
| Probabilidad | Muy Baja / Baja / Media / Alta / Muy Alta | 0.1 / 0.3 / 0.5 / 0.7 / 0.9 |
| Impacto | Muy Bajo / Bajo / Medio / Alto / Muy Alto | 0.05 / 0.1 / 0.2 / 0.4 / 0.8 |
| Perfil de proyecto (multiplicador) | Bajo / Medio / Alto / Crítico | 10 / 30 / 60 / 100 |
| RAG | Verde / Amarillo / Rojo | Calculado del peso |
| Estado riesgo | Abierto / Impacto / Cerrado | — |
| Respuesta | Evitarlo / Reducirlo / Aceptarlo / Transferirlo | — |
| Ámbito | Interno / Externo | — |
| Estado dependencia | Detectada / Comunicada / Negociada / En Resolución / Resuelta | — |
| Estado acción | Pendiente / En curso / Bloqueada / Cerrada | — |

**Fórmula**: `Peso = Probabilidad × Impacto × Multiplicador_Proyecto`

**RAG automático**:
- 🟢 Verde: peso < 10
- 🟡 Amarillo: 10 ≤ peso ≤ 30
- 🔴 Rojo: peso > 30

**IDs**: riesgos `R-XXX`, dependencias `DP-XXX`, acciones `A-XXX` (numeración correlativa de tres dígitos, empezando en 001, sin reutilizar números aunque un registro se cierre).

Antes de calcular ningún peso, confirma con el PM (o infiere del contexto y decláralo explícitamente) cuál es el **Perfil del proyecto** (Bajo/Medio/Alto/Crítico) — es el multiplicador que se aplica a todos los riesgos de este proyecto y determina la sensibilidad del RAG.

## Instrucciones paso a paso

### a) Cargar y adaptar el catálogo de riesgos comunes (`info-riesgos.md`)

Genera primero (o actualiza si ya existe) el catálogo reutilizable `info-riesgos.md` con al menos estos 15 riesgos comunes en consultoría de software, cada uno con su probabilidad/impacto típicos de partida (el PM los ajustará por proyecto):

| Riesgo común | Tipo | Prob. típica | Impacto típico | Descripción |
|---|---|---|---|---|
| RFP / alcance inicial impreciso | alcance | Alta | Alto | El documento de partida deja fuera detalles clave que aparecen durante la ejecución |
| Cliente indeciso o sin mandato claro | cliente | Media | Alto | El interlocutor no tiene autoridad real para validar decisiones, generando bucles de aprobación |
| Equipo junior o con curva de aprendizaje | equipo | Media | Medio | El equipo asignado tiene poca experiencia en el dominio o la tecnología del proyecto |
| Tecnología nueva para el equipo | técnico | Media | Alto | Se usa un stack, framework o proveedor cloud sin experiencia previa consolidada |
| Muchas dependencias externas | dependencias | Alta | Alto | El proyecto depende de sistemas/equipos que no controla el equipo de entrega |
| Alcance mal definido o cambiante | alcance | Alta | Alto | Ausencia de límites claros de in-scope/out-scope, favorece el scope creep |
| Estimación de plazos optimista sin colchón | plazos | Media | Alto | Fechas comprometidas antes de validar capacidad real del equipo |
| Rotación de personal clave (cliente o proveedor) | equipo | Baja | Alto | Salida de una persona con conocimiento crítico no documentado |
| Infraestructura o entornos no disponibles a tiempo | logístico | Media | Medio | Accesos, licencias o entornos cloud tardan en aprovisionarse |
| Requisitos de seguridad/compliance no identificados a tiempo | seguridad | Media | Muy Alto | Aparecen exigencias legales (RGPD, LOPIVI, sectoriales) a mitad de proyecto |
| Penalizaciones contractuales por incumplimiento de plazo | penalizaciones | Baja | Muy Alto | El contrato incluye SLA o penalizaciones económicas por retraso |
| Baja adopción por parte de usuarios finales | adopción | Media | Medio | El sistema se entrega pero los usuarios no lo usan o se resisten al cambio |
| Comunicación fragmentada con el cliente | cliente | Media | Medio | Varios interlocutores dan indicaciones contradictorias sin un canal único |
| Deuda técnica heredada (proyectos con legacy) | técnico | Alta | Medio | El sistema existente impone restricciones no documentadas que aparecen tarde |
| Coste real superior al presupuestado | costes | Media | Alto | Las estimaciones iniciales no contemplan retrabajo, integración o soporte |
| Terceros (proveedores externos) con SLA no vinculante | terceros | Media | Medio | Un proveedor externo (API, plataforma, integrador) no tiene compromiso contractual con el proyecto |
| Falta de proceso de gestión de cambio | alcance | Alta | Medio | Cualquier petición nueva del cliente se absorbe sin evaluar impacto en coste/plazo |

Instrucciones sobre este catálogo:
- El PM marca con una columna "¿Aplica?" (Sí/No/Vigilar) cuáles de estos son relevantes para el proyecto concreto.
- Añade al final del catálogo los riesgos específicos del proyecto que no encajen en la lista genérica (p.ej. "El cliente opera bajo normativa autonómica X no estandarizada").
- Este archivo se reutiliza entre proyectos: si ya existe uno previo (de otro proyecto o de una plantilla global), parte de él y solo añade/ajusta, no lo reescribas desde cero.

### b) Zonas de incertidumbre y RNF críticos → riesgos

Recorre `zonas-incertidumbre.md` (Paso 0) uno a uno. Para cada zona de incertidumbre pregúntate: *si esto no se resuelve antes de que sea necesario, ¿qué pasa?* Esa respuesta es la Consecuencia del riesgo.

Recorre también `requisitos-nofuncionales.md` y marca los RNF críticos (rendimiento bajo carga, seguridad, disponibilidad, compliance, escalabilidad). Para cada uno: ¿qué riesgo existe si el equipo no lo cumple o lo descubre tarde?

No conviertas automáticamente 1 zona de incertidumbre = 1 riesgo si varias zonas apuntan a la misma causa raíz: consolídalas en un único riesgo y cita todas las zonas de origen en "Relacionado con" o en la descripción.

### c) Check Init → riesgos y acciones (consolidación)

Si ya ejecutaste `ejecutar-check-init.md`, trae aquí los riesgos y acciones que ese ejercicio propuso para los puntos 🔴 (y los 🟡 relevantes) y dales de alta formalmente con su ID en `registro-riesgos.md` / `registro-acciones.md`. No los reinventes: usa la descripción propuesta en `check-init.md` como base, refinándola si hace falta.

### d) Dependencias externas explícitas

Recorre los requisitos funcionales y no funcionales buscando menciones explícitas o implícitas a:
- Sistemas de terceros (APIs externas, pasarelas de pago, proveedores SaaS)
- Equipos externos al equipo de entrega (otro departamento del cliente, otra consultora, un equipo de infraestructura)
- Aprobaciones formales requeridas (legal, seguridad, compliance, comité de arquitectura)
- Infraestructura o entornos que no gestiona el equipo (cloud del cliente, VPN corporativa, credenciales de terceros)

Cada una de estas es candidata a dependencia (`DP-XXX`). Para cada dependencia identifica también si genera un riesgo asociado (normalmente sí: toda dependencia no resuelta a tiempo es un riesgo de plazo o de alcance).

### e) Completar cada riesgo

Para cada riesgo identificado en (b) y (c), completa todos los campos:
- **Tipo**: uno de alcance / cliente / equipo / plazos / logístico / técnico / seguridad-legal / penalizaciones / terceros / adopción / costes / dependencias
- **Probabilidad** e **Impacto**: usa el catálogo canónico; justifica la elección en una frase si no es evidente
- **Peso**: `Probabilidad × Impacto × Multiplicador_Proyecto`
- **RAG**: aplicar el corte Verde/Amarillo/Rojo según el peso calculado
- **Ámbito**: Interno (el equipo de entrega puede actuar sin depender de terceros) / Externo (requiere acción de fuera del equipo)
- **Respuesta**: Evitarlo (cambiar el plan para que el riesgo no pueda ocurrir) / Reducirlo (bajar probabilidad o impacto) / Aceptarlo (sin acción, monitorizar) / Transferirlo (mover la responsabilidad a un tercero, seguro, contrato)
- **Objetivos afectados** (Coste/Alcance/Plazo/Calidad): marca los que apliquen, puede ser más de uno
- **Mitigación**: descripción del plan, vinculada obligatoriamente a al menos una Acción `A-XXX` si la Respuesta es Evitarlo o Reducirlo (si es Aceptarlo, puede no llevar acción; si es Transferirlo, la acción típica es formalizar el contrato/seguro/cláusula)
- **Responsable**: rol o persona que gestiona el riesgo (no necesariamente quien ejecuta la mitigación)
- **Relacionado con**: IDs de dependencias, acciones o cambios de alcance vinculados

No dejes ningún riesgo en Rojo sin al menos una Acción de mitigación propuesta. Es aceptable que un riesgo en Verde no tenga acción (Respuesta = Aceptarlo) si el impacto de gestionarlo activamente sería desproporcionado.

### f) Completar cada dependencia

Toda dependencia dada de alta aquí (`DP-XXX`) es, por definición, **externa** al equipo de entrega — requiere que el PM/ADL negocie, pida o reclame algo a alguien fuera del equipo (cliente, otro equipo, seguridad, infraestructura). Esto es distinto de una dependencia técnica entre dos historias del propio equipo (ej. "HU-024 depende de HU-023"), que **no** se registra aquí — esa vive directamente en el campo `Dependencias` de cada HU (`generar-backlog-detalle.md`, Paso 3) y el equipo se autogestiona sin ninguna tarea de Jira ni alta en este registro.

Para cada dependencia:
- **Criticidad RAG**: usa el mismo criterio de semáforo, evaluando cualitativamente cuánto bloquea el proyecto si no se resuelve a tiempo (Rojo = bloquea entregas si no se resuelve pronto; Amarillo = afecta pero hay margen; Verde = deseable pero no bloqueante)
- **Sistemas implicados**: si hay sistemas concretos (Azure, VPN, un API de terceros...), menciónalos dentro del propio texto de "Dependencia" — no tienen columna propia
- **Estado inicial**: siempre "Detectada" al darla de alta en este paso
- **Fecha de compromiso**: si se conoce; si no, márcala como pendiente de negociar
- **Riesgos asociados**: ID del riesgo (`R-XXX`) que esa dependencia genera si no se resuelve
- **Tarea de gestión (Jira)**: si en este momento ya hay conexión con Jira disponible (poco habitual en este punto del pipeline, normalmente antes del Paso 2), crea directamente una tarea en el backlog con prefijo `[GESTIÓN]` (tipo Tarea) describiendo la acción concreta de gestión (a quién contactar, qué negociar/pedir/reclamar, y la fecha de compromiso si se conoce), mencionando esta `DP-XXX` en el texto — sin enlace nativo ni línea "Bloquea" todavía, porque en este paso aún no existe ninguna HU con la que enlazarla (el enlace "Blocks", Principio 12, se crea en Paso 3 en cuanto exista la HU real a la que bloquea). Si no hay Jira conectado todavía, deja `— (pendiente, sin Jira conectado)`: la creará más adelante `prompts/paso-3/generar-backlog-detalle.md`/`subir-historias-a-jira.md`, en cuanto una HU concreta quede `❌ No Ready` por esta dependencia.

### g) Generar `riesgos-stakeholders.md`

A partir de `registro-riesgos.md`, genera una vista simplificada para presentar a cliente/stakeholders:
- Sin pesos ni fórmulas ni multiplicador de proyecto
- Solo: ID, descripción en lenguaje llano (sin jerga de gestión de riesgos), nivel de atención (usa el RAG pero exprésalo como "Bajo control" 🟢 / "En seguimiento" 🟡 / "Requiere atención" 🔴 en vez de los términos internos), y mitigación explicada de forma clara y orientada a la acción ("Vamos a...", "Hemos previsto...")
- Omite riesgos internos de bajo interés para el cliente si su exposición no aporta valor a la conversación (criterio del PM), pero nunca omitas los que están en Rojo

### h) Validar con el usuario antes de cerrar

Antes de dar el paso por terminado, muestra al PM un resumen:
- Total de riesgos por RAG (X en Rojo, Y en Amarillo, Z en Verde)
- Total de dependencias, cuántas críticas (Rojo)
- Total de acciones generadas y cuántas sin responsable/deadline asignado todavía
- Pregunta explícitamente si hay riesgos o dependencias que el PM conoce y que no se han capturado (su conocimiento tácito del cliente/equipo es la fuente más fiable, más que cualquier inferencia del documento)

No cierres el paso ni actualices `documentacion-proyecto.md` hasta tener la confirmación del PM.

## Formatos de salida

### `registro-riesgos.md`

| ID | Fecha alta | Riesgo | Consecuencia | Tipo | Probabilidad | Impacto | Ámbito | Respuesta | Estado | Coste | Alcance | Plazo | Calidad | Mitigación | Responsable | Peso | RAG | Consideraciones | Relacionado con | Fecha update |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | | | | | | | | | Abierto | | | | | | | | | | | |

### `registro-dependencias.md`

| ID | Equipo | Dependencia | Criticidad RAG | Estado | Fecha compromiso | Riesgos asociados | Tarea de gestión (Jira) | Comentarios |
|---|---|---|---|---|---|---|---|---|
| DP-001 | | | | Detectada | | | — (pendiente, sin Jira conectado) | |

### `registro-acciones.md`

| ID | Acción | Tipo | Riesgo asociado | Dependencia asociada | Responsable | Deadline | Estado |
|---|---|---|---|---|---|---|---|
| A-001 | | Preventiva/Correctiva/Mitigación/Contingencia | R-XXX | DP-XXX (opcional) | | | Pendiente |

### `riesgos-stakeholders.md`

| ID | Riesgo (lenguaje claro) | Nivel de atención | Qué estamos haciendo |
|---|---|---|---|
| R-001 | | 🟢/🟡/🔴 | |

### `info-riesgos.md`

Tabla del catálogo de 15+ riesgos comunes descrita en el paso (a), con columna "¿Aplica a este proyecto?" añadida y sección final de riesgos específicos del proyecto.

## Rutas de guardado

Todos los artefactos de este prompt se guardan en `investigar/[proyecto]/output-paso-1/`:
- `info-riesgos.md`
- `registro-riesgos.md`
- `riesgos-stakeholders.md`
- `registro-dependencias.md`
- `registro-acciones.md`

Al confirmar el PM el resumen del punto (h), actualiza además `investigar/[proyecto]/documentacion-proyecto.md`: la tabla de riesgos principales con RAG, las dependencias críticas con estado, y las acciones en curso, según indica `diseno/paso-1-framework-gee/README.md`.

## Input del usuario

[El usuario adjunta o referencia: `requisitos-funcionales.md`, `requisitos-nofuncionales.md`, `zonas-incertidumbre.md` (Paso 0), `check-init.md` (este mismo paso), y si existe, `mapa-proyecto.md` / `guia-paso-0.md` del análisis legacy. Si es la primera vez que se ejecuta este prompt en la organización, no hay `info-riesgos.md` previo: se crea desde cero con el catálogo de 15+ riesgos comunes]

## Output esperado

Los cinco artefactos listados arriba, completos y con IDs correlativos, en `investigar/[proyecto]/output-paso-1/`, más la actualización de `documentacion-proyecto.md` tras la validación del PM.
