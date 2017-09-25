const Promise = require('bluebird');
const sqlite3 = Promise.promisifyAll(require('sqlite3'));

const db = new sqlite3.Database('./members');

function bootStrap() {
  db.runAsync(`CREATE TABLE IF NOT EXISTS members(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordID TEXT NOT NULL UNIQUE,
    discordDiscriminator TEXT NOT NULL UNIQUE,
    defaultPlatform TEXT,
    steamID TEXT UNIQUE,
    psnID TEXT UNIQUE,
    xboxID TEXT UNIQUE
  )`);

  db.runAsync(`CREATE TABLE IF NOT EXISTS ranks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordID TEXT NOT NULL,
    dateOfValidity DATETIME DEFAULT CURRENT_TIMESTAMP,
    1v1mmr INTEGER,
    1v1Tier INTEGER,
    1v1Division INTEGER,
    2v2mmr INTEGER,
    2v2Tier INTEGER,
    2v2Division INTEGER,
    3v3mmr INTEGER,
    3v3Tier INTEGER,
    3v3Division INTEGER,
    s3v3mmr INTEGER,
    s3v3Tier INTEGER,
    s3v3Division INTEGER,
    rankSignature TEXT,
  )`);
}

const membersColumns = ['discordID', 'discordDiscriminator', 'defaultPlatform', 'steamID', 'psnID', 'xboxID'];
const ranksColumns = ['discordID', 'dateOfValidity', '1v1mmr', '1v1Tier', '1v1Division', '2v2mmr', '2v2Tier', '2v2Division', '3v3mmr', '3v3Tier', '3v3Division', 's3v3mmr', 's3v3Tier', 's3v3Division', 'rankSignature'];

bootStrap();

module.exports = {

  memberExists(member) {
    return db.getAsync(`SELECT discordID FROM members WHERE dicordID = ${member.id}`)
      .then((res) => {
        if (res !== undefined) return true;
        return false;
      });
  },

  updateMember(member, { platform, id }) {
    return db.runAsync(`UPDATE members SET ${platform}ID = ${id}, defaultPlatform = ${platform} WHERE discordID = ${member.id}`)
      .then(({ changes }) => changes);
  },

  createMember(member, gamerInfo) {
    return this.memberExists(member)
      .then((exists) => {
        if (exists) return this.updateMember(member, gamerInfo);
        return this.initiateMember(member, gamerInfo);
      });
  },

  initiateMember(member, { platform, id }) {
    const { user } = member;
    const platformID = `${platform}ID`;
    console.log('Sql statement ---', `INSERT INTO members (discordID, discordDiscriminator, defaultPlatform, ${platformID})
    VALUES (${member.id}, ${user.discriminator}, ${platform}, ${id})`);
    db.runAsync(`INSERT INTO members (discordID, discordDiscriminator, defaultPlatform, ${platformID})
      VALUES ("${member.id}", "${user.discriminator}", "${platform}", "${id}")`)
      .then(({ lastID }) => lastID);
  },

  // TODO: Promisify
  getLatestMemberCache(member) {
    return db.getAsync(
      `SELECT * FROM ranks
      WHERE discordID = ${member.id}, DATE(dateOfValidity) = (SELECT MAX(DATE(dateOfValidity)) FROM ranks)`,
      (err, data) => data,
    );
  },

  // TODO: Promisify
  getMemberInfo(member) {
    return db.getAsync(`SELECT * FROM members WHERE discordID = ${member.id}`, (err, row) => row);
  },

  // TODO: Promisify
  createRankCache(member, rankData) {
    //parse rankData into a string for statement
    return db.runAsync(`INSERT INTO ranks (${ranksColumns}) VALUES (${member.id}, )`);
  },
};
