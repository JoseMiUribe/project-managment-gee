'use strict';

/**
 * Contrato compartido entre los backends de datos del dashboard — documentación
 * pura, sin lógica (este skill no usa TypeScript, así que esto es solo JSDoc
 * de referencia para quien implemente un backend nuevo). Hoy solo existe
 * `local.js` (Markdown, sin cambios de comportamiento); `cloud.js` (Firestore)
 * se añade en una fase posterior del plan de "modo cloud" — ver
 * mejoras-pendientes.md.
 *
 * @typedef {Object} WriteMeta
 * @property {"skill"|"dashboard"} origen  Quién está escribiendo ahora mismo.
 * @property {string} [ifVersion]          Token de concurrencia optimista (el valor de
 *   `ultimaModificacion` que el llamador leyó por última vez). El backend local lo
 *   acepta por simetría de firma pero lo ignora — no hay concurrencia real que
 *   controlar con un único PM en su máquina; el backend cloud sí lo usa.
 *
 * @typedef {Object} DataBackend
 * @property {(projectPath: string, options?: {liveJira?: object}) => Promise<Object>} readSnapshot
 *   Equivalente a `buildSnapshot(projectPath, options)` de hoy.
 * @property {(projectPath: string, tipo: string, id: string|null, fields: Object, meta: WriteMeta) => Promise<{id: string, created: boolean}>} writeRow
 *   Alta o edición de una fila de cualquiera de los tipos de `tipoDescriptors.js`.
 *   `id: null` crea un registro nuevo con ID autogenerado.
 * @property {(projectPath: string, fecha: string|null, payload: Object) => Promise<{fecha: string, created: boolean}>} appendDailylog
 *   Añade una nota suelta al daily log del día (o crea el archivo si hace falta).
 * @property {(projectPath: string, entry: Object) => Promise<{id: string}>} logCambioPendiente
 *   Añade una fila al ledger de cambios pendientes (ver writers/cambiosPendientes.js).
 * @property {() => "local"|"cloud"} kind
 */

module.exports = {};
