const admin = require('../admin');

module.exports = {

  commandAndArgsFromMessage({ content }) {
    const args = content.slice(admin.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

};
