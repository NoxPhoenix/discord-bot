const config = require('../../config.json');

module.exports = {
  welcome(member) {
    member.guild.systemChannel.send(`Welcome to the LFM community <@${member.user.id}>`);
    member.guild.members.get('89603657896595456').send(`Make sure to welcome ${member.user.username} to the discord!`);
  },

  giveDefaultRole(member) {
    member.addRole(config.defaultRole);
  },

  run(member) {
    this.welcome(member);
    this.giveDefaultRole(member);
  },
};
