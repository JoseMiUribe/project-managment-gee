# Prompt: Check Init — Checklist de arranque (16 puntos)

> **Nivel:** 🧠 Diseño — evaluar madurez real de cada punto requiere criterio y conocimiento del proyecto. Ejecuta en el modelo principal.

## Propósito

Verificar que el proyecto arranca con unas condiciones mínimas de salud en 16 dimensiones de gestión. No es un trámite: cada punto marcado como ausente o crítico debe traducirse inmediatamente en un riesgo o una acción concreta, para que el Check Init alimente directamente el resto del Framework GEE.

## Instrucciones para la IA

1. Reúne el contexto disponible antes de evaluar: `documentacion-proyecto.md`, los outputs del Paso 0 (`requisitos-funcionales.md`, `requisitos-nofuncionales.md`, `zonas-incertidumbre.md`), y si existe, el análisis legacy (`mapa-proyecto.md`, `guia-paso-0.md`).
2. Para cada uno de los 16 puntos, responde tú mismo (o pregunta al PM cuando el contexto no alcance) las preguntas concretas listadas abajo. No te limites a marcar un estado sin evidencia: cada fila de la tabla de salida debe citar el dato o la ausencia de dato que justifica el color.
3. Aplica el criterio semáforo de forma estricta:
   - ✅ **Verde**: el punto está resuelto y documentado, no requiere acción inmediata.
   - 🟡 **Amarillo**: existe algo (una intención, un acuerdo verbal, una versión parcial) pero no está completo, formalizado o validado.
   - 🔴 **Rojo**: no existe nada, o lo que existe es contradictorio/inviable.
4. **Regla obligatoria**: todo punto en 🔴 genera automáticamente como mínimo un Riesgo (R-XXX) o una Acción preventiva (A-XXX). Un punto en 🟡 genera una Acción si el vacío es relevante para el arranque; queda a tu criterio si el 🟡 es lo bastante menor como para no generar nada (justifícalo en la columna de evidencia).
5. No te limites a "falta esto": propón el texto concreto del riesgo o la acción (descripción, tipo, responsable sugerido) para que se pueda dar de alta directamente en `registro-riesgos.md` o `registro-acciones.md` sin reinterpretación.
6. Si el proyecto tiene legacy, contrasta cada punto contra lo que el análisis legacy ya reveló (p.ej. si `mapa-proyecto.md` marcó la gestión de cambio como 🔲 inexistente, el punto 11 de este checklist parte ya en 🔴).
7. Cierra con un resumen ejecutivo: cuántos puntos en cada color, y la lista de IDs (R-XXX / A-XXX) generados.
8. Guarda el resultado en `investigar/[proyecto]/output-paso-1/check-init.md`.

## Los 16 puntos: preguntas y criterio de evaluación

### CI-01 — Comunicación
**Preguntas**: ¿Existe un canal formal y conocido por todas las partes (cliente, equipo, dirección) para comunicación del proyecto? ¿Hay una cadencia definida de reuniones (kickoff, seguimiento, escalado)? ¿Se sabe quién es el interlocutor único de cada lado?
- 🔴 Rojo: no hay canal ni cadencia acordada, o el interlocutor cliente no está identificado.
- 🟡 Amarillo: hay canal pero sin cadencia formal, o la cadencia existe pero no se ha comunicado a todas las partes.
- ✅ Verde: canal, cadencia e interlocutores están definidos y confirmados por ambas partes.

### CI-02 — Validación de producto
**Preguntas**: ¿El cliente ha validado explícitamente el alcance funcional (requisitos del Paso 0)? ¿Hay un mecanismo definido para futuras validaciones (demos, UAT)?
- 🔴 Rojo: los requisitos no han sido revisados ni aceptados por el cliente.
- 🟡 Amarillo: hay validación verbal o parcial, sin mecanismo formal de validaciones futuras.
- ✅ Verde: requisitos validados formalmente y con proceso de validación continua acordado.

### CI-03 — Planificación
**Preguntas**: ¿Existe una planificación inicial (roadmap, hitos, fechas) aunque sea preliminar? ¿Está basada en capacidad real del equipo o es una fecha impuesta sin análisis?
- 🔴 Rojo: no hay ninguna planificación, o la fecha comprometida no tiene ningún respaldo de estimación.
- 🟡 Amarillo: hay fechas orientativas pero sin desglose de hitos ni validación de capacidad.
- ✅ Verde: hay planificación con hitos y contraste de capacidad, aunque sea de baja fiabilidad y así se comunique.

