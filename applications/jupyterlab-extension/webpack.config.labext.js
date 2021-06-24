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

/**
 * Overrides for JupyterLab supplied extension build config.
 * Make it pick the source maps generated by `tsc`.
 * Overrides https://github.com/jupyterlab/jupyterlab/blob/master/builder/src/webpack.config.base.ts
 */
module.exports = {
  devtool: 'source-map',
  stats: 'detailed',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: ['source-map-loader'],
        enforce: 'pre'
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
        test: /\.svg$/,
        use: ['svg-url-loader']
      },
      {
        test: /\.ipynb$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.USE_JUPYTER_LAB': JSON.stringify(true),
      'process.env.LUMY_BUILD_HASH': JSON.stringify(getBuildHash()),
      'process.env.LUMY_VERSION': JSON.stringify(package.version)
    })
  ]
}
