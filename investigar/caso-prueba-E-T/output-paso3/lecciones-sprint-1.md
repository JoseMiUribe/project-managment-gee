# Retrospectiva — Sprint 1 E-T

**Fecha:** 14 Jul 2026 (simulado)
**Participantes:** Josemi (PM), Carlos, Marta, Ana F., David, Luis (QA)
**Duración:** 45 min

## Lo que fue bien 👍

- **Velocidad del equipo**: 7/7 HU completadas. Estimaciones ajustadas
- **Calidad**: 0 bugs críticos reportados. Los tests RLS y seguridad pasaron sin incidencias
- **HU-004 (Botón de pánico)**: Salió muy rápido, ayudó a liberar capacidad para otras HU
- **Comunicación**: Daily logs con referencias a GEE (R-013, IM-001) funcionaron bien

## Lo que se puede mejorar 🔧

| Problema | Causa raíz | Propuesta de mejora |
|---|---|---|
| Carlos fue cuello de botella | 3 HU dependían de su backend | Rotar responsabilidades: que Marta coja más backend en Sprint 2 |
| HU-006 no entró por falta de definición | No se definieron "pasos obligatorios mínimos" | Tener el refinamiento hecho ANTES del Sprint Planning |
| HU-008 retrasada por disponibilidad de PO | Ana no pudo validar hasta el día 10 | Establecer ventana de validación fija (ej. miércoles) |
| Cloudflare UE sin respuesta (DP-002) | Dependencia externa no escalada a tiempo | Escalar antes. Si no hay respuesta en 1 semana, activar plan B |

## Lecciones aprendidas

| ID | Aprendizaje | Impacto |
|---|---|---|
| L-001 | Las HU con dependencias externas (DP-XXX) deben refinarse al menos 1 sprint antes | Proactividad en dependencias |
| L-002 | El equipo funciona bien con asignación clara de responsabilidades en el sprint backlog | Mantener el formato de tareas técnicas |
| L-003 | Los 16 puntos del Check Init predijeron correctamente 2 de los 3 problemas reales (falta planificación y dependencias sin gestión) | Validado: Check Init funciona |

## Acciones para Sprint 2

| ID | Acción | Responsable |
|---|---|---|
| RETRO-01 | Refinar HU-003 y HU-006 antes del Planning de Sprint 2 | Josemi |
| RETRO-02 | Rotar asignaciones: Marta al backend, Carlos al frontend en algunas HU | Josemi |
| RETRO-03 | Fijar ventana de validación con Ana: miércoles 10:00-12:00 | Josemi + Ana |
| RETRO-04 | Escalar DP-002 a dirección del cliente | Josemi |

## Velocidad del equipo

| Sprint | HU planificadas | HU completadas | Observaciones |
|---|---|---|---|
| Sprint 1 | 7 | 7 | Velocidad base: 7 HU / sprint (estandarizar en puntos en próximos sprints) |
