
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
  ownerOnly: true,
  config: {
    name: "serverlist",
    aliases: ["slt"],
    description: "Displays the list of servers the bot is in!",
    category: 'Owner',
  },
  run: async (client, message, args) => {
    // if(message.author.id !== client.owner) {
    //     return message.channel.send(
    //         ':x: You must have the following permissions to use that: Bot Owner.',
    //     );
    // }
    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description;
    
    description = `Total Servers - ${client.guilds.cache.size}\n\n` +
    client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .map(r => r)
      .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`)
      .slice(0, 10)
      .join("\n");

  let emb = new EmbedBuilder()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL({ dynamic: true })
    })
    .setColor(client.color)
    .setFooter({ text: client.user.username })
    .setTitle(`Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
    .setDescription(description);

    let pages = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⬅️")
        .setCustomId("previous_emoji"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel('❌')
        .setCustomId('home'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("➡️")
        .setCustomId("next_emoji")
    );

    let dis = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⬅️")
        .setCustomId("previous_emoji"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel('❌')
        .setCustomId('home'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("➡️")
        .setCustomId("next_emoji")
    );

    if ( client.guilds.cache.size < 10)
      return message.channel.send({
        embeds: [emb],
        components: [dis]
      });

    let msg = await message.channel.send({
      embeds: [emb],
      components: [pages]
    });

    let filter = i => i.user.id === message.author.id ? true : false && interaction.deferUpdate();

    let collector = msg.channel.createMessageComponentCollector({ filter, time: 60000 * 5, idle: 30e3, });

    

    collector.on("collect", async i => {
      if (i.customId === 'previous_emoji') {
        await i.deferUpdate().catch(() => {});
           i0 = i0 - 10;
           i1 = i1 - 10;
           page = page - 1;
 
           if (i0 + 1 < 0) return msg.delete();
           if (!i0 || !i1) return msg.delete();
 
           description =
             `Total Servers - ${client.guilds.cache.size}\n\n` +
             client.guilds.cache
               .sort((a, b) => b.memberCount - a.memberCount)
               .map(r => r)
               .map(
                 (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`
               )
               .slice(i0, i1)
               .join("\n");
 
           emb
             .setTitle(
               `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
             )
             .setDescription(description);
 
           // Edit the message
          await msg.edit({
            embeds: [emb]
          });
      } else if(i.customId == "home"){
        await i.deferUpdate().catch(() => {});
        await msg.delete();
  
      } else if (i.customId === 'next_emoji') {
        await i.deferUpdate().catch(() => {});
          i0 = i0 + 10;
          i1 = i1 + 10;
          page = page + 1;

          if (i1 > client.guilds.cache.size + 10) return msg.delete();
          if (!i0 || !i1) return msg.delete();

          description =
            `Total Servers - ${client.guilds.cache.size}\n\n` +
            client.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map(r => r)
              .map(
                (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - ${r.id}`
              )
              .slice(i0, i1)
              .join("\n");

          emb
            .setTitle(
              `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
            )
            .setDescription(description);
          await msg.edit({
            embeds: [emb]
          });
      } else {
        return;
      }
    });
  }
};

