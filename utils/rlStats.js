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
      statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => { // eslint-disable-line consistent-return
        if (status === 200 || status === 204) {
          return cache.cacheCurrentRank(id, data)
            .then(() => cache.getPlayerInfo(id))
            .then(ranks => resolve(ranks));
        }
        reject(status);
      });
    });
  },

  isValidCache(cachedRank, allowance) {
    const currentDateTime = moment();
    const cachedDateTime = moment(cachedRank.dateOfValidity);
    const age = currentDateTime.diff(cachedDateTime, 'days', true);
    if (age > allowance) return false;
    return true;
  },

  newPlayerInfo(platform, id) {
    return this.playerByID({ platform, id });
  },

  getPlayerRank(member, allowance = 0.5) {
    return cache.getLatestCache(member)
      .then((cachedRank) => {
        if (cachedRank === undefined) return undefined;
        return { cachedRank, validCache: this.isValidCache(cachedRank, allowance) };
      })
      .then(({ cachedRank, valid }) => {
        if (valid) return cachedRank;
        return this.newPlayerInfo(cachedRank.defaultPlatform, cachedRank.discordID);
      });
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
