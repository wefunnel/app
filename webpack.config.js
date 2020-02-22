const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  entry: ['./src/index.tsx',],
  output: {
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['*', '.ts', '.tsx', '.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/]
        },
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          }
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'static/index.ejs',
      filename: 'index.html',
      inlineSource: '.(js|css)',
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ]
}
