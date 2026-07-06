# Template: Roadmap Técnico

**Propósito:** Roadmap detallado para el equipo técnico y el PM. Sprints, dependencias, deadlines de riesgos y acciones.

**Nota:** Este documento se genera con `prompts/paso-2/generar-roadmaps.md`, siempre junto con `roadmap-cliente.md` (nunca en solitario). Es la fuente de detalle de la que se deriva el roadmap cliente.

---

# Roadmap Técnico — [Nombre del Proyecto]

> **Versión para:** Equipo de desarrollo + PM
> **Fecha:** [YYYY-MM-DD]
> **Basado en:** `capacidad-equipo/actual.md` (v[N] en el momento de generar este roadmap)
> **Velocidad estimada:** [optimista/realista/pesimista] pts/sprint

---

## 1. Resumen de capacidad

| Métrica | Valor |
|---|---|
| Velocidad realista | [X] pts/sprint |
| Duración del sprint | [X] días |
| Equipo disponible | [X] FE / [X] BE / [X] QA / [X] DevOps |
| Cuello de botella | [Área limitante] |
| Buffer por riesgos | [X]% |
| Fiabilidad del cálculo | [ALTA / MEDIA / BAJA] |

---

## 2. Línea de tiempo por sprints

### Sprint 1 — [Fechas]
**Objetivo:** [Descripción]
**Capacidad disponible:** [X pts]
**HU/épicas planificadas:** [EP-XXX / HU-XXX], [HU-XXX], [HU-XXX]
**Dependencias a resolver:** DP-XXX (deadline: [fecha])
**Acciones de riesgo:** A-XXX (deadline: [fecha])
**Asignación:**
- [Nombre/perfil]: [HU-XXX, HU-XXX]
- [Nombre/perfil]: [HU-XXX]
**Riesgos del sprint:** R-XXX (⚠️/mitigado)

### Sprint 2 — [Fechas]
...

### Sprint N — [Fechas]
...

---

## 3. Deadlines de dependencias (DP)

| DP | Descripción | Fecha límite | ¿En qué sprint? | Responsable de resolver | Estado |
|---|---|---|---|---|---|
| DP-001 | | | Sprint 1 | | ⏳ |
| DP-002 | | | Sprint 2 | | 🔴 Retrasado |
| DP-003 | | | Sprint 3 | | ✅ Resuelta |

## 4. Deadlines de acciones de riesgo (A)

| A | Descripción | Fecha límite | Sprint | Responsable | Estado |
|---|---|---|---|---|---|
| A-001 | | | Sprint 1 | | ⏳ |
| A-002 | | | Sprint 2 | | ✅ Hecho |
| A-003 | | | Sprint 1 | | ⏳ |

---

## 5. Hitos técnicos

| Hito | Fecha | Sprint | ¿Qué valida? |
|---|---|---|---|
| Entorno staging operativo | | Sprint 1 | Infraestructura lista |
| API pública v1 | | Sprint 2 | Backend desplegable |
| Primer release a producción | | Sprint 3 | MVP cerrado |
| Integración con sistema externo | | Sprint 4 | DP-002 resuelta |

---

## 6. Mapa de dependencias entre sprints

```
Sprint 1                    Sprint 2                    Sprint 3
─────────                   ─────────                   ─────────
HU-001 (tenant) ──bloquea──▶ HU-002 (etiquetas)         HU-011
HU-003 (auth)                                       ┌─▶ HU-012
HU-004 (botón)              HU-007 (invitación) ──bloquea──┤
                            HU-008 (coord)          └─▶ HU-013
                            DP-002 (Cloudflare UE) ──bloquea──▶ HU-009 (chatbot)
```

---

## 7. Riesgos con impacto en el roadmap

| Riesgo | Impacto en fechas | Plan de contingencia |
|---|---|---|
| R-005: Baja de persona clave | Sprint 2 se retrasa 1 semana | Formación cruzada antes de Sprint 1 |
| R-009: Dependencia externa no aprobada | HU-009 se mueve a Sprint 4 | Alternativa: implementación reducida sin la dependencia |
| R-013: Riesgo de calidad en escala | Sprint 1 +2 días | Validación temprana en Sprint 1 |

---

## 8. Próximos hitos de revisión

| Fecha | Qué se revisa |
|---|---|
| [Fin Sprint 1] | Velocidad real vs estimada → recalcular capacidad (nueva versión en `capacidad-equipo/`) |
| [Fin Sprint 2] | Dependencias externas → actualizar roadmap |
| [Fecha] | Revisión con cliente → ajustar prioridades |

---

> **Nota para el PM:** Este documento se regenera automáticamente ejecutando `prompts/paso-2/generar-roadmaps.md`. No lo edites manualmente. Los cambios se hacen en `epicas.md`, `capacidad-equipo/actual.md` o el GEE, y luego se regeneran ambos roadmaps (técnico y cliente) juntos.
