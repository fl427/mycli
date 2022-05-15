// 获取开发者的自定义配置，和脚手架的默认配置合并
import {merge} from 'webpack-merge';

// 返回最终打包的webpack配置
const mergeConfig = async (config, userConfig) => {
    if (!userConfig) {
        return config;
    }
    return merge(config, userConfig);
}

export default mergeConfig;