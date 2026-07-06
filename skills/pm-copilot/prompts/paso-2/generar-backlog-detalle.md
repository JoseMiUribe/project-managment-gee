# Prompt: Generar Backlog Detallado (HU con profundidad decreciente)

> **Nivel:** 🧠 Diseño — decidir cuánto detallar cada HU según su horizonte temporal y priorizar dentro de restricciones reales requiere criterio. Ejecuta en el modelo principal.

## Propósito

Descomponer las épicas de `epicas.md` en Historias de Usuario (o funcionalidades) sin caer en dos errores opuestos: detallar todo el backlog de golpe (desperdicia esfuerzo en HU que el proyecto puede invalidar antes de llegar a ellas) o solo detallar la primera épica sin dar visibilidad de lo que viene después (impide planificar).

**Regla central: la profundidad de detalle de una HU depende de cuándo se va a ejecutar según el roadmap técnico, no de lo valiosa que sea la épica a la que pertenece.** Una épica puede ser la más valiosa para el cliente y aun así no ser la primera en ejecutarse, porque depende de algo que todavía no está resuelto o porque la capacidad del equipo no da para más — el roadmap técnico ya resolvió ese trade-off (valor vs. dependencias vs. capacidad). Este prompt seguisce ese orden, no reabre la priorización.

## Input obligatorio

- `investigar/[proyecto]/output-paso-2/epicas.md`
- `investigar/[proyecto]/output-paso-2/roadmap-tecnico.md` (fuente de verdad de qué épica cae en qué sprint)
- `investigar/[proyecto]/output-paso-2/config/dor-definition.md`
- `investigar/[proyecto]/output-paso-1/registro-riesgos.md` y `registro-dependencias.md`

Si `roadmap-tecnico.md` no existe todavía, detente: sin saber qué épica va en qué sprint no se puede decidir la profundidad de detalle. Pide primero cerrar `generar-roadmaps.md`.

## Paso 1: clasifica cada épica en una franja temporal

Usa la secuencia de sprints de `roadmap-tecnico.md`:

| Franja | Definición | Profundidad de HU |
|---|---|---|
| **Inmediata** | Cae en el sprint actual o el siguiente | Completa |
| **Cercana** | Cae dentro de 1-2 meses / próximos 3-4 sprints | Media |
| **Lejana** | Más allá, o marcada como Fase 2 / Condicional en `epicas.md` | Mínima (placeholder) |

Si una épica se solapa entre franjas (empieza en Cercana y termina en Lejana), clasifica sus HU individualmente según en qué sprint caería cada una, no la épica entera de golpe.

## Paso 2: aplica la profundidad según la franja

### Franja Inmediata — HU completas

Cada HU debe tener, listas para pasar por `prompts/paso-3/evaluacion-dor.md`:
- ID `HU-XXX`, épica de origen (`EP-XXX`)
- Formato "Como [rol], quiero [acción], para [beneficio]"
- Criterios de aceptación completos en formato Dado/Cuando/Entonces (mínimo 2-3 escenarios, incluyendo al menos un caso límite o de error)
- Dependencias explícitas con otras HU o con DP-XXX del GEE
- Estimación en puntos (si el equipo ya estima en este nivel de detalle)
- Todo lo que exija `dor-definition.md` del proyecto — repasa el checklist DoR y no dejes ningún criterio obligatorio sin cubrir

### Franja Cercana — HU a nivel medio

- ID `HU-XXX`, épica de origen, título y descripción breve (2-4 líneas)
- Criterio de aceptación de alto nivel (1-2 líneas, sin desglosar en Dado/Cuando/Entonces todavía)
- Dependencias conocidas, aunque sea a nivel de "depende de la épica X" sin más precisión
- **No** las descompongas en tareas técnicas ni les exijas pasar el DoR todavía — se detallarán a nivel Inmediata cuando el roadmap las acerque, ejecutando este mismo prompt de nuevo

### Franja Lejana — solo placeholders

- Lista de "HU candidatas" dentro de cada épica lejana: una frase por HU, sin descripción ni criterios
- Márcalas explícitamente como `⏳ Pendiente de detallar — sujeta a cambios de alcance antes de llegar a su sprint`
- No inviertas tiempo de diseño aquí más allá de nombrarlas — es intencional que queden así

## Paso 3: prioriza dentro de cada franja

Dentro de la franja Inmediata (y, en menor medida, Cercana), si hay más HU candidatas de las que caben en la capacidad de esos sprints (`capacidad-equipo/actual.md`), prioriza en este orden:

1. HU que desbloquean a otras HU (están en el camino crítico de dependencias)
2. HU que resuelven o mitigan un riesgo con RAG 🔴 o 🟡 (`registro-riesgos.md`)
3. Valor de negocio de la épica de origen (según prioridad ya asignada en `epicas.md`)
4. Tamaño/esfuerzo (a igualdad de lo anterior, prioriza HU más pequeñas para reducir riesgo de sprint)

Declara explícitamente el orden resultante y por qué una HU de menor valor de negocio pasó antes que una de mayor valor, cuando ocurra (ej. "HU-014 pasa antes que HU-009, de mayor valor, porque HU-009 depende de DP-002 aún sin resolver").

## Output

`investigar/[proyecto]/output-paso-2/backlog-detalle.md`, con tres secciones claramente separadas (Inmediata / Cercana / Lejana) y, dentro de cada una, las HU en el orden de prioridad decidido en el Paso 3.

## Reevaluación

Este backlog **no se actualiza a mano**. Cuando el roadmap técnico se regenere (por `prompts/transversal/actualizar-cascada.md` o por `prompts/paso-3/gestion-changelog.md`), las franjas de las épicas pueden cambiar — vuelve a ejecutar este prompt completo en vez de parchear el archivo existente, para que la profundidad de detalle siga siendo coherente con el roadmap vigente.

## HU ya comprometidas en un sprint activo

Antes de regenerar este backlog, revisa `output-paso-3/sprint-backlog.md` de cualquier sprint ya iniciado. Ninguna HU que ya esté ahí dentro se toca ni se redetalla por este prompt — queda tal cual está, aunque la reevaluación de franjas la mueva conceptualmente de "Inmediata" a otra categoría. Si una HU en sprint activo necesitara cambiar por la información nueva, no la edites: repórtalo y deriva el caso a `prompts/paso-3/gestion-changelog.md`.

## Autoevaluación antes de cerrar

- ¿Ninguna HU de franja Lejana tiene más detalle del que le corresponde (estarías desperdiciando esfuerzo de diseño)?
- ¿Todas las HU de franja Inmediata tienen lo necesario para pasar `evaluacion-dor.md` sin huecos?
- ¿La priorización dentro de cada franja respeta dependencias y riesgos antes que valor puro, y lo dice explícitamente cuando se desvía del orden de valor?
