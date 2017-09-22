const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./members');

function bootStrap() {
  db.run(`CREATE TABLE IF NOT EXISTS members(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordID TEXT NOT NULL UNIQUE,
    discordDiscriminator TEXT NOT NULL UNIQUE
    defaultPlatform TEXT,
    steamID TEXT UNIQUE,
    psnID TEXT UNIQUE,
    xboxID TEXT UNIQUE
  )`, () => console.log('members table initiated.'));

  db.run(`CREATE TABLE IF NOT EXISTS ranks(
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
  )`, () => console.log('ranks table initiated.'));
}

const membersColumns = ['discordID', 'discordDiscriminator', 'defaultPlatform', 'steamID', 'psnID', 'xboxID'];
const ranksColumns = ['discordID', 'dateOfValidity', '1v1mmr', '1v1Tier', '1v1Division', '2v2mmr', '2v2Tier', '2v2Division', '3v3mmr', '3v3Tier', '3v3Division', 's3v3mmr', 's3v3Tier', 's3v3Division', 'rankSignature'];

bootStrap();

module.exports = {

  memberExists(member) {
    db.get(`SELECT discordID FROM members WHERE dicordID = ${member.id}`, (err, id) => {
      if (id) return true;
      return false;
    });
  },

  updateMember(member, { platform, id }) {
    db.run(`UPDATE members SET ${platform}ID = ${id}, defaultPlatform = ${platform} WHERE discordID = ${member.id}`, (err, result) => {
      if (err) console.log(err);
      return result;
    });
  },

  createMember(member, gamerInfo) {
    if (this.memberExists(member)) return this.updateMember(member, gamerInfo);
    return this.initiateMember(member, gamerInfo);
  },

  initiateMember(member, { platform, id }) {
    const { user } = member;
    db.run(
      `INSERT INTO members (discordID, discordDiscriminator, ${platform}ID)
      VALUES (${member.id}, ${user.discriminator}), ${id})`,
      (err) => {
        if (err === null) return 'Success';
        return 'Failed';
      },
    );
  },

  getLatestMemberCache(member) {
    return db.get(
      `SELECT * FROM ranks
      WHERE discordID = ${member.id}, DATE(dateOfValidity) = (SELECT MAX(DATE(dateOfValidity)) FROM ranks)`,
      (err, data) => data,
    );
  },

  getMemberInfo(member) {
    return db.get(`SELECT * FROM members WHERE discordID = ${member.id}`, (err, row) => row);
  },

  createRankCache(member, rankData) {
    //parse rankData into a string for statement
    return db.run(`INSERT INTO ranks (${ranksColumns}) VALUES (${member.id}, )`);
  },
};
