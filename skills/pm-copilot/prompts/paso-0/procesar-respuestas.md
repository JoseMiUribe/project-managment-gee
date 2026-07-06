# Prompt: Procesar respuestas del cliente — Paso 0

> **Nivel:** 🧠 Diseño — clasificar requisitos, inferir RNF implícitos y detectar incertidumbre requiere juicio. No delegar a modelo económico.

## Propósito

Convertir las respuestas en bruto del cliente (transcripción de entrevista, notas del PM, email, documento pegado) en los 4 artefactos estructurados del Paso 0: `peticiones-cliente.md`, `requisitos-funcionales.md`, `requisitos-nofuncionales.md` y `zonas-incertidumbre.md`.

Este es el paso que convierte una conversación desordenada en requisitos accionables. Sé exhaustivo: cada frase con contenido relevante del cliente debe acabar reflejada en algún artefacto. No resumas de más ni descartes matices por brevedad.

## Instrucciones para la IA

### a) Lee las respuestas en bruto sin filtrar

Lee el input completo (transcripción, notas, documento) de principio a fin antes de empezar a clasificar nada. No proceses frase por frase de forma aislada: el contexto de una respuesta anterior puede aclarar o contradecir una posterior. Si el cliente cambió de opinión durante la conversación, identifica cuál es la versión final y regístralo como zona de incertidumbre si no quedó explícitamente confirmada.

Si hay legacy (existe `output-paso-legacy/`), ten a mano el mapa del proyecto y el grafo/vectorial para poder detectar colisiones entre lo nuevo y lo existente durante la extracción.

### b) Extrae cada petición tal cual → `peticiones-cliente.md`

Antes de interpretar o clasificar nada, extrae **cada** petición, deseo, queja o comentario con contenido de negocio que haga el cliente, como item individual. No filtres, no agrupes, no valores todavía si es viable o si es funcional/no funcional. El objetivo es no perder información en esta fase.

Reglas:
- Un ID por petición: `PC-001`, `PC-002`, ... correlativos, sin reutilizar.
- Usa cita textual entre comillas si el input es una transcripción literal; si es una nota indirecta o un resumen del PM, usa un resumen fiel (sin inventar matices que no estén).
- Indica quién lo dijo si se sabe (rol o nombre: "Director", "Responsable IT", "Cliente" genérico si no hay más detalle).
- Si dos peticiones distintas están relacionadas o una matiza a otra (p.ej. el cliente pide algo y luego lo acota), regístralas como peticiones separadas y referencia la relación en una nota.
- Las peticiones ambiguas o contradictorias se registran igual (sin resolver la ambigüedad aquí); se resolverán en `zonas-incertidumbre.md`.

### c) Clasifica cada petición en Funcional o No Funcional

Para cada petición de `peticiones-cliente.md`, determina si genera un Requisito Funcional, un Requisito No Funcional, ambos, o ninguno (ruido a descartar, ver regla en el punto f).

**Para cada Requisito Funcional (`RF-XXX`):**

| Campo | Contenido |
|---|---|
| ID | `RF-001`, `RF-002`, ... correlativo |
| Descripción | Qué debe hacer el sistema, en lenguaje claro y verificable (evita "el sistema debe ser fácil de usar"; eso es RNF o ruido) |
| Actor/Rol | Quién ejecuta o se beneficia de la funcionalidad |
| Prioridad (MoSCoW) | Must / Should / Could / Won't — propuesta con criterio, ver guía abajo |
| Origen | ID(s) de petición(es) de origen (`PC-XXX`) |
| Dependencias | Otros RF de los que depende o que afecta, si los hay |

Criterio para proponer prioridad MoSCoW (propónla, no la dejes en blanco esperando al cliente):
- **Must**: sin esto el proyecto no cumple su objetivo declarado, o es requisito legal/contractual explícito.
- **Should**: importante para el valor esperado pero el sistema podría lanzarse sin ello con un workaround aceptable.
- **Could**: deseable, mejora la experiencia pero no bloquea el objetivo de negocio.
- **Won't** (en esta fase): el cliente lo mencionó pero él mismo lo sitúa fuera del alcance actual, o es claramente Fase 2.

Si el cliente ya dio una prioridad explícita, respétala y anota en una nota si tu criterio MoSCoW discreparía y por qué (no la sobrescribas sin decirlo).

**Para cada Requisito No Funcional (`RNF-XXX`):**

| Campo | Contenido |
|---|---|
| ID | `RNF-001`, `RNF-002`, ... correlativo |
| Descripción | Atributo de calidad medible o verificable (evita vaguedad: "debe ser rápido" → "tiempo de respuesta < 2s en el 95% de las peticiones") |
| Categoría | Rendimiento / Seguridad / Disponibilidad / Normativa / Usabilidad / Mantenibilidad / Escalabilidad |
| Origen | Uno de: (1) "Explícito — PC-XXX" si el cliente lo pidió directamente; (2) "Derivado de RF-XXX" si surge de un requisito funcional concreto; (3) "Normativa/política — [nombre]" si viene de una ley o política mencionada; (4) "Implícito, no confirmado por el cliente" si la IA lo infirió sin que el cliente lo pidiera ni derive obviamente de un RF |
| Prioridad | Must / Should / Could / Won't, mismo criterio que RF |

