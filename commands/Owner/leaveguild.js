module.exports = {
    ownerOnly: true,
    config: {
        name: 'leave-guild',
        aliases: ['guild-leave', 'lg'],
        description: 'Forces the bot to leave a guild',
        usage: '<guildID> | <guildName>',
        category: 'Owner',
    },
    run: async(client, message, args) => {
        if (message.author.id === client.owner) {

            const guildId = args[0];

            if (!guildId) {
              return message.channel.send("Please provide an id");
            }
        
            const guild = client.guilds.cache.find((g) => g.id === guildId);
        
            if (!guild) {
              return message.channel.send("That guild wasn't found");
            }
        
            try {
              await guild.leave();
              message.channel.send(`Successfully left guild: **${guild.name}**`);
            } catch (e) {
              console.error(e);
              return message.channel.send("An error occurred leaving that guild");
            }
    } else {
        return;
    }
    }

}