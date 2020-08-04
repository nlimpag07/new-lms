// next.config.js

  module.exports = (phase, { defaultConfig }) => {
    return {
        trailingSlash: false,
        env: {
          apiBaseUrl: 'https://localhost:5001/api',
        }
    }
  }