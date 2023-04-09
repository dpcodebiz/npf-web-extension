const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require('react-scripts/config/paths');

module.exports = {
  // ...
  webpack: {
    plugins: {
      remove: [ 'HtmlWebpackPlugin' ], // Removing the actual config
      add: [ 
        [new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: 'body',
              template: paths.appHtml,
            },
            {
              minify: {
                removeComments: false,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          )
        ), 'prepend'] // This config should always be kept up-to-date with the one provided by Create-React-App
      ],
      configure: (webpackConfig, {}) => {

        // Disabling chunks
        webpackConfig.optimization.splitChunks = {
          cacheGroups: {
            default: false,
          },
        };
        webpackConfig.optimization.runtimeChunk = false;

        return webpackConfig;
      },
    },
  },
};