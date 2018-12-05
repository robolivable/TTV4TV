/* eslint-disable */
const path = require('path')
const webpack = require('webpack')

const staticPath = 'static'

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, staticPath, 'build')

const config = {
  context: __dirname,
  devServer: {
    contentBase: path.join(__dirname, staticPath)
  },
  entry: [
    'babel-polyfill',
    path.resolve(sourcePath, 'app.jsx')
  ],
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
    ]
  },
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      sourcePath,
      path.resolve(__dirname, 'node_modules')
    ]
  },
  target: 'web',
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
