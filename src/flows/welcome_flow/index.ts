import { addKeyword, EVENTS } from "@builderbot/bot";
import conversational from "~/layers/conversational";
import determine from "~/layers/determine";

export default addKeyword([EVENTS.WELCOME])
    .addAction(determine)
    .addAction(conversational)