import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import config from "../../config.json" assert { type: "json" };
const { repo } = config;

export default {
    data: new SlashCommandBuilder()
        .setName("pr")
        .setDescription("Display a PR")
        .addIntegerOption((option) =>
            option
                .setName("id")
                .setDescription("The PR's ID")
                .setRequired(true),
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const ID = interaction.options.getInteger("id");
        try {
            const response = await client.github.request(
                "GET /repos/{owner}/{repo}/issues/{issue_number}",
                {
                    owner: repo.owner,
                    repo: repo.name,
                    issue_number: ID,
                },
            );

            const prEMBED = generatePREMBED(response);

            await interaction.editReply({ embeds: [prEMBED] });
        } catch (response) {
            if (response.status == 404)
                return interaction.editReply({
                    content: "This PR does not exist",
                });
        }
    },
};

function generatePREMBED(response) {
    const EMBED = new EmbedBuilder()
        .setTitle(`#${response.data.number} - ${response.data.title}`)
        .setURL(
            `https://github.com/${repo.owner}/${repo.name}/pulls/${response.data.number}`,
        )
        .setAuthor({
            name: response.data.user.login,
            iconURL: response.data.user.avatar_url,
            url: response.data.user.html_url,
        })
        .setDescription(response.data.body.slice(0, 4000));
    return EMBED;
}
