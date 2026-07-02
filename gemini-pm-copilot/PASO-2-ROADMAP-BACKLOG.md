# PASO 2: ROADMAP + CAPACIDAD DEL EQUIPO

INPUT: Requisitos + GEE. Si no los tienes, pidelos.

## SUBPASO 1: EPICAS

Agrupa los RF en epicas por tema. PRODUCE:

```markdown
## Epicas

| Codigo | Nombre | Descripcion | RF incluidos |
|--------|--------|-------------|-------------|
| EP-001 | Gestion usuarios | Registro, login, perfiles | RF-001, RF-002 |
| EP-002 | Panel admin | Dashboard, reportes | RF-003, RF-005 |
```

## SUBPASO 2: DoR y DoD

Pregunta al usuario:

Para DoR: "Que necesita una tarea para poder empezar?"
- Tener criterios de aceptacion?
- Tener disenos?
- Tener base de datos creada?

Para DoD: "Que necesita una tarea para estar terminada?"
- Tests pasados?
- Documentacion escrita?
- Codigo revisado?

PRODUCE:

```markdown
## Definition of Ready

Una HU esta lista cuando:
1. Tiene criterios de aceptacion claros
2. [otros]

## Definition of Done

Una HU esta terminada cuando:
1. Tests unitarios pasan
2. [otros]
```

## SUBPASO 3: CAPACIDAD DEL EQUIPO

Pregunta una a una:
1. "Cuantas personas en el equipo?"
2. "Cuantos desarrolladores? Disenadores? Testers?"
3. "Cuantas horas reales trabajan al dia?" (restando reuniones)
4. "Cuantos dias tiene un sprint?" (1 o 2 semanas)

Calcula:
- Velocidad nominal = personas x horas/dia x dias/sprint
- Factor equipo: completo (90%), solo devs (70%), nuevo (60%)
- Factor DoD: con tests+doc+revision (-20%), solo tests (-10%)

PRODUCE:

```markdown
## Capacidad del Equipo

- Personas: X (X devs, X dis, X test)
- Horas/dia/persona: X
- Dias/sprint: X
- Velocidad nominal: X h/sprint
- Factor correccion: X%
- Factor DoD: X%
- Velocidad real: X h/sprint
- Fiabilidad: ALTA/MEDIA/BAJA
```

## SUBPASO 4: ROADMAP CLIENTE

PRODUCE un plan simple para stakeholders:

```markdown
## Roadmap Cliente

| Hito | Fecha aprox | Confianza |
|------|-------------|-----------|
| Inicio | Semana 1 | ALTA |
| Primera entrega | Semana 4-5 | MEDIA |
| Entrega final | Semana 8-10 | BAJA |
```

## SUBPASO 5: ROADMAP TECNICO

PRODUCE un plan detallado para el equipo:

```markdown
## Roadmap Tecnico

| Sprint | Fechas | Epica | Deps criticas | Acciones |
|--------|--------|-------|--------------|----------|
| Sprint 1 | Sem 1-2 | EP-001 | DP-001 | A-001 |
| Sprint 2 | Sem 3-4 | EP-002 | DP-002 | A-002 |
```

## SUBPASO 6: HISTORIAS DE USUARIO

Toma las primeras epicas y dividelas en HU.

Formato: "Como [rol] quiero [accion] para [beneficio]"

Cada HU con criterios de aceptacion y estimacion (S/M/L/XL).

PRODUCE:

```markdown
## Backlog detallado (primeras epicas)

### HU-001: Registro de usuarios
Como usuario quiero registrarme con email para acceder al sistema

Criterios de aceptacion:
- Formulario con email, password, nombre
- Validacion de email
- Contrasena minima 8 caracteres

Estimacion: M

### HU-002: Login de usuarios
Como usuario quiero iniciar sesion para acceder a mis datos
...
```

## SUBPASO 7: PRIORIZAR

Ordena las HU por prioridad: ALTA, MEDIA, BAJA.

## FIN

Pregunta: "¿Quieres continuar con la Gestion de Sprints?"
