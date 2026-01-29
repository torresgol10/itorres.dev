# Agentes del Sistema de Contenido

Este documento describe los agentes implementados en el sistema `content-agent-system`.

## 1. Researcher Agent (Investigador)
**Archivo:** `src/agents/researcher.ts`
**Modelo:** Gemini (Temperatura 0)
**Herramientas:** `scrapeUrlTool`

### Función
Recopilar información veraz y relevante sobre un tema específico. Puede navegar por internet si se proporciona una URL o utilizar su conocimiento interno.

### Flujo
1. **Análisis:** Determina qué buscar basándose en el `topic` o la URL proporcionada.
2. **Navegación (Opcional):** Si hay una URL, extrae el contenido.
3. **Síntesis:** Genera un resumen estructurado centrándose en:
   - Estadísticas clave.
   - Ideas novedosas.
   - Precisión técnica.

---

## 2. Writer Agent (Escritor)
**Archivo:** `src/agents/writer.ts`
**Modelo:** Gemini (Temperatura 0.7)

### Función
Generar borradores de artículos técnicos siguiendo guías de estilo estrictas.

### Modos
*   **MICRO MODE (Por defecto):** 200-300 palabras. Estructura rápida: Título, Hook, Solución, Código.
*   **DEEP MODE:** 500-800 palabras. Para guías o tutoriales. Estructura profunda: Contexto, Conceptos, Paso a Paso, Buenas Prácticas.

### Características
*   **Frontmatter:** Genera metadatos YAML obligatorios (título, resumen, categorías, autor).
*   **Estilo:** "Zero Fluff" (sin relleno), tono técnico y entusiasta, código moderno (ES6+).
*   **Revisión:** Capaz de refinar borradores basándose en críticas del agente Reflector.

---

## 3. Reflector Agent (Crítico)
**Archivo:** `src/agents/reflector.ts`
**Modelo:** Gemini (Temperatura 0)

### Función
Actuar como "Jefe de Edición" estricto para asegurar la calidad y el cumplimiento del estilo.

### Criterios de Evaluación
1.  **Zero Fluff:** Eliminar saludos y e introducciones vagas.
2.  **Estructura:** Verificar que cumple con la estructura del modo elegido (Micro/Deep).
3.  **Código Moderno:** Asegurar el uso de prácticas actuales.
4.  **Tono:** Debe ser entusiasta y apropiado.

### Salida
*   Si es perfecto: devuelve "PERFECT".
*   Si hay fallos: lista errores específicos para que el Writer los corrija.
