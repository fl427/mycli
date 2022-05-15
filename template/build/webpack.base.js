const path = require('path');
module.exports = {
    // 让Webpack知道以哪个模块为入口，进行依赖收集
    entry: './src/index.tsx',
    // 告诉Webpack打包好的文件放在哪里，以及如何命名
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:8].js',
    },
}