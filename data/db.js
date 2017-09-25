const Promise = require('bluebird');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./members');

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
        duelMMR INTEGER,
        duelTier INTEGER,
        duelDivision INTEGER,
        doublesMMR INTEGER,
        doublesTier INTEGER,
        doublesDivision INTEGER,
        threesMMR INTEGER,
        threesTier INTEGER,
        threesDivision INTEGER,
        cancerMMR INTEGER,
        cancerTier INTEGER,
        cancerDivision INTEGER,
        rankSignature TEXT
      )`);
    });
}

const membersColumns = ['discordID', 'discordDiscriminator', 'defaultPlatform', 'steamID', 'psnID', 'xboxID'];
const ranksColumns = ['discordID', 'dateOfValidity', 'duelMMR', 'duelTier', 'duelDivision', 'doublesMMR', 'doublesTier', 'doublesDivision', 'threesMMR', 'threesTier', 'threesDivision', 'cancerMMR', 'cancerTier', 'cancerDivision', 'rankSignature'];

bootStrap()
  .then(() => {
    console.log('tables initiated');
  });

module.exports = {

  memberExists(member) {
    return dbAsync.getAsync(`SELECT discordID FROM members WHERE discordID = ${member.id}`)
      .then((res) => {
        if (res !== undefined) return true;
        return false;
      });
  },

  updateMember(member, { platform, id }) {
    return dbAsync.runAsync(`UPDATE members SET ${platform}ID = ${id}, defaultPlatform = ${platform} WHERE discordID = ${member.id}`)
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
    dbAsync.runAsync(`INSERT INTO members (discordID, discordDiscriminator, defaultPlatform, ${platformID})
      VALUES ("${member.id}", "${user.discriminator}", "${platform}", "${id}")`)
      .then(({ lastID }) => lastID);
  },

  // TODO: Promisify
  getLatestMemberCache(member) {
    return dbAsync.getAsync(
      `SELECT * FROM ranks
      WHERE discordID = ${member.id}, DATE(dateOfValidity) = (SELECT MAX(DATE(dateOfValidity)) FROM ranks)`,
      (err, data) => data,
    );
  },

  // TODO: Promisify
  getMemberInfo(member) {
    return dbAsync.getAsync(`SELECT * FROM members WHERE discordID = ${member.id}`, (err, row) => row);
  },

  // TODO: Promisify
  createRankCache(member, rankData) {
    //parse rankData into a string for statement
    return dbAsync.runAsync(`INSERT INTO ranks (${ranksColumns}) VALUES (${member.id}, )`);
  },
};
