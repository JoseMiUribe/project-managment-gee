# Sprint Review — Sprint 1 E-T

**Fecha:** 14 Jul 2026 (simulado)
**Participantes:** Josemi (PM), Ana (PO), Equipo (Carlos, Marta, Ana F., David, Luis)
**Objetivo del sprint:** Primer centro creado + usuario Gestor logado

## Qué se planificó vs qué se entregó

| HU | Título | Planificado | Entregado | Estado |
|---|---|---|---|---|
| HU-001 | Alta de centro escolar | ✅ | ✅ | Completada. Primer centro creado, RLS verificado, contraste WCAG OK |
| HU-002 | Catálogo maestro de etiquetas | ✅ | ✅ | CRUD + propagación en cascada. QA pasado |
| HU-004 | Botón de pánico IA | ✅ | ✅ | Switch global. Widgets ocultos al desactivar. QA pasado |
| HU-005 | Aviso global a centros | ✅ | ✅ | Banner + fechas vigencia. Validado por Ana |
| HU-007 | Invitación múltiple de usuarios | ✅ | ✅ | Backend + frontend + email template. QA pasado |
| HU-008 | Designar Coordinador de Bienestar | ✅ | ✅ | Flag + aviso + RLS. Validado por Ana (10 Jul, con retraso) |
| HU-010 | Vinculación multi-centro | ✅ | ✅ | Selector de centro en header. Test multi-centro OK |

**Velocidad:** 7 HU completadas de 7 planificadas (100%)

## Lo que no se entregó (y por qué)

| HU | Motivo | Plan |
|---|---|---|
| HU-003 (Suplantación) | No superó DoR: faltaba definir trigger PostgreSQL | Refinamiento en Sprint 2 |
| HU-006 (Onboarding) | No superó DoR: faltaban pasos obligatorios mínimos | Refinamiento en Sprint 2 |
| HU-009 (RRI/PEC) | Dependencia bloqueante DP-002 (Cloudflare UE) sin resolver | Depende de respuesta de Cloudflare |

## Demo points

1. **Creación de centro (HU-001)**: Formulario completo, tenant creado en <2s, escala cromática adaptada al logo
2. **Invitación de usuarios (HU-007)**: Lista de correos separada por comas, roles asignados, email de invitación recibido
3. **Coordinador de Bienestar (HU-008)**: Flag activado, aviso de privacidad mostrado, permisos LOPIVI funcionando

## Feedback de stakeholders

| De quién | Feedback | Acción |
|---|---|---|
| Ana (PO) | "La interfaz de invitación de usuarios es muy limpia. ¿Podríamos añadir la opción de invitar desde un CSV en lugar de solo texto?" | Nueva petición → evaluar para Sprint 2 |
| Ana (PO) | "Me preocupa que Cloudflare no haya respondido aún. Sin eso, el chatbot RAG no funciona." | Escalar con el arquitecto técnico |
| Equipo | "Carlos está muy cargado. Sugiero rotar las dependencias para el próximo sprint." | Ajustar asignación en Sprint 2 |

## Acciones derivadas

| ID | Acción | Responsable | Deadline |
|---|---|---|---|
| SC-001 | Evaluar petición de invitación por CSV (ampliación de HU-007) | Josemi + Ana | 16 Jul |
| A-014 | Escalar DP-002 (Cloudflare UE) a dirección del cliente | Josemi | 15 Jul |
| A-015 | Refinar HU-003 y HU-006 para Sprint 2 | Equipo | 16 Jul |
