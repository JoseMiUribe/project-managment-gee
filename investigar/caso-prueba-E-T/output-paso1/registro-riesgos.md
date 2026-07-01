# Registro de Riesgos — E-T

**Perfil del proyecto:** Alto (multiplicador 60)
**RAG:** Verde <10 | Amarillo 10-30 | Rojo >30

## Registro

| ID | Fecha alta | Riesgo | Consecuencia | Tipo | Prob | Imp | Ámbito | Respuesta | Estado | Coste | Alcance | Plazo | Calidad | Mitigación | Responsable | Peso | RAG | Consideraciones | Relacionado con | Fecha update |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | 2024-06-26 | Catálogo de requisitos impreciso: dispersión entre documento original y nuevos hallazgos de entrevista | Cambios de alcance no planificados, retrabajo | alcance | Alta | Alto | Externo | Reducirlo | Abierto | No | Sí | Sí | Sí | Consolidar todos los hallazgos en un solo documento de alcance y validar con el cliente antes de empezar desarrollo | PM (Josemi) | 16.8 | 🟡 | El catálogo original tiene 33 RFs, hay 9 nuevos de la entrevista, algunos pendientes de decidir si entran en MVP | CAT-01, R-PRE-02 | 2024-06-26 |
| R-002 | 2024-06-26 | Múltiples dependencias externas no controladas (Raíces, Cloudflare UE, dictamen legal) | Bloqueos imprevistos en el desarrollo, retraso en MVP | dependencias | Alta | Alto | Externo | Reducirlo | Abierto | No | Sí | Sí | No | Crear registro de dependencias formal. Contactar con cada proveedor en las primeras 2 semanas | PM (Josemi) | 16.8 | 🟡 | Raíces es la más crítica porque el fichero oficial lo pide la administración | CAT-03, DP-001, DP-002, DP-003 | 2024-06-26 |
| R-003 | 2024-06-26 | Cambios de alcance sin control (vista familias, enfermería ya han aparecido) | Scope creep, equipo disperso, Septiembre en riesgo | alcance | Alta | Alto | Interno | Reducirlo | Abierto | Sí | Sí | Sí | Sí | Establecer proceso formal de change control. Toda petición nueva pasa por comité semanal con evaluación de impacto | PM (Josemi) | 16.8 | 🟡 | Ya hay 2 cambios solicitados en la primera entrevista. La tendencia es alta | CAT-04, R-PRE-03 | 2024-06-26 |
| R-004 | 2024-06-26 | Fecha límite inamovible (Septiembre 2026 = inicio curso escolar) | Presión excesiva, calidad sacrificada, equipo quemado | plazos | Alta | Alto | Externo | Reducirlo | Abierto | No | No | Sí | Sí | Definir MVP mínimo viable realista. Identificar qué funcionalidades son prescindibles si el tiempo se acorta | PM (Josemi) + PO Ana | 16.8 | 🟡 | Si Septiembre es inamovible, hay que priorizar sin piedad | CAT-05 | 2024-06-26 |
| R-005 | 2024-06-26 | Baja adopción por usuarios finales (profesores) | Inversión perdida, proyecto fallido | adopción | Media | Alto | Interno | Reducirlo | Abierto | Sí | Sí | No | Sí | Diseñar plan de adopción y formación. Incluir a profesores en las validaciones desde el principio | PM (Josemi) | 12.0 | 🟡 | Profesores usan iPads, puede haber resistencia al cambio. Sin plan de formación actual | CAT-06, R-GEN-01 | 2024-06-26 |
| R-006 | 2024-06-26 | Datos sensibles de menores mal gestionados (RGPD, LOPIVI) | Sanciones, pérdida de confianza, problemas legales | seguridad/legal | Media | Muy Alto | Interno | Reducirlo | Abierto | Sí | No | No | No | Implementar RLS desde el día 1. Auditoría de accesos. Revisión legal del tratamiento de datos | Legal + Arquitecto | 24.0 | 🟡 | El riesgo es bajo probabilidad pero impacto catastrófico. La firma legal sin dictamen es el punto más débil | CAT-07, R-GEN-06, R-PRE-01 | 2024-06-26 |
| R-007 | 2024-06-26 | Dependencia de Raíces (Comunidad de Madrid) para exportación | Bloqueo si el formato no está disponible o cambia | terceros | Alta | Alto | Externo | Reducirlo | Abierto | No | Sí | Sí | No | Solicitar especificación técnica a la Comunidad de Madrid cuanto antes. Preparar mapeo de datos | PM (Josemi) | 16.8 | 🟡 | RF-040 requiere exportación batch. Sin la especificación no se puede empezar | CAT-08, DP-PRE-01 | 2024-06-26 |
| R-008 | 2024-06-26 | Cloudflare iSearch procesando datos fuera de UE | Transferencia ilegal de datos según RGPD | seguridad/legal | Media | Muy Alto | Externo | Reducirlo | Abierto | Sí | Sí | No | No | Confirmar por escrito con Cloudflare que los Workers AI e iSearch procesan en UE. Si no, migrar a proveedor UE-compliant | Arquitecto técnico | 24.0 | 🟡 | Sin esta confirmación, el chatbot RAG no se puede poner en producción | CAT-09, R-PRE-04 | 2024-06-26 |
| R-009 | 2024-06-26 | Sobrecoste de IA por tokens no presupuestado | Desviación económica, presión para recortar funcionalidades de IA | costes | Media | Medio | Interno | Reducirlo | Abierto | Sí | No | No | No | Implementar Dynamic Gateway Proxy con modelo ligero (Gema 4) por defecto. Monitorizar consumo semanalmente | Arquitecto técnico | 6.0 | 🟢 | El cliente no mencionó presupuesto de IA. Asumir que hay que optimizar | CAT-10 | 2024-06-26 |
| R-010 | 2024-06-26 | Sin plan de pruebas definido | Bugs en producción con datos de menores, pérdida de datos | calidad | Alta | Alto | Interno | Reducirlo | Abierto | Sí | No | Sí | Sí | Exigir plan de pruebas antes de producción. Cobertura mínima del 80% en backend, tests E2E en flujos críticos | QA + PM | 16.8 | 🟡 | Check Init ya lo marcó en rojo (pto 5). Sin plan de pruebas no se debería desplegar | R-GEN-03 | 2024-06-26 |
| R-011 | 2024-06-26 | Cliente sin dedicación exclusiva (Ana tiene otras responsabilidades) | Validaciones retrasadas, cuellos de botella en decisiones | cliente | Media | Alto | Externo | Aceptarlo | Abierto | No | Sí | Sí | No | Establecer ventanas de disponibilidad semanales. Preparar las decisiones con antelación para maximizar el tiempo | PM (Josemi) | 12.0 | 🟡 | Es un riesgo aceptado: no podemos pedir dedicación exclusiva. Hay que gestionar el tiempo del cliente | CAT-13 | 2024-06-26 |
| R-012 | 2024-06-26 | Falta de alineación con usuarios finales (orientadores, profesores) | Funcionalidades que no resuelven problemas reales | alcance | Media | Alto | Interno | Reducirlo | Abierto | No | Sí | No | Sí | Incluir sesiones de validación con usuarios reales en el comité semanal al menos cada 2 semanas | PM (Josemi) + PO Ana | 12.0 | 🟡 | El cliente es la PO, no los usuarios finales. Riesgo de construir algo que nadie usa | R-GEN-01 | 2024-06-26 |

