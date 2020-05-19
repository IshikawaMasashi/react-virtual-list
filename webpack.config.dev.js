const webpack = require('webpack');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devBasedir = join(__dirname, 'dev');

module.exports = {
  mode: 'development',
  entry: join(devBasedir, 'index.tsx'),
  output: {
    path: devBasedir,
    filename: 'ReactContexify.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noUnusedLocals: false,
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(devBasedir, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port: process.env.PORT || 8888,
    historyApiFallback: true,
    open: true,
    // host: '0.0.0.0'
  },
};
