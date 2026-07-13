# Mejoras pendientes del skill PM Copilot

Backlog de mejoras al propio skill (no del proyecto que estés gestionando con él). Vive dentro del skill para que aplique a todos los proyectos que lo usen, no a uno solo.

Este archivo se actualiza durante el uso normal del skill — no hace falta una sesión dedicada a "auditar el sistema". Cuando detectes una señal de mejora, añade una fila aquí y sigue trabajando; no interrumpas el paso en curso para implementarla salvo que sea trivial.

## Cuándo añadir una entrada

- Un prompt te dejó ambigüedad real que tuviste que resolver por tu cuenta (documenta cómo la resolviste, para que se pueda decidir si esa solución se incorpora al prompt).
- El usuario corrigió algo no trivial sobre cómo debería comportarse el skill (no algo específico de su proyecto).
- Un paso pidió información que en la práctica nunca estuvo disponible, o al revés, generó un artefacto que nadie usó después.
- Detectaste un hueco: algo que el pipeline debería cubrir y no cubre.
- Una plantilla no encajó con el tipo de proyecto real y tuviste que improvisar el formato.

No documentes aquí decisiones específicas de un proyecto concreto (eso va en `lecciones-sprint-X.md` del propio proyecto, generado por `prompts/paso-3/retrospectiva.md`) — solo lo que es una mejora al *sistema*, aplicable a cualquier proyecto futuro.

## Formato de entrada

```
### [AAAA-MM-DD] Título corto de la mejora

- **Origen:** qué paso/prompt la motivó, y en qué proyecto se detectó (sin datos sensibles del cliente)
- **Propuesta:** qué cambiar concretamente (prompt, template, o el propio SKILL.md)
- **Prioridad:** Alta / Media / Baja
- **Esfuerzo estimado:** Bajo / Medio / Alto
- **Estado:** 🔲 Pendiente / 🟡 En curso / ✅ Implementada (con fecha)
```

## Cómo se implementan

Al arrancar una sesión de este skill (o cuando el usuario lo pida explícitamente, p.ej. "revisa las mejoras pendientes del skill"), revisa este archivo:

1. Si hay entradas con Prioridad Alta y Esfuerzo Bajo/Medio marcadas 🔲 Pendiente, ofrécete proactivamente a implementarlas antes de continuar con el trabajo del proyecto (una frase, no un bloqueo — el usuario decide si ahora o después).
2. Al implementar una, edita el prompt/template/`SKILL.md` correspondiente y marca la entrada como ✅ Implementada con la fecha. No borres entradas implementadas — quedan como historial de por qué el skill es como es.
3. Si una mejora resulta inviable o se descarta tras evaluarla, no la borres: cámbiale el estado a "❌ Descartada" y añade el motivo, para no re-proponerla en el futuro.

## Entradas

### [2026-07-06] Escritura de HU de sprint no bloqueadas (dashboard)

- **Origen:** `dashboard/server.js`, endpoint `PUT /api/sprint/hu/:id`
- **Propuesta:** el endpoint aplica correctamente el bloqueo 423 para HU en sprint activo, pero para HU no bloqueadas no hay writer de `sprint-backlog-{N}.md` implementado (responde 501). Si en la práctica hace falta editar HU de sprints futuros desde el dashboard (no solo desde `sprint-planning.md`), implementar `dashboard/lib/writers/sprintBacklog.js` siguiendo el mismo patrón que los writers de GEE.
- **Prioridad:** Media
- **Esfuerzo estimado:** Medio
- **Estado:** 🔲 Pendiente

### [2026-07-06] Parsers del dashboard con fragilidad conocida en formatos no tabulares

- **Origen:** `dashboard/README.md` (sección "Limitaciones conocidas"), construido durante la primera versión del dashboard de reporting
- **Propuesta:** revisar contra datos reales (no solo las plantillas de ejemplo) los parsers de: `roadmapCliente.js` (tabla de hitos de 2 columnas sin cabecera real), `capacidad.js` (secciones 2-3 en texto libre `- Campo: valor`), `epicas.js` y `backlogDetalle.js` (sin formato de archivo fijo, solo descrito en prompts). Ninguno rompe el dashboard si falla — el campo queda vacío o en `raw` — pero pueden perder datos silenciosamente si el formato real generado se desvía de lo soportado.
- **Prioridad:** Media
- **Esfuerzo estimado:** Bajo (por parser, cuando se detecte un caso real que falle)
- **Estado:** 🔲 Pendiente

### [2026-07-06] Bugs de integración backend/frontend corregidos en la verificación inicial

- **Origen:** prueba end-to-end del dashboard con un proyecto de ejemplo real (no solo revisión de código)
- **Propuesta (ya aplicada):** se encontraron y corrigieron 4 bugs reales antes de dar el dashboard por bueno: (1) `capacidadDisponible`/`capacidadOcupada` llegan como texto con unidades embebidas ("30 pts (según...)"), no como número puro — `Number()` los convertía en `NaN`; (2) el campo de HU en `sprint.sprints[].hu[]` se llama `hu`, no `id`; (3) los `<select>` de RAG/Criticidad perdían el emoji y podían sobrescribir el valor real con la primera opción si el texto guardado no coincidía carácter a carácter con la opción; (4) el renderer de "Capacidad actual" mostraba `[object Object]` para campos que son arrays/objetos anidados (miembros, composición técnica, velocidad). Deja constancia aquí de que este tipo de bug (contratos JSON que "encajan sobre el papel" pero fallan con datos reales con formato de texto libre) es el riesgo principal de este dashboard — cualquier prompt nuevo que cambie el formato de un artefacto debe probarse contra el dashboard, no asumir que el parser lo absorbe.
- **Prioridad:** Alta (ya resuelto, se documenta como recordatorio del patrón de fallo)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-06)

### [2026-07-06] Dashboard pasa de instancia compartida a instalación por proyecto

