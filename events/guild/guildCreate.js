const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const moment = require("moment");
const GPrefix = require('../../settings/models/Prefix.js');


module.exports = async (client, guild) => {
    const channel = client.channels.cache.get(client.config.guildLogs);

    let own = await guild?.fetchOwner();

    const invite = await guild.channels.cache.find(
        (c) =>
            c.type === ChannelType.GuildText &&
            c.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite && PermissionFlagsBits.SendMessages)
    );

    let inviteLink = await invite.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Joined a Server!`,
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

    if (inviteLink) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel(`${guild.name} Invite Link`).setStyle(ButtonStyle.Link).setURL(`${inviteLink}`)
        );

        channel.send({ embeds: [embed], components: [row] });
    } else {
        channel.send({ embeds: [embed] });
    }

    try {
        const owner = await guild.members.fetch(guild.ownerId);

        const GuildPrefix = await GPrefix.findOne({ guild: message.guild.id });
        const prefix = GuildPrefix.prefix;
    
        if (owner) {
            const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Thank You for Adding Me!')
            .setDescription(`Thanks for adding me to your server, ${owner.user.username}!`)
            .addFields(
                { 
                    name: 'How to Use Me', 
                    value: `You Can you me prefix **${prefix}**`
                }
            );
            owner.send({ embeds: [embed] });
            console.log(`Sent thank-you message to ${owner.user.tag}`);
        }
    } catch (error) {
        console.error(`Error sending thank-you message: ${error.message}`);
    }
};
