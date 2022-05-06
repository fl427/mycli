// 第三方
import { program } from 'commander';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
// 第一方
import { consoleColors } from './utils/chalk';
import { questions, Name } from './utils/question';
import create from './methods/create';
import start from './methods/start';

export type Answer = {
    [key in Name]: string;
} & { conf: boolean }


/* create 创建项目 */
program
    .command('create')
    .description('create a project ')
    .action(function(){
        consoleColors.green('创建项目~');
        inquirer.prompt(questions).then((answer: Answer) => {
            if (answer.conf) {
                create(answer);
            }
        })
    })

/* start 运行项目 */
program
.command('start')
 .description('start a project')
 .action(function(){
    consoleColors.green('运行项目~');
    start('start').then(() => {
        consoleColors.green('+++运行完成+++');
        fs.readFile('./test.config.js', (err, data) => {
            console.log('data-test.config.js', data);
        })
    });
 })

/* build 打包项目 */
program
.command('build')
.description('build a project')
.action(function(){
    consoleColors.green('构建项目~');
    start('build').then(() => {
        consoleColors.green('+++构建完成+++')
        // 这样做是可以的，我们能够在用户的文件夹下读取到配置信息 template package.json中的curr-test是关键，让用户用脚手架cli的命令，就能融合webpack配置
        fs.readFile('./test.config.js', (err, data) => {
            console.log('build+++-test.config.js', data);
        })
    })
})

program.parse(process.argv)

