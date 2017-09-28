const config = require('../../config.json');
const { cat, dog } = require('random-animal');

const stats = require('../../utils/rlStats');

const players = {

  setPlayerProfile(discordID, gamerInfo) {
    const { platform, id } = gamerInfo;
    return stats.setPlayerProfile(discordID, platform, id);
  },

  getRank(discordID) {
    return stats.getRankFromMemberWithProfile(discordID);
  },
};

const commands = {
  ping({ message }) {
    message.reply('pong');
  },

  cat({ message }) {
    cat()
      .then(url => message.reply({ file: url }));
  },

  dog({ message }) {
    dog()
      .then(url => message.reply({ file: url }));
  },

  test() {
    stats.test();
  },

  stats({ args, message }) {
    switch (args[0]) {
      case 'set':
        return players.setPlayerProfile(message.member, { platform: args[1].toLowerCase(), id: args[2] })
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      case 'me':
        return players.getRank(message.member.id)
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      default:
        return message.reply(`Command not found, for help type ${config.Prefix}stats help`);
    }
  },
};


module.exports = {

  validCommand(command) {
    return commands[command] !== undefined;
  },

  commandAndArgs({ content }) {
    const args = content.slice(config.Prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

  run(message) {
    const { command, args } = this.commandAndArgs(message);
    if (!commands[command]) return;
    commands[command]({ args, message });
  },
};
