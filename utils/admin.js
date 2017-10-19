const jsonIO = require('json-io-promised');

const adminFilePath = `${__dirname}/../admin.json`;
console.log(adminFilePath);

const ADMIN = {
  admins () {
    return jsonIO.readJSON(adminFilePath)
      .then(({ ADMINS }) => ADMINS);
  },

  addAdmin (discordId) {
    return this.admins()
      .then(admins => admins.push(discordId))
      .then(admins => jsonIO.writeJSON(adminFilePath, { ADMINS: admins }));
  },

  adminRoles () {
    return jsonIO.readJSON(adminFilePath)
      .then(({ ADMIN_ROLES }) => ADMIN_ROLES);
  },

  addAdminRole (roleId) {
    return this.adminRoles()
      .then(adminRoles => adminRoles.push(roleId))
      .then(adminRoles => jsonIO.writeJSON(adminFilePath, { ADMINS_ROLES: adminRoles }));
  },

  scalableChannels () {
    return jsonIO.readJSON(adminFilePath)
      .then(({ SCALABLE_CHANNELS }) => SCALABLE_CHANNELS);
  },

  addScalableChannel (channelId) {
    return this.adminRoles()
      .then(adminRoles => adminRoles.push(channelId))
      .then(adminRoles => jsonIO.writeJSON(adminFilePath, { ADMINS_ROLES: adminRoles }));
  },

  prefix () {
    return jsonIO.readJSON(adminFilePath)
      .then(({ PREFIX }) => PREFIX);
  },

  changePrefix (newPrefix) {
    if (newPrefix.length() > 3) throw new Error('prefix too long');
    return jsonIO.writeJSON(adminFilePath, { prefix: newPrefix });
  },

  welcomeMessage () {
    return jsonIO.readJSON(adminFilePath)
      .then(({ WELCOME_MESSAGE }) => WELCOME_MESSAGE);
  },

  changeWelcomeMessage (newMessage) {
    return jsonIO.writeJSON(adminFilePath, { WELCOME_MESSAGE: newMessage });
  },
};

module.exports = ADMIN;