### CI-04 — Riesgos
**Preguntas**: ¿Se ha hecho un ejercicio explícito de identificación de riesgos antes de este Check Init? ¿Hay responsable de mantenimiento del registro de riesgos?
- 🔴 Rojo: no se ha identificado ningún riesgo todavía (más allá de este propio ejercicio).
- 🟡 Amarillo: hay riesgos identificados de forma informal (email, conversación) pero no registrados ni con responsable.
- ✅ Verde: existe o está en curso de esta misma sesión un registro de riesgos con responsable de mantenerlo.

### CI-05 — Calidad
**Preguntas**: ¿Hay criterios de calidad definidos (DoD, estándares de código, criterios de aceptación)? ¿Hay quién los revise?
- 🔴 Rojo: no existe ningún criterio de calidad ni de aceptación.
- 🟡 Amarillo: hay prácticas implícitas o parciales (p.ej. "seguimos el estándar de siempre") sin documentar.
- ✅ Verde: DoD/criterios de aceptación definidos y con responsable de QA o revisión.

### CI-06 — Seguimiento
**Preguntas**: ¿Cómo se va a medir el avance (sprints, hitos, KPIs)? ¿Hay una herramienta de seguimiento (Jira, tablero, etc.) operativa?
- 🔴 Rojo: no hay mecanismo ni herramienta de seguimiento definidos.
- 🟡 Amarillo: hay intención o herramienta elegida pero no configurada/operativa.
- ✅ Verde: mecanismo y herramienta de seguimiento activos desde el arranque.

### CI-07 — Documentación y priorización
**Preguntas**: ¿Los requisitos están documentados y priorizados (no solo listados)? ¿Hay un criterio de priorización acordado con el cliente?
- 🔴 Rojo: no hay documentación de requisitos accesible, o no hay ningún criterio de priorización.
- 🟡 Amarillo: documentación existe pero desordenada o sin priorizar; o priorización hecha unilateralmente sin acuerdo con cliente.
- ✅ Verde: requisitos documentados, priorizados y con criterio acordado.

### CI-08 — VP / gestión interna
**Preguntas**: ¿El equipo interno (VP, dirección, otros equipos que dependen del proyecto) está informado del arranque y de su rol? ¿Hay soporte de gestión interna garantizado (presupuesto, recursos)?
- 🔴 Rojo: dirección/VP no tiene visibilidad del proyecto o los recursos no están confirmados.
- 🟡 Amarillo: hay visibilidad informal pero sin confirmación explícita de recursos o apoyo.
- ✅ Verde: gestión interna informada y recursos confirmados.

### CI-09 — Presentación de resultados
**Preguntas**: ¿Está definido cómo y con qué cadencia se presentarán resultados al cliente y a stakeholders internos (demos, informes)?
- 🔴 Rojo: no hay ningún plan de presentación de resultados.
- 🟡 Amarillo: hay intención genérica ("iremos mostrando avances") sin formato ni cadencia.
- ✅ Verde: formato y cadencia de presentación de resultados acordados.

### CI-10 — Dependencias
**Preguntas**: ¿Se han identificado las dependencias externas del proyecto (sistemas de terceros, otros equipos, aprobaciones)? ¿Hay contacto establecido con los responsables de esas dependencias?
- 🔴 Rojo: no se ha hecho ningún ejercicio de identificación de dependencias.
- 🟡 Amarillo: dependencias identificadas pero sin contacto ni compromiso de los equipos externos.
- ✅ Verde: dependencias identificadas, registradas y con interlocutor confirmado en cada una.

### CI-11 — Gestión del cambio
**Preguntas**: ¿Existe un proceso definido para gestionar cambios de alcance (changelog, aprobación, impacto en coste/plazo)?
- 🔴 Rojo: no hay proceso de gestión de cambio; cualquier petición nueva se asume sin control.
- 🟡 Amarillo: hay acuerdo verbal de "avisar si algo cambia" pero sin proceso formal ni registro.
- ✅ Verde: proceso de gestión de cambio definido, con changelog y circuito de aprobación.

### CI-12 — Lecciones aprendidas
**Preguntas**: ¿Hay mecanismo para capturar y aplicar lecciones aprendidas de proyectos anteriores o del propio proyecto en marcha (retrospectivas)?
- 🔴 Rojo: no hay ningún mecanismo, ni se ha consultado el histórico de lecciones de proyectos similares.
- 🟡 Amarillo: hay intención de hacer retrospectivas pero sin cadencia ni consulta al histórico previo.
- ✅ Verde: mecanismo de lecciones aprendidas activo y con consulta al histórico disponible.

