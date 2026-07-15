# Prompt: Daily Log

> **Nivel:** ⚙️ Ejecutivo — registrar el progreso diario siguiendo un formato fijo es mecánico. Puedes delegarlo a un subagente con modelo económico; solo escala al modelo principal si aparece un riesgo nuevo no trivial o un cambio de alcance.

**Propósito:** Registrar el progreso diario del sprint y mantener actualizado el GEE.

**Disponible desde el primer día del proyecto, no solo durante un sprint activo.** Aunque su contenido más rico (Progreso de HU, puntos restantes) solo tiene sentido con un sprint en marcha, la sección "Notas" es una libreta de trabajo general del PM/ADL — sirve para dejar constancia de decisiones, recordatorios o contexto en cualquier momento del proyecto, incluso antes del Paso 4. El dashboard permite añadir una nota cualquier día desde su propio formulario (no solo cuando este prompt genera el daily completo) — no le des la impresión al PM de que tiene que "esperar al Paso 4" para poder anotar algo.

## Instrucciones para la IA

1. Para cada día del sprint (de lunes a viernes), pregunta o ayuda a registrar:
   - ¿Qué se hizo ayer?
   - ¿Qué se hará hoy?
   - ¿Hay bloqueos/impedimentos?
   - ¿Hay novedades para el GEE?
   - **Puntos restantes del sprint hoy**: suma los puntos (talla) de las HU que a fecha de hoy no están `Hecho` ni `Descartada` en `output-paso-4/sprint-backlog-{N}.md`. Este dato es el que alimenta el gráfico de burndown del dashboard (pestaña Sprint actual) — sin él, el burndown no tiene datos reales que dibujar. No lo omitas aunque no haya cambiado respecto a ayer.

2. Actualiza el estado de cada HU y tarea

3. Vincula cualquier novedad al GEE (artefactos en `investigar/[proyecto]/output-paso-1/`):

| Novedad | Acción GEE |
|---|---|
| Tarea bloqueada por dependencia externa | Crear IM-XXX (impedimento) o actualizar DP-XXX en `registro-dependencias.md` |
| Riesgo que se materializa | Actualizar R-XXX en `registro-riesgos.md`: estado = "Materializado", RAG actualizado |
| Cambio de alcance por feedback del PO | No lo resuelvas aquí: anótalo y deriva a `gestion-changelog.md` (Paso 3) para registrarlo como SC-XXX |
| Dependencia resuelta | Marcar DP-XXX como "Resuelta" en `registro-dependencias.md` |
| Nuevo riesgo detectado | Crear R-XXX en `registro-riesgos.md` |

## Formato de output

```markdown
# Daily — [YYYY-MM-DD]

**Sprint X | Día X de X**
**Puntos restantes del sprint:** [X] pts (de [Y] pts comprometidos en el Planning)

## Progreso

| HU | Estado | Lo que se hizo | Lo que se hará | Bloqueos |
|---|---|---|---|---|
| HU-001 | En curso | ... | ... | — |
| HU-002 | ✅ Terminada | ... | — | — |
| HU-003 | Bloqueada | ... | ... | IM-001: ... |

## Actualizaciones GEE

- **Nuevo impedimento IM-001**: [descripción]. Afecta a HU-003
- **R-002 actualizado**: Riesgo materializado. RAG: 🔴
- **DP-005 resuelta**: Cloudflare confirmó disponibilidad

## Notas

- **[YYYY-MM-DD HH:MM] [Autor]:** [Observación, recordatorio o decisión tomada]
- **[YYYY-MM-DD HH:MM] Skill:** [Nota que añades tú mismo si detectas algo relevante al generar el daily]
```

**Formato de "Notas" (importante):** es una lista de notas individuales, no un párrafo único — una nota por línea, con timestamp y autor explícitos (`- **[fecha hora] Autor:**`). Esto permite que el PM añada notas sueltas cualquier día desde el dashboard (una por una, sin regenerar el daily entero) y que quede trazabilidad de quién escribió cada una — el propio skill se identifica como autor `Skill` cuando es él quien añade la nota (nunca se hace pasar por una persona). Añade notas nuevas al final de la lista existente; no reescribas ni resumas las anteriores.

## Reglas

- No inventes progreso. Si no hay datos, indica "Sin datos"
- Si es fin de semana, no generes daily
- Los impedimentos deben tener un responsable y una fecha objetivo de resolución
- Cada daily debe hacer referencia al daily anterior para continuidad
- Si durante el daily surge una **petición de cambio de alcance** (algo nuevo que pide el cliente, un requisito mal entendido, una decisión de negocio que cambia prioridades), no lo evalúes aquí: es una decisión de criterio que requiere el modelo principal. Regístralo como pendiente en "Notas" y ejecuta `prompts/paso-4/gestion-changelog.md` a continuación
- Igualmente, si un riesgo nuevo detectado es no trivial (impacto alto, afecta a varias HU, o requiere replanificar), escala al modelo principal en lugar de resolverlo mecánicamente
