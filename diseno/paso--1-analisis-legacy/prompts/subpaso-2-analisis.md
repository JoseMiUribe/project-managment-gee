# Prompt: Sub-paso 2 — Análisis y clasificación

## Instrucciones para la IA

Tienes el inventario de fuentes de un proyecto (archivo adjunto: inventario-fuentes.md) y una breve explicación del contexto proporcionada por el PM.

Tu tarea es analizar toda la información y clasificar cada aspecto del proyecto en UNA de estas 4 categorías:

1. ✅ **CLARO**: Hechos confirmados por múltiples fuentes o sin contradicción aparente
2. ⚠️ **CONTRADICTORIO**: Dos o más fuentes dicen cosas distintas sobre el mismo tema
3. ❓ **AMBIGUO**: Información vaga, incompleta, o con terminología no definida
4. 🔲 **INEXISTENTE**: No hay documentación sobre este aspecto

Para cada item, indica:
- **Aspecto**: ¿De qué parte del proyecto habla? (arquitectura, tecnología, flujo, equipo, etc.)
- **Estado**: ✅ / ⚠️ / ❓ / 🔲
- **Descripción**: Explica el hallazgo
- **Fuentes**: IDs de las fuentes que respaldan esta conclusión
- **Recomendación**: ¿Qué habría que hacer para resolverlo?

Devuelve el análisis en una tabla markdown:

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-001 | | | | | |

Al final, incluye un resumen con el conteo de cada categoría.

## Input del usuario

[El usuario adjunta inventario-fuentes.md y escribe un breve contexto del proyecto]

## Output esperado

Tabla markdown con todos los aspectos clasificados + resumen estadístico.
