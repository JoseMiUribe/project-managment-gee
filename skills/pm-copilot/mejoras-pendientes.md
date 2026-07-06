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
