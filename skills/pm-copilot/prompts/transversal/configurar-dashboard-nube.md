# Prompt: Configurar dashboard compartido (modo nube)

> **Nivel:** 🧠 Diseño (conversación) — no hay heurística automática que decida esto por el PM; es una decisión suya sobre cómo quiere trabajar con su equipo en este cliente concreto.

## Qué resuelve este prompt

Hoy el dashboard (`dashboard/`, instalado por el bootstrap) es 100% local: corre en `localhost`, en la máquina del PM, y la única forma de continuidad multi-máquina es que `investigar/[proyecto]/` viva dentro de una carpeta sincronizada con Drive Desktop (ver Bootstrap, punto 8, y "Dashboard de reporting" en `SKILL.md`) — eso sincroniza los **archivos**, pero no da una URL única que un compañero pueda simplemente abrir para ver/editar el mismo dashboard en vivo.

Este prompt ofrece esa otra opción: un dashboard **compartido**, alojado en Google (Apps Script + una Google Sheet como base de datos), con una única URL que el PM y su equipo pueden abrir desde cualquier sitio, sin instalar nada. Es un **modo opcional adicional**, nunca un reemplazo — el modo local sigue funcionando exactamente igual si el PM no quiere esto, o si no puede usarlo por cualquier motivo (datos sensibles del cliente, no le interesa ahora, o la función aún no está construida en esta versión del skill).

## Antes de nada: comprueba si la Fase 2 ya existe en este skill

Este prompt asume que existe una aplicación Apps Script ya lista para desplegar, documentada en `dashboard/cloud-apps-script/README.md`. **Comprueba con el Read/Glob tool si esa carpeta y ese README existen en esta instalación del skill antes de continuar.**

- **Si existen:** sigue sus instrucciones de despliegue/uso en las ramas B y A de abajo.
- **Si NO existen todavía** (esta capacidad sigue en construcción): dilo con claridad al PM — "el modo nube compartido está planeado pero todavía no implementado en esta versión del skill". No inventes una URL, un ID de Sheet, ni pasos de despliegue que no existen. En ese caso la única rama practicable hoy es la C (seguir en local), y puedes ofrecer marcar `modo: "pendiente_nube"` para que quede constancia del interés y una futura versión del skill lo retome sin tener que volver a explicar el contexto desde cero.

## Cuándo se dispara esta conversación

- **Proyecto nuevo**: justo después de instalar el dashboard local (Bootstrap, paso 4), una vez, antes de seguir con el resto del arranque.
- **Proyecto existente sin `.pm-copilot.json`**: la primera vez que retomes ese proyecto tras esta actualización del skill, pregúntalo una vez (no lo des por hecho ni lo dejes para más adelante sin más).
- **Bajo demanda**: en cualquier momento que el PM diga algo como "quiero compartir esto con un compañero" o "configura el dashboard en la nube".
- **Nunca más de una vez de forma proactiva** una vez `.pm-copilot.json` existe con una decisión explícita (`modo: "local"` con `estado: "descartado"`, o `modo: "nube"` con `estado: "activo"`). Si `estado` quedó en `pendiente_nube` (el PM pidió que se le recuerde más adelante, o la Fase 2 no estaba lista), no repitas la conversación completa — usa el aviso de una línea descrito al final.

## Las tres ramas

Pregunta directamente: *"¿Quieres que el dashboard de este proyecto sea compartido (una URL en Google que tú y tu equipo podéis abrir todos), o prefieres seguir con el dashboard local de siempre?"*

### Rama A — "Ya tengo un dashboard compartido para este cliente"

Puede pasar si el cliente ya tiene otro proyecto/engagement con el modo nube activado (recuerda: una misma Google Sheet puede alojar varios proyectos del mismo cliente, ver `SKILL.md`/plan de modo cloud).

1. Pide: nombre del cliente, el ID de la Google Sheet (de la URL `.../spreadsheets/d/<ID>/edit`), la URL del Apps Script Web App desplegado, y un identificador corto para este proyecto concreto dentro de esa Sheet (`proyectoId`, ej. `colibri-salud-fase2`).
2. **Verificación oportunista, nunca bloqueante**: si en esta sesión hay un conector de Google Drive/Sheets disponible (compruébalo con `ToolSearch` usando palabras clave como "drive" o "sheets"), úsalo para confirmar que el archivo existe y que el PM tiene acceso (ej. `get_file_metadata`/`get_file_permissions`) antes de guardar la configuración. Si no hay conector disponible, confía en los datos que te da el PM sin más comprobación — no le pidas que instale nada solo para esto.
3. Escribe `.pm-copilot.json` (ver esquema abajo) con `modo: "nube"`, `estado: "activo"`.

