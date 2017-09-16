const config = require('../config.json');
const voiceChannels = require('../lib/voiceChannels');

function voiceChannelEvent(memberVoiceStateUpdate) {
  return voiceChannels.automated.run(memberVoiceStateUpdate);
}

class VoiceChannelsHandler {
  constructor(bot) {
    this.bot = bot;
    this.bot.on('voiceStateUpdate', (oldState, newState) => {
      voiceChannelEvent({ oldState, newState });
    });
  }
}

function voiceChannelsHandler(bot) {
  return new VoiceChannelsHandler(bot);
}

module.exports = voiceChannelsHandler;
