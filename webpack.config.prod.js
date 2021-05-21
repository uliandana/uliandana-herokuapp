// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import path from 'path';
import * as loaders from './tools/loaders';

const buildMode = process.argv[2] || '';
const GLOBALS = {
  NODE_ENV: JSON.stringify('production'),
  MODE: buildMode.replace('--', ''),
  API_URL: 'https://api.spotify.com',
};

export default {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  devtool: 'source-map', // more info:https://webpack.js.org/guides/production/#source-mapping and https://webpack.js.org/configuration/devtool/
  entry: path.resolve(__dirname, 'src/index'),
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.EnvironmentPlugin(GLOBALS),

    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'src/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      // Note that you can add custom options here if you need to handle other custom logic in index.html
      // To track JavaScript errors via TrackJS, sign up for a free trial at TrackJS.com and enter your token below.
      trackJSToken: ''
    }),

    // Copy assets directory
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ],
    }),

    new MomentLocalesPlugin({
      localesToKeep: ['id'],
    }),

    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      minRatio: 1
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [loaders.eotProd],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [loaders.woffProd],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [loaders.ottfProd],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [loaders.svgProd],
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [loaders.imageProd],
      },
      {
        oneOf: [
          {
            test: /(\.scoped\.css|\.scoped\.scss|\.scoped\.sass)$/,
            use: [
              MiniCssExtractPlugin.loader,
              loaders.cssModuleProd,
              loaders.postCssModuleProd,
            ],
          },
          {
            test: /(\.css|\.scss|\.sass)$/,
            use: [
              MiniCssExtractPlugin.loader,
              loaders.cssProd,
              loaders.postCssProd,
            ],
          },
        ],
      },
    ],
  },
};