- **Origen:** decisión explícita del usuario — quería proyectos independientes y totalmente portables (llevarse la carpeta del proyecto a otro PC con Claude Code + skill instalados y seguir trabajando igual).
- **Propuesta (ya aplicada):** `dashboard/instalar-en-proyecto.js` copia el motor completo (sin `node_modules`) a `investigar/[proyecto]/dashboard/` y genera `iniciar-dashboard.bat`/`.ps1` (arranque de un clic: instala dependencias si faltan, arranca el servidor, abre el navegador). El servidor elige puerto determinista por proyecto con salto automático si hay colisión, para poder tener varios proyectos abiertos a la vez. El mismo script sirve para "actualizar el motor" de un proyecto ya instalado (idempotente, no toca `node_modules/`, `.port` ni la caché). Verificado de extremo a extremo: instalación limpia, arranque real vía el `.ps1` generado (no invocando `node server.js` a mano), puerto determinista confirmado estable entre reinicios.
- **Prioridad:** Alta (ya resuelto)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-06)

### [2026-07-06] Pestaña Requisitos (Paso -1 + Paso 0) y documentos de cierre

- **Origen:** decisión explícita del usuario tras discutir alternativas (Jira con token en local, conector Drive/red, grafo/vectorial) — se descartaron esas tres y se priorizó esto por ser barato y de alto valor con la arquitectura ya construida.
- **Propuesta (ya aplicada):** pestaña "Requisitos" de solo lectura en el dashboard (resumen legacy + RF/RNF/zonas de incertidumbre de Paso 0), integrada en el informe PDF completo (`printView.js`). Además, `prompts/transversal/generar-documento-cierre-fase0.md` redacta un documento oficial para firma del cliente (distinto del volcado mecánico del dashboard), exportable a PDF vía el nuevo endpoint genérico `POST /api/pdf/documento` (imprime cualquier `.md` suelto del proyecto, con validación anti path-traversal). Verificado de extremo a extremo con datos reales, incluida la generación del PDF con ambas secciones nuevas y el rechazo de rutas maliciosas.
- **Prioridad:** Alta (ya resuelto)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-06)

### [2026-07-07] generar-backlog-detalle.md genera HU "de producto puro" cuando el equipo real trabaja a nivel de spec técnica

- **Origen:** Proyecto Eductrade/Polar (EP-003 Super-Admin). Se generaron y crearon en Jira 3 HU con el formato estándar del skill (Como/quiero/para + Gherkin agnóstico de implementación). El equipo técnico ya tenía 8 HU propias en la misma épica, escritas a un nivel muy distinto: nombres de tabla/RLS/Edge Function reales, sección "Aclaración de términos" (mapeo negocio↔BD), "Criterios de Aceptación Sugeridos por IA" marcados y separados de los del humano con prefijo `[IA]`, exclusiones de alcance dentro del propio escenario afectado, trazabilidad cruzada por clave de Jira real (no solo IDs internos tipo RF-XXX), y una HU por dominio de dato concreto (no agrupaciones genéricas). El equipo corrigió/partió las HU generadas en cuanto las vio (una la reescribió a placeholder `[CORREGIR]`, otra la partió en dos). Análisis completo en `investigar/eductrade-polar/output-paso-2/analisis-hu-epica3.md`.
- **Propuesta:** antes de generar HU nuevas para una épica con conexión a Jira activa, `generar-backlog-detalle.md` debería primero leer las HU ya existentes de esa épica (si las hay) y usarlas como plantilla de estilo/nivel de detalle en vez de aplicar ciegamente el formato genérico Como/quiero/para+Gherkin del skill. Concretamente: (1) detectar si el equipo ya usa un nivel de detalle técnico (nombres de tabla, RLS, componentes UI) y replicarlo si es así; (2) adoptar la convención de marcar escenarios inferidos por IA con un prefijo separado (`[IA]`) en vez de mezclarlos con los del humano — esto es coherente con el principio ya aplicado a RNF implícitos en el Paso 0, debería generalizarse a cualquier contenido generado por el skill que mezcle inferencia propia con confirmación humana.
- **Corrección tras probar la solución (2026-07-07):** sobre el punto (3) original (adoptar `US-XXX` del equipo) — el usuario pidió explícitamente lo contrario: **mantener `HU-XXX` para las HU generadas por el skill**, precisamente para poder distinguir a simple vista lo generado por IA de lo creado por el equipo (`US-XXX`) dentro del mismo backlog de Jira. No unificar nomenclatura salvo que el usuario lo pida — la diferenciación visual es una función deseada, no un defecto a corregir.
- **Hallazgo adicional (2026-07-07):** al regenerar, aparecieron dos problemas más del mismo origen (no leer el contexto real antes de generar): (a) **volumen insuficiente** — 3 HU generadas para EP-003 frente a las 8 reales que ya tenía el equipo para la misma épica; sin poder medir la complejidad real de una épica (por no leer el código/backlog existente), el skill tiende a infra-descomponer. (b) **fronteras de épica asumidas sin contrastar** — varias HU generadas para EP-004 (Gestor) resultaron solapar con historias ya existentes en EP-003 (SuperAdmin) sobre el mismo dato (ej. edición de metadatos de centro), porque la división de épicas se hizo desde `epicas.md` (Paso 2.1, sin contexto de Jira) sin verificar contra el backlog real. La mitigación aplicada aquí fue señalar el solape explícitamente en la propia HU ("Posible solape a resolver antes de desarrollar") en vez de asumir una respuesta — razonable como parche puntual, pero `generar-epicas.md` debería, cuando hay Jira conectado, contrastar sus fronteras de épica contra épicas ya existentes antes de darlas por buenas.
- **Prioridad:** Alta
- **Esfuerzo estimado:** Medio
- **Estado:** ✅ Implementada (2026-07-09) — se añadió un "Paso 0" explícito en `generar-backlog-detalle.md` y `generar-historias-modo-paradigma.md`: mirar el estilo de HU ya existentes del equipo en Jira antes de generar, prefijo `[IA]` para contenido inferido, no infra-descomponer, y contrastar límites de épica contra el backlog real antes de darlos por buenos. `HU-XXX` se mantiene tal cual (confirmado, no era un defecto).

### [2026-07-09] Rediseño del pipeline: Paso 3 pasa a ser "Generación y validación de HU" con bifurcación Paradigma/Autónomo

