# Agentes del Proyecto Programming Blog

Este repositorio contiene un sistema de agentes inteligentes diseñado para la generación automatizada de contenido técnico.

## Sistema de Agentes de Contenido (`content-agent-system`)

La lógica principal de los agentes reside en el directorio `content-agent-system`. Este módulo orquesta un flujo de trabajo de múltiples agentes para investigar, escribir y refinar artículos de blog.

### Resumen de Agentes

| Agente | Rol | Descripción |
| :--- | :--- | :--- |
| **Researcher** | Investigación | Navega por la web y sintetiza datos técnicos para el escritor. |
| **Writer** | Redacción | Genera borradores en formatos "Micro" o "Deep" siguiendo estilos estrictos. |
| **Reflector** | Control de Calidad | Actúa como editor jefe, criticando y solicitando revisiones al escritor. |

Para más detalles técnicos sobre la implementación de cada agente, consulta el archivo:
[Documentación Detallada de Agentes](./content-agent-system/Agents.md)
