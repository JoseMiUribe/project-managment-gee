# Prompt: Sub-paso 5 — Documentación estable

## Instrucciones para la IA

Tienes el mapa del proyecto actualizado (mapa-proyecto-v2.md) y todas las fuentes originales.

Tu tarea es redactar una documentación consolidada y profesional del proyecto. Debe incluir:

1. **Visión general** (2-3 párrafos para negocio): ¿Qué hace el sistema? ¿Para quién? ¿Qué valor aporta?
2. **Arquitectura y componentes** (para técnicos): Diagrama textual, descripción de cada componente, tecnologías usadas
3. **Glosario de términos**: Definiciones de la terminología específica del proyecto
4. **Estado real de cada componente**: Estable / Legacy / En migración / Desaparecido
5. **Decisiones técnicas (ADRs)**: Si se encontraron decisiones clave documentadas
6. **Pendientes**: Lo que no se ha podido determinar y queda abierto

Formato: Documentación estructurada en markdown, lista para compartir o importar.

## Input del usuario

[El usuario adjunta: mapa-proyecto-v2.md + todas las fuentes originales]

## Output esperado

Documentación completa en markdown (`documentacion-proyecto.md`).

## Actualizar documento oficial del proyecto

Al finalizar, actualiza `investigar/[proyecto]/documentacion-proyecto.md` con la información generada en este paso:
- **Resumen Ejecutivo**: visión general del proyecto
- **Datos del Proyecto**: nombre, cliente, sector, stakeholders
- **Alcance**: lo que incluye y no incluye, criterios de éxito
- **Decisiones Clave**: ADRs encontrados durante el análisis
- **Anexos**: añadir referencia a los artefactos de este paso
