# Prompt: Documento Oficial de Cierre de Fase 0

> **Nivel:** 🧠 Diseño — redactar un documento que el cliente va a firmar exige síntesis y criterio editorial, no es un volcado de tablas. Ejecuta en el modelo principal.

## Propósito

Producir un documento único, redactado en lenguaje claro y sin jerga interna, que recoja **todo lo acordado con el cliente antes de empezar a implementar**: qué se va a construir, qué requisitos no funcionales aplican, qué ha quedado explícitamente fuera de esta fase, y qué asunciones se han tomado sobre lo que quedó ambiguo. Es un artefacto de **cierre de hito**, pensado para que el cliente lo revise y dé su conformidad — no es un documento de trabajo que se reescribe constantemente (para eso ya existe `documentacion-proyecto.md`).

No confundas esto con el "informe de datos recolectados" que exporta el propio dashboard (pestaña Requisitos → PDF): aquel es un volcado mecánico de las tablas tal cual están; este documento es una **redacción** con criterio editorial, pensada para quien no ha seguido el proceso día a día.

## Cuándo se ejecuta

Solo cuando:
1. `output-paso-0/requisitos-funcionales.md`, `requisitos-nofuncionales.md` y `zonas-incertidumbre.md` existen y el PM los da por suficientemente maduros (no hace falta que estén "perfectos", pero sí validados con el 80/20 del propio sistema).
2. Cada zona de incertidumbre (`ZI-XXX`) está en uno de estos dos estados: **resuelta** (el cliente respondió) o **aceptada con asunción** (el PM decide seguir con la recomendación por defecto y lo deja explícito para que el cliente lo vea y pueda objetar antes de firmar). No generes el documento si hay zonas de incertidumbre sueltas sin ninguna de las dos cosas — pregúntale primero al PM qué hacer con ellas.

## Input

- `output-paso-legacy/mapa-proyecto-v2.md` (o `mapa-proyecto.md` si no hay legacy con entrevista) — para la sección de contexto/antecedentes, si el proyecto tiene legacy
- `output-paso-0/peticiones-cliente.md`, `requisitos-funcionales.md`, `requisitos-nofuncionales.md`, `zonas-incertidumbre.md`
- `output-paso-0/guia-combinada-entrevista.md` o equivalente, específicamente la sección "Visión futura / qué NO va en esta fase" — para la sección de alcance excluido
- `documentacion-proyecto.md` si ya tiene contenido relevante de visión de negocio

## Estructura del documento (usa esta plantilla como base: `templates/paso-0/documento-cierre-fase0.md`)

1. **Portada / resumen ejecutivo**: nombre del proyecto, fecha, una frase de qué es y para quién, y una tabla de control de versiones (v1, v2... si el documento se revisa tras feedback del cliente antes de firmar)
2. **Contexto** (solo si hay legacy): 2-3 párrafos de dónde viene el proyecto, qué existía antes, qué cambia. Nunca copies aquí el detalle técnico interno del `mapa-proyecto.md` (contradicciones, fuentes, etc.) — eso es trabajo interno, no le interesa al cliente. Sintetiza solo las conclusiones que le afectan.
3. **Objetivo y visión**: qué problema resuelve, para quién, qué valor aporta — en el lenguaje que usó el propio cliente en las peticiones, no en jerga técnica
4. **Alcance funcional de esta fase**: agrupa los RF en bloques temáticos con sentido de negocio (no expongas RF-001, RF-002... como una lista plana sin contexto — agrúpalos y nárralos, aunque cites el ID entre paréntesis para trazabilidad)
5. **Requisitos no funcionales relevantes para el cliente**: solo los que el cliente necesita conocer y aceptar (rendimiento, disponibilidad, normativa, seguridad) — omite los puramente técnicos internos (ej. detalles de arquitectura) que no cambian lo que el cliente está aprobando
6. **Fuera de alcance en esta fase**: explícito, en una lista clara, qué NO se va a construir ahora aunque se haya mencionado en las peticiones — esto evita el conflicto más común en consultoría ("yo pensaba que esto también entraba")
7. **Decisiones y asunciones**: cada zona de incertidumbre resuelta o aceptada con asunción, redactada como "Se asume que X. Si esto no es correcto, debe comunicarse antes de la firma de este documento, ya que puede afectar a plazo/coste." — nunca escondas una asunción entre líneas, este es precisamente el punto del documento
8. **Glosario** (si hay términos específicos del negocio del cliente que conviene dejar por escrito)
9. **Aprobación**: espacio para nombre, rol, fecha y firma (o visto bueno por email) de la parte cliente, y del responsable del proyecto por parte de la agencia

## Reglas de redacción

- Cero jerga interna: nada de RAG, GEE, Check Init, DoR/DoD, IDs de riesgo. Este documento habla de negocio y alcance, no de cómo se gestiona internamente.
- Cita los IDs (RF-XXX, RNF-XXX) entre paréntesis para trazabilidad hacia los artefactos internos, pero nunca como única forma de referirte a un requisito.
- Si algo en los requisitos es ambiguo y NO hay una decisión tomada todavía, no lo metas en el documento como si estuviera cerrado — para, y dile al PM que faltan decisiones antes de poder cerrar este documento (ver "Cuándo se ejecuta" arriba).
- Longitud: prioriza claridad sobre exhaustividad. Si un RF es autoexplicativo en una frase, no lo alargues. Si hace falta más detalle para que el cliente entienda el compromiso, no lo recortes por brevedad.

## Output

`investigar/[proyecto]/documento-cierre-fase0.md`. Si ya existe una versión previa (el cliente pidió cambios antes de firmar), no la sobrescribas sin más: incrementa la versión en la tabla de control de versiones de la portada y anota qué cambió respecto a la anterior.

## Después de generarlo

1. Muestra un resumen al PM (cuántos RF, cuántos RNF, cuántas asunciones explícitas) y pide su validación antes de considerarlo listo para enviar al cliente.
2. Una vez validado, puede exportarse a PDF desde el dashboard del proyecto: `POST /api/pdf/documento` con `{ "ruta": "documento-cierre-fase0.md" }` (o el botón equivalente en la interfaz), que genera `documento-cierre-fase0.pdf` en la raíz del proyecto.
3. Si el cliente pide cambios tras revisarlo, vuelve a este mismo prompt — no edites el documento a mano fuera de este flujo, para no perder la trazabilidad de versión.
