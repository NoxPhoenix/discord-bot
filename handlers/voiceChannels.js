const voiceChannels = require('../lib/voiceChannels');

function stateChangeType({ oldState, newState }) {
  if (oldState.voiceChannelID !== newState.voiceChannelID && newState.voiceChannelID !== null) return 'joinedChannel';
  else if (newState.voiceChannelID === null) return 'leftChannel';
  return null;
}

class VoiceChannelsHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('voiceStateUpdate', (oldState, newState) => {
      const memberVoiceStateUpdate = { oldState, newState };
      switch (stateChangeType(memberVoiceStateUpdate)) {
        case 'joinedChannel':
          voiceChannels.automated.join(memberVoiceStateUpdate);
          break;
        case 'leftChannel':
          voiceChannels.automated.left(memberVoiceStateUpdate);
          break;
        default: break;
      }
    });
  }
}

function voiceChannelsHandler(bot) {
  return new VoiceChannelsHandler(bot);
}

module.exports = voiceChannelsHandler;
