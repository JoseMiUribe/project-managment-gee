# Prompt: Procesar Capacidad del Equipo (cálculo + versionado)

> **Nivel:** 🧠 Diseño (con cálculo mecánico) — las fórmulas son mecánicas pero decidir fiabilidad y ajustes finales requiere juicio.

## Propósito

Tomar las respuestas recogidas en `cuestionario-capacidad.md` (o una `plantilla-capacidad.md` rellenada por el equipo) y convertirlas en el documento oficial de capacidad del equipo, aplicando las fórmulas de cálculo de forma transparente y dejando un histórico versionado que nunca se sobrescribe.

Este es el prompt que cierra el hueco más crítico del Paso 2: sin él, la capacidad del equipo queda en una conversación sin traducirse a un artefacto que el roadmap pueda consumir. **No hay roadmap fiable sin este documento.**

## Input

- Respuestas del cuestionario de capacidad (`cuestionario-capacidad.md`) o `templates/paso-2/plantilla-capacidad.md` rellenada
- `investigar/[proyecto]/output-paso-2/config/dod-definition.md` (factor DoD)
- `investigar/[proyecto]/output-paso-2/config/dor-definition.md` (por si el DoR introduce colchón adicional relevante, ej. tamaño máximo de HU)
- `investigar/[proyecto]/output-paso-1/registro-riesgos.md` (riesgos que puedan traducirse en buffer sobre la velocidad)
- Si existe, la versión anterior: `investigar/[proyecto]/output-paso-2/capacidad-equipo/actual.md`

## Sistema de versionado (obligatorio, sin excepciones)

Este documento **nunca se sobrescribe**. Cada vez que se genera o actualiza la capacidad del equipo:

1. Determina el número de versión siguiente `N` mirando qué versiones existen ya en `investigar/[proyecto]/output-paso-2/capacidad-equipo/` (si no existe el directorio, esta es `v1`).
2. Crea el archivo **nuevo** `investigar/[proyecto]/output-paso-2/capacidad-equipo/v{N}.md` con el cálculo completo de esta iteración. No edites ni borres ningún `v{N}.md` anterior — son historial permanente.
3. Sobrescribe (esta sí se sobrescribe, siempre) `investigar/[proyecto]/output-paso-2/capacidad-equipo/actual.md` con una copia exacta del contenido de `v{N}.md` recién creado. `actual.md` es un puntero, no una fuente independiente: su único propósito es que el resto de prompts (roadmap, sprint planning) puedan leer "la capacidad vigente" sin tener que saber qué número de versión es la última.
4. Si es la primera vez (`v1`), indícalo como tal — no hay diff que mostrar.
5. Si ya existía una versión anterior, calcula y muestra un **diff cualitativo breve** (3-6 líneas, no un diff línea a línea): qué cambió en la composición del equipo, en la velocidad, en los factores aplicados, y por qué. Ejemplos de motivo: "primera estimación", "recalibrado tras Sprint 1 con velocidad real", "se incorpora nueva persona al equipo", "cambia el DoD y se recalcula el factor".

Cada versión debe declarar explícitamente en su cabecera:
- Fecha de generación
- Motivo de la actualización (frase corta, ej. "primera estimación", "recalibrado tras Sprint 1 con velocidad real")
- Diff cualitativo respecto a la versión anterior (o "N/A — primera versión")

## Instrucciones de cálculo

Aplica las fórmulas en este orden exacto y muestra cada paso — nunca entregues solo el resultado final.

### 1. Velocidad realista de partida

- **Si hay datos históricos**: velocidad de referencia = media histórica de los últimos sprints declarados. Horquilla = (mínimo histórico, máximo histórico). Fiabilidad de este bloque: ALTA.
- **Si NO hay datos históricos**: usa las tres estimaciones dadas por el PM/TL (optimista, realista, pesimista) escaladas por disponibilidad real (ej. 4 personas al 50% = 2 personas equivalentes / ETC). Horquilla = ±30% sobre la realista si el PM no dio las tres cifras explícitamente. Fiabilidad de este bloque: MEDIA si participó el TL en la estimación, BAJA si es solo intuición del PM.

Muestra el cálculo de escalado por disponibilidad de forma explícita (quién, dedicación %, ETC resultante), no solo el número final.

### 2. Factor de especialidad (cuello de botella — NUNCA se suma)

Este es el punto donde más fácil es equivocarse: **la capacidad del equipo no es la suma de las capacidades individuales por especialidad, es el mínimo determinado por el recurso más escaso respecto a lo que el proyecto necesita.**

Procedimiento:
1. Toma el % de esfuerzo técnico requerido por el proyecto (frontend/backend/infra/QA/diseño) de las respuestas del cuestionario.
2. Toma el % de capacidad del equipo disponible en cada una de esas mismas áreas.
3. Para cada área, calcula cuánta velocidad nominal del equipo se puede aprovechar realmente: si el proyecto necesita 80% BE y el equipo solo aporta 20% BE, el BE es el cuello de botella y **limita** la velocidad efectiva del conjunto — el resto de la capacidad "sobrante" en otras áreas (ej. FE) no compensa el déficit de BE, porque el trabajo de BE no lo puede hacer alguien de FE.
4. Declara explícitamente cuál es el área cuello de botella y qué % de la velocidad nominal queda realmente disponible por culpa de ese desbalance.

