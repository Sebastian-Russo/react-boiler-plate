
const path = require("path");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;

const less = require("less");

//--- Config ---\\

const CONFIG = {
	entry: "./src/index.tsx",
	resolve: {
		extensions: [".ts", ".tsx", ".mjs", ".js"],
		modules: [
			'node_modules',
		],
	},

	module: {
		rules: [{
			// Typescript files:
			test: /\.ts(x?)$/,
			exclude: /node_modules/,
			loader: "babel-loader",
		}, {
			// Pug (Jade, in my heart) files:
			test: /\.(pug|jade)$/,
			exclude: /node_modules/,
			loader: "pug-loader",
		}, {
			test: /\.(jpg|png|svg)$/,
			use: {
				loader: "url-loader",
				options: {limit: 25000},
			},
		}],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([{
			// Less -> CSS.
			from: "./src/*.less",
			to: "./[name].css",
			transform: content => less.render(content.toString()).then(out => out.css),
		}, {
			// Anything in /assets, as-is.
			from: "./src/assets/*",
			to: "./assets/[name].[ext]",
		}, {
			// Anything in /frames, as-is.
			from: "./src/frames/*",
			to: "./frames/[name].[ext]",
		}, {
			// Favicon:
			from: "./src/favicon.ico",
			to: "./favicon.ico",
		}]),
	],
};

const createConfig = (mode, type) => {
	if (!['dev', 'prod'].includes(mode)) throw 'Invalid mode.';
	const devmode = mode === 'dev';

	CONFIG.mode = devmode
		? 'development'
		: 'production';

	CONFIG.resolve.alias = {
		"react": path.resolve(__dirname, "node_modules/react"),
		"config.json": path.resolve(__dirname, devmode
			? 'src/config-dev.json'
      : type === "test" 
      ? 'src/config-test.json' 
      : 'src/config-prod.json'),
	};

	console.log("CONFIG LOC:", CONFIG.resolve.alias["config.json"])

	if (devmode || true) CONFIG.plugins.push(new CopyWebpackPlugin([{
		flatten: true,
		from: './node_modules/react/umd/react.development.js'
	}, {
		flatten: true,
		from: './node_modules/react-dom/umd/react-dom.development.js'
	}]));

	CONFIG.plugins.push(new HTMLWebpackPlugin({
		template: './src/index.pug',
		custom: {
			react_lib: (devmode || true)
				? 'react.development.js'
				: 'https://unpkg.com/react@16/umd/react.production.min.js',
			react_dom_lib: (devmode || true)
				? 'react-dom.development.js'
				: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
		},
	}));

	return CONFIG;
}

module.exports = (env = {}) => {
	if (env.development) return createConfig('dev', env.type);
	if (env.production) return createConfig('prod', env.type);
	throw "Please specify development or production.";
}
