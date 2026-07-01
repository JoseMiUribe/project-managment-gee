# Auditoría del Sistema — PM Copilot

**Propósito:** Autodiagnóstico del sistema. Qué hace bien, qué hace mal, imprecisiones, gaps, workarounds y mejoras para la siguiente versión. Se alimenta de la experiencia de uso en proyectos reales (E-T, diseño inicial) y de la reflexión del equipo de diseño.

**Formato:** Vivo. Se actualiza con cada proyecto ejecutado y cada revisión del sistema.

---

## ✅ Aciertos (lo que funciona bien)

| Aspecto | Evidencia | Proyectos donde aplica |
|---|---|---|
| **Pipeline desacoplado** con artefactos md estándar | Los outputs de un paso se consumen limpiamente en el siguiente sin acoplamiento. Validado en E-T | Todos |
| **Check Init 16 pts** | Predijo correctamente 6 puntos rojos en E-T (planificación, calidad, dependencias, lecciones, cierre, presentación). Estos se materializaron como problemas reales durante la simulación de sprints | Proyectos con incertidumbre alta |
| **GEE con META y RAG** | 12 riesgos calculados con pesos, ninguno en rojo. Buena granularidad. Las dos vistas (FULL + simplificada) cubren necesidades de equipo técnico y stakeholders | Proyectos con perfil medio-alto |
| **Clasificación de fuentes en ✅⚠️❓🔲 (Paso -1)** | Detectó 7 items que el cliente E-T no mencionó (contradicción human-in-the-loop vs automatización, 8 aspectos inexistentes). El filtro (subpaso-3b) evitó ruido en el Paso 0 | Proyectos con legacy extenso |
| **DoR/DoD configurables por proyecto** | Validado que hardcodearlos sería un error. Cada equipo tiene distintas exigencias (seguridad, tests, documentación). La flexibilidad de 3 modos de entrada (guiado/plantilla/mixto) cubre todos los escenarios | Todos |
| **Factor DoD en capacidad** | Incluir el esfuerzo extra del DoD en la velocidad nominal evita prometer más de lo que se puede entregar. Validado conceptualmente en E-T (DoD con tests+seguridad → -30%) | Proyectos con exigencias de calidad altas |
| **Dos roadmap (cliente + técnico)** | El roadmap cliente da dirección sin ruido técnico. El roadmap técnico da el detalle que necesita el equipo. Validado en E-T con stakeholders no técnicos | Proyectos con stakeholders externos |
| **Bootstrap automático (modo auto/guía)** | Cubre tanto IAs con capacidad de crear archivos (OpenCode, Claude Code, Gemini CLI) como chats web sin ella | Todos |
| **Versionado de capacidad-equipo.md** | No borrar versiones anteriores permite ver la evolución de la estimación y justificar cambios de fecha con datos | Proyectos largos (>3 meses) |

## ⚠️ Imprecisiones (hace cosas, pero con margen de error)

| Imprecisión | Impacto | Mitigación actual |
|---|---|---|
| **Velocidad en pts/sprint es subjetiva** sin estandarizar el punto. 1 pt = medio día es una convención, no un estándar universal | La horquilla optimista/pesimista puede ser de ±30%, lo que da roadmap con mucho margen | Usar fiabilidad explícita (ALTA/MEDIA/BAJA) y rangos en lugar de fechas fijas |
| **Factor DoD (30%)** es una estimación genérica basada en tablas de referencia, no en datos reales del proyecto | Si el DoD real requiere menos esfuerzo, se infraestima la capacidad; si requiere más, se sobreestima | Calibrar con datos del primer sprint real y actualizar capacidad-equipo.md V2 |
| **La capacidad se calcula con datos del PM, no del equipo** directamente | El PM puede sobreestimar o subestimar la velocidad de su equipo | Si el TL participa en el cuestionario, la fiabilidad sube a MEDIA. Si hay datos históricos, a ALTA |
| **Los roadmap tienen confianza explícita pero no probabilidad numérica** | "Confianza alta" es subjetiva | No añadir complejidad innecesaria. El nivel de confianza cualitativo es suficiente para stakeholders |
| **Check Init es binario (verde/rojo)** sin semáforo intermedio | Un punto puede estar parcialmente cumplido | Los 16 puntos ya tienen "Sí/No/Parcial" en la práctica. Formalizarlo en el template |
| **El cuestionario guiado asume que el PM conoce al equipo** | Si el PM es nuevo o el equipo cambia, las respuestas son menos fiables | El modo mixto permite que el TL complete las partes técnicas |

## 🔲 Gaps (lo que no hace y debería)

