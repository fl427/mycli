// 执行webpack的dev与build
import * as WebpackDevServer from 'webpack-dev-server/lib/Server';
import * as webpack from 'webpack';
// import mergeConfig from "./merge";

import getMergedConfig from '../../buildin.config';

export const buildWebpack = () => {
    // Final Config;
    const config = getMergedConfig();

    console.log('final-config', config);

    const compiler = webpack(config);
    console.log('final-compiler', compiler);
    compiler.run((err, stat) => {
        console.log('curr-stat', stat, err);
    })
}

export const devWebpack = () => {
    const config = getMergedConfig();

    console.log('dev-config', config);
    const compiler = webpack(config);

    const devServerOptions = {
        host: 'localhost',
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
        }
    }

    const server = new WebpackDevServer(compiler, devServerOptions);
    server.listen(8001, '127.0.0.1', () => {
        console.log('Starting server on http://localhost:8001');
    });
}