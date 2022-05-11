// 第三方
import { program } from 'commander';
import * as inquirer from 'inquirer';
// import * as fs from 'fs';
// 第一方
import { consoleColors } from './utils/chalk';
import { questions, Name } from './utils/question';
import create from './methods/create';
import start from './methods/start';
import {buildWebpack, devWebpack} from './webpack-build/run';

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
        devWebpack();
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
        buildWebpack();
    })
})

program.parse(process.argv)

