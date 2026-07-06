'use strict';

/**
 * Instala (o actualiza) una copia independiente del dashboard PM Copilot
 * dentro de un proyecto concreto (investigar/[proyecto]/dashboard/).
 *
 * Uso:
 *   node instalar-en-proyecto.js <ruta-al-proyecto>
 *
 * <ruta-al-proyecto> es la ruta a investigar/[proyecto]/ (absoluta o
 * relativa al directorio desde el que se lanza el comando) — NO la ruta a
 * "dashboard" dentro de ese proyecto, el script crea esa subcarpeta él solo.
 *
 * Este mismo script sirve tanto para la instalación inicial como para
 * actualizar el "motor" del dashboard de un proyecto que ya lo tenía: es
 * idempotente. Sobrescribe el código (server.js, lib/, public/, package.json,
 * setup.js y los scripts de arranque) pero nunca toca:
 *   - <proyecto>/dashboard/node_modules  (cada proyecto instala el suyo)
 *   - <proyecto>/.pm-copilot-cache.json  (vive en la raíz del proyecto, no
 *     dentro de dashboard/, así que una reinstalación de dashboard/ no la
 *     afecta en ningún caso)
 */

const fs = require('fs');
const path = require('path');

const ORIGEN = __dirname; // este archivo vive en dashboard/, junto a lo que hay que copiar

// Qué copiar desde el origen hacia <proyecto>/dashboard/. Todo relativo a ORIGEN.
const ARCHIVOS_A_COPIAR = ['server.js', 'setup.js', 'package.json'];
const DIRECTORIOS_A_COPIAR = ['lib', 'public'];

// Nunca se copian bajo ningún concepto (por si algún día aparecen dentro de
// alguno de los directorios de arriba).
const EXCLUSIONES = new Set(['node_modules', '.port', '.git']);

function copiarArchivo(origen, destino) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(origen, destino);
}

/**
 * Copia recursiva de un directorio, saltando cualquier entrada cuyo nombre
 * esté en EXCLUSIONES (defensivo: hoy no hay node_modules bajo lib/ ni
 * public/, pero si lo hubiera en el futuro no se copiaría por accidente).
 * Devuelve la lista de rutas relativas (a ORIGEN) que ha copiado.
 */
function copiarDirectorio(origenDir, destinoDir, prefijoRelativo, copiados) {
  const entradas = fs.readdirSync(origenDir, { withFileTypes: true });
  for (const entrada of entradas) {
    if (EXCLUSIONES.has(entrada.name)) continue;

    const origenPath = path.join(origenDir, entrada.name);
    const destinoPath = path.join(destinoDir, entrada.name);
    const relPath = path.join(prefijoRelativo, entrada.name);

    if (entrada.isDirectory()) {
      fs.mkdirSync(destinoPath, { recursive: true });
      copiarDirectorio(origenPath, destinoPath, relPath, copiados);
    } else if (entrada.isFile()) {
      copiarFileSiExiste(origenPath, destinoPath, relPath, copiados);
    }
  }
}

function copiarFileSiExiste(origenPath, destinoPath, relPath, copiados) {
  if (!fs.existsSync(origenPath)) return; // p.ej. vendor/echarts.min.js si npm run setup no se ha ejecutado nunca en origen
  copiarArchivo(origenPath, destinoPath);
  copiados.push(relPath);
}

function generarBat(destinoDashboard) {
  const contenido = [
    '@echo off',
    'REM Lanzador de un clic para el dashboard PM Copilot de este proyecto.',
    'REM Generado automaticamente por instalar-en-proyecto.js — no editar a mano,',
    'REM se sobrescribe en cada actualizacion del dashboard.',
    'powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar-dashboard.ps1"',
    'pause',
    '',
  ].join('\r\n');
  fs.writeFileSync(path.join(destinoDashboard, 'iniciar-dashboard.bat'), contenido, 'utf8');
}

