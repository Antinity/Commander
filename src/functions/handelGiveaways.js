const GiveawaysManager = require("../utils/gw");

module.exports = (client) => {
  client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#FF0000",
      embedColorEnd: "#F5F5F5",
      reaction: "🎉",
    },
  });
};
