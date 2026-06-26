# Guía Estándar para Paso 0

## Propósito
Cuestionario genérico para entrevistar al cliente y capturar requisitos funcionales y no funcionales de lo NUEVO.

## ¿Cuándo se usa?
- **Siempre**: para cualquier proyecto, venga de legacy o no
- Se combina con `guia-paso-0.md` (del Paso -1) si hay proyecto existente

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

```
guia-paso-0.md (del Paso -1) + guia-estandar-paso-0.md
            │                          │
            └──────────┬───────────────┘
                       ▼
            cuestionario-combinado.md

Orden de la entrevista:
1. Primero: resolver contradicciones del legacy (guia-paso-0.md)
   - El cliente aclara dudas, corrige información desfasada
2. Segundo: preguntar requisitos nuevos (guia-estandar-paso-0.md)
   - Capturar qué quiere construir
3. Validar coherencia:
   - La IA cruza lo nuevo contra el grafo/vectorial del legacy
   - Detecta conflictos: "esto que pides choca con el componente X que ya existe"
```

## Output del Paso 0

| Artefacto | Descripción |
|---|---|
| peticiones-cliente.md | Lista inicial de deseos del cliente (sin filtrar) |
| requisitos-funcionales.md | Capacidades del sistema, reglas de negocio, flujos |
| requisitos-nofuncionales.md | Rendimiento, seguridad, escalabilidad, compliance |
| zonas-incertidumbre.md | Lo que el cliente no sabe o no ha detallado |
