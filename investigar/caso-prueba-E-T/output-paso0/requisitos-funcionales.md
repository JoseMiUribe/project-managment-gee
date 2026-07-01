# Requisitos Funcionales — E-T (nuevos y modificados)

**Origen:** Post-entrevista 2024-06-26
**Basado en:** peticiones-cliente.md + documento original (33 RFs existentes)
**Nota:** Solo se listan añadidos/modificaciones respecto a los RF-001 a RF-033 originales.

## Nuevos requisitos funcionales

| ID | Módulo | Descripción | Prioridad | Origen |
|---|---|---|---|---|
| RF-034 | Ficha Alumno | El Orientador debe poder marcar documentos/informes como "restringidos a dirección" para que el Director no pueda ver su contenido aunque firme el informe | Alta | PC-01 |
| RF-035 | Configuración Global | El sistema debe permitir al Super-Admin gestionar la facturación de licencias SaaS a los centros (generar facturas, controlar pagos, estados) | Alta | PC-02 |
| RF-036 | (Nuevo) Gestión Centro | El sistema debe ofrecer funcionalidades básicas de gestión financiera del centro: cobros a familias, pedidos, informe de facturas proforma | Media | PC-03 |
| RF-037 | Incidencias | El Coordinador de Bienestar debe poder re-clasificar la gravedad de una incidencia después de guardada, quedando registro del cambio | Alta | PC-15 |
| RF-038 | (Nuevo) Familias | El sistema debe proporcionar una vista de solo consulta para familias: notas del alumno, incidencias, comunicación unidireccional del centro | Media | PC-08 |
| RF-039 | (Nuevo) Enfermería | El sistema debe permitir el registro y seguimiento de: medicación autorizada, alergias e intolerancias, visitas a enfermería, autorizaciones firmadas | Baja | PC-09 |
| RF-040 | (Nuevo) Integraciones | El sistema debe generar el fichero oficial de exportación batch a la plataforma Raíces de la Comunidad de Madrid | Media | PC-10 |
| RF-041 | Configuración Centro | El calendario escolar (inicio curso, festivos, evaluaciones, periodos) debe ser configurable por cada centro | Media | PC-12 |
| RF-042 | Incidencias | El sistema debe permitir al profesor confirmar, modificar o rechazar la gravedad propuesta por la IA antes de guardar una incidencia | Alta | PC-05 |

## Modificaciones a RFs existentes

| ID Cambio | RF original | Cambio | Motivo |
|---|---|---|---|
| RF-021 MOD | RF-021 (Protocolos) | Añadir que los documentos marcados como "restringidos" dentro de un protocolo no sean visibles para Dirección | Alineación con RF-034 |
| RF-028 MOD | RF-028 (Consentimiento) | El consentimiento familiar firmado se sube escaneado. Si se implementa vista de familias (RF-038), debe haber un mecanismo de revocación digital | Preparación para vista familias |
| RF-014 MOD | RF-014 (Salud) | Ampliar la pestaña de salud para incluir medicación y visitas a enfermería (integrar con RF-039 si entra en MVP) | Alineación con módulo enfermería |

## Reglas de negocio detectadas

| ID | Regla | Afecta a |
|---|---|---|
| BR-01 | Los documentos marcados como "restringidos" por el Orientador no pueden ser vistos por Dirección, aunque el Director firme el informe | RF-034, Permisos |
| BR-02 | La gravedad de una incidencia propuesta por IA debe ser confirmada por el profesor antes de persistir | RF-042 |
| BR-03 | El Coordinador de Bienestar puede re-clasificar una incidencia, pero queda registro de quién y cuándo hizo el cambio | RF-037 |
| BR-04 | La vista de familias es exclusivamente de consulta (read-only), sin capacidad de escritura | RF-038 |
