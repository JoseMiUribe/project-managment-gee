# Prompt: Crear Sprints en Jira con Fechas y Sprint Goal Propuesto

> **Nivel:** 🧠 Diseño — proponer un Sprint Goal con criterio (qué épicas/HU caen en cada ventana según el roadmap) requiere juicio, no es solo mecánico.

## Cuándo se ejecuta

Al cierre del Paso 3, **después** de que `validar-backlog-jira.md` confirme que **todas** las historias del backlog están validadas — no antes. Es agnóstico de modo (Paradigma/Autónomo): la creación de sprints con fechas y goal propuesto es la misma operación en ambos casos, lo único que cambia entre modos fue cómo se generaron las historias, no esto.

**Requisito previo, sin excepción:** `output-paso-2/roadmap-tecnico.md` debe estar validado por el PM — de hecho, todo el Paso 3 depende de esto (ya lo exigen `generar-backlog-detalle.md` y `generar-historias-modo-paradigma.md` como input obligatorio). Si el roadmap cambió desde entonces, ejecuta `prompts/transversal/actualizar-cascada.md` primero.

## La convención `[PROP]`

Cualquier cosa que el skill proponga en Jira sin que un humano la haya confirmado explícitamente todavía se marca con el prefijo `[PROP]` en el propio texto (nombre del campo, título, lo que aplique). Esto obliga a que alguien la vea y, como mínimo, edite el texto para quitar el prefijo antes de darla por buena — evita que una propuesta de la IA se quede puesta "por defecto" sin que nadie se haya dado cuenta.

**Alcance actual de esta convención: solo el Sprint Goal, por defecto.** No la apliques a otras cosas (historias, épicas, prioridad del backlog) salvo que el PM lo pida explícitamente en la conversación (ej. "pon las historias de esta épica como propuestas"). Si lo pide, antes de aplicarlo pregúntale explícitamente si quiere el prefijo `[PROP]` en lo que sea que esté pidiendo marcar o prefiere subirlo tal cual — no lo decidas por tu cuenta, es una preferencia caso por caso, no una regla fija todavía.

## Procedimiento

### 1. Deriva la secuencia de sprints desde el roadmap técnico

De `roadmap-tecnico.md`, extrae para cada sprint del horizonte inmediato/cercano: número, fechas de inicio/fin, y qué épicas/HU tenía previstas.

### 2. Propón un Sprint Goal por sprint

Para cada sprint, redacta un objetivo breve (una frase) que resuma el valor que se entrega en esa ventana, basado en las épicas/HU previstas según el roadmap y el backlog ya validado. Escríbelo siempre como:

```
[PROP] <objetivo propuesto>
```

Ejemplo: `[PROP] Centros pueden darse de alta y gestionar sus propios alumnos de forma aislada`

No propongas un goal genérico tipo "Sprint 3" — tiene que reflejar valor de negocio real, igual que el objetivo que ya se redacta en `sprint-backlog.md` (Paso 4), pero aquí es una propuesta previa a que el equipo asigne historias concretas.

### 3. Resumen previo y confirmación (obligatorio)

Muestra al PM la lista de sprints con sus fechas y goals propuestos antes de crear nada. Pide confirmación explícita.

### 4. Crea o actualiza los sprints en Jira

Usa el conector de Jira de la sesión (ver `prompts/transversal/conectar-jira.md`, punto 1 — no hace falta ninguna configuración adicional de tu parte). Si el conector no soporta crear objetos Sprint directamente (no está verificado todavía, ver `mejoras-pendientes.md`), dilo explícitamente y ofrece la alternativa: que el PM cree los sprints vacíos en Jira (un clic en el backlog) y tú solo les pones fecha y el Sprint Goal con `[PROP]` vía edición del sprint.

**No asignes ninguna historia a estos sprints en este prompt** — eso lo hace el equipo (Modo Paradigma) o `prompts/paso-4/sprint-planning.md` (Modo Autónomo, si no hay agentes propios), ya en el Paso 4, una vez el goal esté confirmado y sin el prefijo `[PROP]`.

### 5. Guarda también una copia local

Independientemente de si Jira lo soporta o no, escribe `investigar/[proyecto]/output-paso-3/sprints-propuestos.md` con la misma información (sprint, fechas, goal propuesto). Esto sirve para:
- El dashboard, que puede leerlo sin necesitar su propia conexión a Jira.
- El caso sin conexión de Jira en absoluto (ver más abajo).

## Si no hay conexión a Jira todavía

Si en el paso 1 de `conectar-jira.md` no hay herramientas de Jira disponibles en la sesión (proyecto Modo Autónomo que todavía no ha conectado Jira, o no sabe cómo hacerlo):

1. **No te detengas silenciosamente.** Genera igualmente `output-paso-3/sprints-propuestos.md` con las fechas y goals `[PROP]`.
2. **Dile explícitamente al PM por qué es solo local**: "No hay conexión a Jira disponible en esta sesión, así que he generado la propuesta de sprints en un archivo local (`sprints-propuestos.md`) en vez de crearlos directamente en Jira. Puedo crearlos yo mismo en cuanto conectes Jira desde la interfaz de la sesión, o los puedes crear tú a mano usando este archivo como referencia."
3. No asumas que el PM sabe cómo habilitar el conector — ofrécele explícitamente que puede hacerlo desde la propia interfaz (así se hizo la primera vez en este skill), y que en cuanto esté disponible, vuelvas a ejecutar este prompt para crear los sprints reales.

## Output

- Sprints creados o actualizados en Jira con fechas y Sprint Goal `[PROP]` (si hay conexión)
- `investigar/[proyecto]/output-paso-3/sprints-propuestos.md` (siempre, haya o no conexión)
- Resumen al PM, incluyendo si algo quedó pendiente por falta de conexión o por no estar verificado que el conector soporte Sprints

## Reglas

- Nunca quites tú el prefijo `[PROP]` — solo lo quita un humano al editar el goal.
- Nunca asignes historias a un sprint desde este prompt.
- Nunca crees sprints con historias todavía sin validar (`validar-backlog-jira.md` debe estar cerrado primero).
