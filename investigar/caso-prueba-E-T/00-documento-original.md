# Documento de Especificación de Requerimientos: Plataforma de Orientación Integral E-T

## Resumen Ejecutivo
Proyecto de plataforma SaaS multi-centro para digitalizar la gestión académica, psicopedagógica y operativa en centros educativos. Abarca desde infantil hasta FP. Concepto central: "alumno 360" — ficha única del estudiante con visión holística.

## Fuentes del documento
Según las citas al final, este documento se ha elaborado a partir de:
1. 00_MemoryBank_Completo — Documento de memoria del proyecto
2. 99_Bitacora_Decisiones — Bitácora de decisiones técnicas
3. 03_Stack_Tecnologico — Stack tecnológico definido
4. 02_Personas_y_Roles — Personas y roles del sistema
5. 06_Estado_Actual — Estado actual del proyecto
6. E-T_UX_Brief_Gestor.docx — UX Brief del perfil Gestor
7. Criterios de Aceptacion del Backlog - Gema Infinia — Criterios de aceptación
8. E-T - Demo Informes - 2026-06-19 10:00 - Notas de Gemini — Notas de demo de informes

## Contenido completo

El documento incluye:
- **Resumen ejecutivo y contexto de negocio** — Problema, usuarios, alcance MVP (Fase 1, septiembre 2026)
- **33 Requisitos Funcionales** (RF-001 a RF-033) en 7 módulos:
  1. Configuración Global y SaaS Multi-Tenant (Super-Admin E-T) — RF-001 a RF-005
  2. Administración y Onboarding del Centro (Gestor) — RF-006 a RF-010
  3. Ficha Única del Alumno (Alumno 360) e Importación de Datos — RF-011 a RF-015
  4. Observaciones, Incidencias y Control de Asistencia — RF-016 a RF-020
  5. Gestión de Casos, Bienestar Escolar y Protocolos LOPIVI — RF-021 a RF-025
  6. Redacción de Informes, Firma Digitalizada y Consentimiento Familiar — RF-026 a RF-029
  7. Visualización Analítica (Dashboards) y Perfiles de Consulta (CEO) — RF-030 a RF-033
- **13 Requisitos No Funcionales** (Rendimiento, Seguridad, Usabilidad, Disponibilidad, Mantenibilidad)
- **Hallazgos, contradicciones y gaps**:
  - Paradoja de Permisos de Dirección (acceso clínico vs. firma oficial)
  - Inconsistencia de reportes financieros en plataforma de orientación
  - Incompatibilidad visual de plantillas (PDFs editables vs. Word/ODT)
  - Validez jurídica de la firma digitalizada simplificada
  - Garantía y soberanía de datos en replicación vectorial RAG
  - Inexistencia de canal de revocación de consentimiento familiar
- **Recomendaciones de arquitectura**: triggers de base de datos, optimización financiera IA, vistas materializadas

## Perfiles de usuario identificados
- Super-Administrador E-T (soporte interno)
- Gestor de Centro / ColeAdmin
- Director de Centro
- Director de Grupo (CEO)
- Coordinador de Bienestar (LOPIVI)
- Orientador
- Profesor / Tutor
- PT / AL (Pedagogía Terapéutica / Audición y Lenguaje)
- Usuario invitado (familias, implícito)

## Stack tecnológico mencionado
- Frontend: React SPA + ShadCN
- Backend: Supabase (PostgreSQL + Edge Functions)
- Hosting: Cloudflare Pages
- Almacenamiento: Cloudflare R2
- IA: Cloudflare Workers AI + iSearch RAG
- Modelos: Gema 4 (ligero), Kimi 2.6 (avanzado)
- Base de datos: PostgreSQL con RLS
- Región: Suecia (RGPD)
- Despliegue: GitHub Actions + PG Tap

## Fechas clave
- MVP objetivo: Septiembre 2026
- Demo informes: 19 junio 2026
- Setup Sprint ya completado (decisiones DEC-xxx registradas)
