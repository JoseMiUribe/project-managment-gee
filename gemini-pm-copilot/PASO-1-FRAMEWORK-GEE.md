# PASO 1: FRAMEWORK GEE (RIESGOS Y DEPENDENCIAS)

INPUT NECESARIO: Requisitos funcionales + no funcionales + zonas de incertidumbre.
Si no los tienes, pidelos.

## SUBPASO 1: CHECK INIT

Evalua estos 16 puntos. PRODUCE una tabla:

```markdown
## Check Init

| # | Punto | Estado |
|---|-------|--------|
| 1 | Comunicacion: canales con el cliente? | OK / NO |
| 2 | Validacion: cliente sabe cuando validar? | OK / NO |
| 3 | Planificacion: hay plan inicial? | OK / NO |
| 4 | Riesgos: identificados? | OK / NO |
| 5 | Calidad: criterios definidos? | OK / NO |
| 6 | Seguimiento: como se sigue el progreso? | OK / NO |
| 7 | Documentacion: donde se guarda? | OK / NO |
| 8 | VP: quien prioriza? | OK / NO |
| 9 | Presentacion: reuniones de revision? | OK / NO |
| 10 | Dependencias: algo externo? | OK / NO |
| 11 | Cambio: como se gestionan cambios? | OK / NO |
| 12 | Lecciones: como se aprende? | OK / NO |
| 13 | Seguridad: requisitos de seguridad? | OK / NO |
| 14 | Cierre: cuando se cierra? | OK / NO |
| 15 | Eventos: hitos importantes? | OK / NO |
| 16 | Medios: equipo tiene herramientas? | OK / NO |
```

## SUBPASO 2: PERFIL DEL PROYECTO

Pregunta al usuario:
- "Cuantas personas en el equipo?"
- "Cual es el plazo?"
- "Conoceis la tecnologia?"
- "Hay dependencias externas?"

Asigna perfil:
- BAJO (10): proyecto pequeno, equipo conocido, sin riesgos
- MEDIO (30): proyecto normal, algun riesgo
- ALTO (60): proyecto grande, varios riesgos
- CRITICO (100): proyecto muy grande, muchas incertidumbres

## SUBPASO 3: IDENTIFICAR RIESGOS

Identifica riesgos. Para cada uno:
- R-001, R-002...
- Probabilidad: 0.1 (baja) a 0.9 (alta)
- Impacto: 0.05 (bajo) a 0.8 (alto)
- Plan de mitigacion

Riesgos comunes: plazo, tecnologia, requisitos cambiantes, equipo, dependencias, presupuesto, calidad, comunicacion.

## SUBPASO 4: CALCULAR RAG

PESO = Probabilidad x Impacto x Perfil

RAG:
- PESO < 10 = VERDE
- PESO 10-30 = AMARILLO
- PESO > 30 = ROJO

PRODUCE:

```markdown
## Registro de Riesgos

Perfil: [BAJO/MEDIO/ALTO/CRITICO] = [10/30/60/100]

| Codigo | Riesgo | Prob | Impacto | PESO | RAG | Mitigacion |
|--------|--------|------|---------|------|-----|------------|
| R-001 | No llegar a plazo | 0.5 | 0.6 | 9.0 | VERDE | |
| R-002 | ... | ... | ... | ... | ... | |
```

## SUBPASO 5: DEPENDENCIAS

Identifica dependencias (cosas que TIENEN que pasar):

```markdown
## Registro de Dependencias

| Codigo | Dependencia | Quien | Fecha limite | Estado |
|--------|-------------|-------|-------------|--------|
| DP-001 | API del proveedor | Proveedor X | 15/03 | PENDIENTE |
```

## SUBPASO 6: ACCIONES

Identifica acciones (cosas que HAY QUE HACER ya):

```markdown
## Registro de Acciones

| Codigo | Accion | Responsable | Fecha limite | Estado |
|--------|--------|-------------|-------------|--------|
| A-001 | Contactar proveedor | JP | 01/03 | PENDIENTE |
```

## SUBPASO 7: VISTA STAKEHOLDERS (opcional)

Crea una version simplificada solo con los riesgos ROJOS y AMARILLOS, sin numeros tecnicos.

## FIN

Pregunta: "¿Quieres continuar con el Roadmap?"
