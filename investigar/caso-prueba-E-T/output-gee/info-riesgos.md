# Info Riesgos — Catálogo de Riesgos Comunes

**Proyecto:** Plataforma de Orientación Integral E-T
**Perfil:** Alto (multiplicador 60)

## Instrucciones

Seleccionar los riesgos aplicables al inicio del proyecto. Los seleccionados se incorporan al registro-riesgos.md con los valores por defecto ajustables.

## Catálogo

| ID | Riesgo | Tipo | Prob. base | Imp. base | Ámbito | Aplicable | Notas |
|---|---|---|---|---|---|---|---|
| CAT-01 | RFP/pliego impreciso o incompleto | alcance | Media | Alto | Externo | ✅ | Dispersión entre documento original y nuevos hallazgos de la entrevista |
| CAT-02 | Equipo junior sin experiencia en el dominio | equipo | Baja | Medio | Interno | ❌ | Equipo mix con seniority suficiente |
| CAT-03 | Muchas dependencias externas no controladas | dependencias | Alta | Alto | Externo | ✅ | Raíces, Cloudflare UE, dictamen legal, Fidias |
| CAT-04 | Cambios de alcance frecuentes sin control | alcance | Alta | Alto | Interno | ✅ | Vista familias y enfermería ya aparecieron como nuevos hallazgos |
| CAT-05 | Calendario agresivo / fecha límite inamovible | plazos | Alta | Alto | Externo | ✅ | Septiembre 2026 es fecha fija (inicio curso escolar) |
| CAT-06 | Baja adopción por usuarios finales | adopción | Media | Alto | Interno | ✅ | Profesores con iPads, resistencia al cambio, sin plan de formación |
| CAT-07 | Datos sensibles de menores mal gestionados | seguridad/legal | Media | Muy Alto | Interno | ✅ | RGPD, LOPIVI, firma legal sin dictamen |
| CAT-08 | Dependencia de terceros para integraciones | terceros | Alta | Alto | Externo | ✅ | Raíces (Comunidad de Madrid), Fidias |
| CAT-09 | Proveedor cloud sin garantía de soberanía de datos | seguridad/legal | Media | Muy Alto | Externo | ✅ | Cloudflare iSearch: confirmar procesamiento en UE |
| CAT-10 | Sobrecoste de IA por tokens no presupuestado | costes | Media | Medio | Interno | ✅ | Sin estrategia de costes de IA más allá del Dynamic Gateway Proxy |
| CAT-11 | Rotación del equipo técnico | equipo | Baja | Alto | Interno | ❌ | Sin indicios |
| CAT-12 | Documentación técnica insuficiente para mantenimiento | técnico | Media | Medio | Interno | ✅ | Sin modelo de datos detallado, sin plan de pruebas |
| CAT-13 | Falta de implicación del cliente en validaciones | cliente | Media | Alto | Externo | ⚠️ | Cliente dispuesto pero sin dedicación exclusiva (Ana es PO pero tiene otras responsabilidades) |
| CAT-14 | Requisitos no funcionales ignorados hasta el final | técnico | Alta | Alto | Interno | ✅ | RNFs definidos tarde, algunos implícitos no validados |
