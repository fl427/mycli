// 第三方
import { program } from 'commander';
// 第一方
import { consoleColors } from './utils/chalk';

/* mycli create 创建项目 */
program
    .command('create')
    .description('create a project ')
    .action(function(){
        consoleColors.green('👽 👽 👽 '+'欢迎使用mycli,轻松构建react ts项目～🎉🎉🎉')
    })

/* mycli start 运行项目 */
program
.command('start')
 .description('start a project')
 .action(function(){
    consoleColors.green('--------运行项目-------')
 })

/* mycli build 打包项目 */
program
.command('build')
.description('build a project')
.action(function(){
    consoleColors.green('--------构建项目-------')
})

program.parse(process.argv)

