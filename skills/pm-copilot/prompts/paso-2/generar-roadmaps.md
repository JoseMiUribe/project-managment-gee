# Prompt: Generar Roadmaps (Cliente + Técnico)

> **Nivel:** 🧠 Diseño — decidir cómo comunicar incertidumbre y trade-offs de fechas a distintas audiencias requiere criterio. Ejecuta en el modelo principal.

**Este prompt SIEMPRE produce dos archivos distintos. Nunca combines ambas vistas en un solo documento, aunque el contenido se solape: la audiencia y el nivel de detalle son distintos.**

Esta separación no es opcional ni una preferencia de formato: es la causa raíz de un fallo ya observado en producción, donde generar un único `roadmap.md` mezclando sprints técnicos, deadlines de dependencias internas y lenguaje de negocio produjo un documento inadecuado para ambas audiencias a la vez (demasiado técnico para el cliente, demasiado vago en fechas concretas para el equipo). Si en algún momento sientes la tentación de "ahorrar duplicación" fusionando ambos, no lo hagas — es precisamente ese atajo el que rompió el sistema la última vez.

## Input obligatorio (fuente de verdad — no inventar nada de esto)

- `investigar/[proyecto]/output-paso-2/epicas.md`
- `investigar/[proyecto]/output-paso-2/capacidad-equipo/actual.md` — **siempre lee `actual.md`, nunca un `v{N}.md` concreto directamente** (así el roadmap siempre usa la última capacidad validada sin que tengas que rastrear el número de versión)
- `investigar/[proyecto]/output-paso-2/config/dor-definition.md` y `dod-definition.md`
- `investigar/[proyecto]/output-paso-1/registro-riesgos.md`, `registro-dependencias.md`, `registro-acciones.md`

Regla dura: **si un dato de velocidad, riesgo o dependencia no está en estos artefactos, no lo inventes.** Si falta algo indispensable (ej. no existe `capacidad-equipo/actual.md` todavía), detente y pide al PM que primero cierre `cuestionario-capacidad.md` + `procesar-capacidad.md`. Un roadmap construido sobre una velocidad inventada es peor que no tener roadmap.

## Instrucciones generales

1. Antes de escribir nada, confirma que puedes leer los cuatro inputs de arriba. Si falta `capacidad-equipo/actual.md`, para aquí.
2. Construye primero el roadmap técnico (es el que tiene el detalle real) y deriva el roadmap cliente a partir de él, agregando y simplificando — nunca al revés. El roadmap cliente es una proyección deliberadamente menos precisa del técnico, no un documento independiente con su propia lógica de fechas.
3. Ambos documentos deben ser coherentes entre sí: si el roadmap técnico dice que un hito cae en Sprint 3, el roadmap cliente no puede prometer una ventana que contradiga esa fecha.
4. Guarda ambos en la misma ejecución. No generes uno y dejes el otro "para después" — si el PM solo pidió uno, genera igualmente los dos y avísale de que existen ambos, explicando la diferencia de audiencia.

---

## Parte A: `roadmap-tecnico.md`

**Audiencia:** equipo de desarrollo + PM. **Nivel de detalle:** sprints concretos, fechas, nombres.

### Cómo construirlo

1. **Secuencia las épicas** usando el grafo de dependencias de `epicas.md` (qué EP-XXX bloquea a cuál) — respeta ese orden salvo que haya una razón explícita para alterarlo (indícala si la hay).
2. **Calcula cuántos sprints caben** dividiendo el esfuerzo estimado de cada épica entre la velocidad efectiva de `capacidad-equipo/actual.md`. Usa la velocidad realista como base de planificación; menciona qué pasaría con la optimista/pesimista si el margen es ajustado.
3. **Inserta deadlines de dependencias (DP-XXX)** de `registro-dependencias.md` en el sprint donde deben estar resueltas para no bloquear. Si una DP no tiene fecha límite realista frente al sprint que la necesita, señálalo como riesgo de roadmap, no lo ignores.
4. **Inserta deadlines de acciones de riesgo (A-XXX)** de `registro-acciones.md` de la misma forma.
5. **Aplica el colchón por DoR**: si el DoR exige dependencias resueltas antes de empezar una HU, y hay dependencias pendientes al inicio del proyecto, planifica sprint(s) de preparación antes de que las épicas dependientes puedan arrancar en firme.
6. **Asigna por perfil**: usa la composición de `capacidad-equipo/actual.md` para indicar qué perfil (no necesariamente nombre propio si el PM prefiere anonimizar) se encarga de qué durante cada sprint, respetando el cuello de botella de especialidad ya calculado.
7. **Marca hitos técnicos** (entornos listos, APIs disponibles, releases internos) como puntos de verificación, no como fechas de negocio.
8. **Dibuja el mapa de dependencias entre sprints** en texto (qué HU/épica bloquea a cuál entre sprints), igual que el grafo de épicas pero a nivel de ejecución.
9. **Lista los riesgos con impacto directo en fechas** (de `registro-riesgos.md`) junto con el plan de contingencia si el riesgo se materializa.

