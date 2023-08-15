import basicConfig from './rollup.config.js'
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle"

const config = {
	...basicConfig, //整合公共部分
	output:[
		{
			file:'lib/index.es.js', //输出文件
			format:'es' //输出格式
		}
	],
	plugins:[ //插件
		...basicConfig.plugins, //整合公共部分插件
		excludeDependenciesFromBundle() //忽略掉dependencies和peerDependencies的依赖
	]
}

export default config