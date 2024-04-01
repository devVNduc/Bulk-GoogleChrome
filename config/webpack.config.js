'use strict';

const { merge } = require('webpack-merge'); 
// * kết hợp cấu hình webpack

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
      helper: PATHS.src + '/helper.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
