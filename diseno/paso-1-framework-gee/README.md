# Paso 1: Framework GEE

## Propósito
Gestionar dependencias, riesgos, acciones, impedimentos, cambios de alcance y bitácora diaria durante todo el ciclo de vida del proyecto.

## Catálogo META (valores canónicos)

| Concepto | Valores | Pesos |
|---|---|---|
| Probabilidad | Muy Baja / Baja / Media / Alta / Muy Alta | 0.1 / 0.3 / 0.5 / 0.7 / 0.9 |
| Impacto | Muy Bajo / Bajo / Medio / Alto / Muy Alto | 0.05 / 0.1 / 0.2 / 0.4 / 0.8 |
| Perfil proyecto | Perfil bajo / Perfil medio / Perfil alto / Perfil crítico | 10 / 30 / 60 / 100 |
| RAG | Rojo / Amarillo / Verde | Calculado del peso |
| Estado riesgo | Abierto / Impacto / Cerrado | — |
| Respuesta | Evitarlo / Reducirlo / Aceptarlo / Transferirlo | — |
| Ámbito | Interno / Externo | — |
| Nivel gestión | Operativo / Táctico / Estratégico | — |
| Estado dependencia | Detectada / Comunicada / Negociada / En Resolución / Resuelta | — |
| Estado acción | Pendiente / En curso / Bloqueada / Cerrada | — |
| Objetivos impactados | Coste / Alcance / Plazo / Calidad | Booleanos |

**Cálculo**: Peso del riesgo = Probabilidad × Impacto × MultiplicadorProyecto

**RAG automático** (configurable):
- Verde: peso < 10
- Amarillo: peso 10–30
- Rojo: peso > 30

## Artefactos del GEE

### 1. Riesgos (`registro-riesgos.md`)
| Campo | Tipo |
|---|---|
| ID (R-XXX) | Auto |
| Fecha alta | Date |
| Riesgo | Text (descripción) |
| Consecuencia | Text |
| Tipo | alcance, cliente, equipo, plazos, logístico, técnico, seguridad/legal, penalizaciones, terceros, adopción, costes, dependencias |
| Probabilidad | Muy Baja → Muy Alta |
| Impacto | Muy Bajo → Muy Alto |
| Ámbito | Interno / Externo |
| Respuesta | Evitarlo / Reducirlo / Aceptarlo / Transferirlo |
| Estado | Abierto / Impacto / Cerrado |
| Coste afectado | Bool |
| Alcance afectado | Bool |
| Plazo afectado | Bool |
| Calidad afectada | Bool |
| Mitigación | Text (plan, vinculado a acciones A-XXX) |
| Responsable | Text |
| Peso | Numérico (calculado) |
| RAG | Rojo / Amarillo / Verde (calculado) |
| Consideraciones | Text |
| Relacionado con | [D-XXX, A-XXX, SC-XXX] |
| Fecha update | Date |

### 2. Vista simplificada de riesgos (`riesgos-stakeholders.md`)
Mismos datos, vista reducida para presentación a stakeholders. Oculta pesos, incluye mitigación legible.

### 3. Dependencias (`registro-dependencias.md`)
| Campo | Tipo |
|---|---|
| ID (DP-XXX) | Auto |
| Equipo | Text |
| Dependencia | Text |
| Criticidad RAG | Rojo / Amarillo / Verde |
| Sistema 1 | Text |
| Sistema 2 | Text |
| Sistema 3 | Text |
| Estado | Detectada / Comunicada / Negociada / En Resolución / Resuelta |
| Fecha compromiso | Date |
| Riesgos asociados | [R-XXX] |
| Comentarios | Text (histórico de actualizaciones) |

### 4. Acciones (`registro-acciones.md`)
| Campo | Tipo |
|---|---|
| ID (A-XXX) | Auto |
| Acción | Text |
| Tipo | Preventiva / Correctiva / Mitigación / Contingencia |
| Riesgo asociado | R-XXX |
| Dependencia asociada | DP-XXX (opcional) |
| Responsable | Text |
| Deadline | Date |
| Estado | Pendiente / En curso / Bloqueada / Cerrada |

### 5. Impedimentos (`registro-impedimentos.md`)
| Campo | Tipo |
|---|---|
| ID (IM-XXX) | Auto |
| Impedimento | Text |
| Criticidad | Rojo / Amarillo / Verde |
| Fecha inicio | Date |
| Fecha fin | Date |
| Responsable | Text |
| Riesgo origen | R-XXX (si se materializó un riesgo) |
| Dependencia origen | DP-XXX (si viene de dependencia bloqueada) |

### 6. ChangeLog (`changelog.md`)
| Campo | Tipo |
|---|---|
| ID (SC-XXX) | Auto |
| Título | Text |
| Descripción | Text |
| Impacto | Text libre |
| Impacto coste | Bool |
| Impacto alcance | Bool |
| Impacto plazo | Bool |
| Impacto calidad | Bool |
| Decisión | Aceptado / Rechazado / Aplazado |
| Comentarios | Text |
| Riesgos generados | [R-XXX] |
| Dependencias generadas | [DP-XXX] |
| Acciones generadas | [A-XXX] |

### 7. DailyLog (`dailylog/YYYY-MM-DD.md`)
| Campo | Tipo |
|---|---|
| Fecha | Date |
| Entrada | Text (libre) |
| Relaciones | [R-XXX, DP-XXX, A-XXX, SC-XXX, IM-XXX] (tags) |

### 8. Catálogo de riesgos (`info-riesgos.md`)
Plantilla con riesgos comunes precargados (ej: "RFP impreciso", "Equipo junior", "Muchas dependencias externas"). El PM selecciona los aplicables al inicio del proyecto.

### 9. Check Init (`check-init.md`)
Checklist de 16 puntos para verificar que el proyecto arranca correctamente:
1. Comunicación
2. Validación producto
3. Planificación
4. Riesgos
5. Calidad
6. Seguimiento
7. Documentación y priorización
8. VP / gestión interna
9. Presentación resultados
10. Dependencias
11. Gestión cambio
12. Lecciones aprendidas
13. Seguridad y protección datos
14. Cierre proyecto
15. Sesiones / eventos
16. Medios y permisos

Cada item no revisado puede generar automáticamente riesgos o acciones.

## Relaciones entre artefactos

```
ChangeLog (SC-XXX) ──genera──▶ Riesgos (R-XXX), Dependencias (DP-XXX), Acciones (A-XXX)
Riesgos (R-XXX) ──tiene──▶ Acciones (A-XXX)
Riesgos materializados ──▶ Impedimentos (IM-XXX)
Dependencias (DP-XXX) ──genera──▶ Riesgos (R-XXX)
Dependencias bloqueadas ──▶ Impedimentos (IM-XXX)
DailyLog ──referencia──▶ Cualquier artefacto (R, DP, A, SC, IM)
```
