# Requisitos Funcionales

## Capturados durante la sesión de diseño del 2024-06-24

### RF-01: Análisis de proyectos legacy (Paso -1)
**Prioridad**: Alta
**Descripción**: El sistema debe permitir al usuario cargar documentación estática (PDFs, Word, presentaciones, URLs, código fuente) y producir un análisis estructurado del proyecto.
**Sub-funcionalidades**:
- Clasificación del contenido en: claro, contradictorio, ambiguo, inexistente
- Generación de guía de entrevista adaptada al perfil del interlocutor (negocio vs técnico)
- Incorporación de feedback post-entrevista para refinar el análisis
- Generación de documentación consolidada y actualizada

### RF-02: Captura de requisitos (Paso 0)
**Prioridad**: Alta
**Descripción**: El sistema debe ayudar a capturar, clasificar y validar requisitos funcionales y no funcionales.
**Sub-funcionalidades**:
- Procesar inputs desde múltiples fuentes (transcripciones, emails, notas)
- Clasificación automática en funcional / no funcional
- Detección de no funcionales implícitos (derivados de los funcionales, políticas, estándares)
- Identificación de zonas de incertidumbre y riesgos asociados
- Generación de guía de preguntas para entrevista con el cliente

### RF-03: Framework GEE (Paso 1)
**Prioridad**: Alta
**Descripción**: El sistema debe gestionar dependencias, riesgos, acciones, impedimentos y cambios de alcance.
**Sub-funcionalidades**:
- Registro y seguimiento de dependencias con equipos externos (RAG, estado, fecha compromiso)
- Registro de riesgos con probabilidad, impacto, ámbito, respuesta, objetivos impactados y cálculo de peso/RAG
- Dos vistas del riesgo: FULL (interna con pesos) y simplificada (stakeholders)
- Acciones asociadas a riesgos con responsable y deadline
- Impedimentos (bloqueos materializados) vinculados a riesgos o dependencias
- ChangeLog con impacto en coste/alcance/plazo/calidad y generación de nuevos riesgos/dependencias/acciones
- DailyLog con trazabilidad a otros artefactos (R-XXX, D-XXX, A-XXX, SC-XXX, IM-XXX)
- Catálogo de riesgos comunes precargado (INFO Riesgos)
- Check Init de 16 puntos para arranque del proyecto

### RF-04: Roadmap y Backlog (Paso 2)
**Prioridad**: Media
**Descripción**: El sistema debe ayudar a construir un roadmap y descomponer el trabajo en épicas e historias de usuario.
**Sub-funcionalidades**:
- Agrupación de requisitos en entregables/épicas
- Roadmap temporal (de trimestres a semanas según certeza)
- Descomposición de épicas en historias de usuario con criterios de aceptación
- Priorización de backlog
- Adaptador de salida a Jira

### RF-05: Gestión de Sprints (Paso 3)
**Prioridad**: Media
**Descripción**: El sistema debe apoyar el ciclo completo de sprints (SCRUM/SCRUMBAN).
**Sub-funcionalidades**:
- Evaluación de Definition of Ready para cada HU
- Descomposición de HU en tareas técnicas durante Planning
- Sugerencia de descomposición técnica basada en histórico
- Plantilla estandarizada para Sprint Review
- Generación de lecciones aprendidas por sprint

### RF-06: Trazabilidad entre artefactos
**Prioridad**: Alta
**Descripción**: Todos los artefactos (riesgos, dependencias, acciones, cambios, impedimentos, dailylog) deben poder relacionarse entre sí mediante IDs únicos.

### RF-07: Adaptadores de salida
**Prioridad**: Media
**Descripción**: El sistema debe permitir exportar los artefactos a diferentes destinos mediante adaptadores configurables (Jira, Confluence, PDF, prompts para otras IAs).

## Leyenda de prioridad
- **Alta**: Imprescindible para el MVP
- **Media**: Importante, se puede añadir en segunda iteración
- **Baja**: Deseable, futuro incierto
