# DoR + DoD — MVP / Prototipo

**Proyecto tipo:** Prueba de concepto, MVP para validar con usuarios, prototipo funcional.
**Perfil de riesgo:** Bajo (se asume que se reescribirá o evolucionará)

## DoR (Definition of Ready)

| # | Criterio | Obligatorio |
|---|---|---|
| DOR-01 | Objetivo de la HU claro (qué queremos aprender/validar) | Sí |
| DOR-02 | Criterios de aceptación mínimos (no hace falta Gherkin completo) | Sí |
| DOR-03 | Tamaño estimado (S/M/L) | Sí |
| DOR-04 | Dependencias conocidas | No (se resuelven sobre la marcha) |

**Nota:** En MVP se prioriza velocidad sobre formalismo. El DoR es ligero a propósito.

## DoD (Definition of Done)

| # | Criterio | Obligatorio | Factor de esfuerzo |
|---|---|---|---|
| DOD-01 | Código implementado (puede ser sin tests) | Sí | — |
| DOD-02 | Funciona en entorno de desarrollo | Sí | — |
| DOD-03 | Validado por PO (demo rápida, no hace falta staging) | Sí | — |
| DOD-04 | Sin crashes/bloqueos en flujo principal | Sí | — |
| DOD-05 | Documentación mínima (README con cómo ejecutar) | Sí | +5% |
| DOD-06 | Tests unitarios solo en lógica crítica | Opcional | +10% |
| DOD-07 | Code review (puede ser pairing) | Opcional | — |
| DOD-08 | Desplegado para usuarios de prueba | Opcional | +10% |

**Factor DoD total:** ~5% sobre velocidad nominal (obligatorios), hasta +25% con opcionales.
**Cuándo usar:** Prototipos, MVPs, pruebas de concepto, hackathons.
**Regla:** Si el MVP valida y se pasa a producción, el DoD se endurece en la siguiente iteración.
