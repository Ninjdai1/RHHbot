import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import config from "../../config.json" assert { type: "json" };
const { repo } = config;

export default {
    data: new SlashCommandBuilder()
        .setName("issue")
        .setDescription("Create an issue")
        .addStringOption(option => 
            option
                .setName("type")
                .setDescription("Type of issue")
                .setRequired(true)
                .addChoices(
                    { name: '⚔️ Battle Engine mechanical bugs 🐛', value: 'battle_engine' },
                    { name: '🧠 Battle AI bugs 🐛', value: 'battle_ai' },
                    { name: '🙏 Feature Request 🙏', value: 'feature_request' },
                    { name: '💾 Other errors 🖥️', value: 'other' },
                )
        )
        .addStringOption((option) =>
            option
                .setName("title")
                .setDescription("Quick description of the issue")
                .setRequired(true),
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        const type = interaction.options.getString("type");
        const title = interaction.options.getString("title");

        const issue_url = `https://github.com/${repo.owner}/${repo.name}/issues/new?assignees=&labels=${templates[type].labels}&projects=&template=${templates[type].template}&contact=${interaction.user.tag}&title=${title.replaceAll(" ", "+")}`;

        const issueROW = new ActionRowBuilder().setComponents([
            new ButtonBuilder()
                .setURL(issue_url)
                .setLabel(title.length > 80 ? `${title.substring(0, 77)}...` : title)
                .setStyle(ButtonStyle.Link)
        ])

        await interaction.editReply({
            content: `To report your issue, click on the button below and fill out the issues form !`,
            components: [issueROW],
        });
    },
};

const templates = {
    battle_engine: {
        template: "01_battle_engine_bugs.yaml",
        labels: "bug%2Cstatus%3A+unconfirmed%2Ccategory%3A+battle-mechanic"
    },
    battle_ai: {
        template: "02_battle_ai_issues.yaml",
        labels: "bug%2Cstatus%3A+unconfirmed%2Ccategory%3A+battle-ai"
    },
    feature_request: {
        template: "03_feature_requests.yaml",
        labels: "feature-request"
    },
    other: {
        template: "04_other_errors.yaml",
        labels: "bug%2Cstatus%3A+unconfirmed"
    },
}
