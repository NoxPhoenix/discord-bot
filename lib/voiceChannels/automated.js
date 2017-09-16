const Promise = require('bluebird');

const Channel = {

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
          if (Channel.memberCount(c) === 0) emptyDupes.push(c);
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

  shouldScale(channel, threshold = 1) {
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

function joinedChannel({ oldState, newState }) {
  if (oldState.voiceChannelID !== newState.voiceChannelID && newState.voiceChannelID !== null) return newState.voiceChannelID;
  return null;
}

function leftChannel({ oldState, newState }) {
  return newState.voiceChannelID === null;
}

function joinedGeneral(member) {
  return Channel.shouldScale(member.guild.channels.get('355895057334927362'));
}

function leftGeneral(member) {
  Channel.emptyDuplicates(member.guild.channels.get('355895057334927362'))
    .then(emptyDupes => Channel.scaleDown(emptyDupes));
}

function automatedAction(memberVoiceStateUpdate) {
  const currentChannelState = joinedChannel(memberVoiceStateUpdate);
  console.log(currentChannelState);
  if (currentChannelState) {
    switch (currentChannelState) {
      case '355895057334927362':
        joinedGeneral(memberVoiceStateUpdate.newState);
        break;
      default:
    }
  } else if (leftChannel(memberVoiceStateUpdate)) {
    leftGeneral(memberVoiceStateUpdate.newState);
  }
}

module.exports = {

  run(memberVoiceStateUpdate) {
    automatedAction(memberVoiceStateUpdate);
  },
};
