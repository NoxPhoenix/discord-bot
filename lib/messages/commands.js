const config = require('../../config.json');

const { cat, dog } = require('random-animal');


const commands = {
  ping({ message }) {
    message.reply('pong');
  },

  cat({ message }) {
    cat()
      .then(url => message.reply(url));
  },

  dog({ message }) {
    dog()
      .then(url => message.reply(url));
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
