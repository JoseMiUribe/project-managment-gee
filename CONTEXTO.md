# CONTEXTO

## Identidad del proyecto

Este es el diseño de un **PM Copilot**: un sistema (plugin, aplicación, lo que se determine en la implementación) que automatiza y procedimentaliza el workflow de un Jefe de Proyecto / ADL (Account Delivery Leader) en Paradigma Digital.

## ¿Por qué existe?

El usuario (Jefe de Proyecto en Paradigma Digital) necesita un asistente que le ayude a gestionar proyectos de principio a fin: desde entender el legacy de un proyecto existente, capturar requisitos, gestionar dependencias/riesgos/acciones, hasta la ejecución de sprints y cierre.

## Capas del proyecto

### Capa 0: Workspace de diseño
El lugar donde diseñamos ESTE producto. Cualquier IA (OpenCode, Claude, ChatGPT, Gemini) debe poder llegar y continuar el trabajo sin pérdida de información.

### Capa 1: El producto (PM Copilot)
El sistema que estamos diseñando. Pipeline de pasos desacoplados que producen artefactos markdown estándar.

## Decisiones de diseño tomadas

| Fecha | Decisión | Alternativas | Motivación |
|---|---|---|---|
| 2024-06-24 | Workspace con estructura de carpetas md | Estructura plana | Claridad, escalabilidad, cualquier IA lo entiende |
| 2024-06-24 | Pipeline desacoplado con artefactos estándar | Monolito acoplado | Flexibilidad: cambiar un paso sin romper otros |
| 2024-06-24 | Adaptadores de salida configurables | Salida fija a Jira | Preparado para múltiples destinos (Confluence, PDF, prompt IA) |
| 2024-06-24 | GEE extraído de POLARIS (Paradigma) | Framework propio | Basado en práctica real ya validada en la empresa |
| 2024-06-24 | Dos vistas del riesgo (FULL + simplificada) | Una sola vista | Necesidades distintas: equipo técnico vs stakeholders |
| 2024-06-24 | Catálogo META con pesos y RAG automático | Sin pesos, RAG manual | Automatización del cálculo de prioridad |
| 2024-06-26 | Filtro en Paso -1 (subpaso-3b) | Sin filtro, pasar todo al Paso 0 | Depurar contradicciones que realmente impactan en lo nuevo |
| 2024-06-26 | Dos guías para Paso 0: legacy + estándar | Una única guía genérica | Escenarios distintos: proyecto con legacy vs proyecto nuevo |
| 2024-06-26 | Grafo + Vectorial como capa transversal de datos | Solo vectorial, solo grafo, o ninguno | Complementarios: grafo para relaciones, vectorial para búsqueda semántica |
| 2024-06-26 | Check Init (16 puntos) post-Paso 0 pre-GEE | Check Init al inicio absoluto | Tiene sentido ejecutarlo cuando ya conoces el proyecto pero antes de gestionar riesgos |
| 2024-06-26 | Perfil del proyecto (META) como ponderador de riesgos | Multiplicador fijo para todos los proyectos | Cada proyecto tiene distinta criticidad; el mismo riesgo pesa distinto según perfil |

## Estado actual del diseño

- [x] Paso -1: Análisis de Legacy (DISEÑADO + IMPLEMENTADO)
- [x] Paso 0: Captura de Requisitos (DISEÑADO)
- [x] Paso 1: Framework GEE (DISEÑADO + REFINADO con META, Check Init, dos vistas)
- [x] Paso 2: Roadmap + Backlog (DISEÑADO)
- [x] Paso 3: Gestión de Sprints (DISEÑADO)
- [x] Modelo Grafo + Vectorial (DISEÑADO)
- [x] Flujo Transversal entre pasos (DISEÑADO)
- [ ] Plan de implementación global (PENDIENTE)
- [ ] Implementación del Paso 0 (PENDIENTE)
- [ ] Scripts de población del grafo (PENDIENTE)
- [ ] Proyecto 2: Capacity Planner (PENDIENTE, separado)

## Glosario

- **GEE**: Gestión de Entregables y Eventos. Framework simplificado extraído de POLARIS.
- **POLARIS**: Framework de gestión de proyectos de Paradigma Digital.
- **ADL**: Account Delivery Leader, rol equivalente a Jefe de Proyecto.
- **DoR**: Definition of Ready. Condiciones que una HU debe cumplir para entrar en un sprint.
- **RAG**: Indicador Rojo/Amarillo/Verde de estado.
- **HU**: Historia de Usuario.
- **Épica**: Gran funcionalidad o entregable que agrupa varias HU.
- **Artefacto**: Documento markdown estándar que es input/output de un paso del pipeline.
- **Grafo**: Base de datos de grafos (Neo4j) para almacenar y consultar relaciones entre entidades del proyecto.
- **Vectorial**: Base de datos vectorial para búsqueda semántica sobre documentos del proyecto.
- **META**: Catálogo de valores canónicos con pesos (probabilidad, impacto, perfil proyecto) que estandarizan cálculos.
- **Check Init**: Checklist de 16 puntos para verificar condiciones de arranque del proyecto.
- **Filtro (subpaso-3b)**: Paso que depura qué elementos del legacy impactan realmente en lo nuevo antes de pasar al Paso 0.
