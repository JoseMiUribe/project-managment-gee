# Paso -1: Análisis de Legacy — Implementation Plan

> **For agentic workers:** This plan implements the sub-pasos 1-5 of the Legacy Analysis pipeline. Each task produces a deliverable that feeds into the next.

**Goal:** Build a reusable prompt library + markdown templates that any PM can use with Claude/Gemini to analyze legacy projects from chaotic documentation.

**Architecture:** Pipeline of 5 independent sub-pasos, each producing a standard markdown artifact. The human (PM) is the orchestrator: feeds input, runs prompts in the AI of choice, and passes artifacts between steps. No code beyond the prompts and templates.

**Tech Stack:** Markdown templates + system prompts for Claude/Gemini. Optionally wrappable as an OpenCode plugin later.

---

### Task 1: Template — inventario-fuentes.md

**Files:**
- Create: `diseno/paso--1-analisis-legacy/templates/inventario-fuentes.md`
- Create: `diseno/paso--1-analisis-legacy/prompts/subpaso-1-recogida.md`

- [ ] **Step 1: Write the prompt for Sub-paso 1 (Recogida)**

Create `prompts/subpaso-1-recogida.md`:

```markdown
# Prompt: Sub-paso 1 — Recogida de fuentes

## Instrucciones para la IA

Eres un analista de proyectos experto. Te voy a proporcionar una serie de documentos sobre un proyecto (PDFs, Word, presentaciones, URLs, código fuente, capturas de pantalla). Tu tarea es:

1. Clasificar cada fuente según su tipo (documentación técnica, presentación comercial, código, email, etc.)
2. Extraer metadata: fecha (si visible), autoría (si visible), formato
3. Generar un resumen de 2 líneas del contenido de cada fuente
4. Indicar tu nivel de confianza en la fiabilidad de cada fuente (Alta / Media / Baja / No determinable)

Devuelve la información en una tabla markdown con estas columnas:
| ID | Nombre fuente | Tipo | Formato | Fecha | Autor | Resumen | Fiabilidad |
|---|---|---|---|---|---|---|---|

## Input del usuario

[El usuario pega aquí la lista de documentos o los sube como adjuntos]

## Output esperado

Una tabla markdown completa con todas las fuentes clasificadas.
```

- [ ] **Step 2: Write the template for inventario-fuentes.md**

Create `templates/inventario-fuentes.md`:

```markdown
# Inventario de Fuentes — [Nombre del Proyecto]

**Fecha del análisis:** YYYY-MM-DD
**Analista:** [Nombre / IA utilizada]

## Fuentes analizadas

| ID | Nombre fuente | Tipo | Formato | Fecha | Autor | Resumen | Fiabilidad |
|---|---|---|---|---|---|---|---|
| F-001 | | | | | | | |
| F-002 | | | | | | | |
| ... | | | | | | | |

## Resumen ejecutivo

**Total fuentes:** X
**Distribución por tipo:** [resumen]
**Fuentes con fiabilidad Alta:** X
**Fuentes con fiabilidad Baja:** X
**Observaciones:** [notas sobre la calidad general de la documentación]
```

- [ ] **Step 3: Review and commit**

Check: Does the prompt clearly instruct the AI? Are all columns defined? Is the template usable as-is?

---

### Task 2: Template — mapa-proyecto.md

**Files:**
- Create: `diseno/paso--1-analisis-legacy/templates/mapa-proyecto.md`
- Create: `diseno/paso--1-analisis-legacy/prompts/subpaso-2-analisis.md`

- [ ] **Step 1: Write the prompt for Sub-paso 2 (Análisis y clasificación)**

Create `prompts/subpaso-2-analisis.md`:

```markdown
# Prompt: Sub-paso 2 — Análisis y clasificación

## Instrucciones para la IA

Tienes el inventario de fuentes de un proyecto (archivo adjunto: inventario-fuentes.md) y una breve explicación del contexto proporcionada por el PM.

Tu tarea es analizar toda la información y clasificar cada aspecto del proyecto en UNA de estas 4 categorías:

1. ✅ **CLARO**: Hechos confirmados por múltiples fuentes o sin contradicción aparente
2. ⚠️ **CONTRADICTORIO**: Dos o más fuentes dicen cosas distintas sobre el mismo tema
3. ❓ **AMBIGUO**: Información vaga, incompleta, o con terminología no definida
4. 🔲 **INEXISTENTE**: No hay documentación sobre este aspecto

Para cada item, indica:
- **Aspecto**: ¿De qué parte del proyecto habla? (arquitectura, tecnología, flujo, equipo, etc.)
- **Estado**: ✅ / ⚠️ / ❓ / 🔲
- **Descripción**: Explica el hallazgo
- **Fuentes**: IDs de las fuentes que respaldan esta conclusión
- **Recomendación**: ¿Qué habría que hacer para resolverlo?

Devuelve el análisis en una tabla markdown:

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-001 | | | | | |

Al final, incluye un resumen con el conteo de cada categoría.

## Input del usuario

[El usuario adjunta inventario-fuentes.md y escribe un breve contexto del proyecto]

## Output esperado

Tabla markdown con todos los aspectos clasificados + resumen estadístico.
```

