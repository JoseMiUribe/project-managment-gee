# TEMPLATES - FORMATOS DE OUTPUT

Usa estos formatos cuando produzcas documentos. Son ejemplos de estructura, no instrucciones de archivos.

## TABLA DE CLASIFICACION DE FUENTES

| Fuente | Tipo | Contenido | Clasificacion |
|--------|------|-----------|---------------|
| F-001 | PDF pliego | Requisitos tecnicos | CLARO |
| F-002 | Correo | Fechas | CONTRADICTORIO |

## LISTA DE REQUISITOS FUNCIONALES

| Codigo | Descripcion | Prioridad |
|--------|-------------|-----------|
| RF-001 | Como usuario quiero registrarme | ALTA |
| RF-002 | Como admin quiero ver reportes | MEDIA |

## LISTA DE REQUISITOS NO FUNCIONALES

| Codigo | Descripcion | Tipo |
|--------|-------------|------|
| RNF-001 | Carga en menos de 2s | Rendimiento |
| RNF-002 | Solo acceso autenticado | Seguridad |

## ZONAS DE INCERTIDUMBRE

| Codigo | Descripcion | Impacto |
|--------|-------------|---------|
| ZI-001 | No sabemos numero de usuarios | ALTO |

## REGISTRO DE RIESGOS

Perfil: [X]
| Codigo | Riesgo | Prob | Impacto | PESO | RAG | Mitigacion |
|--------|--------|------|---------|------|-----|------------|
| R-001 | | 0.X | 0.X | X.X | V/A/R | |

## REGISTRO DE DEPENDENCIAS

| Codigo | Dependencia | Quien | Fecha limite | Estado |
|--------|-------------|-------|-------------|--------|
| DP-001 | | | | PENDIENTE |

## REGISTRO DE ACCIONES

| Codigo | Accion | Responsable | Fecha | Estado |
|--------|--------|-------------|-------|--------|
| A-001 | | | | PENDIENTE |

## EPICAS

| Codigo | Nombre | Descripcion | RF incluidos |
|--------|--------|-------------|-------------|
| EP-001 | | | RF-001, RF-002 |

## CAPACIDAD DEL EQUIPO

- Personas: X (X devs, X dis, X test)
- Horas/dia/persona: X
- Dias/sprint: X
- Velocidad nominal: X h/sprint
- Velocidad real: X h/sprint
- Fiabilidad: ALTA/MEDIA/BAJA

## ROADMAP CLIENTE

| Hito | Fecha | Confianza |
|------|-------|-----------|
| Inicio | | ALTA |

## ROADMAP TECNICO

| Sprint | Fechas | Epica | Deps | Acciones |
|--------|--------|-------|------|----------|
| Sprint 1 | | | DP-001 | A-001 |

## HISTORIA DE USUARIO (HU)

Como [rol] quiero [accion] para [beneficio]

Criterios de aceptacion:
- [ ]
- [ ]

Estimacion: [S/M/L/XL]

## SPRINT BACKLOG

Capacidad: X horas
| HU | Descripcion | Tareas |
|----|-------------|--------|
| HU-001 | | T-001, T-002 |

| Tarea | Descripcion | Perfil | Horas |
|-------|-------------|--------|-------|
| T-001 | | | |

## DAILY LOG

Ayer: [ ]
Hoy: [ ]
Impedimentos: IM-001: [ ] -> R-00X

## SPRINT REVIEW

Completado: HU-001, HU-002
No completado: HU-003 (motivo)
Velocidad real: X (estimada: X)
Feedback: [ ]

## RETROSPECTIVA

Bien: 1. [ ]
Mejorar: 1. [ ]
Acciones: [accion] -> [responsable] -> [fecha]
