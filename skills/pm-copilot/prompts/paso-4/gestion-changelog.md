# Prompt: Gestión de Cambios de Alcance (ChangeLog)

> **Nivel:** 🧠 Diseño — evaluar el impacto de un cambio de alcance en coste/plazo/calidad requiere criterio. Ejecuta en el modelo principal.

**Propósito:** Dar un procedimiento propio a los cambios de alcance que surgen durante un sprint, en lugar de dejarlos como una mención de paso en el daily log o en la sprint review. Todo cambio de alcance se registra, se evalúa y se decide con el mismo rigor con el que se gestiona un riesgo o una dependencia.

## Cuándo se activa

Ejecuta este prompt en cuanto detectes cualquiera de estas señales, vengan de un daily, de una review o de una conversación suelta con el cliente:

- El cliente/PO pide algo **nuevo** que no estaba en el backlog ni en los requisitos originales
- Se descubre que un requisito existente **estaba mal entendido** (lo que se construyó, o lo que se iba a construir, no es lo que el cliente quería)
- Una **decisión de negocio** cambia la prioridad relativa de HU o épicas ya planificadas
- Un stakeholder pide adelantar, retrasar o eliminar algo del roadmap acordado

No actives este prompt para matices menores que caben dentro de una HU ya definida (eso es refinamiento normal, no cambio de alcance).

## Procedimiento

### 1. Registrar el cambio en el ChangeLog

Añade una entrada nueva en `investigar/[proyecto]/output-paso-1/changelog.md` con ID **SC-XXX** correlativo (según template `templates/paso-4/changelog.md`). Cada entrada debe describir:

- Qué se pide y quién lo pide
- Por qué surge ahora (petición nueva / requisito mal entendido / decisión de negocio)
- Impacto **cualitativo** en cada eje (no hace falta recalcular cifras todavía, solo estimar dirección y magnitud):

| Eje | Preguntas guía |
|---|---|
| **Coste** | ¿Requiere más horas/perfiles de los presupuestados? ¿Cuánto, a ojo? |
| **Alcance** | ¿Añade, quita o redefine funcionalidad respecto a lo acordado? |
| **Plazo** | ¿Compromete alguna fecha del roadmap cliente o técnico? |
| **Calidad** | ¿Obliga a relajar DoD, tests o cobertura para no tocar plazo? |

### 2. Decidir: Aceptado / Rechazado / Aplazado

Aplica estos criterios en orden:

1. **¿Cabe en la capacidad actual del sprint/proyecto sin recalcular nada?**
   Si sí → candidato a **Aceptado** directo, se añade al backlog o al sprint en curso sin más trámite.
2. **¿Requiere recalcular `output-paso-2/capacidad-equipo/` o los roadmaps?**
   Si el cambio altera el volumen de trabajo, el mix de perfiles necesarios o las fechas comprometidas → no se decide en solitario. Es candidato a **Aceptado con condiciones** (dispara la actualización descrita en el paso 3 de este prompt) o **Aplazado** hasta la próxima planificación/revisión de roadmap.
3. **¿Genera riesgos o dependencias nuevas?**
   Si introduce una incertidumbre técnica, una dependencia con terceros, o un riesgo de calidad/plazo → regístralos (ver paso 4) independientemente de si el cambio se acepta o no.
4. **¿Es viable con el presupuesto y contrato actuales?**
   Si el cambio excede claramente el alcance contractual y no hay margen de negociación → **Rechazado**, y se documenta la alternativa (pasa a un futuro contrato/fase, o se descarta).

Registra la decisión final (Aceptado / Rechazado / Aplazado) y el razonamiento en la misma entrada SC-XXX. Si es "Aplazado", indica la condición o hito que debe darse para retomarlo.

### 3. Si el cambio es significativo: actualizar roadmaps y capacidad

Un cambio es "significativo" si afecta a fechas comprometidas con el cliente, cambia el orden de épicas, o cambia el volumen total de trabajo estimado. En ese caso:

- Dispara la actualización de `output-paso-2/roadmap-cliente.md` y `output-paso-2/roadmap-tecnico.md`, ejecutando el prompt `generar-roadmaps.md` del Paso 2 con el nuevo alcance como input
- Si además el cambio afecta a la composición o dedicación del equipo (más perfiles, menos dedicación, nueva especialidad requerida), genera una nueva versión de capacidad ejecutando `procesar-capacidad.md` del Paso 2 antes de tocar los roadmaps, porque el roadmap depende de la capacidad vigente

No actualices roadmaps "a mano" dentro de este prompt: delega en los prompts del Paso 2 para no duplicar lógica ni dejar versiones desincronizadas.

### 4. Generar riesgos o dependencias nuevas si el cambio las introduce

Si el análisis de impacto revela una incertidumbre técnica, una dependencia externa nueva, o un riesgo de calidad/plazo:

- Riesgos → crea R-XXX en `output-paso-1/registro-riesgos.md` (con Probabilidad × Impacto × Multiplicador y RAG, según las reglas del Paso 1)
- Dependencias → crea DP-XXX en `output-paso-1/registro-dependencias.md`

Enlaza el SC-XXX con los R-XXX/DP-XXX que genera, y viceversa, para que el rastro sea navegable en ambos sentidos.

## Output

Actualiza `investigar/[proyecto]/output-paso-1/changelog.md` añadiendo la(s) entrada(s) SC-XXX nuevas (template `templates/paso-4/changelog.md`). Si el cambio dispara actualización de roadmap o capacidad, dejar constancia en la propia entrada SC-XXX de qué versión de roadmap/capacidad resultó (ej. "→ roadmap-tecnico.md v3", "→ capacidad-equipo V04").

## Reglas

- Todo cambio de alcance pasa por aquí, venga de donde venga (daily, review, conversación informal con el cliente). No se resuelve "de pasada" en otro documento
- Sé explícito con el impacto aunque sea cualitativo: "impacto medio en coste" es mejor que omitirlo
- No decidas Aceptado si el cambio requiere recalcular capacidad o roadmap y esa recalculación no se ha hecho todavía: usa "Aceptado con condiciones" o "Aplazado" hasta tenerla
- Un cambio rechazado no se borra: queda documentado como precedente y para trazabilidad con el cliente

## Autoevaluación

- ¿La entrada SC-XXX tiene impacto cualitativo en los 4 ejes (Coste/Alcance/Plazo/Calidad), no solo en uno?
- ¿La decisión (Aceptado/Rechazado/Aplazado) tiene un motivo explícito, no solo la etiqueta?
- ¿Si el cambio era significativo, se disparó la actualización de roadmap/capacidad, o quedó pendiente y anotada como tal?
- ¿Los riesgos y dependencias nuevas que introduce el cambio están registrados en el GEE y enlazados al SC-XXX?
