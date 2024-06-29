const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndents } = require("common-tags");
const GPrefix = require('../../settings/models/Prefix');

module.exports = {
    config: {
        name: "help",
        aliases: ["h", "halp", "commands"],
        usage: "(command)",
        category: "Utility",
        description: "Displays all commands that the bot has.",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        const GuildPrefix = await GPrefix.findOne({ guild: message.guild.id });
        const prefix = GuildPrefix.prefix;
        const dirInfo = client.commands.filter(c => c.config.category === "Information");
        const dirMod = client.commands.filter(c => c.config.category === "Moderation");
        const dirOwner = client.commands.filter(c => c.config.category === "Owner");
        const dirUtility = client.commands.filter(c => c.config.category === "Utility");

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${client.user.username} Help Command!`, iconURL: message.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`
                **Information [${dirInfo.size}]**:
                ${dirInfo.map(c => `\`${c.config.name}\``).join(", ")}
                **Moderation [${dirMod.size}]**:
                ${dirMod.map(c => `\`${c.config.name}\``).join(", ")}
                **Owner [${dirOwner.size}]**:
                ${dirOwner.map(c => `\`${c.config.name}\``).join(", ")}
                **Utility [${dirUtility.size}]**:
                ${dirUtility.map(c => `\`${c.config.name}\``).join(", ")}
            `)
            return message.channel.send({ embeds: [embed] })
    }
}