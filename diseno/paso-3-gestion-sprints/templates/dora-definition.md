# Template: Definition of Ready (DoR)

**Propósito:** Determinar si una HU está lo suficientemente madura para entrar en un sprint.
**Importante:** Este template es un **punto de partida**. Cada equipo/proyecto debe personalizarlo.

## Cómo usar

1. Al empezar un proyecto, preguntar al equipo: "¿Qué condiciones debe cumplir una HU para estar Ready?"
2. Usar este template como base
3. Personalizar, añadir o quitar criterios según el proyecto
4. Guardar la versión acordada como `dor-definition.md` en la carpeta del proyecto

## Checklist base

| # | Criterio | Descripción | Responsable |
|---|---|---|---|
| DOR-01 | Descripción clara | La HU describe QUÉ hay que hacer, para QUIÉN y PARA QUÉ (formato "Como... quiero... para...") | PO / PM |
| DOR-02 | Criterios de aceptación | Hay al menos 1 criterio de aceptación en formato Gherkin (Dado/Cuando/Entonces) | PO |
| DOR-03 | Criterios de aceptación verificables | Los criterios son objetivos y comprobables (no "funciona bien" sino "responde en <2s") | PO + Equipo |
| DOR-04 | Dependencias conocidas | Se han identificado dependencias con otras HU, equipos o sistemas externos | PO + PM |
| DOR-05 | Dependencias no bloqueantes | Ninguna dependencia bloquea el inicio de la HU (si bloquea, la HU no está Ready) | PM |
| DOR-06 | Riesgos identificados | Riesgos conocidos asociados a la HU están documentados | PM |
| DOR-07 | El equipo entiende el QUÉ | El equipo de desarrollo ha leído la HU y no tiene dudas sobre qué hay que hacer (validado en refinamiento) | Equipo |
| DOR-08 | Mockups/diseños (si aplica) | Si la HU tiene componente visual, los diseños están aprobados | Diseñador + PO |
| DOR-09 | Tamaño estimado | La HU tiene una estimación de tamaño relativo (puntos, talla S/M/L) | Equipo |
| DOR-10 | HU no gigante | La HU es lo suficientemente pequeña para completarse en un sprint (si no, descomponer) | Equipo |

## Criterios opcionales (según el proyecto)

| # | Criterio | Cuándo aplica |
|---|---|---|
| DOR-11 | Pruebas unitarias planificadas | Proyectos con cobertura obligatoria |
| DOR-12 | Acceso a entornos/hardware confirmado | Si requiere hardware específico o terceros |
| DOR-13 | Datos de prueba disponibles | Si requiere datos sintéticos o reales anonimizados |
| DOR-14 | Documentación de soporte lista | Proyectos con requisitos de documentación obligatoria |

## Estados DoR

| Estado | Significado |
|---|---|
| ✅ Ready | Pasa todos los criterios obligatorios. Puede entrar en sprint |
| ⏳ Pendiente | No evaluado aún |
| ❌ No Ready | No cumple algún criterio. Vuelve a backlog para refinamiento |
