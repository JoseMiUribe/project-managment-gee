# Template: Definition of Done (DoD)

**Propósito:** Establecer qué significa que una HU está "terminada".
**Importante:** Este template es un **punto de partida**. Cada equipo/proyecto debe personalizarlo.

## Cómo usar

1. Al empezar un proyecto, preguntar al equipo: "¿Qué condiciones debe cumplir una HU para considerarse DONE?"
2. Usar este template como base
3. Personalizar según el proyecto (una HU en un MVP puede tener DoD más ligero que en producción crítica)
4. Guardar la versión acordada como `dod-definition.md` en `investigar/[proyecto]/config/`

## Checklist base

| # | Criterio | Descripción | Evidencia |
|---|---|---|---|
| DOD-01 | Código implementado | El código de la HU está escrito y sigue los estándares del proyecto | Pull request abierto |
| DOD-02 | Code review realizado | Al menos un compañero ha revisado el código | PR aprobado + mergeado |
| DOD-03 | Pruebas unitarias pasan | Las pruebas unitarias existentes + las nuevas pasan | CI verde |
| DOD-04 | Pruebas de integración pasan | Los flujos que integran esta HU con otras funcionan | Tests de integración verdes |
| DOD-05 | Criterios de aceptación cumplidos | Se verifican todos los criterios definidos en la HU | Demo con PO |
| DOD-06 | Sin bugs conocidos críticos | No hay bugs abiertos de severidad crítica o alta asociados a la HU | Bug tracker limpio |
| DOD-07 | Documentación actualizada | Si la HU cambia comportamiento observable, la documentación se actualiza | Docs actualizadas |
| DOD-08 | Desplegado en entorno de pruebas | La HU está disponible en un entorno donde el PO pueda validarla | URL del entorno |
| DOD-09 | Validado por PO | El Product Owner ha validado la HU en el entorno de pruebas | PO dice OK |
| DOD-10 | Sin regresiones | Las funcionalidades existentes que podrían verse afectadas siguen funcionando | Tests de regresión verdes |

## Criterios opcionales (según el proyecto)

| # | Criterio | Cuándo aplica |
|---|---|---|
| DOD-11 | Pruebas de seguridad | Proyectos con datos sensibles (menores, salud, financiero) |
| DOD-12 | Pruebas de rendimiento | Si la HU afecta a tiempos de respuesta críticos |
| DOD-13 | Accesibilidad validada | Proyectos con requisitos WCAG |
| DOD-14 | Traducciones completas | Proyectos multi-idioma |
| DOD-15 | Log de auditoría verificado | Proyectos con requisitos legales de trazabilidad |

## Estados DoD

| Estado | Significado |
|---|---|
| ✅ Done | Cumple todos los criterios obligatorios |
| 🟡 Done con deuda | Se acepta con algún criterio opcional pendiente (acordado con PO) |
| ❌ No Done | No cumple criterios obligatorios. Vuelve a desarrollo |

## DoR vs DoD

```
Backlog → [DoR] → Sprint → [DoD] → Producción
               ⬇                  ⬇
         ¿Está Ready?        ¿Está Terminado?
         Lo valida PM        Lo valida PO + Equipo
```
