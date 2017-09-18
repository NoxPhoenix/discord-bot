const channelScaler = require('../../utils/channelScaler');

function channelNameFromMemberState(memberState) {
  return memberState.voiceChannel.name;
}

const join = {
  General(memberState) {
    channelScaler.scale(memberState.guild.channels.get('355895057334927362'));
  },
};

const left = {
  General(memberState) {
    channelScaler.scaleDown(memberState.guild.channels.get('355895057334927362'));
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
