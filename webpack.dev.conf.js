const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.conf');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (p) => {
    return path.resolve(__dirname, p);
}

module.exports = merge(commonConfig, {
    entry: {
        main: resolve('./example/main')
    },

    mode: 'development',

    devServer: {
        contentBase: resolve('./dist'),
        port: 8090,
        host: '0.0.0.0',
        hot: true,
        hotOnly: false
    },

    devtool: '#cheap-module-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('./example/index.html'),
            filename: 'index.html',
            inject: 'body'
        })
    ]
});
