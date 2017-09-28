const Promise = require('bluebird');
const moment = require('moment');
const rls = require('rls-api');

const config = require('../config');

const cache = require('../data/db');
const { stats: { PlayerProfileNotFoundError, PlayerStatsNotFoundError } } = require('../errors');

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

function fetchRankFromApi(platform, id) {
  return new Promise((resolve, reject) => {
    statClient.getPlayer(id, rls.platforms[platform.toUpperCase()], (status, data) => {
      console.log(status);
      if (status !== 200 && status !== 204) reject(status);
      resolve(data);
    });
  });
}

function lookupRank(platform, id) {
  return fetchRankFromApi(platform, id)
    .catch(() => {
      throw new PlayerStatsNotFoundError(platform, id);
    });
}

function validPlatform(platform) {
  const validPlatforms = ['steam', 'psn', 'xbox'];
  return validPlatforms.includes(platform);
}

function isValidCache(rankCache, allowance = 0.03) {
  if (!rankCache) return false;
  const currentDateTime = moment();
  const cachedDateTime = moment(rankCache.dateOfValidity);
  const age = cachedDateTime.diff(currentDateTime, 'hours', true);
  console.log('cache is the following old...', age);
  if (age > allowance) return false;
  return true;
}

function getPlayerProfile(discordID) {
  return cache.getPlayerProfileFromDiscorID(discordID);
}


module.exports = {
  getRankFromMemberWithProfile(discordID) {
    return getPlayerProfile(discordID)
      .then((playerProfile) => {
        this.playerProfile = playerProfile;
        if (!playerProfile) throw new PlayerProfileNotFoundError(discordID);
        return cache.getLatestRankCache(discordID);
      })
      .then((rankCache) => {
        if (isValidCache(rankCache)) return rankCache;
        const { defaultPlatform } = this.playerProfile;
        return lookupRank(defaultPlatform, this.playerProfile[`${defaultPlatform}ID`]);
      })
      .then(rankData => cache.createNewRankCacheAndReturn(discordID, rankData));
  },

  setPlayerProfile(member, platform, id) {
    const { id: discordID } = member;
    if (!validPlatform(platform)) return Promise.reject(new Error(`${platform} is not a valid platform`));
    return lookupRank(platform, id)
      .then(() => {
        return cache.getPlayerProfileFromDiscorID(discordID);
      })
      .then((playerProfile) => {
        console.log('playerProfileFound', playerProfile);
        if (playerProfile !== undefined) return cache.updatePlayerProfile(discordID, platform, id);
        return cache.createPlayerProfile(member, platform, id);
      })
      .then(() => this.getRankFromMemberWithProfile(discordID));
  },
};
