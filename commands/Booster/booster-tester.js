const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const BoosterNotification = require('../../settings/models/BoosterDatabase');

module.exports = {
    config: {
        name: 'booster-tester',
        accessableby: 'Administrator',
        category: 'Booster',
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.channel.send('You do not have permission to use this command.');
        }

        // Fetch guild settings from the database
        const guildSettings = await BoosterNotification.findOne({ guildId: message.guild.id });

        // Check if the notification system is enabled and has a valid channel set
        if (!guildSettings || !guildSettings.isEnabled || !guildSettings.channelId) {
            return message.channel.send('Booster notification system is not set up or enabled.');
        }

        // Get the channel from the guild settings
        const channel = message.guild.channels.cache.get(guildSettings.channelId);
        if (!channel) {
            return message.channel.send('The set channel for booster notifications no longer exists.');
        }

        // Fetch total number of boosters in the server
        const totalBoosters = message.guild.premiumSubscriptionCount || 0;

        // Replace placeholders in the custom message
        const customMessage = guildSettings.message
            .replace('{user}', message.author.toString()) // Use message.author for the user running the command
            .replace('{totalboosters}', totalBoosters);

        // Format current date and time for the footer
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US'); // Format date as MM/DD/YYYY
        const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); // Format time as hh:mm AM/PM

        // Create the embed for the simulated boost notification
        const embed = new EmbedBuilder()
            .setAuthor({ name: '🎉🎉 BOOSTER PARTY 🎉🎉', iconURL: "https://cdn3.emoji.gg/emojis/1819_boostingtop.gif" })
            .setDescription(customMessage)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true })) // Use message.author for the thumbnail
            .setColor(client.color || 'Purple') // Use a fallback color if client.color is undefined
            .setFooter({ 
                text: `Server Boosted 🎉 〚🚀〛boost・sistem•${formattedDate} ${formattedTime}` // Custom footer format
            });

        // Send the simulated boost notification
        channel.send({ embeds: [embed] })
            .then(() => message.channel.send('Simulated booster notification sent successfully!'))
            .catch(error => {
                console.error(error);
                message.channel.send('Failed to send the simulated booster notification.');
            });
    }
};
