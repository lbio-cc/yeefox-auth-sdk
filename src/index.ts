import {WrapPromise} from "./WrapPromise";
export {YEEFOX_AUTH} from "./interface";
import {YEEFOX_AUTH} from "./interface";

import UserInfoField = YEEFOX_AUTH.UserInfoField;
import AuthEvent = YEEFOX_AUTH.AuthEvent;
import SerialEvent = YEEFOX_AUTH.SerialEvent;

import './scss/style.scss';

const YEEFOX_ORIGIN = 'http://localhost:8809'

const YEEFOX_AUTH_SIGNATURE = 'YEEFOX:OPEN_AUTH:';

let yeefoxAuthSdkInstance: YeefoxAuthSdk|undefined;
export class YeefoxAuthSdk{
	public promise: WrapPromise<string> | undefined;
	private readonly html: YeefoxAuthIframe;
	private readonly ready: WrapPromise<string>;
	private appId: string | undefined;
	static instance(appId?:string){
		if(!yeefoxAuthSdkInstance){
			yeefoxAuthSdkInstance = new YeefoxAuthSdk(appId);
		}
		return yeefoxAuthSdkInstance;
	}
	
	protected constructor(appId?: string) {
		this.appId = appId;
		this.html = new YeefoxAuthIframe((e,data)=>this.eventHandler(e,data));
		this.ready = new WrapPromise<string>();
	}
	static get VERSION(){
		return '1.0.0';
	}
	
	async grantUserInfo(options: YEEFOX_AUTH.AuthEventData.UserInfo["data"], commonOption?:{
		custom?: string,
		sign?: string,
	}){
		if(options.fields.indexOf(UserInfoField.WALLET) !== -1){
			if(!options.chain){
				throw new Error('请选择链地址所在的区块链');
			}
		}
		if(this.promise){
			throw new Error('当前有授权在进行中')
		}
		
		await this.html.show();
		await this.ready;
		
		this.promise = new WrapPromise<string>();
		this.sendMessage(YEEFOX_AUTH.AuthEvent.USER_INFO, {
			data: options,
			custom: commonOption?.custom,
			sign: commonOption?.sign,
			appId: this.appId
		});
		
		return this.promise;
	}

	eventHandler<T extends SerialEvent>(eventType: T, data: YEEFOX_AUTH.SerialEventDataType<T> ){
		switch (eventType){
			case SerialEvent.READY:
				this.sendMessage(AuthEvent.READY, { data: window.location.origin });
				this.ready.resolve();
				break;
			case SerialEvent.APPROVE:
				if(this.promise){
					this.promise.resolve((data as YEEFOX_AUTH.SerialEventDataType<SerialEvent.APPROVE>).serial);
					this.promise = undefined;
					this.html.hide();
				}
				break;
			case SerialEvent.REJECT:
				if (this.promise) {
					this.promise.reject((data as YEEFOX_AUTH.SerialEventDataType<SerialEvent.REJECT>).reason);
					this.promise = undefined;
					this.html.hide();
				}
				break;
		}
	}

	sendMessage<T extends AuthEvent>(eventType: T, data: YEEFOX_AUTH.AuthEventDataType<T>) {
		this.html.sendMessage(eventType, data);
	}
}

export class YeefoxAuthIframe{
	private readonly container: HTMLDivElement;
	private readonly iframe: HTMLIFrameElement;
	private readonly visited: boolean;
	private origin: string|undefined;
	private readonly eventHandler: (eventType: SerialEvent, data: any) => Promise<void> | void

	constructor(eventHandler: (eventType: SerialEvent, data: any) => Promise<void> | void) {
		this.container = document.createElement('div');
		this.container.className = 'yeefox-iframe-container animate';
	
		this.iframe = document.createElement('iframe');
		this.iframe.className = 'yeefox-iframe';
		this.container.appendChild(this.iframe);
		
		this.visited = false;
		this.eventHandler = eventHandler;
		
		document.body.appendChild(this.container);
	}
	
	async show(){
		if(!this.visited){
			window.addEventListener('message', (e:MessageEvent)=>{
				if (typeof e.data === "object" && e.data) {
					if (typeof e.data.type === "string" && e.data.type.indexOf(YEEFOX_AUTH_SIGNATURE) === 0) {
						let type = e.data.type.substring(YEEFOX_AUTH_SIGNATURE.length);

						if(type === SerialEvent.READY){
							this.origin = e.data.data.data;
						}
						
						this.eventHandler(type, e.data.data);
					}
				}
			})
			this.iframe.src = `${YEEFOX_ORIGIN}/#/pages/auth/iframe`;
		}
		
		this.container.classList.add('open');
	}
	
	sendMessage<T extends AuthEvent>(eventType: T, data: any){
		this.iframe.contentWindow!.postMessage({
			type: `${YEEFOX_AUTH_SIGNATURE}${eventType}`,
			data,
		}, this.origin ??"*");
	}
	
	hide(){
		this.container.classList.remove('open');
	}
}