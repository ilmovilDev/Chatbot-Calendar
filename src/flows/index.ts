import { createFlow } from "@builderbot/bot";
import welcome_flow from "./welcome_flow";

export const adapterFlow = createFlow([
    welcome_flow,
])