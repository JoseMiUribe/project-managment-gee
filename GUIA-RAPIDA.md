# PM Copilot — Guía Rápida

**Para:** Jefes de Proyecto que quieran usar el sistema por primera vez.
**Tiempo estimado:** 10-15 min leerla. 1-2h ejecutar los primeros pasos.

---

## ¿Qué es esto?

Un asistente que te guía en la gestión de proyectos digitales: desde entender la documentación inicial hasta gestionar sprints. No necesitas saber Agile, SCRUM ni GEE para empezar.

**Outputs que obtienes:** requisitos clasificados, riesgos priorizados con semáforo, roadmap para el cliente y para el equipo, backlog de historias, sprint planning, daily logs, retrospectivas.

---

## Cómo empezar (3 pasos)

### 1. Decide cómo vas a usar el sistema

| Tienes... | Modo | Qué hacer |
|---|---|---|
| **Claude Code / OpenCode / Gemini CLI** (IA que crea archivos) | **Automático** | Dile a la IA: "Activa PM Copilot. Nuevo proyecto [nombre]" → la IA crea la estructura sola |
| **Claude Web (Project)** | **Proyecto con conocimiento** | Crea un Project en claude.ai. Pega `INSTRUCCIONES-CLAUDE-WEB.md` en Custom Instructions y sube los prompts como conocimiento. Sigue `SETUP-CLAUDE-WEB.md` |
| **Claude Web / ChatGPT** (sin Project) | **Guía básica** | Abre `INSTRUCCIONES-CLAUDE-WEB.md`, copia el contenido y pégalo como primera instrucción. Sin archivos de conocimiento, el asistencia tendrá menos detalles |
| **Otra IA** | **Guía** | Usa `INSTRUCCIONES-CLAUDE-WEB.md` como prompt inicial |

### 2. Elige qué paso ejecutar

```
Nuevo proyecto → 
  ¿Hay documentación previa (PDFs, Word, código)? → Paso -1 (Analizar legacy)
  ¿No hay nada, empiezas de cero?                  → Paso 0 (Capturar requisitos)
```

Si no sabes, la IA te recomendará por dónde empezar.

### 3. Deja que la IA te guíe

Cada paso funciona igual:
1. La IA te hace preguntas o te pide documentación
2. Respondes con lo que sepas (no pasa nada si no sabes todo)
3. La IA genera artefactos markdown y los guarda en `investigar/[proyecto]/`
4. Validamos juntos el resultado
5. Pasamos al siguiente paso

---

## Los pasos en 1 frase cada uno

| Paso | En qué te ayuda |
|---|---|
| **Bootstrap** | Crea la carpeta del proyecto y prepara la estructura |
| **-1: Legacy** | Analiza documentación existente y detecta contradicciones, ambigüedades, lagunas |
| **0: Requisitos** | Clasifica lo que pide el cliente en funcional / no funcional + zonas de incertidumbre |
| **1: GEE** | Evalúa 16 puntos de salud del proyecto + calcula riesgos con semáforo (verde/amarillo/rojo) |
| **2a: DoR/DoD** | Define qué significa "preparado" y "terminado" para tu equipo y proyecto |
| **2b: Capacidad** | Calcula cuánto puede entregar tu equipo por sprint (con fiabilidad: ALTA/MEDIA/BAJA) |
| **2c: Roadmap cliente** | Hitos de negocio con rangos de fecha para enseñar a stakeholders |
| **2d: Roadmap técnico** | Sprints con deadlines de dependencias y asignación por perfiles para el equipo |
| **3: Sprints** | Planifica, ejecuta, revisa y aprende sprint a sprint |

---

## Conceptos clave (el mínimo que necesitas saber)

| Término | Qué significa |
|---|---|
| **HU** (Historia de Usuario) | Una funcionalidad concreta: "Como profesor quiero subir notas para calcular la media" |
| **Épica** | Grupo de HU que forman una capacidad grande: "Módulo de evaluación" |
| **DoR** | Lo que necesita una HU para poder empezar a programarla |
| **DoD** | Lo que necesita una HU para darla por terminada |
| **GEE** | Gestión de Entregables y Eventos: riesgos, dependencias, acciones, cambios |
| **RAG** | Semáforo: Verde (<10), Amarillo (10-30), Rojo (>30) |
| **META** | El perfil de riesgo de tu proyecto (bajo/medio/alto/crítico) |

---

## Preguntas frecuentes

**¿Necesito saber Agile o SCRUM?**
No. El sistema te guía. Solo necesitas conocer a tu equipo y a tu cliente.

**¿Qué pasa si no tengo datos históricos del equipo?**
El sistema estima con fiabilidad BAJA y horquilla amplia. Mejor que nada. Cuando tengas datos reales (primer sprint), se recalcula.

**¿Puedo saltarme pasos?**
Sí. Si no hay legacy, salta al Paso 0. Si ya tienes requisitos, salta al GEE. Cada paso funciona independientemente.

**¿Y si el proyecto cambia?**
El roadmap es vivo. Se actualiza cuando cambian dependencias, riesgos, velocidad o alcance.

**¿Esto funciona para cualquier tipo de proyecto?**
Sí, pero hay plantillas de DoR/DoD por tipo (web, mobile, data, APIs, MVP) para ajustar el esfuerzo.

**¿Dónde se guarda todo?**
En `investigar/[nombre-proyecto]/`. Cada paso en su carpeta `output-paso-X/`.

---

## Si te atas

1. Pregúntale a la IA: "¿Qué paso sigue?" o "¿Qué información necesitas de mí?"
2. Revisa los templates en `diseno/[paso]/templates/` para ver ejemplos de outputs
3. Revisa `auditoria-sistema.md` para conocer las limitaciones actuales del sistema
4. Si algo no funciona, repórtalo para mejorar el sistema
