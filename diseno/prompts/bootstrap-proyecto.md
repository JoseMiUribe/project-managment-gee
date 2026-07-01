# Prompt: Bootstrap de Proyecto

**Propósito:** Inicializar un nuevo proyecto en PM Copilot. Crear la estructura de directorios y el archivo de entrada.

## Instrucciones para la IA

Cuando el usuario dice "vamos a empezar un proyecto nuevo" o similar:

### Fase 1: Preguntar nombre del proyecto

"¿Cómo se llama el proyecto? Con ese nombre crearé la estructura de trabajo."

### Fase 2: Detectar capacidad de crear archivos

Evalúa si puedes crear archivos en local:

- **Modo AUTO**: Si tienes herramientas para crear archivos (Write, Bash, etc.) y el usuario te ha dado permiso para trabajar en el sistema de archivos → crea los directorios y archivos automáticamente
- **Modo GUÍA**: Si eres un chat sin capacidad de crear archivos (ChatGPT web, Claude web) → muestra las instrucciones exactas

### Fase 3: Crear estructura (Modo AUTO)

```
1. Crear investigar/[nombre-proyecto]/
2. Crear investigar/[nombre-proyecto]/config/
3. Crear investigar/[nombre-proyecto]/00-documento-original.md
4. Crear investigar/[nombre-proyecto]/README.md (opcional)
```

**Paso a paso:**

1. Crea el directorio raíz del proyecto
2. Crea el subdirectorio `config/`
3. Crea `00-documento-original.md` con el siguiente contenido base:

```markdown
# Documento Original — [Nombre del Proyecto]

> **Propósito:** Documentación inicial del proyecto proporcionada por el cliente.
> **Fecha de creación:** [YYYY-MM-DD]
> **Forma de entrada:** [Conversación / Documento PDF / Enlace / Email / Otros]

---

## Información del proyecto

[El usuario pega aquí la documentación del cliente: requisitos, enlaces, PDFs,
capturas, etc. Todo lo que se sepa del proyecto en este momento.]

---

## Notas del PM

[El PM puede añadir contexto adicional, conversaciones previas, decisiones
tomadas antes de usar PM Copilot, etc.]
```

4. Crea `documentacion-proyecto.md` a partir del template `diseno/templates/documentacion-proyecto.md`. Este documento se actualizará al final de cada paso con la información consolidada.
5. **Pregunta por el tipo de proyecto** para ofrecer DoR/DoD adecuados:

   "¿Qué tipo de proyecto es?"
   - a) **Web app** (SaaS, dashboard, CRUD)
   - b) **Mobile app** (iOS/Android)
   - c) **Data platform** (analytics, pipelines, ML)
   - d) **API / Backend** (microservicios)
   - e) **MVP / Prototipo** (prueba de concepto)
   - f) **No lo sé / Otro** → se usarán los templates base genéricos

   Según la respuesta, copia la plantilla correspondiente de `diseno/paso-3-gestion-sprints/templates/por-tipo/` a `config/dor-definition.md` y `config/dod-definition.md`. Si el usuario ya tiene DoR/DoD propios (responde "f" o dice tenerlos), no copies nada y deja que los defina después.

5. Si el usuario tiene documentación ya preparada, la coloca en `00-documento-original.md`

### Fase 3b: Mostrar instrucciones (Modo GUÍA)

Si no puedes crear archivos, muestra:

```
He preparado la estructura para tu proyecto "[nombre]". 
Crea estos archivos en tu máquina:

1. Crea la carpeta: investigar/[nombre-proyecto]/
2. Dentro, crea: config/ (subcarpeta)
3. Crea el archivo: 00-documento-original.md
   con el contenido:

   ---
   # Documento Original — [Nombre del Proyecto]
   ...
   ---

4. (Si tienes DoR/DoD propios) Crea dentro de config/:
   - dor-definition.md
   - dod-definition.md

Cuando tengas los archivos creados, pégame aquí la documentación 
del proyecto y empiezo con el análisis.
```

### Fase 4: Confirmar y explicar

"Estructura creada. ¿Tienes ya documentación del proyecto para poner en `00-documento-original.md`?"

Cuando el usuario proporcione la documentación:
1. La guarda en `00-documento-original.md`
2. Pregunta: "¿Empezamos con el Paso -1 (Análisis de Legacy) o el Paso 0 (Captura de Requisitos)?"

### Reglas

- **YAGNI**: Solo crea los directorios de los pasos cuando se vayan a ejecutar. No crees todos al inicio
- Si el proyecto no tiene legacy, se salta el Paso -1 y se va directo al Paso 0
- El README.md del proyecto es opcional. Solo se crea si el usuario quiere añadir notas
- Los templates base (DoR, DoD) están en `diseno/paso-3-gestion-sprints/templates/` y los específicos por tipo en `.../templates/por-tipo/`
