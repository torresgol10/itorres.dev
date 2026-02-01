
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { styles } from "../prompts/styles";

import { createModel } from "../models/factory";

export const reflectorNode = async (state: typeof AgentState.State) => {
  const model = createModel("reflector", { temperature: 0 });

  console.log("--- Reflector Agent (Gemini): Critiquing ---");

  const styleKey = (state.writerStyle as any) || "web-dev";
  const selectedStylePrompt = (styles as any)[styleKey] || styles["web-dev"];

  const systemPrompt = `Eres el **Editor en Jefe** más estricto del mundo tech.
  Tu trabajo es asegurar que los posts sigan las REGLAS DE ESTILO definidas abajo.

  ### EL ESTILO ELEGIDO:
  ${selectedStylePrompt}
  
  ### VERIFICACIÓN CRÍTICA:
  1. **Adherencia**: ¿El borrador sigue las "STYLE RULES" EXACTAMENTE?
  2. **Sin Alucinaciones**: verifica la info de investigación.
  3. **Formato**: El Markdown debe estar limpio.
  4. **Frontmatter**: ¿Está presente la metadata?
  5. **Idioma**: ¿Está escrito en ESPAÑOL?
  
  Si el estilo dice "NO EMOJIS", entonces CUALQUIER emoji es un FALLO.
  Si el estilo dice "Zero Fluff", entonces "Hola amigos" es un FALLO.

  Si el borrador cumple todo y es excelente: responde solo "PERFECT".
  Si falla en algo: Lista los errores específicos para que el escritor los arregle. Sé directo y duro. Responde en ESPAÑOL.
  `;

  const userContent = `Critica este borrador sobre "${state.topic}":
  
  ${state.draft}
  
  Info de investigación (para verificar precisión):
  ${state.researchData}`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userContent)
  ]);

  const critique = response.content as string;

  return {
    critique: critique,
    messages: [response],
  };
};
