# Prompt: Sub-paso 4 — Incorporar feedback

> **Nivel:** 🧠 Diseño (con partes mecánicas) — la generación de preguntas requiere criterio; si el volumen es alto, puedes delegar el formateo final a un modelo económico pero revisa las preguntas generadas en el modelo principal.

## Instrucciones para la IA

El PM ha realizado la entrevista al cliente y tiene las respuestas. Tu tarea es:

1. Tomar el `mapa-proyecto.md` original
2. Incorporar las respuestas de la entrevista
3. Actualizar el estado de los aspectos:
   - Los que se resolvieron → pasar a ✅ Claro
   - Los que siguen sin resolver → mantener estado
   - Si surgen nuevas contradicciones → marcar como ⚠️
4. Añadir nuevos aspectos si el cliente mencionó algo no cubierto

Devuelve el mapa-proyecto ACTUALIZADO (versión 2).

## Pasos de ejecución

1. Lee `mapa-proyecto.md` (original) y `cuestionarios.md` cumplimentado (con las respuestas del cliente en la columna "Respuesta").
2. Para cada pregunta respondida, localiza el/los `A-XXX` relacionados (columna "IDs relacionados" del cuestionario) y decide el nuevo estado:
   - Si la respuesta resuelve la duda de forma inequívoca → cambia el estado a ✅ Claro y añade la respuesta a la **Descripción**, citando la entrevista como fuente adicional.
   - Si la respuesta es parcial o genera nuevas dudas → mantén el estado (⚠️/❓/🔲) y actualiza la Descripción explicando qué se aclaró y qué sigue pendiente.
   - Si la respuesta del cliente contradice lo que decían las fuentes originales → marca (o mantén) como ⚠️ Contradictorio, y documenta explícitamente el conflicto entre "lo documentado" y "lo dicho en la entrevista".
3. Si el cliente mencionó en la entrevista algún aspecto que no estaba en el mapa original, créalo como un nuevo `A-XXX` correlativo (continuando la numeración existente, no reutilices IDs), clasifícalo con el mismo criterio de 4 categorías, y cita la entrevista como única fuente si no hay documentación previa.
4. No borres ni renumeres los aspectos que no cambian: el objetivo es una actualización incremental y trazable, no una reescritura desde cero.
5. Actualiza el resumen estadístico (conteo y % por categoría) reflejando los cambios.
6. Actualiza también las "Acciones recomendadas" del mapa: elimina las ya resueltas, mantén o añade las pendientes.
7. Añade en la cabecera del documento una nota de versión (p.ej. "Versión 2 — actualizado tras entrevista del [fecha]").
8. Guarda el resultado como `mapa-proyecto-v2.md` en `investigar/[proyecto]/output-paso-legacy/` (no sobrescribas el original; ambas versiones deben quedar disponibles para trazabilidad).

## Input del usuario

[El usuario adjunta: mapa-proyecto.md + cuestionarios.md cumplimentados]

## Output esperado

`mapa-proyecto-v2.md` (misma estructura que el original, pero actualizado), guardado en `investigar/[proyecto]/output-paso-legacy/mapa-proyecto-v2.md`.
