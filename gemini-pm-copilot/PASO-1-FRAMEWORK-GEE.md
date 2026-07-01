# PASO 1: FRAMEWORK GEE (RIESGOS Y DEPENDENCIAS)

INPUT NECESARIO: Requisitos funcionales, requisitos no funcionales y zonas de incertidumbre.

SI NO TIENES ESTOS DATOS, pide al usuario que primero haga el Paso 0 (Captura de Requisitos).

---

## SUBPASO 1: CHECK INIT

Evalua estos 16 puntos. Para cada uno, di si esta OK o NO.

La lista es:
1. COMUNICACION: Hay canales definidos con el cliente?
2. VALIDACION: El cliente sabe cuando y como validar?
3. PLANIFICACION: Hay un plan inicial?
4. RIESGOS: Se han identificado riesgos?
5. CALIDAD: Hay criterios de calidad definidos?
6. SEGUIMIENTO: Como se va a seguir el progreso?
7. DOCUMENTACION: Donde se guarda todo?
8. VP: Hay un Product Owner o quien prioriza?
9. PRESENTACION: Hay reuniones de revision?
10. DEPENDENCIAS: El proyecto depende de algo externo?
11. CAMBIO: Como se gestionan los cambios?
12. LECCIONES: Como se aprende de los errores?
13. SEGURIDAD: Hay requisitos de seguridad?
14. CIERRE: Cuando y como se cierra el proyecto?
15. EVENTOS: Hay hitos importantes?
16. MEDIOS: El equipo tiene las herramientas necesarias?

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso1/01-check-init.md con este contenido:"

Muestra los 16 puntos con OK o NO.

## SUBPASO 2: PERFIL DEL PROYECTO

Calcula el perfil segun estas reglas:

- BAJO (10): Proyecto pequeno, equipo conocido, sin riesgos grandes
- MEDIO (30): Proyecto normal, algun riesgo moderado
- ALTO (60): Proyecto grande, varios riesgos, fechas ajustadas
- CRITICO (100): Proyecto muy grande, muchas incertidumbres, alta presion

Pregunta al usuario cosas como:
- "Cuantas personas en el equipo?"
- "Cual es el plazo?"
- "Es una tecnologia que ya conoceis?"
- "Hay dependencias externas?"

Asigna un valor del perfil.

## SUBPASO 3: IDENTIFICAR RIESGOS

Identifica riesgos del proyecto. USA ESTA LISTA:

- Riesgo de plazo (no llegar a tiempo)
- Riesgo tecnologico (no saber la tecnologia)
- Riesgo de requisitos (requisitos cambiantes)
- Riesgo de equipo (falta personal, rotacion)
- Riesgo de dependencias (algo externo que bloquea)
- Riesgo de presupuesto (coste mayor del previsto)
- Riesgo de calidad (el producto no funciona bien)
- Riesgo de comunicacion (mal entendidos con el cliente)

Para CADA riesgo que aplique, asigna:
- R-001, R-002... (codigo)
- Probabilidad: 0.1 (muy baja) a 0.9 (muy alta)
- Impacto: 0.05 (muy bajo) a 0.8 (muy alto)
- Descripcion: que pasa si ocurre?
- Plan de mitigacion: que hacer para evitarlo?

## SUBPASO 4: CALCULAR RAG

Para cada riesgo:
1. PESO = Probabilidad x Impacto x Perfil
2. RAG:
   - PESO < 10 = VERDE (bajo riesgo)
   - PESO entre 10 y 30 = AMARILLO (riesgo medio)
   - PESO > 30 = ROJO (alto riesgo)

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso1/02-registro-riesgos.md con este contenido:"

Muestra la tabla completa:

| Codigo | Riesgo | Prob | Impacto | Perfil | PESO | RAG |
|--------|--------|------|---------|--------|------|-----|
| R-001 | No llegar a plazo | 0.5 | 0.6 | 30 | 9.0 | VERDE |
| R-002 | ... | ... | ... | ... | ... | ... |

## SUBPASO 5: IDENTIFICAR DEPENDENCIAS

Identifica DEPENDENCIAS (cosas que TIENEN que pasar para que el proyecto avance).

Ejemplos:
- Terceros: "El proveedor X tiene que entregar la API"
- Internas: "El equipo de diseno tiene que dar los mockups"
- Legales: "El cliente tiene que firmar el contrato"
- Tecnicas: "Hay que tener el servidor configurado"

Cada dependencia: DP-001, DP-002...

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso1/03-registro-dependencias.md con este contenido:"

## SUBPASO 6: IDENTIFICAR ACCIONES

Identifica ACCIONES (cosas que HAY QUE HACER ya).

Cada accion: A-001, A-002...
Cada accion tiene: responsable y fecha limite.

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso1/04-registro-acciones.md con este contenido:"

## SUBPASO 7: DOS VISTAS

Crea una version SIMPLIFICADA para el cliente (solo los riesgos ROJOS y AMARILLOS, sin numeros tecnicos).

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso1/05-vista-stakeholders.md con este contenido:"

## FIN DEL PASO

Pregunta: "¿Quieres continuar con el Roadmap (capacidad del equipo y planificacion)?"
