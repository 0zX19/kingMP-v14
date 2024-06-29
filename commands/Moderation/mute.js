
module.exports = {
    config: {
      name: "mute",
      category: "Moderation",
      description: "mute a User From Guild",
      usage: "mute + <@user> + <reason>",
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.reply('You do not have permissions to mute members.');
        }
    
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member.');
        }
    
        let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.roles.create({
                    name: 'Muted',
                    color: '#000000',
                    permissions: []
                });
    
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(mutedRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                        CONNECT: false
                    });
                });
            } catch (error) {
                console.error(error);
                return message.reply('There was an error creating the Muted role.');
            }
        }
    
        if (member.roles.cache.has(mutedRole.id)) {
            return message.reply('This member is already muted.');
        }
    
        try {
            await member.roles.add(mutedRole);
            message.reply(`${member.user.tag} has been muted.`);
        } catch (error) {
            console.error(error);
            message.reply('There was an error muting the member.');
        }

    }
};
