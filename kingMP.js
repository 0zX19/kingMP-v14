const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const AppleMusic = require("better-erela.js-apple").default;
const { I18n } = require("locale-parser");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const { createCanvas, loadImage } = require('@napi-rs/canvas');

class MainClient extends Client {
	 constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMembers,
              GatewayIntentBits.GuildBans,
              GatewayIntentBits.GuildEmojisAndStickers,
              GatewayIntentBits.GuildIntegrations,
              GatewayIntentBits.GuildWebhooks,
              GatewayIntentBits.GuildInvites,
              GatewayIntentBits.GuildVoiceStates,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.GuildMessageReactions,
              GatewayIntentBits.GuildMessageTyping,
              GatewayIntentBits.DirectMessages,
              GatewayIntentBits.DirectMessageReactions,
              GatewayIntentBits.DirectMessageTyping,
              GatewayIntentBits.GuildScheduledEvents,
              GatewayIntentBits.MessageContent
            ],
            partials: [
              Partials.Channel,
              Partials.GuildMember,
              Partials.Message,
              Partials.Reaction,
              Partials.User,
              Partials.GuildScheduledEvent
            ],
        });

    this.config = require("./settings/config.js");
    this.button = require("./settings/button.js");
    this.prefix = this.config.PREFIX;
    this.owner = this.config.OWNER_ID;
    this.aliases = new Collection();
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    this.i18n = new I18n(this.config.LANGUAGE);
    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

	const client = this;

    this.manager = new Manager({
      nodes: this.config.NODES,
      autoPlay: true,
      plugins: [
        new Spotify(),
        new AppleMusic()
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

// INI ADALAH TEST WELCOME MESSAGE & IMAGES
    client.on('messageCreate', message => {
        if (message.content === '!gojoin') {
            client.emit('guildMemberAdd', message.member);
            client.emit('guildMemberRemove', message.member);
    
        }
    });

// Listener event pesan
client.on('messageCreate', message => {
  // Abaikan pesan dari bot itu sendiri
  if (message.author.bot) return;

  // Periksa izin mengirim pesan
  const botMember = message.guild.members.cache.get(client.user.id);
  const canSendMessages = botMember.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages);

  if (!canSendMessages) {
      console.log('Bot tidak memiliki izin untuk mengirim pesan di saluran ini.');
      return;
  }
  

  // Periksa jika pesan cocok dengan perintah yang ada
    if (message.content.toString().toLowerCase() === "dor") {
        message.reply('Kaget kontol lu ngentot');
    }   
    if (message.content.toString().toLowerCase() === "agent") {
        message.reply('<@&1093099144962375740> KERJA WOI KERJAAAA');
    } 
    if (message.content.toString().toLowerCase() === "welkam") {
        message.reply('<a:wel1:1093142845482860594><a:wel2:1093142838759391322>');
    }
    if (message.content.toString().toLowerCase() === "<@780193524435648543>") {
        message.reply('sibuk sir!');
    }
    if (message.content.toString().toLowerCase() === "<@753150649142607963>") {
        message.reply('iya ada afah?');
    }
    if (message.content.toString().toLowerCase() === "<@395571541129297920>") {
        message.reply('https://media.discordapp.net/attachments/882633786016268318/1017086710183628900/SEFDEFE.png');
    }
    if (message.content.toString().toLowerCase() === "<@!>") {
        message.reply(`Hah? Kenapa <@${message.member.id}>. Kalo penting dm aja, tapi ga jamin fast response`);
    }
    if (message.content.toString().toLowerCase() === "<@!>") {
        message.reply('LU TAG SEKALI LAGI GW TIMBUK LU !!!');
    }
});

const BoosterNotification = require('./settings/models/BoosterDatabase.js');

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    // Check if the member started boosting
    if (!oldMember.premiumSince && newMember.premiumSince) {
        // Fetch guild settings from the database
        const guildSettings = await BoosterNotification.findOne({ guildId: newMember.guild.id });

        // Ensure the booster notification system is enabled and has a valid channel
        if (!guildSettings || !guildSettings.isEnabled || !guildSettings.channelId) return;

        // Get the notification channel from the guild settings
        const channel = newMember.guild.channels.cache.get(guildSettings.channelId);
        if (!channel) return;

        // Fetch the current total number of boosters
        const totalBoosters = newMember.guild.premiumSubscriptionCount || 0;

        // Replace placeholders in the custom message
        const customMessage = guildSettings.message
            .replace('{user}', newMember.user.toString())
            .replace('{totalboosters}', totalBoosters);

         // Format current date and time for the footer
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US'); // Format date as MM/DD/YYYY
            const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); // Format time as hh:mm AM/PM

        // Create the embed for the boost notification
        const embed = new EmbedBuilder()
            .setAuthor({ name: '🎉🎉 BOOSTER PARTY 🎉🎉', iconURL: "https://cdn3.emoji.gg/emojis/1819_boostingtop.gif" })
            .setDescription(customMessage)
            .setColor(client.color) // Adjust color to your preference
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true })) // Set the member's avatar as the thumbnail
            .setFooter({ 
                text: `Server Boosted 🎉 〚🚀〛boost・sistem•${formattedDate} ${formattedTime}` // Custom footer format
            });

        // Send the boost notification embed to the channel
        channel.send({ embeds: [embed] });
    }
});

