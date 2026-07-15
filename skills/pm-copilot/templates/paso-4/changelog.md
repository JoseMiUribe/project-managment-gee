# Template: ChangeLog (Cambios de Alcance)

**Instrucciones:** Añadir una fila por cada cambio de alcance detectado (petición nueva del cliente, requisito mal entendido, decisión de negocio). Guardar/actualizar en `investigar/[proyecto]/output-paso-1/changelog.md`. Se rellena siguiendo `prompts/paso-4/gestion-changelog.md`.

**Formato:** tabla plana, una fila por cambio — mismo patrón que `registro-riesgos.md`/`registro-dependencias.md`/`registro-acciones.md`/`registro-impedimentos.md`. Es intencional: el dashboard trata el Changelog como una pestaña más del GEE, con la misma edición en línea (ver `confirm` obligatorio antes de escribir) y el mismo alta con ID correlativo. No lo sustituyas por un documento narrativo por cambio — el dashboard no sabe leer eso.

---

# ChangeLog (Cambios de Alcance) — [Nombre del Proyecto]

**Fecha última actualización:** YYYY-MM-DD

## Cambios de alcance

| ID | Título | Descripción | Impacto | Coste | Alcance | Plazo | Calidad | Decisión | Riesgos generados | Dependencias generadas | Acciones generadas | Comentarios | Visibilidad | Motivo (descarte/eliminación) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SC-001 | Recordatorio de cita por WhatsApp | El cliente pide añadir WhatsApp como canal de recordatorio de cita, además de SMS/email (RF-004) | Amplía RF-004; valor claro para el cliente pero requiere contratar una API de pago | Sí — API WhatsApp Business no presupuestada inicialmente | Sí — amplía RF-004 | No — no compromete el sprint actual | No | Aceptado con condiciones — se pospone a sprint 3 para no comprometer el MVP | R-003 | — | — | Confirmado con el PO del cliente por email el 2026-07-11 | | |

**Notas de uso:**
- Numeración correlativa de tres dígitos (SC-001, SC-002...), no reutilizar IDs de cambios cerrados o rechazados.
- **Visibilidad / Motivo (descarte/eliminación):** vacías por defecto (cambio activo). El dashboard las gestiona automáticamente al usar "Descartar" o "Eliminar" — no las rellenes a mano. Ningún registro se borra nunca físicamente de esta tabla (un cambio Rechazado ya queda registrado vía "Decisión"; Descartar/Eliminar es para cuando la propia fila deja de ser relevante en el dashboard, no para reflejar el rechazo del cliente).
- **Impacto:** resumen de una frase de qué cambia en conjunto — no repitas aquí el detalle de cada eje, para eso están las 4 columnas siguientes.
- **Coste / Alcance / Plazo / Calidad:** cada una "Sí — [detalle breve]" si ese eje se ve afectado, o "No" si no aplica. Cualitativo está bien (no hace falta recalcular cifras para dar de alta la fila).
- **Decisión:** el estado (Aceptado / Aceptado con condiciones / Aplazado / Rechazado) y el motivo, separados por " — ", en la misma celda (ej. "Aplazado — pendiente de recalcular capacidad tras sprint 2"). Un cambio Rechazado no se borra: queda en la tabla como precedente y trazabilidad con el cliente.
- **Riesgos generados / Dependencias generadas / Acciones generadas:** IDs separados por coma (`R-XXX`, `DP-XXX`, `A-XXX`) si el cambio dio de alta algo nuevo en el GEE, o "—" si no aplica. Esta columna es solo trazabilidad cruzada — el registro real vive en `registro-riesgos.md`/`registro-dependencias.md`/`registro-acciones.md`, no la dupliques aquí.
