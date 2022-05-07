// 执行webpack的dev与build
// import * as WebpackDevServer from 'webpack-dev-server/lib/Server';
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