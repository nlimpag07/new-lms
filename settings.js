const config = require("./config.json");

const projectUrls = {
  apiBaseUrl: `${ config.apiUrl }/api`,
  homeUrl: config.homeUrl,
  directoryUrl: `${ config.apiUrl }/FileRepository/Content`,
  lrsUrl: "https://test.gblrs.com/xAPI",
  lrsIdentifier: "29-390c40726d411da",
  lrsSecret: "8bf04215fb9e249fa8358f730",
};

module.exports = { projectUrls };
