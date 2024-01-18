import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config.json" assert { type: "json" };
const { repo } = config;

export default {
    data: new SlashCommandBuilder()
        .setName("repo")
        .setDescription("Display information about the repo"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const repository = await client.github.request("GET /repos/{owner}/{repo}", {
                owner: repo.owner,
                repo: repo.name,
            });
            const pull_requests = await client.github.request("GET /search/issues", {
                q: `is:pr is:open owner:${repo.owner} repo:${repo.name}`,
            });

            const releases = await client.github.request("GET /repos/{owner}/{repo}/releases", {
                owner: repo.owner,
                repo: repo.name,
            });
            const latestRelease = releases.data[0];

            const statsEMBED = new EmbedBuilder()
                .setTitle("Repository Statisics")
                .setURL(`https://github.com/${repo.owner}/${repo.name}`)
                .addFields(
                    {
                        name: `🦠 Open Issues`,
                        value: `[${repository.data.open_issues}](https://github.com/${repo.owner}/${repo.name}/issues)`
                    },
                    {
                        name: `🎚️ Open PRs`,
                        value: `[${pull_requests.data.total_count}](https://github.com/${repo.owner}/${repo.name}/pulls)`
                    },
                    {
                        name: `📢 Latest Release`,
                        value: `[${latestRelease.name}](${latestRelease.html_url})`,
                    },
                    {
                        name: `⭐ Stars`,
                        value: `[${repository.data.stargazers_count}](https://github.com/${repo.owner}/${repo.name}/stargazers)`,
                    },
                    {
                        name: `💿 Size`,
                        value: `${Math.floor(repository.data.size/1024)} Mb`
                    }
                )

            const linksROW = new ActionRowBuilder()
                .setComponents([
                    new ButtonBuilder()
                        .setLabel("Issues")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://github.com/${repo.owner}/${repo.name}/issues`)
                        .setEmoji("1162024138207146096"),
                    new ButtonBuilder()
                        .setLabel("Pull Requests")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://github.com/${repo.owner}/${repo.name}/pulls`)
                        .setEmoji("1083791250064429166"),
                    new ButtonBuilder()
                        .setLabel("Latest Release")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${latestRelease.html_url}`)
                        .setEmoji("711653449816605216"),
                ])

            await interaction.editReply({ embeds: [ statsEMBED ], components: [linksROW] });
        } catch (error) {
            console.log(error)
            return interaction.editReply({
                content: "I encountered an error while fetching the repository...",
            });
        }
    },
};
