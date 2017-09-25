const Promise = require('bluebird');
const _ = require('lodash');
const rls = require('rls-api');

const cache = require('../data/db');

const statClient = new rls.Client({
  token: 'D7OTT8C65KGJ6GH7G8XEB18CBMREHVD3',
});

module.exports = {

  playerByID({ platform, id }) {
    return new Promise((resolve, reject) => {
      statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => {
        if (status === 200 || status === 204) resolve(data);
        reject(status);
      });
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
