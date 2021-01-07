/**
 * This test file is used to test the basic functionality of the dashbaord.
 * It is also here to serve as an example implementation of the module.
 */
const { Client } = require("discord.js");
const chalk = require("chalk");
require("dotenv").config(); // Create a .env file or include your own config file
const Dashboard = require("./index");

/**
 * Create an instance of a Discord client
 */
const client = new Client();

const dashboard = new Dashboard(client, {
    port: 8080,
    clientSecret: process.env.clientSecret,
    redirectURI: `${process.env.DOMAIN}/auth/discord/callback`,
    sessionSecret:
        "abcdefghijklmnopqrstuvwxyz1234567890!@#$%¨&*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ",
});

client.on("ready", () => {
    console.log("Hello world!");
    dashboard.run();
});

const clean = (text) => {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};

client.on("message", (message) => {
    const args = message.content.split(" ").slice(1);

    if (message.content.startsWith(process.env.prefix + "eval")) {
        if (message.author.id !== process.env.ownerID) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
            console.log("Eval >> " + chalk.green(clean(evaled)));
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            console.log("Eval >> " + chalk.green(clean(err)));
        }
    }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/
client.login(process.env.TOKEN);
