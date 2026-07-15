# Registro de Riesgos — [Nombre del Proyecto]

**Perfil de proyecto (multiplicador):** Alto (60) — ejemplo ilustrativo, sustituir por el perfil real del proyecto: [Bajo (10) / Medio (30) / Alto (60) / Crítico (100)]
**Fecha última actualización:** YYYY-MM-DD

## Catálogo META (referencia)

| Concepto | Valores | Pesos |
|---|---|---|
| Probabilidad | Muy Baja / Baja / Media / Alta / Muy Alta | 0.1 / 0.3 / 0.5 / 0.7 / 0.9 |
| Impacto | Muy Bajo / Bajo / Medio / Alto / Muy Alto | 0.05 / 0.1 / 0.2 / 0.4 / 0.8 |
| RAG | Verde <10 / Amarillo 10-30 / Rojo >30 | Peso = Probabilidad × Impacto × Multiplicador |

## Riesgos

| ID | Fecha alta | Riesgo | Consecuencia | Tipo | Probabilidad | Impacto | Ámbito | Respuesta | Estado | Coste | Alcance | Plazo | Calidad | Mitigación | Responsable | Peso | RAG | Consideraciones | Relacionado con | Fecha update | Visibilidad | Motivo (descarte/eliminación) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | 2026-07-06 | El RFP inicial no detalla las reglas de validación de un módulo clave | Retrabajo y desviación de alcance al descubrirlas en desarrollo | alcance | Alta (0.7) | Alto (0.4) | Interno | Reducirlo | Abierto | No | Sí | Sí | No | Sesión de detalle funcional con el cliente antes de iniciar el sprint del módulo | [PM] | 16.8 | 🟡 Amarillo | Revisar tras la sesión de detalle | A-001 | 2026-07-06 | | |

**Notas de uso:**
- Numeración correlativa de tres dígitos (R-001, R-002...), no reutilizar IDs de riesgos cerrados.
- Peso = Probabilidad × Impacto × Multiplicador del proyecto (ver perfil arriba).
- Todo riesgo en 🔴 Rojo debe tener al menos una Acción de mitigación vinculada en `registro-acciones.md`.
- "Relacionado con" puede referenciar DP-XXX, A-XXX o SC-XXX.
- **Visibilidad / Motivo (descarte/eliminación):** vacías por defecto (riesgo activo). El dashboard las gestiona automáticamente al usar "Descartar" (se marca tachado pero sigue visible) o "Eliminar" (se oculta del dashboard) — no las rellenes a mano. Ningún registro se borra nunca físicamente de esta tabla.
