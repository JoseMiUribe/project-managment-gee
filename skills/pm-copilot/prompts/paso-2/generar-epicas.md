# Prompt: Generar Épicas — Paso 2

> **Nivel:** 🧠 Diseño — agrupar requisitos en unidades de valor de negocio coherentes requiere criterio de producto. Ejecuta en el modelo principal.

## Propósito

Agrupar los requisitos funcionales del Paso 0 en épicas: bloques coherentes de valor de negocio que sirven de base para el roadmap, la capacidad del equipo y la descomposición en historias de usuario. Es el primer artefacto del Paso 2 — sin épicas no hay roadmap.

## Input

- `investigar/[proyecto]/output-paso-0/requisitos-funcionales.md`
- `investigar/[proyecto]/output-paso-0/requisitos-nofuncionales.md` (para detectar RNF que condicionan alguna épica, ej. RNF de seguridad que obliga a tratar auditoría dentro de una épica)
- `investigar/[proyecto]/output-paso-1/registro-riesgos.md`, `registro-dependencias.md` (para vincular R-XXX y DP-XXX a cada épica)

## Instrucciones para la IA

### 1. Agrupa por objetivo de negocio, no por capa técnica

El criterio de agrupación es "¿qué valor de negocio entrega esto junto?", nunca "¿qué capa técnica comparten?". Una épica nunca debe ser "Backend" o "Frontend" — eso es una tarea, no una unidad de valor.

Pregúntate para cada requisito: "si esto se entregara solo, ¿el cliente reconocería un avance útil?" Los requisitos que solo cobran sentido juntos (ej. alta de usuario + login + roles) van en la misma épica aunque toquen backend, frontend y base de datos a la vez.

Señales de que estás agrupando mal:
- Una épica que solo tiene sentido para el equipo técnico y no se le podría explicar a un stakeholder de negocio
- Dos épicas que siempre se entregan juntas y nunca por separado (probablemente son una)
- Una épica con más de 12-15 requisitos (probablemente hay que partirla en dos unidades de valor distintas)

### 2. Construye cada épica con esta ficha

Para cada épica, completa:

- **ID**: `EP-XXX` correlativo, sin reutilizar números aunque una épica se descarte
- **Nombre**: corto, en lenguaje de negocio (evita nombres de módulo técnico)
- **Objetivo**: 1-2 frases de qué valor entrega y a quién
- **Requisitos que incluye**: lista de RF-XXX (rangos si son correlativos, ej. "RF-011 a RF-015" + sueltos si hay huecos, ej. "+ RF-034")
- **Dependencias con otras épicas**: qué EP-XXX debe estar resuelta (parcial o totalmente) antes de que esta pueda empezar, y por qué
- **Riesgos GEE asociados**: R-XXX del registro de riesgos del Paso 1 que afectan a esta épica
- **Prioridad**: usa MoSCoW (Must/Should/Could/Won't) o value/effort si el proyecto ya usa ese lenguaje con el cliente — sé consistente en todo el documento, no mezcles ambos sistemas
- **Fase sugerida**: MVP / Fase 2 / Condicional (pendiente de decisión explícita, indica cuál)

### 3. Trata las dependencias entre épicas como un grafo, no como una lista

Después de definir las épicas, dibuja las relaciones de bloqueo (qué épica bloquea a cuál) en un diagrama simple de texto. Esto es lo que después usará `generar-roadmaps.md` para secuenciar sprints — no lo omitas aunque parezca redundante con la columna de dependencias.

### 4. Marca lo condicional y lo pospuesto sin ambigüedad

Si una épica depende de una decisión pendiente del cliente o del comité (ej. si un módulo entra en el MVP o no), no la mezcles en la tabla de MVP. Ponla en una sección "Condicional" aparte con la decisión pendiente explícita y la fecha o hito en que se resolverá. Igual para lo que claramente es Fase 2 (post-MVP): que no compita visualmente con lo que sí se va a construir ahora.

### 5. Sé explícito sobre lo que NO se agrupa

Si un requisito no encaja bien en ninguna épica (es transversal, es una mejora técnica pura, o es demasiado pequeño para justificar una épica propia), no lo fuerces. Anótalo en una nota al final indicando en qué épica se atenderá como parte del trabajo técnico general, o si queda huérfano y hay que decidir qué hacer con él.

## Reglas de calidad

- No crear una épica por cada requisito (subagrupar de más). El objetivo son unidades de valor con entidad propia, normalmente entre 5 y 12 requisitos cada una.
- No crear una única épica gigante con todos los requisitos (subagrupar de menos). Si una épica no se puede explicar en dos frases sin usar "y también", probablemente son dos.
- Toda dependencia declarada en la tabla de épicas debe aparecer también en el diagrama de relaciones, y viceversa.
- Todo riesgo R-XXX referenciado debe existir en `registro-riesgos.md`. No inventes riesgos aquí — si detectas uno nuevo mientras agrupas, señálalo para que se dé de alta en el GEE antes de cerrar este documento.

## Output esperado

Guarda el resultado en `investigar/[proyecto]/output-paso-2/epicas.md` con esta estructura:

```markdown
# Épicas — [Nombre del Proyecto]

**Fecha:** [YYYY-MM-DD]
**Basado en:** requisitos funcionales (Paso 0) + riesgos/dependencias (Paso 1)

## MVP ([ventana objetivo])

| ID | Épica | Objetivo | Requisitos incluidos | Dependencias | Riesgos asociados | Prioridad |
|---|---|---|---|---|---|---|
| EP-001 | | | | | | |

## Condicional (pendiente de decisión)

| ID | Épica | Objetivo | Requisitos incluidos | Decisión pendiente | Riesgos asociados |
|---|---|---|---|---|---|
| EP-XXX | | | | | |

## Fase 2 (Post-MVP)

| ID | Épica | Objetivo | Requisitos incluidos | Notas |
|---|---|---|---|---|
| EP-XXX | | | | |

## Relaciones entre épicas

\`\`\`
EP-001 ────bloquea────▶ EP-002
...
\`\`\`

## Notas

[Requisitos huérfanos, decisiones pendientes, criterios de agrupación que conviene dejar explícitos]
```

## Siguiente paso

Con `epicas.md` cerrado, continúa con `definir-dor-dod.md` (si aún no existe DoR/DoD del proyecto) y después `cuestionario-capacidad.md` + `procesar-capacidad.md`. El roadmap (`generar-roadmaps.md`) necesita las tres cosas: épicas, DoD y capacidad.
