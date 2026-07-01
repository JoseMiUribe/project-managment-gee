# Prompt: Sprint Planning

**Propósito:** Planificar el sprint: seleccionar HU, descomponer en tareas, asignar responsables, detectar riesgos.

## Instrucciones para la IA

1. Carga `sprint-candidates.md` (HU Ready) + `capacidad-equipo.md` (velocidad disponible) + GEE (riesgos/dependencias activas)
2. Selecciona las HU que caben en el sprint según la velocidad realista del equipo
3. Para cada HU, descompón en tareas técnicas (no más de 3-5 tareas por HU)
4. Asigna cada tarea al perfil adecuado (FE/BE/QA) basado en la especialidad
5. Detecta dependencias entre tareas del sprint
6. Identifica nuevos riesgos que puedan surgir de la descomposición técnica

## Criterios de selección de HU

- Prioridad del backlog (valor de negocio)
- Dependencias entre HU (las que bloquean a otras entran primero)
- Capacidad disponible por especialidad (si el cuello de botella es BE, no meter más HU BE de las que caben)
- Riesgos: si una HU tiene alto riesgo, considerar ponerla temprano o con colchón

## Descomposición técnica

Para cada HU, sugiere tareas como:

```
HU-001: Alta de centro escolar
├── BE: Modelo Tenant en PostgreSQL
├── BE: Endpoint de creación
├── BE: Políticas RLS por school_id
├── FE: Formulario de alta
└── QA: Test creación + aislamiento RLS
```

Cada tarea debe tener:
- Prefijo de perfil (BE/FE/QA/DevOps)
- Descripción clara de qué hay que hacer
- Dependencias con otras tareas si aplica

## Asignación por perfiles

Usa `capacidad-equipo.md` para saber:
- Quién es FE, quién BE, quién QA
- Dedicación de cada uno
- No asignes a alguien que no tenga la especialidad requerida

## Detección de nuevos riesgos

Al descomponer técnicamente, pueden surgir riesgos no previstos:
- "Esta HU requiere integración con un sistema que no conocíamos"
- "El proveedor de X no tiene SDK para nuestro stack"
- "La solución propuesta tiene un problema de rendimiento conocido"

Estos nuevos riesgos se registran como R-XXX en el GEE.

## Output

Genera `sprint-backlog.md` con:
1. Nº de sprint, fechas, objetivo
2. Capacidad disponible (pts) y ocupada (pts)
3. Tabla de HU seleccionadas con tareas, responsables y estado
4. Dependencias entre tareas del sprint
5. Nuevos riesgos detectados (si los hay)
6. Mapa de dependencias visual (opcional)

## Autoevaluación

- ¿Las HU seleccionadas suman menos o igual que la capacidad realista?
- ¿Cada tarea tiene un perfil asignado que existe en el equipo?
- ¿Se respetan los cuellos de botella (no más BE de los que hay)?
- ¿Las dependencias entre tareas son claras?
