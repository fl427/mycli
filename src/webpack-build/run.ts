// 执行webpack的dev与build
import * as WebpackDevServer from 'webpack-dev-server/lib/Server';
import * as webpack from 'webpack';
import * as fs from "fs";
// import mergeConfig from "./merge";
// import getMergedConfig from '../../buildin.config';
import getMergedDevConfig from '../webpack/webpack.dev.config';
import getMergedProdConfig from '../webpack/webpack.prod.config';
import {cliCommandType} from "index";

// 取得用户自定义的devServer内容
const getUserDevServerConfig = async (type: cliCommandType) => {
    const targetPath = process.cwd() + (type === 'start' ? '/build/webpack.dev.js' : '/build/webpack.prod.js');
    const isExist = fs.existsSync(targetPath);
    if (isExist) {
        // 用户的配置
        const userConfig = await import(targetPath) || {};
        console.log('取得用户自定义的devServer配置', userConfig);
        return userConfig;
    }
    return null;
}

// 开发环境构建
export const devWebpack = async (type: cliCommandType) => {
    // 获取用户配置，传递给getMergedDevConfig函数进行融合
    const userConfig = await getUserDevServerConfig(type);
    // 提取出用户配置中的devServer字段
    const { devServer: userDevServerConfig } = userConfig;
    const config = await getMergedDevConfig(userConfig);

    console.log('dev的config', config);

    const compiler = webpack(config);

    const defaultDevServerConfig = {
        host: 'localhost',
        port: 8001,
        open: true,
        hot: true,
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

    // 用户自定义了devServer就使用用户自己的内容，否则使用默认配置
    const devServerOptions = userDevServerConfig ? userDevServerConfig : defaultDevServerConfig;

    const server = new WebpackDevServer(devServerOptions, compiler);
    const runServer = async () => {
        console.log('Starting server...');
        await server.start();
    };
    runServer().then();
}

// 生产环境构建
export const buildWebpack = async (type: cliCommandType) => {
    const userConfig = await getUserDevServerConfig(type);
    // Final Config;
    const config = await getMergedProdConfig(userConfig);

    console.log('build的config', config);

    const compiler = webpack(config);
    compiler.run((err, stat) => {
        console.log('构建时', err);
    })
}