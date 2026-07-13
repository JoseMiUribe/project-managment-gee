# Prompt: Bucle de Validación del Backlog con el Equipo/PO

> **Nivel:** 🧠 Diseño — decidir qué feedback implica una regeneración real y acotar el cambio a una sola historia requiere criterio. Ejecuta en el modelo principal.

## Propósito

Después de `subir-historias-a-jira.md`, el equipo técnico y el Product Owner revisan las historias del backlog y dejan feedback. Este prompt recoge ese feedback, dispara la regeneración **solo** de las historias afectadas (vía `prompts/paso-3/generar-backlog-detalle.md`), y vuelve a dejarlas listas para revisión. Se repite hasta que el PM cierre la validación explícitamente — no hay una condición automática de "ya está todo bien".

## Dónde vive el feedback

En los **comentarios del propio issue de Jira** de cada historia del backlog. No en un campo separado, no en otro documento — es donde el equipo ya está revisando, no le pidas que use un canal nuevo.

## Procedimiento

### 1. Lee los comentarios de cada historia del backlog

Para cada `HU-XXX` en `config/jira-mapeo.md`, recupera los comentarios de su issue de Jira desde la última vez que se procesó (guarda en `config/jira-mapeo.md` o en un campo propio la fecha/comentario del último procesado, para no reprocesar lo ya resuelto).

### 2. Clasifica cada historia

- **Sin comentarios nuevos:** no se toca.
- **Comentario que es una pregunta o duda sin pedir cambio concreto:** no regeneres todavía — repórtalo al PM, puede que haga falta una respuesta humana antes de poder actuar.
- **Comentario que pide un cambio concreto** (añadir un caso, corregir un criterio, cambiar el alcance de la historia): candidata a regeneración.

### 3. Regenera solo las historias con cambio concreto pedido

Por cada una:
1. Ejecuta `prompts/paso-3/generar-backlog-detalle.md` indicando explícitamente: regenerar **solo esta historia**, con este feedback aplicado, sin tocar ni repetir las demás.
2. Exige que la nueva versión venga con: marca de versión (`v1.1`, `v1.2`...) y un resumen de 2-4 frases de qué cambió, acotado por sección.
3. Actualiza el issue de Jira correspondiente con el contenido nuevo (mismo `HU-XXX`, mismo issue, no crees uno nuevo) y añade un comentario propio del skill con el resumen de qué cambió, para que el equipo sepa qué revisar sin comparar el texto entero a mano.

### 4. Detecta cambios de prioridad hechos por el equipo

Antes de cerrar cada ronda, compara el orden actual del backlog en Jira contra la última entrada de `config/historial-prioridad-backlog.md`. Si el equipo/PO reordenaron algo:
- **No lo corrijas ni lo devuelvas al orden propuesto** (principio 10/11 del skill) — el orden humano gana siempre.
- Añade una entrada nueva en `config/historial-prioridad-backlog.md` (nunca se sobrescribe la anterior) registrando: qué cambió, de qué orden a qué orden, fecha. Esto es lo que permite aprender con el tiempo cómo prioriza este equipo/proyecto.

### 5. Resumen de la ronda al PM

Cuántas historias sin cambios, cuántas regeneradas (con su resumen de cambio), cuántas con duda pendiente de respuesta humana, y si hubo cambios de prioridad detectados.

### 6. Repite hasta cierre explícito

Vuelve a ejecutar este prompt en la siguiente ronda de revisión (nueva sesión, nuevo día, lo que corresponda). El bucle termina únicamente cuando el PM dice explícitamente algo como "el backlog está validado" — no lo cierres tú solo por no encontrar comentarios nuevos en una ronda, puede que el equipo simplemente no haya revisado todavía.

## HU ya comprometidas en un sprint activo

Si una historia con feedback pendiente ya está en un sprint activo (comprobar `output-paso-4/sprint-backlog-{N}.md`), **no la regeneres ni la toques**, sin excepción. Repórtalo al PM — a partir de ese punto es responsabilidad del equipo técnico, no de este bucle.

## Reglas

- Nunca regeneres una historia sin feedback concreto — no "mejores" nada por iniciativa propia en este bucle.
- Nunca toques más de las historias que tienen feedback en esa ronda.
- Nunca cierres el bucle sin una instrucción explícita del PM.
