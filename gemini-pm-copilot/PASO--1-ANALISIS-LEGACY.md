# PASO -1: ANALISIS DE LEGACY

SOLO EJECUTA ESTE PASO SI el usuario tiene documentos existentes (PDFs, Word, URLs, capturas de pantalla, código).

Si NO hay documentos previos, SALTEA este paso.

---

## SUBPASO 1: CLASIFICAR FUENTES

Pide al usuario que pegue TODA la documentación que tenga en 00-documento-original.md.

Una vez que el usuario confirme que está todo ahí, LEE el archivo 00-documento-original.md.

Clasifica cada documento o fuente con un código:
- F-001: [nombre del documento 1]
- F-002: [nombre del documento 2]
- etc.

## SUBPASO 2: ANALIZAR CADA FUENTE

Para cada fuente (F-001, F-002...), clasifícala como:

✅ CLARO = la información es clara y se entiende
⚠️ CONTRADICTORIO = hay información que se contradice entre documentos
❓ AMBIGUO = la información no es clara, puede interpretarse de varias formas
🔲 INEXISTENTE = falta información importante

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso--1/analisis-fuentes.md con este contenido:"

Muestra el contenido completo con la tabla de clasificación.

Ejemplo de tabla:
| Fuente | Tipo | Contenido principal | Clasificacion |
|--------|------|-------------------|---------------|
| F-001 | PDF pliego | Requisitos tecnico | CLARO |
| F-002 | Correo cliente | Fechas previstas | CONTRADICTORIO |

## SUBPASO 3: GENERAR CUESTIONARIOS

Basado en lo que está AMBIGUO, CONTRADICTORIO o INEXISTENTE, prepara preguntas para el usuario.

Dos tipos de preguntas:

A) PREGUNTAS DE NEGOCIO (para entender el negocio)
- "¿Quién usa el sistema?"
- "¿Qué problema resuelve?"
- "¿Cuántos usuarios tendrá?"

B) PREGUNTAS TECNICAS (para entender la tecnología)
- "¿Qué tecnología usa?"
- "¿Hay que integrarse con otros sistemas?"
- "¿Hay base de datos existente?"

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso--1/cuestionarios.md con este contenido:"

Muestra el contenido completo.

## SUBPASO 4: INCORPORAR RESPUESTAS

Cuando el usuario responda las preguntas, actualiza la información.

Di al usuario: "Actualiza el archivo investigar/[proyecto]/00-documento-original.md añadiendo estas respuestas al final."

## SUBPASO 5: DOCUMENTACION CONSOLIDADA

Crea un resumen de TODO lo aprendido.

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso--1/resumen-legacy.md con este contenido:"

Muestra el contenido completo. Debe incluir:
- Fuentes analizadas
- Puntos claros
- Puntos ambiguos (por resolver)
- Contradicciones encontradas
- Informacion que falta

## FIN DEL PASO

Di: "Hemos terminado el Analisis de Legacy. Ahora sabemos que documentos existen, que esta claro y que falta por aclarar."

Pregunta: "¿Quieres continuar con la Captura de Requisitos (Paso 0)?"
