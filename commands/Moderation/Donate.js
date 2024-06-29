const { EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    config: {
      name: "Donate",
      category: "Moderation",
      aliases: ["donate"],
      description: "who donate will announce with this command",
      usage: "Donate <mention> <args>",
    },
    run: async (client, message, args) => {
        message.delete();

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`You need the \`MANAGE_GUILD\` permission to use this command.`)]});
        
        const channel = message.guild.channels.cache.find(ch => ch.id === "1065571340997894206");
            if (!channel) return;
        
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.user.id.toLowerCase() === args.join(' ').toLocaleLowerCase())
        
        if(!user) return message.channel.send("Please mention the donors")
        //let msg = await message.channel.send("Generating Avatar...");
        let dukungan = args.slice(1).join(` `)
        if(!dukungan) {
          dukungan = "`Tidak disertai Pesan dukungan`";
        }
        
        let iconembed = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(user.user.displayAvatarURL())
        .setAuthor({ name: `${user.user.username} baru saja berdonasi untuk ${message.guild.name}`, iconURL: "https://cdn.discordapp.com/emojis/854659377439965194.gif?v=1"})
        .setDescription(`Terima kasih <@${user.id}> untuk dukungannya! Donasi kamu sangat membantu server ${message.guild.name}. Semoga kedepannya server ini akan menjadi lebih baik lagi!`)
        .addFields(
            { name: '❤ Pesan Dukungan', value: `\`${dukungan}\``, inline: true },
        )
        .setFooter({ text: "Terima kasih ❤", iconURL: "https://cdn.discordapp.com/emojis/854659377439965194.gif?v=1"})
        .setTimestamp()
        channel.send({ embeds: [iconembed] })
        

    }
};
