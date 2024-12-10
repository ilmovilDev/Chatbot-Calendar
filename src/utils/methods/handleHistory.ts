import { BotStateStandAlone } from "@builderbot/bot/dist/types";
import { ChatCompletionMessageParam } from "openai/resources";

/**
 * Propiedades necesarias para la gestión del historial.
 */
type HistoryProps = {
    entry?: ChatCompletionMessageParam[]; // Nuevo mensaje a agregar al historial.
    botState: BotStateStandAlone; // Estado independiente del bot.
    historyLimit?: number; // Límite de mensajes para recuperar o procesar.
};

/**
 * Agrega un nuevo mensaje al historial del bot.
 * @param entry - Mensaje que se desea agregar al historial.
 * @param botState - Estado del bot donde se almacena el historial.
 */
const updateHistory = async ({ entry, botState }: HistoryProps): Promise<void> => {
    //if (!entry) return;
    // const history = botState.get<ChatCompletionMessageParam[]>("history") ?? [];
    // history.push(entry);
    await botState.update({ entry });
};

/**
 * Obtiene el historial limitado a un número especificado de mensajes.
 * @param botState - Estado del bot donde se almacena el historial.
 * @param historyLimit - Número máximo de mensajes a devolver.
 * @returns Array de mensajes limitados por el parámetro `historyLimit`.
 */
const getHistory = ({ botState, historyLimit = 30 }: HistoryProps): ChatCompletionMessageParam[] => {
    const history = botState.get<ChatCompletionMessageParam[]>("history") ?? [];
    return history.slice(-historyLimit);
};

/**
 * Obtiene el historial en formato de texto procesado.
 * @param botState - Estado del bot donde se almacena el historial.
 * @param historyLimit - Número máximo de mensajes a devolver.
 * @returns Historial formateado como un string para su uso.
 */
const getHistoryParse = ({ botState, historyLimit = 15 }: HistoryProps): string => {
    const history = getHistory({ botState, historyLimit });
    return history
        .map((message) =>
            message.role === "user"
                ? `Customer: "${message.content}"`
                : `\nSeller: "${message.content}"\n`
        )
        .join("");
};

/**
 * Limpia todo el historial almacenado en el estado del bot.
 * @param botState - Estado del bot donde se almacena el historial.
 */
const clearHistory = async ({ botState }: HistoryProps): Promise<void> => {
    await botState.update({ history: [] }); // Mejor que `clear()` para mayor control sobre los datos almacenados.
};

// Exportación de funciones
export { updateHistory, getHistory, getHistoryParse, clearHistory };
