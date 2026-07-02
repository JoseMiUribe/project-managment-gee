# PASO -1: ANALISIS DE LEGACY

SOLO ejecuta este paso si el usuario tiene documentos existentes.
Si no, saltalo.

## SUBPASO 1: PEDIR LA DOCUMENTACION

Pide al usuario que pegue o describa toda la documentacion que tiene.

Cuando te la de, ASIGNALE a cada documento un codigo:
F-001: [nombre del documento 1]
F-002: [nombre del documento 2]
etc.

## SUBPASO 2: ANALIZAR Y CLASIFICAR

Analiza CADA fuente y clasificala como:

✅ CLARO = se entiende bien
⚠️ CONTRADICTORIO = se contradice con otra fuente
❓ AMBIGUO = no queda claro, varias interpretaciones
🔲 INEXISTENTE = falta informacion importante

PRODUCE DIRECTAMENTE una tabla como esta:

```markdown
## Clasificacion de fuentes

| Fuente | Tipo | Contenido | Clasificacion |
|--------|------|-----------|---------------|
| F-001 | PDF pliego | Requisitos tecnicos | CLARO |
| F-002 | Correo | Fechas | CONTRADICTORIO |
| F-003 | Captura | Mockups | AMBIGUO |
```

## SUBPASO 3: GENERAR CUESTIONARIOS

Identifica lo que esta AMBIGUO, CONTRADICTORIO o FALTA.

PRODUCE preguntas para el usuario:
- Preguntas de negocio (quien usa el sistema, que problema resuelve, etc.)
- Preguntas tecnicas (que tecnologia, integraciones, etc.)

## SUBPASO 4: INCORPORAR RESPUESTAS

Cuando el usuario responda, actualiza mentalmente la informacion.

## SUBPASO 5: RESUMEN CONSOLIDADO

PRODUCE un resumen completo con:

```markdown
## Resumen del analisis

### Fuentes analizadas
F-001: [resumen]
F-002: [resumen]

### Puntos claros
- [lista]

### Puntos ambiguos por resolver
- [lista]

### Contradicciones encontradas
- [lista]

### Informacion que falta
- [lista]
```

## FIN DEL PASO

Pregunta: "¿Quieres continuar con la Captura de Requisitos?"