- [ ] **Step 2: Write the template for mapa-proyecto.md**

Create `templates/mapa-proyecto.md`:

```markdown
# Mapa del Proyecto — [Nombre del Proyecto]

**Fecha:** YYYY-MM-DD
**Basado en:** inventario-fuentes.md (X fuentes analizadas)

## Resumen del análisis

| Categoría | Cantidad | % |
|---|---|---|
| ✅ Claro | 0 | 0% |
| ⚠️ Contradictorio | 0 | 0% |
| ❓ Ambiguo | 0 | 0% |
| 🔲 Inexistente | 0 | 0% |
| **Total** | **0** | **100%** |

## Detalle por aspecto

| ID | Aspecto | Estado | Descripción | Fuentes | Recomendación |
|---|---|---|---|---|---|
| A-001 | | | | | |

## Acciones recomendadas

- [ ] Resolver contradicciones: [listar IDs ⚠️]
- [ ] Clarificar ambigüedades: [listar IDs ❓]
- [ ] Investigar aspectos inexistentes: [listar IDs 🔲]
```

- [ ] **Step 3: Verify prompt-template alignment**

Check: Does the prompt produce output that fits the template? Are the column names consistent?

---

### Task 3: Template — cuestionarios.md

**Files:**
- Create: `diseno/paso--1-analisis-legacy/templates/cuestionarios.md`
- Create: `diseno/paso--1-analisis-legacy/prompts/subpaso-3-guia-entrevista.md`

- [ ] **Step 1: Write the prompt for Sub-paso 3 (Guía de entrevista)**

Create `prompts/subpaso-3-guia-entrevista.md`:

```markdown
# Prompt: Sub-paso 3 — Guía de entrevista

## Instrucciones para la IA

Tienes el mapa del proyecto (archivo adjunto: mapa-proyecto.md) que identifica aspectos claros, contradictorios, ambiguos e inexistentes del proyecto.

Tu tarea es generar dos cuestionarios para entrevistar al cliente:

### Cuestionario A: Perfil de NEGOCIO
- Lenguaje sencillo, sin tecnicismos
- Preguntas orientadas a: propósito del sistema, usuarios, reglas de negocio, flujos de valor, prioridades
- Enfócate en resolver los items ❓ (ambiguos) y 🔲 (inexistentes) que tengan naturaleza de negocio

### Cuestionario B: Perfil TÉCNICO
- Lenguaje técnico preciso
- Preguntas orientadas a: arquitectura, tecnologías, integraciones, despliegue, deuda técnica, configuraciones
- Enfócate en resolver los items ⚠️ (contradictorios), ❓ (ambiguos) y 🔲 (inexistentes) de naturaleza técnica

### Formato de cada pregunta:
| # | Pregunta | Aspecto a resolver | IDs relacionados | Notas para el entrevistador |
|---|---|---|---|---|
| 1 | | | A-XXX | |

## Input del usuario

[El usuario adjunta mapa-proyecto.md]

## Output esperado

Dos tablas markdown (una por perfil) con preguntas listas para usar.
```

- [ ] **Step 2: Write the template for cuestionarios.md**

Create `templates/cuestionarios.md`:

```markdown
# Guía de Entrevista — [Nombre del Proyecto]

**Preparado para:** [Nombre del cliente/interlocutor]
**Perfil:** [Negocio / Técnico]
**Fecha:** YYYY-MM-DD
**Basado en:** mapa-proyecto.md

## Instrucciones para el PM

1. Selecciona las preguntas relevantes según el perfil del interlocutor
2. Marca las respuestas en la columna "Respuesta" durante la entrevista
3. Vuelca las respuestas en el mapa del proyecto tras la reunión

## Cuestionario

| # | Pregunta | Aspecto a resolver | IDs relacionados | Respuesta | Notas post-entrevista |
|---|---|---|---|---|---|
| 1 | | | | | |

## Resumen post-entrevista

**Aspectos resueltos:** [IDs]
**Aspectos pendientes:** [IDs]
**Nuevos hallazgos:** [notas]
```

