# Template: Documentación Oficial del Proyecto

**Propósito:** Documento consolidado y presentable que se construye paso a paso. Cada fase del pipeline añade secciones. No es un artefacto interno (esos están en `output-paso-X/`), sino la vista oficial del proyecto para stakeholders, equipo y PM.

**Cómo se usa:**
- La IA actualiza este documento al final de cada paso del pipeline
- Las secciones no rellenadas aún aparecen como "Pendiente de definir"
- Cada sección tiene un estado: 🔲 Pendiente / 🔧 En progreso / ✅ Completado

---

# Documentación del Proyecto — [NOMBRE]

> **Fecha de inicio:** [YYYY-MM-DD]
> **Última actualización:** [YYYY-MM-DD]
> **Versión documento:** V[XX]
> **Estado general:** [🔲 En definición / 🔧 En ejecución / ✅ Entregado]

---

## Control de versiones

| Versión | Fecha | Qué cambió | Quién | Paso que lo generó |
|---|---|---|---|---|
| V1 | | Creación inicial | PM Copilot | Bootstrap |
| | | | | |

---

## 1. Resumen Ejecutivo

> *Se completa al final del proyecto. Hasta entonces, es un borrador.*

**Estado:** 🔲 Pendiente

[3-5 líneas: qué es el proyecto, para quién, qué valor aporta, cuándo se entrega]

---

## 2. Datos del Proyecto

**Estado:** ✅ Se completa en Bootstrap / Paso -1

| Campo | Valor |
|---|---|
| Nombre del proyecto | |
| Cliente | |
| Sector | |
| Tipo de proyecto | [Web / Mobile / Data / API / MVP] |
| Patrocinador | |
| PM asignado | |
| Fecha inicio prevista | |
| Fecha fin prevista | |
| Presupuesto | 🔲 Pendiente |

### Objetivos de negocio

[Qué problema resuelve el proyecto, qué metas de negocio persigue]

### Stakeholders principales

| Rol | Nombre | Expectativa clave |
|---|---|---|
| Patrocinador | | |
| PO / Cliente | | |
| Usuarios finales | | |
| Equipo técnico | | |

---

## 3. Alcance

**Estado:** 🔧 Se construye en Paso -1 y Paso 0

### Lo que incluye (in-scope)

- [Elemento 1]
- [Elemento 2]

### Lo que NO incluye (out-scope)

- [Elemento 1]
- [Elemento 2]

### Criterios de éxito

| Criterio | Métrica | Cómo se mide |
|---|---|---|
| | | |

---

## 4. Requisitos

**Estado:** 🔧 Se completa en Paso 0

### Funcionales

| ID | Descripción | Prioridad | Estado |
|---|---|---|---|
| RF-01 | | Alta/Media/Baja | ✅ Pendiente / 🔧 En desarrollo / ✅ Entregado |

### No funcionales

| ID | Descripción | Categoría | Prioridad |
|---|---|---|---|
| RNF-01 | | Rendimiento/Seguridad/Usabilidad/... | |

### Zonas de incertidumbre

| Aspecto | Incertidumbre | Plan para resolverla |
|---|---|---|
| | | |

---

## 5. Equipo y Capacidad

**Estado:** 🔧 Se completa en Paso 2

### Composición del equipo

| Nombre | Rol | Dedicación |
|---|---|---|
| | | |

### Velocidad estimada

| Escenario | Pts/sprint | Fiabilidad |
|---|---|---|
| Optimista | | |
| Realista | | |
| Pesimista | | |

### Factor DoD aplicado

[Qué exige la Definition of Done y cómo afecta a la velocidad]

*Ver detalle en: `investigar/[proyecto]/capacidad-equipo.md`*

---

## 6. Riesgos y Dependencias

**Estado:** 🔧 Se completa en Paso 1, se actualiza en cada sprint

### Riesgos principales

| Riesgo | Probabilidad | Impacto | RAG | Plan de mitigación |
|---|---|---|---|---|
| | | | 🟢/🟡/🔴 | |

### Dependencias críticas

| Dependencia | Fecha límite | Responsable externo | Estado |
|---|---|---|---|
| | | | ⏳/✅/🔴 |

### Acciones en curso

| Acción | Responsable | Deadline | Estado |
|---|---|---|---|
| | | | |

*Ver detalle completo en: `investigar/[proyecto]/output-paso1/`*

---

## 7. Roadmap

**Estado:** 🔧 Se completa en Paso 2, se actualiza en cada sprint

### Hitos de negocio (para el cliente)

| Hito | Ventana | Confianza |
|---|---|---|
| | | ✅ Alta / ⚠️ Media / 🔥 Baja |

### Plan de sprints (para el equipo)

| Sprint | Fechas | Objetivo | Capacidad asignada |
|---|---|---|---|
| Sprint 1 | | | |
| Sprint 2 | | | |

*Ver detalle en: `investigar/[proyecto]/roadmap-cliente.md` y `roadmap-tecnico.md`*

---

## 8. Estado de Sprints

**Estado:** 🔧 Se actualiza en cada Sprint (Paso 3)

| Sprint | Fechas | HU planificadas | HU completadas | Velocidad real | Lecciones clave |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |

### Próximo sprint

| Objetivo | HU candidatas | Capacidad disponible |
|---|---|---|
| | | |

*Ver detalle en: `investigar/[proyecto]/output-paso3/`*

---

## 9. Decisiones Clave

**Estado:** 🔧 Transversal (se añade cuando ocurre una decisión importante)

| Fecha | Decisión | Alternativa considerada | Quién decidió | Impacto |
|---|---|---|---|---|
| | | | | |

---

## 10. Anexos

**Estado:** 🔧 Se completa progresivamente

| Documento | Ubicación | Formato |
|---|---|---|
| Documento original del cliente | `00-documento-original.md` | Markdown |
| Análisis de legacy | `output-paso--1/` | Markdown |
| Registro de requisitos detallado | `output-paso0/` | Markdown |
| Registro de riesgos completo | `output-paso1/` | Markdown |
| Capacidad del equipo (versionado) | `capacidad-equipo.md` | Markdown |
| Roadmap detallado | `roadmap-cliente.md`, `roadmap-tecnico.md` | Markdown |
| Backlog detallado | `backlog-detalle.md` | Markdown |
| Sprint reviews y retrospectivas | `output-paso3/` | Markdown |
| DoR / DoD del proyecto | `config/` | Markdown |
