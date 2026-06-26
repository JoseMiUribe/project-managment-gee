# Paso -1: Análisis de Legacy

## Propósito
Analizar proyectos existentes con documentación caótica (desfasada, contradictoria, escasa o nula) para producir:
- Un mapa estructurado del proyecto existente
- Una guía priorizada para el Paso 0 (captura de requisitos de lo nuevo)
- Poblado inicial de las bases de datos grafo + vectorial

## Pipeline

### Sub-paso 1: Recogida de fuentes
- **Input**: Archivos que el usuario proporciona (PDFs, Word, presentaciones, código fuente, URLs, capturas de pantalla)
- **Proceso**: La IA clasifica cada fuente, extrae metadata, genera resumen ejecutivo
- **Output**: `inventario-fuentes.md`

### Sub-paso 2: Análisis y clasificación
- **Input**: inventario-fuentes.md + contexto del proyecto
- **Proceso**: La IA cruza fuentes, detecta contradicciones, marca ambigüedades, identifica silencios
- **Output**: `mapa-proyecto.md` con 4 categorías: ✅ Claro / ⚠️ Contradictorio / ❓ Ambigüo / 🔲 Inexistente

### Sub-paso 3: Guía de entrevista (para resolver dudas del legacy)
- **Input**: mapa-proyecto.md
- **Proceso**: La IA genera cuestionarios para resolver items ambiguos/contradictorios/inexistentes
- **Output**: `cuestionarios.md` (perfil negocio + perfil técnico)

### Sub-paso 3b: Filtro para Paso 0 (NUEVO)
- **Input**: mapa-proyecto.md + visión del proyecto nuevo
- **Proceso**: La IA filtra qué aspectos del legacy impactan en lo nuevo y los prioriza
- **Output**: `guia-paso-0.md` con contradicciones, ambigüedades, lagunas, riesgos y dependencias priorizados

### Sub-paso 4: Incorporar feedback
- **Input**: Notas/resumen del usuario tras la entrevista
- **Proceso**: La IA actualiza el mapa con la nueva información
- **Output**: `mapa-proyecto-v2.md`

### Sub-paso 5: Documentación estable
- **Input**: mapa-proyecto-v2.md + fuentes originales
- **Proceso**: La IA redacta documentación consolidada
- **Output**: `documentacion-proyecto.md` con visión general, arquitectura, glosario, ADRs, estado de componentes

### Sub-paso 6: Poblado de bases de datos (futuro)
- **Input**: Todos los artefactos anteriores
- **Proceso**: Se extraen entidades y relaciones para poblar el grafo y se indexan documentos en la vectorial
- **Output**: Grafo poblado + documentos vectorizados

## Salidas del Paso -1

| Artefacto | Propósito | Lo consume |
|---|---|---|
| inventario-fuentes.md | Inventario clasificado de fuentes | Sub-paso 2 |
| mapa-proyecto.md | Análisis ✅⚠️❓🔲 del proyecto | Sub-paso 3, 3b, 4, 5 |
| cuestionarios.md | Preguntas para entrevista | El PM (para resolver dudas) |
| **guia-paso-0.md** | **Filtro priorizado para lo nuevo** | **Paso 0** |
| mapa-proyecto-v2.md | Mapa actualizado post-entrevista | Sub-paso 5, 6 |
| documentacion-proyecto.md | Documentación estable del legacy | Consulta transversal |

## Principios
- Pipeline desacoplado: cada sub-paso produce un artefacto markdown estándar
- El filtro (sub-paso 3b) decide QUÉ del legacy impacta en lo nuevo
- La guia-paso-0.md es la conexión directa con el Paso 0
- Opcionalmente, los artefactos pueblan las bases de datos grafo + vectorial para consultas avanzadas
