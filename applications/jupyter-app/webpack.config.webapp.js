/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const HTMLWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { index: './src/webapp/index.ts' },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/webapp')
  },
  devtool: 'source-map',
  // stats: 'detailed',
  mode: 'development',
  // watch: true,
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        context: () => true
      },
      // '/': {
      //   target: 'http://localhost:8888'
      // },
      '/static': {
        target: 'http://localhost:8888'
      },
      '/api/kernels/*/channels': {
        target: 'ws://localhost:8888',
        ws: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'source-map-loader',
            options: {
              filterSourceMappingUrl: (_, resourcePath) => {
                // Several @jupyterlab packages mention ts declarations, but the files
                // are missing. This make webpack print warnings. Disable them here
                // altogether.
                if (
                  /.*\/node_modules\/@jupyterlab\/(ui-components|services|coreutils|apputils|translation|statedb|statusbar|rendermime|rendermime-interfaces|observables|nbformat|filebrowser|docmanager|docregistry|codemirror|codeeditor)\/.*/.test(
                    resourcePath
                  )
                ) {
                  return false
                }
                return true
              }
            }
          }
        ],
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
      { test: /\.(jpg|png|gif)$/, use: 'file-loader' },
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
        test: /\.(yml|yaml)$/,
        loader: 'raw-loader'
      },
      {
        // FROM: https://github.com/jupyterlab/jupyterlab/blob/master/builder/src/webpack.config.base.ts
        // In .ts and .tsx files (both of which compile to .js), svg files
        // must be loaded as a raw string instead of data URIs.
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.js$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HTMLWebPackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'webapp', 'index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.USE_JUPYTER_LAB': JSON.stringify(false)
    }),
    // FROM: https://github.com/jupyterlab/jupyterlab/blob/master/builder/src/webpack.config.base.ts#L94-L98
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
}
