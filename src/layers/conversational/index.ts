import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { DATA } from "~/mockups";
import { PROMPT_CONVERSE } from "~/prompts";
import { OpenAIService } from "~/services/openai";
import { MESSAGES } from "~/utils/messages";
import handleErros from "~/utils/methods/handleErros";
import { getHistory, updateHistory } from "~/utils/methods/handleHistory";

export default async ({ body, name }: BotContext, { state, flowDynamic, extensions }: BotMethods ): Promise<void> => {

    const openai = extensions.openai as OpenAIService;
    const clientName = name ?? "Invitado"; // Nombre del cliente o "Invitado" si no está disponible.
    const newHistory = getHistory({ botState: state });

    newHistory.push({
        role: "user",
        content: body ?? "",
    });

    try {

        const prompt = PROMPT_CONVERSE.replace("{DATA}", DATA).replace("{NAME}", clientName)

        const response = await openai.createChat({
            messages: newHistory,
            prompt,
        });

        const chunks = response.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            await flowDynamic(chunk);
        }

        newHistory.push({
            role: "assistant",
            content: response,
        });

        await updateHistory({
            entry: newHistory,
            botState: state,
        });

    } catch (error) {
        handleErros({
            location: "LAYER[CONVERSATIONAL]",
            error,
            errorMessage: MESSAGES.ERROR_UPDATE_HISTORY,
        });
    }
};


// export default async ({ body, name }: BotContext, { state }: BotMethods ): Promise<void> => {

//     if (!body) {
//         console.warn(MESSAGES.WARN_EMPTY_MESSAGE);
//         return;
//     }

//     const newHistory = getHistory({ botState: state });

//     newHistory.push({
//         role: "user",
//         content: body,
//     });

//     try {
//         await updateHistory({
//             entry: newHistory,
//             botState: state,
//         });
//     } catch (error) {
//         handleErros({
//             location: "LAYER[CONVERSATIONAL]",
//             error,
//             errorMessage: MESSAGES.ERROR_UPDATE_HISTORY,
//         });
//     }

// };