function generarPs1(destinoDashboard) {
  // Nota: $PSScriptRoot dentro del .ps1 generado sera SIEMPRE la carpeta
  // dashboard/ del proyecto destino en el momento en que el usuario lo
  // ejecute (PowerShell lo calcula en tiempo de ejecucion) — no hace falta
  // (ni se debe) incrustar aqui una ruta absoluta que dejaria de ser valida
  // si la carpeta del proyecto se mueve o se lleva a otro PC.
  const contenido = `# Lanzador de un clic para el dashboard PM Copilot de este proyecto.
# Generado automaticamente por instalar-en-proyecto.js — no editar a mano,
# se sobrescribe en cada actualizacion del dashboard.
#
# Este script funciona sin importar donde se copie la carpeta del proyecto
# (a otro PC, a otra unidad, etc.) porque calcula todas las rutas de forma
# relativa a si mismo en el momento de ejecutarse.

$ErrorActionPreference = 'Stop'

$dashboardDir = $PSScriptRoot
$proyectoDir = Split-Path $dashboardDir -Parent

Write-Host ''
Write-Host '=== PM Copilot Dashboard ===' -ForegroundColor Cyan
Write-Host "Proyecto: $proyectoDir"
Write-Host ''

# 1. Comprobar Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host 'ERROR: No se ha encontrado "node" en el PATH.' -ForegroundColor Red
    Write-Host 'Instala Node.js (https://nodejs.org/) y vuelve a ejecutar este script.' -ForegroundColor Red
    exit 1
}

# 2. Instalar dependencias si hace falta
$nodeModulesPath = Join-Path $dashboardDir 'node_modules'
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host 'Primera vez: instalando dependencias (npm install)...' -ForegroundColor Yellow
    Write-Host 'Esto puede tardar un par de minutos. No cierres esta ventana.' -ForegroundColor Yellow
    Push-Location $dashboardDir
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host 'ERROR: "npm install" ha fallado. Revisa el mensaje de arriba.' -ForegroundColor Red
            Pop-Location
            exit 1
        }
    } finally {
        Pop-Location
    }
    Write-Host 'Dependencias instaladas correctamente.' -ForegroundColor Green
    Write-Host ''
}

# 3. Descargar Chromium + ECharts si hace falta (npm run setup)
$echartsPath = Join-Path $dashboardDir 'public\\vendor\\echarts.min.js'
if (-not (Test-Path $echartsPath)) {
    Write-Host 'Primera vez: preparando el dashboard (npm run setup).' -ForegroundColor Yellow
    Write-Host 'Esto descarga Chromium para generar PDFs (~300MB) y puede tardar varios minutos.' -ForegroundColor Yellow
    Write-Host 'No cierres esta ventana hasta que termine.' -ForegroundColor Yellow
    Push-Location $dashboardDir
    try {
        npm run setup
        if ($LASTEXITCODE -ne 0) {
            Write-Host 'ERROR: "npm run setup" ha fallado. Revisa el mensaje de arriba.' -ForegroundColor Red
            Pop-Location
            exit 1
        }
    } finally {
        Pop-Location
    }
    Write-Host 'Preparacion completada.' -ForegroundColor Green
    Write-Host ''
}

# 4. Arrancar el servidor en segundo plano (ventana propia, independiente de esta consola)
$portFile = Join-Path $dashboardDir '.port'
if (Test-Path $portFile) { Remove-Item $portFile -Force }

Write-Host 'Arrancando el servidor del dashboard...' -ForegroundColor Cyan
$proceso = Start-Process -FilePath 'node' -ArgumentList @('server.js', "\`"$proyectoDir\`"") \`
    -WorkingDirectory $dashboardDir -WindowStyle Normal -PassThru

# 5. Esperar a que el servidor escriba el puerto real en .port y a que responda
Write-Host 'Esperando a que el servidor arranque...' -ForegroundColor Cyan
$puerto = $null
$intentos = 0
$maxIntentos = 60 # ~30s (0.5s por intento)

while ($intentos -lt $maxIntentos) {
    if (Test-Path $portFile) {
        $contenido = (Get-Content $portFile -Raw -ErrorAction SilentlyContinue)
        if ($contenido -and $contenido.Trim() -match '^\\d+$') {
            $puerto = $contenido.Trim()
            try {
                $resp = Invoke-WebRequest -Uri "http://localhost:$puerto/api/data" -UseBasicParsing -TimeoutSec 2
                if ($resp.StatusCode -eq 200) { break }
            } catch {
                # todavia no responde, seguimos esperando
            }
        }
    }
    Start-Sleep -Milliseconds 500
    $intentos++
}

if (-not $puerto) {
    Write-Host 'ERROR: El servidor no ha arrancado en el tiempo esperado.' -ForegroundColor Red
    Write-Host 'Revisa la ventana del proceso "node server.js" que se ha abierto para ver el error.' -ForegroundColor Red
    exit 1
}

Write-Host "Dashboard listo en http://localhost:$puerto" -ForegroundColor Green
Write-Host 'Abriendo el navegador...' -ForegroundColor Green
Start-Process "http://localhost:$puerto"

Write-Host ''
Write-Host 'El servidor sigue corriendo en su propia ventana ("node server.js").' -ForegroundColor Gray
Write-Host 'Cierra esa ventana cuando quieras detener el dashboard.' -ForegroundColor Gray
`;
  fs.writeFileSync(path.join(destinoDashboard, 'iniciar-dashboard.ps1'), contenido, 'utf8');
}

