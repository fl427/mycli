// 执行webpack的dev与build
import * as WebpackDevServer from 'webpack-dev-server/lib/Server';
import * as webpack from 'webpack';
// import mergeConfig from "./merge";
// import getMergedConfig from '../../buildin.config';
import getMergedDevConfig from '../webpack/webpack.dev.config';
import getMergedProdConfig from '../webpack/webpack.prod.config';

// 开发环境构建
export const devWebpack = async () => {
    const config = await getMergedDevConfig();

    console.log('dev的config', config);
    const compiler = webpack(config);

    const devServerOptions = {
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

    const server = new WebpackDevServer(devServerOptions, compiler);
    const runServer = async () => {
        console.log('Starting server...');
        await server.start();
    };
    runServer().then();
}

// 生产环境构建
export const buildWebpack = async () => {
    // Final Config;
    const config = await getMergedProdConfig();

    console.log('build的config', config);

    const compiler = webpack(config);
    compiler.run((err, stat) => {
        console.log('构建时', err);
    })
}