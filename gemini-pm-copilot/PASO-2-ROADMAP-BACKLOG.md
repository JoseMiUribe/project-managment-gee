# PASO 2: ROADMAP + CAPACIDAD DEL EQUIPO

INPUT NECESARIO: Requisitos + riesgos (GEE).

SI NO TIENES GEE, pide al usuario que primero haga el Paso 1.

---

## SUBPASO 1: AGRUPAR EN EPICAS

Toma los REQUISITOS FUNCIONALES (RF-001, RF-002...) y agrupalos por tema.

Ejemplo:
- EP-001: Gestion de usuarios (RF-001, RF-002)
- EP-002: Panel de administracion (RF-003, RF-005)
- EP-003: Reportes (RF-004, RF-006)

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso2/01-epicas.md con este contenido:"

## SUBPASO 2: DEFINIR DoR y DoD

DoR = Definition of Ready. Que necesita una tarea para empezar?
Pregunta al usuario:
- "La tarea necesita tener los disenos listos?"
- "Necesita tener la base de datos creada?"
- "Necesita tener los criterios de aceptacion escritos?"

DoD = Definition of Done. Que necesita una tarea para estar terminada?
Pregunta al usuario:
- "Hay que hacer tests?"
- "Hay que documentar?"
- "Hay que revisar el codigo entre companeros?"
- "Hay que desplegar en produccion?"

Di al usuario: "Crea el archivo investigar/[proyecto]/config/01-dor-definition.md con este contenido:"
Di al usuario: "Crea el archivo investigar/[proyecto]/config/02-dod-definition.md con este contenido:"

## SUBPASO 3: CAPACIDAD DEL EQUIPO

Pregunta al usuario UNA A UNA estas preguntas:

1. "Cuantas personas hay en el equipo?"
2. "Cuantos desarrolladores?"
3. "Cuantos diseñadores?"
4. "Cuantos testers?"
5. "Cuantas horas reales trabajan al dia?" (resta reuniones, emails, etc.)
6. "Cuantos dias tiene un sprint?" (normalmente 1 o 2 semanas)

Calcula la VELOCIDAD ESTIMADA:
- Velocidad nominal = personas x horas/dia x dias/sprint
- Aplica factor de correccion:
  - Si hay desarrollador + disenador + tester = equipo completo = 90% de velocidad
  - Si solo hay desarrolladores = 70% de velocidad
  - Si es equipo nuevo = 60% de velocidad
- Aplica factor DoD:
  - Si el DoD tiene tests + documentacion + revision = resta 20%
  - Si el DoD tiene solo tests = resta 10%

Calcula la FIABILIDAD:
- ALTA: el equipo tiene datos historicos de proyectos anteriores
- MEDIA: el equipo estima basado en experiencia
- BAJA: no hay datos, es una estimacion inicial

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso2/02-capacidad-equipo.md con este contenido:"

## SUBPASO 4: ROADMAP CLIENTE (para stakeholders)

Crea una version SIMPLE del plan con:
- Hitos principales (fechas aproximadas)
- Rango de fechas (ej: "entre Marzo y Abril")
- Nivel de confianza (ALTA/MEDIA/BAJA)

NO pongas detalles tecnicos. SOLO fechas y entregables.

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso2/03-roadmap-cliente.md con este contenido:"

## SUBPASO 5: ROADMAP TECNICO (para el equipo)

Crea una version DETALLADA del plan con:
- Sprints numerados (Sprint 1, Sprint 2...)
- Fechas exactas
- Que epica se trabaja en cada sprint
- Dependencias criticas (DP-001 tiene que estar lista antes del Sprint 2)
- Acciones (A-001 tiene que hacerse antes de tal fecha)
- Asignacion por perfiles

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso2/04-roadmap-tecnico.md con este contenido:"

## SUBPASO 6: DESCOMPONER EN HU

Toma las primeras EPICAS (las de los primeros 1-2 meses) y dividelas en HISTORIAS DE USUARIO (HU).

Cada HU sigue este formato:
"Como [rol] quiero [funcionalidad] para [beneficio]"

Ejemplo:
"Como profesor quiero subir notas para calcular la media automaticamente"
"Como administrador quiero ver el listado de alumnos para gestionar matriculas"

Cada HU debe tener:
- Criterios de aceptacion (que tiene que cumplir para darse por valida)
- Estimacion aproximada (S/M/L/XL)

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso2/05-backlog-detalle.md con este contenido:"

## SUBPASO 7: PRIORIZAR

Ordena las HU por prioridad:
- ALTA: lo que necesita el negocio ya
- MEDIA: importante pero no urgente
- BAJA: se puede hacer mas adelante

## FIN DEL PASO

Pregunta: "¿Quieres continuar con la Gestion de Sprints?"
