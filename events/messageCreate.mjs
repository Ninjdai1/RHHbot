import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../config.json" assert { type: "json" };
const { repo } = config;

export default {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        const matches = message.content.match(/#\d+/g);
        if(matches) {
            const matchComponents = [];
            for(const match of matches) {
                try {
                    const response = await client.github.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
                        owner: repo.owner,
                        repo: repo.name,
                        issue_number: match.replace("#", ""),
                    });
                    matchComponents.push(generateMatchButton(response));
                } catch{}
            }
            if(matchComponents.length > 0) await message.reply({ components: matchComponents.slice(0, 5), allowedMentions: { repliedUser: false } });
        }
    }
}

function generateMatchButton(response) {
    const matchROW = new ActionRowBuilder()
        .setComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`https://github.com/${repo.owner}/${repo.name}/pulls/${response.data.number}`)
                .setLabel(`#${response.data.number} - ${response.data.title}`)
        ])
    return matchROW
}
