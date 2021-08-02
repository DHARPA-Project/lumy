/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production' ? true : false

console.log(`Building for production: ${isProduction}`)

module.exports = {
  entry: {
    index: './src/index.ts'
  },
  devtool: isProduction ? undefined : 'source-map', // 'inline-source-map'
  optimization: {
    minimize: isProduction
  },
  // stats: 'detailed',
  mode: isProduction ? 'production' : 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    disableHostCheck: true
  },
  externals: {
    react: '__lumy_react',
    '@dharpa-vre/client-core': '__lumy_clientCore',
    '@material-ui/styles': '__lumy_materialUiStyles',
    '@material-ui/core': '__lumy_materialUiCore',
    '@material-ui/core/styles': '__lumy_materialUiCoreStyles'
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
        test: /\.(yml|yaml|ipynb)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
