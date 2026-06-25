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

## Estado actual del diseño

- [x] Paso -1: Análisis de Legacy (DISEÑADO)
- [x] Paso 0: Captura de Requisitos (DISEÑADO)
- [x] Paso 1: Framework GEE (DISEÑADO)
- [x] Paso 2: Roadmap + Backlog (DISEÑADO)
- [x] Paso 3: Gestión de Sprints (DISEÑADO)
- [ ] Plan de implementación (PENDIENTE)
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
