const { Schema, model } = require('mongoose');

const boosterNotificationSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, default: null },
    message: { type: String, default: 'Thank you for boosting the server, {user}!' },
    isEnabled: { type: Boolean, default: false }
});

module.exports = model('BoosterNotification', boosterNotificationSchema);