# DoR + DoD — Mobile App (iOS + Android)

**Proyecto tipo:** App nativa o híbrida con publicación en stores.
**Perfil de riesgo:** Alto (stores, versionado, fragmentación dispositivos, UX táctil)

## DoR (Definition of Ready)

| # | Criterio | Obligatorio |
|---|---|---|
| DOR-01 | Descripción "Como... quiero... para..." clara | Sí |
| DOR-02 | Criterios de aceptación con condiciones offline/online | Sí |
| DOR-03 | Diseños aprobados para todos los estados (carga, vacío, error, éxito) | Sí |
| DOR-04 | Definido comportamiento sin conexión | Sí |
| DOR-05 | Compatibilidad con versiones de SO definida | Sí |
| DOR-06 | Dependencias conocidas (push notifications, stores, APIs externas) | Sí |
| DOR-07 | Tamaño estimado (S/M/L) | Sí |

**Nota:** Si la HU requiere publicación en store (Apple Review, Google Play), necesita un sprint extra de buffer.

## DoD (Definition of Done)

| # | Criterio | Obligatorio | Factor de esfuerzo |
|---|---|---|---|
| DOD-01 | Código implementado + code review | Sí | — |
| DOD-02 | Tests unitarios (lógica de negocio) | Sí | +15% |
| DOD-03 | Tests en dispositivo real (mín 3 modelos) | Sí | +15% |
| DOD-04 | Tests offline/online | Sí | +10% |
| DOD-05 | Sin crashes ni ANRs | Sí | — |
| DOD-06 | Validado por PO en TestFlight/Play Console | Sí | — |
| DOD-07 | Push notifications probadas (si aplica) | Sí | +5% |
| DOD-08 | Documentación para App Review preparada | Sí | +5% |
| DOD-09 | Rendimiento validado (tiempo de carga < 2s) | Opcional | +10% |
| DOD-10 | Traducciones completas (si multi-idioma) | Opcional | +5% |

**Factor DoD total:** ~50% sobre velocidad nominal (obligatorios), hasta +65% con opcionales.
**Cuándo usar:** Proyecto mobile con publicación en stores y usuarios reales.
