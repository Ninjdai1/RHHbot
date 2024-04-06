import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../config.json" assert { type: "json" };
const { repo } = config;

async function generatePRComponentsFromMessage(message, client) {
    const matchComponents = [];
    const content = message.content
        .replace(/`[^``]*`/g)//Ignore everything between `s
        .replace(/\[(.*?)\]\(.*?\)/g)//Ignore everything inside a []()-formatted link
    const rhhMatches = content
        .match(/(^|\s)#\d+/g);//Match # followed by any number
    const pretMatches = content
        .match(/pret#\d+/g);//Match pret# followed by any number

    const fetchedMatches = [];
    const fetchedPretMatches = [];
    if (rhhMatches) {
        for (const match of rhhMatches) {
            const issue_number = Number(match.replace("#", ""));
            if (issue_number <= 20 || fetchedMatches.includes(issue_number) || matchComponents.length == 5) continue;
            if (global.prButtonCache["rhh"][issue_number]) {
                matchComponents.push(global.prButtonCache["rhh"][issue_number]);
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

                    const component = generateMatchButton(response, repo.owner, repo.name);
                    global.prButtonCache["rhh"][issue_number] = component;
                    matchComponents.push(component);

                } catch (response) {
                    if (response.status == 404) return;
                    else {
                        console.log(response);
                    }
                }
            }
            fetchedMatches.push(issue_number);
        }
    }
    if (pretMatches) {
        for (const match of pretMatches) {
            const issue_number = Number(match.replace("pret#", ""));
            if (issue_number <= 20 || fetchedPretMatches.includes(issue_number) || matchComponents.length == 5) continue;
            if (global.prButtonCache["pret"][issue_number]) {
                matchComponents.push(global.prButtonCache["pret"][issue_number]);
            } else {
                try {
                    const response = await client.github.request(
                        "GET /repos/{owner}/{repo}/issues/{issue_number}",
                        {
                            owner: "pret",
                            repo: "pokeemerald",
                            issue_number: issue_number,
                        },
                    );
                    console.log(response)

                    const component = generateMatchButton(response, "pret", "pokeemerald");
                    global.prButtonCache["pret"][issue_number] = component;
                    matchComponents.push(component);

                } catch (response) {
                    if (response.status == 404) return;
                    else {
                        console.log(response);
                    }
                }
            }
            fetchedMatches.push(issue_number);
        }
    }
    return matchComponents;
}


function generateMatchButton(response, owner, name) {
    const label = `${owner=="pret" ? "pret" : ""}#${response.data.number} - ${response.data.title}`;
    const matchROW = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://github.com/${owner}/${name}/pull/${response.data.number}`,
            )
            .setLabel(
                label.length > 80 ? `${label.substring(0, 77)}...` : label,
            ),
    ]);
    return matchROW;
}

export { generateMatchButton, generatePRComponentsFromMessage };
