// 获取开发者的自定义配置，和脚手架的默认配置合并
import * as fs from 'fs';
import { merge } from 'webpack-merge';


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
const mergeConfig = (config) => {
    const targetPath = process.cwd() + '/fl427.config.js';
    const isExist = fs.existsSync(targetPath);

    let resultConfig = config || {};
    if (isExist) {
        // 用户的配置
        fs.readFile(targetPath, 'utf8', async(err, data) => {
            if (err) {
                throw err;
            }
            const userConfig = await import(targetPath);
            // console.log('用户配置对象', userConfig);

            const mergeConfigResult = getMergeResult(userConfig, config);
            // console.log('合并用户配置对象后的结果', mergeConfigResult);
            // return mergeConfigResult;
            resultConfig = mergeConfigResult;
        });
    }
    // console.log('我们的结果', resultConfig);
    return resultConfig;
}

export default mergeConfig;