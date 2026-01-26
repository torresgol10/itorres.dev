
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { styles, WriterStyle } from "../prompts/styles";

export const writerNode = async (state: typeof AgentState.State) => {
    const model = new ChatGoogleGenerativeAI({ model: "gemini-3-flash-preview", temperature: 0.7 });

    const isRevision = state.revisionCount > 0;
    const styleKey = (state.writerStyle as WriterStyle) || "web-dev";
    const selectedStylePrompt = styles[styleKey] || styles["web-dev"];

    console.log(isRevision
        ? `--- Writer Agent (Gemini): Revising (Iteration ${state.revisionCount}) [Style: ${styleKey}] ---`
        : `--- Writer Agent (Gemini): Writing Content [Style: ${styleKey}] ---`);

    // --- SYSTEM PROMPT DEFINITION ---
    const systemPrompt = `${selectedStylePrompt}
Eres un **Senior Technical Writer y Divulgador de Software** (estilo "Midudev" o "rauchg").
Tu misión es transformar ideas o documentación técnica en posts altamente efectivos, legibles y prácticos.
Audiencia: Desarrolladores (Juniors a Seniors) que valoran su tiempo.

### DINÁMICA DE MODOS (SELECTOR AUTOMÁTICO)
Analiza el input y elige:
1. **MODO MICRO (Default):** Tips rápidos, snippets. (200-300 palabras). Estructura: Título, Gancho, Solución (API), Código, Matiz Senior.
2. **MODO DEEP:** Si piden "guía", "tutorial", "profundidad". (500-800 palabras). Estructura: Título (Promesa), Contexto Real, Conceptos Clave, Implementación Paso a Paso, Buenas Prácticas vs Errores, Conclusión.

### REGLAS DE ESTILO (NO NEGOCIABLES)
- **Cero Relleno:** Elimina saludos ("Hola a todos"), intros obvias o conclusiones vacías. AL GRANO.
- **Tono:** Cercano, técnico, moderno, entusiasta.
- **Código:** Especifica lenguaje. Usa ES6+, HTML semántico, CSS moderno.
- **Filosofía:** Cómo se usa HOY en producción. Nada de historia irrelevante.

### FUENTES
Usa esta información investigada (si aplica) pero NO menciones "he buscado en internet":
${state.researchData}
`;

    let userContent = "";

    if (isRevision) {
        userContent = `Refine the previous post based strictly on this CRITIQUE:
    ${state.critique}
    
    PREVIOUS POST:
    ${state.draft}
    
    Maintain the style and fix ONLY what is necessary.`;
    } else {
        userContent = `Write a post about: "${state.topic}". 
    Decide yourself if MICRO MODE or DEEP MODE is appropriate for the topic.`;
    }

    const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userContent)
    ]);

    return {
        draft: response.content as string,
        revisionCount: isRevision ? state.revisionCount + 1 : 1,
        messages: [response],
    };
};
