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
      },
      { // taken from https://github.com/webpack-contrib/file-loader
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader', // used to load images
            options: {},
          },
        ],
      }
    ]
  },
  output: {
    filename: "bundle.js", // bundle name
    path: __dirname + '/build' // output folder
  },
  devServer: { // for webpack-dev-server
    contentBase: __dirname + '/build', // serve content from build folder
    publicPath: '/',
    historyApiFallback: true, // redirect to index file on 404
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  entry: ['babel-polyfill', __dirname + '/client/index.js'] // entry file for bundling
}
