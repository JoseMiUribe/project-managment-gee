# Registro de Acciones — [Nombre del Proyecto]

**Fecha última actualización:** YYYY-MM-DD

## Acciones

| ID | Acción | Tipo | Riesgo asociado | Dependencia asociada | Responsable | Deadline | Estado | Visibilidad | Motivo (descarte/eliminación) |
|---|---|---|---|---|---|---|---|---|---|
| A-001 | Organizar sesión de detalle funcional del módulo de validación con el cliente | Preventiva | R-001 | — | [PM] | 2026-07-15 | Pendiente | | |

**Notas de uso:**
- Numeración correlativa de tres dígitos (A-001, A-002...).
- Tipo: Preventiva (evita que el riesgo llegue a materializarse) / Correctiva (corrige algo que ya ha fallado) / Mitigación (reduce probabilidad o impacto) / Contingencia (plan B si el riesgo se materializa).
- Toda acción debe tener Responsable y Deadline antes de pasar de Pendiente a En curso.
- Si una acción se bloquea por una dependencia externa, referencia esa dependencia en "Dependencia asociada" y considera dar de alta un Impedimento (`IM-XXX`) si el bloqueo es real y activo.
- **Visibilidad / Motivo (descarte/eliminación):** vacías por defecto (acción activa). El dashboard las gestiona automáticamente al usar "Descartar" o "Eliminar" — no las rellenes a mano. Ningún registro se borra nunca físicamente de esta tabla.
