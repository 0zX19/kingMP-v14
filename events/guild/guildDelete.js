const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = async (client, guild) => {
    const channel = client.channels.cache.get(client.config.guildLogs);

    let own = await guild?.fetchOwner();
    
    try {
        const owner = await guild.members.fetch(guild.ownerId);
    
        if (owner) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Goodbye!')
            .setDescription(`I was removed from your server, ${owner.user.username}. KICKED ME MISTAKENLY?, Here you can [Add Me](https://top.gg/bot/1023810715250860105).`);
    
        owner.send({ embeds: [embed] });
        console.log(`Sent farewell message to ${owner.user.tag}`);
        }
    } catch (error) {
        console.error(`Error sending farewell message: ${error.message}`);
    }

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Lefted a Server!`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields([
            { name: "Name", value: `\`\`\`${guild.name}\`\`\``, inline: true },
            { name: "ID", value: `\`\`\`${guild.id}\`\`\``, inline: true },
            { name: "Member Count", value: `\`\`\`${guild.memberCount} Members\`\`\``, inline: true },
            {
                name: "Owner",
                value: `\`\`\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"} | ${
                    own.id
                }\`\`\``,
            },
            { name: "Creation Date", value: `\`\`\`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\`\`\`` },
            { name: `${client.user.username}'s Server Count`, value: `\`\`\`${client.guilds.cache.size} Servers\`\`\`` },
        ])
        .setColor(client.color)
        .setTimestamp();

    if (guild.iconURL()) {
        embed.setThumbnail(guild.iconURL({ size: 2048 }));
    } else {
        embed.setThumbnail(client.user.displayAvatarURL({ size: 2048 }));
    }

    if (guild.bannerURL()) {
        embed.setImage(guild.bannerURL());
    }

    channel.send({ embeds: [embed] });
};
