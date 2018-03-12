import { createCompiler } from './compiler';
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const port = '3000';
const host = 'localhost';

export const run = () => {
    const devServer = new WebpackDevServer(createCompiler({ hmr: true }), { hot: true });
    // Launch WebpackDevServer.
    devServer.listen(port, host, (err: any) => {
        if (err) {
            return console.log(err);
        }
        /* if (isInteractive) {
            clearConsole();
        }*/
        console.log(chalk.cyan('Starting the development server...\n'));
        // openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig as any, function () {
            devServer.close();
            process.exit();
        });
    });
};