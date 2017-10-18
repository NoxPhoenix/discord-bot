const admin = require('../../admin');
const lobbyMaker = require('./lobbyMaker');


function callCommand (message) {
  return lobbyMaker.command(message);
}

class MessageHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('message', (message) => {
      const { content } = message;
      switch (true) {
        case (message.author.bot || message.channel.id !== 'Channel ID for lobby goes here'): return;
        case (content.startsWith(admin.PREFIX)):
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
