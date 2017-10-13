const Discord = require('discord.js');

const { Token } = require('./config.json');

const bot = new Discord.Client();

// Listener for RSS Feed changes for the podcast
require('./utils/podcastFeed')(bot);
// require('./data/db');

require('./handlers/messages')(bot);
require('./handlers/voiceChannels')(bot);
require('./handlers/server')(bot);

bot.on('ready', () => {
  console.log('I am ready!');
});


bot.login(Token);

