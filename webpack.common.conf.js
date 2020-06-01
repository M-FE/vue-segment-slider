const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const resolve = (p) => {
    return path.resolve(__dirname, p);
}

// const isProd = process.env.NODE_ENV !== 'development';

module.exports = {
    output: {
        filename: '[name].js',
        path: resolve('./dist')
    },

    resolve: {
        extensions: ['.vue', '.js', '.jsx', '.json'],
        alias: {
            '@': resolve('./src/')
        }
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(vue|jsx?)$/,
                use: ['eslint-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader', 'astroturf/loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            // {
            //     test: /\.(css|scss|sass)$/,
            //     use: [{
            //         loader: MiniCssExtractPlugin.loader,
            //         options: {
            //             hmr: !isProd,
            //             reloadAll: true
            //         }
            //     }, 'css-loader', 'postcss-loader', 'sass-loader']
            // },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: ['file-loader']
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: 'css/index.css'
        // }),
        new ProgressBarPlugin()
    ]
};
