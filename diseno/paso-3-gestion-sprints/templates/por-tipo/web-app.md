# DoR + DoD — Web App (SaaS, Dashboard, CRUD)

**Proyecto tipo:** Aplicación web con login, perfiles, formularios, listados, dashboard.
**Perfil de riesgo:** Medio (datos de clientes, disponibilidad, usabilidad)

## DoR (Definition of Ready)

| # | Criterio | Obligatorio |
|---|---|---|
| DOR-01 | Descripción "Como... quiero... para..." clara | Sí |
| DOR-02 | Criterios de aceptación en Gherkin | Sí |
| DOR-03 | Mockups/diseños aprobados (si hay UI nueva) | Sí |
| DOR-04 | Dependencias conocidas y no bloqueantes | Sí |
| DOR-05 | Tamaño estimado (S/M/L) | Sí |
| DOR-06 | Riesgos de datos personales identificados (si aplica) | Sí |
| DOR-07 | HU no gigante (máx 3 días dev) | Sí |

**Opción por defecto para el proyecto:** Usar este DoR salvo que el equipo tenga criterios diferentes.

## DoD (Definition of Done)

| # | Criterio | Obligatorio | Factor de esfuerzo |
|---|---|---|---|
| DOD-01 | Código implementado + code review | Sí | — |
| DOD-02 | Tests unitarios pasan (mín 80% cobertura) | Sí | +15% |
| DOD-03 | Tests de integración (flujos multi-pantalla) | Sí | +10% |
| DOD-04 | Responsive validado (móvil + tablet + escritorio) | Sí | +5% |
| DOD-05 | Sin bugs críticos/altos | Sí | — |
| DOD-06 | Validado por PO en staging | Sí | — |
| DOD-07 | Sin regresiones en funcionalidades existentes | Sí | — |
| DOD-08 | Accesibilidad WCAG AA (si es pública) | Opcional | +10% |
| DOD-09 | Documentación de usuario actualizada | Opcional | +5% |

**Factor DoD total:** ~30% sobre velocidad nominal (obligatorios), hasta +45% con opcionales.
**Cuándo usar:** Proyecto web estándar con usuarios reales desde el día 1.
