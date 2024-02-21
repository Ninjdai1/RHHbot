import { PermissionsBitField } from "discord.js";
import { generatePRComponentsFromMessage } from "../utils/github.mjs";

export default {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot || !message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return;
        const matchComponents = await generatePRComponentsFromMessage(
            message,
            client,
        );
        if (matchComponents?.length > 0) {
            const reply = await message.reply({
                components: matchComponents.slice(0, 5),
                allowedMentions: { repliedUser: false },
            });
            global.messageReplyCache[message.id] = reply;
        }
    },
};
