# Prompt: Guía de entrevista — Paso 0

> **Nivel:** 🧠 Diseño — adaptar las preguntas al contexto del cliente requiere criterio. Ejecuta en el modelo principal de la sesión.

## Propósito

Cuestionario para entrevistar al cliente y capturar los requisitos funcionales y no funcionales de lo NUEVO que quiere construir. Se usa siempre, venga el proyecto de legacy o no.

## Instrucciones para la IA

Adapta la guía estándar de abajo al contexto concreto del proyecto: el nombre del cliente, el sector, la terminología que ya haya usado, y cualquier información previa disponible (documento original, notas del PM). No te limites a copiar las preguntas genéricas tal cual — personalízalas para que suenen naturales en la conversación con este cliente específico y prioriza las que más valor aporten dado lo que ya se sabe.

Si detectas que alguna pregunta genérica ya tiene respuesta implícita en la documentación disponible, no la elimines: reformúlala como confirmación ("Entendemos que X, ¿es correcto?") en lugar de pregunta abierta.

## Estructura de la guía

```markdown
# Guía Estándar para Paso 0 — [Nombre del Proyecto]

## 1. Contexto de negocio
- ¿Cuál es el problema o necesidad que motiva este proyecto?
- ¿Quién es el usuario final? ¿Qué perfiles hay?
- ¿Qué valor esperas obtener? ¿Cómo medirías el éxito?
- ¿Hay objetivos medibles? (KPIs, OKRs)

## 2. Requisitos funcionales (lo que QUIERES construir)
- ¿Qué funcionalidades concretas necesitas?
  - Describe cada una: ¿qué hace? ¿para quién? ¿cuándo?
- ¿Qué pasa si algo falla? (flujo alternativo, error)
- ¿Quién puede hacer cada cosa? (roles y permisos)
- ¿Hay reglas de negocio específicas?

## 3. Requisitos no funcionales
- ¿Cuántos usuarios concurrentes esperas?
- ¿Dónde se desplegará? (cloud, on-premise, híbrido)
- ¿Hay normativa que cumplir? (GDPR, LOPIVI, sectorial...)
- ¿Qué disponibilidad necesitas? (24/7, horario lectivo...)
- ¿Qué integraciones con otros sistemas son necesarias?
- ¿Hay requisitos de rendimiento específicos?
- ¿Seguridad? ¿Autenticación? ¿Auditoría?

## 4. Visión futura (próximos 6-12 meses)
- ¿Qué sabes de lo que viene después de esta fase?
- ¿Hay funcionalidades que NO deben estar en esta fase? ¿Por qué?
- ¿Dependencias externas previstas? (equipos, proveedores, aprobaciones)
- ¿Hay decisiones ya tomadas que condicionen el futuro?

## 5. Equipo y organización
- ¿Quién valida y aprueba? ¿Cadencia?
- ¿Cómo se gestionan las prioridades?
- ¿Qué herramientas usáis? (Jira, Confluence, etc.)
- ¿Hay equipo técnico ya asignado? ¿O lo ponemos nosotros?
- ¿Metodología de trabajo preferida? (SCRUM, Kanban, etc.)
```

## Combinación con guía del legacy

Si el proyecto viene de un Paso -1 (análisis de legacy), existe `output-paso-legacy/guia-para-paso-0.md` con las preguntas específicas que quedaron pendientes de resolver con el cliente (contradicciones, ambigüedades, vacíos detectados en la documentación existente).

```
output-paso-legacy/guia-para-paso-0.md  +  guia-estandar-paso-0.md
            │                                       │
            └───────────────────┬───────────────────┘
                                 ▼
                    cuestionario-combinado.md

Orden de la entrevista:
1. Primero: resolver contradicciones del legacy (guia-para-paso-0.md)
   - El cliente aclara dudas, corrige información desfasada
2. Segundo: preguntar requisitos nuevos (guia-estandar-paso-0.md)
   - Capturar qué quiere construir
3. Validar coherencia:
   - La IA cruza lo nuevo contra el grafo/vectorial del legacy
   - Detecta conflictos: "esto que pides choca con el componente X que ya existe"
```

Si `output-paso-legacy/guia-para-paso-0.md` no existe (proyecto nuevo sin legacy), usa únicamente la guía estándar.

## Pasos de ejecución

1. Comprueba si existe `investigar/[proyecto]/output-paso-legacy/guia-para-paso-0.md`. Si existe, léelo antes de generar nada.
2. Genera la guía estándar adaptada al proyecto (nombre, sector, terminología).
3. Si hay guía del legacy, combínala siguiendo el orden indicado arriba: primero contradicciones/huecos del legacy, después requisitos nuevos.
4. Marca claramente en el documento combinado qué preguntas vienen del legacy (huecos a cerrar) y cuáles son de descubrimiento de lo nuevo, para que el PM sepa distinguirlas durante la entrevista.
5. Guarda el resultado como `cuestionario-combinado.md` (si hay legacy) o `guia-estandar-paso-0.md` (si no) en `investigar/[proyecto]/output-paso-0/`.

## Input del usuario

[El usuario indica el nombre del proyecto y, si aplica, confirma que existe `output-paso-legacy/guia-para-paso-0.md`]

## Output esperado

Guía de entrevista lista para usar con el cliente, adaptada al contexto del proyecto, guardada en `investigar/[proyecto]/output-paso-0/`.
