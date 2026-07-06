# Prompt: Sub-paso 3 — Guía de entrevista

> **Nivel:** 🧠 Diseño (con partes mecánicas) — la generación de preguntas requiere criterio; si el volumen es alto, puedes delegar el formateo final a un modelo económico pero revisa las preguntas generadas en el modelo principal.

## Instrucciones para la IA

Tienes el mapa del proyecto (archivo adjunto: `mapa-proyecto.md`) que identifica aspectos claros, contradictorios, ambiguos e inexistentes del proyecto.

Tu tarea es generar dos cuestionarios para entrevistar al cliente:

### Cuestionario A: Perfil de NEGOCIO
- Lenguaje sencillo, sin tecnicismos
- Preguntas orientadas a: propósito del sistema, usuarios, reglas de negocio, flujos de valor, prioridades
- Enfócate en resolver los items ❓ (ambiguos) y 🔲 (inexistentes) que tengan naturaleza de negocio

### Cuestionario B: Perfil TÉCNICO
- Lenguaje técnico preciso
- Preguntas orientadas a: arquitectura, tecnologías, integraciones, despliegue, deuda técnica, configuraciones
- Enfócate en resolver los items ⚠️ (contradictorios), ❓ (ambiguos) y 🔲 (inexistentes) de naturaleza técnica

### Formato de cada pregunta:
| # | Pregunta | Aspecto a resolver | IDs relacionados | Notas para el entrevistador |
|---|---|---|---|---|
| 1 | | | A-XXX | |

## Pasos de ejecución

1. Lee `mapa-proyecto.md` y separa los aspectos (`A-XXX`) en dos grupos según su naturaleza: de negocio (propósito, usuarios, reglas, prioridades, valor) o técnica (arquitectura, tecnología, integraciones, despliegue, deuda técnica).
2. Si un aspecto tiene componentes mixtos (p.ej. una contradicción que afecta tanto a negocio como a técnica), inclúyelo en ambos cuestionarios pero formulando la pregunta con el enfoque y lenguaje propios de cada perfil.
3. Para el **Cuestionario A (Negocio)**: prioriza los ❓ y 🔲 de naturaleza de negocio. Redacta cada pregunta en lenguaje llano, evitando jerga técnica, y formúlala de forma abierta para no inducir la respuesta.
4. Para el **Cuestionario B (Técnico)**: prioriza los ⚠️, ❓ y 🔲 de naturaleza técnica. Redacta cada pregunta con precisión técnica; si hay una contradicción entre fuentes, formula la pregunta citando explícitamente ambas versiones para que el cliente las resuelva ("La documentación X indica A, pero el código Y sugiere B, ¿cuál es la situación real?").
5. Numera las preguntas correlativamente dentro de cada cuestionario (no compartas la numeración entre A y B).
6. En **IDs relacionados**, cita siempre el/los `A-XXX` del mapa que la pregunta busca resolver.
7. En **Notas para el entrevistador**, añade contexto útil y accionable: qué respuesta se espera, qué evitar preguntar de forma cerrada, o alertas si el tema es sensible.
8. No generes preguntas redundantes: si dos aspectos ambiguos apuntan a la misma laguna de información, combínalos en una sola pregunta y cita ambos IDs.
9. Guarda el resultado como `cuestionarios.md` en `investigar/[proyecto]/output-paso-legacy/`, dejando la columna "Respuesta" vacía para que el PM la rellene durante la entrevista (ver plantilla `cuestionarios.md`).

## Input del usuario

[El usuario adjunta mapa-proyecto.md]

## Output esperado

Dos tablas markdown (una por perfil) con preguntas listas para usar, guardadas en `investigar/[proyecto]/output-paso-legacy/cuestionarios.md`.
