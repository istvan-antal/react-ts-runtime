import { resolve, join } from 'path';
import { existsSync } from 'fs';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageJson = require(resolve(process.cwd(), './package.json'));
const version = process.env.VERSION || packageJson.version;
const extractTextPluginOptions = { publicPath: './' };
const postCssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    // ident: 'postcss',
    sourceMap: true,
    plugins: () => [
        postcssImport(),
        // require('postcss-flexbugs-fixes'),
        postcssSimpleVars(),
        postcssNested(),
        autoprefixer({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
        }),
    ],
};

const createPostCssLoader = (development?: boolean) => {
    if (!development) {
        return {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
                Object.assign({
                    fallback: {
                        loader: require.resolve('style-loader'),
                        options: {
                            hmr: false,
                        },
                    },
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: postCssOptions,
                        },
                    ],
                },
                    extractTextPluginOptions,
                ),
            ),
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
        };
    }

    return {
        test: /\.scss$/,
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: postCssOptions,
            },
        ],
    };
};

export const createWebpackConfig = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) => {
    const plugins = [
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ];


    if (!development) {
        plugins.push(
            new ExtractTextPlugin({
                filename: `style-${version}.css`,
            }),
        );
    }

    const projectHasTsConfig = existsSync(
        resolve(join(process.cwd(), 'tsconfig.json'))
    );

    return ({
        mode: development ? 'development' : 'production',
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
            filename: `app.bundle-${version}.js`,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: require.resolve('ts-loader'),
                            options: projectHasTsConfig ? undefined : {
                                configFile: require.resolve('react-ts-runtime/tsconfig.json'),
                                compilerOptions: {
                                    jsx: 'react',
                                },
                            },
                        },
                    ],
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/[name].[hash:8].[ext]',
                    },
                },
                createPostCssLoader(development),
            ]
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        },
        plugins,
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

export const createCompiler = ({ hmr, development }: { hmr?: boolean; development?: boolean } = {}) => {
    return webpack(createWebpackConfig({ hmr, development }));
};