const Discord = require('discord.js');
const { prefix: PREFIX, token: TOKEN } = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', (message) => {
  if (message.content === `${PREFIX}ping`) {
    message.reply('pong');
  }
});

client.login(TOKEN);
