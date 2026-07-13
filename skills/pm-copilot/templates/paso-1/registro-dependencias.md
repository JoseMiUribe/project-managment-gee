# Registro de Dependencias — [Nombre del Proyecto]

**Fecha última actualización:** YYYY-MM-DD

## Dependencias

| ID | Equipo | Dependencia | Criticidad RAG | Sistema 1 | Sistema 2 | Sistema 3 | Estado | Fecha compromiso | Riesgos asociados | Tarea de gestión (Jira) | Comentarios |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DP-001 | Equipo de Infraestructura del cliente | Aprovisionamiento del entorno cloud de preproducción | 🔴 Rojo | Azure (suscripción cliente) | VPN corporativa | — | Detectada | 2026-07-20 | R-002 | — (pendiente, sin Jira conectado) | 2026-07-06: dependencia identificada en kickoff, pendiente de interlocutor asignado por el cliente |

**Notas de uso:**
- Numeración correlativa de tres dígitos (DP-001, DP-002...).
- Estado avanza en el orden: Detectada → Comunicada → Negociada → En Resolución → Resuelta.
- Criticidad RAG: 🔴 bloquea entregas si no se resuelve pronto / 🟡 afecta pero hay margen / 🟢 deseable, no bloqueante.
- "Comentarios" funciona como histórico: añade una línea fechada por cada actualización relevante, no sobrescribas las anteriores.
- Toda dependencia con criticidad 🔴 o 🟡 debería tener al menos un riesgo asociado en `registro-riesgos.md`.
- **Toda fila de esta tabla es, por definición, una dependencia externa** (con un equipo/sistema fuera del control directo del equipo de entrega — de ahí las columnas Equipo/Sistema). Nunca la uses para una dependencia técnica entre dos HU del propio equipo (ej. "HU-024 depende de HU-023") — esas se anotan directamente en el campo `Dependencias` de cada historia (`generar-backlog-detalle.md`, Paso 3) y el equipo se autogestiona sin necesitar tarea de Jira ni alta aquí.
- **"Tarea de gestión (Jira)":** cuando esta dependencia bloquea el DoR de una HU concreta, necesita una tarea accionable en el backlog de Jira (prefijo `[GESTIÓN]`, ver `prompts/transversal/conectar-jira.md` y `prompts/paso-3/subir-historias-a-jira.md`) — no basta con que viva solo en esta fila. Guarda aquí la clave de Jira una vez creada; hasta entonces, `— (pendiente, sin Jira conectado)` o `— (pendiente, ninguna HU bloqueada todavía)` según el motivo.
