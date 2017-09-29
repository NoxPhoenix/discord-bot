const Promise = require('bluebird');
const _ = require('lodash');

const config = require('../../config');
const admin = require('../../admin');

module.exports = {
  welcome(member) {
    member.guild.systemChannel.send(`${admin.WELCOME_MESSAGE} <@${member.user.id}>`);
  },

  giveDefaultRole(member) {
    member.addRole(config.defaultRole);
  },

  notifyMods(member) {
    return Promise.map(admin.ADMIN_ROLES, (roleID) => {
      const adminRole = member.guild.roles.get(roleID);
      const mods = _.reject(adminRole.members.array(), { user: { bot: true } });
      console.log(mods);
      return Promise.map(mods, mod => mod.send(`Make sure to welcome ${member.user.username} to the discord!`));
    });
  },

  run(member) {
    this.welcome(member);
    this.giveDefaultRole(member);
    return this.notifyMods(member);
  },
};
