# Épicas — Plataforma E-T

**Fecha:** 2024-06-26
**Basado en:** requisitos funcionales (originales + nuevos) + zonas de incertidumbre

## MVP (Septiembre 2026)

| ID | Épica | Objetivo | Requisitos incluidos | Dependencias | Riesgos asociados | Prioridad |
|---|---|---|---|---|---|---|
| EP-001 | Multi-Tenant y Administración de Centros | Base del SaaS: alta de centros, gestión de usuarios, roles, facturación de licencias, calendario configurable | RF-001 a RF-010, RF-035, RF-041 | — | R-002 (dependencias externas), R-009 (costes IA) | P0 - Imprescindible |
| EP-002 | Ficha Única del Alumno (Alumno 360) | Core del sistema: ficha del alumno con datos personales, salud, académicos, importación CSV | RF-011 a RF-015, RF-034 | EP-001 (necesita centros y usuarios creados) | R-006 (datos sensibles) | P0 - Imprescindible |
| EP-003 | Incidencias y Bienestar Escolar | Gestión del día a día: observaciones, incidencias con gravedad, casos, protocolos LOPIVI, asistencia significativa | RF-016 a RF-025, RF-037, RF-042 | EP-001, EP-002 (necesita alumnos y usuarios) | R-003 (scope creep), R-005 (adopción) | P0 - Imprescindible |
| EP-004 | Informes y Documentación | Redacción de informes con IA, firma digitalizada, consentimiento familiar, exportación a Raíces | RF-026 a RF-029, RF-040 | EP-002, EP-003 (necesita datos del alumno e incidencias) | R-001 (requisitos imprecisos), R-006 (firma legal), R-007 (Raíces) | P0 - Imprescindible |
| EP-005 | Dashboards y Consulta | Paneles para orientadores, dirección y CEO. Chatbot RAG de normativa interna | RF-030 a RF-033 | EP-002, EP-003 (necesita datos para los paneles) | R-008 (Cloudflare UE), R-005 (adopción) | P1 - Importante |

## Condicional (MVP si hay tiempo / se decide)

| ID | Épica | Objetivo | Requisitos incluidos | Decisión pendiente | Riesgos asociados |
|---|---|---|---|---|---|
| EP-006 | Vista de Familias | Acceso read-only para familias: notas, incidencias, comunicación unidireccional | RF-038 | Alcance sin definir. Requiere autenticación de padres (2FA) | R-003 (scope creep), R-005 (adopción si familias no lo usan) |

## Fase 2 (Post-MVP)

| ID | Épica | Objetivo | Requisitos incluidos | Notas |
|---|---|---|---|---|
| EP-007 | Gestión Financiera del Centro | Cobros a familias, pedidos, facturas proforma | RF-036 | No es core del producto. Evaluar si realmente lo necesita el cliente o puede seguir en Fidias |
| EP-008 | Enfermería Escolar | Medicación, visitas a enfermería, autorizaciones | RF-039 (parcial, integrado en EP-002 para salud básica) | Si solo es alergias e intolerancias → ya cubierto en EP-002. Si es módulo completo → Fase 2 |
| EP-009 | Portal Completo de Familias | Comunicación bidireccional, autorizaciones online, seguimiento académico | — | Visión futura del cliente para Fase 2 |
| EP-010 | Integración Bi-direccional con Fidias/Raíces | Sincronización automática de datos sin CSV manual | — | Dependencia técnica compleja. Pospuesto |

## Relaciones entre épicas

```
EP-001 (Multi-Tenant) ────bloquea────▶ EP-002 (Alumno 360)
EP-001 + EP-002 ──────────bloquean───▶ EP-003 (Incidencias)
EP-002 + EP-003 ──────────bloquean───▶ EP-004 (Informes)
EP-002 + EP-003 ──────────bloquean───▶ EP-005 (Dashboards)
EP-004 (condiciona) ──────bloquea────▶ EP-006 (Familias)
```

## Notas

- EP-006 (familias) está condicionada a la decisión del comité semanal
- Si EP-006 entra en MVP, su autenticación (2FA) añade carga técnica a EP-001
- EP-007 y EP-008 no entran en MVP por decisión recomendada (focus en core)
