# Paso 1 — Framework GEE E-T (simulación)

**Fecha:** 2024-06-26
**Input:** Artefactos del Paso 0 + Check Init
**Perfil del proyecto:** Alto (multiplicador 60)

## Resumen

| Concepto | Valor |
|---|---|
| Riesgos identificados | 12 (R-001 a R-012) |
| Dependencias | 6 (DP-001 a DP-006) |
| Acciones | 13 (A-001 a A-013) |
| Check Init | 6 ✅ / 4 ⚠️ / 6 ❌ |

## Estado RAG de riesgos

| RAG | Cantidad | IDs |
|---|---|---|
| 🟢 Verde | 1 | R-009 |
| 🟡 Amarillo | 11 | R-001 a R-008, R-010 a R-012 |
| 🔴 Rojo | 0 | — |

## Artefactos generados

| Archivo | Descripción |
|---|---|
| `check-init.md` | 16 puntos verificados → 6 riesgos + 5 acciones generados automáticamente |
| `info-riesgos.md` | Catálogo de riesgos comunes → 11 aplicables de 14 |
| `registro-riesgos.md` | 12 riesgos con peso, RAG, mitigación + vista simplificada para stakeholders |
| `registro-dependencias.md` | 6 dependencias con criticidad RAG y estados |
| `registro-acciones.md` | 13 acciones con responsables y deadlines |
| `dailylog/` | (pendiente de uso diario) |

## Lo que alimenta al Paso 2 (Roadmap)

Los riesgos y dependencias condicionan el roadmap:
- **DP-001** (Raíces) y **DP-003** (firma legal) son bloqueantes → la épica de exportación no puede empezar hasta tener la especificación
- **R-004** (fecha límite Septiembre) obliga a priorizar funciones core y dejar secundarias para Fase 2
- **R-003** (scope creep) requiere que el comité semanal valide cualquier nueva petición antes de que entre en el backlog
