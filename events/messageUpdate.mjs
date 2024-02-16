import { generatePRComponentsFromMessage } from "../utils/github.mjs";


export default {
    name: "messageUpdate",
    async execute(oldMessage, message, client) {
        if (message.author.bot) return;
        if(global.messageReplyCache[message.id]) {
            const matchComponents = await generatePRComponentsFromMessage(message, client);
            if(matchComponents.length > 0) {
                await global.messageReplyCache[message.id].edit({ components: matchComponents });
            } else {
                await global.messageReplyCache[message.id].delete();
            }
        }
    },
};
