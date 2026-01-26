
import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    topic: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    researchData: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    draft: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    critique: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    revisionCount: Annotation<number>({
        reducer: (x, y) => y ?? x,
        default: () => 0,
    }),
    writerStyle: Annotation<string>({
        reducer: (x, y) => y ?? x,
        default: () => "web-dev",
    }),
});
