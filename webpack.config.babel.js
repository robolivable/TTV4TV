/*
 * The MIT License (MIT) Copyright (c) 2018 Robert Oliveira
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
//  config.plugins.push(
//    new webpack.optimize.UglifyJsPlugin()
//  )
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
