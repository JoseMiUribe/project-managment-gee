# Paso 2 — Roadmap + Backlog E-T (simulación)

**Fecha:** 2024-06-26
**Input:** Requisitos funcionales + GEE (riesgos, dependencias, acciones)
**Objetivo:** MVP Septiembre 2026

## Resumen

| Concepto | Valor |
|---|---|
| Épicas MVP | 5 (EP-001 a EP-005) + 1 condicional (EP-006) |
| Épicas Fase 2 | 4 (EP-007 a EP-010) |
| Roadmap | 5 sprints de 2 semanas + 1 semana buffer |
| Backlog Sprint 1 | 10 HU (9 alta, 1 media, ~110 pts estimados) |
| Hitos | 6 (M-001 a M-006) |

## Dependencias críticas del roadmap

| Dependencia | Fecha límite | Impacta a |
|---|---|---|
| DP-002 (Cloudflare UE) | 1 Jul | HU-009 (RRI/PEC), EP-005 (chatbot RAG) |
| DP-001 (Raíces spec) | 15 Jul | EP-004 (exportación) |
| DP-003 (firma legal) | 15 Jul | EP-004 (firma) |
| Decisión EP-006 (familias) | 7 Jul | Roadmap Sprints 4-5 |

## Planes B por riesgo

| Riesgo | Plan B |
|---|---|
| R-007 (Raíces sin spec) | Exportación manual CSV genérico |
| R-008 (Cloudflare fuera UE) | Chatbot RAG desactivado en MVP |
| R-006 (firma no válida) | EP-004 sin firma digital, solo informe descargable |

## Artefactos generados

| Archivo | Descripción |
|---|---|
| `epicas.md` | 10 épicas (5 MVP + 1 condicional + 4 Fase 2) con dependencias y riesgos |
| `roadmap.md` | Timeline 5 sprints + buffer, 6 hitos, riesgos que lo afectan |
| `backlog-detalle.md` | Sprint 1 descompuesto: 10 HU con criterios de aceptación |
