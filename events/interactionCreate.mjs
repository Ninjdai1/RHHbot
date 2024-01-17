/*import { buttonList } from "../interactions/buttons/index.mjs";
import { modalList } from "../interactions/modals/index.mjs";
import { selectMenuList } from "../interactions/selectmenus/index.mjs";
*/

export default {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (
            interaction.isChatInputCommand() ||
            interaction.isContextMenuCommand()
        ) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                try {
                    await interaction.reply({
                        content:
                            "There was an error while executing this command!",
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        } else if (interaction.isButton()) {
            buttonList[interaction.customId.split("_")[0]]
                ? buttonList[interaction.customId.split("_")[0]].execute(
                      interaction,
                      client,
                  )
                : errorMessage(interaction);
        } else if (interaction.isStringSelectMenu()) {
            selectMenuList[interaction.customId.split("_")[0]].execute(
                interaction,
                client,
            );
        } else if (interaction.isModalSubmit()) {
            modalList[interaction.customId.split("_")[0]]
                ? modalList[interaction.customId.split("_")[0]].execute(
                      interaction,
                      client,
                  )
                : errorMessage(interaction);
        } else {
            console.log(interaction);
        }
    },
};

function errorMessage(interaction) {
    interaction.reply({
        content: "Si vous encounter this error, please contact @ninjdai !",
        ephemeral: true,
    });
}
