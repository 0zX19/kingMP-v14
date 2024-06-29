const { EmbedBuilder } = require("discord.js");
const GPrefix = require('../../settings/models/Prefix');
module.exports = { 
   config: {
    name: "bugreport",
    cooldown: 2,
    permissions: ["SEND_MESSAGES"],
    aliases: ['bug', 'reportbug'],    
    category: "Moderation",
   },
    run: async (client, message, args) => {
      const GuildPrefix = await GPrefix.findOne({ guild: message.guild.id });
      const prefix = GuildPrefix.prefix;
        const suggestchannel = client.channels.cache.find(
            (channel) => channel.id === "1136981643006062662"
          );
          if (!args[0])
            return message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Error! Please do: \`${prefix}report-bug <Bug>\` `)]});
      
          const guild = message.guild;
          const suggestembed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("📢 Bug Report!")
            .setDescription(`**Bug:** ${args.slice(0).join(" ")}\n\n`)
            .addFields(
            { name: "Guild Info", value: `${message.guild.name} • \`${message.guild.id}\`` },
            { name: "Owner Info", value: `${message.author.tag} • \`${message.author.id}\``}
            )
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp();
          suggestchannel.send({embeds: [suggestembed]});
          const suggestionadded = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTitle("📢 Reported!")
            .setDescription("✅ Your bug report got added!");
          message.channel.send({embeds: [suggestionadded]});
        }
};