const mongoose = require("mongoose");
const mongodbURL = process.env.MongoDB;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Sucessfully connected application to ${client.user.tag}.`);

    setInterval(await client.checkUpdates, 300000)

    await mongoose.set("strictQuery", true);

    if (!mongodbURL) return;

    await mongoose.connect(mongodbURL || "1118418358535209030", {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      console.log("Sucessfully connected application to MongoDB.");
    }
  },
};
