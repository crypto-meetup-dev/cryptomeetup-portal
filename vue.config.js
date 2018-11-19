const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

module.exports = {
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
        },
      ],
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        mapboxgl: 'mapbox-gl',
      }]);
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    https: protocol === 'https',
    proxy: 'http://47.101.179.109:14000',
  },
};
