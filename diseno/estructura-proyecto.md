# Estructura de proyecto para PM Copilot

**Propósito:** Todo proyecto gestionado con PM Copilot sigue esta estructura de directorios y archivos. La IA los crea automáticamente si puede, o indica al usuario qué crear si no.

---

## Árbol estándar

```
investigar/
  [nombre-proyecto]/
    00-documento-original.md       # (Input inicial) Documentación raw del cliente
    documentacion-proyecto.md      # (Oficial) Documento consolidado del proyecto. Se actualiza en cada paso
    README.md                      # (Opcional) Notas del proyecto
    config/                        # Configuración específica del proyecto
      dor-definition.md            # Definition of Ready (personalizado del template base)
      dod-definition.md            # Definition of Done (personalizado del template base)
    output-paso--1/                # Paso -1: Análisis de Legacy
      inventario-fuentes.md
      mapa-proyecto.md
      cuestionarios.md
      guia-paso-0.md
      documentacion-proyecto.md
    output-paso0/                  # Paso 0: Captura de Requisitos
      peticiones-cliente.md
      requisitos-funcionales.md
      requisitos-nofuncionales.md
      zonas-incertidumbre.md
    output-paso1/                  # Paso 1: Framework GEE
      check-init.md
      info-riesgos.md
      registro-riesgos.md
      registro-dependencias.md
      registro-acciones.md
      dailog/                      # Logs pre-sprint o entre fases (opcional)
    output-paso2/                  # Paso 2: Roadmap + Backlog
      epicas.md
      capacidad-equipo.md          # Versionado: V1, V2... dentro del mismo archivo
      roadmap-cliente.md
      roadmap-tecnico.md
      backlog-detalle.md
    output-paso3/                  # Paso 3: Gestión de Sprints
      sprint-candidates.md
      sprint-backlog.md
      dailylog/                    # Daily logs del sprint actual
      review-sprint-1.md
      lecciones-sprint-1.md
      review-sprint-2.md
      lecciones-sprint-2.md
      ...
    output-grafo/                  # (Futuro) Datos para poblar grafo/vectorial
```

## Reglas

1. **Por defecto**, la IA crea la estructura automáticamente si tiene capacidad de crear archivos (OpenCode, Claude Code, Gemini CLI, Copilot CLI)
2. **Si la IA es solo chat** (ChatGPT web, Claude web), la IA muestra las instrucciones exactas de qué archivos crear y dónde
3. **Los directorios de cada paso se crean al llegar a ese paso**, no todos al inicio. El bootstrap inicial solo crea:
   - `investigar/[nombre-proyecto]/`
   - `investigar/[nombre-proyecto]/00-documento-original.md`
   - `investigar/[nombre-proyecto]/config/`
4. **Los directorios output-paso-X se crean cuando se ejecuta ese paso**, no antes (YAGNI)
5. **Si el usuario ya tiene documentación**, se coloca en `00-documento-original.md` y los directorios output se crean según se avanza
