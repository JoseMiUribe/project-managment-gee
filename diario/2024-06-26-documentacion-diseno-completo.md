# Diario: 2024-06-26 — Documentación diseño completo + permisos build

## Qué pasó

- Se identificó que OpenCode estaba en modo solo-lectura (Plan Mode)
- El usuario cambió a modo Build concediendo permisos completos
- Se documentaron todos los nuevos elementos de diseño en los archivos del workspace

## Archivos creados

- `diseno/paso--1-analisis-legacy/prompts/subpaso-3b-filtro.md`: Nuevo sub-paso que filtra contradicciones del legacy que impactan en lo nuevo y genera guia-paso-0.md
- `diseno/paso--1-analisis-legacy/README.md`: Actualizado con el pipeline completo (6 sub-pasos), incluyendo filtro, poblado de grafo y guia-paso-0.md como salida
- `diseno/paso-0-captura-requisitos/templates/guia-estandar-paso-0.md`: Cuestionario genérico para proyectos nuevos (sin legacy)
- `diseno/paso-0-captura-requisitos/README.md`: Completado con dos escenarios (A: nuevo, B: legacy), pipeline de 5 sub-pasos, y conexiones con otros pasos
- `diseno/modelo-grafo-vectorial/README.md`: Esquema completo de entidades y relaciones para grafo, contenido a indexar en vectorial, integración combinada y poblado desde cada paso del pipeline
- `diseno/flujo-transversal/README.md`: Diagrama de flujo, conexiones entre pasos, Check Init como elemento transversal, perfil META del proyecto

## Archivos modificados

- `CONTEXTO.md`: Nuevas decisiones de diseño (filtro, dos guías, grafo+vectorial, Check Init, perfil META). Estado actualizado. Glosario ampliado.
- `INSTRUCCIONES.md`: Estructura de directorios actualizada con nuevas carpetas

## Decisiones tomadas

- El diseño completo de los 5 pasos + grafo/vectorial + flujo transversal está documentado en el workspace
- El Paso -1 tiene prompts y templates implementados; el resto están aprobados en diseño pero pendientes de implementar
- Próximo hito: plan de implementación global

## Pendientes

- Plan de implementación global (orden de pasos, dependencias, MVP)
- Implementación Paso 0 (prompts + templates)
- Scripts de población de grafo desde artefactos md
- Revisar y hacer commit de estos cambios
