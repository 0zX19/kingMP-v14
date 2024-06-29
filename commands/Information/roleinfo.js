const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: 'roleinfo',
        category: 'Information',
        description: "shows stats of the mentioned role",
        usage: "m/roleinfo <role mention/role id>",
        aliases: ['rinfo', 'rolei']
    },
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send("**Please Enter A Role!**")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!role) return message.channel.send("**Please Enter A Valid Role!**");

        const status = {
            false: "No",
            true: "Yes"
        }

        let roleembed = new EmbedBuilder()
            .setTitle(`Role Info: ${role.name}`)
            .setColor(role.color)
            .addFields(
                { name: 'Role ID', value: role.id, inline: true },
                { name: 'Role Name', value: role.name, inline: true },
                { name: 'Role Color', value: role.hexColor, inline: true },
                { name: 'Role Created At', value: role.createdAt.toDateString(), inline: true },
                { name: 'Role Position', value: role.position.toString(), inline: true },
                { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
            );

        return message.channel.send({ embeds: [roleembed] });
    },
}