- **Origen:** decisión explícita del usuario. El Paso 2 ahora termina en los roadmaps + crear épicas en Jira (sin backlog-detalle ni HU). El antiguo Paso 3 (gestión de sprints) se renumeró a Paso 4; sprint-review/retrospectiva se movieron a un Paso 5 explícitamente aparcado hasta que el Paso 4 esté consolidado con uso real.
- **Por qué la bifurcación:** el usuario quiere poder usar este skill tanto en proyectos internos de Paradigma (con Drive + Infinia, un agente de empresa con memory bank propio) como en proyectos de cliente que solo tienen Jira. `config/modo-trabajo.md` se decide una vez en el bootstrap y determina qué generador de HU se usa (`prompts/transversal/generar-historias-modo-paradigma.md` vs `prompts/paso-3/generar-backlog-detalle.md`), pero ambos producen el mismo formato exacto, así que `subir-historias-a-jira.md` y `validar-backlog-jira.md` son agnósticos al modo. Por el mismo motivo, `evaluacion-dor.md` y `sprint-planning.md` (Paso 4) **no se retiraron** — son el fallback de Modo Autónomo para cuando no hay agentes de empresa que hagan sprint planning por su cuenta.
- **Validación empírica del formato de HU:** se hicieron 4 rondas de pruebas reales contra Infinia (no un diseño teórico) antes de fijar el contrato: (1) diagnóstico inicial con una épica de ejemplo — pidió contexto de negocio, RNF, contexto técnico/stack y el DoR citando `evaluacion-dor.md` por su nombre; (2) tras pedir explícitamente `HU-XXX` (no `US-XXX`), campo `Épica:` propio, `Prioridad`, `Estimación sugerida` y Cumplimiento DoR con Verdict — lo cumplió al 100%; (3) prueba de volumen (2→4 historias) con framing explícito de "esto es documentación permanente, no una respuesta de chat" — la profundidad no bajó, si acaso mejoró (rate limiting, hashing, vistas materializadas aparecieron sin pedirlos); (4) bucle de feedback sobre una sola historia — acotó el cambio correctamente sin tocar las demás, se auto-versionó (`v1.1`) sin que se le pidiera, y devolvió un resumen de cambios por sección exactamente en el formato que necesitábamos para no obligar a re-revisar todo. **Hallazgo de fragilidad:** en un caso, Infinia reportó como "vacío" un archivo (`dor-definition.md`) que se comprobó directamente y tenía contenido correcto — un falso negativo de lectura puntual, no un problema del archivo. El formato de salida también varió de forma menor entre rondas (encabezados, viñetas vs. checkboxes, texto plano vs. checklist) — confirma que cualquier parser de `historias-generadas-*.md` debe ser tolerante a formato, no exigir coincidencia exacta.
- **Prioridad:** Alta (pipeline y prompts ya reescritos)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-09) — pendiente de uso real para seguir afinando (ver entradas siguientes)

### [2026-07-09] Dashboard: parser de HU y pestaña de backlog desactualizados tras el rediseño de Paso 3

- **Origen:** el rediseño de Paso 3 cambió `output-paso-2/backlog-detalle.md` (formato de tiers Inmediata/Cercana/Lejana simple) por `output-paso-3/historias-generadas-{fecha}.md` (formato validado con Infinia: HU-XXX, Épica, Prioridad, Estimación, Gherkin, Cumplimiento DoR con Verdict). `dashboard/lib/parsers/backlogDetalle.js` sigue leyendo la ruta y formato antiguos — no rompe nada (devuelve vacío si no encuentra el archivo), pero ya no refleja las historias reales del proyecto.
- **Propuesta:** escribir un parser nuevo para `output-paso-3/historias-generadas-*.md` (tolerante a las variaciones de formato observadas empíricamente con Infinia — ver entrada anterior), añadir una pestaña "Backlog" al dashboard mostrando HU con su Verdict DoR, versión (si viene de una regeneración), y estado de validación: y mostrar en esa misma pestaña `config/historial-prioridad-backlog.md` para visibilidad de cómo ha evolucionado la prioridad.
- **Prioridad:** Alta
- **Esfuerzo estimado:** Medio
- **Estado:** 🔲 Pendiente

### [2026-07-09] Renombrado de carpetas del dashboard: output-paso-3 → output-paso-4 para sprint/daily/análisis-Jira

- **Origen:** el rediseño de pipeline liberó el nombre "Paso 3" para la generación de HU, desplazando la antigua gestión de sprints a Paso 4. Se corrigieron las rutas hardcodeadas en `dashboard/lib/parsers/sprintBacklog.js`, `analisisJira.js`, `dailylog.js` (que además tenía un bug preexistente: buscaba en `investigar/[proyecto]/dailylog/` en la raíz en vez de dentro de la carpeta del paso) y `dashboard/lib/writers/jiraSnapshotWriter.js`.
- **Propuesta (ya aplicada):** renombrado completo. Verificado con un proyecto de fixture (`sprint-backlog-1.md` + `dailylog/2026-07-08.md` dentro de `output-paso-4/`): `buildSnapshot` encuentra el sprint, lo marca activo correctamente, y encuentra el daily log — confirma que el bug preexistente de `dailylog.js` (buscaba en la raíz del proyecto) quedó corregido junto con el renombrado.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-09)

### [2026-07-09] Pendiente: pestaña de capacidad por disciplina + aprendizaje de planning real

- **Origen:** requisito explícito del usuario para el nuevo Paso 3/4: capacidad desglosada por disciplina (front/back/diseño/QA...) teniendo en cuenta personas × dedicación % × disponibilidad real *de ese sprint concreto* (no solo el global del proyecto), más recomendaciones basadas en histórico de estimado-vs-real de Jira para asesorar al ADL durante la planning.
- **Propuesta:** requiere (a) extender `procesar-capacidad.md` o crear un prompt hermano para el desglose por disciplina y por sprint (hoy `capacidad-equipo/actual.md` es un cálculo único agregado), (b) un mecanismo de "similitud" entre historias para poder comparar estimado-vs-real de casos parecidos (sin definir todavía: ¿por etiqueta/componente de Jira, por texto, manual? — el usuario lo dejó explícitamente para decidir más adelante), (c) la pestaña nueva en el dashboard, (d) un prompt ligero para capturar al inicio del Paso 4 lo que salió de la planning real y alimentar `config/historial-prioridad-backlog.md` o un archivo hermano de aprendizaje de capacidad.
- **Prioridad:** Media (valioso pero no bloquea el resto del pipeline)
- **Esfuerzo estimado:** Alto
- **Estado:** 🔲 Pendiente

