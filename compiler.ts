const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import { resolve, join } from 'path';

export const createWebpackConfig = ({ hmr }: { hmr?: boolean } = {}) => {
    return ({
        mode: hmr ? 'development' : 'production',
        entry: hmr ?
            [
                require.resolve('react-dev-utils/webpackHotDevClient'),
                './app/index.tsx',
            ] :
            [
                './app/index.tsx',
            ],
        output: {
            path: resolve(process.cwd(), './dist'),
            filename: 'app.bundle.js'
        },
        module: {
            rules: [
                { test: /\.css$/, use: ['style-loader', 'css-loader'] },
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: 'ts-loader',
                            options: {
                                configFile: require.resolve('react-ts-runtime/tsconfig.json'),
                                compilerOptions: {
                                    jsx: 'react',
                                },
                            },
                        },
                    ],
                },
            ]
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './app/index.html'
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ],
        externals: [
            (function () {
                var IGNORES = [
                    'electron'
                ];
                return function (context: any, request: any, callback: any) {
                    if (IGNORES.indexOf(request) >= 0) {
                        return callback(null, "require('" + request + "')");
                    }
                    return callback();
                };
            })()
        ]
    });
};

export const createCompiler = ({ hmr }: { hmr?: boolean } = {}) => {
    return webpack(createWebpackConfig({ hmr }));
};