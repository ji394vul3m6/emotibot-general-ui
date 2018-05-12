'use strict'
const path = require('path');
const utils = require('../build/utils')
const vueLoaderConfig = require('../build/vue-loader.conf')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// load the default config generator.
const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js');

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.
  function resolve(dir) {
    return path.join(__dirname, '..', dir);
  }

  config.resolve = {
    extensions: ['.js', '.vue', '.json', '.scss', '.html', '.svg'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  };
  config.module = {
    rules: [
      ...[createLintingRule()],
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.s[a|c]ss$/,
        // loader: 'style!css!sass'
        use: [
          {
            loader: 'style-loader' // Adds CSS to the DOM by injecting a <style> tag
          },
          {
            loader: 'css-loader', //  interprets @import and url() like import/require() and will resolve them.
          },
          {
            loader: 'postcss-loader', // postcss loader so we can use autoprefixer
            options: {
              config: {
                path: '../postcssrc.js'
              }
            }
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          }
        ],
      }
    ]
  };

  return config;
};