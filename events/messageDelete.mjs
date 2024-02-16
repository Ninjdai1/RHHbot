
export default {
    name: "messageDelete",
    async execute(message, client) {
        if (message.author.bot) return;
        const matches = message.content.match(/#\d+/g);
        if (matches && global.messageReplyCache[message.id]) {
            await global.messageReplyCache[message.id].delete();
        }
    },
};
