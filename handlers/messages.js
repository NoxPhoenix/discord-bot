const admin = require('../admin');
const messages = require('../lib/messages');


function callCommand(message) {
  return messages.commands.run(message);
}

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('message', (message) => {
      const { content } = message;
      if (message.author.bot) return;
      if (content.startsWith(admin.PREFIX)) callCommand(message);
    });
  }
}

function messageHandler(bot) {
  return new MessageHandler(bot);
}

module.exports = messageHandler;