### [2026-07-09] Paso 3 ampliado con sub-paso 4 (crear sprints con Sprint Goal propuesto) y convención `[PROP]`

- **Origen:** decisión explícita del usuario. Tras validar todo el backlog, hacía falta un paso explícito para crear los sprints en Jira con fechas (del roadmap) y un Sprint Goal propuesto, marcado de forma que un humano esté obligado a tocarlo antes de aceptarlo — de ahí el prefijo `[PROP]`.
- **Propuesta (ya aplicada):** `prompts/paso-3/crear-sprints-jira.md` (nuevo). La convención `[PROP]` se documentó como general pero **de aplicación por defecto solo al Sprint Goal** — para otras cosas (historias, épicas) solo se aplica si el PM lo pide explícitamente en conversación, y en ese caso el skill debe preguntar primero si quiere el prefijo antes de aplicarlo. También se aclaró que el skill (ejecutado por Claude en una sesión con el conector de Jira habilitado) no necesita ninguna configuración de conexión propia — eso solo aplica al dashboard, que corre como proceso aparte y no puede usar el conector de la sesión. Se documentó además el fallback: si el dashboard no tiene conexión propia, el skill puede volcar una foto local (`analisis-jira-*.md`, `sprints-propuestos.md`, `jira-mapeo.md`) para que el dashboard la lea igualmente, aunque no en vivo.
- **Sin verificar:** no está confirmado que el conector de Jira/Atlassian disponible soporte crear/editar objetos Sprint (fechas, goal) directamente — sus herramientas parecen cubrir issues, no el API Agile/Software de Jira donde viven los Sprints. Si no lo soporta, `crear-sprints-jira.md` ya contempla el fallback (el PM crea el sprint vacío, el skill solo pone fecha/goal), pero hay que probarlo contra una instancia real para confirmarlo.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A (implementado) / Bajo (verificar el punto anterior)
- **Estado:** ✅ Implementada (2026-07-09), pendiente de verificación contra Jira real

### [2026-07-09] Nuevo: revisar-documentos-proyecto.md — intake continuo de documentación durante el proyecto

- **Origen:** decisión explícita del usuario. El Paso Legacy solo cubre una foto única al arrancar; hacía falta un mecanismo para documentación que aparece durante el proyecto (cliente, equipo, otros roles), nueva o antigua pero descubierta tarde.
- **Propuesta (ya aplicada):** `prompts/transversal/revisar-documentos-proyecto.md` (nuevo), con su propio inventario acumulativo `inventario-documentos-proyecto.md` (IDs `FD-XXX`, separado de `F-XXX` del Paso Legacy). Solo se ejecuta cuando el PM lo pide explícitamente (no automático al arrancar sesión). Detecta solo lo nuevo/cambiado (compara contra "Última revisión" registrada, no relee todo cada vez), analiza impacto sobre lo ya cerrado, y siempre pide autorización explícita por documento antes de incorporar nada — lo aplazado queda registrado y se vuelve a presentar en la siguiente revisión, nunca se pierde silenciosamente.
- **Sin verificar:** no se ha probado todavía con un caso real (documento que efectivamente contradiga o amplíe algo ya cerrado) — la primera vez que se use, confirmar que la detección de "cambiado vs. sin cambios" por fecha de modificación funciona bien en la práctica, y que el enganche con `actualizar-cascada.md` no deja huecos.
- **Prioridad:** Media
- **Esfuerzo estimado:** N/A (implementado) / Bajo (verificar con un caso real)
- **Estado:** ✅ Implementada (2026-07-09), pendiente de verificación con uso real

### [2026-07-09] Infinia cita issues de Jira concretos que no existen o no dicen lo que afirma (primera prueba real de `generar-historias-modo-paradigma.md`)

- **Origen:** Primera ejecución real del traspaso a Infinia (proyecto Eductrade/Polar, EP-004). Se le pidió explícitamente comprobar solapes contra el backlog real de Jira antes de generar. Infinia detectó correctamente que la nueva HU-015 (branding/logo/color del centro por el Gestor) solapaba con trabajo ya existente — pero citó la clave equivocada ("US-007 de EP-003"). Verificado contra Jira: `US-007` (`UPEVUOWVWK-12`) es una historia real pero sobre recuperación de contraseña, no tiene nada que ver y no pertenece a EP-003. El solape real sí existía, en `UPEVUOWVWK-47` ("Ficha de centro · pestaña Apariencia", subtarea de US-010/EP-003) — Infinia tenía el instinto correcto pero la cita concreta era una alucinación. Además, HU-017 introdujo un concepto ("catálogo global de cursos y asignaturas gestionado por SuperAdmin") que no estaba en ninguno de los 5 documentos que se le pasaron ni en los RF de la épica (RF-014/RF-019), sin marcarlo `[IA]` a nivel de historia completa — puede ser información real de otras partes del Memory Bank a las que Infinia sí tiene acceso, o puede ser invención; no es distinguible desde fuera.
- **Propuesta:** `validar-backlog-jira.md` (o el propio `generar-historias-modo-paradigma.md`, paso 4) debe añadir una comprobación explícita: toda cita a un issue de Jira concreto (US-XXX, HU-XXX, clave) que aparezca en una historia generada por Infinia debe verificarse contra Jira real (buscar la clave, confirmar que el resumen/contenido coincide con lo que Infinia afirma) antes de dar la historia por válida — no basta con que Infinia diga que "ya comprobó el backlog". Un solape correctamente detectado con una cita incorrecta es peor que no detectarlo, porque parece validado cuando no lo está. También: cuando una historia introduce alcance/conceptos no presentes en los documentos de entrada ni en los RF de la épica, marcarlo como punto a confirmar explícitamente con Infinia (¿de dónde sale esto?) antes de aceptarlo, en vez de asumir que es la extensión de contexto legítima del Memory Bank.
- **Prioridad:** Alta
- **Esfuerzo estimado:** Bajo
- **Estado:** 🔲 Pendiente

