const path = require("path");

module.exports = {
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".json", ".vue"]
  },
  entry: path.resolve(__dirname + "/src/index.js"),
  output: {
    path: path.resolve(__dirname + "/dist/"),
    filename: "index.js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              [
                "env",
                {
                  modules: false,
                  targets: {
                    browsers: ["> 2%"],
                    uglify: true
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  }
};
