# Mapa del Proyecto — Plataforma de Orientación Integral E-T

**Fecha:** 2024-06-26
**Basado en:** inventario-fuentes.md (8 fuentes analizadas)

## Resumen del análisis

| Categoría | Cantidad | % |
|---|---|---|
| ✅ Claro | 12 | 37.5% |
| ⚠️ Contradictorio | 5 | 15.6% |
| ❓ Ambiguo | 5 | 15.6% |
| 🔲 Inexistente | 10 | 31.3% |
| **Total** | **32** | **100%** |

## Detalle por aspecto

### ✅ Claro

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-001 | Arquitectura multi-tenant SaaS | ✅ | Arquitectura con tenants aislados, Super-Administrador con capacidades de gestión global | F-001, F-003 | Documentado, proceder |
| A-002 | Stack tecnológico | ✅ | React + ShadCN, Supabase (PostgreSQL), Cloudflare Pages/R2/Workers, GitHub Actions | F-003 | Stack definido, avanzar |
| A-003 | Concepto Alumno 360 | ✅ | Ficha única del estudiante con 7 categorías de registro, visión holística | F-001, F-004 | Concepto claro |
| A-004 | 7 módulos funcionales | ✅ | RF-001 a RF-033 cubren todos los módulos con detalle | F-001, F-002, F-006, F-007 | Bien especificados |
| A-005 | Alcance MVP (Fase 1) | ✅ | Septiembre 2026, funcionalidades priorizadas, exclusiones explícitas | F-001, F-005 | Acotado |
| A-006 | Perfiles de usuario | ✅ | Super-Admin, Gestor, Director, CEO, Coord. Bienestar, Orientador, Profesor, PT/AL | F-004 | Roles definidos |
| A-007 | Políticas RLS PostgreSQL | ✅ | Aislamiento por school_id vía JWT app_metadata | F-003 | Seguridad multi-tenant clara |
| A-008 | Control de acceso basado en roles (RBAC) | ✅ | Roles definidos con permisos granulares | F-003, F-004 | Implementación estándar |
| A-009 | Almacenamiento en Cloudflare R2 | ✅ | Buckets con presigned URLs (15 min), encriptación AES-256 | F-003 | Arquitectura definida |
| A-010 | IA human-in-the-loop | ✅ | Principio de "humano en el ciclo" como regla de diseño | F-001 | Buen gobierno de IA |
| A-011 | Log de auditoría | ✅ | Registro inmutable de accesos a datos de menores | F-003 | Requisito legal cubierto |
| A-012 | Exclusiones explícitas del MVP | ✅ | Portal familias, analítica predictiva, APIs oficiales, enfermería escolar | F-001 | Ayuda a focalizar |

### ⚠️ Contradictorio

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-013 | Permisos de Dirección | ⚠️ | Director firma informes pero no debe acceder a datos clínicos. Implementado como duplicado de Jefe Estudios + firma Orientador, lo que le da visibilidad de datos restringidos | F-001, F-002 (DEC-076) | Resolver RLS específico para Director: solo ver metadatos del informe, no contenido clínico |
| A-014 | Reportes financieros | ⚠️ | Excluidos del alcance (se delega en Fidias), pero demo de informes incluye "Informe de Facturas/Cobros/Pedidos" | F-001, F-008 | Definir si son facturas de licencias SaaS E-T o facturación del centro. Son cosas distintas |
| A-015 | Formato plantillas informes | ⚠️ | DEC-041 dice PDFs editables fijos; decisión posterior migra a Word/ODT con variables {dinámicas}. Ambas lógicas coexisten en repositorios | F-002 (DEC-041) | Eliminar la lógica de PDFs editables, estandarizar en Word/ODT → PDF |
| A-016 | Automatización de incidencias vs human-in-the-loop | ⚠️ | RF-017 dice "IA analiza texto y propone gravedad". Si la IA propone automáticamente, ¿dónde queda el humano en el ciclo? | F-001, F-007 | Definir punto de validación obligatoria antes de guardar |
| A-017 | Validez jurídica firma digitalizada | ⚠️ | DEC-046 descarta firma criptográfica (Autofirma, Docusign). Se usa PNG escaneada. ¿Tiene validez legal ante inspección educativa? | F-002 (DEC-046) | Consulta jurídica urgente antes de septiembre 2026 |

