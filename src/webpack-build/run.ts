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

    // const devServerOptions = {
    //     contentBase: 'dist',
    //     hot: true,
    //     historyApiFallback: true,
    //     compress: true,
    //     open: true,
    // };

    const devServerOptions = {
        host: 'localhost',
        hot: true,
        port: 3000,
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
    server.listen(8000, '127.0.0.1', () => {
        console.log('Starting server on http://localhost:8000');
    });
}