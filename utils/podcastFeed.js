const Promise = require('bluebird');
const _ = require('lodash');
const Watcher = require('feed-watcher');
const schedule = require('node-schedule');

const admin = require('../admin');

const feed = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=20';
const interval = 10; // seconds

const watcher = new Watcher(feed, interval);

class guildHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('ready', () => {
      server.join.run(member);
    });
  }
}

function getChannels (guild, channels) {
  Promise.map(channels, (channel) => {
    guild.channels.get(channel);
  });
}

function podcastMessage (channels, entry) {
  Promise.map(channels, (channel) => {
    return channel.send(['New episode of Live From Mannfield is up!!!', entry]);
  });
}

watcher.start();

watcher.on('new entries', (entries) => {
  entries.forEach((entry) => {
    console.log(entry.title);
    return podcastMessage(admin.ALERT_CHANNELS);
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