## Vista simplificada (para stakeholders)

| ID | Riesgo | RAG | Mitigación resumida |
|---|---|---|---|
| R-001 | Requisitos imprecisos entre documento y entrevista | 🟡 | Consolidar y validar antes de desarrollo |
| R-002 | Múltiples dependencias externas | 🟡 | Contactar proveedores en semanas 1-2 |
| R-003 | Scope creep sin control | 🟡 | Proceso de change control semanal |
| R-004 | Fecha límite inamovible | 🟡 | Definir MVP realista |
| R-005 | Baja adopción de profesores | 🟡 | Plan de formación y validación con usuarios |
| R-006 | Datos sensibles mal gestionados | 🟡 | RLS + auditoría + revisión legal |
| R-007 | Dependencia de Raíces | 🟡 | Solicitar especificación cuanto antes |
| R-008 | Cloudflare IA fuera de UE | 🟡 | Confirmar por escrito ubicación |
| R-009 | Sobrecoste de IA | 🟢 | Dynamic Gateway + monitorización |
| R-010 | Sin plan de pruebas | 🟡 | Exigir plan antes de producción |
| R-011 | Cliente sin dedicación exclusiva | 🟡 | Optimizar ventanas de disponibilidad |
| R-012 | Falta alineación usuarios finales | 🟡 | Validaciones con usuarios cada 2 semanas |
