# Roadmap — Plataforma E-T

**Fecha:** 2024-06-26
**Objetivo:** MVP Septiembre 2026
**Ritmo:** Sprints de 2 semanas

## Timeline

```
          Jul 2026               Ago 2026               Sep 2026
     ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
     │ S1│ S2│ S3│ S4│ S5│ B │   │   │   │   │   │   │   │
     │   │   │   │   │   │   │   │   │   │   │   │   │   │
EP-01 ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
EP-02 ░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
EP-03 ░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
EP-04 ░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░│
EP-05 ░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░│
EP-06 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
     │   │   │   │   │   │   │   │   │   │   │   │   │   │
     └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
     1-14 15-28 29-11 12-25 26-08 09-15
                    Ago          
```

## Detalle por sprint

### Sprint 1: 1-14 Jul 2026 — Fundación

| Épica | Objetivos | Hito |
|---|---|---|
| EP-001 | Multi-Tenant: alta de centros, login, roles básicos, invitación de usuarios. RF-001 a RF-010 (core) | Primer centro creado + usuario Gestor logado |
| EP-002 | Empezar modelo de datos del alumno. Definir esquema de las 7 categorías | Esquema de base de datos del Alumno 360 aprobado |

**Dependencias externas que deben activarse:**
- A-002: Confirmación Cloudflare UE (deadline 1 Jul)
- A-005: Proceso de change control (deadline 1 Jul)
- A-010: Sesiones con usuarios reales (deadline 1 Jul)

### Sprint 2: 15-28 Jul 2026 — Alumno 360

| Épica | Objetivos | Hito |
|---|---|---|
| EP-002 | Importación CSV, ficha del alumno con 7 categorías, salud básica, documentos restringidos (RF-034) | Ficha del alumno operativa con datos reales |
| EP-003 | Empezar incidencias: registro, wizard, clasificación con IA | Primera incidencia registrada de principio a fin |

**Dependencias externas que deben resolverse:**
- A-001: Especificación Raíces solicitada (deadline 15 Jul)
- A-003: Dictamen legal firma (deadline 15 Jul)
- A-008: MVP mínimo realista definido (deadline 7 Jul)
- A-012: Decisión sobre EP-006 (familias) y EP-008 (enfermería) (deadline 7 Jul)

### Sprint 3: 29 Jul - 11 Ago 2026 — Incidencias y Bienestar

| Épica | Objetivos | Hito |
|---|---|---|
| EP-003 | Casos, protocolos LOPIVI, notificaciones, re-clasificación | Protocolo LOPIVI completo trazado |
| EP-004 | Empezar informes: plantillas Word/ODT, inyección de datos con IA | Primer borrador de informe generado |

**Checkpoint:** A estas alturas debe estar decidido si EP-006 (familias) entra en MVP.

### Sprint 4: 12-25 Ago 2026 — Informes y Dashboard

| Épica | Objetivos | Hito |
|---|---|---|
| EP-004 | Firma digitalizada, consentimiento, exportación Raíces (si spec disponible) | Informe completo firmado y exportable |
| EP-005 | Dashboard de orientador, dashboard de dirección | Paneles operativos con datos reales |

**Dependencias externas para este sprint:**
- Especificación Raíces debe estar disponible (si no, EP-004 se entrega sin exportación)
- Dictamen legal sobre firma debe estar resuelto

### Sprint 5: 26 Ago - 8 Sep 2026 — Cierre y QA

| Épica | Objetivos | Hito |
|---|---|---|
| EP-005 | Dashboard CEO, chatbot RAG (si Cloudflare confirmado) | Paneles multi-centro operativos |
| Buffer | Corrección de bugs, pruebas de carga, ajustes de rendimiento | Sistema estable |
| EP-006 (si aplica) | Integración si se decidió incluirla en MVP | — |

**Si EP-006 entra en MVP**, su desarrollo ocuparía parte de Sprints 4-5.

### Buffer: 9-15 Sep 2026 — Preparación despliegue

| Actividad | Descripción |
|---|---|
| Testing final | E2E sobre flujos críticos, pruebas de carga con 200 usuarios |
| Formación | Sesiones con profesores y orientadores del centro piloto |
| Carga de datos | Migración de datos desde Fidias/Raíces al sistema |
| Despliegue | Puesta en producción |

## Hitos del roadmap

| Hito | Fecha | Descripción | Criterio de éxito |
|---|---|---|---|
| M-001 | 14 Jul | Centro creado + usuario logado | Primer tenant operativo |
| M-002 | 28 Jul | Ficha del alumno operativa | CSV importado, datos visibles |
| M-003 | 11 Ago | Incidencias y protocolos funcionando | Incidencia registrada → protocolo activado → trazabilidad completa |
| M-004 | 25 Ago | Informe generado y firmado | PDF descargable con datos reales y firma |
| M-005 | 8 Sep | Sistema estable + paneles operativos | Dashboard con datos, sin bugs críticos |
| M-006 | 15 Sep | Despliegue producción | Centro piloto usando el sistema en inicio de curso |

## Riesgos que afectan al roadmap

| Riesgo | Impacto en roadmap | Colchón aplicado |
|---|---|---|
| R-004 (fecha límite Sept) | No hay margen. Si algo se retrasa, se recorta EP-005 o EP-006 | Buffer de 1 semana (S5 + buffer) |
| R-007 (Raíces sin spec) | EP-004 se entrega sin exportación a Raíces | Plan B: exportación manual en CSV genérico |
| R-008 (Cloudflare UE) | Chatbot RAG no disponible en MVP | Plan B: Chatbot desactivado, solo dashboards |
| R-003 (scope creep) | Cualquier nuevo cambio desplaza algo del roadmap | Change control semanal obligatorio |
| R-006 (firma legal) | Si firma PNG no es válida, integrar firma electrónica → 2-3 sprints adicionales | Dependencia crítica. Si no se resuelve en Jul, EP-004 se entrega sin firma |