### Rama B — "Quiero crear uno nuevo"

1. Si `dashboard/cloud-apps-script/README.md` no existe todavía (ver arriba), explica la limitación actual y ofrece la Rama C con `pendiente_nube`. No sigas con los pasos de abajo.
2. Si sí existe: pregunta primero **si los datos de este cliente son demasiado sensibles para plantear esto ahora mismo** — es una decisión del PM, no una heurística automática; si la respuesta es sí, ve directo a la Rama C.
3. Si no hay reparo de sensibilidad, guía al PM paso a paso por `dashboard/cloud-apps-script/README.md` (crear la Sheet desde la plantilla/función de bootstrap, desplegar el Apps Script Web App si el equipo aún no tiene uno desplegado, compartir la Sheet con quien corresponda). Recuerda: el aprovisionamiento es **siempre guiado, nunca lo ejecutas tú por él** — no crees recursos de Google Cloud/Workspace en su nombre.
4. Una vez completado y confirmado por el PM, escribe `.pm-copilot.json` con `modo: "nube"`, `estado: "activo"`.
5. Si el PM empieza el proceso pero lo deja a medias (ej. está esperando compartir la Sheet con IT o un compañero), guarda `estado: "pendiente_compartir"` con una nota de qué falta — así una sesión futura puede retomarlo sin re-explicar todo.

### Rama C — "Prefiero seguir en local por ahora"

Pregunta brevemente el motivo (opcional, solo para `notas` — no insistas si no quiere decirlo) y distingue dos casos:

- **Decisión firme** ("no quiero esto para este cliente", datos sensibles, o simplemente prefiere local): `modo: "local"`, `estado: "descartado"`. No se vuelve a preguntar de forma proactiva para este proyecto.
- **"Ahora no, pero pregúntamelo más adelante"** (incluye el caso de la Fase 2 aún no construida): `modo: "pendiente_nube"`, `estado` describiendo el motivo (`"esperando_fase2"`, `"datos_sensibles_revisar"`, `"no_prioritario"`, lo que aplique). Esto activa el aviso de una línea en sesiones futuras (ver abajo).

## Esquema de `.pm-copilot.json`

Se guarda en la raíz del proyecto (`investigar/[proyecto]/.pm-copilot.json`, junto a `.pm-copilot-cache.json`, no dentro de `dashboard/`). Nunca contiene credenciales ni tokens — solo IDs de recursos públicos-para-el-equipo (Sheet ID, URL del Web App), igual de sensibles que cualquier enlace de Drive que ya se comparte hoy por chat/email.

```json
{
  "version": 1,
  "modo": "local",
  "preguntadoEl": "2026-07-16",
  "cloud": {
    "cliente": "Colibrí Salud",
    "proyectoId": "colibri-salud-fase1",
    "sheetId": null,
    "webAppUrl": null,
    "estado": "descartado",
    "verificadoEl": null,
    "notas": "Prefiere seguir en local por ahora; sin motivo de datos sensibles."
  }
}
```

Si `modo` es `"nube"` (Rama A o B completada), rellena `sheetId`/`webAppUrl`/`verificadoEl` con los valores reales. Si `modo` es `"local"` o `"pendiente_nube"`, esos tres campos quedan en `null` — no hay recurso cloud real todavía.

## Aviso de una línea en sesiones futuras

Mientras `estado` sea `pendiente_nube` (o cualquier variante de "ahora no pero pregúntame luego"), muestra **una sola línea**, una vez por sesión, en algún punto natural de la conversación (no interrumpas un flujo en curso para esto):

> 💡 Este proyecto no tiene dashboard compartido en la nube todavía. Puedes configurarlo cuando quieras diciendo "configura el dashboard en la nube".

Nunca repitas la conversación completa de las 3 ramas de forma proactiva — solo si el PM la pide explícitamente otra vez. Si `modo` es `"local"` con `estado: "descartado"`, ni siquiera muestres este aviso — fue una decisión firme.