### [2026-07-09] Continuidad entre máquinas vía Drive — confirmado el mecanismo, limitación documentada

- **Origen:** pregunta explícita del usuario sobre poder continuar el mismo proyecto desde otra sesión de Claude en otro equipo.
- **Conclusión:** ya funciona sin construir nada nuevo, **siempre que** `investigar/[proyecto]/` viva dentro de una carpeta sincronizada con Drive Desktop (ya era la sugerencia de bootstrap en Modo Paradigma). La limitación documentada: el conector de Drive (crear/leer archivos) no tiene forma de sobrescribir un archivo existente, solo de crear nuevos — así que si no hay Drive Desktop sincronizando, el skill no puede "empujar" actualizaciones a una copia en Drive de forma fiable. No es una tarea pendiente de construir, es una limitación a comunicar al usuario.
- **Prioridad:** Baja (documentado, no bloquea nada)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Documentado (2026-07-09)

### [2026-07-09] Modo Paradigma (Infinia) revertido en uso real — Modo Autónomo pasa a ser el default recomendado

- **Origen:** feedback directo del usuario tras uso real prolongado. La calidad de las historias generadas vía Infinia (Modo Paradigma) resultó insuficiente para el equipo pese a las mejoras aplicadas anteriormente (formato validado, framing de "documento permanente", chequeo de estilo del equipo antes de generar) — el equipo terminó "harto" y pidió que el skill controlara el proceso directamente.
- **Propuesta (ya aplicada):** el bootstrap ya no sugiere Modo Paradigma como default — recomienda Modo Autónomo explícitamente, explicando el motivo. Modo Paradigma **no se ha eliminado** (sigue disponible si algún proyecto futuro lo pide explícitamente, por si con una integración de Infinia distinta o mejor tuneada da mejor resultado), pero deja de ser el camino sugerido. Se añadió también una capacidad que no existía: invocación explícita y selectiva de `generar-backlog-detalle.md` ("todas las HU" respetando franjas, o épicas concretas por nombre con detalle completo sin importar franja) — antes el prompt solo se disparaba de forma implícita ligado al roadmap, sin que el PM pudiera pedir explícitamente "ahora, estas épicas".
- **Reflexión para el futuro:** si en algún momento se quiere reintentar Modo Paradigma con un Infinia distinto o mejor configurado, revisar primero si las mejoras ya aplicadas (chequeo de estilo del equipo, `[IA]`, framing de documento permanente) se están usando de verdad en el prompt de traspaso antes de asumir que el problema es el modelo — no está descartado que parte del problema fuera de instrucción, no solo de capacidad del agente.
- **Prioridad:** Alta (ya aplicado)
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Implementada (2026-07-09)

### [2026-07-09] Pendiente: convención de wikilinks tipo grafo (Obsidian) en los IDs cruzados

- **Origen:** el usuario planteó si el skill debería mantener una base de datos vectorial y/o de grafo para el memory-bank de Infinia + documentación legacy + documentación generada durante el proyecto. Se descartó la base vectorial (volumen bajo, redundante con la memoria propia de Infinia, requiere infraestructura de embeddings que no existe) — ver análisis completo en la conversación, no repetido aquí. Pero se identificó una mejora barata: el sistema de IDs cruzados que ya existe (`R-XXX`, `EP-XXX`, `HU-XXX`, `FD-XXX`, `RF-XXX`...) es conceptualmente ya un grafo de referencias, solo que en texto plano.
- **Propuesta:** cambiar la convención de esos IDs a sintaxis wikilink `[[R-004]]` en vez de texto plano `R-004` en todos los prompts/templates que los generan. Así, si el usuario abre `investigar/[proyecto]/` como vault de Obsidian (herramienta gratuita, sin nada que instalar del lado del skill), obtiene visualización de grafo gratis, sin construir ninguna base de datos nueva.
- **Prioridad:** Baja
- **Esfuerzo estimado:** Medio (toca muchos archivos, aunque cada cambio es mecánico)
- **Estado:** 🔲 Pendiente

### [2026-07-09] Paso 5 (preparación de review + retrospectiva) sin diseñar

- **Origen:** decisión explícita del usuario de aparcarlo hasta que el Paso 4 esté consolidado con uso real.
- **Propuesta:** diseñar cuando llegue el momento — qué input toma del Paso 4 nuevo (dashboard, daily logs, análisis Jira acumulado), cómo se dispara (¿un recordatorio 1-2 días antes de la review, manual?), y si `prompts/paso-5/sprint-review.md`/`retrospectiva.md` (movidos tal cual desde el antiguo Paso 3, sin reescribir) necesitan actualizarse para el nuevo contexto.
- **Prioridad:** Baja (aparcado a propósito)
- **Esfuerzo estimado:** Medio
- **Estado:** 🔲 Pendiente

### [2026-07-09] subir-historias-a-jira.md no comprueba colisión de HU-XXX contra jira-mapeo.md antes de crear

- **Origen:** Proyecto Eductrade/Polar. Infinia generó HU-015 a HU-018 para EP-004 — esos mismos identificadores ya estaban en uso en `jira-mapeo.md` para HU de EP-003 y EP-006 (creadas el 2026-07-06). Se subieron a Jira sin comprobar la colisión, resultando en dos issues distintos reclamando ser "HU-015" (y lo mismo para 016/017/018). El usuario decidió resolverlo manualmente en vez de que se renombrara automáticamente.
- **Propuesta:** antes del paso 3 ("Crea en el backlog") de `subir-historias-a-jira.md`, comprobar cada identificador `HU-XXX` del archivo de historias contra las claves ya registradas en `config/jira-mapeo.md` (no solo contra la misma épica — el espacio de numeración `HU-XXX` es del proyecto entero, no por épica). Si hay colisión con una HU de **otra** épica, no crear el issue todavía: avisar al PM con el conflicto exacto (qué HU, qué claves de Jira ya la usan) y proponer la renumeración siguiente disponible, pero no aplicarla sin confirmación — igual que se hizo aquí. Esto también implica que `generar-historias-modo-paradigma.md` debería informar a Infinia (o comprobar el propio skill) del último número de HU en uso en todo el proyecto antes de pedir que numere una épica nueva, no solo pedirle que evite "US-XXX".
- **Prioridad:** Alta
- **Esfuerzo estimado:** Bajo
- **Estado:** 🔲 Pendiente

