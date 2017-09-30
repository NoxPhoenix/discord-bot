const { cat, dog } = require('random-animal');
const admin = require('../../admin');

const admins = admin.ADMINS;

const stats = require('../../utils/rlStats');

const players = {

  setPlayerProfile(member, gamerInfo) {
    const { platform, id } = gamerInfo;
    return stats.setPlayerProfile(member, platform, id);
  },

  getRank(discordID) {
    return stats.getRankFromMemberWithProfile(discordID);
  },
};

function adminCommands(command, args, message)  {
  const cases = {
    'scaleable': function(channel) {
      
    },
  },
}

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
      case 'help':
        return message.reply(`You can set your profile with ${admin.PREFIX}stats set (platform) (id)
        You can check your stats with ${admin.PREFIX}stats me (Only once your profile has been set.)`);
      default:
        return message.reply(`Command not found, for help type ${admin.PREFIX}stats help`);
    }
  },

  admin({ args, message }) {
    const command = args[0];
    adminCommands(command, args.slice(1), message);
  }
};


module.exports = {

  validCommand(command) {
    return commands[command] !== undefined;
  },

  commandAndArgs({ content }) {
    const args = content.slice(admin.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

  run(message) {
    const { command, args } = this.commandAndArgs(message);
    if (!commands[command]) return;
    commands[command]({ args, message });
  },
};
