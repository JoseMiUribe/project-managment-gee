# DoR + DoD — Data Platform (Analytics, ML, Pipelines)

**Proyecto tipo:** Pipelines de datos, dashboards de BI, modelos ML, ETL.
**Perfil de riesgo:** Alto (calidad de datos, escalabilidad, mantenimiento)

## DoR (Definition of Ready)

| # | Criterio | Obligatorio |
|---|---|---|
| DOR-01 | Fuente de datos identificada y accesible | Sí |
| DOR-02 | Calidad de datos esperada documentada | Sí |
| DOR-03 | Volumen de datos estimado (filas/día, tamaño) | Sí |
| DOR-04 | SLA de latencia definido (tiempo real, batch diario, semanal) | Sí |
| DOR-05 | Dependencias de infraestructura conocidas (clúster, storage, red) | Sí |
| DOR-06 | Criterios de aceptación con métricas verificables | Sí |
| DOR-07 | Tamaño estimado (S/M/L) | Sí |

**Nota:** Las HU de datos suelen tener alta incertidumbre. Usar talla L con descomposición en sub-tareas.

## DoD (Definition of Done)

| # | Criterio | Obligatorio | Factor de esfuerzo |
|---|---|---|---|
| DOD-01 | Código implementado + code review | Sí | — |
| DOD-02 | Tests unitarios (transformaciones, lógica de pipeline) | Sí | +15% |
| DOD-03 | Tests de integración con datos reales anonimizados | Sí | +20% |
| DOD-04 | Validación de calidad de datos (nulos, duplicados, rangos) | Sí | +10% |
| DOD-05 | Monitorización configurada (alertas de fallo, latencia) | Sí | +10% |
| DOD-06 | Documentación del pipeline (origen, transformaciones, destino) | Sí | +10% |
| DOD-07 | Sin fugas de datos sensibles (PII, GDPR) | Sí | — |
| DOD-08 | Pruebas de rendimiento con volumen real | Opcional | +15% |
| DOD-09 | Orquestación integrada (Airflow, Dagster, etc.) | Opcional | +5% |

**Factor DoD total:** ~65% sobre velocidad nominal (obligatorios), hasta +85% con opcionales.
**Cuándo usar:** Proyecto de datos con pipelines críticos y SLAs de calidad.
