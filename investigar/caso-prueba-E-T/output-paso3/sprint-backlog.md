# Sprint Backlog — Sprint 1 E-T

**Sprint:** 1
**Fechas:** 1-14 Jul 2026
**Objetivo:** Primer centro creado + usuario Gestor logado + funcionalidades base multi-tenant
**Capacidad:** 3 FE + 2 BE + 1 QA = ~70 pts estimados (7 HU x ~10 pts c/u)

## HU seleccionadas

| HU | Título | Tallas | Tareas técnicas | Responsable | Estado |
|---|---|---|---|---|---|
| HU-001 | Alta de centro escolar | M | BE: Modelo Tenant en PostgreSQL + endpoint creación<br>BE: Políticas RLS por school_id<br>BE: Generación automática de escala cromática<br>FE: Formulario alta centro<br>FE: Selector de tenant en UI<br>QA: Test creación + aislamiento RLS | BE: Carlos<br>FE: Ana F.<br>QA: Luis | Pendiente |
| HU-002 | Catálogo maestro de etiquetas | S | BE: CRUD etiquetas ACNEE/ACNEAE + propagación cascada<br>BE: Soft delete<br>FE: Panel de gestión de etiquetas<br>QA: Test propagación sin alterar expedientes | BE: Carlos<br>FE: Ana F. | Pendiente |
| HU-004 | Botón de pánico IA | S | BE: Tabla config global + interruptor IA<br>BE: Endpoint estado IA<br>FE: Switch en panel Super-Admin<br>FE: Ocultar/mostrar widgets según estado<br>QA: Test funcionalidades web sin IA | BE: Marta<br>FE: David | Pendiente |
| HU-005 | Aviso global a centros | S | BE: CRUD anuncios + fechas vigencia<br>BE: Endpoint anuncios activos<br>FE: Banner en cabecera con descarte<br>QA: Test persistencia y descarte | BE: Marta<br>FE: David | Pendiente |
| HU-007 | Invitación múltiple de usuarios | M | BE: Procesar lista de correos + validación<br>BE: Generación token de invitación<br>BE: Lógica de vinculación multi-centro (email ya existe)<br>FE: Input de lista de correos + selector rol<br>FE: Template email de invitación<br>QA: Test flujo completo invitación + registro | BE: Carlos<br>FE: Ana F. | Pendiente |
| HU-008 | Designar Coordinador de Bienestar | S | BE: Flag coordinador_bienestar en perfil<br>BE: Actualización RLS al activar flag<br>FE: Interruptor + aviso privacidad<br>FE: Aviso de confirmación<br>QA: Test permisos LOPIVI | BE: Marta<br>FE: David | Pendiente |
| HU-010 | Vinculación multi-centro | S | BE: Lógica de asociar nuevo centro a usuario existente<br>BE: Selector de contexto en sesión<br>FE: Selector de centro en header<br>QA: Test cambio de contexto sin duplicar perfil | BE: Carlos<br>FE: Ana F. | Pendiente |

## Nuevos riesgos detectados en Planning

| ID | Riesgo | Afecta a | Acción |
|---|---|---|---|
| R-013 | La generación de escala cromática desde el logo puede dar colores ilegibles (contraste <4.5:1) | HU-001 | Incluir validación WCAG AA en la generación. Ya está en RNF-08 pero confirmar implementación |
| R-014 | HU-003 (suplantación) no entra en Sprint 1 → sin suplantación, el soporte a centros es manual | Proyecto | Priorizar HU-003 para Sprint 2 |

## Dependencias inter-HU en el sprint

```
HU-001 ──────bloquea──────▶ HU-002 (necesita tenant para etiquetas)
HU-006 (excluida) ──bloquea──▶ HU-007 (necesita usuarios creados? No, HU-007 crea usuarios)
HU-007 ──────bloquea──────▶ HU-010 (necesita usuarios para vincular)
```

Nota: HU-006 (onboarding barra progreso) se excluyó del sprint por falta de definición. HU-007 puede funcionar sin ella, la barra de progreso se añade en refinamiento futuro.
