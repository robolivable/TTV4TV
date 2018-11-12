/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
// const htmlWebpackPlugin = require('html-webpack-plugin')

const sourcePath = path.join(__dirname, 'src')

const config = {
  entry: ['babel-polyfill', path.resolve(sourcePath, 'app.jsx')],
  output: { path: __dirname, filename: 'bundle.js' },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [sourcePath, path.resolve(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: sourcePath,
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      }
//      {
//        loader: 'expose-loader?React'
//      }
    ]
  },
  context: __dirname,
//  devtool: 'source-map',
//  devServer: {
//    contentBase: './src/app',
//    progress: true,
//    stats: 'errors-only'
//  },
  target: 'web',
  plugins: [
//    new htmlWebpackPlugin({
//      title: 'TTV4TV',
//      hash: true
//    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  )
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  )
  config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
  config.plugins.push(new webpack.HashedModuleIdsPlugin())
}

module.exports = config
/* eslint-enable */
