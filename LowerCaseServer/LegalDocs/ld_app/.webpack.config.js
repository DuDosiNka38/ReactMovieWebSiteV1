// define child rescript
module.exports = config => {
  config.target = 'electron-renderer';

  // config.target = 'web';
  return config;
}