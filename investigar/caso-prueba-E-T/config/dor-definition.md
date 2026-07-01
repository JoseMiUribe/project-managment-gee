# DoR — Proyecto E-T

**Acordado con:** Equipo E-T (simulado)
**Fecha:** 2024-06-26
**Válido para:** MVP Septiembre 2026

## Criterios obligatorios

| # | Criterio | Notas para E-T |
|---|---|---|
| DOR-01 | Descripción clara (Como... quiero... para...) | — |
| DOR-02 | Criterios de aceptación en Gherkin | — |
| DOR-03 | Criterios verificables | Especialmente importante para flujos LOPIVI: "el registro queda en auditoría" |
| DOR-04 | Dependencias conocidas | Marcadas con DP-XXX |
| DOR-05 | Dependencias no bloqueantes | Si depende de DP-002 (Cloudflare UE) o DP-003 (firma legal), la HU no puede entrar sin resolución previa |
| DOR-06 | Riesgos identificados | Riesgos de datos sensibles (R-006) deben estar mitigados antes de empezar |
| DOR-07 | El equipo entiende el QUÉ | Validar en refinamiento. Especial atención a flujos LOPIVI |
| DOR-08 | Diseños aprobados (si aplica) | Necesario para HU con componente visual (dashboard, ficha alumno) |
| DOR-09 | Tamaño estimado | Usar talla S/M/L |
| DOR-10 | HU no gigante | Máximo 3 días de desarrollo por HU |

## Criterios opcionales activados para E-T

| # | Criterio | Motivo |
|---|---|---|
| DOR-11 | Pruebas unitarias planificadas | Exigido por RNF-14 (cobertura 80%) |
| DOR-13 | Datos de prueba disponibles | El centro piloto debe poder probar con datos reales anonimizados |
