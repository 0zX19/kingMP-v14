const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = { 
    config: {
      name: "user-info",
      description: "Discord userinfo",
      cooldown: 5,
      aliases: ["user"],
      category: "Information",
    },
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        function trimArray(arr, maxLen = 10) {
          if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
          }
          return arr;
        }
    
        let embed = new EmbedBuilder().setThumbnail(
          user.user.displayAvatarURL({ dynamic: true })
        );
    
        const roles = user.roles.cache
          .sort((a, b) => b.position - a.position)
          .map((role) => role.toString())
          .slice(0, -1);

        embed.setAuthor({ 
        name: user.user.tag, 
        iconURL: user.user.displayAvatarURL({ dynamic: true })
        });

        if (user.nickname !== null) 
        embed.addFields({ name:"Nickname", value: user.nickname });  
        embed
          .addFields(
          { 
            name: "Joined Date",
            value: `\`\`\`${moment(user.joinedAt).format("LL LT")}\`\`\``,
          },
          {
            name:  "Account Created",
            value: `\`\`\`${moment(user.user.createdAt).format("LL LT")}\`\`\``
          },
          {
            name: "General Information",
            value: `ID: \`${user.user.id}\`\n└| Discriminator: #${
                user.user.discriminator
              }\nBot: ${user.user.bot}\nRoles [${
                roles.length
              }]: ${
                roles.length < 50
                  ? roles.join(", ")
                  : roles.length > 50
                  ? this.client.utils.trimArray(roles)
                  : "None"
              }`
          },
          {
            name: "Avatar",
            value: `└| [Source](${user.user.displayAvatarURL({
                dynamic: true,
                size: 4096,
                format: "png",
              })})`
          }
          )
          .setColor(client.color);
    
        return message.channel.send({ embeds: [embed] }).catch((err) => {
          return message.channel.send({ content: "Error : " + err });
        });
    }
};