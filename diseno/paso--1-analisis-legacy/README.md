# Paso -1: Análisis de Legacy

## Propósito
Analizar proyectos existentes con documentación caótica (desfasada, contradictoria, escasa o nula) para producir un mapa estructurado y documentación estable del proyecto.

## Pipeline

### Sub-paso 1: Recogida de fuentes
- **Input**: Archivos que el usuario proporciona (PDFs, Word, presentaciones, código fuente, URLs de documentación interna, capturas de pantalla)
- **Proceso**: La IA clasifica cada fuente, extrae metadata, genera resumen ejecutivo
- **Output**: `inventario-fuentes.md`
  - Columnas: Fuente, Tipo, Formato, Fecha, Autor, Resumen (2 líneas), ¿Fiable? (Sí/No/Dudoso)

### Sub-paso 2: Análisis y clasificación
- **Input**: inventario-fuentes.md
- **Proceso**: La IA cruza fuentes, detecta contradicciones, marca ambigüedades, identifica silencios
- **Output**: `mapa-proyecto.md` con 4 categorías:
  1. ✅ **Claro**: Hechos confirmados
  2. ⚠️ **Contradictorio**: Fuentes dicen cosas distintas sobre lo mismo
  3. ❓ **Ambiguo**: Información vaga, incompleta, terminología no definida
  4. 🔲 **Inexistente**: Lagunas de información
- **Intervención del usuario**: Validar la clasificación (puede mover items entre categorías)

### Sub-paso 3: Guía de entrevista
- **Input**: mapa-proyecto.md
- **Proceso**: La IA genera cuestionarios para resolver items ambiguos/contradictorios/inexistentes
- **Output**: `cuestionarios.md`
  - **Perfil Negocio**: Lenguaje de negocio, qué hace el sistema, para quién, reglas de negocio
  - **Perfil Técnico**: Arquitectura, tecnologías, dependencias, deuda técnica, despliegue
- **Intervención del usuario**: Selecciona preguntas, adapta tono, decide orden

### Sub-paso 4: Incorporar feedback
- **Input**: Notas/resumen del usuario tras la entrevista
- **Proceso**: La IA coteja con el mapa anterior, produce versión actualizada
- **Output**: `mapa-proyecto-v2.md`
- **Intervención del usuario**: Transcribe o resume la reunión para la IA

### Sub-paso 5: Documentación estable
- **Input**: mapa-proyecto-v2.md + fuentes originales
- **Proceso**: La IA redacta documentación consolidada
- **Output**: `documentacion-proyecto.md`
  - Visión general (para negocio)
  - Arquitectura y componentes (para técnicos)
  - Glosario de términos
  - Estado real de cada componente (estable, legacy, en migración, desaparecido)
  - Decisiones técnicas (ADRs si aplica)
- **Formato**: Markdown estructurado, con adaptadores a Confluence, PDF, etc.
- **Intervención del usuario**: Revisa, corrige, aprueba

## Principios
- Pipeline desacoplado: cada sub-paso produce un artefacto markdown estándar
- El usuario decide destino del output (documento, Confluence, prompt para otra IA)
- El formato de salida se pregunta al usuario en cada ejecución

## Implementación

Este paso está implementado como un conjunto de prompts para Claude/Gemini y templates markdown.

### Archivos de implementación
- `prompts/`: Instrucciones para la IA en cada sub-paso
- `templates/`: Plantillas markdown para los artefactos de salida
- `guia-pm.md`: Guía procedural para el PM

### Cómo usar
1. Sigue la guia-pm.md paso a paso
2. Ejecuta los prompts en Claude/Gemini en orden
3. Guarda los outputs en los templates correspondientes
