# Prompt: Fuentes de Contexto Opcionales (repo de código, memory bank...)

> **Nivel:** 🧠 Diseño — decidir qué detalle está realmente fundamentado por la fuente y cuál seguiría siendo invención requiere criterio. Ejecuta en el modelo principal.

## Propósito

El skill es siempre quien genera épicas e historias (ver `mejoras-pendientes.md`, entrada 2026-07-13: Infinia queda retirado como generador). Este prompt no genera nada por sí mismo — describe cómo `prompts/paso-3/generar-backlog-detalle.md` (y, si aplica, `prompts/paso-2/generar-epicas.md`) puede **fundamentar mejor** lo que genera usando fuentes de contexto reales y opcionales del proyecto, sin cambiar la regla central: una HU nunca decide el "cómo" (arquitectura, tecnología, implementación), solo el "qué" — salvo que la fuente confirme que ya es una decisión real y existente, no una invención.

## Concepto

- Una fuente de contexto es **opcional, por proyecto, y se registra explícitamente** en `config/fuentes-contexto/[tipo].md` — nunca se activa sola ni se asume porque "podría existir".
- **Nunca sustituye** a los inputs obligatorios del Paso 3 (`epicas.md`, roadmaps, riesgos, RF/RNF) — los complementa.
- Se usa solo para dos cosas: (1) verificar si un detalle técnico que aparecería en una HU ya es una decisión real y existente (nunca para proponerla desde cero), y (2) verificar solapes/dependencias reales contra lo que ya existe.

## Fuentes soportadas hoy

### Repositorio de código (solo lectura)

`config/fuentes-contexto/repo-codigo.md` — ruta o acceso al repo. Plantilla: `templates/transversal/fuente-contexto-repo-codigo.md`.

**Uso:** antes de marcar un requisito técnico o cerrar una HU, si esta fuente está registrada, comprueba en el repo real (nombres de tabla, endpoints, componentes) si el detalle que ibas a describir ya existe. Si existe, cítalo como contexto confirmado (nunca `[IA]`, porque no es una inferencia — es un hecho verificado). Si no existe, no lo inventes solo porque "sería razonable" — sigue las reglas de `generar-backlog-detalle.md` (no decidir arquitectura ni tecnología).

### Memory bank de Paradigma (pendiente de definir)

`config/fuentes-contexto/memory-bank.md` — **reservado, sin uso todavía**. Antes de activarlo, aclara con el PM: qué es exactamente (¿el mismo sistema que usaba Infinia, huérfano tras su retirada pero quizá reutilizable como fuente de lectura, o un sistema aparte?), qué tipo de información contiene, y cómo se accede (¿Drive, API, otro?). **No actives ni generes este archivo hasta tener esa respuesta** — no asumas que es igual al memory bank que usaba Infinia solo porque comparte nombre.

## Procedimiento

1. Al arrancar cualquier generación de épicas o historias, comprueba si `config/fuentes-contexto/` existe y qué archivos contiene.
2. Si no existe ninguno, genera exactamente igual que sin este prompt — no lo menciones ni lo ofrezcas por iniciativa propia salvo que el PM pregunte explícitamente por ello.
3. Si existe una fuente activa, actívala solo para lo descrito en su sección de arriba, y dilo explícitamente en el resumen final del trabajo (ej. "Verificado contra el repo real: la tabla `centros` ya existe con esos campos, la HU lo cita como confirmado").
4. Nunca dejes que una fuente de contexto se convierta en excusa para añadir detalle técnico no pedido — sigue siendo válida la regla de `generar-backlog-detalle.md` de no decidir el "cómo". La fuente solo confirma o descarta, nunca inspira una decisión nueva.

## Cómo añadir una fuente nueva

Sigue el mismo patrón: crea `config/fuentes-contexto/[tipo-nuevo].md` (con una plantilla nueva en `templates/transversal/fuente-contexto-[tipo-nuevo].md` si el tipo se va a reutilizar en más proyectos) y añade su propia sección a este documento, describiendo exactamente para qué sí y para qué no se usa — no des acceso "genérico" a una fuente sin acotar su uso, igual que se hizo con el repositorio de código.

## Ver también

`prompts/paso-3/generar-backlog-detalle.md` (regla de qué nivel de detalle técnico incluir, sección "Qué nivel de detalle y tamaño debe tener una HU"), `templates/transversal/fuente-contexto-repo-codigo.md`.
