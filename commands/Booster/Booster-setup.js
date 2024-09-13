const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const BoosterNotification = require('../../settings/models/BoosterDatabase');

module.exports = {
    config: {
        name: 'booster',
        description: 'Advanced Booster Notification Message System',
        usage: 'booster <setup|enable|disable|setchannel|setmessage|status>',
        aliases: ['booster'],
        accessableby: 'Administrator',
        category: 'Booster',
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.channel.send('You do not have permission to use this command.');
        }

        const subcommand = args[0];

        if (!subcommand) {
            return message.channel.send('Please specify a subcommand: setup, enable, disable, setchannel, setmessage, status');
        }

        let guildSettings = await BoosterNotification.findOne({ guildId: message.guild.id });

        if (!guildSettings) {
            guildSettings = new BoosterNotification({ guildId: message.guild.id });
            await guildSettings.save();
        }

        switch (subcommand.toLowerCase()) {
            case 'setup':
                if (!args[1]) return message.channel.send('Please mention the channel for booster notifications.');
                const channel = message.mentions.channels.first();
                if (!channel) return message.channel.send('Invalid channel mention.');
                guildSettings.channelId = channel.id;
                guildSettings.isEnabled = true;
                await guildSettings.save();
                message.channel.send(`Booster notification channel set to ${channel}.`);
                break;

            case 'enable':
                guildSettings.isEnabled = true;
                await guildSettings.save();
                message.channel.send('Booster notification system enabled.');
                break;

            case 'disable':
                guildSettings.isEnabled = false;
                await guildSettings.save();
                message.channel.send('Booster notification system disabled.');
                break;

            case 'setchannel':
                if (!args[1]) return message.channel.send('Please mention the new channel for booster notifications.');
                const newChannel = message.mentions.channels.first();
                if (!newChannel) return message.channel.send('Invalid channel mention.');
                guildSettings.channelId = newChannel.id;
                await guildSettings.save();
                message.channel.send(`Booster notification channel updated to ${newChannel}.`);
                break;

            case 'setmessage':
                const customMessage = args.slice(1).join(' ');
                if (!customMessage) return message.channel.send('Please provide a custom message. Use `{user}` for mentioning the user and `{totalboosters}` for the total boosters.');
                guildSettings.message = customMessage;
                await guildSettings.save();
                message.channel.send('Booster notification message updated. You can use `{user}` for mentioning the booster and `{totalboosters}` for the total number of boosters.');
                break;

            case 'status':
                const embed = new EmbedBuilder()
                    .setTitle('Booster Notification System Status')
                    .addFields(
                        { name: 'Enabled', value: guildSettings.isEnabled ? 'Yes' : 'No', inline: true },
                        { name: 'Channel', value: guildSettings.channelId ? `<#${guildSettings.channelId}>` : 'Not set', inline: true },
                        { name: 'Message', value: guildSettings.message || 'Default message', inline: true }
                    )
                    .setColor(client.color)
                    .setFooter({ text: 'Booster Notification System' })
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
                break;

            default:
                message.channel.send('Unknown subcommand. Available: setup, enable, disable, setchannel, setmessage, status');
                break;
        }
    }
};
