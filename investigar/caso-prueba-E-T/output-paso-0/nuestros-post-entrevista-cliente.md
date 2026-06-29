# Post-entrevista con el cliente — E-T

**Fecha:** 2024-06-26 (simulada)
**Asistentes:** Josemi (PM), Ana (Product Owner E-T), Carlos (Arquitecto Técnico)
**Duración:** 1h 45min

---

## Respuestas a las contradicciones (Parte A)

### A.1 Permisos del Director

> **Respuesta del cliente:** "El Director tiene que ver el informe completo para poder firmarlo con conocimiento de causa. No tiene sentido firmar algo que no has leído. Pero si hay datos muy sensibles (como informes psiquiátricos), que se pueda marcar como 'solo orientador'."

**Conclusión:** Modelo híbrido: por defecto el Director ve todo, pero el Orientador puede marcar documentos concretos como "restringidos a dirección".

### A.2 Reportes financieros

> **Respuesta del cliente:** "Queremos las dos cosas. Necesitamos facturar las licencias a los centros, y los centros necesitan gestionar cobros a familias. Si no lo hacemos nosotros, tienen que usar Fidias y es otro sistema más. Preferiríamos tenerlo todo en E-T."

**⛔ Alternativa a considerar:** Esto duplica el esfuerzo del MVP y los mete en gestión financiera, que no es su core. Quizás conviene facturación de licencias SÍ (es interno y necesario), pero gestión financiera del centro NO (sigue en Fidias).

### A.3 Validez legal de la firma

> **Respuesta del cliente:** "No hemos consultado a un abogado. Pensamos que con la imagen escaneada vale, como hacemos ahora en papel. Preguntadle vosotros a vuestro departamento legal si podéis."

**Conclusión:** Pendiente de consulta legal. No bloquea, pero es riesgo alto.

### A.4 Automatización de incidencias

> **Respuesta del cliente:** "La IA puede proponer la gravedad, pero que el profesor tenga que confirmarla antes de guardar. Y que pueda cambiarla si no está de acuerdo. El Coordinador de Bienestar también debería poder re-clasificarla después."

**Conclusión:** Flujo: IA propone → profesor confirma/cambia → guarda → Coordinador puede re-clasificar.

### A.5 Coordinador de Bienestar

> **Respuesta del cliente:** "Es un permiso que se activa sobre un perfil existente. Normalmente será un Orientador o el Director. No hace falta un login nuevo."

**Conclusión:** Flag booleano sobre el perfil. Validar que el RLS herede los permisos correspondientes.

### A.6 Criterios de gravedad

> **Respuesta del cliente:** "No lo tenemos definido. ¿Podéis proponer una matriz y la validamos juntos? Necesitamos ejemplos reales porque los profesores se quejan de que no saben si algo es nivel 1 o 2."

**Conclusión:** Nosotros proponemos matriz → cliente valida.

### A.7 Interacción con familias

> **Respuesta del cliente:** "Las familias nos están pidiendo poder ver las notas de sus hijos y las incidencias. No queremos un portal entero, pero sí algo básico. ¿Podríamos añadir una vista de familia muy sencilla? Solo consulta, que no puedan escribir nada."

**🚨 Hallazgo nuevo:** El cliente quiere una vista básica para familias, aunque estaba excluido del MVP. Habrá que evaluar esfuerzo y si entra o no.

---

## Nuevos requisitos capturados (Parte B)

### B.1 Contexto de negocio
- El problema principal sigue siendo el mismo: fragmentación de la información
- Aparece un perfil nuevo: **Enfermería escolar** (no previsto, lo piden algunos centros)
- KPI propuesto por el cliente: reducir tiempo de redacción de informes en un 50%
- Otros KPIs: % de incidencias registradas vs reportadas verbalmente, tiempo medio de respuesta a incidencias nivel 3

### B.2 Funcionalidades nuevas detectadas
1. **Vista básica de familias** (solo consulta, read-only): notas, incidencias, comunicación unidireccional
2. **Módulo de enfermería escolar**: registro de medicación, alergias, visitas a enfermería, autorizaciones
3. **Exportación a Raíces**: necesidad de generar el fichero oficial de la Comunidad de Madrid desde E-T

### B.3 Requisitos técnicos
- Usuarios concurrentes: centro piloto ~200, escalar a 5000 en multi-centro
- Cloud ya decidido: Supabase + Cloudflare (sin cambios)
- Disponibilidad: horario lectivo (8:00-18:00) con picos a primera hora

### B.4 Visión futura
- Fase 2: Portal de familias completo, analítica predictiva
- Fase 3: Integración bi-direccional con Fidias y Raíces
- Decisión ya tomada: NO usar Inteligencia Artificial para decisiones automáticas sobre menores (solo asistencia)

### B.5 Equipo y organización
- Valida: Ana (PO) + Comité semanal con dirección del centro
- Herramientas: Jira (ya lo usan)
- Equipo técnico: 3 desarrolladores frontend, 2 backend, 1 QA (puesto por E-T)
- Metodología: SCRUM con sprints de 2 semanas

---

## Nuevos hallazgos (no previstos en el análisis)

### 🆕 H-001: Módulo de Enfermería
El cliente quiere incluir gestión de enfermería escolar (medicación, alergias, visitas). No estaba en el MVP original pero varios centros lo piden. Habrá que evaluar si entra o lo dejamos para Fase 2.

### 🆕 H-002: Exportación a Raíces
Necesitan poder generar el fichero oficial de la Comunidad de Madrid desde E-T. No es una integración en tiempo real, solo exportación batch.

### 🆕 H-003: Los profesores usan iPad, no Windows
El centro piloto usa iPads en el aula. La plataforma debe ser fully responsive. Confirmar que ShadCN + React lo soporta bien.

### 🆕 H-004: Calendario escolar no está estandarizado
Cada centro tiene un calendario distinto (inicio de curso, festivos, evaluaciones). El sistema debe permitir configurar el calendario por centro.

---

## Documentación que trajo el cliente

- [x] Roadmap actual del proyecto (visión general, sin fechas concretas)
- [ ] Dictamen legal sobre firma digitalizada (pendiente, lo piden a su abogado)
- [ ] Plan de migración desde Fidias/Raíces/Sodo (no existe, piden ayuda para crearlo)
- [ ] KPIs u OKRs del proyecto (los verbalizaron pero no están documentados)
