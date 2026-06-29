# Paso 0 — Captura de Requisitos E-T (simulación)

**Fecha:** 2024-06-26
**Input:** guia-combinada-entrevista.md + post-entrevista-cliente.md
**Estado:** Completado (simulado con respuestas hipotéticas del cliente)

## Resumen de la entrevista

| Aspecto | Resultado |
|---|---|
| Contradicciones resueltas | Todas las de la guía tienen respuesta del cliente |
| Nuevos hallazgos | Módulo enfermería, exportación Raíces, iPad, calendario configurable |
| Pendientes de resolver | Firma legal (sin dictamen), matriz gravedad (propuesta nuestra) |
| Alternativas a evaluar | Gestión financiera del centro (¿entra en MVP o no?) |

## Artefactos generados

| Archivo | Descripción |
|---|---|
| `peticiones-cliente.md` | Listado en bruto de todo lo que pidió el cliente (19 items) |
| `requisitos-funcionales.md` | 9 RF nuevos (RF-034 a RF-042) + 3 modificaciones + 4 reglas de negocio |
| `requisitos-nofuncionales.md` | 6 RNF nuevos (RNF-14 a RNF-19) + 3 modificaciones + 3 RNF implícitos |
| `zonas-incertidumbre.md` | 12 zonas de incertidumbre con riesgos y acciones sugeridas |

## Lo que alimenta al GEE (Paso 1)

### Riesgos iniciales (desde zonas de incertidumbre)

| ID | Riesgo inicial | Prob | Imp | Acción sugerida |
|---|---|---|---|---|
| R-PRE-01 | Firma sin validez legal → retraso | Media | Alta | Conseguir dictamen legal |
| R-PRE-02 | Gestión financiera dispersa el foco del MVP | Alta | Alta | Evaluar si entra o no |
| R-PRE-03 | Vista familias sin especificar → esfuerzo no estimado | Alta | Media | Definir alcance mínimo |
| R-PRE-04 | Sin plan de migración → sistema vacío en piloto | Alta | Alta | Diseñar plan de migración |

### Dependencias iniciales

| ID | Dependencia | Sistema | Estado |
|---|---|---|---|
| DP-PRE-01 | Especificación técnica de Raíces (formato exportación) | Comunidad de Madrid | Pendiente de solicitar |
| DP-PRE-02 | Dictamen legal sobre firma digitalizada | Departamento legal | Pendiente |
| DP-PRE-03 | Confirmación Cloudflare: procesamiento IA en UE | Cloudflare / Proveedor | Pendiente de verificar |
