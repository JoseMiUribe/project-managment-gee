# Prompt: Retrospectiva

> **Nivel:** 🧠 Diseño — facilitar reflexión de equipo y extraer causas raíz requiere criterio.

**Propósito:** Facilitar la retrospectiva del equipo: qué mejorar, qué mantener, lecciones aprendidas.

## Instrucciones para la IA

1. Carga los daily logs del sprint + `sprint-backlog.md` + `review-sprint-X.md`
2. Identifica patrones: problemas recurrentes, aciertos, cuellos de botella
3. Ayuda al equipo a reflexionar sobre:
   - ¿Qué funcionó bien? → mantenerlo
   - ¿Qué se puede mejorar? → propuesta concreta
   - ¿Qué probar en el próximo sprint? → experimento
4. Captura lecciones aprendidas que puedan servir a futuros sprints o proyectos

## Formato de output

Usa el template `templates/paso-3/retrospectiva.md` para generar `lecciones-sprint-X.md` (en `investigar/[proyecto]/output-paso-3/`).

## Secciones a cubrir

1. **Lo que fue bien 👍**: aciertos, prácticas que funcionaron, dinámicas positivas
2. **Lo que se puede mejorar 🔧**: problemas, cuellos de botella, fricciones (cada uno con causa raíz y propuesta)
3. **Lecciones aprendidas**: aprendizajes transferibles a futuros sprints o proyectos
4. **Acciones para el próximo sprint**: cambios concretos acordados por el equipo
5. **Actualización de velocidad**: velocidad real de este sprint → recalcular capacidad V+1

## Reglas

- La retrospectiva es un espacio seguro. No señalar culpables, buscar causas y soluciones
- Cada "mejora" debe tener una propuesta, no solo la queja
- Las acciones deben ser concretas (quién, qué, cuándo)
- La velocidad real de este sprint alimenta la siguiente versión de `output-paso-2/capacidad-equipo/`
- Los ajustes al roadmap se capturan si procede

## Actualización de velocidad dispara nueva versión de capacidad

Si la velocidad real del sprint difiere de la estimada (para bien o para mal), esto **no se anota solo en la tabla de la retrospectiva**: dispara una nueva versión de `output-paso-2/capacidad-equipo/`, ejecutando el prompt `procesar-capacidad.md` del Paso 2 con la velocidad real como dato de entrada. Esa nueva versión es la que debe usar el siguiente Sprint Planning.

Si el cambio de velocidad es lo bastante grande como para comprometer fechas del roadmap, indícalo explícitamente para que se evalúe también actualizar `output-paso-2/roadmap-cliente.md` y `roadmap-tecnico.md` (prompt `generar-roadmaps.md` del Paso 2).

## Actualizar documento oficial del proyecto

Después de la retrospectiva, actualiza `investigar/[proyecto]/documentacion-proyecto.md`:
- **Estado de Sprints**: si la velocidad real cambió, reflejarlo en la tabla del sprint
- **Equipo y Capacidad**: si la velocidad del equipo se recalibra, actualizar la sección de capacidad y referenciar la nueva versión de `capacidad-equipo/`
- **Decisiones Clave**: decisiones de mejora acordadas por el equipo

## Autoevaluación

- ¿Cada mejora tiene una propuesta accionable?
- ¿Hay al menos 1 lección aprendida transferible?
- ¿Se actualizó la velocidad del equipo, y si cambió, se disparó `procesar-capacidad.md`?
- ¿Las acciones tienen responsable y deadline?
