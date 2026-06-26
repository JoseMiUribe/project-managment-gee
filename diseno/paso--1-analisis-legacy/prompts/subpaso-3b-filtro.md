# Prompt: Sub-paso 3b — Filtro y guía para Paso 0

## Instrucciones para la IA

Tienes el mapa del proyecto (mapa-proyecto.md) con todos los aspectos clasificados como ✅ Claro, ⚠️ Contradictorio, ❓ Ambiguo, 🔲 Inexistente.

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

## Input del usuario

[El usuario adjunta mapa-proyecto.md y explica brevemente qué proyecto nuevo/evolutivo se quiere hacer]

## Output esperado

Una guía priorizada lista para usar en la entrevista con el cliente (Paso 0).
