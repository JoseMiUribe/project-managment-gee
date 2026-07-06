# Template: Roadmap Cliente

**Propósito:** Roadmap de alto nivel para stakeholders no técnicos. Franjas amplias, hitos de negocio, lenguaje claro.

**Instrucciones:**
- NO uses sprints, puntos, deuda técnica ni jerga de desarrollo
- Usa meses/trimestres
- Marca nivel de confianza explícito
- Incluye premisas: "Si X no ocurre, esta fecha se mueve"
- Este documento se genera con `prompts/paso-2/generar-roadmaps.md`, siempre junto con `roadmap-tecnico.md` (nunca en solitario)

---

# Roadmap — [Nombre del Proyecto]

> **Versión para:** Cliente / Stakeholders
> **Fecha:** [YYYY-MM-DD]
> **Próxima revisión:** [YYYY-MM-DD]
> **Confianza global:** [Alta / Media / Baja — basado en `capacidad-equipo/actual.md` y riesgos GEE]

---

## Resumen ejecutivo

[2-3 frases: qué se va a entregar, cuándo aproximadamente, y qué condiciones podrían cambiar las fechas]

---

## Timeline

### Hito 1: [Nombre del hito] 🎯
| | |
|---|---|
| **Qué incluye** | [Descripción del entregable de negocio] |
| **Ventana estimada** | [Mes/Trimestre] — [Mes/Trimestre] |
| **Confianza** | [🔥 Alto riesgo / ⚠️ Riesgo medio / ✅ Confianza alta] |
| **Depende de** | [Condiciones externas que deben cumplirse] |

> *Ejemplo: "Registro y configuración del primer centro educativo con usuarios gestores. Ventana: Sep-Nov 2026. ⚠️ Riesgo medio: depende de la aprobación del registro LOPIVI."*

### Hito 2: [Nombre del hito] 🎯
| | |
|---|---|
| **Qué incluye** | |
| **Ventana estimada** | |
| **Confianza** | |
| **Depende de** | |

### Hito 3: [Nombre del hito] 🎯
...

---

## Diagrama de hitos

```
Q3 2026          Q4 2026          Q1 2027          Q2 2027
│                │                │                │
[═══ Hito 1 ═══] [═══ Hito 2 ═══] [═══ Hito 3 ════] [═══ Hito 4 ═══]
│                │                │                │
Confianza: ⚠️    Confianza: ✅    Confianza: 🔥    Confianza: ⚠️
```

---

## Niveles de confianza explicados

| Indicador | Significado |
|---|---|
| ✅ Confianza alta | Dependencias resueltas, equipo con experiencia en la tecnología, estimación con datos históricos |
| ⚠️ Riesgo medio | Hay incertidumbre controlada (tecnología nueva, dependencia externa en proceso) |
| 🔥 Alto riesgo | Falta información clave, dependencia externa no resuelta, equipo sin experiencia en el área |

---

## Premisas y condiciones

El roadmap asume que se cumplen estas condiciones. Si alguna cambia, las fechas se revisarán:

1. **[Condición 1]** — ej: Cloudflare UE aprobado antes de octubre 2026
2. **[Condición 2]** — ej: El equipo se mantiene con la composición actual (ver `capacidad-equipo/actual.md`)
3. **[Condición 3]** — ej: No hay cambios de alcance significativos
4. **[Condición 4]** — ej: Las dependencias externas se resuelven en los plazos acordados

## ¿Qué pasa si cambia algo?

Este roadmap se actualiza cuando:
- Cambia el alcance (nuevos requisitos, prioridades)
- Cambia el equipo (altas, bajas, reducción de dedicación) → se genera una nueva versión de `capacidad-equipo/`
- Se materializan riesgos del GEE
- Se resuelven (o no) dependencias externas

La próxima revisión está planificada para el **[fecha]**.

---

> **Nota para el PM:** Este documento se genera automáticamente desde `epicas.md` + `capacidad-equipo/actual.md` + GEE, ejecutando `prompts/paso-2/generar-roadmaps.md`. No lo edites manualmente; si necesitas cambios, actualiza los inputs y regenera. Su contraparte técnica es `roadmap-tecnico.md` — consúltalo si necesitas el detalle de sprints, dependencias o asignación por perfil.
