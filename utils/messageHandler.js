const config = require('../config.json');
const messages = require('../lib/messages');


function callCommand(message) {
  return messages.commands.run(message);
}

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('message', (message) => {
      console.log(message);
      const { content } = message;
      if (content.author.bot) return;
      if (content.startsWith(config.prefix)) callCommand(message);
    });
  }
}

function messageHandler(bot) {
  return new MessageHandler(bot);
}

module.exports = messageHandler;
