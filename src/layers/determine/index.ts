import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { PROMPT_DISCRIMINATOR } from "~/prompts";
import { OpenAIService } from "~/services/openai";
import { MESSAGES } from "~/utils/messages";
import handleErros from "~/utils/methods/handleErros";
import { getHistoryParse } from "~/utils/methods/handleHistory";

/**
 * Clasifica la intención del usuario basándose en un historial de conversación.
 * 
 * Esta función utiliza un modelo de OpenAI para analizar el historial de conversación entre un cliente
 * y un asistente virtual, determinando si la intención principal del cliente es **SCHEDULE** o **INQUIRE**.
 * 
 * @param _ - Contexto del bot (no utilizado en este caso).
 * @param methods - Métodos proporcionados por el bot, que incluyen:
 *   - `state`: Estado actual del bot para acceder al historial de conversación.
 *   - `flowDynamic`: Método para responder dinámicamente al cliente.
 *   - `gotoFlow`: Método para cambiar el flujo de la conversación.
 *   - `extensions`: Extensiones disponibles, incluyendo `openai`.
 * 
 * @throws {Error} Si ocurre un fallo durante el procesamiento de la intención.
 */
export default async(_: BotContext, {state, flowDynamic, extensions}: BotMethods) => {

    const openai = extensions.openai as OpenAIService;
    const history = getHistoryParse({ botState: state, historyLimit: 30 });
    const prompt = PROMPT_DISCRIMINATOR.replace("{HISTORY}", history);

    console.info(prompt)

    try {
        const { prediction } = await openai.determineChatFn(prompt);

        if (prediction.includes("SCHEDULE")) {
            // [TODO]: IMplementar la logica para agendar aqui!!!
            return flowDynamic("Cliente quiere agendar");
        }

    } catch (error) {
        handleErros({
            location: "LAYER[DETERMINE]",
            error,
            errorMessage: MESSAGES.ERROR_DETERMINE_INTENT
        });   
    }
}