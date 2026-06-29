# Check Init — Plataforma E-T

**Fecha:** 2024-06-26 (simulado)
**Proyecto:** Plataforma de Orientación Integral E-T
**Perfil:** Alto (multiplicador 60)

## Checklist de 16 puntos

| # | Punto | Estado | Notas | Riesgos/Acciones generadas |
|---|---|---|---|---|
| 1 | Comunicación | ✅ | Canal con cliente definido (PO Ana + comité semanal) | — |
| 2 | Validación producto | ⚠️ | Comité semanal con dirección del centro, pero sin sesión de validación formal con usuarios finales (profesores, orientadores) | R-GEN-01: Validación sin usuarios finales → producto no adoptado |
| 3 | Planificación | ❌ | Roadmap sin fechas concretas. Cliente trajo visión general sin hitos | R-GEN-02: Sin planificación no se puede gestionar el sprint |
| 4 | Riesgos | ⚠️ | Cliente consciente de algunos riesgos pero sin registro formal. Este GEE es el primero | A-GEN-01: Formalizar registro de riesgos con el cliente |
| 5 | Calidad | ❌ | No hay plan de pruebas definido. Solo cobertura 80% PG Tap mencionada | R-GEN-03: Sin plan de pruebas, bugs en producción con datos de menores |
| 6 | Seguimiento | ✅ | Cliente usa Jira. SCRUM con sprints de 2 semanas | — |
| 7 | Documentación y priorización | ⚠️ | Documentación extensa pero KPIs sin formalizar. Priorización verbal, no documentada | A-GEN-02: Documentar KPIs con línea base |
| 8 | VP / gestión interna | ✅ | VP definido (Ana, PO). Equipo técnico asignado (3 FE + 2 BE + 1 QA) | — |
| 9 | Presentación resultados | ❌ | No hay formato definido para presentar avances al cliente | A-GEN-03: Definir plantilla de informe de progreso semanal |
| 10 | Dependencias | ❌ | Dependencias externas identificadas (Raíces, firma legal, Cloudflare UE) pero sin gestión formal | R-GEN-04: Dependencias sin gestión → bloqueos imprevistos |
| 11 | Gestión cambio | ⚠️ | Cambio de alcance detectado (vista familias, enfermería) pero sin proceso formal de change control | R-GEN-05: Cambios sin control → scope creep |
| 12 | Lecciones aprendidas | ❌ | No hay proceso definido para capturar lecciones | A-GEN-04: Definir sesión de retrospectiva por sprint |
| 13 | Seguridad y protección datos | ⚠️ | RLS definido, log de auditoría, pero firma legal sin dictamen y procesamiento IA en UE sin confirmar | R-GEN-06: Riesgo RGPD si IA procesa fuera de UE |
| 14 | Cierre proyecto | ❌ | No hay criterios de cierre ni definición de "hecho" del proyecto | A-GEN-05: Definir Definition of Done del proyecto |
| 15 | Sesiones / eventos | ✅ | SCRUM daily, sprint review, planificación. Cliente de acuerdo | — |
| 16 | Medios y permisos | ✅ | Stack decidido, accesos a Cloudflare/Supabase disponibles | — |

## Resumen

| Estado | Cantidad |
|---|---|
| ✅ Verdes | 6 |
| ⚠️ Amarillos | 4 |
| ❌ Rojos | 6 |

## Riesgos generados automáticamente por Check Init

| ID | Riesgo | Acción |
|---|---|---|
| R-GEN-01 | Validación sin usuarios finales → producto no adoptado | Incluir sesiones con orientadores y profesores en el comité semanal |
| R-GEN-02 | Sin planificación → no se puede gestionar el sprint | Ayudar al cliente a definir roadmap con hitos |
| R-GEN-03 | Sin plan de pruebas → bugs en producción con datos de menores | Exigir plan de pruebas antes de producción |
| R-GEN-04 | Dependencias sin gestión → bloqueos imprevistos | Crear registro de dependencias formal |
| R-GEN-05 | Cambios sin control → scope creep | Establecer proceso de change control |
| R-GEN-06 | RGPD si IA procesa datos fuera de UE | Confirmar con Cloudflare ubicación del procesamiento |

## Acciones generadas automáticamente por Check Init

| ID | Acción | Responsable |
|---|---|---|
| A-GEN-01 | Formalizar registro de riesgos con el cliente | PM (Josemi) |
| A-GEN-02 | Documentar KPIs con línea base | PM (Josemi) + Cliente |
| A-GEN-03 | Definir plantilla de informe de progreso semanal | PM (Josemi) |
| A-GEN-04 | Definir sesión de retrospectiva por sprint | PM (Josemi) |
| A-GEN-05 | Definir Definition of Done del proyecto | PM (Josemi) + Cliente |
