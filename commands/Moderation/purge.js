const { EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = { 
    config: {
        name: "purge",
        description: 'Clear amount message',
        aliases: ["prune","delete"],
        category: "Moderation",
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`You need the \`MANAGE_GUILD\` permission to use this command.`)]});
            if (isNaN(args[0])) return message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("Please input a valid number.")]}) // isNaN = is Not a Number. (case sensitive, write it right)
            if (args[1] > 100) return message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("Insert the number less than 100.")]}) // Discord limited purge number into 100.
            if (args[0] < 2) return message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("Insert the number more than 1.")] })
            
            await message.delete()
            await message.channel.bulkDelete(args[0])
            .then(messages => message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`Deleting **${messages.size}/${args[0]}** messages on this channel`)] })).then(msg => {
                setTimeout(() => msg.delete(), 9000)
            })
            .catch(() => message.channel.send({ embeds: [new EmbedBuilder().setColor(client.color).setDescription("<:False:823030995053576232> Something went wrong, while deleting messages.")] })) // This error will be displayed when the bot doesn't have an access to do it.
    }
}
