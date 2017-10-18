const jsonIO = require('json-io-promised');

const adminFilePath = `${__dirname}/admin.json`;

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
      .then(adminRoles => adminRoles.push(discordId))
      .then(adminRoles => jsonIO.writeJSON(adminFilePath, { ADMINS_ROLES: adminRoles }));
  },
};

module.exports = ADMIN;
