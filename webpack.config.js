const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const APP_PATH = path.resolve(__dirname, '../src');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = [{
    devtool: "source-map",
    context: __dirname,
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),

        // Needed by Cesium for multiline strings
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: "empty"
    },
    resolve: {
        alias: {
            // Cesium module name
            cesium: path.resolve(__dirname, cesiumSource)
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: ['url-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['env'] }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        }),
        // Split cesium into a seperate bundle
        new webpack.optimize.CommonsChunkPlugin({
            name: 'cesium',
            minChunks: function (module) {
                return module.context && module.context.indexOf('cesium') !== -1;
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({    //压缩代码
        //     compress: {
        //         warnings: false
        //     },
        //     except: ['$super', '$', 'exports', 'require']    //排除关键字
        // })
    ],
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new UglifyJSPlugin()
    //     ]
    // },
    // development server options
    devServer: {
        //contentBase: path.join(__dirname, "dist"),
        contentBase: path.join(__dirname, 'public'),
        port: 8083,
        historyApiFallback: true,
        host: '0.0.0.0'
    }
}];