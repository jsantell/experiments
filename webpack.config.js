const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const html = require('html-webpack-plugin');
const experiments = require('./experiments.json').experiments;

const data = {
  entries: {},
  html: [],
};
Object.keys(experiments).map(id => {
  data.entries[id] = `./src/${id}/index.js`;
  data.html.push(new html({
    id: id,
    title: experiments[id].title || 'untitled',
    subtitle: experiments[id].subtitle || '',
    template: './src/templates/markup.ejs',
    filename: `${id}/index.html`,
    inject: false,
  }));
});

module.exports = {
  entry: data.entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '',
    libraryTarget: 'umd',
    library: 'app',
    filename: '[name]/bundle.js'
  },
  module: {
    rules: [
      { test: /\.js/, exclude: /node_modules/, use: ['babel-loader'] },
      {
        test: /\.(glsl|frag|vert)$/,
        // exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader']
      },
    ]
  },
  externals: {
    three: {
      commonjs: 'three',
      commonjs2: 'three',
      amd: 'three',
      root: 'THREE',
    },
  },
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    contentBase: [path.resolve(path.join(__dirname, 'public'))],
    host: '0.0.0.0',
    disableHostCheck: true
  },
  plugins: [
    ...data.html
  ]
};
