# Prompt: Actualización en Cascada

> **Nivel:** 🧠 Diseño — decidir qué se ve realmente afectado y qué no es juicio, no un recálculo mecánico. Ejecuta en el modelo principal.

## Propósito

Cuando el PM aporta información nueva que contradice o amplía algo de un paso **ya cerrado** mientras todavía está validando un paso **posterior** (el caso típico: está revisando el roadmap y de pronto aclara un requisito, corrige una zona de incertidumbre, o añade un riesgo que no se había detectado), este prompt evita dos fallos opuestos:

- Ignorar la información nueva y dejar el roadmap validado sobre datos ya obsoletos.
- Regenerar todo el pipeline desde cero por una corrección menor que no cambia ninguna conclusión.

**Relación con `prompts/paso-3/gestion-changelog.md`:** ese prompt es para peticiones de cambio de alcance que llegan **durante la ejecución de sprints** (Paso 3), con su propio registro formal (SC-XXX) porque ya hay compromisos con el cliente en juego. Este prompt (`actualizar-cascada.md`) es el motor genérico que se dispara en **cualquier punto del pipeline, antes o después de arrancar sprints**, cuando cambia un dato de un paso ya cerrado. De hecho, el paso 3 de `gestion-changelog.md` ("actualizar roadmaps y capacidad") es una aplicación concreta de esta misma lógica.

## Cuándo se activa

En cuanto detectes que la información nueva contradice, corrige o amplía de forma no trivial algo que ya se guardó como output de un paso anterior — no lo dejes pasar "para luego". Ejemplos: el PM dice "en realidad ese requisito no es así", "se me olvidó mencionar que hay una integración más", "el equipo va a tener una baja que no había contado", "ese riesgo ya no aplica".

No lo actives por matices que no cambian ninguna conclusión ya tomada (principio 80/20): si la corrección no altera ningún cálculo, prioridad o fecha, anótala en el artefacto correspondiente y sigue sin recalcular nada más.

## Procedimiento

### 1. Identifica el origen del cambio

¿A qué paso y qué artefacto concreto afecta la información nueva? Sé preciso — no digas "esto afecta a todo", localiza el artefacto exacto (ej. `output-paso-0/requisitos-funcionales.md`, `output-paso-1/registro-riesgos.md`, `output-paso-2/config/dod-definition.md`).

### 2. Consulta el mapa de dependencias y determina qué regenerar

| Si cambia esto... | ...revisa/regenera esto, en este orden |
|---|---|
| `output-paso-legacy/*` | `output-paso-0/*` (si la guía de entrevista cambia sustancialmente) |
| `output-paso-0/requisitos-funcionales.md` o `requisitos-nofuncionales.md` | `output-paso-1/registro-riesgos.md` y `registro-dependencias.md` → `output-paso-2/epicas.md` → `backlog-detalle.md` |
| `output-paso-0/zonas-incertidumbre.md` (una se resuelve o aparece una nueva) | `output-paso-1/registro-riesgos.md` → lo que dependa de esos riesgos (ver fila siguiente) |
| `output-paso-1/registro-riesgos.md` o `registro-dependencias.md` | `output-paso-2/capacidad-equipo/` (si el riesgo afecta al buffer) y `roadmap-tecnico.md`/`roadmap-cliente.md` (deadlines de DP-XXX/A-XXX, colchón de riesgo) |
| `output-paso-2/config/dor-definition.md` o `dod-definition.md` | `output-paso-2/capacidad-equipo/` (factor DoD) → `roadmap-tecnico.md`/`roadmap-cliente.md` |
| `output-paso-2/epicas.md` (prioridad, dependencias o alcance de una épica cambia) | `output-paso-2/roadmap-tecnico.md`/`roadmap-cliente.md` → `backlog-detalle.md` |
| `output-paso-2/capacidad-equipo/actual.md` (nueva versión) | `output-paso-2/roadmap-tecnico.md`/`roadmap-cliente.md` |

Regenera **en el orden de la tabla, de arriba hacia abajo** — nunca saltes directamente al artefacto final sin pasar por los intermedios, porque cada uno es input del siguiente y saltarse uno deja datos inventados o inconsistentes.

### 3. Ejecuta los prompts correspondientes, no edites a mano

Para cada artefacto de la cadena, ejecuta el prompt que lo genera (`identificar-riesgos-dependencias.md`, `generar-epicas.md`, `procesar-capacidad.md`, `generar-roadmaps.md`, `generar-backlog-detalle.md`, según toque) en vez de editar el markdown directamente. Editar a mano dos veces produce artefactos que ya no coinciden con lo que su propio prompt habría generado, y eso rompe la trazabilidad del sistema.

### 4. Marca explícitamente qué cambió y por qué

Al regenerar cada artefacto de la cadena, no lo sustituyas en silencio: indica en 2-4 líneas qué cambió respecto a la versión anterior y qué lo motivó (referencia a la información nueva del PM). Si el artefacto tiene versionado propio (capacidad del equipo), esto ya lo exige su propio prompt — no lo dupliques, solo asegúrate de que el motivo declarado ahí sea el mismo que dispara esta cascada.

### 5. Vuelve al paso que estabas validando

Cierra la cascada volviendo a presentar el artefacto que el PM estaba a punto de validar (ej. el roadmap), ya con los datos actualizados, y sé explícito sobre qué cambió en él como consecuencia de la cascada — no lo presentes como si fuera la primera vez.

### 6. Si algo queda desactualizado sin regenerar todavía

Si por alcance de la conversación no puedes regenerar toda la cadena en el momento (ej. el PM solo quiere ver el impacto en el roadmap y dejar la actualización formal de riesgos para otro momento), dilo explícitamente: marca los artefactos intermedios como "desincronizados, pendientes de regenerar" en vez de dejarlos silenciosamente obsoletos y sin avisar.

## Reglas

- No regeneres artefactos que la tabla no señale como afectados — respeta YAGNI, no repitas todo el pipeline por precaución.
- Si tienes dudas sobre si algo es "cambio trivial" o "cambio real", trátalo como real — el coste de un roadmap mal calculado es mayor que el de una regeneración de más.
- El PM decide si quiere completar la cascada ahora o después; tu trabajo es dejar claro qué queda pendiente y por qué, nunca decidirlo en silencio.
- **Ninguna HU ya comprometida en un sprint activo (presente en `output-paso-3/sprint-backlog.md` de un sprint iniciado, o ya creada en Jira dentro de un sprint) se regenera ni se modifica por esta cascada, aunque la tabla de dependencias diga que le corresponde cambiar.** Repórtala como "afectada pero no modificada por estar en sprint" y, si el cambio es relevante para ella, deriva el caso a `prompts/paso-3/gestion-changelog.md` para que el PM decida con el equipo, en vez de tocarla aquí.
- Cualquier regeneración de un artefacto que no sea la primera vez (ya existía una versión) requiere que se lo confirmes al PM antes de sustituirlo, salvo los artefactos con versionado propio (`capacidad-equipo/`), que ya llevan su propia confirmación incorporada en su prompt.