### [2026-07-09] Integración Jira en vivo del dashboard implementada (otra sesión) — resuelve la duda sobre soporte de Sprints, y descubre un desajuste de formato de config

- **Origen:** encontrado al preparar el push de este mismo lote de cambios — `dashboard/lib/jiraClient.js` (nuevo), y cambios coherentes en `server.js`, `buildSnapshot.js`, `app.js`, `jiraSnapshotWriter.js`, fechados 2026-07-07 (antes de esta sesión), muy probablemente aportados por la otra sesión de Claude Code trabajando sobre Eductrade (mismo directorio global del skill). No es trabajo mío de esta conversación, pero se revisó línea a línea antes de incluirlo en el commit.
- **Qué hace:** cliente Jira de solo lectura para el proceso del dashboard (Opción B de `conectar-jira.md`): lee `JIRA_EMAIL`/`JIRA_API_TOKEN` solo de variables de entorno del sistema (con fallback al registro de Windows por si el proceso arrancó antes de que se definieran), nunca de un archivo del proyecto — coherente con el principio de seguridad de este skill. Usa la API Agile de Jira (`/rest/agile/1.0/board/{boardId}/sprint`) para leer Sprints reales (fechas, goal, estado) y la API core (`/rest/api/3/search/jql`) para issues, con descubrimiento dinámico de IDs de campo personalizados. `buildSnapshot()` ahora acepta `{liveJira}` opcional: si se pasa, sustituye los sprints locales por los reales de Jira (fuente de verdad) y fusiona claveJira/estadoJira sobre las épicas narrativas locales sin descartar ninguno de los dos lados; sin `liveJira`, el comportamiento es idéntico al de antes. `server.js` degrada con gracia a datos locales si Jira no está configurado o la llamada falla, sin romper el dashboard.
- **Resuelve una duda pendiente:** la entrada anterior sobre `crear-sprints-jira.md` dudaba si el API de Jira expone objetos Sprint reales — confirmado que sí, vía el API Agile. Sigue sin verificar si el *conector MCP de la sesión* (el que usa el skill, no el dashboard) soporta crear/editar Sprints con la misma API — son conexiones independientes, ver `conectar-jira.md`.
- **Desajuste encontrado y corregido:** `jiraClient.js` exige `config/jira-project.json` (`{baseUrl, projectKey, boardId}`) para activar la sincronización, pero `conectar-jira.md` solo documentaba `config/jira-project.md` (Markdown, con mapeo de campos). Con eso, un usuario que siguiera las instrucciones del propio skill nunca generaría el `.json` que el dashboard necesita. Corregido en `conectar-jira.md`: se mantiene el `.md` como documentación de mapeo de campos, y se añade la instrucción explícita de escribir también el `.json` estricto cuando el PM vaya a usar la Opción B.
- **Sin verificar todavía:** no se ha probado el flujo completo (crear `jira-project.json` real + variables de entorno + pulsar "Actualizar" en el dashboard) contra una instancia real de Jira en esta conversación — la revisión fue de código, no end-to-end.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A (integración ya aplicada por la otra sesión, reconciliación de formato ya aplicada aquí) / Bajo (verificar end-to-end contra Jira real)
- **Estado:** ✅ Implementada (2026-07-07 la integración, 2026-07-09 la reconciliación de formato de config) — pendiente de verificación end-to-end

### [2026-07-10] Confirmado: la creación de épicas/historias vía el conector de sesión sí funciona contra Jira real — el problema siempre fue el contenido, no la conexión

- **Origen:** el usuario confirmó que una versión anterior del skill (antes de este rediseño) sí creó épicas e historias reales en un Jira real usando el conector MCP de la sesión, sin intervención en el token. No recuerda si esa versión llegó a crear objetos Sprint (fechas/goal) — ese punto sigue sin confirmar, es una operación distinta (API Agile de Sprints, no de issues).
- **Conclusión:** la parte "conexión y creación de issues" de `crear-en-jira.md`/`subir-historias-a-jira.md` deja de tratarse como no verificada — ya se demostró que funciona. Lo que ha estado cambiando entre versiones (skill directo → mimetizar a Infinia → skill directo de nuevo) es el **contenido** de las historias, no la mecánica de creación. `conectar-jira.md` se actualizó para reflejar esta distinción con precisión.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A
- **Estado:** ✅ Documentado (2026-07-10)

### [2026-07-10] Feedback real del equipo sobre el contenido de las HU — ajuste de tamaño y de nivel de detalle técnico en `generar-backlog-detalle.md`

