# Prompt: Sub-paso 3b — Filtro y guía para Paso 0

> **Nivel:** 🧠 Diseño — requiere juicio y contexto del proyecto. Ejecuta esto en el modelo principal de la sesión, no lo delegues a un modelo económico.

## Instrucciones para la IA

Tienes el mapa del proyecto (`mapa-proyecto.md`) con todos los aspectos clasificados como ✅ Claro, ⚠️ Contradictorio, ❓ Ambiguo, 🔲 Inexistente.

Tu tarea es **filtrar** qué aspectos del mapa del proyecto impactan en lo NUEVO que el cliente quiere construir, y generar una guía priorizada para el Paso 0 (captura de requisitos de lo nuevo).

### Criterios de filtro

Incluye en la guía solo aquellos aspectos que:
1. **Bloquean decisiones futuras**: contradicciones que impiden diseñar o tomar decisiones sobre lo nuevo
2. **Son imprescindibles resolver**: ambigüedades sin las cuales no se puede avanzar
3. **Son lagunas críticas**: información que falta y sin ella no se puede empezar
4. **Generan riesgos**: aspectos que pueden afectar al éxito del nuevo proyecto
5. **Condicionan dependencias**: sistemas, equipos o tecnologías de las que dependa lo nuevo

### Formato de la guía

```markdown
# Guía para Paso 0 — [Nombre del Proyecto]

## 1. Contradicciones a resolver (priorizadas)

| ID | Contradicción | Impacta en | Pregunta para el cliente | Urgencia |
|---|---|---|---|---|
| | | | | Alta/Media/Baja |

## 2. Ambigüedades a clarificar

| ID | Aspecto ambiguo | Por qué es relevante para lo nuevo | Pregunta sugerida |
|---|---|---|---|

## 3. Información que falta (imprescindible)

| ID | Qué falta | Para qué se necesita | Dónde conseguirla |
|---|---|---|---|

## 4. Riesgos y dependencias detectadas

| ID | Riesgo/Dependencia | Impacto potencial | Confirmar con cliente |
|---|---|---|---|

## 5. Recomendaciones para la entrevista

- Orden sugerido de temas
- Perfiles recomendados para la reunión
- Documentación que debería traer el cliente
```

## Pasos de ejecución

1. Lee `mapa-proyecto.md` completo y el resumen que el usuario dé sobre el proyecto nuevo/evolutivo que se quiere construir.
2. Recorre cada aspecto (`A-XXX`) del mapa y aplica los 5 criterios de filtro uno a uno. Descarta explícitamente (no incluyas en la guía) los aspectos ✅ Claro que no tengan relación directa con lo nuevo, y también descarta los ⚠️/❓/🔲 que, aunque existan, no condicionen ninguna decisión sobre lo nuevo.
3. Para cada aspecto que sí pase el filtro, decide en cuál de las 4 secciones (contradicciones, ambigüedades, información faltante, riesgos/dependencias) encaja mejor; un mismo `A-XXX` puede aparecer en más de una sección si aplica (p.ej. una contradicción que además es una dependencia crítica).
4. Asigna **Urgencia** (Alta/Media/Baja) a cada contradicción según cuánto bloquee el arranque del Paso 0: Alta si impide empezar a diseñar, Media si se puede avanzar en paralelo, Baja si es aclaratoria pero no bloqueante.
5. En cada fila, redacta la pregunta/dato de forma que sea directamente utilizable en la entrevista, sin que el PM tenga que reinterpretarla.
6. En la sección 5, propone un orden de temas que minimice retrabajo (p.ej. resolver primero contradicciones de arquitectura antes de preguntar sobre integraciones que dependen de ella), sugiere qué perfiles del cliente deberían estar presentes (negocio, técnico, ambos) y qué documentación adicional debería aportar el cliente.
7. Si tras aplicar el filtro alguna sección queda vacía, indícalo explícitamente ("Sin hallazgos relevantes para lo nuevo") en lugar de dejar la tabla vacía sin explicación.
8. Guarda el resultado en `investigar/[proyecto]/output-paso-legacy/guia-paso-0.md` (este artefacto es el puente de entrada al Paso 0).

## Input del usuario

[El usuario adjunta mapa-proyecto.md y explica brevemente qué proyecto nuevo/evolutivo se quiere hacer]

## Output esperado

Una guía priorizada lista para usar en la entrevista con el cliente (Paso 0), guardada en `investigar/[proyecto]/output-paso-legacy/guia-paso-0.md`.