| Gap | Prioridad | Impacto | Propuesta |
|---|---|---|---|
| **No hay tracking de horas reales vs estimadas** | Alta | Sin métricas reales, la capacidad siempre será una estimación sin validación | Añadir campo "horas reales" en daily log y comparar en retrospectiva |
| **No hay gestión de presupuesto/costes** | Media | El PM usa el sistema para planificar pero no para controlar costes | Añadir sub-paso en GEE o como paso 4 |
| **No genera alertas proactivas** | Media | El sistema responde cuando se le pregunta, no avisa de deadlines próximas | Añadir sistema de alertas: "DP-002 vence en 3 días" |
| **Grafo+Vectorial no implementado** | Baja | No se pueden hacer consultas transversales entre proyectos | Scripts de población desde artefactos md (pendiente) |
| **No hay dashboard visual del estado** | Baja | Todo es md, no hay vista gráfica del progreso | Generar diagramas Mermaid desde los artefactos (bajo coste, alto impacto) |
| **No hay integración con Jira/Slack/Teams** | Baja | El adaptador de salida es un CSV, no una conexión real | API de Jira para crear épicas/HU automáticamente |
| **No hay gestión de cambios de alcance con impacto económico** | Media | SC-XXX registra el cambio pero no calcula el impacto en presupuesto | Extender SC-XXX con campo "impacto económico" y "horas adicionales" |
| **No hay onboarding para nuevos PMs que usen el sistema** | Baja | Un PM nuevo necesita leer todo CLAUDE.md para entender el sistema | Crear guía rápida de inicio (5 pasos) |

## 🛠️ Workarounds (soluciones para casos límite)

| Situación | Workaround | Documentado en |
|---|---|---|
| **El proyecto no tiene legacy** | Se salta Paso -1 y se va directo a Paso 0 con guia-estandar-paso-0.md | CLAUDE.md, bootstrap |
| **El equipo no tiene datos históricos** | Se usa estimación del TL con fiabilidad BAJA y horquilla amplia (±30%) | cuestionario-capacidad.md |
| **El DoR/DoD no está definido al llegar a Paso 3** | Se usan los templates base de `diseno/paso-3-gestion-sprints/templates/` | README Paso 3 |
| **La IA no puede crear archivos (chat web)** | Modo guía: instrucciones exactas de qué crear y dónde | bootstrap-proyecto.md |
| **El cliente no sabe qué priorizar** | El sistema propone priorización basada en valor + riesgo + dependencias | README Paso 2.4 |
| **El proyecto tiene un equipo de 1 persona** | Se ajustan los factores de especialidad: esa persona es el cuello de botella en todo | cuestionario-capacidad.md (factor especialidad) |
| **El PM no tiene tiempo para el cuestionario completo** | Modo mixto: responde lo esencial ahora, completa el resto después | cuestionario-capacidad.md, definir-dor-dod.md |
| **El DoD del proyecto es muy pesado (>40%)** | Sugerir DoD ligero para MVP y completo para producción | definir-dor-dod.md (guía al PM) |

## 🔧 Mejoras para la siguiente versión

| Mejora | Prioridad | Esfuerzo estimado | Depende de |
|---|---|---|---|
| **Calibrar factor DoD con datos reales del primer sprint** | Alta | Bajo | Retrospectiva Sprint 1 |
| **Recalcular velocidad automáticamente al final de cada sprint** | Alta | Bajo | Ya está en retrospectiva, solo hay que formalizarlo |
| **Añadir "horas reales" en daily log para comparar con estimadas** | Media | Bajo | Cambio en template daily log |
| **Ofrecer plantillas de DoR/DoD por tipo de proyecto** (web, mobile, data, infra) | Media | Medio | Investigar patrones comunes por tipo |
| **Añadir preguntas sobre presupuesto y recursos en la guía de entrevista (Paso 0)** | Media | Bajo | Actualizar guia-estandar-paso-0.md |
| **Sistema de alertas proactivas** (deadlines próximas, riesgos sin revisar) | Media | Alto | Requiere scheduler o integración con calendario |
| **Dashboard Mermaid desde artefactos** | Baja | Bajo | Script que parsea md y genera diagramas |
| **Scripts de población del grafo Neo4j** | Baja | Alto | Definir esquema primero |
| **Integración Jira vía API** | Baja | Alto | Requiere autenticación y mapeo de campos |
| **Guía rápida de inicio para nuevos PMs** | Baja | Bajo | Crear `GUIA-RAPIDA.md` |

---

## Histórico de auditorías

| Fecha | Proyecto fuente | Versión del sistema | Cambios aplicados tras esta auditoría |
|---|---|---|---|
| 2024-06-28 | Diseño inicial + Caso E-T | V1 | Creación de este documento. Gaps identificados para priorizar |
