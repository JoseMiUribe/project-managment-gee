# Zonas de Incertidumbre — E-T

**Origen:** Post-entrevista 2024-06-26
**Propósito:** Identificar lo que el cliente no sabe, no ha detallado o ha dejado ambiguo para gestionar riesgos asociados.

## Zonas identificadas

| ID | Zona | Descripción | Riesgo asociado | Acción sugerida |
|---|---|---|---|---|
| ZI-01 | Validez legal de la firma | El cliente no ha consultado con un abogado. Asume que la PNG escaneada vale, pero sin confirmación legal. Si no es válida, hay que cambiar a firma electrónica | Retraso en MVP si hay que integrar Autofirma/Docusign. Coste no presupuestado de licencias de firma | Conseguir dictamen legal antes de Septiembre. Definir plan B (firma electrónica) |
| ZI-02 | Gestión financiera: ¿sí o no? | El cliente quiere facturación de licencias SaaS + gestión financiera del centro. Habría que evaluar si meter la segunda opción dispersa el foco del MVP | Sobrecarga del equipo, retraso en Septiembre. El core del producto es orientación, no contabilidad | Evaluar esfuerzo de gestión financiera vs valor. Proponer alternativa: solo facturación licencias en MVP, gestión centro en Fase 2 |
| ZI-03 | Vista de familias: alcance sin definir | El cliente la pidió sobre la marcha. No hay detalle de qué datos exactamente ven las familias (¿solo notas? ¿incidencias? ¿comunicaciones?) | Esfuerzo no estimado. Puede requerir autenticación de padres (complejidad adicional) | Definir alcance mínimo de la vista familias antes de comprometer desarrollo |
| ZI-04 | Módulo de enfermería: ¿entra o no? | El cliente lo mencionó pero no hay especificación. No está en el MVP original. Sin detalle de funcionalidades | Ampliación de alcance no planificada. Riesgo de que el equipo se disperse | Decisión: ¿entra en MVP o Fase 2? Si entra, requiere sesión de especificación |
| ZI-05 | Autenticación de familias | Si la vista de familias sigue adelante, no se habló de cómo se autentican los padres. Sin 2FA ni definición de flujo de registro | Datos de menores accesibles si la autenticación es débil. Riesgo RGPD | Definir flujo de autenticación para familias: 2FA, código SMS, etc. |
| ZI-06 | Matriz de gravedad sin definir | El cliente no tiene criterios para nivel 1-3. Propuesta nuestra pendiente de validación | Hasta que se defina, las incidencias se clasificarán de forma inconsistente | Proponer matriz en la próxima reunión. Incluir ejemplos por nivel |
| ZI-07 | Plan de migración inexistente | El cliente no sabe cómo poblar la base de datos inicial. No hay plan para migrar desde Fidias/Raíces/Sodo | Si no hay datos, el sistema no sirve. El centro piloto arranca vacío | Ofrecerse a diseñar el plan de migración. Priorizar carga CSV y validación de datos |
| ZI-08 | KPIs sin formalizar | Los verbalizaron pero no están documentados ni tienen métricas base (línea base). Sin línea base no se puede medir mejora | No se podrá demostrar el éxito del proyecto. Difícil justificar inversión futura | Documentar KPIs con línea base actual. Ej: "ahora un informe tarda 6h → objetivo 3h" |
| ZI-09 | Roadmap sin fechas | El cliente trajo un roadmap conceptual sin hitos ni fechas concretas | Falta de compromiso temporal. Dificultad para planificar sprints | Ayudar al cliente a definir hitos con fechas realistas |
| ZI-10 | Exportación a Raíces: especificación pendiente | No se definió el formato del fichero, los campos, la frecuencia (batch diario/semanal), ni si es manual o automático | Esfuerzo no estimado. Puede requerir mapeo de datos complejo | Solicitar especificación técnica de Raíces a la Comunidad de Madrid |
| ZI-11 | Enfermería: ¿módulo separado o dentro de salud? | No está claro si la enfermería va en la pestaña de salud del alumno o es un módulo independiente con su propio acceso | Diseño duplicado o incompatible si se decide tarde | Decidir ubicación antes de empezar el diseño |
| ZI-12 | Calendario configurable: ¿quién lo administra? | No se definió qué perfil configura el calendario (¿Gestor de Centro? ¿Super-Admin?). Tampoco si hay calendario por defecto | Confusión de permisos, duplicidad de configuraciones | Definir propietario de la configuración del calendario |

## Resumen

| Tipo | Cantidad |
|---|---|
| 🟡 Zonas que requieren decisión del cliente | 6 (ZI-01, ZI-02, ZI-04, ZI-06, ZI-08, ZI-09) |
| 🔵 Zonas que requieren especificación técnica | 4 (ZI-03, ZI-05, ZI-10, ZI-11) |
| ⚪ Zonas que requieren definición de procesos | 2 (ZI-07, ZI-12) |
