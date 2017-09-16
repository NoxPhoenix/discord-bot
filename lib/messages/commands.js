const config = require('../../config.json');

module.exports = {

  commandAndArgs({ content }, cb) {
    const args = content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return cb({ command, args });
  },

  ping() {
    console.log('pong');
  },

  run(message) {
    this.commandAndArgs(message, (command) => {
      this[command.command]();
    });
  },
};
