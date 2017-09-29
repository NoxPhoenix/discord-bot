const Promise = require('bluebird');
const sqlite3 = require('sqlite3');

const config = require('../config.json');

const db = new sqlite3.Database('./members.db');

const dbAsync = Promise.promisifyAll(db);

function bootStrap() {
  return dbAsync.runAsync(`CREATE TABLE IF NOT EXISTS members(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordID TEXT NOT NULL UNIQUE,
    discordDiscriminator TEXT NOT NULL UNIQUE,
    defaultPlatform TEXT,
    steamID TEXT UNIQUE,
    psnID TEXT UNIQUE,
    xboxID TEXT UNIQUE
  )`)
    .then(() => {
      return dbAsync.runAsync(`CREATE TABLE IF NOT EXISTS ranks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discordID TEXT NOT NULL,
        dateOfValidity DATETIME DEFAULT CURRENT_TIMESTAMP,
        ranked1v1MMR INTEGER,
        ranked1v1Tier INTEGER,
        ranked1v1Division INTEGER,
        ranked2v2MMR INTEGER,
        ranked2v2Tier INTEGER,
        ranked2v2Division INTEGER,
        ranked3v3MMR INTEGER,
        ranked3v3Tier INTEGER,
        ranked3v3Division INTEGER,
        rankedSolo3v3MMR INTEGER,
        rankedSolo3v3Tier INTEGER,
        rankedSolo3v3Division INTEGER,
        rankSignature TEXT
      )`);
    });
}

const membersColumns = ['discordID', 'discordDiscriminator', 'defaultPlatform', 'steamID', 'psnID', 'xboxID'];
const ranksColumns = [
  'discordID',
  'ranked1v1MMR',
  'ranked1v1Tier',
  'ranked1v1Division',
  'ranked2v2MMR',
  'ranked2v2Tier',
  'ranked2v2Division',
  'rankedSolo3v3MMR',
  'rankedSolo3v3Tier',
  'rankedSolo3v3Division',
  'ranked3v3MMR',
  'ranked3v3Tier',
  'ranked3v3Division',
  'rankSignature',
];


bootStrap()
  .then(() => {
    console.log('tables initiated');
  });

function parseRankData(rankData) {
  const currentRanks = rankData.rankedSeasons[config.currentSeasonID];
  const ranks = [];
  for (let i = 10; i < 14; i += 1) {
    ranks.push(`"${currentRanks[i].rankPoints}"`, `"${currentRanks[i].tier}"`, `"${currentRanks[i].division}"`);
  }
  ranks.push(`"${rankData.signatureUrl}"`);
  return ranks.join(', ');
}

module.exports = {

  updatePlayerProfile(discordID, platform, id) {
    return dbAsync.runAsync(`UPDATE members SET ${platform}ID = "${id}", defaultPlatform = "${platform}" WHERE discordID = "${discordID}"`);
  },

  createPlayerProfile(member, platform, id) {
    const { user } = member;
    const platformID = `${platform}ID`;
    return dbAsync.runAsync(`INSERT INTO members (discordID, discordDiscriminator, defaultPlatform, ${platformID})
      VALUES ("${member.id}", "${user.discriminator}", "${platform}", "${id}")`);
  },

  getLatestRankCache(discordID) {
    return dbAsync.getAsync(`SELECT * FROM ranks
      WHERE discordID = "${discordID}" ORDER BY dateOfValidity DESC LIMIT 1`);
  },

  getPlayerProfileFromDiscorID(discordID) {
    return dbAsync.getAsync(`SELECT * FROM members WHERE discordID = "${discordID}"`);
  },

  createNewRankCache(discordID, rankData) {
    const rankString = parseRankData(rankData);
    const ranksColumnsStrings = ranksColumns.join(', ');
    return dbAsync.runAsync(`INSERT INTO ranks (${ranksColumnsStrings}) VALUES ("${discordID}", ${rankString})`);
  },

  createNewRankCacheAndReturn(discordID, rankData) {
    return this.createNewRankCache(discordID, rankData)
      .then(() => this.getLatestRankCache(discordID));
  },
};