- [ ] **Step 3: Verify**

Check: Are both profiles covered? Do the questions target the right IDs from the map?

---

### Task 4: Template — documentacion-proyecto.md

**Files:**
- Create: `diseno/paso--1-analisis-legacy/templates/documentacion-proyecto.md`
- Create: `diseno/paso--1-analisis-legacy/prompts/subpaso-4-feedback.md`
- Create: `diseno/paso--1-analisis-legacy/prompts/subpaso-5-documentacion.md`

- [ ] **Step 1: Write the prompt for Sub-paso 4 (Incorporar feedback)**

Create `prompts/subpaso-4-feedback.md`:

```markdown
# Prompt: Sub-paso 4 — Incorporar feedback

## Instrucciones para la IA

El PM ha realizado la entrevista al cliente y tiene las respuestas. Tu tarea es:

1. Tomar el mapa-proyecto.md original
2. Incorporar las respuestas de la entrevista
3. Actualizar el estado de los aspectos:
   - Los que se resolvieron → pasar a ✅ Claro
   - Los que siguen sin resolver → mantener estado
   - Si surgen nuevas contradicciones → marcar como ⚠️
4. Añadir nuevos aspectos si el cliente mencionó algo no cubierto

Devuelve el mapa-proyecto ACTUALIZADO (versión 2).

## Input del usuario

[El usuario adjunta: mapa-proyecto.md + cuestionarios.md cumplimentados]

## Output esperado

mapa-proyecto-v2.md (misma estructura que el original, pero actualizado)
```

- [ ] **Step 2: Write the prompt for Sub-paso 5 (Documentación estable)**

Create `prompts/subpaso-5-documentacion.md`:

```markdown
# Prompt: Sub-paso 5 — Documentación estable

## Instrucciones para la IA

Tienes el mapa del proyecto actualizado (mapa-proyecto-v2.md) y todas las fuentes originales.

Tu tarea es redactar una documentación consolidada y profesional del proyecto. Debe incluir:

1. **Visión general** (2-3 párrafos para negocio): ¿Qué hace el sistema? ¿Para quién? ¿Qué valor aporta?
2. **Arquitectura y componentes** (para técnicos): Diagrama textual, descripción de cada componente, tecnologías usadas
3. **Glosario de términos**: Definiciones de la terminología específica del proyecto
4. **Estado real de cada componente**: Estable / Legacy / En migración / Desaparecido
5. **Decisiones técnicas (ADRs)**: Si se encontraron decisiones clave documentadas
6. **Pendientes**: Lo que no se ha podido determinar y queda abierto

Formato: Documentación estructurada en markdown, lista para compartir o importar.

## Input del usuario

[El usuario adjunta: mapa-proyecto-v2.md + todas las fuentes originales]

## Output esperado

Documentación completa en markdown.
```

- [ ] **Step 3: Write the template for documentacion-proyecto.md**

Create `templates/documentacion-proyecto.md`:

```markdown
# Documentación del Proyecto — [Nombre del Proyecto]

**Versión:** 1.0
**Fecha:** YYYY-MM-DD
**Estado:** [Borrador / Revisión / Aprobado]

---

## 1. Visión General

[3-4 párrafos: qué hace, para quién, valor de negocio]

## 2. Glosario de Términos

| Término | Definición |
|---|---|
| | |

## 3. Arquitectura

### 3.1 Diagrama de componentes (textual)

```
[Sistema] → [Componente A] → [Base de datos]
         → [Componente B] → [API externa]
```

### 3.2 Descripción de componentes

| Componente | Responsabilidad | Tecnología | Estado | Notas |
|---|---|---|---|---|
| | | | | |

### 3.3 Integraciones

| Sistema externo | Propósito | Tipo de integración | Estado |
|---|---|---|---|
| | | | |

## 4. Estado del Proyecto

### 4.1 Por componente

| Componente | Estado | Observaciones |
|---|---|---|
| | Estable / Legacy / En migración / Desaparecido | |

### 4.2 Deuda técnica conocida

- [Descripción de deuda técnica identificada]

## 5. Decisiones Técnicas (ADRs)

### ADR-001: [Título]
- **Contexto:** ...
- **Decisión:** ...
- **Consecuencias:** ...

## 6. Pendientes y riesgos

| # | Pendiente | Prioridad |
|---|---|---|
| 1 | | |

## 7. Anexos

- Fuentes analizadas: [enlace a inventario-fuentes.md]
- Mapa del proyecto: [enlace a mapa-proyecto-v2.md]
- Entrevistas: [enlace a cuestionarios.md]
```