function main() {
  const argRuta = process.argv[2];
  if (!argRuta) {
    console.error('Uso: node instalar-en-proyecto.js <ruta-al-proyecto>');
    console.error('Ejemplo: node instalar-en-proyecto.js investigar/mi-proyecto');
    process.exit(1);
  }

  const proyectoPath = path.resolve(process.cwd(), argRuta);
  if (!fs.existsSync(proyectoPath) || !fs.statSync(proyectoPath).isDirectory()) {
    console.error(`ERROR: la ruta de proyecto no existe o no es un directorio: ${proyectoPath}`);
    process.exit(1);
  }

  const destinoDashboard = path.join(proyectoPath, 'dashboard');
  const yaExistia = fs.existsSync(destinoDashboard);
  fs.mkdirSync(destinoDashboard, { recursive: true });

  console.log('=== PM Copilot — instalación del dashboard en el proyecto ===\n');
  console.log(`Proyecto destino: ${proyectoPath}`);
  console.log(`Carpeta del dashboard: ${destinoDashboard}`);
  console.log(yaExistia ? '(ya existía: se actualiza el código, node_modules y caché quedan intactos)\n' : '(instalación nueva)\n');

  const copiados = [];

  // 1. Archivos sueltos de la raíz del dashboard
  for (const nombre of ARCHIVOS_A_COPIAR) {
    const origenPath = path.join(ORIGEN, nombre);
    copiarFileSiExiste(origenPath, path.join(destinoDashboard, nombre), nombre, copiados);
  }

  // 2. Directorios completos (lib/, public/) — incluye public/vendor/echarts.min.js
  //    SI ya existe en el origen; si no existe todavía, simplemente no se copia
  //    (lo generará "npm run setup" en el proyecto destino más adelante).
  for (const nombre of DIRECTORIOS_A_COPIAR) {
    const origenPath = path.join(ORIGEN, nombre);
    if (!fs.existsSync(origenPath)) continue;
    const destinoPath = path.join(destinoDashboard, nombre);
    fs.mkdirSync(destinoPath, { recursive: true });
    copiarDirectorio(origenPath, destinoPath, nombre, copiados);
  }

  // 3. Scripts de arranque de un clic (se generan siempre de cero: son
  //    pequeños y deben reflejar exactamente la versión actual del lanzador).
  generarBat(destinoDashboard);
  generarPs1(destinoDashboard);

  // --- Resumen ---------------------------------------------------------
  console.log(`Archivos copiados (${copiados.length}):`);
  for (const rel of copiados) {
    console.log(`  - ${rel}`);
  }
  console.log('  - iniciar-dashboard.bat   (generado)');
  console.log('  - iniciar-dashboard.ps1   (generado)');

  const teniaEcharts = copiados.some((r) => r.replace(/\\/g, '/') === 'public/vendor/echarts.min.js');
  if (!teniaEcharts) {
    console.log('\nNota: public/vendor/echarts.min.js no existía todavía en el origen (dashboard');
    console.log('base sin "npm run setup" ejecutado); no pasa nada, se generará en el proyecto');
    console.log('destino la primera vez que se ejecute "npm run setup" (el lanzador de un clic ya lo hace por ti).');
  }

  console.log('\nNo se ha tocado (si ya existía): node_modules/, .port, ni la caché');
  console.log('".pm-copilot-cache.json" (esa vive en la raíz del proyecto, no dentro de dashboard/,');
  console.log('así que una reinstalación de dashboard/ nunca la afecta).');

  console.log('\n=== Siguiente paso ===');
  console.log('Opción recomendada (un clic):');
  console.log(`  Haz doble clic en: ${path.join(destinoDashboard, 'iniciar-dashboard.bat')}`);
  console.log('\nOpción manual:');
  console.log(`  cd "${destinoDashboard}"`);
  console.log('  npm install');
  console.log('  npm run setup');
  console.log(`  node server.js "${proyectoPath}"`);
}

main();
