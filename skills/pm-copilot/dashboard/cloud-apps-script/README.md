# Dashboard — Modo Nube (Google Apps Script + Google Sheets)

Esta carpeta es una aplicación Apps Script **independiente y completa** — no un backend que se enchufa al `server.js` de modo local. Sustituye a la vez a Express (hosting), a los 9 writers de markdown (datos) y a Firebase/Firestore (que se descartó por falta de permisos de organización). El modo local (`dashboard/server.js` + `dashboard/public/`) no cambia en absoluto: esto es un modo adicional, opcional, para cuando un PM quiere compartir el dashboard y los datos de un cliente con su equipo sin que nadie tenga que instalar nada.

**Quién puede desplegar esto:** cualquier persona con cuenta de Google Workspace de la empresa, sin permisos de administrador ni de IT — Apps Script se crea bajo la cuenta de quien lo hace, igual que crear un documento de Drive.

**Yo (Claude) he escrito todo el código de esta carpeta, pero no he podido desplegarlo ni probarlo contra una Sheet/Apps Script reales** — no tengo acceso a ninguna cuenta de Google. Todo lo de abajo hay que ejecutarlo y verificarlo a mano, siguiendo el checklist al final.

---

## Arquitectura en una frase

**Un único Web App de Apps Script, desplegado una sola vez, sirve a todos los clientes** — cada URL incluye `?sheet=<ID de la Google Sheet del cliente>&proyecto=<identificador del engagement>`, y el propio Apps Script abre esa Sheet dinámicamente. El aislamiento entre clientes no lo garantiza ninguna lógica de este código: lo garantiza el permiso de la Google Sheet en sí (compartida solo con quien corresponda) combinado con desplegar el Web App con **"Ejecutar como: el usuario que accede"** — así, si un compañero no tiene esa Sheet compartida, `SpreadsheetApp.openById(...)` simplemente falla para él. Compartir el dashboard de un proyecto con alguien se reduce a **compartir la Google Sheet con esa persona**, exactamente como cualquier archivo de Drive.

## Archivos de esta carpeta

| Archivo | Qué es |
|---|---|
| `Code.gs` | El "servidor": `doGet` (enruta a la página del dashboard o a la vista de impresión), las funciones `apiGetData`/`apiPostSync`/`apiPutGee`/`apiPostGee`/`apiPostDailylog`/`apiPutSprintHu` (llamadas desde el navegador vía `google.script.run`), la lectura/escritura sobre `SpreadsheetApp`, y `bootstrapClientSheet` (aprovisionamiento). |
| `TipoDescriptorsSheets.gs` | Tabla única de qué pestañas existen en la Sheet, sus columnas, y cómo tratarlas (editable, solo lectura, ledger...) — el equivalente en modo nube de `dashboard/lib/dataBackend/tipoDescriptors.js`. |
| `PrintView.gs` | Copia casi verbatim de `dashboard/lib/printView.js` — genera el HTML del informe completo, que se abre en pestaña nueva para imprimir a PDF. |
| `Index.html` | La página del dashboard interactivo — mismo HTML que `dashboard/public/index.html`, adaptado al patrón `include()` de Apps Script. |
| `AppJs.html` | Copia adaptada de `dashboard/public/app.js` (2300+ líneas, casi todas sin cambios) — solo se tocó cómo llama al "servidor" (`google.script.run` en vez de `fetch`), el botón de PDF (abre la vista de impresión en vez de llamar a Playwright) y la fila de cada documento (sin botones de Ver/PDF, solo metadatos). |
| `Styles.html` | Copia sin cambios de `dashboard/public/styles.css`, envuelta en `<style>`. |

---

## Esquema de la Google Sheet (una por cliente)

Cada pestaña corresponde a una fila de esta tabla. `kind` determina si se edita desde el dashboard o no:

