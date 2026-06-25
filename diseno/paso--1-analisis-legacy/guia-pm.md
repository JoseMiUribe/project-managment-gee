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
