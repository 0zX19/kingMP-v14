const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = { 
   config: {
    name: "ping",
    category: "Information",
    description: "Replies with pong!r",
   },
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription('`🏓` Pong! Lantency: ' + client.ws.ping + 'ms')
            return message.reply({ embeds: [embed] })
    }
};