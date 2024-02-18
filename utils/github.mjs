import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../config.json" assert { type: "json" };
const { repo } = config;

async function generatePRComponentsFromMessage(message, client) {
    const matchComponents = [];
    const matches = message.content.match(/#\d+/g);
    if (matches) {
        for (const match of matches) {
            const issue_number = Number(match.replace("#", ""));
            if (issue_number <= 20) continue;
            if (global.prButtonCache[issue_number]) {
                matchComponents.push(global.prButtonCache[issue_number]);
            } else {
                try {
                    const response = await client.github.request(
                        "GET /repos/{owner}/{repo}/issues/{issue_number}",
                        {
                            owner: repo.owner,
                            repo: repo.name,
                            issue_number: issue_number,
                        },
                    );

                    const component = generateMatchButton(response);
                    global.prButtonCache[issue_number] = component;
                    matchComponents.push(component);

                } catch (response) {
                    if (response.status == 404) return;
                    else {
                        console.log(response);
                    }
                }
            }
        }
    }
    return matchComponents;
}


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

export { generateMatchButton, generatePRComponentsFromMessage };
