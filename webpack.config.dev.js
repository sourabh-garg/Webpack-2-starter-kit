            import webpack from 'webpack';
            import HtmlWebpackPlugin from 'html-webpack-plugin';
            import path from 'path';
            var ExtractTextPlugin = require('extract-text-webpack-plugin');

            var loaders = [
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader'
                }
            ];

            export default {
                resolve: {
                    extensions: ['', '.js', '.jsx', '.json']
                },
                devtool: 'eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
                entry: {
                    app: path.resolve(__dirname, 'src/index.js'),
                    vendor: ["react", "react-dom"]
                },
                target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
                output: {
                    path: path.resolve(__dirname, 'dist'), // Note: Physical src are only output by the production build task `npm run build`.
                    publicPath: '/',
                    filename: "[name].entry.chunk.js"
                },
                plugins: [
                    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].[hash].js', }),
                    new ExtractTextPlugin("[name].css"),
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
                        __DEV__: true
                    }),
                    new webpack.HotModuleReplacementPlugin(),
                    new webpack.NoErrorsPlugin(),
                    new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
                        template: path.join(__dirname, './src/index.html'),
                        filename: 'index.html',
                        inject: 'body',
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true
                        },
                    })
                ],
                module: {
                    loaders: [
                        {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel']},
                        {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
                        {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
                        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
                        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
                        {test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=[name].[ext]'},
                        {test: /\.ico$/, loader: 'file?name=[name].[ext]'},
                        {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract({
                            fallbackLoader: 'style-loader',
                            loader: loaders,
                          }) },
                        {test: /\.json$/, loader: "json"}
                    ]
                },
            };
