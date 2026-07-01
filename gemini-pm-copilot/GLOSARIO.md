# GLOSARIO PM COPILOT (lenguaje simple)

## TERMINOS BASICOS

PROYECTO
Es el trabajo que vamos a hacer. Ejemplo: "Crear una aplicacion para una academia"

CLIENTE
La persona que pide el proyecto. Tambien se le llama "stakeholder".

EQUIPO
Las personas que hacen el proyecto: desarrolladores, disenadores, testers...

HU (Historia de Usuario)
Una funcionalidad concreta. Se escribe asi:
"Como [rol] quiero [accion] para [beneficio]"
Ejemplo: "Como profesor quiero subir notas para calcular la media"

EPICA (EP)
Un grupo grande de funcionalidades. Ejemplo: "Modulo de evaluacion" contiene varias HU.

SPRINT
Periodo de tiempo para trabajar (normalmente 1 o 2 semanas).
Al final del sprint se entrega algo funcional.

BACKLOG
Lista de todo lo que hay que hacer, ordenado por prioridad.

## TERMINOS DE CALIDAD

DoR (Definition of Ready)
Lo que necesita una HU para poder empezar a trabajar en ella.
Ejemplo: "Tener los disenos aprobados" o "Tener claros los criterios de aceptacion"

DoD (Definition of Done)
Lo que necesita una HU para darse por terminada.
Ejemplo: "Tests pasados" o "Documentacion escrita" o "Codigo revisado por un companero"

## TERMINOS DE RIESGOS

GEE (Gestion de Entregables y Eventos)
El sistema para gestionar riesgos, dependencias, acciones y cambios.

RIESGO (R-001)
Algo que puede salir mal y afectar al proyecto.
Se mide con: Probabilidad x Impacto x Perfil = PESO

RAG
Semaforo de colores para los riesgos:
- VERDE (peso < 10): riesgo bajo, solo vigilar
- AMARILLO (peso 10-30): riesgo medio, hay que hacer algo
- ROJO (peso > 30): riesgo alto, accion urgente

META
El perfil del proyecto:
- BAJO (10): proyecto sencillo
- MEDIO (30): proyecto normal
- ALTO (60): proyecto complejo
- CRITICO (100): proyecto muy arriesgado

DEPENDENCIA (DP-001)
Algo que TIENE que pasar para que el proyecto avance.
Ejemplo: "El proveedor tiene que entregar la API"

ACCION (A-001)
Algo que HAY QUE HACER para mitigar un riesgo o desbloquear una dependencia.
Tiene responsable y fecha limite.

IMPEDIMENTO (IM-001)
Algo que BLOQUEA el trabajo ahora mismo.

CAMBIO (SC-001)
Un cambio en el alcance del proyecto. Si el cliente pide algo nuevo, se evalua si es cambio o entra en el backlog.

## TERMINOS DE PLANIFICACION

CAPACIDAD DEL EQUIPO
Cuantas horas o puntos puede entregar el equipo en un sprint.

VELOCIDAD
Cuantas HU o puntos entrega el equipo por sprint.
Se mide: despues del primer sprint, se sabe la velocidad REAL.

ROADMAP CLIENTE
Plan SIMPLE para ensenar al cliente: hitos importantes y fechas aproximadas.

ROADMAP TECNICO
Plan DETALLADO para el equipo: sprints, tareas, dependencias, asignaciones.

FIABILIDAD
Que tan fiable es la estimacion de capacidad:
- ALTA: tenemos datos de proyectos anteriores
- MEDIA: estimamos por experiencia
- BAJA: es la primera vez, estimacion inicial

## CODIGOS DE ARCHIVOS

Cada archivo en el proyecto tiene un codigo:
- F-001, F-002... = Fuentes de informacion (documentos originales)
- RF-001, RF-002... = Requisitos funcionales
- RNF-001, RNF-002... = Requisitos no funcionales
- ZI-001, ZI-002... = Zonas de incertidumbre
- EP-001, EP-002... = Epicas
- HU-001, HU-002... = Historias de usuario
- R-001, R-002... = Riesgos
- DP-001, DP-002... = Dependencias
- A-001, A-002... = Acciones
- IM-001, IM-002... = Impedimentos
- SC-001, SC-002... = Cambios de alcance
- T-001, T-002... = Tareas

## ESTRUCTURA DE CARPETAS

investigar/[nombre-proyecto]/
  00-documento-original.md        -> Documento raw del cliente
  documentacion-proyecto.md        -> Documento oficial consolidado
  config/                          -> DoR, DoD del proyecto
   01-dor-definition.md
   02-dod-definition.md
  output-paso--1/                  -> Analisis Legacy
  output-paso0/                    -> Captura Requisitos
  output-paso1/                    -> GEE (riesgos)
  output-paso2/                    -> Roadmap + Capacidad
  output-paso3/                    -> Sprints
   dailylog/                       -> Registros diarios
