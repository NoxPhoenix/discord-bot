const server = require('../lib/server');

class ServerHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('guildMemberAdd', (member) => {
      server.join.run(member);
    });
  }
}

function serverHandler (bot) {
  return new ServerHandler(bot);
}

module.exports = serverHandler;
