const { cat, dog } = require('random-animal');
const updateJson = require('update-json-file');

const admin = require('../../admin');
const stats = require('../../utils/rlStats');
const wumpus = require('../../utils/wumpus');

const adminFile = 'F:\\Discord BOT\\discord-bot\\admin.json';

const adminControls = {
  scalable ([channel]) {
    const { SCALABLE_CHANNELS: currentChannels } = admin;
    return updateJson(adminFile, (data) => {
      return Object.assign({}, data, { SCALABLE_CHANNELS: currentChannels.concat(channel) });
    });
  },
};

const commands = {
  ping ({ message }) {
    message.reply('pong');
  },

  cat ({ message }) {
    cat()
      .then(url => message.reply({ file: url }));
  },

  dog ({ message }) {
    dog()
      .then(url => message.reply({ file: url }));
  },

  test () {
    stats.test();
  },

  stats ({ args, message }) {
    switch (args[0]) {
      case 'set':
        return stats.setPlayerProfile(message.member, args[1].toLowerCase(), args[2])
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      case 'me':
        return stats.getRankFromMemberWithProfile(message.member.id)
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      case 'help':
        return message.reply(`You can set your profile with ${admin.PREFIX}stats set (platform) (id)
        You can check your stats with ${admin.PREFIX}stats me (Only once your profile has been set.)`);
      default:
        return message.reply(`Command not found, for help type ${admin.PREFIX}stats help`);
    }
  },

  admin ({ args, message }) {
    const admins = admin.ADMINS;
    if (!admins.includes(message.author.id)) message.reply('You must be an admin to use that command!');
    const command = args[0];
    return adminControls[command](args.slice(), message);
  },
};


module.exports = {

  run (message) {
    const { command, args } = wumpus.commandAndArgsFromMessage(message);
    if (!commands[command]) return;
    commands[command]({ args, message });
  },
};
