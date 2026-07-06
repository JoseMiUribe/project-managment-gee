# Prompt: Definición de DoR y DoD del proyecto

> **Nivel:** 🧠 Diseño — definir criterios de calidad del proyecto es una decisión con trade-offs reales (velocidad vs calidad). Ejecuta en el modelo principal.

**Propósito:** Definir la Definition of Ready y Definition of Done del proyecto, personalizadas para el equipo y el contexto. Se ejecuta después de tener las épicas (`epicas.md`) y antes de calcular la capacidad del equipo, porque el DoD impacta directamente en el esfuerzo por HU y por tanto en la velocidad efectiva.

## Instrucciones para la IA

### Fase 1: Elegir modo de entrada

Pregunta al PM cómo quiere definir DoR y DoD:

1. **Cuestionario guiado**: "Te hago preguntas sobre qué condiciones debe cumplir una HU para empezar (DoR) y para darla por terminada (DoD). Respondes lo que sepas."
2. **Plantilla**: "Te paso una plantilla base para que la rellenes con tu equipo y me la devolváis."
3. **Mixto**: "Respondemos algunas ahora y otras las completáis después con el equipo."

### Fase 2a: Cuestionario guiado (DoR)

Pregunta por cada criterio DoR:

**Criterios básicos:**
- "¿La HU necesita una descripción con formato 'Como... quiero... para...' o vale cualquier descripción clara?"
- "¿Hacen falta criterios de aceptación en formato Dado/Cuando/Entonces? ¿O vale con una descripción funcional?"
- "¿Quién valida que la HU está lista para empezar? ¿El PO, el equipo, el PM?"

**Criterios de dependencias:**
- "¿Una HU puede empezar aunque tenga dependencias externas sin resolver? ¿O hay que resolverlas antes?"
- "¿Qué pasa si una HU depende de otro equipo o de un proveedor externo?"

**Criterios de tamaño:**
- "¿Hay un tamaño máximo por HU? (Ej: no más de 3 días, no más de 8 puntos...)"
- "¿Las HU muy grandes se parten en trozos más pequeños antes de entrar al sprint?"

**Criterios técnicos:**
- "¿Hacen falta diseños/mockups aprobados antes de empezar una HU con componente visual?"
- "¿Necesitáis tener los datos de prueba disponibles antes de empezar?"
- "¿Las HU requieren estimación de tamaño (puntos, tallas...) antes de entrar?"

**Criterios de riesgo:**
- "¿Hay que identificar los riesgos de cada HU antes de empezar? ¿O se descubren durante el sprint?"
- "Si una HU tiene un riesgo alto conocido, ¿se puede llevar igual al sprint o necesita mitigación previa?"

### Fase 2b: Cuestionario guiado (DoD)

Pregunta por cada criterio DoD:

**Criterios de calidad:**
- "¿Qué cobertura de tests necesitáis para dar una HU por terminada? ¿Unitaria? ¿Integración? ¿E2E?"
- "¿Cuánto es el mínimo aceptable? (Ej: 70%, 80%...)"

**Criterios de revisión:**
- "¿El código necesita code review? ¿De cuántas personas?"
- "¿Quién valida la HU al final? ¿El PO solo o también el equipo?"

**Criterios de documentación:**
- "¿Hay que documentar cada HU? ¿Dónde? ¿En el código, en Confluence, en el README?"
- "¿Qué documentación es obligatoria y cuál opcional?"

**Criterios de despliegue:**
- "¿La HU tiene que estar desplegada en algún entorno para darla por terminada? ¿Cuál?"
- "¿Hay que hacer pruebas de regresión antes de cerrar?"

**Criterios de seguridad/monitoreo:**
- "¿Hay requisitos de seguridad? (logs de auditoría, validación de permisos, protección de datos...)"
- "¿Necesitáis monitoreo o alertas configuradas para cada HU?"
- "¿Hay requisitos de rendimiento? (tiempos de respuesta, carga...)"

**Criterios de accesibilidad:**
- "¿El proyecto requiere accesibilidad WCAG? ¿Qué nivel? (A, AA, AAA)"
- "¿Validáis accesibilidad en cada HU o solo en las que tienen componente visual?"

### Fase 3: Generar documentos

Con las respuestas, genera:
1. `investigar/[proyecto]/output-paso-2/config/dor-definition.md` con los criterios acordados
2. `investigar/[proyecto]/output-paso-2/config/dod-definition.md` con los criterios acordados

Usa los templates base de `templates/paso-3/` (DoR/DoD genéricos del Paso 3) como estructura de partida, pero personaliza cada criterio según las respuestas obtenidas aquí. No dejes criterios genéricos sin adaptar al proyecto: cada fila de la tabla debe reflejar una decisión real tomada con el PM, no el placeholder de la plantilla.

### Fase 4: Explicar impacto en roadmap

Cierra siempre con esta explicación, adaptando los corchetes al DoD acordado:

"Con este DoD, cada HU requiere [X] esfuerzo adicional en tests/documentación/seguridad. Esto afecta a la velocidad real del equipo. Lo tendré en cuenta al calcular la capacidad."

Factores de impacto del DoD en la capacidad (tabla de referencia — el cálculo real lo aplica `procesar-capacidad.md`):

| Si el DoD incluye | Factor de ajuste (sobre velocidad nominal) |
|---|---|
| Solo tests unitarios | -10% |
| Tests unitarios + integración | -20% |
| Tests + documentación obligatoria | -25% |
| Tests + doc + seguridad/monitoreo | -30% |
| Tests + doc + seguridad + accesibilidad WCAG AA | -35% |
| Todo lo anterior + E2E + regresión completa | -40% |

Estos son valores de referencia acumulativos: quédate con el escalón más alto que aplique según lo que el DoD exija realmente, no sumes varios escalones. `procesar-capacidad.md` es quien decide el factor final leyendo `dod-definition.md`, este prompt solo anticipa el orden de magnitud para que el PM entienda el trade-off al decidir el DoD.

### Modo Plantilla

Si el PM elige plantilla, entrégale los templates base:
- `templates/paso-3/dor-definition.md`
- `templates/paso-3/dod-definition.md`

Indica: "Rellena esto con tu equipo y devuélvemelo. Cuando lo tenga, genero los documentos de capacidad y roadmap."

### Modo Mixto

Pregunta: "¿Qué parte prefieres hacer ahora conmigo (DoR, DoD, o partes de cada uno) y qué parte te llevas en plantilla?"

## Siguiente paso

Con `dor-definition.md` y `dod-definition.md` cerrados, continúa con `cuestionario-capacidad.md` — el factor DoD calculado aquí es uno de los inputs obligatorios de `procesar-capacidad.md`.
