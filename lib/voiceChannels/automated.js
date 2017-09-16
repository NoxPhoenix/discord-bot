function joinedGeneral(member) {
  member.send('welcome to general chat!');
  const amtOfMembers = member.guild.channels.get('355895057334927362').members.size;
  console.log(`There are ${amtOfMembers} member(s) in General!`);
  member.guild.createChannel('Other General', 'voice');
}

function automatedAction({ oldState, newState }) {
  switch (newState.voiceChannelID) {
    case '355895057334927362':
      joinedGeneral(newState);
      break;
    default:
  }
}

module.exports = {

  run(memberVoiceStateUpdate) {
    automatedAction(memberVoiceStateUpdate);
  },
};
