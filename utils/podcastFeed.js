const _ = require('lodash');
const Watcher = require('feed-watcher');
const schedule = require('node-schedule');

const admin = require('../admin');

const feed = 'http://lfmannfield.podbean.com/feed/';
const interval = 120; // seconds

const watcher = new Watcher(feed, interval);

watcher.on('new entries', (entries) => {
  entries.forEach((entry) => {
    console.log(entry.title);
  });
});

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

class Podcast {
  constructor (bot) {
    this.bot = bot;
    this.botChannels = this.bot.channels.array();
    this.alertChannels = _.filter(this.botChannels, (channel) => {
      // console.log(channel.id);
      return _.includes(admin.ALERT_CHANNELS, `${id}`);
    });
  }

  alertForNewEpisode () {
    console.log(this.bot.channels.array());
    console.log(this.botChannels);
    // console.log(this.alertChannels);
  }
}

function podcast (bot) {
  return new Podcast(bot);
}

module.exports = podcast;