**Regla obligatoria:** todo RNF marcado como "Implícito, no confirmado por el cliente" debe generar automáticamente una entrada correspondiente en `zonas-incertidumbre.md` para que el PM lo valide. No lo des por bueno solo porque parece sentido común — el cliente puede tener restricciones que lo invaliden (presupuesto, infraestructura existente, política interna).

### d) Descubre RNF implícitos activamente

No te limites a clasificar lo que el cliente dijo explícitamente. Para cada RF confirmado, pregúntate qué no-funcionales exige de forma razonable dado el dominio:
- ¿Maneja datos personales o de menores? → normativa (RGPD, LOPIVI, sectorial) y seguridad.
- ¿Hay múltiples roles con distintos permisos? → auditoría y control de acceso.
- ¿Hay volumen de usuarios o datos mencionado? → rendimiento y escalabilidad.
- ¿Se integra con sistemas externos? → disponibilidad de esos sistemas, manejo de fallos, formatos de intercambio.
- ¿Se usa en dispositivos concretos (tablets, móvil)? → usabilidad/responsive.
- ¿El sistema es crítico para una operación diaria del cliente? → disponibilidad y recuperación ante fallos.

Cada uno de estos, si no fue mencionado explícitamente por el cliente, se registra como RNF con origen "Implícito, no confirmado por el cliente" + su correspondiente zona de incertidumbre.

### e) Detecta Zonas de Incertidumbre (`ZI-XXX`)

Recorre todo lo procesado (peticiones, RF, RNF) buscando:
- Puntos donde el cliente fue ambiguo o impreciso.
- Contradicciones entre distintas partes de la conversación.
- Decisiones que el cliente explícitamente dejó pendientes ("eso lo vemos más adelante", "no lo hemos decidido").
- Cualquier RF o RNF donde la IA tuvo que asumir algo para poder clasificarlo o priorizarlo.
- Todo RNF marcado como "Implícito, no confirmado por el cliente" (regla obligatoria del punto c).

Para cada zona:

| Campo | Contenido |
|---|---|
| ID | `ZI-001`, `ZI-002`, ... correlativo |
| Descripción | Qué es lo incierto, en términos concretos |
| Por qué es incierto | Ambigüedad / Contradicción / Decisión pendiente / Asunción de la IA |
| Afecta a | RF-XXX y/o RNF-XXX relacionados |
| Pregunta para resolverlo | Formulada de forma que el PM pueda planteársela directamente al cliente, cerrada o acotada quien pueda responderse rápido |
| Recomendación por defecto (80/20) | Si el cliente no puede responder de inmediato, qué asunción tomar para no bloquear el avance, y el riesgo de esa asunción |

### f) Reglas explícitas: RF vs RNF vs ruido

**Es Requisito Funcional** si describe una capacidad, acción o comportamiento del sistema: "el sistema debe permitir...", "el usuario puede...", una regla de negocio, un flujo, una validación, un permiso.

**Es Requisito No Funcional** si describe una cualidad o restricción sobre cómo el sistema hace lo que hace, no qué hace: rendimiento, seguridad, disponibilidad, escalabilidad, cumplimiento normativo, usabilidad, mantenibilidad. Regla rápida: si se puede medir con una métrica de calidad (tiempo, %, SLA, nivel de cifrado) y no cambia "lo que el sistema hace" sino "cómo de bien lo hace", es RNF.

**Es ruido a descartar** (no genera RF ni RNF, pero se puede dejar anotado en `peticiones-cliente.md` con una nota indicando por qué se descartó):
- Comentarios de contexto sin acción asociada ("antes usábamos Excel para esto").
- Quejas sobre el sistema legacy que no se traducen en una petición concreta sobre lo nuevo.
- Divagaciones o ejemplos ilustrativos que no añaden un requisito nuevo a lo ya capturado.
- Opiniones personales sin relación con alcance, función o calidad del sistema.

Ante la duda entre descartar y registrar como zona de incertidumbre: si hay la más mínima posibilidad de que sea relevante, regístralo como zona de incertidumbre en lugar de descartarlo. El coste de preguntar de más es bajo; el de perder un requisito es alto.

### g) Formato de salida de los 4 archivos

**`peticiones-cliente.md`**

```markdown
# Peticiones del Cliente — [Proyecto] (en bruto)

**Origen:** [fuente: entrevista del DD/MM/AAAA, notas, email...]
**Estado:** Sin clasificar, listado directo de todo lo que pidió/dijo el cliente

## Peticiones del cliente

| ID | Petición | Lo dijo el cliente | Prioridad subjetiva |
|---|---|---|---|
| PC-001 | ... | "cita textual o resumen fiel" | Alta/Media/Baja |

## Notas adicionales

- [Ruido descartado, con motivo]
- [Observaciones transversales que no son peticiones individuales]
```

**`requisitos-funcionales.md`**

