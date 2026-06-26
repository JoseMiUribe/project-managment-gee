# Guía para Paso 0 — Plataforma de Orientación Integral E-T

**Fecha:** 2024-06-26
**Basado en:** mapa-proyecto.md + filtro de impacto en decisiones inmediatas

## 1. Contradicciones a resolver (priorizadas)

| ID | Contradicción | Impacta en | Pregunta para el cliente | Urgencia |
|---|---|---|---|---|
| A-013 | Director firma informes clínicos pero no debe verlos. Implementado como duplicado de Jefe Estudios → fuga de datos por RLS | Arquitectura de seguridad, RGPD, diseño de permisos | "¿El Director debe ver el contenido de los informes que firma o solo la metadata? ¿Qué modelo de firma queréis: ciego (solo firma) o con vista?" | Alta |
| A-014 | Reportes financieros (Facturas, Cobros, Pedidos) en demo. Excluidos del alcance oficial del MVP | Alcance del proyecto, esfuerzo del equipo, foco | "Los reportes de facturas/cobros que mostrasteis en la demo: ¿son para facturar licencias E-T o para gestión financiera del centro? Si es gestión financiera, ¿esto entra en el MVP o no?" | Alta |
| A-017 | Firma digitalizada (PNG escaneada) sin validez legal confirmada | Riesgo legal, aceptación por inspección educativa | "¿Habéis consultado con un abogado si la firma PNG escaneada es válida legalmente? ¿Qué pasa si un informe es impugnado?" | Alta |
| A-016 | IA propone gravedad de incidencias automáticamente → ¿dónde está el humano en el ciclo? | Flujo de trabajo, responsabilidad legal | "Cuando la IA propone una gravedad para una incidencia, ¿quién la valida antes de guardarla? ¿El profesor puede cambiarla?" | Media |

## 2. Ambigüedades a clarificar

| ID | Aspecto ambiguo | Por qué es relevante para lo nuevo | Pregunta sugerida |
|---|---|---|---|
| A-018 | Coordinador de Bienestar: ¿rol propio o permiso sobre otro perfil? | Afecta al diseño de roles, RLS y onboarding | "El Coordinador de Bienestar, ¿es un perfil nuevo o cualquier Orientador/Director puede serlo si se le activa el flag?" |
| A-019 | Familias: ¿solo entregan papel o tienen acceso a la plataforma? | Afecta al diseño de la experiencia de familias, aunque esté excluido del MVP, condiciona la arquitectura de datos | "Las familias, aparte de entregar el consentimiento firmado en papel, ¿tendrán algún tipo de acceso a la plataforma en el futuro? ¿Cómo pensáis gestionar eso?" |
| A-021 | Criterios de escala de gravedad 1-3 no definidos | Sin criterios claros, la clasificación de incidencias será inconsistente | "¿Podemos definir juntos una matriz de gravedad con ejemplos concretos de qué va en cada nivel?" |

## 3. Información que falta (imprescindible)

| ID | Qué falta | Para qué se necesita | Dónde conseguirla |
|---|---|---|---|
| A-027 | KPIs de éxito del proyecto | Para saber si el proyecto cumple objetivos y poder priorizar | Preguntar al cliente en la reunión |
| A-028 | Roadmap temporal con hitos intermedios | Para planificar sprints y gestionar expectativas | Sesión de planificación con el equipo |
| A-024 | Plan de migración desde Fidias/Raíces/Sodo | Para saber cómo se puebla la base de datos inicialmente | Reunión con el equipo técnico del centro |

## 4. Riesgos y dependencias detectadas

| ID | Riesgo/Dependencia | Impacto potencial | Confirmar con cliente |
|---|---|---|---|
| R-001 | Si la firma PNG no tiene validez legal, hay que integrar Autofirma o Docusign → retraso y coste no previsto | Retraso en MVP, coste adicional de licencia | Confirmar si hay dictamen legal |
| R-002 | Si los reportes financieros entran en el MVP, el equipo se dispersa y septiembre peligra | Fracaso del MVP, pérdida de foco | Confirmar alcance real de reportes |
| R-003 | No hay plan de pruebas definido → riesgos de calidad en producción | Bugs en producción, datos de menores corruptos | Exigir plan de pruebas antes de Sept |
| R-004 | No hay plan de adopción → los profesores no usan el sistema | Inversión perdida, proyecto fallido | Solicitar plan de formación y cambio |
| R-005 | Dependencia: Cloudflare iSearch RAG con modelos de IA. Si los datos se procesan fuera de UE, es ilegal según RGPD | Bloqueo legal del chatbot RAG | Confirmar ubicación física del procesamiento de IA |

## 5. Recomendaciones para la entrevista

- **Orden sugerido**: empezar por la paradoja de permisos de Dirección (A-013) porque bloquea decisiones de implementación. Luego reportes financieros (A-014) porque redefine alcance. Luego firma legal (A-017) porque es riesgo alto.
- **Perfiles recomendados**: Product Owner + Arquitecto Técnico (juntos, para resolver negocio y técnico a la vez)
- **Documentación que debería traer el cliente**: 
  - Dictamen legal sobre firma digitalizada (si existe)
  - Roadmap actual del proyecto
  - Plan de migración desde sistemas actuales
  - KPIs u OKRs del proyecto
