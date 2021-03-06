import { createWebpackConfig } from './compiler';
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const port = process.env.PORT || '3000';
const host = '0.0.0.0';
const protocol = 'http';
const urls = prepareUrls(protocol, host, port);

export const run = () => {
    const config = createWebpackConfig({
        hmr: true, development: true,
    });
    const devServer = new WebpackDevServer(webpack(config), config.devServer || { hot: true });
    devServer.listen(port, host, (err: any) => {
        if (err) {
            return console.log(err);
        }
        /* if (isInteractive) {
            clearConsole();
        }*/
        console.log(chalk.cyan('Starting the development server...\n'));
        console.log(`Local URL: ${urls.localUrlForTerminal}`);
        console.log(`Local Network URL: ${urls.lanUrlForTerminal}`);
        // openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig as any, function () {
            devServer.close();
            process.exit();
        });
    });
};