const channelScaler = require('../../utils/channelScaler');

function channelNameFromMemberState(memberState) {
  return memberState.voiceChannel.name;
}

const join = {
  General(member) {
    channelScaler.scale(member.guild.channels.get('355895057334927362'));
  },
};

const left = {
  General(member) {
    channelScaler.emptyDuplicates(member.guild.channels.get('355895057334927362'))
      .then(emptyDupes => channelScaler.scaleDown(emptyDupes));
  },
};

module.exports = {

  join(memberVoiceStateUpdate) {
    const channelName = channelNameFromMemberState(memberVoiceStateUpdate.newState);
    join[channelName](memberVoiceStateUpdate.newState);
  },

  left(memberVoiceStateUpdate) {
    const channelName = channelNameFromMemberState(memberVoiceStateUpdate.oldState);
    left[channelName](memberVoiceStateUpdate.newState);
  },
};
