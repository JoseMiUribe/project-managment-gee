# Prompt: Sub-paso 2 — Análisis y clasificación

> **Nivel:** 🧠 Diseño — requiere juicio y contexto del proyecto. Ejecuta esto en el modelo principal de la sesión, no lo delegues a un modelo económico.

## Instrucciones para la IA

Tienes el inventario de fuentes de un proyecto (archivo adjunto: `inventario-fuentes.md`) y una breve explicación del contexto proporcionada por el PM.

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

## Pasos de ejecución

1. Lee `inventario-fuentes.md` completo antes de empezar; no analices fuente por fuente de forma aislada, sino cruzando contenidos entre ellas.
2. Identifica primero las **dimensiones del proyecto** a cubrir (arquitectura, tecnología, flujos de negocio, equipo/roles, integraciones, datos, despliegue, seguridad, etc.). No te limites a lo que una sola fuente mencione: si el contexto dado por el PM sugiere un área relevante que ninguna fuente cubre, regístrala igualmente como 🔲 Inexistente.
3. Para cada dimensión, contrasta lo que dicen las distintas fuentes entre sí:
   - Si coinciden o no hay conflicto → ✅ Claro.
   - Si dos fuentes se contradicen explícitamente (fechas, responsables, tecnologías, cifras) → ⚠️ Contradictorio, citando ambas fuentes en conflicto.
   - Si la información existe pero es vaga, incompleta o usa términos sin definir → ❓ Ambiguo.
   - Si no hay ninguna fuente que la mencione → 🔲 Inexistente.
4. Asigna IDs correlativos `A-001`, `A-002`, ... a cada aspecto detectado, sin reutilizarlos.
5. En **Fuentes**, cita siempre los IDs `F-XXX` del inventario que respaldan la conclusión (para 🔲 Inexistente, indica "Ninguna" o la fuente donde se esperaría encontrarlo y no aparece).
6. En **Recomendación**, sé accionable: qué habría que hacer para cerrar el hueco (p.ej. "confirmar con arquitecto en entrevista técnica", "revisar código fuente del módulo X", "descartar por obsoleto").
7. No fuerces aspectos artificiales solo para rellenar la tabla: prioriza cobertura real sobre volumen.
8. Construye la tabla completa y, al final, añade el resumen estadístico (conteo y % de cada categoría sobre el total).
9. Guarda el resultado como `mapa-proyecto.md` en `investigar/[proyecto]/output-paso-legacy/`.

## Input del usuario

[El usuario adjunta inventario-fuentes.md y escribe un breve contexto del proyecto]

## Output esperado

Tabla markdown con todos los aspectos clasificados + resumen estadístico, guardada en `investigar/[proyecto]/output-paso-legacy/mapa-proyecto.md`.
