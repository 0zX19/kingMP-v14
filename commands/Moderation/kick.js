const { EmbedBuilder, PermissionsBitField} = require('discord.js');
const GPrefix = require('../../settings/models/Prefix');

module.exports = {
    config: {
      name: "kick",
      category: "Moderation",
      description: "kick a User From Guild",
      usage: "kick + <@user> + <reason>",
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
            .setTitle(`**Please Mention a User to Kick**`)
            .setDescription(`> Usage =  ${PREFIX}kick + <@user> + <reason>`)
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
        await member.kick();
        message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `> <@${member.user.id}> Kicked From Guild \n\n > Reason = \`\`${reason}\`\``
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({ text: `Kicked by ${message.author.username}` })
        ]});
        return
      }

    }
};
