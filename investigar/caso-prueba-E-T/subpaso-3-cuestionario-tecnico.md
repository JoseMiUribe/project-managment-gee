# Guía de Entrevista — Plataforma de Orientación Integral E-T

**Preparado para:** Arquitecto técnico / Tech Lead
**Perfil:** Técnico
**Fecha:** 2024-06-26
**Basado en:** mapa-proyecto.md (subpaso-2)

## Instrucciones para el PM

1. Selecciona las preguntas relevantes según el perfil del interlocutor
2. Marca las respuestas en la columna "Respuesta" durante la entrevista
3. Vuelca las respuestas en el mapa del proyecto tras la reunión

## Cuestionario — Perfil Técnico

| # | Pregunta | Aspecto a resolver | IDs relacionados | Respuesta | Notas post-entrevista |
|---|---|---|---|---|---|
| 1 | El Director se implementó como un duplicado de Jefe de Estudios con firma de Orientador. Esto le da visibilidad de datos clínicos por herencia de RLS. ¿Se ha diseñado una política RLS específica que le permita firmar informes sin ver el contenido clínico? ¿O está pendiente? | Permisos RLS de Dirección | A-013 | | |
| 2 | Los reportes financieros (Facturas, Cobros, Pedidos) aparecieron en la demo de informes. ¿Son consultas a tablas del mismo esquema E-T o a un sistema externo? ¿Qué tablas de base de datos los sustentan? | Implementación reportes financieros | A-014 | | |
| 3 | DEC-041 especifica PDFs editables. La decisión posterior migra a Word/ODT. ¿Sigue habiendo código de ambos en los repositorios? ¿Cuál es el plan para eliminar la lógica de PDFs? | Limpieza de código legacy de informes | A-015 | | |
| 4 | En el flujo de incidencias, la IA propone la gravedad. ¿Hay un paso de confirmación obligatorio del usuario antes de persistir? ¿O la incidencia se guarda directamente con la gravedad sugerida? | Validación humana en flujo de IA | A-016 | | |
| 5 | "Gema 4" y "Kimi 2.6": ¿son nombres reales de modelos disponibles en Cloudflare Workers AI? ¿O son placeholders? ¿Tenéis confirmación de que procesan datos en UE? | Modelos de IA concretos | A-020 | | |
| 6 | La escala de gravedad 1-3: ¿es un enum fijo en base de datos? ¿Configurable por centro? ¿Hay tabla de criterios asociada? | Implementación de escala de gravedad | A-021 | | |
| 7 | ¿Hay diseñada una estrategia de backup y disaster recovery? ¿RPO/RTO definidos? Dado que son datos de menores, ¿qué pasa si se pierde un día de datos? | Backup y DR | A-025 | | |
| 8 | La integración con Fidias, Raíces y Sodo está excluida del MVP. Pero los datos tienen que llegar de algún sitio. ¿Cómo se va a poblar la base de datos inicialmente? ¿Carga CSV manual? | Estrategia de integración y migración | A-024, A-029 | | |
| 9 | ¿Existe un modelo de datos detallado (ERD) o solo está en las cabeceras de los requisitos? ¿Las 7 categorías de la ficha del alumno están modeladas en tablas? | Modelo de datos | A-030 | | |
| 10 | Los menores de edad, ¿tienen identidad digital en el sistema? ¿Inician sesión? ¿O solo los profesionales acceden a sus datos? Si acceden, ¿cómo se gestiona el consentimiento parental para el tratamiento de datos? | Identidad digital de menores | A-032 | | |

## Resumen post-entrevista

**Aspectos resueltos:** [IDs]
**Aspectos pendientes:** [IDs]
**Nuevos hallazgos:** [notas]
