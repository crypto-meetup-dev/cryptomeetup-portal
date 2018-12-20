const webpack = require('webpack');
// eslint-disable-line import/no-extraneous-dependencies
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
// const path = require('path');

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '//bj.dongchangdi.com' : '',
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/global.scss";',
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'raw-loader',
        }
      ],
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        mapboxgl: 'mapbox-gl',
      }]);
    // 别动md的loader，这里就是这样的
    config.module.rule('md')
        .test(/\.md/)
        .use('raw-loader')
        .loader('raw-loader')
        .end();
    config.module.rule('images').use('url-loader').loader('url-loader').tap(options => Object.assign(options, { limit: 10240 }));
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: true,
    proxy: 'https://cryptomeetup.io',
  },
};
