const Promise = require('bluebird');
const moment = require('moment');
const _ = require('lodash');
const rls = require('rls-api');

const config = require('../config');

const cache = require('../data/db');

const statClient = new rls.Client({
  token: config.statsApiToken,
});

const platformIDs = {
  steam: 1,
  PS4: 2,
  XboxOne: 3,
};

const playlistIDs = {
  casual1v1: '1',
  casual2v2: '2',
  casual3v3: '3',
  casual4v4: '4',
  ranked1v1: '10',
  ranked2v2: '11',
  rankedSolo3v3: '12',
  rankedStandard: '13',
  mutatormashup: '14',
  snowDay: '15',
  rocketLabs: '16',
  hoops: '17',
  rumble: '18',
  dropShot: '23',
};

module.exports = {

  playerByID({ platform, id }) {
    return new Promise((resolve, reject) => {
      statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => {
        if (status === 200 || status === 204) {
          console.log('playerData', data);
          cache.cacheCurrentRank(data);
          resolve(data);
        }
        reject(status);
      });
    });
  },

  isValidCache(cachedRank, allowance) {
    currentDateTime = moment();
    cachedDateTime = moment(cachedRank.dateOfValidity);
    if ()
  }

  getPlayer(member) {
    return cache.getLatestCache(member)
      .then((cachedRank) => )
  },

  initiateMember(member, { platform, id }) {
    return cache.createMember(member, { platform, id })
      .then(response => response);
  },

  getCache(member) {
    return cache.getMemberInfo(member);
  },

  platformIDs,
  playlistIDs,
};
