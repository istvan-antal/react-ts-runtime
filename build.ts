import { createCompiler } from './compiler';
const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

export const build = () => {
    createCompiler().run((err: any, stats: any) => {
        if (err) {
            throw err;
        }
        const messages = formatWebpackMessages(stats.toJson({}, true));
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(messages.warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
        } else {
            console.log(chalk.green('Compiled successfully.\n'));
        }
    });
};