| Pestaña | kind | Qué guarda |
|---|---|---|
| Riesgos, Dependencias, Acciones, Impedimentos, Changelog | `registro` | Los 5 tipos del GEE — editable desde el dashboard, igual que en local. |
| Peticiones, RequisitosFuncionales, RequisitosNoFuncionales, ZonasIncertidumbre | `registro` | Los 4 tipos de Requisitos (Paso 0) — editable desde el dashboard. |
| CambiosPendientes | `ledger` | Registro append-only de cada edición hecha desde el dashboard (igual que `output-transversal/cambios-pendientes-dashboard.md` en local). |
| Documentos | `catalogo` | Solo metadatos (título/ruta/tamaño/fecha) de los `.md` que genera el skill. **El contenido real NO viaja a la nube** — sigue viviendo en el disco local o en la carpeta sincronizada con Drive Desktop del PM (misma decisión ya tomada para evitar un conector nuevo con la API de Drive). Por eso el catálogo en modo nube no tiene botones de Ver/PDF/Descargar. |
| Epicas, RoadmapClienteHitos, Sprints, SprintHU, ReglasNegocio | `lectura-tabular` | Una fila por registro, de solo lectura (igual que en modo local: el dashboard nunca los edita, solo los muestra). Se rellenan en la migración (Fase 3, todavía no construida) o a mano. |
| RoadmapClienteMeta, RoadmapTecnico, Legacy | `lectura-json` | Datos heterogéneos/anidados que no vale la pena normalizar en columnas — una fila por proyecto con el objeto ya parseado completo en una columna `DatosJSON`. |
| Capacidad | `lectura-json` (versionado) | Igual que arriba, pero una fila **por versión** (`v1`, `v2`...) con una columna `EsActual` marcando cuál es la vigente — replica el patrón de `capacidad-equipo/v1.md, v2.md, actual.md` de modo local. |
| Dailylogs | `dailylog` | Una fila por fecha. `ProgresoJSON`/`ActualizacionesGeeJSON` los rellena la migración/el skill; `NotasJSON` sí es editable desde el dashboard (botón "Añadir nota"), igual que en local. |

**No reordenes columnas a mano en la Sheet** — la lectura es posicional (más simple y rápido que buscar por nombre de cabecera en cada llamada), así que el orden declarado en `TipoDescriptorsSheets.gs` debe coincidir siempre con el de la fila 1 de cada pestaña. `bootstrapClientSheet` ya las crea en el orden correcto.

---

## Desplegar el Web App (una sola vez para toda la empresa, o para tu equipo)

1. Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**. Ponle un nombre reconocible, ej. "PM Copilot — Dashboard nube".
2. Borra el `Code.gs` vacío que trae por defecto y crea, uno por uno, estos archivos con el **mismo nombre exacto** (el editor de Apps Script distingue `.gs` de `.html` por un desplegable al crear el archivo, no por lo que escribas en el nombre):
   - `Code` (tipo Script) → pega el contenido de `Code.gs`
   - `TipoDescriptorsSheets` (tipo Script) → pega el contenido de `TipoDescriptorsSheets.gs`
   - `PrintView` (tipo Script) → pega el contenido de `PrintView.gs`
   - `Index` (tipo HTML) → pega el contenido de `Index.html`
   - `AppJs` (tipo HTML) → pega el contenido de `AppJs.html`
   - `Styles` (tipo HTML) → pega el contenido de `Styles.html`
3. **Desplegar → Nueva implementación → tipo "Aplicación web"**:
   - **Ejecutar como:** *el usuario que accede a la aplicación web* (NO "Yo" — esto es lo que hace que el permiso de cada Sheet sea el único control de acceso real, ver "Arquitectura" arriba).
   - **Quién tiene acceso:** *Cualquier usuario de [tu dominio de Workspace]*.
4. Copia la URL que te da ("URL de la aplicación web") — es la misma para todos los clientes/proyectos, solo cambian los parámetros `?sheet=...&proyecto=...` en cada enlace concreto.
5. Cada vez que actualices el código (una nueva versión de este skill trae cambios aquí), vuelve a **Desplegar → Gestionar implementaciones → Editar → Nueva versión** — la URL no cambia.

## Crear la Sheet de un cliente nuevo

1. Crea una Google Sheet en blanco, nómbrala de forma reconocible (ej. "PM Copilot — Colibrí Salud"), y **compártela solo con quien corresponda** (el equipo de ese cliente) — este paso es el control de acceso real.
2. Copia su ID (el fragmento entre `/d/` y `/edit` en la URL).
3. En el proyecto de Apps Script del paso anterior, añade temporalmente esta función (con el ID pegado), selecciónala en el desplegable de funciones del editor, y pulsa ▶ Ejecutar:
   ```js
   function bootstrapNuevoCliente() {
     Logger.log(bootstrapClientSheet('PEGA_AQUI_EL_ID_DE_LA_SHEET'));
   }
   ```
   La primera vez te pedirá autorizar permisos (acceso a Sheets) — es tu propia cuenta autorizando tu propio script, normal en Apps Script.
