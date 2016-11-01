var path = require('path');
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, 'public', 'src','index.js'),
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    filename: 'vendor.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.sol/,
        loader: 'truffle-solidity'
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
   new CopyWebpackPlugin([
     { from: './index.html', to: "index.html" }
   ]),
   new ExtractTextPlugin("app.css")
 ],
}
