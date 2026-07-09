# Inventario de Documentos del Proyecto (durante la ejecución) — [Nombre del Proyecto]

Distinto de `output-paso-legacy/inventario-fuentes.md` (foto única al arrancar el proyecto, IDs `F-XXX`). Este archivo es acumulativo — nunca se sobrescribe ni se pierde una entrada — y cubre todo lo que se ha ido dejando en `documentos-proyecto/` a lo largo del proyecto, sea nuevo o antiguo pero descubierto tarde.

## Documentos

| ID | Archivo | Tipo | Fecha/Autor | Resumen | Fiabilidad | Impacto detectado | Estado | Última revisión |
|---|---|---|---|---|---|---|---|---|
| FD-001 | contrato-ampliacion-v2.pdf | Contractual | Cliente, 2026-06-15 | Amplía el alcance para incluir el módulo de facturación, no contemplado en RF actuales | Alta | Contradice el alcance de EP-002; introduce requisito nuevo no cubierto por ningún RF | ⏸️ Omitido temporalmente | 2026-06-20 |
| FD-002 | notas-reunion-equipo-back.md | Notas internas | Equipo backend, 2026-06-18 | El equipo confirma que el proveedor de pagos elegido no soporta reintentos automáticos | Media | Afecta a RNF-007 y al riesgo R-004 (registrado como asumido, habría que revisar) | ✅ Incorporado (2026-06-19) | 2026-06-19 |

**Notas de uso:**
- Numeración correlativa de tres dígitos, prefijo `FD` (Fuente Durante-proyecto) — no confundir ni reutilizar con los `F-XXX` del Paso Legacy.
- Estados: `🔲 Pendiente de revisar` (detectado, sin analizar todavía) → `🧠 Analizado` (con resumen e impacto ya calculados, pendiente de autorización) → `✅ Incorporado` / `⏸️ Omitido temporalmente` / `❌ Descartado`.
- Los documentos en `⏸️ Omitido temporalmente` se vuelven a presentar en cada revisión hasta que el PM decida — no desaparecen del radar.
- "Última revisión" es la fecha en la que se analizó o re-analizó el archivo (para detectar si ha cambiado desde entonces), no la fecha del propio documento.
