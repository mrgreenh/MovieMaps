var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = [
        new ExtractTextPlugin("./server/static/main.css"),
        //Remove these 2 following entries for development
        new Webpack.DefinePlugin({
          "process.env": { 
             NODE_ENV: JSON.stringify("production") 
           }
        }),
        new Webpack.optimize.UglifyJsPlugin({compress: { warnings: false } })
    ];

var config = {

    // We change to normal source mapping
    devtool: 'source-map',
    entry: './src/main.jsx',
    output: {
        filename: './server/static/bundle.js'
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
    plugins: plugins
};


module.exports = config;