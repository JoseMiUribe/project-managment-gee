# Guía para entrevista con el cliente — Plataforma E-T

**Instrucciones para el PM:** Esta guía combina las aclaraciones pendientes del análisis previo (Parte A) con la captura de requisitos nuevos (Parte B). Úsala como esquema de la reunión. El Anexo es para tu uso interno.

---

## Parte A: Aclarar dudas del análisis previo ⚠️

Antes de hablar de lo nuevo, resuelve estos puntos de la documentación existente que están contradictorios o ambiguos.

### A.1 Permisos del Director (crítico)

> La documentación dice que el Director firma informes pero no debe ver datos clínicos. Sin embargo, la implementación actual le da acceso porque se modeló como un "Jefe de Estudios con firma". Esto es un riesgo RGPD.

**Pregunta para el cliente:**
- El Director, ¿debe ver el contenido de los informes que firma o solo la metadata (título, fecha, alumno)?
- Si no debe verlos, ¿quién más puede firmar en su lugar? ¿Hay un flujo de "firma ciega"?

### A.2 Reportes financieros (afecta al alcance del MVP)

> El MVP excluye explícitamente la gestión financiera. Pero en la demo de informes aparecieron "Facturas", "Cobros" y "Pedidos".

**Pregunta para el cliente:**
- Esos reportes, ¿son para facturar licencias SaaS de E-T a los centros (interno) o para gestión financiera del centro (cobros a familias)?
- Si es gestión financiera, ¿esto entra en el MVP o lo quitamos para no dispersar el foco?

### A.3 Validez legal de la firma digitalizada (riesgo alto)

> Se ha decidido usar una imagen PNG escaneada de la rúbrica en lugar de firma electrónica (Autofirma, Docusign).

**Pregunta para el cliente:**
- ¿Hay un dictamen legal que confirme que la firma PNG escaneada tiene validez ante inspección educativa?
- ¿Qué pasa si un informe psicopedagógico es impugnado? ¿Necesitamos firma electrónica real?

### A.4 Automatización de incidencias con IA

> La IA propone automáticamente la gravedad de una incidencia (nivel 1-3). El principio de "humano en el ciclo" exige validación.

**Pregunta para el cliente:**
- Cuando la IA sugiere una gravedad, ¿quién la valida antes de guardarla? ¿El profesor puede cambiarla manualmente?
- ¿Preferís que la incidencia se guarde en borrador hasta que alguien la confirme?

### A.5 Coordinador de Bienestar

**Pregunta para el cliente:**
- El Coordinador de Bienestar, ¿es un perfil nuevo con su propio login y acceso, o es cualquier Orientador/Director que activa ese rol adicional?

### A.6 Criterios de gravedad de incidencias

**Pregunta para el cliente:**
- ¿Tenéis definida una matriz con ejemplos concretos de qué va en nivel 1, 2 y 3? Si no, ¿la definimos juntos?

### A.7 Interacción con familias

**Pregunta para el cliente:**
- Las familias, aparte de entregar el consentimiento firmado en papel, ¿tendrán acceso a la plataforma en el futuro? ¿Cómo lo veis?

---

## Parte B: Lo nuevo que queréis construir 🎯

### B.1 Contexto de negocio

- ¿Cuál es el problema o necesidad principal que motiva este proyecto? (validar que sigue siendo el mismo)
- ¿Quiénes son los usuarios finales? ¿Hay algún perfil nuevo no contemplado?
- ¿Cómo vais a medir el éxito? ¿Tenéis KPIs u OKRs definidos?

### B.2 Funcionalidades concretas

- De los 7 módulos actuales, ¿hay alguno que haya cambiado de prioridad?
- ¿Hay funcionalidades nuevas que no estén en los requisitos actuales?
- Para cada funcionalidad:
  - ¿Qué hace exactamente? ¿Para quién? ¿En qué momento?
  - ¿Qué pasa si falla? (flujo alternativo)
  - ¿Quién puede hacer cada cosa? (roles y permisos)
  - ¿Hay reglas de negocio específicas?

### B.3 Requisitos técnicos

- ¿Cuántos usuarios concurrentes esperáis en el centro piloto?
- ¿Dónde se despliega? ¿Cloud ya decidido?
- ¿Hay normativa adicional que cumplir además de LOPIVI y RGPD?
- ¿Qué disponibilidad necesitáis? (24/7, horario lectivo...)
- ¿Integraciones con otros sistemas que sean nuevas?
- ¿Requisitos de rendimiento específicos?

### B.4 Visión futura (6-12 meses)

- ¿Qué sabéis de lo que viene después del MVP?
- ¿Hay funcionalidades que NO deben estar en esta fase? (validar exclusiones actuales)
- ¿Dependencias externas previstas? (equipos, proveedores, aprobaciones)
- ¿Decisiones ya tomadas que condicionen el futuro?

### B.5 Equipo y organización

- ¿Quién valida y aprueba los entregables? ¿Con qué cadencia?
- ¿Cómo se gestionan las prioridades?
- ¿Qué herramientas usáis para seguimiento? (Jira, Confluence, etc.)
- ¿Equipo técnico ya asignado o lo ponéis vosotros?
- ¿Metodología preferida? (SCRUM, Kanban...)

---

## Anexo: Riesgos detectados (para ti, PM)

Estos riesgos no se llevan al cliente directamente, pero tenlos en cuenta:

| ID | Riesgo | Acción sugerida |
|---|---|---|
| R-001 | Firma PNG sin validez legal → retraso y coste no previsto | Conseguir dictamen legal antes de Sept 2026 |
| R-002 | Reportes financieros distraen el foco del MVP | Forzar decisión clara de alcance en esta reunión |
| R-003 | No hay plan de pruebas definido | Exigir plan antes de producción |
| R-004 | No hay plan de adopción → profesores no usan el sistema | Solicitar plan de formación y cambio |
| R-005 | IA procesando datos fuera de UE → ilegal según RGPD | Confirmar con Cloudflare la ubicación del procesamiento |

## Documentación que debería traer el cliente (si existe)

- [ ] Dictamen legal sobre firma digitalizada
- [ ] Roadmap actual del proyecto
- [ ] Plan de migración desde Fidias/Raíces/Sodo
- [ ] KPIs u OKRs del proyecto