client.on('guildMemberAdd', async (member) => { 
    const canvas = createCanvas(1024, 500)
    const ctx = canvas.getContext('2d')
    const background = await loadImage('https://cdn.discordapp.com/attachments/1102585584117088318/1235130277680910357/01.png?ex=668108b5&is=667fb735&hm=88eb9a3b9623366b14a052c3b7072d5d569618ed0cf93e8fcd87cf2b715447ff&') // Using Link
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height) // Setting Background Image
    ctx.strokeStyle = '#4F82F5' // Keeping Stroke Color

    // // Layer
    // ctx.fillStyle = '#3d4040';
    // ctx.globalAlpha = 0.5;
    // ctx.fillRect(0, 0, 25, canvas.height);
    // ctx.fillRect(canvas.width - 25, 0, 25, canvas.height);
    // ctx.fillRect(25, 0, canvas.width - 50, 25);
    // ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25);
    // ctx.globalAlpha = 1;

    // Member Count
    //   ctx.fillStyle = "#FFFFFF";
    //   ctx.font = "bold 22px Oswald";
    //   ctx.lineWidth = 10;
    //   ctx.strokeStyle = "#2ba7ff";
    //   ctx.strokeText(
    //     `${member.guild.memberCount}th member`,
    //     30,
    //     canvas.height - 35
    //   );
    //   ctx.fillText(
    //     `${member.guild.memberCount}th member`,
    //     30,
    //     canvas.height - 35
    //   );

    // Making A Circle Around Avatar
    ctx.beginPath()
    ctx.arc(512, 166, 128, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.fillStyle = '#4F82F5'
    ctx.fill()

    // Welcome Text
    ctx.font = '76px Oswald' // Font For Welcome Text
    ctx.fillStyle = '#FFFFFF' // Colour For Welcome Text
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#2ba7ff";
    ctx.strokeText('WELCOME', 320, 365);
    ctx.fillText('WELCOME', 320, 365) // Display Welcome Text On Image

    // Username
    const name = `${member.user.username}` // Username Of User
    if (name.length >= 16) { // If Name Is Greater Than 16
        ctx.font = '46px Oswald' // Font For Displaying Name
        ctx.textAlign = 'center' // Keeping The Text In Center
        ctx.fillStyle = '#FFFFFF' //Colour Of Name
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#2ba7ff";
        ctx.strokeText(name, 512, 430)
        ctx.fillText(name, 512, 430) // Displaying Name On Image
    } else { // If Name Is Less Than 16
        ctx.font = '47px Oswald' // Font For Displaying Name
        ctx.textAlign = 'center' // Keeping The Text In Center
        ctx.fillStyle = '#FFFFFF' //Colour Of Name
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#2ba7ff";
        ctx.strokeText(name, 512, 430)
        ctx.fillText(name, 512, 430) // Displaying Name On Image
    }

    // Avatar
    ctx.beginPath()
    ctx.arc(512, 166, 119, 0, Math.PI * 2, true) // Avatar Of User
    ctx.closePath()
    ctx.clip() // Making Avatar Circle
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'jpg' })) // getting Users Avatar
    ctx.drawImage(avatar, 393, 47, 238, 238) // Adjusting Avatar In Circle

    const file = {
        attachment: await canvas.encode('png'),
        name: `welcome.png`,
      };

      const channel = member.guild.channels.cache.get("1065571340997894206");

      try {
        if (channel) channel.send({ files: [file] });
      } catch (error) {
        console.error(error);
      }
  
  });

        // Event ketika anggota baru bergabung
    client.on('guildMemberAdd', member => {
      // Dapatkan channel 'welcome' (pastikan channel ini ada di server Anda)
      const channel = member.guild.channels.cache.find(ch => ch.id === '1065571340997894206');
      if (!channel) return;
      const total = member.guild.memberCount;

      // Buat embed
      const embed = new EmbedBuilder()
          .setColor(client.color)
          .setTitle('Selamat Datang!')
          .setDescription(`Silahkan Baca Peraturan Di : <#604260997481627648>\nAmbil Roles Di : <#981725332786782238>\nAmbil Warna Di : <#945596531317288970>`)
          .setThumbnail("https://media.discordapp.net/attachments/1014084732176306279/1093140335489732628/ed.jpg?width=1193&height=671")
          .addFields(
              { name: 'Nama Pengguna', value: member.user.username, inline: true },
              { name: 'ID Pengguna', value: member.user.id, inline: true },
          )
          .setTimestamp()
          .setFooter({ text: `Total Prisoners: ${total}`, iconURL: member.guild.iconURL() });

      // Kirim embed ke channel
      channel.send({ content: `Hello <@${member.user.id}>`, embeds: [embed] });
    });


    ["aliases", "commands", "premiums"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadPlayer", "loadDatabase"].forEach(x => require(`./handlers/${x}`)(client));

    this.cluster = new ClusterClient(this);
	}
		connect() {
        return super.login(this.token);
    };
};
module.exports = MainClient;
