const config = require('../../config.json');
const { cat, dog } = require('random-animal');

const stats = require('../../utils/rlStats');

function validGamerInfo({ platform, id }) {
  return stats.fetchRankFromApi(platform, id)
    .then(() => true)
    .catch(() => false);
}

function validPlatform(platform) {
  const validPlatforms = ['steam', 'psn', 'xbox'];
  return validPlatforms.includes(platform);
}

const gamers = {
  createCache(member, gamerInfo) {
    return validGamerInfo(gamerInfo)
      .then((valid) => {
        if (!validPlatform(gamerInfo.platform)) {
          throw new Error(`${gamerInfo.platform} is not a valid platform`);
        }
        if (valid === true) {
          return stats.initiateMember(member, gamerInfo);
        }
        throw new Error(`No rocket league stats found for ${gamerInfo.id} on ${gamerInfo.platform}`);
      });
  },

  lookup(member) {
    return stats.getPlayerRank(member, 0.03);
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
    console.log(args);
    switch (args[0]) {
      case 'set':
        return gamers.createCache(message.member, { platform: args[1], id: args[2] })
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      case 'me':
        return gamers.lookup(message.member)
          .then(({ rankSignature }) => message.reply({ file: rankSignature }))
          .catch(err => message.reply(err.message));
      default:
        message.reply(`Command not found, for help type ${config.Prefix}stats help`);
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
