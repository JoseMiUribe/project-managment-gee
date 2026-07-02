# PASO 0: CAPTURA DE REQUISITOS

## SUBPASO 1: RECOGER INFORMACION

Si vienes de Legacy, usa la informacion que ya tienes.
Si no, preguntale al usuario: "Cuentame que necesitas. Que funcionalidades debe tener el sistema?"

## SUBPASO 2: CLASIFICAR

PRODUCE una lista clasificando cada peticion en:

RF = REQUISITO FUNCIONAL (algo que el sistema HACE)
RNF = REQUISITO NO FUNCIONAL (como debe ser: rendimiento, seguridad, etc.)

Ejemplo:

```markdown
## Peticiones del cliente (en bruto)

1. [peticion textual del cliente]
2. [peticion textual del cliente]

## Requisitos Funcionales

| Codigo | Descripcion |
|--------|-------------|
| RF-001 | El sistema debe permitir... |
| RF-002 | Los usuarios pueden... |

## Requisitos No Funcionales

| Codigo | Descripcion | Tipo |
|--------|-------------|------|
| RNF-001 | La pagina debe cargar en <2s | Rendimiento |
| RNF-002 | Solo accesible con login | Seguridad |
```

## SUBPASO 3: DESCUBRIR RNF IMPLICITOS

Piensa que RNF adicionales se necesitan aunque el cliente no los haya pedido:

- Seguridad: ¿proteccion de datos?
- Rendimiento: ¿tiempo de respuesta maximo?
- Usabilidad: ¿quien usa el sistema?
- Disponibilidad: ¿tiene que estar 24/7?
- Privacidad: ¿datos personales? (RGPD)

Anadelos a la lista de RNF.

## SUBPASO 4: ZONAS DE INCERTIDUMBRE

Identifica que NO ESTA CLARO.

```markdown
## Zonas de Incertidumbre

| Codigo | Descripcion | Impacto |
|--------|-------------|---------|
| ZI-001 | No sabemos cuantos usuarios | ALTO |
| ZI-002 | No sabemos fecha de entrega | MEDIO |
```

## SUBPASO 5: VALIDAR

Pregunta: "¿Este analisis es correcto? ¿Falta algo?"

Espera el OK.

## FIN

Pregunta: "¿Quieres continuar con el Framework GEE (riesgos)?"
