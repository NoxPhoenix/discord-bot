const Discord = require('discord.js');

const { Token } = require('./config.json');

const bot = new Discord.Client();

require('./handlers/messages')(bot);
require('./handlers/voiceChannels')(bot);

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(Token);

