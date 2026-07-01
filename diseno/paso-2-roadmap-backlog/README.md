# Paso 2: Roadmap + Backlog

## Propósito
Construir un roadmap temporal realista (basado en capacidad real del equipo y el DoD del proyecto) y descomponer el trabajo en entregables, épicas e historias de usuario, priorizados y listos para sprints.

## Pipeline

### Sub-paso 2.1: Agrupación en Entregables/Épicas
- **Input**: Requisitos funcionales + no funcionales + riesgos/acciones (del Paso 0 y GEE)
- **Proceso**: La IA agrupa requisitos en bloques coherentes de negocio
- **Output**: `epicas.md`
  - Cada épica: ID (EP-XXX), nombre, objetivo, requisitos, dependencias, riesgos asociados

### Sub-paso 2.1a: Definir DoR y DoD del proyecto ⭐
- **Input**: Templates base de DoR/DoD (de `diseno/paso-3-gestion-sprints/templates/`)
- **Tres modos de entrada** (elige el PM):
  1. **Cuestionario guiado**: la IA pregunta criterio por criterio qué exige el equipo
  2. **Plantilla**: el PM se lleva las plantillas base y las devuelve personalizadas
  3. **Mixto**: algunas preguntas ahora, otras las completa el equipo después
- **Output**: `config/dor-definition.md` y `config/dod-definition.md`
- **Impacto en el roadmap**: el DoD añade esfuerzo a cada HU (tests, doc, seguridad, monitoreo). La capacidad del equipo se ajusta según el perfil DoD. El DoR añade colchón por dependencias en la planificación.
- **Prompt**: `prompts/definir-dor-dod.md`

### Sub-paso 2.1b: Capacidad del Equipo ⭐
- **Input**: Composición del equipo + DoD del proyecto (de config/dod-definition.md)
- **Tres modos de entrada** (elige el PM):
  1. **Cuestionario guiado**: la IA pregunta paso a paso (recomendado para PM que conoce al equipo)
  2. **Plantilla**: el PM se lleva una plantilla, la rellena con el equipo y la devuelve
  3. **Mixto**: algunas respuestas por cuestionario, otras por plantilla
- **Output**: `capacidad-equipo.md` (versionado: cada actualización añade una nueva versión, no borra la anterior)
  - Composición del equipo (rol, especialidad, disponibilidad, seniority)
  - Velocidad estimada (pts/sprint) con horquilla (optimista, realista, pesimista)
  - Fiabilidad del cálculo (ALTA si hay datos históricos, MEDIA si hay estimaciones del TL, BAJA si es intuición)
  - Factor de corrección por especialidad (ej: 80% backend / 20% frontend con equipo desbalanceado)
  - **Factor DoD**: el esfuerzo adicional que exige el DoD se resta de la velocidad nominal (ej: DoD con tests+doc → -30%)
  - Buffer por riesgos GEE aplicados a capacidad
  - Histórico de versiones para ver evolución
- **Prompt**: `prompts/cuestionario-capacidad.md`
- **Template**: `templates/plantilla-capacidad.md`
- **Template output**: `templates/output-capacidad.md`

### Sub-paso 2.2a: Roadmap Cliente (hitos generales)
- **Input**: épicas.md + capacidad-equipo.md + DoR/DoD + riesgos/dependencias
- **Proceso**: Construye una línea de tiempo con franjas amplias (trimestres/meses) y rangos de fecha
- **Output**: `roadmap-cliente.md`
  - Hitos de negocio (no técnicos)
  - Rangos de entrega (ej: "Q3-Q4 2026", no "15 de septiembre")
  - Nivel de confianza por hito (🔥 alto riesgo, ⚠️ riesgo medio, ✅ confianza alta)
  - Lenguaje claro para stakeholders no técnicos
  - Premisas y condiciones (si X no ocurre, la fecha se mueve)
- **Template**: `templates/roadmap-cliente.md`

### Sub-paso 2.2b: Roadmap Técnico (detallado)
- **Input**: épicas.md + capacidad-equipo.md + DoR/DoD + GEE (riesgos, dependencias, acciones)
- **Proceso**: Construye una línea de tiempo detallada con:
  - Dependencias con deadlines internos (fecha límite para resolver DP-XXX)
  - Acciones de riesgo con deadline (fecha para implementar la mitigación de R-XXX)
  - Secuencia técnica (infraestructura primero, luego features core, luego mejoras)
  - Colchón por DoR: si el DoR exige dependencias resueltas antes de empezar, planificar sprints de preparación
- **Output**: `roadmap-tecnico.md`
  - Sprints planificados con épicas/HU asignadas
  - Fechas objetivo por sprint (con margen)
  - Deadlines de dependencias y acciones de riesgo
  - Hitos técnicos (entornos listos, APIs disponibles, releases internos)
  - Quién trabaja en qué (asignación por perfiles)
- **Template**: `templates/roadmap-tecnico.md`

### Sub-paso 2.3: Descomposición del próximo entregable
- **Input**: épica más próxima del roadmap
- **Proceso**: La IA descompone en Historias de Usuario
- **Formato HU**: "Como [rol] quiero [acción] para [valor]"
- **Output**: `backlog-detalle.md`
  - Cada HU: ID (HU-XXX), título, descripción, criterios de aceptación, dependencias, notas técnicas
- **Nota**: Solo se descomponen las épicas de los próximos 1-2 meses. Las demás quedan como épicas sin detalle.

### Sub-paso 2.4: Priorización
- **Input**: backlog-detalle.md
- **Proceso**: Se ordenan las HU por valor de negocio, dependencias, riesgo, capacidad disponible
- **Output**: backlog-detalle.md priorizado

### Sub-paso 2.5: Salida a Jira (adaptador)
- Transforma épicas + HU al formato requerido por Jira (CSV/JSON)
- En futura versión: conexión directa con API de Jira

## Actualizar documento oficial del proyecto

Al finalizar el paso, actualiza `investigar/[proyecto]/documentacion-proyecto.md`:
- **Equipo y Capacidad**: poblar composición del equipo, velocidad estimada y factor DoD
- **Roadmap**: poblar hitos de negocio con ventanas y confianza, y plan de sprints
- **Anexos**: añadir referencia a los artefactos de este paso

## Principios
- **El roadmap es VIVO**: se actualiza con cambios de dependencias, riesgos, velocidad del equipo o cambios de alcance
- **YAGNI**: no descomponer épicas lejanas hasta que toque
- **Priorización**: valor + riesgo + dependencias + capacidad disponible
- **Dos audiencias, dos roadmap**: el cliente ve hitos y rangos; el equipo ve sprints y deadlines
- **Mejor un roadmap con incertidumbre que ninguno**: la dirección es más valiosa que la precisión falsa
- **Fiabilidad explícita**: el roadmap indica el nivel de confianza de cada estimación
- **DoR/DoD afectan al roadmap**: el DoD reduce la velocidad efectiva; el DoR exige colchón de planificación. Definirlos antes es necesario para un roadmap realista.
