const admin = require('../../admin');
const channelScaler = require('../../utils/channelScaler');

function channelFromMemberState(memberState) {
  return memberState.voiceChannel;
}

function scaleChannel(channel) {
  channelScaler.scale(channel);
}

function scaleDownChannel(channel) {
  channelScaler.scaleDown(channel);
}

module.exports = {

  join(memberVoiceStateUpdate) {
    const channel = channelFromMemberState(memberVoiceStateUpdate.newState);
    if (admin.SCALABLE_CHANNELS.includes(channel)) scaleChannel(channel);
  },

  left(memberVoiceStateUpdate) {
    const channel = channelFromMemberState(memberVoiceStateUpdate.oldState);
    if (admin.SCALABLE_CHANNELS.includes(channel)) scaleDownChannel(channel);
  },
};
