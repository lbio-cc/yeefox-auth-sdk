import basicConfig from './rollup.config.js'

const config = {
	...basicConfig, //整合公共部分
	output:{
		// 打包出口
		file:"lib/index.umd.js",
		format:"umd", // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
		name:"YEEFOX", // cdn方式引入时挂载在window上面用的就是这个名字
		sourcemap:true,
	},
	plugins:[ //插件
		...basicConfig.plugins, //整合公共部分插件
	]
}

export default config