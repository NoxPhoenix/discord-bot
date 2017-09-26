const Promise = require('bluebird');
const moment = require('moment');
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

  fetchRankFromApi(platform, id) {
    return new Promise((resolve, reject) => {
      console.log(platform, id);
      statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => {
        console.log(status);
        if (status !== 200 && status !== 204) reject(status);
        resolve(data);
      });
    });
  },

  fetchRankandUpdateCache(discordID, { platform, id }) {
    return this.fetchRankFromApi(platform, id)
      .then(data => cache.cacheCurrentRank(discordID, id, data))
      .then(() => cache.getLatestRankCache(discordID))
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  },

  isValidCache(cachedRank, allowance) {
    const currentDateTime = moment();
    const cachedDateTime = moment(cachedRank.dateOfValidity);
    const age = cachedDateTime.diff(currentDateTime, 'hours', true);
    console.log('cache is the following old...', age);
    if (age > allowance) return false;
    return true;
  },

  newPlayerInfo(discordID, platform, id) {
    return this.fetchRankandUpdateCache(discordID, { platform, id });
  },

  getPlayerRank(member, allowance = 24) {
    return cache.getLatestRankCache(member.id)
      .then((cachedRank) => {
        console.log('getLatestCache result', cachedRank);
        if (cachedRank === undefined) return undefined;
        return { cachedRank, validCache: this.isValidCache(cachedRank, allowance) };
      })
      .then(({ cachedRank, validCache }) => {
        if (validCache) return cachedRank;
        return this.newPlayerInfo(member.id, cachedRank.defaultPlatform, cachedRank.discordID);
      });
  },

  initiateMember(member, { platform, id }) {
    return cache.createPlayer(member, { platform, id })
      .then(response => response);
  },

  getCache(member) {
    return cache.getPlayerInfo(member);
  },

  platformIDs,
  playlistIDs,
};