Ejemplo de razonamiento correcto (inclúyelo en el documento adaptado a los datos reales del proyecto):
> "El proyecto requiere 80% BE / 20% FE. El equipo aporta 20% BE / 80% FE. El BE es cuello de botella: solo se puede avanzar al ritmo que el BE permite, así que la capacidad efectiva del sprint queda limitada al equivalente de BE disponible, no a la suma nominal del equipo completo."

### 3. Factor DoD (tabla fija — lee `dod-definition.md`)

Lee `output-paso-2/config/dod-definition.md` y determina qué escalón de la tabla aplica. Usa el escalón más alto que corresponda a los criterios realmente exigidos — no acumules varios escalones ni promedies.

| Perfil DoD | Ajuste |
|---|---|
| Solo unit tests | -10% |
| Tests unitarios + integración | -20% |
| + documentación obligatoria | -25% |
| + seguridad / monitoreo | -30% |
| + accesibilidad WCAG AA | -35% |
| + E2E + regresión completa | -40% |

Declara explícitamente qué criterios del DoD leído justifican el escalón elegido (cita los DOD-XX concretos), para que el PM pueda auditar de dónde sale el porcentaje.

### 4. Buffer por riesgos GEE

Revisa `output-paso-1/registro-riesgos.md` y selecciona los riesgos (R-XXX) que el PM haya señalado como relevantes para la capacidad (persona clave, tecnología nueva, dependencia externa que consume tiempo del equipo, etc.). Asigna un buffer razonado por cada uno y combínalos en un único `buffer_riesgos` (no los sumes ingenuamente si se solapan — usa criterio, y explica cómo combinaste varios riesgos si aplica).

Si no hay riesgos relevantes para la capacidad, `buffer_riesgos = 0%` y dilo explícitamente (no lo omitas en silencio).

### 5. Fórmula final

```
Velocidad efectiva = Velocidad realista × (1 - factor_DoD) × (1 - buffer_riesgos)
```

...y el resultado de esa fórmula queda además **limitado por el cuello de botella de especialidad** calculado en el paso 2: si el cuello de botella impone un techo inferior al resultado de la fórmula, el techo gana.

Muestra la cadena de cálculo completa con números reales, paso a paso, por ejemplo:
```
Velocidad realista:            42 pts/sprint
× (1 - factor_DoD 30%):        29.4 pts/sprint
× (1 - buffer_riesgos 15%):    25.0 pts/sprint
Techo por cuello de botella BE: 22 pts/sprint  ← gana el techo, es más restrictivo
─────────────────────────────────────────────
Velocidad efectiva:             22 pts/sprint
```

### 6. Fiabilidad global

Determina la fiabilidad global del cálculo (no solo la de la velocidad base):
- **ALTA**: hay datos históricos de velocidad Y el DoD/riesgos están bien caracterizados (no hay grandes incógnitas)
- **MEDIA**: hay estimación del TL sin datos históricos, o hay datos históricos pero el DoD/contexto cambió sustancialmente desde entonces
- **BAJA**: la estimación de velocidad es intuición del PM sin validación del TL, o hay incógnitas grandes sin resolver (equipo aún no confirmado, tecnología nunca usada, etc.)

## Validación con el usuario (obligatoria antes de cerrar)

Antes de guardar la versión, muestra al PM:
1. La cadena de cálculo completa (no solo el resultado)
2. El cuello de botella identificado y por qué
3. El factor DoD aplicado y qué criterios del DoD lo justifican
4. El buffer de riesgos aplicado y de qué riesgos viene
5. La fiabilidad asignada y por qué

Pregunta explícitamente: "¿Este cálculo refleja la realidad del equipo? ¿Hay algo que ajustar antes de guardarlo como versión oficial?" No guardes la versión hasta tener confirmación o ajustes del PM.

## Output esperado

1. `investigar/[proyecto]/output-paso-2/capacidad-equipo/v{N}.md` — nuevo, nunca sobrescribe versiones previas
2. `investigar/[proyecto]/output-paso-2/capacidad-equipo/actual.md` — sobrescrito con copia de `v{N}.md`

Usa la estructura de `templates/paso-2/plantilla-capacidad.md` como formato del documento de capacidad (composición, perfil técnico, velocidad, factores, restricciones, histórico de versiones), rellenando cada sección con el cálculo trazable descrito arriba — no dejes ninguna fila de la tabla de "Factores de corrección aplicados" sin su columna de "Motivo" explicada con números reales.

## Siguiente paso

Con `capacidad-equipo/actual.md` cerrado y validado, continúa con `generar-roadmaps.md`. Ese prompt lee `actual.md` como fuente de verdad de velocidad — nunca debe inventar ni reestimar la velocidad por su cuenta.

## Recalibración futura

Cuando el equipo complete sprints reales (Paso 3), la retrospectiva puede traer velocidad real medida. En ese caso, vuelve a ejecutar este prompt con los nuevos datos: se generará `v{N+1}.md` con motivo "recalibrado tras Sprint [X] con velocidad real" y el diff cualitativo explicará qué cambió respecto a la estimación anterior. No se pierde nunca el histórico de cómo evolucionó la estimación.
