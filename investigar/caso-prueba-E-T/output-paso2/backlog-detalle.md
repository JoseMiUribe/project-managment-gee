# Backlog Detalle — Sprint 1 (1-14 Jul 2026)

**Épica:** EP-001 — Multi-Tenant y Administración de Centros
**Objetivo del sprint:** Primer centro creado + usuario Gestor logado

## Historias de Usuario

| ID | Título | Como... | Quiero... | Para... | Criterios de aceptación | Dependencias | Notas técnicas | Prioridad |
|---|---|---|---|---|---|---|---|---|
| HU-001 | Alta de centro escolar | Super-Admin | dar de alta un nuevo centro escolar con sus datos básicos (nombre, logo, dirección, idioma) | habilitar un entorno operativo independiente | Dado un Super-Admin en el panel de creación, cuando introduce nombre, logo y datos del centro, entonces el sistema crea el tenant con su BD lógica, asigna una escala cromática y responde en <3s | — | El tenant debe aislarse por RLS desde el momento 0. La escala cromática se calcula del logo | Alta |
| HU-002 | Catálogo maestro de etiquetas | Super-Admin | gestionar desde un panel centralizado las etiquetas del tipo ACNEE/ACNEAE | asegurar homogeneidad de diagnósticos en todos los centros | Dado el Super-Admin en el catálogo central, cuando añade, modifica o desactiva una etiqueta, entonces el cambio se propaga a todos los centros sin alterar expedientes que ya la usan | HU-001 | Propagar en cascada, no modificar expedientes existentes. Usar soft delete para desactivaciones | Alta |
| HU-003 | Suplantación segura | Super-Admin | suplantar la identidad de un usuario de un centro para resolver incidencias | dar soporte sin comprometer credenciales | Dado un Super-Admin con ticket de soporte activo, cuando activa la suplantación de un perfil, entonces el sistema inicia sesión temporal y registra el evento en auditoría | HU-001 | Implementar trigger PostgreSQL que bloquee suplantación sin ticket activo. Sesión temporal con expiración | Alta |
| HU-004 | Botón de pánico IA | Super-Admin | desactivar centralmente las funciones de IA | mitigar riesgos de costes o errores de modelos | Dado el Super-Admin en configuración global, cuando desactiva el interruptor de IA, entonces el sistema oculta todos los widgets y copilotos de IA sin afectar funciones web tradicionales | HU-001 | No desconectar la BD, solo ocultar UI. Los datos de IA pueden seguir acumulándose | Alta |
| HU-005 | Aviso global a centros | Super-Admin | publicar avisos administrativos visibles en todos los centros | notificar incidencias o mantenimientos | Dado el Super-Admin que redacta un anuncio, cuando configura fechas de vigencia y lo publica, entonces se renderiza un banner persistente en todas las pantallas de usuarios finales, descartable manualmente | HU-001 | Banner en cabecera, no modal. Que se pueda descartar pero no silenciar permanentemente | Media |
| HU-006 | Onboarding: barra de progreso | Gestor de Centro | ver un indicador de progreso de configuración inicial al primer login | cumplir prerrequisitos operacionales | Dado un Gestor que inicia sesión por primera vez, cuando ve el dashboard, entonces ve una barra de progreso con los pasos obligatorios pendientes y el centro no está "activo" hasta completarlos | HU-001 | Restringir estado "activo" del centro hasta completar onboarding. Definir pasos obligatorios mínimos | Alta |
| HU-007 | Invitación múltiple de usuarios | Gestor de Centro | invitar a varios usuarios introduciendo sus emails y rol | poblar el centro sin cargas manuales | Dado el Gestor en gestión de usuarios, cuando introduce una lista de correos separados por comas con rol (Orientador/Profesor/Tutor), entonces el sistema procesa los registros y envía correos de invitación con token seguro | HU-006 | Token verificable. Si el email ya tiene cuenta, asociar nuevo centro al usuario existente | Alta |
| HU-008 | Designar Coordinador de Bienestar | Gestor de Centro | activar el flag de Coordinador de Bienestar en un perfil existente | asignar responsabilidades LOPIVI | Dado el Gestor editando un perfil, cuando activa "Coordinador de Bienestar", entonces el sistema muestra aviso de privacidad, y tras confirmación actualiza la matriz de permisos | HU-007 | Es un flag, no un rol nuevo. Añadir advertencia de privacidad antes de activar | Alta |
| HU-009 | Carga de RRI y PEC | Gestor de Centro | subir los reglamentos internos y proyecto educativo en PDF | que sirvan de fuente de conocimiento para el chatbot RAG | Dado el Gestor en configuración del centro, cuando sube PDFs (máx 4MB), entonces el sistema valida el tamaño y los indexa en la base vectorial de Cloudflare iSearch | HU-006, DP-002 (Cloudflare UE) | Si DP-002 no está resuelto (Cloudflare UE), este requisito queda en pausa. Máx 4MB por archivo | Alta |
| HU-010 | Vinculación multi-centro | Usuario invitado | verificar mi cuenta con un email que ya tiene otra cuenta | no duplicar perfiles al operar en varios centros | Dado un usuario que recibe invitación de un nuevo centro, cuando el sistema detecta que su email ya tiene cuenta, entonces asocia el nuevo centro al usuario existente permitiendo alternar contexto | HU-007 | El usuario puede cambiar de centro desde un selector en la UI. No duplicar perfiles | Alta |

## Resumen del sprint

| Métrica | Valor |
|---|---|
| HU totales | 10 |
| Alta prioridad | 9 |
| Media prioridad | 1 |
| Dependencias externas | 1 (DP-002 Cloudflare → HU-009) |
| Esfuerzo estimado | ~110 puntos (estimación relativa) |
