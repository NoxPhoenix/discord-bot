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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ranks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discordID TEXT NOT NULL UNIQUE,
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

bootStrap();

module.exports = {

  memberExists(member) {
    db.get(`SELECT discordID FROM members WHERE dicordID = ${member.id}`, (err, id) => {
      if (id) return true;
      return false;
    });
  },

  updateMember(member, { platform, id }) {
    db.run(`UPDATE members SET ${platform}ID = ${id} WHERE discordID = ${member.id}`, (err, result) => {
      if (err) console.log(err);
      return result;
    });
  },

  createMember(member, gamerInfo) {
    if (this.memberExists(member)) this.updateMember(member, gamerInfo);
    this.initiateMember(member, gamerInfo);
  },

  initiateMember(member, { platform, id }) {
    const { user } = member;
    db.run(`INSERT INTO members (discordID, discordDiscriminator, ${platform}ID)
    VALUES (${member.id}, ${user.discriminator}), ${id})`);
  },


};
