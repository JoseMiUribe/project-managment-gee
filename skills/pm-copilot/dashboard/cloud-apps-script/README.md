# Dashboard — Modo Nube (Google Apps Script + Google Sheets)

Esta carpeta es una aplicación Apps Script **independiente y completa** — no un backend que se enchufa al `server.js` de modo local. Sustituye a la vez a Express (hosting), a los 9 writers de markdown (datos) y a Firebase/Firestore (que se descartó por falta de permisos de organización). El modo local (`dashboard/server.js` + `dashboard/public/`) no cambia en absoluto: esto es un modo adicional, opcional, para cuando un PM quiere compartir el dashboard y los datos de un cliente con su equipo sin que nadie tenga que instalar nada.

**Quién puede desplegar esto:** cualquier persona con cuenta de Google Workspace de la empresa, sin permisos de administrador ni de IT — Apps Script se crea bajo la cuenta de quien lo hace, igual que crear un documento de Drive.

**Estado: verificado contra un despliegue real** (2026-07-17) — desplegado por el usuario, con una Sheet de sandbox real: crear/editar un riesgo desde el dashboard, el badge de cambios pendientes, y la migración desde un snapshot local funcionan correctamente. Se encontraron y corrigieron dos bugs reales durante esa verificación (ver `mejoras-pendientes.md`): un `setXFrameOptionsMode(ALLOWALL)` que rompía `google.script.run`, y la necesidad de que el servidor devuelva el envoltorio `{ok,data}` como `JSON.stringify(...)` en vez de un objeto — la serialización automática de `google.script.run` llega rota para objetos anidados complejos como el snapshot completo.

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
| `AppJs.html` | Copia adaptada de `dashboard/public/app.js` (2300+ líneas, casi todas sin cambios) — solo se tocó cómo llama al "servidor" (`google.script.run` en vez de `fetch`), el botón de PDF (abre la vista de impresión en vez de llamar a Playwright) y la fila de cada documento (enlaza a Drive si ya se subió, ver `migrarDocumentos`). |
| `Styles.html` | Copia sin cambios de `dashboard/public/styles.css`, envuelta en `<style>`. |
| `Migracion.gs` | `migrarDesdeSnapshot` (puebla la Sheet a partir del JSON de `/api/data` del dashboard local) + `migrarDocumentos` (sube el CONTENIDO de cada documento a una carpeta de Drive, a partir de `/api/documentos/exportar`) + `renderMigratePage` (la página `?vista=migrar` con ambos pasos). Ver "Migrar un proyecto local existente" más abajo. |
| `PrintDocumento.gs` | Vista de un documento suelto (`?vista=documento&ruta=...&version=completa\|cliente`) — equivalente a `/print/documento` en modo local, leyendo el contenido de Drive en vez del disco. El markdown se renderiza a HTML en el propio navegador (`marked` vía CDN, igual que ECharts) porque Apps Script no tiene ese paquete. La versión "cliente" recorta los bloques `<!-- interno:inicio/fin -->` igual que en local, sin anunciarlo con ningún aviso visual (ver nota más abajo). |

---

## Esquema de la Google Sheet (una por cliente)

Cada pestaña corresponde a una fila de esta tabla. `kind` determina si se edita desde el dashboard o no:

| Pestaña | kind | Qué guarda |
|---|---|---|
| Riesgos, Dependencias, Acciones, Impedimentos, Changelog | `registro` | Los 5 tipos del GEE — editable desde el dashboard, igual que en local. |
| Peticiones, RequisitosFuncionales, RequisitosNoFuncionales, ZonasIncertidumbre | `registro` | Los 4 tipos de Requisitos (Paso 0) — editable desde el dashboard. |
| CambiosPendientes | `ledger` | Registro append-only de cada edición hecha desde el dashboard (igual que `output-transversal/cambios-pendientes-dashboard.md` en local). |
| Documentos | `catalogo` | Metadatos (título/ruta/tamaño/fecha) de los `.md` que genera el skill, más `DriveFileId`/`DriveUrl` una vez subidos a Drive vía `migrarDocumentos` (ver "Migrar un proyecto local existente"). Sin `DriveUrl`, el dashboard solo muestra el catálogo sin acciones — con él, "Ver/Descargar (Drive)" abre el archivo en Drive, y "Ver"/"Ver cliente" abren la vista renderizada (`?vista=documento`, `PrintDocumento.gs`) para imprimir a PDF con Ctrl+P, igual que el informe completo. |
| Epicas, RoadmapClienteHitos, Sprints, SprintHU, ReglasNegocio | `lectura-tabular` | Una fila por registro, de solo lectura (igual que en modo local: el dashboard nunca los edita, solo los muestra). Se rellenan con la migración (ver "Migrar un proyecto local existente" más abajo) o a mano. |
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
   - `Migracion` (tipo Script) → pega el contenido de `Migracion.gs`
   - `PrintDocumento` (tipo Script) → pega el contenido de `PrintDocumento.gs`
   - `Index` (tipo HTML) → pega el contenido de `Index.html`
   - `AppJs` (tipo HTML) → pega el contenido de `AppJs.html`
   - `Styles` (tipo HTML) → pega el contenido de `Styles.html`
