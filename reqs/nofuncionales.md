# Requisitos No Funcionales

## Capturados durante la sesión de diseño del 2024-06-24

### RNF-01: Independencia de plataforma IA
**Origen**: Explícito (requisito del usuario)
**Descripción**: El sistema debe funcionar con cualquier IA (OpenCode, Claude, ChatGPT, Gemini). Los artefactos deben ser markdown estándar legibles por cualquier herramienta.

### RNF-02: Bajo acoplamiento entre pasos
**Origen**: Derivado del diseño
**Descripción**: Cada paso del pipeline debe producir artefactos autónomos. Cambiar un paso no debe afectar a los demás. El contrato entre pasos es el formato del artefacto markdown.

### RNF-03: Confidencialidad de datos del cliente
**Origen**: Política (Paradigma Digital / cliente)
**Descripción**: Para tratar datos sensibles del cliente deberá usarse Gemini o Claude (según el usuario). El diseño debe permitir elegir qué IA procesa cada paso.

### RNF-04: Formato markdown estructurado
**Origen**: Derivado del diseño
**Descripción**: Todos los artefactos se escriben en markdown con tablas y formato consistente. Las tablas siguen las columnas definidas en el diseño del GEE.

### RNF-05: Sin dependencia de conexión a Jira
**Origen**: Explícito (necesidad real)
**Descripción**: La integración con Jira debe ser mediante adaptador de salida, no un requisito de funcionamiento. El sistema debe funcionar offline con markdown.

### RNF-06: Versionado de artefactos
**Origen**: Derivado
**Descripción**: Los artefactos deben tener control de cambios. Se puede usar git o mantener un histórico de versiones en los propios archivos.

### RNF-07: Serialización de IDs
**Origen**: Derivado
**Descripción**: Los IDs (R-XXX, DP-XXX, etc.) deben ser autoincrementales y únicos dentro de cada categoría.

### RNF-08: Escalabilidad del catálogo META
**Origen**: Derivado
**Descripción**: Los valores del catálogo META (probabilidad, impacto, tipos de riesgo, etc.) deben ser configurables por proyecto. El proyecto puede tener su propio perfil (multiplicador).

## Leyenda de origen
- **Explícito**: Dicho directamente por el usuario
- **Derivado**: Se deduce del diseño o del contexto
- **Política**: Impuesto por la compañía o estándares
- **Estándar**: Buena práctica de ingeniería
