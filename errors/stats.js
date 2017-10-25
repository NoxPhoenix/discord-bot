const makeProfilePrompt = `Please setup your profile with ${global.admin.prefix}me set (platform) (id)`;

class PlayerProfileNotFoundError extends Error {
  constructor (memberID) {
    super(makeProfilePrompt);

    this.memberID = memberID;
  }
}

class PlayerStatsNotFoundError extends Error {
  constructor (platform, id) {
    super(`Error finding stats for ${id} on ${platform}`);
  }
}

module.exports = {
  PlayerProfileNotFoundError,
  PlayerStatsNotFoundError,
};