- **Origen:** feedback explícito y consolidado del equipo, recogido tras varias rondas reales de generación de historias (primero el skill directo, después imitando el estilo de Infinia — ninguna de las dos convenció al equipo). El feedback no es específico de un proyecto, aplica al criterio de generación en general.
- **Lo que el equipo valora (mantener/reforzar):** una HU por flujo funcional completo end-to-end (no por micro-paso técnico); descripción completa sin huecos de interpretación; solapamientos y dependencias con otras HU siempre explícitos; todos los inputs que percibe el usuario con sus validaciones lógicas/de negocio detalladas; toda la lógica de negocio necesaria (mejor de más que de menos).
- **Lo que el equipo rechaza (corregir):** HU con un tamaño inconsistente — tanto demasiado atómicas (fragmentadas en pasos técnicos sueltos) como sobredimensionadas (varios flujos distintos mezclados en una); detalles técnicos de implementación sin contexto real que los respalde; que la HU defina tecnología, arquitectura, o decida el "cómo" implementar — eso no le corresponde a una HU generada sin acceso al código real del proyecto. Excepción reconocida por el propio equipo: si el skill tuviera acceso directo al repositorio, sí podría fundamentar sugerencias técnicas superficiales en lo que ya existe — hoy esa capacidad no existe, así que por defecto queda fuera de alcance.
- **Tensión aparente con la entrada del 2026-07-07 (resuelta):** aquella entrada decía que había que igualar el nivel de detalle técnico que el propio equipo ya usaba en sus HU (nombres de tabla, RLS...). No se contradice con este feedback: la distinción es entre **reflejar** una decisión técnica que el equipo ya documentó en una HU propia existente (contexto real) y **inventar** una decisión técnica nueva sin esa base (lo que rechaza este feedback). `generar-backlog-detalle.md` ahora deja esa distinción explícita.
- **Propuesta (ya aplicada):** se añadió una sección nueva a `generar-backlog-detalle.md` ("Qué nivel de detalle y tamaño debe tener una HU") con la regla de tamaño (un flujo funcional completo por HU) y la lista de qué sí/qué no incluir técnicamente; se reescribió el campo "Criterios de Aceptación" del Paso 2 para quitar la petición de detalle técnico (endpoints, tablas) y sustituirla por profundidad en inputs/validaciones/lógica de negocio; se renombró y acotó el campo antiguo "Requisitos Técnicos y de Seguridad" a "Requisitos No Funcionales o de Seguridad aplicables" (solo RNF ya definidos, nunca arquitectura inventada); se añadieron dos preguntas nuevas a la autoevaluación final del prompt.
- **Mecanismo de calibración en marcha (no cerrado todavía):** el usuario pidió explícitamente poder pasar feedback → ajustar el prompt → generar las HU de una épica concreta → que el equipo las revise → volver a ajustar o confirmar el prompt con esa revisión real. Ese bucle ya lo soporta la invocación explícita por épica que existe en `generar-backlog-detalle.md` ("Genérame solo las historias de la épica X") — no hace falta construir nada nuevo para esto, solo usarlo. Esta entrada se queda abierta hasta que se generen HU de una épica concreta con las reglas nuevas y el equipo las revise de verdad; si corrige algo, añadir una entrada de seguimiento aquí (no reescribir esta).
- **Prioridad:** Alta
- **Esfuerzo estimado:** Bajo (prompt ya reescrito) / pendiente validación real
- **Estado:** 🟡 En curso — reglas aplicadas, pendiente de confirmar con una revisión real del equipo sobre una épica generada con ellas

### [2026-07-13] Criterio de agrupación de HU en épicas de configuración/ajustes: por límite de dependencia, no por campo — y se cierra la asimetría Autónomo/Paradigma

- **Origen:** demo en chat (sin escribir en Drive/Jira) de una HU de ejemplo para EP-004 (Eductrade/Polar) — "personalizar colores de marca del centro", separada de HU-010 (que ya cubre logo/idioma/timezone/fecha de la misma pantalla). Comentada en una conversación de equipo real: Bas preguntó explícitamente si habría una HU por cada campo de "Configuración de centro" (logo, tipografía, color...) — señal de que el ejemplo repetía el patrón de fragmentación que el feedback del 2026-07-10 ya había señalado como problema. Marina propuso agrupar todo en una única HU de "personalizar centro". El usuario (PM) identificó el trade-off real que esa fusión introduce: una HU muy amplia hace que una sola dependencia sin resolver (ej. ratios ATNE/ANE pendientes del cliente) bloquee por DoR partes que sí estaban listas para desarrollarse, impidiendo trabajo en paralelo del equipo.
- **Por qué la regla de 2026-07-10 ("una HU por flujo funcional completo") no bastaba:** esa regla asume que toda épica tiene un recorrido de usuario end-to-end reconocible (ej. "un profesor califica un examen"). Las épicas de configuración/ajustes no lo tienen — son un conjunto de campos independientes sin secuencia obligatoria — así que aplicar la regla literalmente empuja a uno de dos extremos malos: fragmentar por campo, o fusionar todo en una HU gigante que cualquier dependencia bloquea entera.
- **Propuesta (ya aplicada):** para épicas sin recorrido de usuario único, el criterio de agrupación pasa a ser el **límite de dependencia/riesgo de bloqueo compartido**, no el campo ni la pantalla — todo lo que comparte el mismo perfil de bloqueo (listo, o bloqueado por la misma causa) va en la misma HU; lo que tiene un riesgo de dependencia distinto se separa, aunque viva en el mismo formulario. Maximiza el trabajo en paralelo: una dependencia no debe congelar partes ya desarrollables. Añadido a `prompts/paso-3/generar-backlog-detalle.md` (Modo Autónomo, con ejemplo y pregunta de autoevaluación) y, en la misma pasada, se corrigió la asimetría detectada en la sesión anterior: `prompts/transversal/generar-historias-modo-paradigma.md` (Modo Paradigma) no tenía ninguna de las reglas de tamaño/detalle de 2026-07-10 ni esta nueva — ahora el mensaje de traspaso a Infinia las incluye explícitamente (tamaño, no inventar tecnología, agrupación por dependencia, numeración sin colisión, verificación de citas de Jira), y el paso de validación del PM (sub-paso 4 de ese prompt) tiene las mismas comprobaciones que ya existían en el checklist de autoevaluación de `generar-backlog-detalle.md`.
- **Sin verificar todavía:** no se ha generado ni revisado una tanda completa de HU con esta regla ya aplicada de inicio (ni en Modo Autónomo ni contra Infinia real) — la primera vez que se use, confirmar que la agrupación por dependencia resulta natural de aplicar y no genera historias artificialmente separadas cuando en realidad comparten el mismo bloqueo.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A (implementado) / Bajo (verificar con una tanda real)
- **Estado:** ✅ Implementada (2026-07-13), pendiente de verificación con uso real

### [2026-07-10] Nuevo: Modos de Generación — Estándar + perfiles con nombre por cliente, reutilizables entre proyectos