4. Verifica en la Sheet que aparecieron todas las pestañas de la tabla de arriba, cada una con su fila de cabecera. Puedes borrar la función `bootstrapNuevoCliente` después (o dejarla, es inofensiva).
5. La URL del dashboard para un proyecto/engagement concreto dentro de esa Sheet es:
   ```
   <URL de la aplicación web>?sheet=<ID de la Sheet>&proyecto=<identificador-corto-del-proyecto>
   ```
   `proyecto` es libre (ej. `colibri-salud-fase1`) — es el mismo valor que se guarda en `.pm-copilot.json` del proyecto local (`cloud.proyectoId`).

## Compartir con un compañero

Comparte la Google Sheet con su cuenta de Google de empresa (como cualquier archivo de Drive) y pásale la URL del paso anterior. Si además el Web App está desplegado con acceso "cualquiera en el dominio", no hace falta ningún paso adicional — su propio permiso sobre la Sheet es lo que decide si puede entrar.

---

## Checklist de verificación manual (pendiente — no lo he podido hacer yo)

- [ ] El Web App se despliega sin errores con los 6 archivos de arriba.
- [ ] `bootstrapClientSheet` crea las 20 pestañas con sus cabeceras en una Sheet en blanco, y es seguro volver a ejecutarlo (no duplica pestañas ni borra filas existentes).
- [ ] La URL `?sheet=...&proyecto=...` carga el dashboard y las pestañas Sprint/Proyecto/GEE/Requisitos/Documentos, aunque estén vacías (0 filas en cada pestaña de la Sheet).
- [ ] Crear un registro nuevo (ej. un riesgo) desde el dashboard aparece como fila nueva en la pestaña `Riesgos` de la Sheet, con `Proyecto`, `Última modificación` y `Modificado por` rellenos.
- [ ] Editar ese mismo registro actualiza la fila (no crea una segunda).
- [ ] Aparece una fila nueva en `CambiosPendientes` tras cada edición/creación.
- [ ] "Añadir nota" en el daily log crea o actualiza la fila del día en `Dailylogs`, acumulando notas en `NotasJSON` sin perder las anteriores.
- [ ] El botón "Generar informe PDF" abre una pestaña nueva con el informe (no llama a ningún servidor) y Ctrl+P permite guardarlo como PDF.
- [ ] **Aislamiento real**: comparte la Sheet de un cliente de prueba con una segunda cuenta de Google (o pide a un compañero que lo intente) y confirma que **sin** compartírsela, la URL del dashboard de ese proyecto le da error de permisos en vez de cargar datos.
- [ ] Con dos proyectos (`proyecto=` distinto) apuntando a la misma Sheet, confirma que cada uno solo ve sus propias filas (columna `Proyecto` filtrando correctamente).

## Limitaciones conocidas de este modo (no son bugs, son alcance explícito)

- **Sin generación de PDF en servidor**: no hay Playwright/Chromium disponible en Apps Script. Se sustituye por "imprimir desde el navegador" (Ctrl+P sobre la misma plantilla HTML del informe) — decisión confirmada con el PM, no un recorte silencioso.
- **Documentos es solo un catálogo de metadatos**: el contenido de los `.md` sigue viviendo en local/Drive Desktop, no en la Sheet. No hay botones de Ver/Descargar/PDF por documento en este modo.
- **Sin sincronización en vivo con Jira**: `analisisJira` siempre es `null` en modo nube por ahora — traer Jira a Apps Script necesitaría su propia historia de autenticación, fuera de alcance de esta fase.
- **HU de sprint no bloqueadas**: igual que en modo local, no hay un editor real implementado (siempre 501) — no es un recorte de este modo nube específicamente.
- **Sin migración automática todavía**: las pestañas de solo lectura (Épicas, roadmap, capacidad, sprints, legacy) hay que rellenarlas a mano o esperar a la Fase 3 del plan (`migrarDesdeSnapshot`, reutilizando `buildSnapshot` del modo local) — no construida en esta fase.
- **Sin sincronización bidireccional todavía**: editar en la Sheet directamente (no vía el dashboard) no se refleja de vuelta en el markdown local — eso es la Fase 4 del plan.

## Próximos pasos (no construidos en esta fase)

- **Fase 3**: script de migración local → nube reutilizando `buildSnapshot`, para poblar Épicas/Roadmap/Capacidad/Sprints/Legacy/Documentos sin tener que rellenarlos a mano.
- **Fase 4**: sincronización bidireccional (`syncPull`/`syncPush`) usando las columnas `Última modificación`/`Modificado por` ya presentes, más `LockService` como bloqueo optimista; integración con `actualizar-cascada.md`.

Ver `mejoras-pendientes.md` (raíz del skill) para el registro completo de decisiones de esta fase.
