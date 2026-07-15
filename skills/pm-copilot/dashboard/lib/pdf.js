'use strict';

const path = require('path');

/**
 * Genera el informe en PDF navegando a la vista /print del propio servidor
 * (debe estar corriendo) y usando Playwright/Chromium headless.
 *
 * @param {string} projectPath ruta absoluta del proyecto (para saber dónde guardar el PDF)
 * @param {number} port puerto en el que está escuchando el servidor Express
 * @returns {Promise<string>} ruta absoluta del PDF generado
 */
async function generatePdf(projectPath, port) {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (err) {
    throw new Error(
      'Playwright no está instalado o Chromium no se ha descargado todavía. ' +
        'Ejecuta "npm install" y luego "npm run setup" antes de generar PDFs.'
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const outputPath = path.join(projectPath, `output-informe-${today}.pdf`);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const url = `http://localhost:${port}/print`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    });
  } finally {
    await browser.close();
  }

  return outputPath;
}

/**
 * Genera un PDF a partir de un documento markdown suelto del proyecto
 * (mecanismo paralelo al informe principal: usa la misma técnica de
 * Playwright, pero apuntando a /print/documento?ruta=... en vez de /print).
 *
 * El PDF se guarda junto al .md original, mismo nombre base
 * (documento "cierre-fase-2.md" -> "cierre-fase-2.pdf" en el mismo directorio).
 *
 * @param {string} rutaAbsolutaMd ruta absoluta del .md ya validada (dentro del proyecto)
 * @param {string} rutaRelativaMd ruta relativa tal cual la envió el cliente (para la URL)
 * @param {number} port puerto en el que está escuchando el servidor Express
 * @param {"completa"|"cliente"} [version] "cliente" genera un PDF separado (sufijo -cliente) sin el
 *   contenido marcado como interno — ver dashboard/lib/markdownClientStrip.js
 * @returns {Promise<string>} ruta absoluta del PDF generado
 */
async function generatePdfDeDocumento(rutaAbsolutaMd, rutaRelativaMd, port, version) {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (err) {
    throw new Error(
      'Playwright no está instalado o Chromium no se ha descargado todavía. ' +
        'Ejecuta "npm install" y luego "npm run setup" antes de generar PDFs.'
    );
  }

  const esCliente = version === 'cliente';
  const dir = path.dirname(rutaAbsolutaMd);
  const nombreBase = path.basename(rutaAbsolutaMd, path.extname(rutaAbsolutaMd));
  const outputPath = path.join(dir, `${nombreBase}${esCliente ? '-cliente' : ''}.pdf`);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const url =
      `http://localhost:${port}/print/documento?ruta=${encodeURIComponent(rutaRelativaMd)}` +
      (esCliente ? '&version=cliente' : '');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    });
  } finally {
    await browser.close();
  }

  return outputPath;
}

module.exports = { generatePdf, generatePdfDeDocumento };