### Estructura de salida

Sigue la estructura de `templates/paso-2/roadmap-tecnico.md`: resumen de capacidad, línea de tiempo por sprints, tabla de deadlines de DP, tabla de deadlines de A, hitos técnicos, mapa de dependencias entre sprints, riesgos con impacto en roadmap, próximos hitos de revisión.

En la cabecera, referencia explícitamente qué versión de capacidad se usó (aunque el prompt siempre lea `actual.md`, anota qué número de versión era en el momento de generar el roadmap, para trazabilidad si `actual.md` cambia después).

Guarda en `investigar/[proyecto]/output-paso-2/roadmap-tecnico.md`.

---

## Parte B: `roadmap-cliente.md`

**Audiencia:** stakeholders no técnicos. **Nivel de detalle:** hitos amplios, sin jerga.

### Cómo construirlo

1. **Nunca uses** sprints, puntos de historia, deuda técnica, nombres de dependencias técnicas (DP-XXX) ni de riesgos internos (R-XXX) tal cual — tradúcelos a lenguaje de negocio ("la integración con el proveedor X debe estar confirmada antes de octubre" en vez de "DP-002 debe resolverse antes de Sprint 3").
2. **Agrega sprints en meses o trimestres.** Nunca prometas una fecha exacta ("15 de septiembre") si la fuente es una estimación de sprints — usa ventanas ("Q3 2026", "Septiembre-Octubre 2026").
3. **Cada hito lleva un nivel de confianza explícito**, derivado de la fiabilidad de `capacidad-equipo/actual.md` y de los riesgos que lo afectan:
   - ✅ **Confianza alta**: dependencias resueltas, equipo con experiencia, estimación con datos históricos
   - ⚠️ **Riesgo medio**: incertidumbre controlada (tecnología nueva, dependencia externa en curso)
   - 🔥 **Alto riesgo**: falta información clave, dependencia externa no resuelta, equipo sin experiencia en el área
4. **Declara las premisas** que sostienen el roadmap: qué debe seguir siendo cierto para que las fechas se cumplan (composición del equipo, dependencias externas resolviéndose a tiempo, sin cambios de alcance significativos). Si una premisa deja de cumplirse, dilo explícitamente: "si X no ocurre, esta fecha se mueve."
5. No incluyas nada que no puedas justificar señalando de qué hito o sprint del roadmap técnico proviene.

### Estructura de salida

Sigue la estructura de `templates/paso-2/roadmap-cliente.md`: resumen ejecutivo, timeline por hitos con ventana y confianza, diagrama de hitos, explicación de los niveles de confianza, premisas y condiciones, qué pasa si cambia algo.

Guarda en `investigar/[proyecto]/output-paso-2/roadmap-cliente.md`.

---

## Validación final antes de cerrar

Antes de dar por terminado este prompt, verifica y declara explícitamente al PM:
- Que se generaron los DOS archivos (nombra ambas rutas)
- Que las fechas/ventanas del roadmap cliente no contradicen al roadmap técnico
- Que ningún dato de velocidad, riesgo o dependencia fue inventado — todo remite a `capacidad-equipo/actual.md`, `epicas.md` o los registros del GEE

## Actualización posterior

Ambos roadmaps son documentos vivos: se regeneran (no se editan a mano) cuando cambia el alcance, cambia el equipo, se materializa un riesgo, se resuelve o no una dependencia, o se genera una nueva versión de `capacidad-equipo/actual.md`. Cuando regeneres, sustituye ambos archivos completos — no hagas parches parciales que puedan dejar el cliente y el técnico desincronizados entre sí.
