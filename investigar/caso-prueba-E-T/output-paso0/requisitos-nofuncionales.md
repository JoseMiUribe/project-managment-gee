# Requisitos No Funcionales — E-T (nuevos y modificados)

**Origen:** Post-entrevista 2024-06-26
**Basado en:** peticiones-cliente.md + documento original (13 RNFs existentes)

## Nuevos requisitos no funcionales

| ID | Categoría | Descripción | Métrica | Origen | Prioridad |
|---|---|---|---|---|---|
| RNF-14 | Rendimiento | El sistema debe soportar al menos 200 usuarios concurrentes en el centro piloto, con capacidad de escalar a 5000 en producción multi-centro | 200 ccus piloto, 5000 ccus producción | PC-19 | Alta |
| RNF-15 | Seguridad | La sesión del usuario debe bloquearse tras 3 intentos fallidos de login, con suspensión temporal de 15 minutos | 3 intentos, 15 min bloqueo | PC-16 | Alta |
| RNF-16 | Seguridad | La sesión debe expirar automáticamente tras 30 minutos de inactividad | 30 min | PC-18 | Alta |
| RNF-17 | Usabilidad | La plataforma debe ser fully responsive y funcionar correctamente en iPads (Safari) en orientación horizontal y vertical | Viewports iPad mini, iPad Air, iPad Pro | PC-11 | Alta |
| RNF-18 | Mantenibilidad | Se debe proporcionar una matriz de gravedad de incidencias (nivel 1-3) configurable por centro con ejemplos concretos | Documento de matriz + configuración en BD | PC-07 | Media |
| RNF-19 | Seguridad | Debe existir un mecanismo de revocación digital del consentimiento familiar, con trazabilidad de la solicitud | Registro de revocación con timestamp | PC-08 (derivado) | Media |

## Modificaciones a RNFs existentes

| ID | RNF original | Cambio | Motivo |
|---|---|---|---|
| RNF-03 MOD | RNF-03 (Confidencialidad) | Añadir que los documentos marcados como "restringidos" por el Orientador no son accesibles por Dirección, ni siquiera para firma | Alineación con RF-034 |
| RNF-08 MOD | RNF-08 (Escalabilidad META) | El perfil del proyecto se define como "Alto" (multiplicador 60) por la naturaleza de datos de menores y criticidad del proyecto | Decisión post-entrevista |

## RNF implícitos descubiertos (no los pidió el cliente directamente)

| ID | Categoría | Descripción | Métrica | Justificación |
|---|---|---|---|---|
| RNF-20 | Internacionalización | El contenido del calendario escolar debe soportar configuraciones regionales (festivos autonómicos, locales) | Porcentaje de centros que pueden configurar su calendario sin soporte técnico | Se deriva de PC-12 (calendario configurable) |
| RNF-21 | Usabilidad | La matriz de gravedad debe tener tooltips o ejemplos contextuales visibles al profesor cuando reporta una incidencia | Tiempo medio de clasificación < 30 segundos | Se deriva de PC-07 (profesores no saben clasificar) |
| RNF-22 | Seguridad | Si se implementa vista de familias (RF-038), el acceso debe ser con autenticación reforzada (2FA o código enviado al email/teléfono registrado) | Sin incidentes de acceso no autorizado | Se deriva de PC-08 (datos de menores visibles a familias) |
