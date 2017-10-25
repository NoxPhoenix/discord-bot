const { cat, dog } = require('random-animal');

const { stats, wumpus } = require('../../utils');
const admin = require('../../utils/admin');

const adminKeywords = ['prefix', 'welcome', 'scalable', 'admins'];

function keywordAlias (alias) {
  switch (true) {
    case (alias.match('(welcome)\\s?(message)?')):
      return 'welcomeMessage';
    case (alias.match('scalable)\\s?(channels)?')):
      return 'scalableChannels';
    case ('roles' || 'adminRoles' || 'admin roles'):
      return 'adminRoles';
    case ('alert' || 'alert channels'):
      return 'alertChannels';
    default:
      return alias;
  }
}

const adminCommands = {
  lookup (message, args) {
    const keyword = keywordAlias(...args);
    return message.reply(`${keyword} is currently set to \`${global.admin[keyword]}\``);
  },

  set (message, keyword, value) {
    switch (keyword) {
      case 'prefix':
        return admin.changePrefix(value);
      default:
        return `No admin setting found for ${keyword}`;
    }
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
    if (message.channel.name !== 'stats') return message.reply('Please use the #stats channel for stat checking!');
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
        return message.reply(`You can set your profile with ${global.admin.prefix}stats set (platform) (id)
        You can check your stats with ${global.admin.prefix}stats me (Only once your profile has been set.)`);
      default:
        return message.reply(`Command not found, for help type ${global.admin.prefix}stats help`);
    }
  },

  admin ({ args, message }) {
    const { admins } = global.admin;
    if (!admins.includes(message.author.id)) message.reply('You must be an admin to use that command!');
    const command = args[0];
    console.log(command);
    switch (true) {
      case (adminCommands[command] !== undefined):
        return adminCommands[command](message, args.slice());
      case (adminKeywords.includes(command)):
        return adminCommands.lookup(message, [command, ...args]);
      default:
        return message.reply('That command does not exist');
    }
  },
};


module.exports = {

  run (message) {
    const { command, args } = wumpus.commandAndArgsFromMessage(message);
    if (!commands[command]) return;
    commands[command]({ args, message });
  },
};
