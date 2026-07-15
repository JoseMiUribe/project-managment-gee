# PM Copilot — Dashboard

Dashboard local de reporting para el skill de gestión de proyectos **PM Copilot**
de Claude Code. Lee los artefactos markdown generados por el skill en
`investigar/[proyecto]/`, expone una API JSON, sirve el frontend estático y
genera un informe en PDF con Playwright.

Es una herramienta **local de un solo usuario**: no tiene autenticación ni está
pensada para exponerse fuera de `localhost`.

## Instalación

```bash
npm install
npm run setup
```

`npm run setup` hace dos cosas:
1. Descarga Chromium para Playwright (`npx playwright install chromium`, ~300MB).
2. Descarga [ECharts](https://echarts.apache.org/) (MIT license) una única vez
   y la guarda en `public/vendor/echarts.min.js`, para que el dashboard no
   dependa de un CDN externo cada vez que se abre (es un informe interno).

Si `node_modules` no existe todavía, `setup.js` te lo dirá y no instalará nada
por ti — ejecuta `npm install` primero.

## Arranque

```bash
node server.js investigar/mi-proyecto
# o bien
npm start -- investigar/mi-proyecto
```

Si no pasas ruta, el script busca un único subdirectorio dentro de
`./investigar` (relativo al directorio desde el que lances el comando) y lo
usa automáticamente. Si hay 0 o más de 1, se detiene con un error pidiendo que
especifiques la ruta explícitamente.

### Selección de puerto

El dashboard ya no usa siempre el mismo puerto fijo: cada proyecto abre por
defecto en un puerto **determinista calculado a partir de su ruta absoluta**
(un hash simple mapeado al rango 4700-5199, ver `hashProjectPathToPort` en
`lib/config.js`). Así, el mismo proyecto tiende a abrir siempre en el mismo
puerto entre ejecuciones (cómodo para guardarlo como favorito del navegador),
y proyectos distintos no compiten entre sí por defecto — puedes tener varios
dashboards de varios proyectos abiertos a la vez sin chocar.

Prioridad de resolución:
1. Variable de entorno `PORT`, si la defines explícitamente (máxima prioridad,
   igual que antes).
2. Si no, el puerto determinista calculado a partir de la ruta del proyecto.
3. Si ese puerto concreto está ocupado (`EADDRINUSE`, p. ej. porque ya hay
   otro proceso usándolo), el servidor prueba automáticamente el siguiente
   (+1), hasta un máximo de 50 intentos.

Al arrancar, el servidor imprime por consola el puerto real en el que quedó
escuchando y además lo escribe en texto plano en `dashboard/.port` (un único
número, sin saltos de línea ni comillas) — este archivo lo usa el script de
arranque de un clic para saber a qué URL abrir el navegador, pero también
puedes leerlo tú mismo si integras el dashboard con otra herramienta.

Abre `http://localhost:{puerto}` (revisa la consola o `dashboard/.port` para
saber cuál es).

## Instalación por proyecto (dashboard copiable, no compartido)

Esta carpeta (`dashboard/`, dentro del skill) es la copia **maestra**. Cada
proyecto (`investigar/[proyecto]/`) debe tener su **propia copia
independiente** del dashboard, para que: (a) varios proyectos puedan tener su
dashboard abierto a la vez sin chocar entre sí, y (b) la carpeta del proyecto
sea totalmente portable — si te la llevas a otro PC con Claude Code y este
skill instalados, el dashboard se va con ella.

Para instalar (o actualizar) el dashboard dentro de un proyecto:

```bash
node instalar-en-proyecto.js <ruta-a-investigar/mi-proyecto>
```

Esto crea `<proyecto>/dashboard/` (si no existe) y copia dentro: `server.js`,
`setup.js`, `package.json`, todo `lib/` y todo `public/` (incluyendo
`public/vendor/echarts.min.js` si ya existe en el origen). **No copia
`node_modules`** — cada proyecto instala el suyo. También genera dentro de
`<proyecto>/dashboard/` los dos scripts de arranque de un clic
(`iniciar-dashboard.bat` e `iniciar-dashboard.ps1`, ver siguiente sección).

El script es **idempotente**: si `<proyecto>/dashboard/` ya existía (por
ejemplo, quieres actualizar el motor del dashboard de un proyecto antiguo a
la última versión del skill), vuelve a copiar el código pero nunca toca ni
borra:
- `<proyecto>/dashboard/node_modules/` (tus dependencias instaladas quedan
  intactas).
- `<proyecto>/.pm-copilot-cache.json` — vive en la **raíz del proyecto**, no
  dentro de `dashboard/`, así que una reinstalación del dashboard nunca la
  afecta de todos modos.
- `<proyecto>/dashboard/.port` (se regenera solo la próxima vez que arranque
  el servidor).

Al terminar, el script imprime un resumen de qué copió y las instrucciones de
siguiente paso.

## Arranque de un clic

Cada `<proyecto>/dashboard/` instalado con `instalar-en-proyecto.js` incluye:

- **`iniciar-dashboard.bat`** — pensado para doble clic desde el Explorador
  de Windows. Simplemente invoca al `.ps1` de al lado con la política de
  ejecución necesaria para no chocar con restricciones del sistema.
- **`iniciar-dashboard.ps1`** — hace todo el trabajo:
  1. Calcula su propio directorio (`$PSScriptRoot`, que es
     `<proyecto>/dashboard/`) y el directorio del proyecto (su padre) — no
     hay ninguna ruta absoluta incrustada, por lo que sigue funcionando igual
     si mueves la carpeta del proyecto a otro sitio o a otro PC.
  2. Si falta `node_modules`, ejecuta `npm install` (con salida visible).
  3. Si falta `public/vendor/echarts.min.js`, ejecuta `npm run setup`
     (avisa que puede tardar por la descarga de Chromium, ~300MB).
  4. Arranca `node server.js "<ruta absoluta al proyecto>"` en su propia
     ventana de consola (con `Start-Process`), independiente de la ventana
     donde corre el script — el usuario decide cuándo cerrarla para detener
     el dashboard.
  5. Espera a que el servidor escriba `dashboard/.port` y responda en
     `/api/data`, y entonces abre el navegador por defecto en
     `http://localhost:{puerto}`.

Ambos scripts los regenera `instalar-en-proyecto.js` en cada ejecución (no
los edites a mano dentro de un proyecto: los cambios se perderían en la
siguiente actualización del dashboard).

## Endpoints

- `GET /api/data` — devuelve la caché (`.pm-copilot-cache.json`) si existe; si
  no, ejecuta un parseo completo primero.
- `POST /api/sync` — reparseo completo de todos los artefactos markdown y
  devuelve el snapshot fresco. El frontend lo llama al cargar la página y con
  el botón "Actualizar".
- `PUT /api/gee/:tipo/:id` — actualiza un registro existente del GEE
  (`tipo` = `riesgos` | `dependencias` | `acciones` | `impedimentos` |
  `changelog`). Requiere `{ "confirm": true, ...campos }` en el body; sin
  `confirm: true` responde `400`.
- `POST /api/gee/:tipo` — crea un registro nuevo con el siguiente ID
  correlativo del tipo indicado. Mismo requisito de `confirm: true`.
- `DELETE /api/gee/*` — **siempre responde 405**. Este skill nunca borra
  automáticamente ningún registro del GEE. Si hay que eliminar algo, se edita
  el markdown a mano o se confirma por otro canal con el PM.
- `PUT /api/sprint/hu/:id` — intento de modificar una HU de un sprint. Si la
  HU está en un sprint activo (ver "Bloqueo de sprint activo" abajo) responde
  **siempre `423 Locked`**, sin excepción, ni siquiera con `confirm: true`. Si
  la HU no está bloqueada, de momento el endpoint no tiene un writer
  implementado (ver limitaciones) y responde `501`.
- `POST /api/pdf` — genera el informe en PDF (usa Playwright + la vista
  `/print`) y devuelve `{ "path": "<ruta-absoluta-del-pdf>" }`.
- `GET /print` — vista HTML de solo lectura, sin controles interactivos,
  pensada para convertirse en PDF. Todas las secciones en una sola página
  larga. Reutiliza los mismos datos que `buildSnapshot`.
- `GET /print/documento?ruta=<ruta-relativa>.md` — vista HTML de solo
  lectura que renderiza a HTML **cualquier markdown suelto del proyecto**
  (prosa normal: títulos, listas, tablas, citas... no un artefacto que el
  dashboard sepa parsear como GEE/roadmap). Pensado para documentos que el
  skill redacta fuera del dashboard (p. ej. un documento de cierre de fase
  para el cliente) y que el usuario quiere poder convertir a PDF sin que el
  dashboard tenga que "entender" su contenido. Usa
  [`marked`](https://www.npmjs.com/package/marked) para el markdown → HTML.
  `ruta` es relativa a la raíz del proyecto (no a `dashboard/`); se valida
  que la ruta resuelta quede dentro del directorio del proyecto (rechaza
  `..`, rutas absolutas y cualquier intento de escapar) y que termine en
  `.md`. Responde `400` si la ruta es inválida/falta, `404` si el archivo no
  existe.
- `POST /api/pdf/documento` con body `{ "ruta": "<ruta-relativa>.md" }` —
  genera el PDF de ese documento concreto con el mismo mecanismo Playwright
  que `/api/pdf` (pero navegando a `/print/documento?ruta=...`), lo guarda
  como `<directorio-del-md>/<nombre-sin-extension>.pdf` (mismo directorio y
  mismo nombre base que el markdown original) y devuelve
  `{ "path": "<ruta-absoluta-del-pdf>" }`. Mismas validaciones de `ruta` que
  el endpoint `GET` de arriba. Es un mecanismo **paralelo** a `/api/pdf`, no
  lo sustituye ni lo modifica.
- Cualquier otra ruta se sirve como estático desde `public/` (ahí vive el
  dashboard interactivo, `public/index.html`).

## Convención de nombres de sprint (importante para quien genere artefactos)

Cada sprint tiene su **propio archivo**, numerado explícitamente, dentro de
`investigar/[proyecto]/output-paso-4/`:

```
output-paso-4/sprint-backlog-1.md
output-paso-4/sprint-backlog-2.md
output-paso-4/review-sprint-1.md
output-paso-4/review-sprint-2.md
...
```

Es decir: `sprint-backlog-{N}.md` y, al cerrar ese sprint, `review-sprint-{N}.md`
en el mismo directorio. El número `N` es el mismo que declara el propio
archivo en su cabecera (`**Sprint:** [N]`).

**Compatibilidad legacy:** si en el directorio no existe ningún
`sprint-backlog-{N}.md` pero sí un `sprint-backlog.md` sin número (el nombre
que usa el template de un solo sprint), el dashboard lo lee igualmente y
determina el número de sprint a partir de su propio campo `**Sprint:** [N]`
en la cabecera.

### Regla de bloqueo de sprint ("sprint activo")

Un sprint se considera **activo** (y por tanto sus HU quedan bloqueadas para
edición desde el dashboard) si se cumple **cualquiera** de estas condiciones:

1. Su rango de fechas (`**Fechas:** [inicio] — [fin]`) incluye la fecha de hoy.
2. No tiene fecha de fin declarada.
3. No existe el `review-sprint-{N}.md` correspondiente en el mismo directorio
   (señal de que el sprint no se ha cerrado formalmente todavía, aunque las
   fechas ya hayan pasado).

Esta regla la aplican tanto `lib/sprintLock.js` (para marcar cada HU con
`locked: true/false` en el snapshot) como el endpoint
`PUT /api/sprint/hu/:id` (para rechazar cualquier intento de edición con
`423 Locked`, sin excepción).

## Estructura del proyecto

```
dashboard/
  package.json
  server.js                 → rutas Express
  setup.js                   → descarga Chromium + ECharts
  instalar-en-proyecto.js    → copia este dashboard dentro de un proyecto (instala/actualiza)
  lib/
    config.js           → resolución de ruta de proyecto y puerto
    markdownTable.js     → parser genérico de tablas markdown
    keyValueBlock.js      → parser genérico de bloques **Clave:** valor
    buildSnapshot.js      → orquesta todos los parsers -> snapshot JSON + caché
    sprintLock.js          → determina qué HU están en un sprint activo
    printView.js           → HTML de solo lectura para /print
    printDocumento.js       → HTML de solo lectura para /print/documento (markdown suelto)
    pdf.js                   → generación de PDF con Playwright (informe + documentos sueltos)
    parsers/
      riesgos.js, dependencias.js, acciones.js, impedimentos.js,
      changelog.js, sprintBacklog.js, roadmapTecnico.js,
      roadmapCliente.js, epicas.js, capacidad.js,
      dailylog.js, analisisJira.js, requisitos.js, legacy.js,
      cambiosPendientes.js, documentos.js
    writers/
      tableWriter.js (helper compartido de lectura/escritura de filas)
      riesgos.js, dependencias.js, acciones.js, impedimentos.js, changelog.js,
      peticiones.js, funcionales.js, nofuncionales.js, zonasIncertidumbre.js,
      dailylog.js, cambiosPendientes.js
  public/
    index.html, app.js, styles.css   → dashboard interactivo (frontend)
    vendor/echarts.min.js             → generado por `npm run setup`
```

Cuando este dashboard se instala dentro de un proyecto con
`instalar-en-proyecto.js`, la copia resultante en `<proyecto>/dashboard/`
tiene la misma estructura de arriba más los dos scripts de arranque de un
clic (`iniciar-dashboard.bat`, `iniciar-dashboard.ps1`) y, tras el primer
arranque, `.port`.

## Forma del snapshot (`GET /api/data` / `POST /api/sync`)

```js
{
  proyecto: { nombre, rutaAbsoluta, generadoEn },
  gee: { riesgos, dependencias, acciones, impedimentos, changelog, dailylogs },
  roadmap: { epicas, capacidadActual, roadmapTecnico, roadmapCliente },
  sprint: { sprints, analisisJira },
  metricas: {
    sprintCompletionPct, riesgosPorRag, dependenciasPorCriticidad,
    velocidadPorSprint, impedimentosAbiertos
  }
}
```

Se cachea en `investigar/[proyecto]/.pm-copilot-cache.json` (prefijo con
punto: es un archivo generado, no un artefacto del pipeline del skill — no lo
edites a mano, se sobrescribe en cada sync).

## Parsers: diseño general

En vez de un parser frágil por archivo, hay dos utilidades genéricas
(`lib/markdownTable.js` y `lib/keyValueBlock.js`) que hacen el trabajo pesado
de forma tolerante (case-insensitive, trim, columnas vacías), y un archivo por
tipo de artefacto en `lib/parsers/` que solo mapea nombres de columna/campo a
claves camelCase. Todos los parsers:
- Devuelven `null` o `[]` si el archivo no existe — nunca lanzan una excepción
  que tumbe el servidor.
- Envuelven su lógica en `try/catch` y registran el error por consola sin
  interrumpir el resto del snapshot.

## Reglas de escritura (writers)

- Los writers **nunca borran**. No hay ningún método de borrado ni expuesto
  por la API ni como función interna.
- Actualizar un registro solo toca las columnas presentes en el payload; el
  resto de la fila se preserva tal cual.
- Crear un registro asigna el siguiente ID correlativo (`R-013` si el último
  es `R-012`, etc.), con padding a 3 dígitos como indican las notas de uso de
  cada plantilla.
- Tras escribir, se actualiza la línea `**Fecha última actualización:**` de la
  cabecera del archivo con la fecha real del servidor.
- El resto del contenido del archivo (notas de uso, catálogos de referencia,
  etc.) se preserva intacto: la escritura opera línea a línea sobre el texto
  original, no reconstruye el archivo desde cero.

## Generación de PDF

`POST /api/pdf` lanza Chromium headless vía Playwright, navega a
`http://localhost:{PORT}/print` (por lo que el servidor debe estar en marcha)
y genera `investigar/[proyecto]/output-informe-{YYYY-MM-DD}.pdf` con
`page.pdf({ format: 'A4', printBackground: true })`.

`POST /api/pdf/documento` es el mecanismo paralelo para markdown suelto:
mismo motor (Playwright + `page.pdf` con los mismos márgenes/formato), pero
navega a `/print/documento?ruta=...` y guarda el resultado junto al `.md`
original en vez de en un nombre fijo con fecha. Ver la sección de endpoints
más arriba para el contrato completo.

## Limitaciones conocidas / campos no mapeados con confianza

- **`PUT /api/sprint/hu/:id` para HU no bloqueadas**: el endpoint existe y
  aplica correctamente el bloqueo 423, pero no hay un writer de
  `sprint-backlog-{N}.md` implementado todavía — de momento responde `501`
  incluso cuando la HU no está en un sprint activo. La edición de HU de sprint
  se sigue haciendo regenerando el artefacto vía los prompts del skill
  (`sprint-planning.md`) o editando el markdown a mano.
- **No existe parser ni pestaña para `output-paso-3/historias-generadas-*.md`**
  (el formato de HU vigente desde el rediseño de Paso 3, con Verdict de DoR
  `✅ Ready`/`❌ No Ready`) — el dashboard no muestra el backlog completo de
  HU del proyecto, solo las ya seleccionadas para un sprint
  (`sprint-backlog-{N}.md`, vía `sprintBacklog.js`). `lib/parsers/backlogDetalle.js`
  (que leía una ruta y formato anteriores, `output-paso-2/backlog-detalle.md`,
  que ya no genera ningún prompt) se eliminó por muerto — ver
  `mejoras-pendientes.md`, entrada 2026-07-09 (actualizada) y 2026-07-15.
- ~~`output-paso-1/changelog.md` — desajuste de formato~~ **Resuelto
  (2026-07-13):** el PM confirmó que el Changelog debe comportarse como
  cualquier otra pestaña del GEE (tabla plana, editable en línea) — el
  desajuste vivía en `templates/paso-4/changelog.md`/
  `prompts/paso-4/gestion-changelog.md`, que generaban un documento narrativo
  por cambio en vez de una fila por `SC-XXX`. `lib/parsers/changelog.js`,
  `lib/writers/changelog.js` y el `GEE_CONFIG.changelog` de `app.js` no
  necesitaron ningún cambio — ya esperaban correctamente la tabla plana.
  Verificado end-to-end con el fixture (ver `mejoras-pendientes.md`, entradas
  2026-07-13).
- **`capacidad-equipo/actual.md` — secciones de texto libre**: las secciones
  2 ("Composición técnica") y 3 ("Velocidad del equipo") de la plantilla de
  capacidad no son tablas sino líneas `- Campo: valor`; el parser las
  extrae con una regex tolerante pero no valida unidades (`%`, `pts/sprint`)
  ni normaliza los nombres de campo más allá del texto literal de la
  plantilla. Si el documento de capacidad real varía la redacción de estas
  líneas, puede que algún campo quede sin mapear (queda disponible en bruto
  bajo `capacidadActual.raw`).
- **`epicas.md`**: no tiene un formato de archivo fijo (está descrito en el
  prompt, no en un template), así que su parser soporta tanto tabla como
  fichas por heading. Si el formato real generado por Claude se desvía mucho
  de ambos patrones soportados, revisar `lib/parsers/epicas.js`.
- **`analisis-jira-YYYY-MM-DD.md`**: el prompt no fija una estructura de
  headings exacta para el resumen ejecutivo ni la tabla de estado, así que el
  parser busca por palabras clave en los headings (best-effort, ver
  `lib/parsers/analisisJira.js`). Si no encuentra la sección, deja el campo
  vacío en vez de fallar.

Ninguna de estas limitaciones impide el funcionamiento del dashboard: en el
peor caso, el campo afectado queda vacío o el snapshot omite esa pieza
concreta de información, pero el resto del snapshot se genera con normalidad.

**Verificación end-to-end (2026-07-13):** se probó el dashboard completo
contra un proyecto fixture con datos realistas en todas las pestañas
(Sprint actual, Proyecto, GEE, Requisitos), la API de escritura del GEE
(confirmación obligatoria, creación con ID correlativo, bloqueo 423/501 de
sprint, `DELETE` 405), y ambos mecanismos de PDF (informe completo y
documento suelto, incluida la protección anti path-traversal). Se
encontraron y corrigieron 4 bugs reales que no estaban cubiertos por las
limitaciones ya documentadas arriba (regex de premisas/resumen ejecutivo de
`roadmapCliente.js`, nombres de campo desalineados en el render de
"Roadmap cliente" y de "Sistemas" en Dependencias, y el detalle de daily log
que siempre mostraba "(sin contenido)"). Detalle completo en
`mejoras-pendientes.md`, entrada 2026-07-13.
