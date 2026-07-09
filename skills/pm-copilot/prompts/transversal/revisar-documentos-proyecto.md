# Prompt: Revisar Documentos Nuevos del Proyecto

> **Nivel:** 🧠 Diseño — detectar qué cambió es mecánico, pero valorar el impacto de cada documento sobre lo ya cerrado requiere criterio. Ejecuta en el modelo principal.

## Propósito

Durante la vida del proyecto, el cliente, el equipo u otros roles van dejando documentación en `documentos-proyecto/` — nueva de verdad, o antigua pero descubierta/entregada ya avanzado el proyecto. Este prompt la detecta, la clasifica, valora si afecta a algo ya cerrado del pipeline, y te deja decidir si se incorpora ahora o se aplaza — nunca decide por su cuenta.

**Esto es distinto del inventario del Paso Legacy** (`output-paso-legacy/inventario-fuentes.md`, foto única al arrancar el proyecto, IDs `F-XXX`). Este prompt cubre todo lo que aparece **durante** el proyecto, con su propia numeración (`FD-XXX`, Fuente Durante-proyecto) y su propio archivo, para que quede organizado qué había antes de empezar y qué fue apareciendo después.

## Cuándo se ejecuta

**Solo cuando el PM lo pida explícitamente** (ej. "revisa la carpeta de documentos", "he añadido algo nuevo, échale un vistazo"). No se ejecuta automáticamente al arrancar una sesión — sería ruido si no hay nada nuevo la mayoría de las veces.

## Procedimiento

### 1. Detecta qué es nuevo o ha cambiado

Lista los archivos en `investigar/[proyecto]/documentos-proyecto/` y compáralos contra `inventario-documentos-proyecto.md` (plantilla en `templates/transversal/inventario-documentos-proyecto.md`):
- Archivo sin entrada todavía → nuevo.
- Archivo con entrada pero con fecha de modificación más reciente que la registrada en "Última revisión" → cambiado, hay que re-analizarlo.
- Archivo ya registrado sin cambios → ignóralo, no lo vuelvas a leer ni a resumir. Esto es lo que permite que "leer solo lo que cambió" sea real y no un reprocesado completo cada vez.

### 2. Clasifica cada documento nuevo/cambiado

Para cada uno, con el mismo criterio que `subpaso-1-recogida.md` del Paso Legacy: tipo de documento, fecha/autor si se puede determinar, resumen de 2-3 líneas, nivel de fiabilidad (Alta/Media/Baja/No determinable). Asigna un ID correlativo `FD-XXX`.

### 3. Analiza el impacto — sin decidir nada todavía

Para cada documento, determina si su contenido afecta a algo ya cerrado del pipeline: requisitos (Paso 0), riesgos/dependencias (Paso 1), épicas/roadmap/capacidad (Paso 2), historias ya generadas o validadas (Paso 3), o nada de lo anterior (puede ser puramente informativo, o relevante solo para un paso que todavía no se ha cerrado).

Si detectas impacto, sé concreto: qué artefacto exacto se vería afectado y cómo (ej. "contradice RNF-003", "introduce una nueva dependencia con el proveedor X no registrada en `registro-dependencias.md`", "el alcance descrito ya no coincide con EP-002"). No hables en abstracto ("podría afectar a varias cosas") si puedes ser específico.

Si no hay impacto en nada cerrado, dilo también explícitamente — no todo documento nuevo tiene que mover algo.

### 4. Presenta cada documento al PM y pide autorización

Por cada `FD-XXX`, muestra: resumen, nivel de fiabilidad, y el análisis de impacto. Pregunta explícitamente: **"¿quieres que lo tenga en cuenta ahora, o lo omito hasta que pidas otra revisión?"**

- **Si dice que sí:** para cada artefacto afectado, ejecuta `prompts/transversal/actualizar-cascada.md` (si afecta a un paso ya cerrado) o simplemente incorpóralo si afecta a un paso todavía abierto. Marca la entrada como `✅ Incorporado` con la fecha.
- **Si dice que lo omite:** marca la entrada como `⏸️ Omitido temporalmente` — **no lo borres ni lo dejes de mencionar en la próxima revisión**. La siguiente vez que se ejecute este prompt, cualquier `FD-XXX` en estado `⏸️ Omitido temporalmente` se vuelve a presentar (sin re-analizar desde cero, ya tienes el resumen e impacto guardados) hasta que el PM decida incorporarlo o lo descarte explícitamente.
- **Si el PM decide que no es relevante en absoluto:** marca como `❌ Descartado`, con el motivo. No se vuelve a presentar.

### 5. Actualiza el inventario

`inventario-documentos-proyecto.md` es acumulativo — nunca se sobrescribe ni se pierde una entrada anterior, igual que el resto de registros históricos del sistema (capacidad, prioridad del backlog). Cada ejecución de este prompt añade o actualiza entradas, nunca reconstruye el archivo desde cero.

## Reglas

- Nunca decidas tú si algo se incorpora — siempre es autorización explícita del PM, documento por documento.
- Nunca reproceses un documento ya registrado sin cambios — es lo que hace viable revisar la carpeta muchas veces sin coste creciente.
- Si un documento aplazado sigue sin decisión después de varias revisiones, no dejes de mencionarlo — igual de visible la primera vez que la quinta.
- No mezcles esto con `inventario-fuentes.md` del Paso Legacy — son historiales distintos con propósitos distintos (foto de arranque vs. flujo continuo).

## Output

`investigar/[proyecto]/inventario-documentos-proyecto.md` actualizado, y cualquier artefacto que se haya regenerado por autorización del PM vía `actualizar-cascada.md`.
