// next.config.js
const data = require("./settings");


module.exports = (phase, { defaultConfig }) => {
  const {projectUrls} = data
  return {
    trailingSlash: false,
    env: projectUrls,
  };
};
