const Discord = require('discord.js');

const { Token } = require('./config.json');
require('./lib/commands/commandHandler');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.login(Token);
