const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Adicione isso para resolver o erro "process is not defined"
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  config.resolve.fallback.process = require.resolve('process/browser');
  
  return config;
};
