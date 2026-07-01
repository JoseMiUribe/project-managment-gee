# Paso 0: Captura de Requisitos

## Propósito
Capturar, clasificar y validar los requisitos funcionales y no funcionales de lo NUEVO que el cliente quiere construir.

## Dos escenarios de entrada

### Escenario A: Proyecto nuevo (sin legacy)
- **Input**: Solo el cliente (entrevista directa)
- **Guía**: `guia-estandar-paso-0.md` (cuestionario genérico)
- **Proceso**: Entrevistas al cliente, capturas qué quiere

### Escenario B: Proyecto con legacy
- **Input**: Cliente + `guia-paso-0.md` (del Paso -1) + grafo/vectorial poblado
- **Guía**: `guia-estandar-paso-0.md` + `guia-paso-0.md` = **cuestionario combinado**
- **Proceso**:
  1. Resolver contradicciones del legacy con el cliente
  2. Capturar requisitos nuevos
  3. La IA cruza lo nuevo contra el grafo/vectorial para validar coherencia

## Pipeline

### Sub-paso 0.1: Análisis del input
- **Input**: Notas/email/transcripción de la reunión con el cliente
- **Proceso**: La IA extrae cada petición como un item individual
- **Output**: `peticiones-cliente.md`
- **Si hay legacy**: Además consulta el grafo para ver si lo nuevo colisiona con algo existente

### Sub-paso 0.2: Clasificación funcional vs no funcional
- **Input**: peticiones-cliente.md
- **Proceso**: La IA clasifica cada item
- **Output**:
  - `requisitos-funcionales.md` (capacidades del sistema, reglas de negocio)
  - `requisitos-nofuncionales.md` (rendimiento, seguridad, escalabilidad, compliance)

### Sub-paso 0.3: Descubrimiento de no funcionales implícitos
- **Input**: requisitos-funcionales.md
- **Proceso**: La IA añade no funcionales derivados de los funcionales, políticas de la compañía y estándares del sector
- **Output**: requisitos-nofuncionales.md actualizado (con origen marcado)

### Sub-paso 0.4: Zonas de incertidumbre
- **Input**: Todos los requisitos
- **Proceso**: La IA identifica lo que el cliente no sabe, no ha detallado o ha dejado ambiguo
- **Output**: `zonas-incertidumbre.md`

### Sub-paso 0.5: Validación con el cliente
- Adaptador de salida genera documento presentable
- El PM lo revisa con el cliente
- La IA incorpora correcciones

## Output consolidado

| Artefacto | Descripción |
|---|---|
| peticiones-cliente.md | Lista inicial de deseos del cliente |
| requisitos-funcionales.md | Funcionales priorizados |
| requisitos-nofuncionales.md | No funcionales con origen |
| zonas-incertidumbre.md | Riesgos asociados a lo desconocido |

## Actualizar documento oficial del proyecto

Al finalizar el paso, actualiza `investigar/[proyecto]/documentacion-proyecto.md`:
- **Requisitos**: poblar tabla de funcionales y no funcionales con su estado
- **Zonas de incertidumbre**: añadir tabla con aspectos inciertos y plan para resolverlos
- **Alcance**: refinar in-scope / out-scope si el cliente lo aclaró
- **Anexos**: añadir referencia a los artefactos de este paso

## Conexiones con otros pasos

### Hacia GEE (Paso 1)
Las zonas de incertidumbre y los requisitos generan automáticamente:
- **Riesgos iniciales**: cada zona de incertidumbre puede materializarse en un riesgo
- **Dependencias iniciales**: cada integración con otros sistemas es una dependencia potencial

### Hacia Roadmap (Paso 2)
Los requisitos funcionales se agrupan en épicas/entregables para el roadmap.

### Hacia el grafo
Los requisitos se añaden como nodos en el grafo, vinculados a los componentes del legacy que afectan.
