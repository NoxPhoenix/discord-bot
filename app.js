const Discord = require('discord.js');

const { Token } = require('./config.json');

const bot = new Discord.Client();

require('./utils/messageHandler')(bot);

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(Token);