### CI-13 — Seguridad y protección de datos
**Preguntas**: ¿El proyecto trata datos sensibles o personales? Si es así, ¿hay análisis de cumplimiento (LOPD/RGPD, LOPIVI si aplica, clasificación de datos) hecho o en curso?
- 🔴 Rojo: se tratan datos sensibles y no hay ningún análisis de cumplimiento ni medida definida.
- 🟡 Amarillo: hay conciencia del tema pero sin análisis formal ni medidas concretas.
- ✅ Verde: análisis de cumplimiento hecho y medidas de seguridad/protección de datos definidas.

### CI-14 — Cierre de proyecto
**Preguntas**: ¿Están definidos los criterios de cierre/aceptación final del proyecto o fase? ¿Se sabe qué documentación o traspaso se entrega al cierre?
- 🔴 Rojo: no hay criterios de cierre definidos, ni idea de qué se entrega al finalizar.
- 🟡 Amarillo: hay una noción general pero sin criterios explícitos ni checklist de entrega.
- ✅ Verde: criterios de cierre y entregables de traspaso definidos desde el arranque.

### CI-15 — Sesiones / eventos
**Preguntas**: ¿Están planificadas las sesiones clave del proyecto (kickoff, talleres de descubrimiento, sprint reviews, formaciones)?
- 🔴 Rojo: no hay ninguna sesión planificada, ni siquiera el kickoff.
- 🟡 Amarillo: el kickoff está hecho o planificado pero el resto de sesiones no tienen calendario.
- ✅ Verde: calendario de sesiones clave definido para al menos el corto/medio plazo.

### CI-16 — Medios y permisos
**Preguntas**: ¿El equipo tiene los accesos, licencias, entornos y permisos necesarios para empezar a trabajar (repos, entornos cloud, herramientas, VPN, credenciales)?
- 🔴 Rojo: el equipo no tiene accesos mínimos para empezar a trabajar.
- 🟡 Amarillo: accesos parciales o en trámite, con fecha incierta de resolución.
- ✅ Verde: todos los accesos y permisos necesarios están concedidos y verificados.

## Formato de salida

```markdown
# Check Init — [Nombre del Proyecto]

**Fecha:** YYYY-MM-DD
**Responsable evaluación:** [PM]

| ID | Punto | Estado | Evidencia / Justificación | Riesgo o Acción generada |
|---|---|---|---|---|
| CI-01 | Comunicación | ✅/🟡/🔴 | | |
| CI-02 | Validación de producto | | | |
| CI-03 | Planificación | | | |
| CI-04 | Riesgos | | | |
| CI-05 | Calidad | | | |
| CI-06 | Seguimiento | | | |
| CI-07 | Documentación y priorización | | | |
| CI-08 | VP / gestión interna | | | |
| CI-09 | Presentación de resultados | | | |
| CI-10 | Dependencias | | | |
| CI-11 | Gestión del cambio | | | |
| CI-12 | Lecciones aprendidas | | | |
| CI-13 | Seguridad y protección de datos | | | |
| CI-14 | Cierre de proyecto | | | |
| CI-15 | Sesiones / eventos | | | |
| CI-16 | Medios y permisos | | | |

## Resumen ejecutivo

- 🔴 Rojo: N puntos → [lista de CI-XX]
- 🟡 Amarillo: N puntos → [lista de CI-XX]
- ✅ Verde: N puntos → [lista de CI-XX]

## Riesgos y acciones generados en esta sesión

| Origen (CI-XX) | ID generado | Descripción propuesta |
|---|---|---|
| CI-04 | R-001 | ... |
| CI-11 | A-001 | ... |
```

## Input del usuario

[El usuario adjunta o referencia `documentacion-proyecto.md`, `requisitos-funcionales.md`, `requisitos-nofuncionales.md`, `zonas-incertidumbre.md` y, si existe, `mapa-proyecto.md` / `guia-paso-0.md`]

## Output esperado

Archivo `check-init.md` en `investigar/[proyecto]/output-paso-1/`, con la tabla de 16 puntos completa, evidencia por punto y la lista de riesgos/acciones generados a partir de los puntos en rojo (y los amarillos relevantes). Estos riesgos y acciones se consolidan después en `registro-riesgos.md` y `registro-acciones.md` (ver `identificar-riesgos-dependencias.md`).
