# PASO 3: GESTION DE SPRINTS

INPUT NECESARIO: Backlog priorizado + capacidad del equipo + GEE + DoR + DoD.

SI NO TIENES ESTOS DATOS, pide al usuario que complete los pasos anteriores.

---

## SUBPASO 1: EVALUAR DoR (Definition of Ready)

Para CADA historia de usuario (HU) que se vaya a hacer en el sprint:

Revisa si cumple el DoR del proyecto (el archivo config/01-dor-definition.md).

Pregunta al usuario una a una:
- "Esta HU tiene los criterios de aceptacion claros?"
- "Esta HU tiene los disenos listos?"
- "Esta HU tiene las dependencias resueltas?"

Si NO cumple el DoR, la HU NO puede entrar al sprint.

## SUBPASO 2: SPRINT PLANNING

Selecciona las HU que:
1. CUMPLEN el DoR
2. CABEN en la capacidad del equipo

Calcula:
- Capacidad disponible del sprint
- Suma de estimaciones de las HU seleccionadas
- La suma NO debe pasar la capacidad

Para CADA HU seleccionada, dividela en TAREAS:
- T-001: [tarea 1]
- T-002: [tarea 2]
- etc.

Asigna cada tarea a un perfil (desarrollador, disenador, tester).

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso3/01-sprint-candidates.md con este contenido:"

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso3/02-sprint-backlog.md con este contenido:"

Incluye los vinculos a riesgos (R-001) y acciones (A-001) relevantes.

## SUBPASO 3: DAILY LOG

Cuando el usuario empiece a trabajar, CADA DIA preguntale:
1. "Que hiciste ayer?"
2. "Que vas a hacer hoy?"
3. "Hay algun impedimento?"

Para CADA impedimento:
- Asigna IM-001, IM-002...
- Revisa si afecta a algun riesgo (R-XXX)
- Anotalo

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso3/dailylog/YYYY-MM-DD.md con este contenido:"

(YYYY-MM-DD es la fecha de hoy)

## SUBPASO 4: SPRINT REVIEW

Al FINAL del sprint:

Pregunta al usuario:
1. "Que HU se completaron?"
2. "Que HU NO se completaron? Por que?"
3. "Que feedback tiene el cliente?"
4. "Hubo cambios de alcance?"

Calcula:
- Velocidad REAL del sprint = HU completadas
- Velocidad vs estimada: mas, menos o igual?
- Causa si no se completo algo

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso3/03-review-sprint-X.md con este contenido:"

(X es el numero de sprint)

## SUBPASO 5: RETROSPECTIVA

Pregunta al usuario:
1. "Que salio bien?"
2. "Que se puede mejorar?"
3. "Que acciones concretas vamos a tomar?"

Para CADA mejora, asigna:
- Responsable (quien lo hace)
- Fecha limite (cuando se hace)

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso3/04-retrospectiva-sprint-X.md con este contenido:"

DI AL USUARIO QUE TAMBIEN UPDATEE:
- La velocidad del equipo (si cambio)
- Los riesgos (si alguno se materializo o se resolvio)

## FIN DEL SPRINT

Pregunta: "¿Quieres empezar el siguiente Sprint Planning?"
