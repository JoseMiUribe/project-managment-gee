# Registro de Dependencias — E-T

## Registro

| ID | Equipo | Dependencia | Criticidad RAG | Sistema 1 | Sistema 2 | Sistema 3 | Estado | Fecha compromiso | Riesgos asociados | Comentarios |
|---|---|---|---|---|---|---|---|---|---|---|
| DP-001 | Comunidad de Madrid | Especificación técnica de exportación a Raíces (formato fichero, campos, frecuencia) | 🟡 | E-T | Raíces (CAM) | — | Detectada | Pendiente | R-007 | Solicitar a través del cliente. Sin esto no se puede implementar RF-040 |
| DP-002 | Cloudflare | Confirmación de que Workers AI e iSearch procesan embeddings dentro de UE | 🟡 | E-T | Cloudflare Workers AI | — | Detectada | Pendiente | R-008 | Sin esta confirmación el chatbot RAG no es legal según RGPD |
| DP-003 | Departamento Legal (cliente) | Dictamen sobre validez legal de firma digitalizada PNG escaneada | 🟡 | E-T | — | — | Detectada | Pendiente | R-006 | El cliente dijo que lo consultaría con su abogado. Sin respuesta aún |
| DP-004 | Fidias | Acceso a datos de alumnos para migración inicial (importación CSV) | 🟡 | E-T | Fidias | — | Detectada | Pendiente | R-002 | No hay plan de migración. Necesitamos saber si Fidias permite exportar CSV con los campos requeridos |
| DP-005 | Apple / Centro escolar | Confirmación de que iPads del centro son compatibles con la versión de Safari y ShadCN | 🟢 | E-T | iPad Safari | — | Detectada | Pendiente | R-005 | Probarlo antes de desarrollo. Si hay incompatibilidades, saberlo ahora |
| DP-006 | Equipo de desarrollo E-T | Capacidad del equipo para absorber vista familias y enfermería en MVP | 🟡 | E-T | — | — | En Resolución | Pendiente | R-003 | Evaluar esfuerzo estimado antes de comprometer. Decisión en comité semanal |
