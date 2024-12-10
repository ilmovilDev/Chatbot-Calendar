import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { defaultChatConfig } from "~/utils/constants";
import { MESSAGES } from "~/utils/messages";
import handleErros from "~/utils/methods/handleErros";

type CreateChatParams = {
    messages?: ChatCompletionMessageParam[];
    prompt: string;
    model?: string;
};

type DefaultChatConfig = {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
};

export class OpenAIService {
    private openai: OpenAI;
    private readonly model: string;
    private readonly defaultChatConfig: DefaultChatConfig;

    constructor(apiKey: string, model: string) {
        this.validateApiKey(apiKey);
        this.openai = new OpenAI({ apiKey, timeout: 15000 });
        this.model = model;
        this.defaultChatConfig = defaultChatConfig;
    }

    async createChat({ messages, prompt, model }: CreateChatParams): Promise<string> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: model || this.model,
                messages: [
                    { role: "system", content: prompt },
                    ...messages,
                ],
                ...this.defaultChatConfig,
            });

            return completion.choices[0]?.message?.content || "No hay contenido disponible.";
        } catch (error) {
            handleErros({
                location: "OpenAIService[createChat]",
                error,
                errorMessage: MESSAGES.ERROR_CREATE_CHAT
            })
        }
    }

    async determineChatFn(prompt: string): Promise<{ prediction: string }> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "system", content: prompt }],
                functions: [
                    {
                        name: "fn_get_prediction_intent",
                        description: "Predict the user intention for a given conversation, such as scheduling or general inquiry.",
                        parameters: {
                            type: "object",
                            properties: {
                                prediction: {
                                    type: "string",
                                    description: "The predicted user intention.",
                                    enum: [
                                        "SCHEDULE", // To cover agendar, programar, marcar, etc.
                                        "INQUIRE",  // To cover consultas o preguntas generales.
                                    ],
                                },
                            },
                            required: ["prediction"],
                        },
                    },
                ],
                function_call: { name: "fn_get_prediction_intent" },
                ...this.defaultChatConfig,
            });
    
            const response = JSON.parse(completion.choices[0].message.function_call?.arguments || "{}");
            if (!response || !response.prediction) {
                throw new Error("No prediction returned.");
            }
    
            return response;
        } catch (error) {
            handleErros({
                location: "OpenAIService[determineChatFn]",
                error,
                errorMessage: MESSAGES.ERROR_DETERMINE_INTENT
            })
        }
    }
    
    // PRIVATE METHODS
    private validateApiKey(apiKey: string): void {
        if (!apiKey || apiKey.trim().length === 0) {
            throw new Error(MESSAGES.ERROR_INVALID_API_KEY);
        }
    }

}
