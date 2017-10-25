const json = require('json-io-promised');

const adminFilePath = `${__dirname}/../admin.json`;

function setGlobals () {
  return json.readJSON(adminFilePath)
    .then((admin) => {
      global.admin = admin;
      console.log('New Data!');
      console.log(admin);
    });
}

console.log('test');
setGlobals();

module.exports = {
  addAdmin (discordId) {
    return this.admins()
      .then(admins => admins.push(discordId))
      .then(admins => json.writeJSON(adminFilePath, { ADMINS: admins }))
      .then(setGlobals());
  },

  addAdminRole (roleId) {
    return this.adminRoles()
      .then(adminRoles => adminRoles.push(roleId))
      .then(adminRoles => json.writeJSON(adminFilePath, { ADMINS_ROLES: adminRoles }))
      .then(setGlobals());
  },

  addScalableChannel (channelId) {
    return this.adminRoles()
      .then(adminRoles => adminRoles.push(channelId))
      .then(adminRoles => json.writeJSON(adminFilePath, { ADMINS_ROLES: adminRoles }))
      .then(setGlobals());
  },

  changePrefix (newPrefix) {
    if (newPrefix.length() > 3) throw new Error('prefix too long');
    return json.writeJSON(adminFilePath, { prefix: newPrefix })
      .then(setGlobals());
  },

  changeWelcomeMessage (newMessage) {
    return json.writeJSON(adminFilePath, { WELCOME_MESSAGE: newMessage })
      .then(setGlobals());
  },
};
