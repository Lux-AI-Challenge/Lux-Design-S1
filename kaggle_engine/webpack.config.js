const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './run.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    usedExports: true,
    providedExports: true,
    sideEffects: true,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // library: {
    //   type: 'commonjs'
    // }
  },
};