var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = [
        new ExtractTextPlugin("./server/static/main.css")
    ];


var config = {
    devtool: 'source-map',
    entry: 'mocha!./src/tests/components.jsx',
    output: {
        filename: './testsBundle/components.js'
    },
    module: {
        loaders: [{
                test: /\.(js|jsx)$/,
                loader: 'babel',
                exclude: /(node_modules)/,
                query: {
                    presets: ["es2015", "react"],
                    plugins: ['transform-runtime']
                }
            },{
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader?sourceMap")
        }]
    },
    plugins: plugins,
    externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
        'react/addons': true
    }
};

module.exports = config;