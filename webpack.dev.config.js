const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');
// const ENV_DIR = path.resolve(__dirname, 'environments');
// const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');

// const populateEnv = () => {
//   const env = dotenv.config({
//     path: ENV_DIR + '/dev/.env',
//   }).parsed;
//   const finalObject = {};

//   if (env)
//     Object.keys(env).forEach(i => {
//       finalObject[i] = JSON.stringify(env[i]);
//     });

//   return finalObject;
// };

module.exports = {
  entry: {
    app: APP_DIR + '/app.ts',
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [path.resolve('src'), path.resolve('node_modules')],
  },
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'eval-source-map',
  node: {
    __dirname: true,
    __filename: true,
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     ...populateEnv(),
    //   },
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: APP_DIR,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
};
