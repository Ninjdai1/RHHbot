import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../config.json" assert { type: "json" };
const { repo } = config;

export default {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        const matches = message.content.match(/#\d+/g);
        if (matches) {
            const matchComponents = [];
            for (const match of matches) {
                const issue_number = Number(match.replace("#", ""));
                if (issue_number <= 20) continue;
                try {
                    const response = await client.github.request(
                        "GET /repos/{owner}/{repo}/issues/{issue_number}",
                        {
                            owner: repo.owner,
                            repo: repo.name,
                            issue_number: issue_number,
                        },
                    );
                    matchComponents.push(generateMatchButton(response));
                } catch (response) {
                    if (response.status == 404) return;
                    else {
                        console.log(response);
                    }
                }
            }
            if (matchComponents.length > 0) {
                const reply = await message.reply({
                    components: matchComponents.slice(0, 5),
                    allowedMentions: { repliedUser: false },
                });
                global.messageReplyCache[message.id] = reply;
            }
        }
    },
};

function generateMatchButton(response) {
    const label = `#${response.data.number} - ${response.data.title}`;
    const matchROW = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://github.com/${repo.owner}/${repo.name}/pull/${response.data.number}`,
            )
            .setLabel(
                label.length > 80 ? `${label.substring(0, 77)}...` : label,
            ),
    ]);
    return matchROW;
}
