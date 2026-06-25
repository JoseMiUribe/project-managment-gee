# Paso 2: Roadmap + Backlog

## Propósito
Construir un roadmap temporal y descomponer el trabajo en entregables, épicas e historias de usuario, priorizados y listos para pasar a sprints.

## Pipeline

### Sub-paso 2.1: Agrupación en Entregables/Épicas
- **Input**: Requisitos funcionales + no funcionales + riesgos/acciones (del Paso 0 y GEE)
- **Proceso**: La IA agrupa requisitos en bloques coherentes de negocio
- **Output**: `epicas.md`
  - Cada épica: ID (EP-XXX), nombre, objetivo, requisitos que la componen, dependencias asociadas, riesgos asociados

### Sub-paso 2.2: Roadmap temporal
- **Input**: épicas.md + dependencias (fechas compromiso) + riesgos
- **Proceso**: La IA propone línea de tiempo basada en:
  - Volumen de cada épica
  - Dependencias externas (si DP-XXX tiene fecha Q2, esa épica no va antes)
  - Riesgos (alto riesgo → ponerlo temprano o con colchón)
  - Prioridad del cliente
- **Formato**: Flexible. Trimestres si hay incertidumbre, semanas si hay certeza.
- **Output**: `roadmap.md` con hitos y franjas temporales

### Sub-paso 2.3: Descomposición del próximo entregable
- **Input**: épica más próxima del roadmap
- **Proceso**: La IA descompone en Historias de Usuario
- **Formato HU**: "Como [rol] quiero [acción] para [valor]"
- **Output**: `backlog-detalle.md`
  - Cada HU: ID (HU-XXX), título, descripción, criterios de aceptación, dependencias, notas técnicas
- **Nota**: Solo se descomponen las épicas de los próximos 1-2 meses. Las demás quedan como épicas sin detalle.

### Sub-paso 2.4: Priorización
- **Input**: backlog-detalle.md
- **Proceso**: Se ordenan las HU por valor de negocio, dependencias, riesgo
- **Output**: backlog-detalle.md actualizado con orden

### Sub-paso 2.5: Salida a Jira (adaptador)
- Transforma épicas + HU al formato requerido por Jira (CSV/JSON)
- En futura versión: conexión directa con API de Jira

## Principios
- El roadmap es un artefacto VIVO: se actualiza con cambios de dependencias, riesgos materializados, cambios de alcance o velocidad del equipo
- YAGNI: no descomponer épicas lejanas hasta que toque
- Priorización basada en valor + riesgo + dependencias
