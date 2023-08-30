declare var uni: {
	postMessage(message:any):void
}|undefined
declare var plus: {
	
}|undefined;

interface Window {
	postYeefoxMessage:(message:any, origin?:string)=>void,
	setYeefoxMessageHandler:(handler:(e:MessageEvent)=>void)=>void,
}
