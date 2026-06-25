# Prompt: Sub-paso 3 — Guía de entrevista

## Instrucciones para la IA

Tienes el mapa del proyecto (archivo adjunto: mapa-proyecto.md) que identifica aspectos claros, contradictorios, ambiguos e inexistentes del proyecto.

Tu tarea es generar dos cuestionarios para entrevistar al cliente:

### Cuestionario A: Perfil de NEGOCIO
- Lenguaje sencillo, sin tecnicismos
- Preguntas orientadas a: propósito del sistema, usuarios, reglas de negocio, flujos de valor, prioridades
- Enfócate en resolver los items ❓ (ambiguos) y 🔲 (inexistentes) que tengan naturaleza de negocio

### Cuestionario B: Perfil TÉCNICO
- Lenguaje técnico preciso
- Preguntas orientadas a: arquitectura, tecnologías, integraciones, despliegue, deuda técnica, configuraciones
- Enfócate en resolver los items ⚠️ (contradictorios), ❓ (ambiguos) y 🔲 (inexistentes) de naturaleza técnica

### Formato de cada pregunta:
| # | Pregunta | Aspecto a resolver | IDs relacionados | Notas para el entrevistador |
|---|---|---|---|---|
| 1 | | | A-XXX | |

## Input del usuario

[El usuario adjunta mapa-proyecto.md]

## Output esperado

Dos tablas markdown (una por perfil) con preguntas listas para usar.
