const Promise = require('bluebird');
// const _ = require('lodash');
const Watcher = require('feed-watcher');
const schedule = require('node-schedule');

const admin = require('../admin');

const feed = 'https://nox-savage.squarespace.com/episodes?format=rss';
const interval = 120; // seconds

const watcher = new Watcher(feed, interval);

const botHolder = {};

class Bot {
  constructor (bot) {
    this.bot = bot;
    this.alertChannelsIds = admin.ALERT_CHANNELS;
  }

  getChannels () {
    return Promise.map(this.alertChannelsIds, (channelId) => {
      return this.bot.channels.get(channelId);
    });
  }

  podcastAlert (message) {
    return this.getChannels()
      .then((channels) => {
        return Promise.map(channels, (channel) => {
          return channel.send(message);
        });
      });
  }
}

function bootstrap (bot) {
  botHolder.bot = new Bot(bot);
  return botHolder.bot;
}

const mondaysAtMidnight = new schedule.RecurrenceRule();
mondaysAtMidnight.dayOfWeek = 1;
mondaysAtMidnight.hour = 0;
mondaysAtMidnight.minute = 1;

const tuesdaysAtMidnight = new schedule.RecurrenceRule();
tuesdaysAtMidnight.dayOfWeek = 2;
tuesdaysAtMidnight.hour = 0;
tuesdaysAtMidnight.minute = 1;

schedule.scheduleJob(mondaysAtMidnight, () => {
  watcher.start();
});

schedule.scheduleJob(tuesdaysAtMidnight, () => {
  watcher.stop();
});

watcher.on('new entries', (entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    return botHolder.bot.podcastAlert(`
-- New Episode of LFM is out! --
${entry.link}
`);
  });
});

module.exports = bootstrap;
