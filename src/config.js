const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });
const CONFIG = {
  smartStoreTarget: process.env.SMART_STORE_TARGET || "",
  lotteOnTarget: process.env.LOTTE_ON_TARGET || "",
  cartierTarget: process.env.CARTIER_TARGET || "",
  cronString: "*/30 * * * * *",
  slackToken: process.env.SLACK_TOKEN || "",
};

console.log("Loaded config: ", CONFIG);

module.exports = CONFIG;
