const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const formatDuration = require('../../structures/FormatDuration.js');
const GLang = require("../../settings/models/Language.js");
const GControl = require("../../settings/models/Control.js");
const GSetup = require("../../settings/models/Setup.js");
// const { ClassicPro } = require("musicard");

    
module.exports = async (client, player, track, payload, message, args) => {
      if(!player) return;

      /////////// Update Music Setup ///////////

      await client.UpdateQueueMsg(player);
      await client.clearInterval(client.interval);

      /////////// Update Music Setup ///////////

      const channel = client.channels.cache.get(player.textChannel);
      if (!channel) return;

      const Control = await GControl.findOne({ guild: channel.guild.id });
      if (Control.enable) return;

      const Setup = await GSetup.findOne({ guild: channel.guild.id });
      if (Setup.enable) return;

      const guildModel = await GLang.findOne({ guild: channel.guild.id });
      const { language } = guildModel;

      const cSong = player.queue.current;
      const qDuration = `${formatDuration(cSong.duration)}`;

      // const musicard = await ClassicPro({
      //     thumbnailImage: `https://img.youtube.com/vi/${cSong.identifier}/sddefault.jpg`,
      //     backgroundImage: `${client.user.displayAvatarURL({ dynamic: true })}`,
      //     name: cSong.title,
      //     author: cSong.author,
      //     nameColor: "WHITE",
      //     progressColor: "#2a79f7",
      //     progressBarColor: "#2B2B2B",
      //     startTime: "0:00",
      //     endTime: `${qDuration}`,
      //     imageDarkness: 60,
      // });

      const embeded = new EmbedBuilder()
        // .setAuthor({ name: `${client.i18n.get(language, "player", "track_title")}` })
        .setDescription(`Started playing **[${track.title}](${track.uri})**`)
        .setColor(client.color)
        // .addFields({ name: `${client.i18n.get(language, "player", "author_title")}`, value: `${track.author}`, inlin>        // .addFields({ name: `${client.i18n.get(language, "player", "request_title")}`, value: `${track.requester}`, i>        // .addFields({ name: `${client.i18n.get(language, "player", "duration_title")}`, value: `${formatduration(trac>        // .setFooter({ text: `${client.i18n.get(language, "player", "queue_title")} ${player.queue.length} | ${client.>
      const nplaying = await client.channels.cache
        .get(player.textChannel)
        .send({ embeds: [embeded] })
        .then((x) => (player.message = x));

      const filter = (message) => {
        if(message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
        else {
          message.reply({ content: `${client.i18n.get(language, "player", "join_voice")}`, ephemeral: true });
        }
      };
      const collector = nplaying.createMessageComponentCollector({ filter, time: track.duration });

      collector.on('collect', async (message) => {
        const id = message.customId;
        if(id === "pause") {
        if(!player) {
          collector.stop();
        }

          await player.pause(!player.paused);
          const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
                pause: uni,
              })}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        } else if (id === "sJoin") {
          if(!player) {
            collector.stop();
          }

          const { channel } = message.member.voice;
          if(!channel) return msg.edit(`${client.i18n.get(language, "music", "join_voice")}`);
  
          const player = client.manager.create({
              guild: message.guild.id,
              voiceChannel: message.member.voice.channel.id,
              textChannel: message.channel.id,
              selfDeafen: true,
          });
  
          await player.connect();
        } else if (id === "skip") {
          if(!player) {
            collector.stop();
          }

          await player.stop();
          await client.clearInterval(client.interval);

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "skip_msg")}`)
              .setColor(client.color);

          await nplaying.edit({ embeds: [embeded], components: [] });
          message.reply({ embeds: [embed], ephemeral: true });
        } else if(id === "stop") {
          if(!player) {
            collector.stop();
          }

          await player.stop();
          await player.destroy();
          await client.clearInterval(client.interval);

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
              .setColor(client.color);
          
          await nplaying.edit({  embeds: [embeded], components: [] });
          message.reply({ embeds: [embed], ephemeral: true });
        } else if(id === "shuffle") {
          if(!player) {
            collector.stop();
          }
          await player.queue.shuffle();

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "shuffle_msg")}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        } else if(id === "loop") {
          if(!player) {
            collector.stop();
          }
          await player.setTrackRepeat(!player.trackRepeat);
          const uni = player.trackRepeat ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
                loop: uni,
              })}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        } else if(id === "volup") {
          if(!player) {
            collector.stop();
          }
          await player.setVolume(player.volume + 5);

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "volup_msg", {
                volume: player.volume,
              })}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        }
        else if(id === "voldown") {
          if(!player) {
            collector.stop();
          }
          await player.setVolume(player.volume - 5);

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "voldown_msg", {
                volume: player.volume,
              })}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        }
        else if(id === "replay") {
          if(!player) {
            collector.stop();
          }
          await player.seek(0);

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "replay_msg")}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        }
        else if(id === "queue") {
          if(!player) {
            collector.stop();
          }
          const song = player.queue.current;
          const qduration = `${formatDuration(player.queue.duration)}`;
          const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;
      
          let pagesNum = Math.ceil(player.queue.length / 10);
          if(pagesNum === 0) pagesNum = 1;
      
          const songStrings = [];
          for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i];
            songStrings.push(
              `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.duration)}]\` • ${song.requester}
              `);
          }

          const pages = [];
          for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');
      
            const embed = new EmbedBuilder()
              .setAuthor({ name: `${client.i18n.get(language, "player", "queue_author", {
                guild: message.guild.name,
              })}`, iconURL: message.guild.iconURL({ dynamic: true }) })
              .setThumbnail(thumbnail)
              .setColor(client.color)
              .setDescription(`${client.i18n.get(language, "player", "queue_description", {
                track: song.title,
                track_url: song.uri,
                duration: formatDuration(song.duration),
                requester: song.requester,
                list_song: str == '' ? '  Nothing' : '\n' + str,
              })}`)
              .setFooter({ text: `${client.i18n.get(language, "player", "queue_footer", {
                page: i + 1,
                pages: pagesNum,
                queue_lang: player.queue.length,
                total_duration: qduration,
              })}` });
      
            pages.push(embed);
          }
          message.reply({ embeds: [pages[0]], ephemeral: true });
        }
        else if(id === "clear") {
          if(!player) {
            collector.stop();
          }
          await player.queue.clear();

          const embed = new EmbedBuilder()
              .setDescription(`${client.i18n.get(language, "player", "clear_msg")}`)
              .setColor(client.color);

          message.reply({ embeds: [embed], ephemeral: true });
        }
      });
      collector.on('end', async (collected, reason) => {
        if(reason === "time") {
          await nplaying.edit({  embeds: [embeded], components: [] })
          await client.clearInterval(client.interval);
        }
      });
}
