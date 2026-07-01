# PASO 0: CAPTURA DE REQUISITOS

## SUBPASO 1: LEER INPUT DEL CLIENTE

Pide al usuario que revise 00-documento-original.md y añada todo lo que el cliente quiere.

Si ya hay informacion de Legacy, usala. Si no, preguntale al usuario:
- "¿Que necesita el proyecto?"
- "¿Que funcionalidades debe tener?"
- "¿Hay algun documento con los requisitos?"

## SUBPASO 2: CLASIFICAR EN RF y RNF

Clasifica CADA peticion del cliente en:

RF = REQUISITO FUNCIONAL (algo que el sistema HACE)
   Ejemplo: "El sistema debe permitir subir archivos"
   Ejemplo: "Los usuarios pueden registrarse con email"

RNF = REQUISITO NO FUNCIONAL (como debe ser el sistema)
   Ejemplo: "La pagina debe cargar en menos de 2 segundos"
   Ejemplo: "Solo accesible para usuarios autenticados"
   Ejemplo: "Debe funcionar en Chrome y Firefox"

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso0/01-peticiones-cliente.md con este contenido:"

Muestra el listado de peticiones en bruto.

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso0/02-requisitos-funcionales.md con este contenido:"

Muestra los RF numerados: RF-001, RF-002...

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso0/03-requisitos-nofuncionales.md con este contenido:"

Muestra los RNF numerados: RNF-001, RNF-002...

## SUBPASO 3: DESCUBRIR RNF IMPLICITOS

Piensa que requisitos NO FUNCIONALES adicionales se necesitan aunque el cliente no los haya pedido.

Ejemplos de cosas que el cliente no dice pero se necesitan:
- Seguridad: ¿como se protegen los datos?
- Rendimiento: ¿cuanto tiempo maximo de respuesta?
- Mantenibilidad: ¿quien va a mantener el sistema?
- Disponibilidad: ¿tiene que estar siempre funcionando?
- Usabilidad: ¿quien usa el sistema? ¿saben usar tecnologia?
- Privacidad: ¿hay datos personales? (RGPD, LOPD)

Añade estos RNF a la lista.

## SUBPASO 4: ZONAS DE INCERTIDUMBRE

Identifica que cosas NO ESTAN CLARAS. Preguntale al usuario.

Ejemplos:
- "No sabemos cuantos usuarios usaran el sistema"
- "No sabemos si hay que integrarse con otro sistema"
- "No sabemos la fecha de entrega"
- "No sabemos el presupuesto"

Di al usuario: "Crea el archivo investigar/[proyecto]/output-paso0/04-zonas-incertidumbre.md con este contenido:"

Muestra las zonas de incertidumbre numeradas: ZI-001, ZI-002...

## SUBPASO 5: VALIDAR CON EL USUARIO

Pregunta: "¿Estos requisitos son correctos? ¿Falta algo? ¿Hay que cambiar algo?"

Espera a que el usuario diga "OK" para continuar.

## FIN DEL PASO

Pregunta: "¿Quieres continuar con el Framework GEE (riesgos)?"
