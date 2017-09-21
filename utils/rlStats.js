const rls = require('rls-api');

const statClient = new rls.Client({
  token: 'D7OTT8C65KGJ6GH7G8XEB18CBMREHVD3',
});

module.exports = {

  playerByID(id, platform, cb) {
    return statClient.getPlayer(id, rls.platforms[platform], (status, data) => {
      if (status === 200) {
        console.log(data.signatureUrl);
        return cb(data.signatureUrl);
      }
      return cb('Data not found!');
    });
  },

};
