const admin = require('./admin');
const scaler = require('./channelScaler');
const podcast = require('./podcastFeed');
const stats = require('./rlStats');
const wumpus = require('./wumpus');

module.exports = {
  admin,
  scaler,
  podcast,
  stats,
  wumpus,
};
