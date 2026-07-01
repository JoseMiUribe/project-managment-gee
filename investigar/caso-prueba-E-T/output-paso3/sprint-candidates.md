# Evaluación DoR — Sprint 1 E-T

**Fecha:** 2026-06-26 (simulado)
**Basado en:** backlog-detalle.md + dor-definition.md del proyecto

## Resultados

| HU | Título | DoR | Observaciones |
|---|---|---|---|
| HU-001 | Alta de centro escolar | ✅ Ready | Sin dependencias externas. Criterios claros |
| HU-002 | Catálogo maestro de etiquetas | ✅ Ready | Depende de HU-001 (mismo sprint, no bloquea) |
| HU-003 | Suplantación segura | ❌ No Ready | Pendiente definir trigger PostgreSQL y política de ticket de soporte. Vuelve a refinamiento |
| HU-004 | Botón de pánico IA | ✅ Ready | Funcionalidad simple, criterios claros |
| HU-005 | Aviso global a centros | ✅ Ready | Sin dependencias externas |
| HU-006 | Onboarding barra de progreso | ⏳ Pendiente | Necesita definir "pasos obligatorios mínimos". Llevar a refinamiento con el equipo |
| HU-007 | Invitación múltiple de usuarios | ✅ Ready | Depende de HU-006 (mismo sprint) |
| HU-008 | Designar Coordinador de Bienestar | ✅ Ready | El cliente confirmó que es un flag (post-entrevista). Criterios claros |
| HU-009 | Carga de RRI y PEC | ❌ No Ready | Dependencia bloqueante DP-002 (Cloudflare UE). Sin resolver, no entra |
| HU-010 | Vinculación multi-centro | ✅ Ready | Depende de HU-007 (mismo sprint) |

## Resumen

| Estado | Cantidad | HU |
|---|---|---|
| ✅ Ready | 7 | HU-001, HU-002, HU-004, HU-005, HU-007, HU-008, HU-010 |
| ⏳ Pendiente de refinamiento | 1 | HU-006 |
| ❌ No Ready (vuelve a backlog) | 2 | HU-003, HU-009 |

## Decisión para Sprint 1

Se llevan las 7 HU Ready. HU-006 pasa a refinamiento rápido (resolver en 1h). HU-003 y HU-009 vuelven al backlog hasta que se resuelvan sus dependencias.