3. **Desplegar → Nueva implementación → tipo "Aplicación web"**:
   - **Ejecutar como:** *el usuario que accede a la aplicación web* (NO "Yo" — esto es lo que hace que el permiso de cada Sheet sea el único control de acceso real, ver "Arquitectura" arriba).
   - **Quién tiene acceso:** *Cualquier usuario de [tu dominio de Workspace]*.
4. Copia la URL que te da ("URL de la aplicación web") — es la misma para todos los clientes/proyectos, solo cambian los parámetros `?sheet=...&proyecto=...` en cada enlace concreto.
5. Cada vez que actualices el código (una nueva versión de este skill trae cambios aquí), vuelve a **Desplegar → Gestionar implementaciones → Editar → Nueva versión** — la URL no cambia.

### Actualizar el código más rápido con `clasp` (opcional, recomendado)

Copiar y pegar 8 archivos a mano cada vez que el skill trae cambios es lento. `clasp` (herramienta oficial de Google, [github.com/google/clasp](https://github.com/google/clasp)) sincroniza esta carpeta con tu proyecto de Apps Script desde la terminal — ni yo ni ningún script puede hacer este login por ti (necesita tu propia autorización en el navegador), pero una vez configurado, cada actualización futura es un solo comando.

**Configuración (una sola vez):**
1. `npm install -g @google/clasp`
2. `clasp login` — abre el navegador, autoriza tu cuenta de Google.
3. En el editor de Apps Script de tu proyecto ya desplegado: icono de engranaje **⚙️ Configuración del proyecto** → copia el **ID de secuencia de comandos**.
4. En una carpeta **vacía** aparte (no dentro de `cloud-apps-script/` todavía): `clasp clone <ID_DE_SECUENCIA_DE_COMANDOS>` — esto descarga el `appsscript.json` (manifiesto) y el `.clasp.json` (apuntando a tu proyecto) ya configurados con los ajustes reales de tu despliegue.
5. Copia esos dos archivos (`.clasp.json` y `appsscript.json`) a esta carpeta (`dashboard/cloud-apps-script/`), junto a `Code.gs`, etc. Borra la carpeta temporal del paso 4.
6. Anota también el **ID de implementación** (Desplegar → Gestionar implementaciones → el ID junto al despliegue activo) — lo necesitarás en el paso 8.

**Cada actualización futura:**
7. `cd` a esta carpeta y ejecuta `clasp push` — sube todos los archivos locales al proyecto (sobrescribe el contenido remoto, en el sentido correcto: de este repo hacia tu Apps Script).
8. Para que el cambio llegue a la URL en producción (no solo al editor), ejecuta `clasp deploy -i <ID_DE_IMPLEMENTACIÓN> -d "descripción del cambio"` — equivalente al paso manual de "Nueva versión" de antes, pero desde la terminal. Si prefieres, puedes seguir haciendo este último paso a mano en la UI; lo que `clasp push` ya te ahorra es copiar los 8 archivos.

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

## Migrar un proyecto local existente

Si ya tienes un proyecto trabajado en modo local y quieres traer sus datos (Épicas, Roadmap, Capacidad, Sprints, GEE, Requisitos, Documentos) a una Sheet nueva o ya aprovisionada, abre `<URL de la aplicación web>?sheet=<ID de la Sheet>&proyecto=<identificador>&vista=migrar` — tiene dos pasos independientes:

**1. Datos** (GEE, Requisitos, Épicas, Roadmap, Capacidad, Sprints, metadatos de Documentos):
1. Arranca el dashboard **local** de ese proyecto como siempre (`iniciar-dashboard.bat`/`.ps1`).
2. En el navegador, ve a `http://localhost:<puerto>/api/data` — verás el snapshot completo en JSON.
3. Selecciona todo (Ctrl+A), cópialo (Ctrl+C), pégalo en el primer cuadro de texto de la página de migración y pulsa **Migrar datos**.

Es seguro repetirlo cuantas veces haga falta (p. ej. cada vez que regeneres el roadmap o la capacidad en local): los tipos editables desde el dashboard (GEE + Requisitos) se actualizan por ID sin duplicar ni pisar ediciones que ya se hayan hecho en la nube; el resto de pestañas (de solo lectura también en modo local) se reemplazan enteras con lo último del snapshot pegado. Los metadatos de Documentos se actualizan por ruta, sin perder ningún enlace de Drive que ya se haya subido en el paso 2.

**2. Documentos** (subirlos a Drive para poder verlos/descargarlos desde el dashboard alojado):
1. En el navegador local, ve a `http://localhost:<puerto>/api/documentos/exportar` — nota: `/exportar`, no `/api/data`. Este incluye el **contenido** de cada documento, no solo su ficha de catálogo.
2. Copia TODO el JSON y pégalo en el segundo cuadro de la página de migración, pulsa **Subir documentos a Drive**.

Esto crea (o reutiliza) una carpeta "Documentos — `<proyecto>`" junto a la Sheet del cliente, sube cada `.md` ahí, y guarda el enlace en la pestaña Documentos — a partir de ahí, cada fila de la pestaña **Documentos** del dashboard muestra un botón "Ver/Descargar (Drive)". Es seguro repetirlo: actualiza el contenido de los archivos ya subidos (por ruta) en vez de duplicarlos — así se mantienen actualizados sin más que volver a exportar/pegar tras regenerar un documento en local. Los documentos que el catálogo local no pudo leer (ruta rota, etc.) se saltan sin romper el resto.

---

## Checklist de verificación manual

- [x] El Web App se despliega sin errores con los 7 archivos de arriba.
- [x] `bootstrapClientSheet` crea las 21 pestañas con sus cabeceras en una Sheet en blanco, y es seguro volver a ejecutarlo (no duplica pestañas ni borra filas existentes).
- [x] La URL `?sheet=...&proyecto=...` carga el dashboard y las pestañas Sprint/Proyecto/GEE/Requisitos/Documentos, aunque estén vacías (0 filas en cada pestaña de la Sheet).
- [x] Crear un registro nuevo (ej. un riesgo) desde el dashboard aparece como fila nueva en la pestaña `Riesgos` de la Sheet, con `Proyecto`, `Última modificación` y `Modificado por` rellenos.
- [x] Editar ese mismo registro actualiza la fila (no crea una segunda).
- [x] Aparece una fila nueva en `CambiosPendientes` tras cada edición/creación (verificado con el badge "N cambios pendientes de análisis" en la cabecera).
- [ ] "Añadir nota" en el daily log crea o actualiza la fila del día en `Dailylogs`, acumulando notas en `NotasJSON` sin perder las anteriores.
- [ ] El botón "Generar informe PDF" abre una pestaña nueva con el informe (no llama a ningún servidor) y Ctrl+P permite guardarlo como PDF.
- [ ] **Aislamiento real**: comparte la Sheet de un cliente de prueba con una segunda cuenta de Google (o pide a un compañero que lo intente) y confirma que **sin** compartírsela, la URL del dashboard de ese proyecto le da error de permisos en vez de cargar datos.
- [ ] Con dos proyectos (`proyecto=` distinto) apuntando a la misma Sheet, confirma que cada uno solo ve sus propias filas (columna `Proyecto` filtrando correctamente).
- [x] Migración de datos: pegar el JSON de `/api/data` de un proyecto local real en `?vista=migrar` puebla Épicas/RoadmapClienteHitos/Sprints/SprintHU/Capacidad/Legacy/Documentos correctamente, y repetirlo no duplica filas (verificado por simulación en Node contra el fixture completo — pendiente de una pasada real).
- [x] Migración de documentos: pegar el JSON de `/api/documentos/exportar` sube los `.md` a una carpeta de Drive y la pestaña Documentos del dashboard muestra "Ver/Descargar (Drive)" — confirmado con un proyecto real (43 documentos subidos sin errores).
- [ ] "Ver"/"Ver cliente" de un documento (`?vista=documento`) abren la vista renderizada, la versión cliente recorta los bloques `<!-- interno:... -->` sin mostrar ningún aviso de "versión cliente", y Ctrl+P permite guardarla como PDF (verificado por simulación en Node — pendiente de una pasada real).

## Limitaciones conocidas de este modo (no son bugs, son alcance explícito)

- **Sin generación de PDF en servidor**: no hay Playwright/Chromium disponible en Apps Script. Se sustituye por "imprimir desde el navegador" (Ctrl+P sobre la misma plantilla HTML del informe) — decisión confirmada con el PM, no un recorte silencioso.
- **Subir documentos a Drive es un paso manual aparte** (`migrarDocumentos`, ver arriba) — no ocurre automáticamente al migrar los datos, porque `/api/data` no incluye el contenido de los documentos (por diseño, para no inflar ese JSON). Hay que exportar y pegar `/api/documentos/exportar` por separado.
- **La pestaña Documentos no borra filas de documentos que ya no existan en local** — si renombras o eliminas un `.md`, su fila (y su archivo en Drive) quedan huérfanos hasta que se limpien a mano; este skill nunca borra automáticamente.
- **Sin sincronización en vivo con Jira**: `analisisJira` siempre es `null` en modo nube por ahora — traer Jira a Apps Script necesitaría su propia historia de autenticación, fuera de alcance de esta fase.
- **HU de sprint no bloqueadas**: igual que en modo local, no hay un editor real implementado (siempre 501) — no es un recorte de este modo nube específicamente.
- **La migración es unidireccional (local → nube)**: no hay vía de vuelta (nube → local), igual que el plan original preveía. Editar directamente en la Sheet (no vía el dashboard) tampoco se refleja de vuelta en el markdown local todavía — eso es la Fase 4.

## Próximos pasos (no construidos todavía)

- **Fase 4**: sincronización bidireccional (`syncPull`/`syncPush`) usando las columnas `Última modificación`/`Modificado por` ya presentes, más `LockService` como bloqueo optimista; integración con `actualizar-cascada.md`.

Ver `mejoras-pendientes.md` (raíz del skill) para el registro completo de decisiones de esta fase.
