# DoD — Proyecto E-T

**Acordado con:** Equipo E-T (simulado)
**Fecha:** 2024-06-26
**Válido para:** MVP Septiembre 2026

## Criterios obligatorios

| # | Criterio | Notas para E-T |
|---|---|---|
| DOD-01 | Código implementado | — |
| DOD-02 | Code review realizado | Mínimo 1 aprobación |
| DOD-03 | Pruebas unitarias pasan | Cobertura mínima 80% en backend (RNF-14) |
| DOD-04 | Pruebas de integración pasan | Especial atención a flujos multi-tenant (no fugas de datos entre centros) |
| DOD-05 | Criterios de aceptación cumplidos | Demo con Ana (PO) |
| DOD-06 | Sin bugs conocidos críticos | Ningún bug de seguridad o pérdida de datos |
| DOD-07 | Documentación actualizada | Si cambia la ficha del alumno o los permisos RLS, documentar |
| DOD-08 | Desplegado en entorno de pruebas | Entorno staging en Cloudflare Pages |
| DOD-09 | Validado por PO | Ana valida en staging |
| DOD-10 | Sin regresiones | Verificar que otras funcionalidades existentes siguen funcionando |

## Criterios opcionales activados para E-T

| # | Criterio | Motivo |
|---|---|---|
| DOD-11 | Pruebas de seguridad | Datos de menores (RGPD, LOPIVI). Verificar RLS en cada HU |
| DOD-12 | Pruebas de rendimiento | Si la HU afecta a tiempos de respuesta del dashboard (RNF-14: <3s) |
| DOD-15 | Log de auditoría verificado | Toda HU que acceda a datos de menores debe tener auditoría verificada |
