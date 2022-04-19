// const chalk = require('chalk');
import * as chalk from 'chalk';

export const consoleColors = {
    green: (text: string) => console.log(chalk.green(text)),
    blue: (text: string) => console.log(chalk.blue(text)),
    yellow: (text: string) => console.log(chalk.yellow(text)),
    red: (text: string) => console.log(chalk.red(text)),
}