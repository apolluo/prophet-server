const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100']
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  // mode: 'production',
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      /* configFile: "./path/to/tsconfig.json" */
    })]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js'
  }
}
