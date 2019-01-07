module.exports = {
  module: {
    rules: [
      { // transpile js/jsx to ES5
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      { // taken from https://github.com/webpack-contrib/sass-loader
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  output: {
    filename: "bundle.js", // bundle name
    path: __dirname + '/build' // output folder
  },
  devServer: { // for webpack-dev-server
    contentBase: __dirname + '/build' // serve content from build folder
  },
  entry: __dirname + '/client/index.js' // entry file for bundling
}