- [ ] **Step 4: Verify full pipeline**

Check: Does the chain work? Recogida → Análisis → Cuestionarios → Feedback → Documentación. Can you trace a piece of information from input to final doc?

---

### Task 5: Guía procedural para el PM

**Files:**
- Create: `diseno/paso--1-analisis-legacy/guia-pm.md`

- [ ] **Step 1: Write the procedural guide**

Create `guia-pm.md`:

```markdown
# Guía del PM — Paso -1: Análisis de Legacy

## ¿Cuándo usar este paso?

Cuando el cliente tiene un proyecto existente con documentación caótica, desfasada, contradictoria o escasa, y necesitas entenderlo antes de proponer cambios o nuevas funcionalidades.

## Lo que necesitas

- Documentación disponible (PDFs, Word, wikis, presentaciones, código)
- 30-60 minutos para la primera ronda de análisis con la IA
- Una reunión con el cliente (para resolver dudas)

## Flujo de trabajo

### Fase 1: Recogida (30 min)
1. Reúne toda la documentación que tengas del proyecto
2. Abre Claude/Gemini y ejecuta el prompt de **subpaso-1-recogida.md**
3. Adjunta los documentos o pégalos en la conversación
4. Revisa el inventario generado
5. Guarda el resultado en `inventario-fuentes.md`

### Fase 2: Análisis (30 min)
1. Ejecuta el prompt de **subpaso-2-analisis.md**
2. Adjunta `inventario-fuentes.md` y escribe un breve contexto del proyecto (2-3 frases)
3. Revisa la clasificación: ¿estás de acuerdo? ¿moverías algo de categoría?
4. Guarda el resultado en `mapa-proyecto.md`
5. **Decide**: ¿Es suficiente lo que sabes o necesitas hablar con el cliente?

### Fase 3: Entrevista (preparación 15 min + reunión 30-60 min)
1. Ejecuta el prompt de **subpaso-3-guia-entrevista.md**
2. Adjunta `mapa-proyecto.md`
3. Elige el cuestionario según el perfil del interlocutor (negocio vs técnico)
4. Prepara la reunión seleccionando las preguntas más relevantes
5. Durante la reunión, anota las respuestas en el cuestionario
6. Guarda el resultado en `cuestionarios.md`

### Fase 4: Actualización (20 min)
1. Ejecuta el prompt de **subpaso-4-feedback.md**
2. Adjunta `mapa-proyecto.md` y `cuestionarios.md` con respuestas
3. Revisa el mapa actualizado
4. Guarda como `mapa-proyecto-v2.md`

### Fase 5: Documentación (30 min)
1. Ejecuta el prompt de **subpaso-5-documentacion.md**
2. Adjunta `mapa-proyecto-v2.md` y todas las fuentes originales
3. Revisa la documentación generada
4. Decide el formato de salida (documento markdown, Confluence, PDF)
5. Guarda como `documentacion-proyecto.md`

## Tiempo estimado total: 2-3 horas

## Consejos
- Si el proyecto es muy grande, divide el análisis en módulos
- No confíes ciegamente en la clasificación de la IA — revisa siempre
- Si el cliente no puede reunirse, usa el cuestionario como guía para una llamada corta
- Guarda todos los artefactos en la carpeta del proyecto para trazabilidad
```

- [ ] **Step 2: Create main README for the paso**

Update `README.md` to reference the guía and templates:

[Update existing README.md to add these lines at the end]

```markdown
## Implementación

Este paso está implementado como un conjunto de prompts para Claude/Gemini y templates markdown.

### Archivos de implementación
- `prompts/`: Instrucciones para la IA en cada sub-paso
- `templates/`: Plantillas markdown para los artefactos de salida
- `guia-pm.md`: Guía procedural para el PM

### Cómo usar
1. Sigue la guía-pm.md paso a paso
2. Ejecuta los prompts en Claude/Gemini en orden
3. Guarda los outputs en los templates correspondientes
```

- [ ] **Step 3: Final pipeline verification**

Run through a hypothetical scenario:
1. PM collects 5 docs → prompt 1 → `inventario-fuentes.md` with 5 rows
2. Prompt 2 on inventario → `mapa-proyecto.md` with classifications
3. Prompt 3 on mapa → `cuestionarios.md` with targeted questions
4. PM interviews client, fills answers → prompt 4 on feedback → `mapa-proyecto-v2.md`
5. Prompt 5 on v2 → `documentacion-proyecto.md`

**This is the complete MVP of Paso -1.** Each step is independent, artifacts are standard markdown, and any AI (Claude, Gemini, OpenCode) can process the prompts.
