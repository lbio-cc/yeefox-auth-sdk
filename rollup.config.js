import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';

export default {
	input:"src/index.ts", // 打包入口
	plugins:[
		// 打包插件
		resolve(), // 查找和打包node_modules中的第三方模块
		commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
		typescript(), // 解析TypeScript
		babel({babelHelpers:"bundled", exclude:"node_modules/**"}), // babel配置,编译es6
		postcss({
			plugins:[autoprefixer()],
			minimize:true,
			use:['sass']
		}),
	],
};