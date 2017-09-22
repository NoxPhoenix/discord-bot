const rls = require('rls-api');

const cache = require('../data/db');

const statClient = new rls.Client({
  token: 'D7OTT8C65KGJ6GH7G8XEB18CBMREHVD3',
});

module.exports = {

  playerByID({ platform, id }, cb) {
    return statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => {
      if (status === 200) {
        console.log(data.signatureUrl);
        return cb(data.signatureUrl);
      }
      return cb('Data not found!');
    });
  },

  initiateMember(member, { platform, id }) {
    return cache.createMember(member, { platform, id });
  },

  getCache(member) {
    return cache.getMemberInfo(member);
  },
};
