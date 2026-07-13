# Prompt: Modos de Generación (Estándar y perfiles con nombre)

> **Nivel:** 🧠 Diseño — decidir qué diferencia respecto al Estándar es real y cuál es ruido de una petición puntual del PM requiere criterio. Ejecuta en el modelo principal.

## Propósito

Define cómo el skill decide **qué formato usar** al generar épicas o historias de usuario, y cómo crear/mantener perfiles con nombre (`modo-mapfre`, `modo-banco-x`...) reutilizables en **cualquier proyecto futuro**, no solo en el proyecto actual.

## Concepto

- **Modo Estándar:** la definición por defecto de cada artefacto, tal y como está descrita en `prompts/paso-2/generar-epicas.md` y `prompts/paso-3/generar-backlog-detalle.md` — anclada a marcos reconocidos (para historias: INVEST, Como/Quiero/Para, Gherkin/BDD, Cumplimiento DoR; para épicas: agrupación por valor de negocio con ficha estructurada). Se usa siempre que el PM no pida otra cosa — no lo ofrezcas ni preguntes por iniciativa propia.
- **Modo con nombre:** un perfil que **hereda** del Modo Estándar del artefacto correspondiente y declara solo las **diferencias** (qué se quita, qué se añade, qué se cambia). Nunca redefine el artefacto completo desde cero — si un modo necesitara cambiar casi todo el Estándar, probablemente no debería ser un "modo", sino una propuesta de cambio al propio Estándar; avísalo al PM si lo detectas.
- Los modos son **globales al skill, no al proyecto**: viven en `modos-generacion/` dentro de la instalación del skill (junto a `mejoras-pendientes.md`, `prompts/`, `templates/`), no en `investigar/[proyecto]/`. Así están disponibles en cualquier proyecto o cliente futuro sin volver a definirlos, y viajan con el skill si se sincroniza/actualiza en otra máquina.

## Convención de archivo

`modos-generacion/[nombre-modo]-[tipo].md` — uno por combinación de modo + tipo de artefacto, nunca un archivo mixto que cubra varios tipos a la vez:

- `[nombre-modo]`: en minúsculas y kebab-case (ej. `mapfre`, `banco-x`). Si el PM lo dice en otro formato ("modo Mapfre", "MAPFRE"), normalízalo tú antes de buscar o crear el archivo.
- `[tipo]`: `epicas` o `historias` hoy (extensible a otros tipos de artefacto en el futuro con el mismo patrón).

Usa `templates/transversal/modo-generacion.md` como plantilla al crear uno nuevo.

## Cuándo se aplica

Este mecanismo aplica siempre que **el propio skill** genera el artefacto (`generar-epicas.md`, `generar-backlog-detalle.md`) — que desde el 2026-07-13 es la única vía de generación que existe (ver `mejoras-pendientes.md`: Infinia se retiró como generador). El histórico `generar-historias-modo-paradigma.md` (archivado en `archivo/prompts/transversal/`) queda fuera del alcance de este mecanismo — no se aplican modos con nombre sobre un prompt que ya no está activo.

## Procedimiento

### 1. Detecta si el PM pidió un modo concreto

Si el PM no menciona ningún modo al pedir que generes épicas o historias, usa el Modo Estándar tal cual está en el prompt del artefacto correspondiente. No preguntes "¿qué modo quieres?" si no lo ha mencionado.

Si el PM dice algo como "genera las historias en modo mapfre" o "esto es para Mapfre, usa su modo":

1. Normaliza el nombre a kebab-case y busca `modos-generacion/[nombre-modo]-[tipo].md`.
2. **Si existe:** léelo, aplica el Estándar del artefacto correspondiente con las diferencias que declara ese archivo, y dilo explícitamente en el resumen final del trabajo (ej. "Generado en modo `mapfre`: sin campo Estimación, con sección adicional de Trazabilidad") — para que quede claro que no es el Estándar puro.
3. **Si no existe:** dile al PM explícitamente que ese modo no está definido todavía para este tipo de artefacto, y pídele que te lo explique como diferencia respecto al Estándar. No hace falta un formato rígido de su parte — una descripción en lenguaje natural de qué quitar/añadir/cambiar es suficiente, tú la estructuras al guardarla. Preguntas que puedes usar: "¿qué le sobra al Estándar para este cliente?", "¿qué le falta que el Estándar no cubre?", "¿algún campo o sección que quieras que cambie de formato?".

### 2. Crea el archivo del modo nuevo a partir de la respuesta del PM

Con la respuesta, crea `modos-generacion/[nombre-modo]-[tipo].md` a partir de la plantilla, con secciones explícitas de qué se quita / qué se añade / qué se cambia respecto al Estándar. **No repitas el Estándar completo dentro del archivo del modo — solo el diff**, para que quede corto y no se desincronice si el Estándar cambia más adelante. Confirma con el PM el resumen del modo creado antes de generar nada con él la primera vez.

### 3. Genera con el modo aplicado

Aplica el Modo Estándar del prompt correspondiente como base, y superpón las diferencias del archivo del modo. Si una diferencia del modo entra en conflicto con una regla no negociable del Estándar (ej. mantener `HU-XXX` como identificador, o el Verdict de DoR obligatorio), avisa al PM explícitamente en vez de aplicarla en silencio — algunas partes del Estándar existen por motivos que no dependen del cliente (trazabilidad entre lo generado por IA y lo creado por el equipo, no solo estilo).

### 4. Modos existentes: usarlos, ajustarlos, o crear uno nuevo similar

- Si el PM pide un modo que ya existe, aplícalo directamente — no vuelvas a preguntar los detalles que ya están en el archivo.
- Si el PM pide ajustar un modo existente (ej. "en modo mapfre, pero además quita el campo Estimación"), edita el archivo del modo y añade una línea en su sección "Historial de cambios" con la fecha y qué cambió — no lo sobrescribas silenciosamente.
- Si el PM pide un modo nuevo muy parecido a uno existente (ej. "como mapfre pero sin el DoR"), pregúntale si quiere que el nuevo modo declare explícitamente "Basado en: modo `mapfre`, con estas diferencias adicionales" en vez de copiar todo el contenido del diff dos veces.

## Ver también

`prompts/paso-2/generar-epicas.md` y `prompts/paso-3/generar-backlog-detalle.md` (Modo Estándar de cada artefacto), `templates/transversal/modo-generacion.md` (plantilla).
