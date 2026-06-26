# Modelo Grafo + Vectorial

## Propósito
Dotar al sistema de dos bases de datos complementarias que almacenan y relacionan la información del proyecto para consultas avanzadas por parte de la IA.

## Grafo (Neo4j o similar)

### Entidades

| Entidad | Descripción | Se crea en |
|---|---|---|
| Proyecto | El proyecto o iniciativa | Paso 0 |
| Componente | Módulo, subsistema o funcionalidad | Paso -1 |
| Tecnología | Lenguaje, framework, herramienta | Paso -1 |
| SistemaExterno | Sistema del que se depende | Paso -1, GEE |
| Persona | Rol o persona involucrada | Paso -1 |
| Documento | Fuente de información | Paso -1 |
| Decision | ADR o decisión técnica | Paso -1 |
| Requisito | Requisito funcional o no funcional | Paso 0 |
| Riesgo | Riesgo identificado | GEE (Paso 1) |
| Dependencia | Dependencia externa | GEE (Paso 1) |
| Accion | Acción de mitigación | GEE (Paso 1) |
| Epica | Gran bloque de funcionalidad | Paso 2 |
| HistoriaUsuario | HU concreta | Paso 2, Paso 3 |
| CambioAlcance | Scope change | GEE (Paso 1) |

### Relaciones

| Origen | Relación | Destino |
|---|---|---|
| Componente | USA | Tecnología |
| Componente | DEPENDE_DE | SistemaExterno |
| Componente | COMPUESTO_POR | Componente |
| Documento | HABLA_DE | Componente |
| Persona | RESPONSABLE_DE | Componente |
| Persona | TIENE_ROL | Rol |
| Decision | AFECTA_A | Componente |
| Requisito | AFECTA_A | Componente |
| Riesgo | AFECTA_A | Componente |
| Riesgo | GENERA | Accion |
| Dependencia | BLOQUEA | Componente |
| Dependencia | GENERA | Riesgo |
| CambioAlcance | GENERA | Riesgo |
| CambioAlcance | GENERA | Dependencia |
| CambioAlcance | GENERA | Accion |
| Epica | CONTIENE | HistoriaUsuario |
| HistoriaUsuario | IMPLEMENTA | Requisito |

### Ejemplo de consultas al grafo

1. "¿Qué componentes dependen del sistema X?" → `[Componente] -DEPENDE_DE-> [SistemaExterno {nombre: "X"}]`
2. "¿Qué decisiones afectan al módulo de incidencias?" → `[Decision] -AFECTA_A-> [Componente {nombre: "Incidencias"}]`
3. "¿Qué requisitos nuevos afectan a componentes legacy?" → `[Requisito] -AFECTA_A-> [Componente]` (filtrado por fecha de creación)
4. "¿Qué riesgos están asociados a las dependencias bloqueadas?" → `[Dependencia {estado: "bloqueada"}] -GENERA-> [Riesgo]`

## Vectorial (Cloudflare iSearch / Pinecone / Supabase pgvector)

### Contenido a indexar

| Tipo | Ejemplos | Se indexa en |
|---|---|---|
| Documentación original | PDFs, Word, presentaciones del cliente | Paso -1 |
| Normativas | LOPIVI, GDPR, reglamentos internos | Paso -1 |
| Manuales | Manuales de usuario, guías técnicas | Paso -1 |
| Reglas de gobierno | Políticas de la compañía, compliance | Paso -1 |
| Registro histórico | Incidencias pasadas (si aplica) | Paso -1 |
| Reglamentos centro | RRI, PEC (proyecto educativo) | Paso 0 |
| Lecciones aprendidas | De sprints anteriores | Paso 3 |

### Uso de la vectorial

- **Búsqueda semántica**: "¿Qué dice la normativa sobre acoso escolar?"
- **Contexto para RAG**: Cuando la IA necesita responder preguntas basadas en documentación extensa
- **Validación de coherencia**: Comparar requisitos nuevos con documentación existente para detectar contradicciones

## Integración grafo + vectorial

```
Pregunta del PM: "El cliente quiere añadir un modulo de enfermeria"

1. GRAFO: ¿Existe ya algo relacionado con salud/enfermería en el proyecto?
   → Busca nodos [Componente] con nombre relacionado
   → Encuentra: "Salud y Bienestar" (existe)

2. VECTORIAL: ¿Qué dice la documentación sobre salud y bienestar?
   → Búsqueda semántica en documentos indexados
   → Encuentra: "Las alergias se gestionan en la ficha del alumno"

3. COMBINADO: La IA concluye:
   → "Ya existe un componente de salud básica. Lo nuevo debería
      ampliarlo, no crearlo desde cero. Aquí está la documentación."
```

## Poblado desde el pipeline

| Artefacto | Puebla en grafo | Puebla en vectorial |
|---|---|---|
| inventario-fuentes.md | Nodos Documento con metadatos | Contenido de cada fuente |
| mapa-proyecto.md | Nodos Componente, Tecnología, Persona + relaciones | — |
| contradicciones (mapa) | Nodos Riesgo + relación AFECTA_A | — |
| guia-paso-0.md | Nodos Riesgo, Dependencia | — |
| requisitos.md (Paso 0) | Nodos Requisito + relación AFECTA_A | — |
| registros GEE | Nodos Riesgo, Dependencia, Accion, CambioAlcance | — |
| epicas, HU (Paso 2) | Nodos Epica, HistoriaUsuario | — |
| lecciones (Paso 3) | — | Documento de lecciones aprendidas |
