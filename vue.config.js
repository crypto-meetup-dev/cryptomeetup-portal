const webpack = require('webpack');
// eslint-disable-line import/no-extraneous-dependencies
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
// const path = require('path');

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
        // {
        // 不知道vue3.0做什么妖转的base64页面加载不出来
        //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        //   loader: 'url-loader',
        //   options: {
        //     limit: 1000,
        //   }
        // },
      ],
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        mapboxgl: 'mapbox-gl',
      }]);
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      });
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
