// next.config.js

module.exports = (phase, { defaultConfig }) => {
  return {
    trailingSlash: false,
    env: {
      apiBaseUrl: "https://localhost:5001/api",
      homeUrl: "http://localhost:3000",
      directoryUrl: "https://localhost:5001/FileRepository/Content/Modules",
    },
  };
};
