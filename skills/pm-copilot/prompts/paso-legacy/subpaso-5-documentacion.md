# Prompt: Sub-paso 5 — Documentación estable

> **Nivel:** 🧠 Diseño — requiere juicio y contexto del proyecto. Ejecuta esto en el modelo principal de la sesión, no lo delegues a un modelo económico.

## Instrucciones para la IA

Tienes el mapa del proyecto actualizado (`mapa-proyecto-v2.md`) y todas las fuentes originales.

Tu tarea es redactar una documentación consolidada y profesional del proyecto. Debe incluir:

1. **Visión general** (2-3 párrafos para negocio): ¿Qué hace el sistema? ¿Para quién? ¿Qué valor aporta?
2. **Arquitectura y componentes** (para técnicos): Diagrama textual, descripción de cada componente, tecnologías usadas
3. **Glosario de términos**: Definiciones de la terminología específica del proyecto
4. **Estado real de cada componente**: Estable / Legacy / En migración / Desaparecido
5. **Decisiones técnicas (ADRs)**: Si se encontraron decisiones clave documentadas
6. **Pendientes**: Lo que no se ha podido determinar y queda abierto

Formato: Documentación estructurada en markdown, lista para compartir o importar.

## Pasos de ejecución

1. Lee `mapa-proyecto-v2.md` completo y revisa las fuentes originales (`inventario-fuentes.md` y los documentos referenciados) para completar detalles que el mapa resuma pero no desarrolle.
2. Redacta la **Visión general** en lenguaje de negocio, sin tecnicismos, basándote en los aspectos ✅ Claro relacionados con propósito, usuarios y valor. Si algún elemento de la visión sigue siendo ❓/🔲 tras la entrevista, no lo des por hecho: formúlalo con cautela o remítelo a "Pendientes".
3. Redacta **Arquitectura y componentes**: construye el diagrama textual reflejando únicamente relaciones confirmadas (✅) o aclaradas en la entrevista; para cada componente, documenta responsabilidad, tecnología y estado. Si hay contradicciones no resueltas sobre un componente, indícalo explícitamente en la columna "Notas" en lugar de elegir arbitrariamente una versión.
4. Construye el **Glosario**: extrae todos los términos específicos del proyecto (nombres de módulos, siglas internas, conceptos de negocio propios) que aparezcan en las fuentes o en la entrevista, y da una definición clara y verificada; no incluyas términos genéricos de la industria salvo que se usen con un significado particular en este proyecto.
5. Completa el **Estado real de cada componente** con una de las 4 categorías (Estable / Legacy / En migración / Desaparecido), justificando brevemente en "Observaciones" la evidencia que sustenta esa clasificación.
6. Documenta las **Decisiones técnicas (ADRs)** solo si hay evidencia real de una decisión tomada (contexto, decisión, consecuencias); no inventes ADRs para rellenar la sección — si no se encontró ninguna, indícalo explícitamente.
7. En **Pendientes y riesgos**, vuelca los aspectos que en `mapa-proyecto-v2.md` sigan como ⚠️/❓/🔲 tras la entrevista, priorizados por impacto.
8. Añade la sección de **Anexos** enlazando a `inventario-fuentes.md`, `mapa-proyecto-v2.md` y `cuestionarios.md`.
9. Guarda el documento completo como `documentacion-proyecto.md` en `investigar/[proyecto]/output-paso-legacy/`.

## Input del usuario

[El usuario adjunta: mapa-proyecto-v2.md + todas las fuentes originales]

## Output esperado

Documentación completa en markdown, guardada en `investigar/[proyecto]/output-paso-legacy/documentacion-proyecto.md`.

## Actualizar documento oficial del proyecto

Al finalizar, actualiza `investigar/[proyecto]/documentacion-proyecto.md` (el documento oficial y vivo del proyecto, distinto del artefacto de este paso) con la información generada en este paso:
- **Resumen Ejecutivo**: visión general del proyecto
- **Datos del Proyecto**: nombre, cliente, sector, stakeholders
- **Alcance**: lo que incluye y no incluye, criterios de éxito
- **Decisiones Clave**: ADRs encontrados durante el análisis
- **Anexos**: añadir referencia a los artefactos de este paso (`investigar/[proyecto]/output-paso-legacy/`)
