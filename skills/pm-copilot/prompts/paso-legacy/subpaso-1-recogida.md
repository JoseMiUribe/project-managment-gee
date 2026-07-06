# Prompt: Sub-paso 1 — Recogida de fuentes

> **Nivel:** ⚙️ Ejecutivo — tabular y clasificar fuentes es mecánico. Puedes delegarlo a un subagente con modelo económico (p.ej. `Agent({ model: "haiku", ... })` en Claude Code) y revisar el resultado antes de continuar.

## Instrucciones para la IA

Eres un analista de proyectos experto. Te voy a proporcionar una serie de documentos sobre un proyecto (PDFs, Word, presentaciones, URLs, código fuente, capturas de pantalla). Tu tarea es:

1. Clasificar cada fuente según su tipo (documentación técnica, presentación comercial, código, email, etc.)
2. Extraer metadata: fecha (si visible), autoría (si visible), formato
3. Generar un resumen de 2 líneas del contenido de cada fuente
4. Indicar tu nivel de confianza en la fiabilidad de cada fuente (Alta / Media / Baja / No determinable)

Devuelve la información en una tabla markdown con estas columnas:
| ID | Nombre fuente | Tipo | Formato | Fecha | Autor | Resumen | Fiabilidad |

## Pasos de ejecución

1. Recorre cada documento/URL/fuente que se te ha proporcionado, uno por uno, sin omitir ninguno.
2. Para cada fuente, asigna un ID correlativo `F-001`, `F-002`, ... (no reutilices IDs si una fuente resulta ilegible o vacía; documéntala igualmente con su fiabilidad como "No determinable").
3. Clasifica el **tipo** de fuente usando una taxonomía consistente (ejemplos: documentación técnica, presentación comercial, código fuente, email/comunicación, acta de reunión, captura de pantalla, ticket/issue, contrato). Si una fuente no encaja en ninguna categoría obvia, usa "Otro" y anótalo en el resumen.
4. Extrae la **fecha** y el **autor** solo si aparecen explícitamente en la fuente o en sus metadatos; si no son determinables, escribe "No visible" (no los inventes ni los infieras del contexto).
5. Redacta el **resumen** en exactamente 2 líneas, centrado en el contenido (qué dice la fuente), no en su forma.
6. Asigna la **fiabilidad** según estos criterios:
   - **Alta**: fuente primaria, con fecha/autor claros y contenido verificable o coherente con otras fuentes.
   - **Media**: fuente parcial, sin metadata completa, o de segunda mano.
   - **Baja**: fuente desactualizada, informal, o con indicios de estar obsoleta.
   - **No determinable**: no hay suficiente información para evaluarla.
7. Construye la tabla markdown completa con todas las fuentes, sin dejar filas vacías.
8. Añade el resumen ejecutivo final (total de fuentes, distribución por tipo, conteo de fiabilidad Alta/Baja, observaciones sobre la calidad general de la documentación).
9. Guarda el resultado como `inventario-fuentes.md` en `investigar/[proyecto]/output-paso-legacy/`.

## Input del usuario

[El usuario pega aquí la lista de documentos o los sube como adjuntos]

## Output esperado

Una tabla markdown completa con todas las fuentes clasificadas, más el resumen ejecutivo, guardada en `investigar/[proyecto]/output-paso-legacy/inventario-fuentes.md`.
