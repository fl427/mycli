// 第三方
// import * as fs from 'fs';
// import * as child_process from 'child_process';

const currentPath = process.cwd();

type Command = 'start' | 'build';
export default (type: Command) => {
    return new Promise<void>((resolve, reject) => {
        console.log(currentPath);
        resolve();
    })
};