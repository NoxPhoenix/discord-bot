const config = require('../../config.json');
const { cat, dog } = require('random-animal');

const stats = require('../../utils/rlStats');

function validGamerInfo(gamerInfo) {
  console.log(gamerInfo);
  return stats.playerByID(gamerInfo, res => res !== 'Data not found!');
}

const gamers = {
  createCache(member, gamerInfo) {
    if (validGamerInfo(gamerInfo)) return stats.initiateMember(member, gamerInfo);
    return `No rocket league stats found for ${gamerInfo.id} on ${gamerInfo.platform}`;
  },

  lookup(member) {
    return stats.getCache(member);
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

  // stats({ args, message }) {
  //   // console.log(stats.playerByID(args[0], args[1]));
  //   stats.playerByID(args[0], args[1], result => message.reply({ file: result }));
  // },

  // [0]Set: Takes two args ([1]platform, [2]id) and creates a cache of the info for easy lookup.
  stats({ args, message }) {
    console.log(args);
    switch (args[0]) {
      case 'set':
        message.reply(gamers.createCache(message.member, { platform: args[1], id: args[2] }));
        break;
      case 'lookup':
        console.log(row.defaultPlatform);
        message.reply('Looked up...');
        break;
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
