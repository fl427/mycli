const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base');

module.exports = merge(baseWebpackConfig, {
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        host: 'localhost',
        hot: true,
        port: 3000,
        open: true,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/api': {
                target: "http://localhost:4000",
                changeOrigin: true,
            }
        },
        devMiddleware: {
            // 简化Server输出，我们只希望看到error信息
            stats: 'errors-only',
        }
    }
});