import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Collection } from "discord.js";
import fs from "fs";

import { Octokit } from "octokit";

import config from "./config.json" assert { type: "json" };
const { token, clientId, PAT } = config;

const rest = new REST({ version: "10" }).setToken(token);

async function deploy_commands(client, loadcommands) {
    if (typeof loadcommands != "boolean" && loadcommands != null)
        throw "loadcommands argument needs to be boolean or null";

    const commands = [];
    client.commands = new Collection();
    const commandCategories = fs
        .readdirSync("./commands")
        .filter((file) => !file.includes("."));
    console.log(`Loading ${commandCategories.toString()} commands...`);
    for (const category of commandCategories) {
        const commandFiles = fs
            .readdirSync(`./commands/${category}`)
            .filter((file) => file.endsWith(".mjs"));
        console.log(`Loading ${commandFiles.toString()}...`);
        for (const file of commandFiles) {
            const { default: command } = await import(
                `./commands/${category}/${file}`
            );
            commands.push(command.data);
            client.commands.set(command.data.name, command);

            console.log(`${category}/${command.data.name} chargé !`);
        }
    }
    if (loadcommands == true) {
        slashCommandLoad(client, commands);
        console.log("Refreshed slash commands !");
    } else if (loadcommands == false) {
        //Deletes slash commands
        slashCommandLoad(client, []);
        console.log("Deleted slash commands !");
    } else {
        console.log("Kept old commands");
    }
}

async function slashCommandLoad(client, commands) {
    try {
        console.log("Loading slash commands...");
        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });
        console.log("Slash commands loaded !");
    } catch (error) {
        console.error(error);
    }
    return client.commands;
}

function loadErrorCatcher() {
    console.log("Loading error catcher...");

    process.on("unhandledRejection", (reason, promise) => {
        console.log(reason, "\n", promise);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log(err, "\n", origin);
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(err, "\n", origin);
    });

    process.on("warning", (warn) => {
        console.log(warn);
    });

    console.log("Error catcher loaded !");
}

function loadGithub() {
    const octokit = new Octokit({});
    octokit.auth({ type: "token", token: PAT });

    return octokit;
}

export { deploy_commands, loadErrorCatcher, loadGithub };
