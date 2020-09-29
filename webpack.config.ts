import webpack from 'webpack'
import path from 'path'

export default {
    mode: 'development',
	name: 'Typescript',
	devtool: 'inline-cheap-source-map',

	resolve: {
		extensions: ['ts', 'js'],
		alias: {
			'@src': './src',
		},
	},
	entry: {},
	module: {
		rules: [
			{
				test: /\.jsp/,
				exclude: /node_modules/,
				loader: 'html-loader',
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
				options: {
					silent: true,
					useBabel: true,
					babelCore: '@babel/core',
					presets: [
						[
							'@babel/preset-env',
							{
								target: {
									browser: 'last 2 version chrome',
								},
							},
						],
					],
				},
			},
		],
	},

	output: {
		path: Path.BIZ_SOURCE,
		filename: ({ chunk }) => {
			const { context } = chunk.entryModule
			const jspname = chunk.name
			const { department, serial, version } = Path.KEY_OF_JSP(jspname)
			const meta_info = require(context)
			return `${meta_info.wings || WINGS.RST}/js/biz/${Path.MIDDLE_PATH(
				department,
				meta_info.WINGS
			)}/${department}${serial}${version}/[name].js`
		},
		publicPath: '/BizSource',
	},

	plugins: [
		//Make type of form in jsp
		// new DefineFormPlugin(),
		//Cutting useless bundling codes
	],

	watch: true,

} as webpack.WebpackOptions