```markdown
# Requisitos Funcionales — [Proyecto]

**Origen:** [fuente y fecha]
**Basado en:** peticiones-cliente.md

## Requisitos funcionales

| ID | Módulo/Área | Descripción | Actor/Rol | Prioridad (MoSCoW) | Origen | Dependencias |
|---|---|---|---|---|---|---|
| RF-001 | ... | ... | ... | Must/Should/Could/Won't | PC-XXX | RF-XXX o "—" |

## Reglas de negocio detectadas

| ID | Regla | Afecta a |
|---|---|---|
| BR-01 | ... | RF-XXX |
```

Si el proyecto tiene legacy con RFs previos numerados, no reutilices sus IDs: continúa la numeración y usa una sección "Nuevos requisitos funcionales" y otra "Modificaciones a RFs existentes" (con `RF-XXX MOD`, RF original, cambio, motivo), igual que se hizo en el caso de referencia `caso-prueba-E-T`.

**`requisitos-nofuncionales.md`**

```markdown
# Requisitos No Funcionales — [Proyecto]

**Origen:** [fuente y fecha]
**Basado en:** requisitos-funcionales.md + peticiones-cliente.md + inferencia de RNF implícitos

## Requisitos no funcionales

| ID | Descripción | Categoría | Origen | Prioridad (MoSCoW) |
|---|---|---|---|---|
| RNF-001 | ... | Rendimiento/Seguridad/Disponibilidad/Normativa/Usabilidad/Mantenibilidad/Escalabilidad | Explícito - PC-XXX / Derivado de RF-XXX / Normativa - [nombre] / Implícito, no confirmado por el cliente | Must/Should/Could/Won't |
```

**`zonas-incertidumbre.md`**

```markdown
# Zonas de Incertidumbre — [Proyecto]

**Origen:** [fuente y fecha]
**Propósito:** Identificar lo que el cliente no sabe, no ha detallado o ha dejado ambiguo, y las asunciones que la IA tuvo que tomar.

## Zonas identificadas

| ID | Zona | Descripción | Por qué es incierto | Afecta a | Pregunta para resolverlo | Recomendación por defecto (80/20) |
|---|---|---|---|---|---|---|
| ZI-001 | ... | ... | Ambigüedad/Contradicción/Decisión pendiente/Asunción IA | RF-XXX / RNF-XXX | ... | ... |

## Resumen

| Tipo | Cantidad |
|---|---|
| Zonas que requieren decisión del cliente | N |
| Zonas que requieren especificación técnica | N |
| Zonas que requieren definición de procesos | N |
```

### h) Validación final con el usuario (PM)

Antes de dar por cerrado el paso, presenta al PM un resumen cuantitativo y pregunta explícitamente si falta algo:

```
Resumen del procesamiento:
- X peticiones registradas (peticiones-cliente.md)
- Y requisitos funcionales (Must: _, Should: _, Could: _, Won't: _)
- Z requisitos no funcionales (de los cuales _ son implícitos, no confirmados por el cliente)
- W zonas de incertidumbre (_ requieren decisión del cliente, _ especificación técnica, _ definición de procesos)

¿Falta alguna petición del cliente que no quedó registrada? ¿Hay alguna prioridad MoSCoW con la
que no estés de acuerdo? ¿Quieres que profundice en alguna zona de incertidumbre antes de
cerrar el paso?
```

No avances al siguiente paso (GEE / riesgos) sin la confirmación del PM.

## Pasos de ejecución

1. Lee el input completo del cliente sin filtrar (punto a).
2. Genera `peticiones-cliente.md` extrayendo cada petición como item individual (punto b).
3. Clasifica cada petición en RF y/o RNF, proponiendo prioridad MoSCoW (punto c).
4. Recorre los RF confirmados buscando RNF implícitos no mencionados por el cliente (punto d) y márcalos como tal.
5. Construye `zonas-incertidumbre.md` recorriendo ambigüedades, contradicciones, decisiones pendientes y asunciones de la IA, incluyendo obligatoriamente todos los RNF implícitos (punto e).
6. Aplica las reglas de RF vs RNF vs ruido de forma consistente en todo el documento (punto f).
7. Da formato final a los 4 archivos exactamente como se especifica (punto g).
8. Guarda los 4 archivos en `investigar/[proyecto]/output-paso-0/`:
   - `peticiones-cliente.md`
   - `requisitos-funcionales.md`
   - `requisitos-nofuncionales.md`
   - `zonas-incertidumbre.md`
9. Presenta el resumen cuantitativo al PM y espera confirmación antes de cerrar el paso (punto h).

## Input del usuario

[El usuario pega o adjunta las respuestas del cliente: transcripción de entrevista, notas del PM, email, o documento de respuestas al cuestionario combinado/estándar del Paso 0]

## Output esperado

Los 4 artefactos (`peticiones-cliente.md`, `requisitos-funcionales.md`, `requisitos-nofuncionales.md`, `zonas-incertidumbre.md`) completos y estructurados en `investigar/[proyecto]/output-paso-0/`, más el resumen cuantitativo de validación presentado al PM.
