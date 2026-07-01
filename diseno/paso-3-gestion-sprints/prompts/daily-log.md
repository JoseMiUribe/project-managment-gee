# Prompt: Daily Log

**Propósito:** Registrar el progreso diario del sprint y mantener actualizado el GEE.

## Instrucciones para la IA

1. Para cada día del sprint (de lunes a viernes), pregunta o ayuda a registrar:
   - ¿Qué se hizo ayer?
   - ¿Qué se hará hoy?
   - ¿Hay bloqueos/impedimentos?
   - ¿Hay novedades para el GEE?

2. Actualiza el estado de cada HU y tarea

3. Vincula cualquier novedad al GEE:

| Novedad | Acción GEE |
|---|---|
| Tarea bloqueada por dependencia externa | Crear IM-XXX (impedimento) o actualizar DP-XXX |
| Riesgo que se materializa | Actualizar R-XXX: estado = "Materializado", RAG actualizado |
| Cambio de alcance por feedback del PO | Crear SC-XXX (cambio de alcance) |
| Dependencia resuelta | Marcar DP-XXX como "Resuelta" |
| Nuevo riesgo detectado | Crear R-XXX |

## Formato de output

```markdown
# Daily — [YYYY-MM-DD]

**Sprint X | Día X de X**

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
