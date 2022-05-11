// 获取开发者的自定义配置，和脚手架的默认配置合并
import * as fs from 'fs';
import {merge} from 'webpack-merge';


type UserConfig = {
    dev: object;
    pro: object;
    base: object;
}
// 合并配置
const getMergeResult = (userConfig: UserConfig, config) => {
    const {
        base = Object.create(null),
        dev = Object.create(null),
    } = userConfig;
    return merge(config, base, dev);
}

// 返回最终打包的webpack配置
const mergeConfig = async (config) => {
    const targetPath = process.cwd() + '/fl427.config.js';
    const isExist = fs.existsSync(targetPath);

    let resultConfig = config || {};
    if (isExist) {
        // 用户的配置
        const userConfig = await import(targetPath);
        resultConfig = getMergeResult(userConfig, config);
        // fs.readFile(targetPath, 'utf8', async(err, data) => {
        //     if (err) {
        //         throw err;
        //     }
        //     const userConfig = await import(targetPath);
        //     console.log('用户配置对象', userConfig);
        //     resultConfig = getMergeResult(userConfig, config);
        // });
    }
    console.log('我们融合后的DevConfig结果', resultConfig);
    return resultConfig;
}

export default mergeConfig;