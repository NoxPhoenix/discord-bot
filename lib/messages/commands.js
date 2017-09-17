const config = require('../../config.json');

const cat = require('random-cat');


const commands = {
  ping({ message }) {
    message.reply('pong');
  },

  cat({ message }) {
    message.reply(cat.get());
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
