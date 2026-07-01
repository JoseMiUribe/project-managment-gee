# PM Copilot — Gemini CLI Agent Skill

Skill de agente para [Gemini CLI](https://geminicli.com) que implementa el pipeline completo de gestión de proyectos: análisis de legacy, captura de requisitos, gestión de riesgos (GEE), roadmap con capacidad de equipo, y gestión de sprints.

## Instalación

Desde tu terminal:

```bash
gemini skills install https://github.com/JoseMiUribe/project-managment-gee.git --path skills/pm-copilot-gemini
```

Esto lo instala en `~/.gemini/skills/pm-copilot/` (ámbito usuario).

Para instalarlo como skill del workspace (compartido con el equipo vía git):

```bash
gemini skills install https://github.com/JoseMiUribe/project-managment-gee.git --path skills/pm-copilot-gemini --scope workspace
```

## Verificar instalación

```bash
gemini skills list
```

## Usar el skill

Simplemente inicia una sesión de Gemini CLI en el directorio del repositorio clonado y di algo como:

> "Necesito empezar un nuevo proyecto llamado 'MiApp'"

o

> "Vamos a hacer el análisis de legacy del proyecto X"

## Requisitos

- Tener el repositorio clonado o accesible como workspace
- El skill lee los prompts y templates de `diseno/` dentro del repositorio

## Estructura del skill

```
skills/pm-copilot-gemini/
  SKILL.md        → Instrucciones del skill (esto)
```
