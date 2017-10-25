const messages = require('../lib/messages');

function callCommand (message) {
  return messages.commands.run(message);
}

function moderate (message) {
  messages.moderation.run(message);
}

class MessageHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('message', (message) => {
      const { content } = message;
      moderate(message);
      switch (true) {
        case (message.author.bot || message.channel.type !== 'text'): return;
        case (content.startsWith(global.admin.prefix)):
          callCommand(message);
          break;
        default: break;
      }
    });
  }
}

function messageHandler (bot) {
  return new MessageHandler(bot);
}

module.exports = messageHandler;
