# Prompt: Evaluación DoR (Definition of Ready)

> **Nivel:** ⚙️ Ejecutivo — aplicar criterios DoR ya definidos es mecánico (checklist contra config/dor-definition.md). Puedes delegarlo a un subagente con modelo económico y revisar el resultado.

**Propósito:** Evaluar cada HU candidata contra el DoR acordado del proyecto y decidir si puede entrar en el sprint.

## Instrucciones para la IA

1. Carga el `dor-definition.md` del proyecto (en `investigar/[proyecto]/config/dor-definition.md`)
2. Para cada HU del `backlog-detalle.md`, evalúa cada criterio DoR
3. Asigna estado a cada HU: ✅ Ready / ⏳ Pendiente / ❌ No Ready
4. Para las ❌ No Ready, explica qué criterio(s) no cumple y qué falta para alcanzarlo
5. Para las ⏳ Pendiente, indica qué información falta y quién debe resolverla

## Formato de evaluación por HU

```
### HU-XXX: [Título]

| Criterio | Cumple | Observación |
|---|---|---|
| DOR-01 Descripción clara | ✅ Sí | |
| DOR-02 Criterios aceptación | ✅ Sí | |
| DOR-03 Verificables | ❌ No | "Responde en menos de 2s" no tiene métrica definida |
| ... | | |

**Resultado:** ❌ No Ready
**Motivo:** Los criterios de aceptación no son verificables (DOR-03)
**Acción:** El PO debe concretar los umbrales de rendimiento
```

## Reglas de decisión

- Si una HU NO cumple **cualquier criterio obligatorio** → ❌ No Ready
- Si una HU cumple todos los obligatorios pero falta algún opcional → ✅ Ready (el opcional se aborda en el sprint)
- Las No Ready vuelven al backlog para refinamiento. No entran en el sprint
- Las Pendiente requieren una reunión de refinamiento antes del Planning
- Si una dependencia bloqueante (DOR-05) no está resuelta → ❌ No Ready automático

## Output

Genera `sprint-candidates.md` (en `investigar/[proyecto]/output-paso-3/`) con:
1. Tabla resumen (HU, título, DoR, observación)
2. Lista de Ready (candidatas al sprint)
3. Lista de No Ready con acciones necesarias
4. Lista de Pendiente con información faltante
5. Recomendación de cuántas HU llevar al sprint según `output-paso-2/capacidad-equipo/` vigente

## Autoevaluación

Antes de entregar, verifica:
- ¿Cada HU tiene un estado claro? (✅⏳❌)
- ¿Las No Ready tienen una acción concreta? (no solo "no cumple")
- ¿Las Ready son realistas para la capacidad del equipo?
