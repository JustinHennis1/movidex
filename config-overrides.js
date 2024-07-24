const webpack = require('webpack');
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = function override(config) {
  config.resolve.fallback = {
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    process: require.resolve("process/browser"),
    vm: require.resolve("vm-browserify"),
    fs: false
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);
  return config;
};