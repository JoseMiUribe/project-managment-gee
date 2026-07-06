# Registro de Dependencias — [Nombre del Proyecto]

**Fecha última actualización:** YYYY-MM-DD

## Dependencias

| ID | Equipo | Dependencia | Criticidad RAG | Sistema 1 | Sistema 2 | Sistema 3 | Estado | Fecha compromiso | Riesgos asociados | Comentarios |
|---|---|---|---|---|---|---|---|---|---|---|
| DP-001 | Equipo de Infraestructura del cliente | Aprovisionamiento del entorno cloud de preproducción | 🔴 Rojo | Azure (suscripción cliente) | VPN corporativa | — | Detectada | 2026-07-20 | R-002 | 2026-07-06: dependencia identificada en kickoff, pendiente de interlocutor asignado por el cliente |

**Notas de uso:**
- Numeración correlativa de tres dígitos (DP-001, DP-002...).
- Estado avanza en el orden: Detectada → Comunicada → Negociada → En Resolución → Resuelta.
- Criticidad RAG: 🔴 bloquea entregas si no se resuelve pronto / 🟡 afecta pero hay margen / 🟢 deseable, no bloqueante.
- "Comentarios" funciona como histórico: añade una línea fechada por cada actualización relevante, no sobrescribas las anteriores.
- Toda dependencia con criticidad 🔴 o 🟡 debería tener al menos un riesgo asociado en `registro-riesgos.md`.
