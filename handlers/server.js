const config = require('../config.json');
const server = require('../lib/server');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('guildMemberAdd', (member) => {
      server.join.run(member);
    });
  }
}

function messageHandler(bot) {
  return new MessageHandler(bot);
}

module.exports = messageHandler;
