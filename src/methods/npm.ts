// 下载依赖，启动项目
// 第三方
import * as which from 'which';
const { spawn } = require('child_process');

type findNPMReturnType = {
    npm: string;
    npmPath: string
}

// 找到用户可用的npm
const findNPM = (): findNPMReturnType => {
    const npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm'];
    for (let i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i]);
            console.log('use npm', npms[i], which.sync(npms[i]));
            return {
                npm: npms[i],
                npmPath: which.sync(npms[i])
            };
        } catch (e) {
            console.error(e, '寻找npm失败');
        }
    }
    throw new Error('请安装npm')
}

// 创建子进程运行终端
const runCMD = (cmd: string, args: string[] = [], fn) => {
    const runner = spawn(cmd, args, {
        stdio: 'inherit'
    });
    runner.on('close', code => {
        fn(code)
    })
}

// 主要方法，找到用户的npm并下载依赖
const npmInstall = (args = ['install']) => {
    const { npmPath } = findNPM();
    return (cb?: () => void) => {
        runCMD(npmPath, args, () => {
            cb && cb();
        });
    }
};

export default npmInstall;