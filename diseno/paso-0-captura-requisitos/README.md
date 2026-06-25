# Paso 0: Captura de Requisitos

## Propósito
Capturar, clasificar y validar los requisitos funcionales y no funcionales del cliente, partiendo de cualquier escenario de entrada posible.

## Escenarios de entrada
1. **A) Reunión directa**: El usuario tiene notas o transcripción de la reunión con el cliente
2. **B) Petición escrita**: Email o documento breve describiendo lo que quiere el cliente
3. **C) Con legacy**: Se dispone del mapa del proyecto del Paso -1
4. **D) Proyecto nuevo**: No hay legacy, se empieza desde cero

## Pipeline

### Sub-paso 0.1: Análisis del input
- **Input**: Lo que tenga el usuario (notas, email, mapa legacy) según el escenario
- **Proceso**: La IA procesa y produce un primer borrador de peticiones
- **Output**: `peticiones-cliente.md`
  - Cada item: [ID] Lo que pide | Interpretación | Categoría tentativa | Duda/ambigüedad

### Sub-paso 0.2: Guía de preguntas
- **Input**: peticiones-cliente.md + mapa-proyecto.md (si existe legacy)
- **Proceso**: La IA construye cuestionario estructurado para:
  - **Funcionales**: "¿Qué pasa cuando...?", "¿Quién puede hacer X?", "¿Qué debe pasar si Y falla?"
  - **No funcionales**: "¿Cuántos usuarios concurrentes?", "¿Hay normativa de datos?", "¿Qué pasa si el sistema cae una hora?"
  - **Visión futura**: "¿Qué sabes del próximo año?", "¿Hay algo que NO deba estar en esta fase?", "¿Qué funcionalidades dependen de decisiones externas?"
- **Output**: `guia-preguntas.md`

### Sub-paso 0.3: Clasificación funcional vs no funcional
- **Input**: Respuestas del cliente (procesadas por el usuario)
- **Proceso**: La IA clasifica cada item
- **Output**: 
  - `requisitos-funcionales.md`: Capacidades del sistema, reglas de negocio, flujos
  - `requisitos-nofuncionales.md`: Rendimiento, seguridad, escalabilidad, disponibilidad, usabilidad, compliance, operaciones

### Sub-paso 0.4: Descubrimiento de no funcionales implícitos
- **Input**: requisitos-funcionales.md
- **Proceso**: La IA añade no funcionales derivados de:
  - Los propios funcionales (ej: "login" → seguridad)
  - Políticas de la compañía del cliente (ej: auditoría SOC2)
  - Estándares del sector (ej: GDPR, accesibilidad)
- **Output**: requisitos-nofuncionales.md completo (con origen marcado)

### Sub-paso 0.5: Zonas de incertidumbre y riesgos
- **Input**: Todos los requisitos
- **Proceso**: La IA identifica lo que el cliente NO sabe, NO ha detallado, o ha dejado ambiguo
- **Output**: `zonas-incertidumbre.md` con:
  - Descripción de cada zona
  - Riesgos asociados (alimenta al GEE)
  - Nivel de incertidumbre (bajo/medio/alto)

### Sub-paso 0.6: Validación con el cliente
- Adaptador de salida genera documento presentable
- El usuario lo revisa con el cliente
- La IA incorpora correcciones

## Output final consolidado
- `requisitos.md` con:
  - Funcionales (con prioridad: imprescindible / importante / deseable / futuro incierto)
  - No funcionales (con origen: explícito / derivado / política / estándar)
  - Zonas de incertidumbre y riesgos asociados
