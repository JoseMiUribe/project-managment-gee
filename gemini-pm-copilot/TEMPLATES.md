# TEMPLATES PM COPILOT

Plantillas simplificadas. Usa estas plantillas cuando crees los archivos para el usuario.

---

## TEMPLATE: ANALISIS DE FUENTES (Paso -1)

```markdown
# Analisis de Fuentes - [Nombre Proyecto]

## Fuentes identificadas

| Fuente | Tipo | Contenido principal | Clasificacion |
|--------|------|-------------------|---------------|
| F-001 | | | |
| F-002 | | | |
| F-003 | | | |

## Puntos claros
- 

## Puntos ambiguos
- 

## Contradicciones
- 

## Informacion que falta
- 
```

## TEMPLATE: CUESTIONARIOS (Paso -1)

```markdown
# Cuestionarios - [Nombre Proyecto]

## Preguntas de negocio
1. 
2. 
3. 

## Preguntas tecnicas
1. 
2. 
3. 
```

## TEMPLATE: REQUISITOS FUNCIONALES (Paso 0)

```markdown
# Requisitos Funcionales - [Nombre Proyecto]

| Codigo | Descripcion | Prioridad |
|--------|-------------|-----------|
| RF-001 | | ALTA/MEDIA/BAJA |
| RF-002 | | ALTA/MEDIA/BAJA |
| RF-003 | | ALTA/MEDIA/BAJA |
```

## TEMPLATE: REQUISITOS NO FUNCIONALES (Paso 0)

```markdown
# Requisitos No Funcionales - [Nombre Proyecto]

| Codigo | Descripcion | Tipo |
|--------|-------------|------|
| RNF-001 | | Rendimiento/Seguridad/Usabilidad/Disponibilidad |
| RNF-002 | | Rendimiento/Seguridad/Usabilidad/Disponibilidad |
| RNF-003 | | Rendimiento/Seguridad/Usabilidad/Disponibilidad |
```

## TEMPLATE: ZONAS DE INCERTIDUMBRE (Paso 0)

```markdown
# Zonas de Incertidumbre - [Nombre Proyecto]

| Codigo | Descripcion | Impacto | Como resolverlo |
|--------|-------------|---------|-----------------|
| ZI-001 | | ALTO/MEDIO/BAJO | |
| ZI-002 | | ALTO/MEDIO/BAJO | |
```

## TEMPLATE: REGISTRO DE RIESGOS (Paso 1)

```markdown
# Registro de Riesgos - [Nombre Proyecto]

Perfil del proyecto: [BAJO/MEDIO/ALTO/CRITICO] = [10/30/60/100]

| Codigo | Riesgo | Probabilidad | Impacto | PESO | RAG | Mitigacion |
|--------|--------|-------------|---------|------|-----|------------|
| R-001 | | 0.X | 0.X | | VERDE/AMARILLO/ROJO | |
| R-002 | | 0.X | 0.X | | VERDE/AMARILLO/ROJO | |

PESO = Probabilidad x Impacto x Perfil
VERDE < 10 | AMARILLO 10-30 | ROJO > 30
```

## TEMPLATE: REGISTRO DEPENDENCIAS (Paso 1)

```markdown
# Registro de Dependencias - [Nombre Proyecto]

| Codigo | Dependencia | De quien depende | Fecha limite | Estado |
|--------|-------------|-----------------|-------------|--------|
| DP-001 | | | | PENDIENTE/OK/BLOQUEADO |
| DP-002 | | | | PENDIENTE/OK/BLOQUEADO |
```

## TEMPLATE: REGISTRO ACCIONES (Paso 1)

```markdown
# Registro de Acciones - [Nombre Proyecto]

| Codigo | Accion | Responsable | Fecha limite | Estado |
|--------|--------|-------------|-------------|--------|
| A-001 | | | | PENDIENTE/OK |
| A-002 | | | | PENDIENTE/OK |
```

## TEMPLATE: EPICAS (Paso 2)

```markdown
# Epicas - [Nombre Proyecto]

| Codigo | Nombre | Descripcion | Requisitos incluidos |
|--------|--------|-------------|---------------------|
| EP-001 | | | RF-001, RF-002 |
| EP-002 | | | RF-003, RF-004 |
```

## TEMPLATE: DoR (Paso 2)

```markdown
# Definition of Ready - [Nombre Proyecto]

Una HU esta LISTA para empezar cuando:
1. [ ] Tiene criterios de aceptacion claros
2. [ ] 
3. [ ]
```

## TEMPLATE: DoD (Paso 2)

```markdown
# Definition of Done - [Nombre Proyecto]

Una HU esta TERMINADA cuando:
1. [ ] 
2. [ ]
3. [ ]
```

## TEMPLATE: CAPACIDAD DEL EQUIPO (Paso 2)

```markdown
# Capacidad del Equipo - [Nombre Proyecto]

## Composicion
- Desarrolladores: X
- Disenadores: X
- Testers: X
- Total personas: X

## Velocidad estimada
- Horas/dia/persona: X (restando reuniones)
- Dias/sprint: X
- Velocidad nominal: X horas/sprint
- Factor correccion: X%
- Factor DoD: X%
- Velocidad real: X horas/sprint

## Fiabilidad
[ALTA/MEDIA/BAJA]
```

## TEMPLATE: ROADMAP CLIENTE (Paso 2)

```markdown
# Roadmap Cliente - [Nombre Proyecto]

| Hito | Fecha estimada | Confianza | Entregable |
|------|---------------|-----------|------------|
| Inicio | | ALTA/MEDIA/BAJA | |
| Hito 1 | | ALTA/MEDIA/BAJA | |
| Entrega | | ALTA/MEDIA/BAJA | |
```

## TEMPLATE: ROADMAP TECNICO (Paso 2)

```markdown
# Roadmap Tecnico - [Nombre Proyecto]

| Sprint | Fechas | Epica | Dependencias | Acciones |
|--------|--------|-------|-------------|----------|
| Sprint 1 | | | DP-001 | A-001 |
| Sprint 2 | | | DP-002 | A-002 |
| Sprint 3 | | | | |
```

## TEMPLATE: SPRINT BACKLOG (Paso 3)

```markdown
# Sprint Backlog - Sprint X

Capacidad disponible: X horas

## HU incluidas
| HU | Descripcion | Estimacion | Tareas |
|----|-------------|-----------|--------|
| HU-001 | | | T-001, T-002 |
| HU-002 | | | T-003 |

## Tareas
| Tarea | Descripcion | Perfil | Horas |
|-------|-------------|--------|-------|
| T-001 | | | |
| T-002 | | | |

## Riesgos vinculados
- R-001
- R-002
```

## TEMPLATE: DAILY LOG (Paso 3)

```markdown
# Daily Log - YYYY-MM-DD

## Que se hizo ayer
- 

## Que se hara hoy
- 

## Impedimentos
- IM-001: [descripcion] -> Vinculado a R-00X
```

## TEMPLATE: SPRINT REVIEW (Paso 3)

```markdown
# Sprint Review - Sprint X

## Planificado vs Completado
- HU planificadas: X
- HU completadas: X
- Velocidad real: X

## No completado
- HU-00X: [motivo]

## Feedback del cliente
- 

## Acciones
- 
```

## TEMPLATE: RETROSPECTIVA (Paso 3)

```markdown
# Retrospectiva - Sprint X

## Que salio bien
1. 

## Que mejorar
1. 

## Acciones
| Accion | Responsable | Fecha |
|--------|-------------|-------|
| | | |
```
