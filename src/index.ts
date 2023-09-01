import {WrapPromise} from "./WrapPromise";
export {YEEFOX_AUTH} from "./interface";
import {YEEFOX_AUTH} from "./interface";

import './scss/style.scss';

const YEEFOX_ORIGIN = 'https://h5.yeefox.cc';

const YEEFOX_AUTH_SIGNATURE = 'YEEFOX:OPEN_AUTH:';
const YEEFOX_DAPP_SIGNATURE = 'YEEFOX:DAPP:';

let yeefoxAuthSdkInstance: YeefoxAuthSdk|undefined;
export class YeefoxAuthSdk{
	public promise: WrapPromise<any> | undefined;
	private readonly html: YeefoxAuthIframe;
	private readonly ready: WrapPromise<string>;
	public readonly appId: string | undefined;
	private mode: YEEFOX_AUTH.Mode;
	private serial: number;
	
	static instance(appId?:string){
		if(!yeefoxAuthSdkInstance){
			yeefoxAuthSdkInstance = new YeefoxAuthSdk(appId);
		}
		return yeefoxAuthSdkInstance;
	}
	
	protected constructor(appId?: string) {
		this.appId = appId;
		this.html = new YeefoxAuthIframe((message)=>this.messageHandler(message));
		this.ready = new WrapPromise<string>();
		this.mode = YEEFOX_AUTH.Mode.HTML;
		this.serial = 0;
		this.checkDapp();
	}
	static get VERSION(){
		return '1.3.2';
	}
	
	static dappAvailable(){
		return typeof window.setYeefoxMessageHandler != "undefined";
	}
	
	private checkDapp(){
		if (typeof window.setYeefoxMessageHandler != "undefined") {
			window.setYeefoxMessageHandler((message) => this.messageHandler(message));
			this.mode = YEEFOX_AUTH.Mode.DAPP;
			this.ready.resolve();
		} else {
			window.addEventListener("yeefox:ready", () => {
				window.setYeefoxMessageHandler((message) => this.messageHandler(message));
				this.mode = YEEFOX_AUTH.Mode.DAPP;
				this.ready.resolve();
			})
		}
	}

	async grantAssetView(options: YEEFOX_AUTH.AuthMethodData.AssetView, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon) {
		if (this.promise) {
			throw new Error('当前有授权在进行中')
		}

		await this.showFrontend();
		await this.ready;

		this.promise = new WrapPromise<string>();
		this.sendMessage(YEEFOX_AUTH.AuthEvent.ASSET_VIEW, {
			data: options,
			custom: commonOption?.custom,
			sign: commonOption?.sign,
			appId: this.appId
		});

		return this.promise as Promise<string>;
	}
	
	async grantUserInfo(options: YEEFOX_AUTH.AuthMethodData.UserInfo, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon){
		if(options.fields.indexOf(YEEFOX_AUTH.UserInfoField.WALLET) !== -1){
			if(!options.chain){
				throw new Error('请选择链地址所在的区块链');
			}
		}
		if(this.promise){
			throw new Error('当前有授权在进行中')
		}

		await this.showFrontend();
		await this.ready;
		
		this.promise = new WrapPromise<string>();
		this.sendMessage(YEEFOX_AUTH.AuthEvent.USER_INFO, {
			data: options,
			custom: commonOption?.custom,
			sign: commonOption?.sign,
			appId: this.appId
		});
		
		return this.promise as Promise<string>;
	}
	
	async grantAssetHosting(options: YEEFOX_AUTH.AuthMethodData.AssetHosting, commonOption?: YEEFOX_AUTH.AuthEventData.UserCommon){
		if (this.promise) {
			throw new Error('当前有授权在进行中')
		}

		await this.showFrontend();
		await this.ready;

		this.promise = new WrapPromise<string>();
		this.sendMessage(YEEFOX_AUTH.AuthEvent.ASSET_HOSTING, {
			data: options,
			custom: commonOption?.custom,
			sign: commonOption?.sign,
			appId: this.appId
		});

		return this.promise as Promise<string>;
	}

	async getUserInfo(options: YEEFOX_AUTH.DAppMethodData.UserInfo){
		if (this.promise) {
			throw new Error('当前有授权在进行中')
		}
		await this.ready;
		this.promise = new WrapPromise();
		this.sendMessage(YEEFOX_AUTH.DAppEvent.USER_INFO, {
			data: options,
		});

		return this.promise as Promise<YEEFOX_AUTH.ServerEventDataType<YEEFOX_AUTH.ServerEvent.USER_INFO>>;
	}
	