- **Origen:** decisión explícita del usuario. Quería que el skill tuviera un "Modo Estándar" de generación de épicas/historias anclado a marcos reconocidos, y por encima de ese Estándar, perfiles con nombre por cliente (`modo-mapfre`, etc.) que declararan solo las diferencias — reutilizables en cualquier proyecto o cliente futuro, no reconfigurables cada vez desde cero.
- **Decisión de alcance (preguntada explícitamente):** un modo con nombre es **un perfil independiente por tipo de artefacto** (`modo-mapfre-epicas.md` y `modo-mapfre-historias.md` por separado), no un único archivo que cubra todo — el usuario prefirió granularidad sobre simplicidad de mantenimiento.
- **Propuesta (ya aplicada):** carpeta nueva `modos-generacion/` a nivel raíz del skill (no dentro de `investigar/[proyecto]/`, para que persista entre proyectos y clientes) — nuevo prompt `prompts/transversal/gestionar-modos-generacion.md` (detecta si el PM pide un modo, lo aplica si existe, lo crea a partir de una conversación si no existe) y plantilla `templates/transversal/modo-generacion.md` (formato de diff contra el Estándar: qué se quita/añade/cambia, nunca una redefinición completa). Enlazado desde `generar-epicas.md` y `generar-backlog-detalle.md`, que ahora se presentan explícitamente como el "Modo Estándar" de cada artefacto.
- **Sin verificar todavía:** no se ha creado ni usado ningún modo real todavía (ej. un hipotético `modo-mapfre`) — la primera vez que un PM pida uno, confirmar que el flujo de creación conversacional (sin formato rígido de entrada) produce un archivo de diff útil y que aplicarlo sobre el Estándar no genera confusión sobre qué reglas son negociables por cliente y cuáles no (ej. `HU-XXX`, Verdict de DoR).
- **Prioridad:** Media
- **Esfuerzo estimado:** N/A (implementado) / Bajo (verificar con el primer modo real)
- **Estado:** ✅ Implementada (2026-07-10), pendiente de verificación con un modo real

### [2026-07-13] Infinia retirado como generador — colapsa la bifurcación Autónomo/Paradigma, `config/modo-trabajo.md` queda obsoleto, y nace el concepto de "fuentes de contexto opcionales"

- **Origen:** decisión explícita y ya tomada por el PM en el proyecto real Eductrade/Polar (sesión en paralelo a la de este cambio). El equipo deja de usar Infinia para generar historias de usuario — la calidad no convenció ni siquiera con las mejoras ya aplicadas al prompt de traspaso (ver entradas 2026-07-09, 2026-07-10 y la entrada de agrupación por dependencia justo encima). A partir de ahora, la generación de HU la hace siempre `prompts/paso-3/generar-backlog-detalle.md`, sin excepción.
- **Por qué esto rompía el diseño anterior, no solo un dato a actualizar:** `config/modo-trabajo.md` y la bifurcación Autónomo/Paradigma de Paso 3 estaban construidas alrededor de "¿quién genera, el skill o Infinia?". Sin Infinia, esa pregunta no tenía ya sentido — `generar-historias-modo-paradigma.md` quedaba huérfano y modo-trabajo.md ya no representaba ninguna decisión real.
- **Propuesta (ya aplicada):**
  - `generar-historias-modo-paradigma.md` y la plantilla `modo-trabajo.md` se **archivan** (no se borran) en `archivo/prompts/transversal/` y `archivo/templates/transversal/`, con una cabecera explicando la retirada y su fecha — se conservan porque el formato de HU que Infinia validó empíricamente sigue siendo la base del formato actual, y por si en el futuro se retoma con un agente distinto (ver reflexión de la entrada 2026-07-09).
  - El bootstrap deja de preguntar "modo de trabajo". `SKILL.md` se actualizó en todos sus puntos de contacto: bootstrap, tabla del Paso 3, tabla de Prompts transversales, diagrama de carpetas y nota de migración nueva (si un proyecto ya tiene `config/modo-trabajo.md` de antes de esta fecha, se puede archivar o borrar, ya no se lee).
  - **Efecto colateral detectado y resuelto, no solo en Paso 3:** `modo-trabajo.md` también condicionaba el cierre del Paso 3/inicio del Paso 4 (quién asigna historias a sprint: el equipo con "agentes de empresa" en Modo Paradigma, o `evaluacion-dor.md`/`sprint-planning.md` del skill en Modo Autónomo). Como nunca se construyó ni se validó ningún "agente de empresa" real más allá de Infinia, se simplificó: `evaluacion-dor.md` y `sprint-planning.md` pasan a ser herramientas de uso bajo demanda (el PM las invoca si las necesita, no las invoca si el equipo ya lo cubre por su cuenta), sin depender de ningún modo ni configuración previa. Es una simplificación coherente con la decisión, no una ampliación de alcance no pedida — se documenta aquí por transparencia, ya que el PM solo mencionó explícitamente la generación de HU, no este punto.
  - **Concepto nuevo — Fuentes de Contexto Opcionales** (no un segundo generador): `prompts/transversal/gestionar-fuentes-contexto.md` (nuevo) + `templates/transversal/fuente-contexto-repo-codigo.md` (nuevo). El skill sigue siendo el único generador; puede opcionalmente fundamentar lo que genera con fuentes reales registradas en `config/fuentes-contexto/[tipo].md` (por proyecto, a diferencia de los Modos de Generación que son globales al skill). Dos fuentes contempladas: **repositorio de código** (solo lectura, ya activable — sustituye la cláusula de `generar-backlog-detalle.md` que decía "hoy esa capacidad no está disponible") y **memory bank de Paradigma** (reservado, sin definir todavía — no se activa hasta aclarar con el PM qué es exactamente, qué contiene y cómo se accede; puede o no ser el mismo sistema que usaba Infinia).
- **Sin verificar todavía:** (1) que el patrón de fuentes de contexto funcione bien la primera vez que se registre un repo de código real; (2) qué es exactamente el memory bank de Paradigma — pendiente de aclaración explícita con el PM antes de construir nada sobre él; (3) que la simplificación de Paso 4 (herramientas bajo demanda, sin modo) no deje ningún caso real sin cubrir.
- **Prioridad:** Alta
- **Esfuerzo estimado:** N/A (implementado) / Medio (definir el memory bank cuando el PM aclare qué es)
- **Estado:** ✅ Implementada (2026-07-13), pendiente de verificación con uso real y de definición del memory bank
