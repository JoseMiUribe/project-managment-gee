# Diario de Diseño

**Propósito:** Bitácora del proceso de diseño de PM Copilot. Decisiones, reflexiones, cambios de dirección. Esto NO es la auditoría del sistema (ver `auditoria-sistema.md`).

## 2024-06-24 — Sesión de diseño inicial

1. **El workspace (Capa 0) y el producto (Capa 1) son conceptos distintos que hay que mantener separados.** Al principio hubo confusión pensando que el sistema de documentos era para los clientes, cuando en realidad es para este proyecto de diseño.

2. **No asumir la descomposición del producto sin validar con el usuario.** La primera propuesta de descomposición (Knowledge Base, GEE Tracker, etc.) no reflejaba correctamente la intención del usuario porque confundía la capa de trabajo con la capa de producto.

3. **El ejemplo real del Excel GEE fue mucho más rico que mi diseño inicial.** Los parámetros reales (META, INFO Riesgos, Check Init, Impedimentos, dos vistas del riesgo) duplican la riqueza del diseño. Validar siempre con ejemplos reales del usuario.

4. **El pipeline desacoplado fue una idea del usuario, no mía.** El usuario insistió en que cada paso debe tener outputs estándar y no saber de dónde vienen ni a dónde van. Es una restricción de diseño que mejora enormemente la flexibilidad.

5. **Preguntar el formato de salida al usuario en cada paso**, no asumirlo. El usuario prefiere elegir en cada ejecución.

## 2024-06-28 — Refinamiento post-E-T

6. **La capacidad del equipo no puede estimarse sin conocer el DoD.** El DoD añade esfuerzo a cada HU y debe definirse antes de calcular la velocidad del equipo. Esto reordenó el pipeline: DoR/DoD → Capacidad → Roadmap.

7. **Los DoR/DoD necesitan la misma flexibilidad que la capacidad.** Tres modos de entrada (guiado, plantilla, mixto) cubren todos los escenarios de uso.

8. **El bootstrap debe ser automático o guiado según la IA.** Una IA con capacidad de crear archivos (OpenCode, Claude Code) crea la estructura automáticamente. Una IA sin ella (chat web) da instrucciones exactas.

9. **Separar auditoría del sistema de lecciones del proyecto.** La primera (`auditoria-sistema.md`) es para mejorar el propio pluggin. Las segundas (`lecciones-sprint-X.md`) son para mejorar la ejecución del proyecto.
