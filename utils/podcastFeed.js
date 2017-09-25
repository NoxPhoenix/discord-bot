const Watcher = require('feed-watcher');
const schedule = require('node-schedule');

const feed = 'http://lfmannfield.podbean.com/feed/';
const interval = 35; // seconds

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
  constructor(bot) {
    this.bot = bot;
  }
}

function podcast(bot) {
  return new Podcast(bot);
}

module.exports = podcast;
