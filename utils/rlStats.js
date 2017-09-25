const Promise = require('bluebird');
const rls = Promise.promisifyAll(require('rls-api'));

const cache = require('../data/db');

const statClient = new rls.Client({
  token: 'D7OTT8C65KGJ6GH7G8XEB18CBMREHVD3',
});

module.exports = {

  playerByID({ platform, id }) {
    return statClient.getPlayerAsync(id, rls.platforms[platform.toUpperCase()])
      .then((response) => {
        console.log('getPlayerResponse', response);
        return response;
      });
  },

  initiateMember(member, { platform, id }) {
    return cache.createMember(member, { platform, id })
      .then(response => response);
  },

  getCache(member) {
    return cache.getMemberInfo(member);
  },
};