	private eventHandler<T extends YEEFOX_AUTH.ServerEvent>(eventType: T, data: YEEFOX_AUTH.ServerEventDataType<T> ){
		switch (eventType){
			case YEEFOX_AUTH.ServerEvent.READY:
				this.sendMessage(YEEFOX_AUTH.AuthEvent.READY, { data: window.location.origin });
				this.serial = (data as YEEFOX_AUTH.ServerEventDataType<YEEFOX_AUTH.ServerEvent.READY>).serial;
				this.ready.resolve();
				break;
			case YEEFOX_AUTH.ServerEvent.APPROVE:
				if(this.promise){
					this.promise.resolve((data as YEEFOX_AUTH.ServerEventDataType<YEEFOX_AUTH.ServerEvent.APPROVE>).serial);
					this.promise = undefined;
					this.html.hide();
				}
				break;
			case YEEFOX_AUTH.ServerEvent.REJECT:
				if (this.promise) {
					this.promise.reject(new Error((data as YEEFOX_AUTH.ServerEventDataType<YEEFOX_AUTH.ServerEvent.REJECT>).reason));
					this.promise = undefined;
					this.html.hide();
				}
				break;
			case YEEFOX_AUTH.ServerEvent.USER_INFO:
				if (this.promise) {
					this.promise.resolve(data);
					this.promise = undefined;
				}
		}
	}

	private async showFrontend(){
		if (this.mode === YEEFOX_AUTH.Mode.HTML) {
			await this.html.show();
		}
	}
	
	messageHandler(e: MessageEvent) {
		if (typeof e.data === "object" && e.data) {
			const prefix = this.mode === YEEFOX_AUTH.Mode.HTML? YEEFOX_AUTH_SIGNATURE: YEEFOX_DAPP_SIGNATURE;
			if (typeof e.data.type === "string" && e.data.type.indexOf(prefix) === 0) {
				let type = e.data.type.substring(prefix.length);

				this.eventHandler(type, e.data.data);
			}
		}
	}
	
	private sendMessage<T extends YEEFOX_AUTH.AuthEvent>(eventType: T, data: YEEFOX_AUTH.AuthEventDataType<T>):void;
	private sendMessage<T extends YEEFOX_AUTH.DAppEvent>(eventType: T, data: YEEFOX_AUTH.DAppEventDataType<T>):void;
	private sendMessage(eventType: YEEFOX_AUTH.AuthEvent| YEEFOX_AUTH.DAppEvent, data: YEEFOX_AUTH.AuthEventDataType<YEEFOX_AUTH.AuthEvent> | YEEFOX_AUTH.DAppEventDataType<YEEFOX_AUTH.DAppEvent>) {
		if(this.mode === YEEFOX_AUTH.Mode.HTML) {
			this.html.sendMessage(eventType, data);
		}
		else{
			window.postYeefoxMessage({
				type: `${YEEFOX_DAPP_SIGNATURE}${eventType}`,
				data,
				serial: this.serial++
			})
		}
	}
}

class YeefoxAuthIframe{
	private readonly container: HTMLDivElement;
	private readonly iframe: HTMLIFrameElement;
	private visited: boolean;
	private readonly messageHandler: (e: MessageEvent) => void

	constructor(messageHandler: (e: MessageEvent) => void) {
		this.container = document.createElement('div');
		this.container.className = 'yeefox-iframe-container animate';
	
		this.iframe = document.createElement('iframe');
		this.iframe.className = 'yeefox-iframe';
		this.container.appendChild(this.iframe);
		
		this.visited = false;
		this.messageHandler = messageHandler;
		
		document.body.appendChild(this.container);
	}
	
	async show(){
		if(!this.visited){
			window.addEventListener('message', (e)=>this.messageHandler(e))
			this.iframe.src = `${YEEFOX_ORIGIN}/#/pages/auth/iframe`;
			this.visited = true;
		}
		
		this.container.classList.add('open');
	}
	
	sendMessage<T extends YEEFOX_AUTH.AuthEvent | YEEFOX_AUTH.DAppEvent>(eventType: T, data: any){
		this.iframe.contentWindow!.postMessage({
			type: `${YEEFOX_AUTH_SIGNATURE}${eventType}`,
			data,
		}, "*");
	}
	
	hide(){
		this.container.classList.remove('open');
	}
}