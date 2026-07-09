# DoR + DoD — API / Backend (Microservices, REST, GraphQL)

**Proyecto tipo:** APIs, microservicios, integraciones, backend-headless.
**Perfil de riesgo:** Medio-Alto (contratos, versionado, escalabilidad, seguridad)

## DoR (Definition of Ready)

| # | Criterio | Obligatorio |
|---|---|---|
| DOR-01 | Contrato de API definido (request/response, errores, códigos) | Sí |
| DOR-02 | Compatibilidad hacia atrás evaluada (breaking changes?) | Sí |
| DOR-03 | SLAs de rendimiento definidos (latencia p99, throughput) | Sí |
| DOR-04 | Dependencias con otros servicios conocidas | Sí |
| DOR-05 | Estrategia de autenticación/autorización definida | Sí |
| DOR-06 | Criterios de aceptación con ejemplos de request/response | Sí |
| DOR-07 | Tamaño estimado (S/M/L) | Sí |

## DoD (Definition of Done)

| # | Criterio | Obligatorio | Factor de esfuerzo |
|---|---|---|---|
| DOD-01 | Código implementado + code review | Sí | — |
| DOD-02 | Tests unitarios (capa de servicio, lógica de negocio) | Sí | +15% |
| DOD-03 | Tests de contrato (compatibilidad con consumidores) | Sí | +15% |
| DOD-04 | Tests de integración con servicios reales stub | Sí | +10% |
| DOD-05 | Documentación OpenAPI/GraphQL actualizada | Sí | +5% |
| DOD-06 | Rendimiento validado (SLAs p99) | Sí | +10% |
| DOD-07 | Seguridad validada (OWASP top 10, autenticación, rate limiting) | Sí | +10% |
| DOD-08 | Monitorización + alertas configuradas | Sí | +5% |
| DOD-09 | Desplegado en staging + validado por PO | Sí | — |
| DOD-10 | Logs de auditoría (si datos sensibles) | Opcional | +5% |

**Factor DoD total:** ~70% sobre velocidad nominal (obligatorios), hasta +75% con opcionales.
**Cuándo usar:** Proyecto backend puro o con API expuesta a terceros.
