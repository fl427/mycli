// 第三方
import * as fs from 'fs';
import * as path from "path";

// 第一方
import { Answer } from "..";
import {consoleColors} from "../utils/chalk";
import npmInstall from "../methods/npm";

// 核心方法，在用户本地目录复制模板文件
const create = (res: Answer) => {
    console.log('确认创建项目，用户选择为：', res);
    // 找到本地template文件夹，使用__dirname拼接，找到脚手架目录中的template文件夹，加上replace的原因是我们的编译产物放在lib文件夹下，所以要继续向上回溯，消除lib/这一层级
    const templateFilePath = __dirname.slice(0, -11).replace('lib/', '') + 'template';
    // 我们需要知道用户当前的运行目录，以便将文件夹复制过去
    // const targetPath = process.cwd() + '/target';
    let targetPath = process.cwd();
    consoleColors.red('dev环境' + targetPath);
    // 方便调试，防止覆盖项目代码
    if (targetPath === '/Users/bytedance/Documents/demo/mycli03-final-version') {
        // 为了方便起见，重定向targetPath
        // todo: 本地调试由于当前运行环境，node_modules安装失败
        targetPath = '/Users/bytedance/Desktop/p'
    }
    console.log('template目录和target目录', templateFilePath, targetPath);

    handleCopyTemplate(templateFilePath, targetPath).then(() => {
        handleRevisePackageJson(res, targetPath).then(() => {
            consoleColors.blue('复制template文件夹已完成，可以进行npm install操作');
            const t = npmInstall();
            t(() => {
                // npm install完成，启动项目
                consoleColors.blue('npm install已完成，可以进行npm start操作');
                runProject();
            })
        });
    });
};

// 运行npm start启动项目
const runProject = () => {
    try {
        npmInstall(['start'])();
    } catch (e) {
        consoleColors.red('自动启动失败，请手动启动')
    }
}

// 读取template中的package.json，将其中信息修改为用户输入，并写入到用户工作目录，写入完成后，在回调函数中复制整个template项目
const handleRevisePackageJson = (res: Answer, targetPath: string): Promise<void> => {
    return new Promise<void>((resolve) => {
        consoleColors.green('template文件夹复制成功，接下来修改package.json中的元数据');
        fs.readFile(targetPath + '/package.json', 'utf8', (err, data) => {
            if (err) throw err;
            const { name, author } = res;

            const jsonObj = JSON.parse(data);
            if (name) jsonObj['name'] = name;
            if (author) jsonObj['author'] = author;

            // 写入文件，stringify的后两个参数是为了换行格式化
            fs.writeFile(targetPath + '/package.json', JSON.stringify(jsonObj,null,"\t"), () => {
                consoleColors.green('创建package.json文件：' + targetPath + '/package.json');
                resolve();
            })
        });
    })
};

// 复制template文件夹下的文件 使用fs的同步方法+promise.all，同步读取目录，异步处理文件复制，promise.all回调来执行复制文件完成的回调
const handleCopyTemplate = (templateFilePath: string, targetPath: string) => {
    console.log('开始对template文件夹进行复制', templateFilePath, targetPath);
    if (!templateFilePath || !targetPath || templateFilePath === targetPath) {
        return Promise.reject(new Error('参数无效'));
    }
    return new Promise((resolve, reject) => {
        // 不存在目标目录则同步创建
        if (!fs.existsSync(targetPath)) {
            console.log('目标文件夹不存在', targetPath);
            fs.mkdirSync(targetPath, { recursive: true });
        }
        const tasks: {fromPath: string; toPath: string; stat: fs.Stats}[] = [];
        handleReadFileSync(templateFilePath, targetPath, (fromPath: string, toPath: string, stat: fs.Stats) => {
            tasks.push({
                fromPath,
                toPath,
                stat
            });
        });
        Promise.all(tasks.map(task => handleCopyFileAsync(task.fromPath, task.toPath, task.stat))).then(resolve).catch(e => reject(e))
    })
}

// 读取目录的操作我们同步执行
const handleReadFileSync = (fromDir: string, toDir: string, cb: (fromPath: string, toPath: string, stat: fs.Stats) => void) => {
    const fileList = fs.readdirSync(fromDir);
    fileList.forEach(name => {
        const fromPath = path.join(fromDir, name);
        const toPath = path.join(toDir, name);
        const stat = fs.statSync(fromPath);
        if (stat.isDirectory()) {
            // 文件夹则递归处理
            // 不存在目标目录则同步创建
            if (!fs.existsSync(toPath)) {
                fs.mkdirSync(toPath, { recursive: true });
            }
            handleReadFileSync(fromPath, toPath, cb);
        } else if (stat.isFile()) {
            cb(fromPath, toPath, stat);
        }
    })
}

// 复制文件耗时，我们异步处理
const handleCopyFileAsync = (fromPath: string, toPath: string, stat: fs.Stats) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(fromPath);
        const writeStream = fs.createWriteStream(toPath);
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

export default create;