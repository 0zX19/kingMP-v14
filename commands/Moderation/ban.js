const { EmbedBuilder, PermissionsBitField} = require('discord.js');
const GPrefix = require('../../settings/models/Prefix');

module.exports = {
    config: {
        name: "ban",
        description: "Ban a user.",
        category: "Moderation",
    },
    run: async (client, message, args) => {
        let PREFIX = client.prefix;
        const GuildPrefix = await GPrefix.findOne({ guild: message.guild.id });
        if(GuildPrefix && GuildPrefix.prefix) PREFIX = GuildPrefix.prefix;
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`You need the \`MANAGE_GUILD\` permission to use this command.`);
        let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
  
      // if not a member
      if (!member) {
        return message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`**Please Mention a User to Ban**`)
            .setDescription(`> Usage =  ${PREFIX}ban + <@user> + <reason>`)
        ]});
      }
  
      let reason = args.slice(1).join(" ");
  
      // if not a Role
      if (!reason) {
        return message.channel.send({ embeds: [ new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Please Give Reason **`)
            ] });
      }
      // add role to user
      if (member) {
        await member.ban();
        message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `> <@${member.user.id}> Banned From Guild \n\n > Reason = \`\`${reason}\`\``
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({ text: `Banned by ${message.author.username}` })
        ]});
        return
      }

    }
};
