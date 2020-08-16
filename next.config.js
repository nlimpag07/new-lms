// next.config.js

module.exports = (phase, { defaultConfig }) => {
  return {
    trailingSlash: false,
    env: {
      apiBaseUrl: "http://localhost:5001/api",
      homeUrl: "http://localhost:3000",
      directoryUrl: "http://localhost:5001/Content/Images/Course",
    },
  };
};
