module.exports = {
  commandAndArgsFromMessage ({ content }) {
    const args = content.slice(global.admin.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

  roleFromGuildByName () {

  },
};
