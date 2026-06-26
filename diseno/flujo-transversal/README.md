# Flujo Transversal

## Propósito
Documentar cómo fluye la información entre los pasos del pipeline y cómo se conectan entre sí a través de los artefactos y las bases de datos grafo + vectorial.

## Diagrama del flujo

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 GRAFO + VECTORIAL                       │
                  │  (se enriquece en cada paso)                            │
                  └──┬──────────┬──────────┬──────────┬──────────┬──────────┘
                     │          │          │          │          │
                     ▼          ▼          ▼          ▼          ▼
               ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
               │ PASO   │ │ PASO   │ │ GEE    │ │ PASO   │ │ PASO   │
               │  -1    │ │   0    │ │ (1)    │ │   2    │ │   3    │
               │        │ │        │ │        │ │        │ │        │
               │Análisis│ │Captura │ │Riesgos │ │Roadmap │ │Sprints │
               │legacy  │ │reqs    │ │Dep     │ │Backlog │ │        │
               └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
                   │          │          │          │          │
                   │          │          └─────┬────┘          │
                   │          │                │               │
                   │          └───────┬────────┘               │
                   │                  │                        │
                   └──────────┬───────┘────────────────────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │  EJECUCIÓN     │
                     │  (sprint loop) │
                     │                │
                     │ DailyLog → GEE │
                     │ Review → CL    │
                     │ Retro → Lecc.  │
                     └────────────────┘
```

## Flujo de artefactos entre pasos

### Paso -1 → Paso 0

| Qué fluye | Descripción | Formato |
|---|---|---|
| guia-paso-0.md | Contradicciones, ambigüedades, lagunas y riesgos del legacy filtrados para lo nuevo | Markdown |
| Grafo poblado | Nodos: Componente, Tecnología, Persona, Documento con sus relaciones | Base de datos grafo |
| Vectorial poblada | Documentos originales indexados para búsqueda semántica | Base de datos vectorial |

**La IA en Paso 0 usa el grafo para**: cuando el cliente pide algo nuevo, consulta si el concepto ya existe en el legacy, si lo contradice o si depende de algo existente.

### Paso 0 → GEE (Paso 1)

| Qué fluye | Descripción | Formato |
|---|---|---|
| requisitos.md | Funcionales, no funcionales y zonas de incertidumbre | Markdown |
| Grafo update | Nuevos nodos Requisito vinculados a Componentes existentes | Base de datos grafo |

**El GEE arranca con**: riesgos iniciales extraídos de las zonas de incertidumbre + dependencias detectadas en los requisitos + acciones sugeridas.

### GEE → Paso 2 (Roadmap)

| Qué fluye | Descripción | Formato |
|---|---|---|
| registro-riesgos.md | Riesgos con probabilidad, impacto, RAG | Markdown |
| registro-dependencias.md | Dependencias con estados y fechas | Markdown |
| Grafo update | Nodos Riesgo, Dependencia, Acción | Base de datos grafo |

**El roadmap usa esto para**: ordenar épicas según dependencias (una épica no puede ir antes de que se resuelva su dependencia) y añadir colchón temporal según la criticidad de los riesgos.

### Paso 2 → Paso 3 (Sprints)

| Qué fluye | Descripción | Formato |
|---|---|---|
| epicas.md | Grandes bloques de funcionalidad | Markdown |
| roadmap.md | Hitos y franjas temporales | Markdown |
| backlog-detalle.md | HU descompuestas con criterios de aceptación | Markdown |
| Grafo update | Nodos Épica, HistoriaUsuario | Base de datos grafo |

**Sprints usan esto para**: planning, Definition of Ready, y priorización dentro del sprint.

### Paso 3 → GEE (bucle de retroalimentación)

| Qué fluye | Descripción | Formato |
|---|---|---|
| dailylog/ | Eventos diarios con referencias a R-XXX, D-XXX, etc. | Markdown |
| changelog.md | Cambios de alcance detectados en reviews | Markdown |
| lecciones-sprint.md | Métricas de velocidad, aprendizaje | Markdown |

**El GEE se actualiza**: nuevos riesgos descubiertos en el sprint, dependencias que cambiaron, acciones que vencieron, cambios de alcance registrados.

## Transversal: Check Init

El Check Init se ejecuta **después del Paso 0 pero antes del GEE**, cuando ya sabes qué proyecto tienes pero antes de empezar a gestionar riesgos formalmente.

**Cada punto no revisado** puede generar automáticamente:
- Un riesgo en el GEE (si no tenerlo resuelto puede afectar al proyecto)
- Una acción pendiente (algo que hay que hacer antes de empezar)
- Una dependencia (si requiere intervención de otro equipo)

## Transversal: Perfil del proyecto (META)

El multiplicador del proyecto (perfil bajo/medio/alto/crítico) se define al arrancar y pondera todos los riesgos automáticamente.

| Perfil | Multiplicador | Cuándo se usa |
|---|---|---|
| Perfil bajo | 10 | Proyectos internos, bajo riesgo, equipo experimentado |
| Perfil medio | 30 | Proyecto estándar con cliente, cierta incertidumbre |
| Perfil alto | 60 | Proyecto complejo, muchas dependencias, plazos ajustados |
| Perfil crítico | 100 | Proyecto estratégico, penalizaciones, alta visibilidad |

## Entradas del PM en cada paso

| Paso | Qué hace el PM |
|---|---|
| **Paso -1** | Recopila documentación, la pasa a la IA, revisa clasificaciones, hace entrevistas para resolver dudas |
| **Paso 0** | Entrevista al cliente, revisa requisitos generados, valida con el cliente |
| **GEE** | Define perfil del proyecto, revisa riesgos/dependencias/acciones, actualiza daily log |
| **Paso 2** | Valida épicas y roadmap con el cliente, prioriza backlog |
| **Paso 3** | Planning con el equipo, review con stakeholders, actualiza GEE continuamente |
