# Lecciones Aprendidas

## 2024-06-24 — Sesión de diseño inicial

1. **El workspace (Capa 0) y el producto (Capa 1) son conceptos distintos que hay que mantener separados.** Al principio hubo confusión pensando que el sistema de documentos era para los clientes, cuando en realidad es para este proyecto de diseño.

2. **No asumir la descomposición del producto sin validar con el usuario.** La primera propuesta de descomposición (Knowledge Base, GEE Tracker, etc.) no reflejaba correctamente la intención del usuario porque confundía la capa de trabajo con la capa de producto.

3. **El ejemplo real del Excel GEE fue mucho más rico que mi diseño inicial.** Los parámetros reales (META, INFO Riesgos, Check Init, Impedimentos, dos vistas del riesgo) duplican la riqueza del diseño. Validar siempre con ejemplos reales del usuario.

4. **El pipeline desacoplado fue una idea del usuario, no mía.** El usuario insistió en que cada paso debe tener outputs estándar y no saber de dónde vienen ni a dónde van. Es una restricción de diseño que mejora enormemente la flexibilidad.

5. **Preguntar el formato de salida al usuario en cada paso**, no asumirlo. El usuario prefiere elegir en cada ejecución.
