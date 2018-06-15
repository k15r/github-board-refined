const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    // Each entry in here would declare a file that needs to be transpiled
    // and included in the extension source.
    // For example, you could add a background script like:
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup.js',
    modal: './src/features/issues/modal.js',
    resize: './src/features/columns/resize.js',
    hideReferences: './src/features/columns/hide-references.js',
  },
  output: {
    // This copies each source entry into the extension dist folder named
    // after its entry config key.
    path: path.join(path.resolve(__dirname), 'src', 'distribution'),
    filename: '[name].js',
  },
  module: {
    // This transpiles all code (except for third party modules) using Babel.
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      // Babel options are in .babelrc
      use: ['babel-loader'],
    }],
  },
  resolve: {
    // This allows you to import modules just like you would in a NodeJS app.
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: '*',
        context: 'src/distribution',
        ignore: '*.js'
      },
      {
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
      }
    ]),
    // Since some NodeJS modules expect to be running in Node, it is helpful
    // to set this environment var to avoid reference errors.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    // Without this, function names will be garbled and enableFeature won't work
    concatenateModules: true,

    // Automatically enabled on prod; keeps it somewhat readable for AMO reviewers
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2 // eslint-disable-line camelcase
          }
        }
      })
    ]
  },
  // This will expose source map files so that errors will point to your
  // original source files instead of the transpiled files.
  devtool: 'sourcemap',
};
