const wumpus = require('../../utils/wumpus');

const start = {
  // set mode
  // prompt for separate channels
  // divide by ranks
  // message the lobby info and assign teams
},

const commands = {

};

module.exports = {
  command(message) {
    const { command, args } = wumpus.commandAndArgsFromMessage(message);
    if (!commands[command]) return;
    commands[command]({ commands, args }, message);
  },
};
