# Prompt: Daily Log

> **Nivel:** ⚙️ Ejecutivo — registrar el progreso diario siguiendo un formato fijo es mecánico. Puedes delegarlo a un subagente con modelo económico; solo escala al modelo principal si aparece un riesgo nuevo no trivial o un cambio de alcance.

**Propósito:** Registrar el progreso diario del sprint y mantener actualizado el GEE.

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

[Observaciones adicionales, recordatorios, decisiones tomadas]
```

## Reglas

- No inventes progreso. Si no hay datos, indica "Sin datos"
- Si es fin de semana, no generes daily
- Los impedimentos deben tener un responsable y una fecha objetivo de resolución
- Cada daily debe hacer referencia al daily anterior para continuidad
- Si durante el daily surge una **petición de cambio de alcance** (algo nuevo que pide el cliente, un requisito mal entendido, una decisión de negocio que cambia prioridades), no lo evalúes aquí: es una decisión de criterio que requiere el modelo principal. Regístralo como pendiente en "Notas" y ejecuta `prompts/paso-4/gestion-changelog.md` a continuación
- Igualmente, si un riesgo nuevo detectado es no trivial (impacto alto, afecta a varias HU, o requiere replanificar), escala al modelo principal en lugar de resolverlo mecánicamente