### ❓ Ambiguo

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-018 | Rol Coordinador de Bienestar | ❓ | RF-008: designable por Gestor. RF-018: recibe notificaciones de incidencias nivel 3. Pero ¿es un rol separado o un permiso adicional sobre otro perfil? | F-001, F-004, F-006 | Definir si es rol primario o permiso adicional. Afecta a RLS |
| A-019 | Portal de familias / interacción | ❓ | Excluido del MVP, pero hay RF-028 (consentimiento familiar escaneado) y "usuario invitado" (RF-010). ¿Hay interacción digital con familias o no? | F-001 | Aclarar: familias entregan papel escaneado vs tienen acceso limitado a la plataforma |
| A-020 | Modelos de IA concretos | ❓ | Se mencionan "Gema 4" (ligero) y "Kimi 2.6" (avanzado). No está claro si son nombres reales o placeholders | F-003 | Verificar disponibilidad real de estos modelos en Cloudflare Workers AI |
| A-021 | Criterios de escala de gravedad 1-3 | ❓ | Las incidencias se clasifican en 3 niveles. ¿Quién define los criterios exactos? ¿Es configurable por centro? | F-001, F-007 | Definir matriz de gravedad con ejemplos concretos por nivel |
| A-022 | Alcance de "Informe de Facturas" | ❓ | ¿Son facturas de licencias SaaS E-T (interno) o facturación del centro a familias (gestión financiera)? | F-008 | Decisión de alcance pendiente. Impacto grande |

### 🔲 Inexistente

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-023 | Plan de pruebas / QA | 🔲 | Solo se menciona cobertura 80% PG Tap. No hay estrategia de testing E2E, carga, seguridad, aceptación | — | Crear plan de pruebas antes de Sept 2026 |
| A-024 | Plan de migración y adopción | 🔲 | No hay mención a cómo se migrará de Fidias, Raíces, Sodo, Google Classroom | — | Definir estrategia de corte y convivencia |
| A-025 | Backup y disaster recovery | 🔲 | No hay estrategia definida para backup, restauración, RPO/RTO | — | Requisito legal para datos de menores |
| A-026 | Plan de capacitación de usuarios | 🔲 | No hay mención a formación de profesores, orientadores, directores | — | Sin adopción, el sistema no sirve |
| A-027 | KPIs de éxito del proyecto | 🔲 | No hay métricas definidas para medir si el proyecto cumple sus objetivos | — | Definir OKRs del proyecto |
| A-028 | Roadmap temporal detallado | 🔲 | Solo "Septiembre 2026". Sin hitos intermedios, sprints, deadlines | — | Crear roadmap con fases |
| A-029 | Arquitectura de integración externa | 🔲 | No hay diseño de APIs con Fidias, Raíces, Sodo. Exclusiones del MVP, pero necesarias pronto | — | Diseñar estrategia de integración (aunque no se implemente en MVP) |
| A-030 | Modelo de datos detallado | 🔲 | No hay esquema ER, tablas, relaciones. Solo se menciona "7 categorías de registro" | — | Crear modelo de datos antes de implementar |
| A-031 | Estrategia de pricing/licencias | 🔲 | ¿Cómo se factura el SaaS? ¿Por centro? ¿Por alumno? ¿Por módulo? | — | Definir modelo de negocio |
| A-032 | Identidad digital de menores | 🔲 | ¿Cómo se autentican los alumnos? ¿Tienen cuenta propia? ¿Acceden a la plataforma? | — | Definir política de identidad digital |

## Acciones recomendadas

- [ ] Resolver contradicciones: A-013, A-014, A-015, A-016, A-017
- [ ] Clarificar ambigüedades: A-018, A-019, A-020, A-021, A-022
- [ ] Investigar aspectos inexistentes: A-023, A-024, A-025, A-026, A-027, A-028, A-029, A-030, A-031, A-032
