# INSTRUCCIONES

## ⚠️ LÉETE ESTO PRIMERO

Este documento contiene las reglas para trabajar en este proyecto de diseño. Cualquier persona o IA que colabore aquí debe leerlo antes de hacer cualquier otra cosa.

## Estructura del proyecto

```
Gestion_Proyectos_OpenCode/
├── INSTRUCCIONES.md          <- Este archivo. LÉEME PRIMERO.
├── CONTEXTO.md               <- Todo lo hablado, acordado, decisiones tomadas
├── diario/                   <- Bitácora de cada sesión (YYYY-MM-DD-tema.md)
├── diseno/                   <- Diseño del producto (Capa 1)
│   ├── paso--1-analisis-legacy/
│   ├── paso-0-captura-requisitos/
│   ├── paso-1-framework-gee/
│   ├── paso-2-roadmap-backlog/
│   └── paso-3-gestion-sprints/
├── reqs/                     <- Requisitos del producto que estamos diseñando
│   ├── funcionales.md
│   └── no-funcionales.md
├── propuestas/               <- Alternativas evaluadas, decisiones de diseño
│   └── descartes.md
├── investigar/               <- Temas pendientes de resolver
│   └── pendientes.md
└── lecciones.md              <- Lecciones aprendidas
```

## Reglas de trabajo

1. **Leer antes de hablar**: Cualquier IA que llegue nueva debe leer INSTRUCCIONES.md primero, luego CONTEXTO.md, luego el diario de la última sesión.

2. **Pipeline desacoplado**: Cada paso produce artefactos markdown estándar. Ningún paso depende de cómo se generó el input ni de cómo se consumirá el output.

3. **Un paso a la vez**: No se avanza al siguiente paso del diseño hasta que el actual esté cerrado y documentado.

4. **Decisiones documentadas**: Toda decisión de diseño queda registrada en CONTEXTO.md con fecha, quién la tomó, y alternativas consideradas.

5. **Descartes**: Toda idea que se pruebe y se descarte va a propuestas/descartes.md con el motivo.

6. **No implementar aún**: Este proyecto está en fase de diseño. No se escribe código de producto hasta que tengamos el plan de implementación aprobado.

7. **Formato de artefactos**: Los artefactos se escriben en markdown. Las tablas siguen el formato GEE definido en el diseño.

8. **Trazabilidad**: Cada artefacto usa IDs únicos (R-XXX, DP-XXX, A-XXX, SC-XXX, IM-XXX) y puede referenciar a otros artefactos.

## Proceso de diseño

1. Brainstorming y clarificación de ideas
2. Diseño detallado por pasos (aprobación en cada sección)
3. Documentación del diseño en specs
4. Revisión por el usuario
5. Transición a plan de implementación

## Herramientas

Este proyecto se diseña con ayuda de IA (OpenCode, Claude, ChatGPT, Gemini, etc.). Los artefactos se mantienen en markdown para que cualquier herramienta pueda leerlos y actualizarlos.

## Para colaboradores IA

Al llegar a este proyecto por primera vez:
1. Lee este INSTRUCCIONES.md
2. Lee CONTEXTO.md
3. Lee el último archivo en diario/
4. Lee los specs de diseño en diseno/ para entender el estado actual
5. Pregunta al usuario por dónde seguir antes de actuar
