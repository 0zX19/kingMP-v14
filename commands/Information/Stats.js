const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const { stripIndent } = require("common-tags");
const { owner } = require("../../settings/config.js");


module.exports = {
    config: {
      name: "stats",
      description: "Displays the bot status.",
      category: "Information",
      aliases: ["status"],
    },
    run: async (client, message) => {
// STATS
let guilds = client.guilds.cache.size;
let channels = client.channels.cache.size;
let users = client.guilds.cache.reduce((size, g) => size + g.memberCount, 0);

// CPU
let platform = process.platform.replace(/win32/g, "Windows");
let architecture = os.arch();
let cores = os.cpus().length;
let cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;
let model = os.cpus()[0].model;
let speed = `${os.cpus()[0].speed} MHz`;

// RAM
let botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
let botAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
let botUsage = `${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(1)}%`;

let overallUsed = `${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} GB`;
let overallAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
let overallUsage = `${Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)}%`;

// UPTIME
let uptime = moment.duration(message.client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");

// DEVELOPER
let developer = `<@795708124442918913>`;


let desc = "";
desc += `❒ Developer: ${developer}\n`;
desc += `❒ Total guilds: ${guilds}\n`;
desc += `❒ Total users: ${users}\n`;
desc += `❒ Ping: ${client.ws.ping} ms\n`;
desc += `❒ Speed: ${speed}\n`;
desc += "\n";

const embed = new EmbedBuilder()
  .setTitle("System Information")
  .setColor(client.color)
  .setThumbnail(client.user.displayAvatarURL())
  .setDescription(desc)
  .addFields(
    {
      name: "CPU",
      value: stripIndent`
      ❯ **OS:** ${platform} [${architecture}]
      ❯ **Cores:** ${cores}
      ❯ **Usage:** ${cpuUsage}
      `,
      inline: true,
    },
    {
      name: "Bot's RAM",
      value: stripIndent`
      ❯ **Used:** ${botUsed}
      ❯ **Available:** ${botAvailable}
      ❯ **Usage:** ${botUsage}
      `,
      inline: true,
    },
    {
      name: "Overall RAM",
      value: stripIndent`
      ❯ **Used:** ${overallUsed}
      ❯ **Available:** ${overallAvailable}
      ❯ **Usage:** ${overallUsage}
      `,
      inline: true,
    },
    {
      name: "Uptime",
      value: "```" + uptime + "```",
      inline: false,
    },
    {
      name: "System",
      value: "```" + model + "```",
      inline: false,
    }
  );

return message.channel.send({ embeds: [embed] });
    },
};
