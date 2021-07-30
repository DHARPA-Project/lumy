/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const HTMLWebPackPlugin = require('html-webpack-plugin')

const package = require('./package.json')

function getBuildHash() {
  if (process.env.BUILD_HASH != null) return process.env.BUILD_HASH
  try {
    return require('child_process').execSync('git rev-parse --short HEAD').toString().replace('\n', '')
  } catch (e) {
    return 'N/A'
  }
}

module.exports = {
  entry: {
    index: './src/index.tsx',
    splash: './src/splash/index.tsx'
  },
  devtool: 'source-map',
  // stats: 'detailed',
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    disableHostCheck: true,
    before: app => {
      app.get('/modules-package', function (req, res) {
        const { url } = req.query
        if (url == null) return res.send('')

        const urlObject = new URL(url)
        if (urlObject.protocol === 'file:') {
          const filePath = url.replace(/^file:\/\//, '')
          console.log('Seinding file', filePath)
          res.sendFile(path.resolve(filePath))
        } else {
          res.redirect(url)
        }
      })
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      { test: /\.(jpg|png|gif|svg)$/, use: 'file-loader' },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      {
        // In .css files, svg is loaded as a data URI.
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.css$/,
        use: {
          loader: 'svg-url-loader',
          options: { encoding: 'none', limit: 10000 }
        }
      },
      {
        test: /\.(yml|yaml|ipynb)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HTMLWebPackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['index']
    }),
    new HTMLWebPackPlugin({
      filename: 'splash.html',
      template: path.join(__dirname, 'src', 'splash', 'index.html'),
      chunks: ['splash']
    }),
    new webpack.DefinePlugin({
      'process.env.USE_JUPYTER_LAB': JSON.stringify(false),
      'process.env.LUMY_BUILD_HASH': JSON.stringify(getBuildHash()),
      'process.env.LUMY_VERSION': JSON.stringify(package.version)
    })
  ]
}
