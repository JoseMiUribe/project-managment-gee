# PASO 3: GESTION DE SPRINTS

INPUT: Backlog + capacidad + GEE + DoR + DoD. Si faltan, pidelos.

## SUBPASO 1: EVALUAR DoR

Para cada HU candidata, revisa si cumple el DoR.

Pregunta al usuario una a una:
- "Esta HU tiene criterios de aceptacion claros?"
- "[segun DoR del proyecto]"

Si NO cumple, esa HU no entra al sprint.

## SUBPASO 2: SPRINT PLANNING

Selecciona HU que cumplan DoR y quepan en la capacidad.

Para cada HU, dividela en tareas y asigna perfil.

PRODUCE:

```markdown
## Sprint Backlog - Sprint X

Capacidad: X horas

### HU incluidas

| HU | Descripcion | Estimacion | Tareas |
|----|-------------|-----------|--------|
| HU-001 | Registro de usuarios | M | T-001, T-002 |

### Tareas

| Tarea | Descripcion | Perfil | Horas |
|-------|-------------|--------|-------|
| T-001 | Crear formulario registro | Dev | 8h |
| T-002 | Validacion de email | Dev | 4h |

### Riesgos vinculados

- R-001: [revisar durante el sprint]
- A-001: [accion pendiente]
```

## SUBPASO 3: DAILY

Cada dia, pregunta:
1. "Que hiciste ayer?"
2. "Que vas a hacer hoy?"
3. "Hay impedimentos?"

Si hay impedimentos, asignales IM-001, IM-002... y vinculalos a riesgos (R-XXX) si aplica.

PRODUCE:

```markdown
## Daily - [fecha]

### Ayer
- [lo que se hizo]

### Hoy
- [lo que se va a hacer]

### Impedimentos
- IM-001: [descripcion] -> R-00X
```

## SUBPASO 4: SPRINT REVIEW

Al final del sprint, pregunta:
1. "Que HU se completaron?"
2. "Que HU NO se completaron? Por que?"
3. "Que feedback hay?"
4. "Hubo cambios?"

Calcula velocidad real y comparala con la estimada.

PRODUCE:

```markdown
## Sprint Review - Sprint X

### Completado
- HU-001: OK
- HU-002: OK

### No completado
- HU-003: [motivo]

### Velocidad
- Estimada: X h
- Real: X h
- Diferencia: +/- X%

### Feedback
- [feedback del cliente/stakeholders]

### Cambios
- [si hubo cambios de alcance]
```

## SUBPASO 5: RETROSPECTIVA

Pregunta:
1. "Que salio bien?"
2. "Que se puede mejorar?"
3. "Que acciones concretas vamos a tomar?"

PRODUCE:

```markdown
## Retrospectiva - Sprint X

### Bien
1. [cosa que salio bien]

### Mejorar
1. [cosa a mejorar]

### Acciones
| Accion | Quien | Cuando |
|--------|-------|--------|
| [accion] | [responsable] | [fecha] |
```

## FIN DEL SPRINT

Pregunta: "¿Quieres empezar el siguiente Sprint Planning?"
