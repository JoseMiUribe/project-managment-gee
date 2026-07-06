'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js';
const VENDOR_DIR = path.join(__dirname, 'public', 'vendor');
const ECHARTS_DEST = path.join(VENDOR_DIR, 'echarts.min.js');

async function main() {
  console.log('=== PM Copilot Dashboard — setup ===\n');

  // 1. Comprobar node_modules
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.error(
      'No se ha encontrado node_modules. Ejecuta primero "npm install" y luego vuelve a lanzar "npm run setup".'
    );
    process.exit(1);
  }
  console.log('[OK] node_modules presente.');

  // 2. Instalar Chromium para Playwright
  console.log('\nDescargando Chromium para Playwright (~300MB, puede tardar unos minutos)...');
  try {
    execSync('npx playwright install chromium', { stdio: 'inherit', cwd: __dirname });
    console.log('[OK] Chromium instalado.');
  } catch (err) {
    console.error('Error instalando Chromium:', err.message);
    process.exit(1);
  }

  // 3. Descargar ECharts localmente
  console.log(`\nDescargando ECharts desde ${ECHARTS_URL} ...`);
  try {
    if (!fs.existsSync(VENDOR_DIR)) fs.mkdirSync(VENDOR_DIR, { recursive: true });
    const response = await fetch(ECHARTS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} al descargar ECharts`);
    }
    const text = await response.text();
    fs.writeFileSync(ECHARTS_DEST, text, 'utf8');
    console.log(`[OK] ECharts guardado en ${ECHARTS_DEST}`);
    console.log('     (así el dashboard no depende de un CDN externo en cada carga posterior)');
  } catch (err) {
    console.error('Error descargando ECharts:', err.message);
    console.error('Puedes reintentar ejecutando "node setup.js" de nuevo, o descargar manualmente');
    console.error(`el archivo desde ${ECHARTS_URL} y guardarlo en ${ECHARTS_DEST}`);
    process.exit(1);
  }

  console.log('\n=== Setup completado. Ya puedes ejecutar: npm start -- <ruta-proyecto> ===');
}

main().catch((err) => {
  console.error('Error inesperado en setup:', err);
  process.exit(1);
});
