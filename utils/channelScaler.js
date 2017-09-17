const Promise = require('bluebird');

const Scaler = {

  memberCount({ members }) {
    return members.size;
  },

  duplicatesCheck(channel) {
    const channelName = channel.name;
    const duplicates = [];
    return Promise.map(channel.guild.channels.array(), (c) => {
      if (c.name.startsWith(channelName)) duplicates.push(c);
      return Promise.resolve();
    })
      .then(() => duplicates);
  },

  emptyDuplicates(channel) {
    const emptyDupes = [];
    return this.duplicatesCheck(channel)
      .then((duplicates) => {
        return Promise.map(duplicates, (c) => {
          if (this.memberCount(c) === 0) emptyDupes.push(c);
          return Promise.resolve();
        })
          .then(() => emptyDupes);
      });
  },

  duplicate(channel) {
    return this.duplicatesCheck(channel)
      .then(duplicates => (
        channel.guild.createChannel(`${channel.name} ${duplicates.length + 1}`, 'voice')
          .then(newChannel => newChannel.setPosition(duplicates.length + 1))
      ));
  },

  scale(channel, threshold = 1) {
    return this.emptyDuplicates(channel)
      .then((emptyDupes) => {
        if (channel.members.size >= threshold && emptyDupes.length === 0) return this.duplicate(channel);
        return null;
      });
  },

  scaleDown(channels) {
    channels.splice(0, 1);
    return Promise.map(channels, (c) => {
      c.delete();
    });
  },
};

module.exports = Scaler;
