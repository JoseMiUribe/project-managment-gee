# Registro de Impedimentos — [Nombre del Proyecto]

**Fecha última actualización:** YYYY-MM-DD

## Impedimentos

| ID | Impedimento | Criticidad | Fecha inicio | Fecha fin | Responsable | Riesgo origen | Dependencia origen | Visibilidad | Motivo (descarte/eliminación) | Última modificación | Modificado por |
|---|---|---|---|---|---|---|---|---|---|---|---|
| IM-001 | El entorno de preproducción no está disponible y bloquea las pruebas del sprint 2 | 🔴 Rojo | 2026-07-10 | | [PM] | R-002 | DP-001 | | | | |

**Notas de uso:**
- Numeración correlativa de tres dígitos (IM-001, IM-002...).
- Un impedimento nace cuando un riesgo se materializa (rellenar "Riesgo origen") o cuando una dependencia bloqueada empieza a afectar activamente al trabajo (rellenar "Dependencia origen"). Puede tener ambos orígenes o solo uno.
- "Fecha fin" queda vacía mientras el impedimento sigue activo; se rellena al resolverse.
- Criticidad usa el mismo semáforo RAG que el resto del framework.
- **Visibilidad / Motivo (descarte/eliminación):** vacías por defecto (impedimento activo). El dashboard las gestiona automáticamente al usar "Descartar" o "Eliminar" — no las rellenes a mano. Ningún registro se borra nunca físicamente de esta tabla.
- **Última modificación / Modificado por:** metadatos de auditoría que gestiona el propio dashboard en cada escritura — no las rellenes a mano.
