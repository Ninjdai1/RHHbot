import fs from "fs";
import { Client, GatewayIntentBits } from "discord.js";
import { deploy_commands, loadErrorCatcher, loadGithub } from "./functions.mjs";

import config from "./config.json" assert { type: "json" };
const { token } = config;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

loadErrorCatcher();
client.github = loadGithub();

const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".mjs"));
for (const file of eventFiles) {
    const { default: event } = await import(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`Loaded ${event.name} event !`);
}

deploy_commands(client, true);
/*
  true will refresh slash commands (SET endpoint)
  false will delete them (SET endpoint with an empty array)
  null will not change slash commands
*/

global.messageReplyCache = {};

client.login(token);
