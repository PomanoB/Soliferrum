const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.tsx',
    devtool: false,
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: [{
			    loader: 'ts-loader',
                options: {
                    errorFormatter: (error, colors) => {
                        const messageColor =
                            error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;

                        return (
                            messageColor(error.severity.toUpperCase()) + '\n' +
                            (error.file === ''
                                ? ''
                                : `${error.file}(${error.line},${error.character})`) +
                            `: TS${error.code}: ${error.content}`
                        );
                    }
                }
			}],
			exclude: /node_modules/
		},
        {
            test: /\.(png|jpe?g|svg)$/,
            loader: 'file-loader',
            options: {
                name: 'images/[name].[ext]',
            }
        }]
	},
	resolve: {
	    extensions: ['.tsx', '.ts', '.js'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
    plugins: [
        new HtmlWebpackPlugin({
            hash: false,
            filename: path.resolve(__dirname, 'dist', 'index.html'),
            title: 'Soliferrum'
        })
    ]
};