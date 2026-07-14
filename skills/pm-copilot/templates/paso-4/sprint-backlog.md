# Template: Sprint Backlog

**Instrucciones:** Rellenar durante el Sprint Planning. Cada sprint tiene su propio archivo, guardado en `investigar/[proyecto]/output-paso-4/`.

---

# Sprint Backlog — Sprint [N]

**Sprint:** [N]
**Fechas:** [inicio] — [fin]
**Objetivo:** [1-2 frases sobre qué se quiere lograr en el sprint]
**Capacidad disponible:** [X] pts (según `output-paso-2/capacidad-equipo/` V[XX])
**Capacidad ocupada:** [X] pts

---

## HU seleccionadas

Cada HU es una fila "cabecera" (con ID, Épica, Título, Estado y Talla) seguida de **una fila por subtarea técnica** (Subtarea/Responsable/Estado), con las columnas de cabecera en blanco en esas filas de continuación — así una misma HU puede tener 1 o varias tareas técnicas sin repetir sus datos.

**Estado (de la HU, fila de cabecera):** Pendiente / En curso / Bloqueado / Hecho / Descartada.
**Estado (de la subtarea):** Pendiente / En curso / Bloqueado / Hecho.

| HU | Épica | Título | Estado | Talla | Subtarea | Responsable | Estado subtarea |
|---|---|---|---|---|---|---|---|
| HU-XXX | EP-XXX | | Pendiente | | BE: ... | | Pendiente |
| | | | | | FE: ... | | Pendiente |
| | | | | | QA: ... | | Pendiente |
| HU-XXX | EP-XXX | | Pendiente | | ... | | Pendiente |

---

## Mapa de dependencias del sprint

```
HU-XXX ──bloquea──▶ HU-XXX
HU-XXX ──bloquea──▶ HU-XXX ──bloquea──▶ HU-XXX
```

---

## Nuevos riesgos detectados en Planning

| ID | Riesgo | Afecta a | Acción |
|---|---|---|---|
| R-XXX | | | |

**Nota:** estos riesgos deben quedar también reflejados en `output-paso-1/registro-riesgos.md`. Este apartado es un resumen, no la fuente de verdad.

---

## Notas del Planning

[Decisiones tomadas, acuerdos, dudas resueltas]
