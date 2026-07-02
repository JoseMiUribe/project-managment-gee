# GLOSARIO PM COPILOT

## TERMINOS BASICOS

PROYECTO: El trabajo que vamos a hacer. Ej: app para una academia.

CLIENTE: La persona que pide el proyecto (stakeholder).

EQUIPO: Desarrolladores, disenadores, testers que hacen el proyecto.

HU (Historia de Usuario): Funcionalidad concreta. Formato: "Como [rol] quiero [accion] para [beneficio]". Ej: "Como profesor quiero subir notas para calcular la media".

EPICA (EP): Grupo grande de funcionalidades. Ej: "Modulo de evaluacion" contiene varias HU.

SPRINT: Periodo de trabajo (1-2 semanas). Al final se entrega algo funcional.

BACKLOG: Lista de todo lo que hay que hacer, ordenado por prioridad.

## TERMINOS DE CALIDAD

DoR (Definition of Ready): Lo que necesita una HU para poder empezar. Ej: "tener disenos aprobados".

DoD (Definition of Done): Lo que necesita una HU para estar terminada. Ej: "tests pasados, documentacion escrita".

## TERMINOS DE RIESGOS

GEE: Gestion de Entregables y Eventos (riesgos, dependencias, acciones, cambios).

RIESGO (R-XXX): Algo que puede salir mal. Se mide: Probabilidad x Impacto x Perfil = PESO.

RAG: Semaforo. VERDE (<10), AMARILLO (10-30), ROJO (>30).

META: Perfil del proyecto. BAJO(10), MEDIO(30), ALTO(60), CRITICO(100).

DEPENDENCIA (DP-XXX): Algo que TIENE que pasar. Ej: "el proveedor entregue la API".

ACCION (A-XXX): Algo que HAY QUE HACER. Tiene responsable y fecha.

IMPEDIMENTO (IM-XXX): Algo que BLOQUEA el trabajo ahora.

CAMBIO (SC-XXX): Cambio en el alcance del proyecto.

## CODIGOS

F-001, F-002... = Fuentes de informacion
RF-001... = Requisitos funcionales
RNF-001... = Requisitos no funcionales
ZI-001... = Zonas de incertidumbre
EP-001... = Epicas
HU-001... = Historias de usuario
R-001... = Riesgos
DP-001... = Dependencias
A-001... = Acciones
IM-001... = Impedimentos
SC-001... = Cambios de alcance
T-001... = Tareas

## ESTRUCTURA DE CARPETAS (para referencia)

investigar/[proyecto]/
  00-documento-original.md
  documentacion-proyecto.md
  config/ (DoR, DoD)
  output-paso--1/ (Legacy)
  output-paso0/ (Requisitos)
  output-paso1/ (GEE)
  output-paso2/ (Roadmap)
  output-paso3/ (Sprints)
    dailylog/
