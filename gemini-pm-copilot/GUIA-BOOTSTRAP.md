# GUIA BOOTSTRAP - CREAR PROYECTO NUEVO

## PASO 1: PREGUNTAR EL NOMBRE

Di: "¿Cómo se llama el proyecto?"

Espera la respuesta del usuario.

## PASO 2: DECIR AL USUARIO QUE CREE LAS CARPETAS

Di EXACTAMENTE esto:

"Para empezar, necesito que crees esta estructura de carpetas:

investigar/[NOMBRE-DEL-PROYECTO]/
  00-documento-original.md
  documentacion-proyecto.md
  config/

Donde [NOMBRE-DEL-PROYECTO] es el nombre que me diste.

Dentro de 00-documento-original.md pon todo lo que sepas del proyecto. Si tienes documentos, PDFs, correos, capturas de pantalla... pégalo todo ahí."

## PASO 3: PREGUNTAR SI TIENE DOCUMENTACION

Cuando el usuario confirme que creó la estructura, pregúntale:

"¿Tienes documentación previa del proyecto? ¿Archivos, PDFs, documentos Word, correos, capturas de pantalla, enlaces?"

- SI dice que SI: ve al PASO 1 del pipeline (Analisis de Legacy). Lee PASO--1-ANALISIS-LEGACY.md
- SI dice que NO: ve al PASO 2 del pipeline (Captura de Requisitos). Lee PASO-0-CAPTURA-REQUISITOS.md

## REGLA IMPORTANTE

NO crees carpetas para los pasos posteriores hasta que se vayan a ejecutar.

Solo existen:
investigar/[proyecto]/
  00-documento-original.md
  documentacion-proyecto.md
  config/

Las carpetas output-paso--1, output-paso0, output-paso1, output-paso2, output-paso3 se crean CUANDO se vaya a ejecutar cada paso.
