/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')

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
    main: './src/electron/main.ts',
    preload: './src/electron/preload.ts',
    installerPreload: './src/electron/installerPreload.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/electron')
  },
  devtool: 'source-map',
  mode: 'development',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'source-map-loader'
          }
        ],
        enforce: 'pre'
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.electron.json')
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.USE_JUPYTER_LAB': JSON.stringify(false),
      LUMY_MIDDLEWARE_VERSION: JSON.stringify(package.lumy.middleware.version),
      'process.env.LUMY_BUILD_HASH': JSON.stringify(getBuildHash()),
      'process.env.LUMY_VERSION': JSON.stringify(package.version)
    })
  ]
}
