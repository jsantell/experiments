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

  const meta = experiments[id];
  const config = Object.assign({
    title: 'untitled',
    subtitle: '',
    template: './src/templates/index.hbs',
    id: id,
    filename: `${id}/index.html`,
    inject: false,
  }, meta);

  data.html.push(new html(config));
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
      { test: /\.hbs/, exclude: /node_modules/, use: ['handlebars-loader'] },
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
    tween: {
      commonjs: 'tween',
      commonjs2: 'tween',
      amd: 'tween',
      root: 'TWEEN',
    },
    'dat.gui': 'dat',
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
