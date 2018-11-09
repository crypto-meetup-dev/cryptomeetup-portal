const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

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
};
