var __DEV__ = process.env.NODE_ENV !== 'production'

module.exports = {
  devtool: 'cheap-module-source-map',
  debug: __DEV__,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}