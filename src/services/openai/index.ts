import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { defaultChatConfig } from "~/utils/constants";

type CreateChatParams = {
    messages: ChatCompletionMessageParam[];
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
            const response = await this.openai.chat.completions.create({
                model: model || this.model,
                messages: [
                    { role: "system", content: prompt },
                    ...messages,
                ],
                ...this.defaultChatConfig,
            });

            return response.choices[0]?.message?.content || "No hay contenido disponible.";
        } catch (error) {
            this.logError("createChat", error);
            throw new Error("No se pudo completar el chat. Inténtalo de nuevo más tarde..");
        }
    }

    // PRIVATE METHODS
    private validateApiKey(apiKey: string): void {
        if (!apiKey || apiKey.trim().length === 0) {
            throw new Error("API key is missing or invalid.");
        }
    }

    private logError(methodName: string, error: unknown): void {
        console.error(`[OpenAIService.${methodName}]:`, error);
    }

}
