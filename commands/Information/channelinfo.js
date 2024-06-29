const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: 'channelinfo',
        category: 'Information',
        description: "shows stats of the mentioned channel info",
        usage: "m/channelinfo <channel mention>",
        aliases: ['cinfo', 'channeli']
    },
    run: async (client, message) => {
        let channel = message.mentions.channels.first() || message.channel;

        if (!channel) {
            return message.reply("Channel tidak ditemukan.");
        }

        const embed = new EmbedBuilder()
            .setTitle(`Informasi Channel: ${channel.name}`)
            .setDescription(`
                ID: ${channel.id.toString()}
                Type: ${channel.type}
                Topic: ${channel.topic ? channel.topic.toString() : 'No topic'}
                NSFW: ${channel.nsfw ? 'Yes' : 'No'}
                Position: ${channel.position.toString()}
                Time Created: ${channel.createdAt.toDateString()}
            `)
            .setColor(client.color);

        message.channel.send({ embeds: [embed] });
    },
}