# Setup: PM Copilot en Claude Web Project

**Tiempo estimado:** 15 minutos
**Qué necesitas:** Una cuenta de Claude (claude.ai) con acceso a Projects

---

## Paso 1: Crear el proyecto

1. Ve a [claude.ai](https://claude.ai)
2. En el menú lateral, haz clic en **Projects** → **Create Project**
3. Ponle nombre: **PM Copilot** (o el que quieras)

## Paso 2: Configurar las instrucciones

1. Dentro del proyecto, ve a **Project Settings** → **Custom Instructions**
2. Abre el archivo `INSTRUCCIONES-CLAUDE-WEB.md` de este workspace
3. **Copia todo el contenido** y pégalo en Custom Instructions
4. Guarda

## Paso 3: Subir los archivos de conocimiento

1. En **Project Knowledge**, haz clic en **Upload Files**
2. Sube los siguientes archivos desde la carpeta `diseno/` del workspace:

### Paso -1 (Legacy) — 6 prompts:
| Archivo | Ruta |
|---|---|
| subpaso-1.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-1.md` |
| subpaso-2.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-2.md` |
| subpaso-3.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-3.md` |
| subpaso-3b.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-3b-filtro.md` |
| subpaso-4.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-4.md` |
| subpaso-5.md | `diseno/paso--1-analisis-legacy/prompts/subpaso-5.md` |

### Paso -1 (Legacy) — 4 templates:
| Archivo | Ruta |
|---|---|
| inventario-fuentes.md | `diseno/paso--1-analisis-legacy/templates/inventario-fuentes.md` |
| mapa-proyecto.md | `diseno/paso--1-analisis-legacy/templates/mapa-proyecto.md` |
| cuestionarios.md | `diseno/paso--1-analisis-legacy/templates/cuestionarios.md` |
| guia-pm.md | `diseno/paso--1-analisis-legacy/templates/guia-pm.md` |

### Paso 0 — 1 guía:
| Archivo | Ruta |
|---|---|
| guia-estandar-paso-0.md | `diseno/paso-0-captura-requisitos/templates/guia-estandar-paso-0.md` |

### Paso 1 — 1 spec:
| Archivo | Ruta |
|---|---|
| README.md | `diseno/paso-1-framework-gee/README.md` |

### Paso 2 — 2 prompts + 4 templates:
| Archivo | Ruta |
|---|---|
| cuestionario-capacidad.md | `diseno/paso-2-roadmap-backlog/prompts/cuestionario-capacidad.md` |
| definir-dor-dod.md | `diseno/paso-2-roadmap-backlog/prompts/definir-dor-dod.md` |
| plantilla-capacidad.md | `diseno/paso-2-roadmap-backlog/templates/plantilla-capacidad.md` |
| output-capacidad.md | `diseno/paso-2-roadmap-backlog/templates/output-capacidad.md` |
| roadmap-cliente.md | `diseno/paso-2-roadmap-backlog/templates/roadmap-cliente.md` |
| roadmap-tecnico.md | `diseno/paso-2-roadmap-backlog/templates/roadmap-tecnico.md` |

### Paso 3 — 5 prompts + 8 templates:
| Archivo | Ruta |
|---|---|
| evaluacion-dor.md | `diseno/paso-3-gestion-sprints/prompts/evaluacion-dor.md` |
| sprint-planning.md | `diseno/paso-3-gestion-sprints/prompts/sprint-planning.md` |
| daily-log.md | `diseno/paso-3-gestion-sprints/prompts/daily-log.md` |
| sprint-review.md | `diseno/paso-3-gestion-sprints/prompts/sprint-review.md` |
| retrospectiva.md | `diseno/paso-3-gestion-sprints/prompts/retrospectiva.md` |
| dor-definition.md | `diseno/paso-3-gestion-sprints/templates/dor-definition.md` |
| dod-definition.md | `diseno/paso-3-gestion-sprints/templates/dod-definition.md` |
| sprint-backlog.md | `diseno/paso-3-gestion-sprints/templates/sprint-backlog.md` |
| review-sprint.md | `diseno/paso-3-gestion-sprints/templates/review-sprint.md` |
| retrospectiva.md (template) | `diseno/paso-3-gestion-sprints/templates/retrospectiva.md` |

### Opcional: plantillas por tipo de proyecto
| Archivo | Ruta |
|---|---|
| web-app.md | `diseno/paso-3-gestion-sprints/templates/por-tipo/web-app.md` |
| mobile-app.md | `diseno/paso-3-gestion-sprints/templates/por-tipo/mobile-app.md` |
| data-platform.md | `diseno/paso-3-gestion-sprints/templates/por-tipo/data-platform.md` |
| api-backend.md | `diseno/paso-3-gestion-sprints/templates/por-tipo/api-backend.md` |
| mvp-prototipo.md | `diseno/paso-3-gestion-sprints/templates/por-tipo/mvp-prototipo.md` |

### Template documento oficial:
| Archivo | Ruta |
|---|---|
| documentacion-proyecto.md | `diseno/templates/documentacion-proyecto.md` |

## Paso 4: ¡A usarlo!

1. Vuelve al chat del proyecto
2. Escribe: *"Vamos a empezar un proyecto nuevo. Se llama [nombre]"*
3. El asistente te guiará paso a paso

## Notas

- **Límite de archivos:** Claude Web Projects tiene un límite de archivos subidos. Si te pasas, prioriza los prompts y omite algunos templates (se pueden generar sobre la marcha)
- **Cada proyecto nuevo** que gestiones puede ser una conversación dentro del mismo Project, o puedes crear Projects separados por cliente
- **Si algo no funciona**, revisa que los archivos estén bien subidos y las Custom Instructions correctamente pegadas
- **No necesitas subir todos los archivos** para empezar. Con los prompts del Paso -1 y Paso 0 ya puedes hacer cosas útiles
