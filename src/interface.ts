export namespace YEEFOX_AUTH {
	export const enum Mode {
		HTML = 'iframe',
		DAPP = 'dapp',
	}

	export enum UserInfoField {
		CODE = 'code',
		WALLET = 'wallet',
		NICK_NAME = 'nickName',
		PHONE = 'phone',
	}

	export enum AuthEvent {
		USER_INFO = 'USER_INFO',
		ASSET_HOSTING = 'ASSET_HOSTING',
		ASSET_TRANSFER = 'ASSET_TRANSFER',
		ASSET_VIEW = 'ASSET_VIEW',
		SIGN = 'SIGN',
		READY = 'READY',
	}

	export enum DAppEvent {
		USER_INFO = 'DAPP_USER_INFO',
	}

	export namespace AuthMethodData {
		export interface UserInfo {
			fields: UserInfoField[],
			chain?: string,
			walletType?: '0x' | 'iaa'
		}

		export interface AssetView {
			chains?: string[],
		}

		export interface AssetHosting {
			chain: string,
			class_id: string,
			token_id: string,
			type: 721 | 1155 | 137,
			amount: number,
		}

		export interface AssetTransfer extends AssetHosting {
			recipient: string,
		}
	}

	export namespace DAppMethodData {
		export interface UserInfo {
			fields: Exclude<UserInfoField, UserInfoField.PHONE>[],
			chain?: string,
			walletType?: '0x' | 'iaa'
		}
	}

	export namespace AuthEventData {
		export interface Ready {
			data: string,
		}

		export interface UserCommon {
			custom?: string,
			sign?: string,
		}

		export interface Common extends UserCommon {
			appId?: string,
			data: any,
		}

		export interface UserInfo extends Common {
			data: AuthMethodData.UserInfo
		}

		export interface AssetView extends Common {
			data: AuthMethodData.AssetView
		}

		export interface AssetHosting extends Common {
			data: AuthMethodData.AssetHosting
		}

		export interface AssetTransfer extends Common {
			data: AuthMethodData.AssetTransfer
		}
	}

	export namespace DAppEventData {
		export interface UserInfo {
			data: DAppMethodData.UserInfo
		}
	}

	export type AuthEventDataType<T extends AuthEvent = AuthEvent> =
		T extends AuthEvent.READY ? AuthEventData.Ready :
			T extends AuthEvent.USER_INFO ? AuthEventData.UserInfo :
				T extends AuthEvent.ASSET_VIEW ? AuthEventData.AssetView :
					T extends AuthEvent.ASSET_HOSTING ? AuthEventData.AssetHosting :
						T extends AuthEvent.ASSET_TRANSFER ? AuthEventData.AssetTransfer :
							never;

	export type DAppEventDataType<T extends DAppEvent = DAppEvent> =
		T extends DAppEvent.USER_INFO ? DAppEventData.UserInfo :
			never;

	export enum ServerEvent {
		READY = 'READY',
		APPROVE = 'APPROVE',
		REJECT = 'REJECT',
		USER_INFO = 'USER_INFO',
	}

	export namespace ServerEventData {
		export interface Ready {
			serial: number,
		}

		export interface Approve {
			serial: string,
		}

		export interface Reject {
			reason?: string,
		}
		
		export interface UserInfo {
			code?:string,
			wallet?:string,
		}
	}

	export type ServerEventDataType<T extends ServerEvent = ServerEvent> =
		T extends ServerEvent.READY ? ServerEventData.Ready :
			T extends ServerEvent.APPROVE ? ServerEventData.Approve :
				T extends ServerEvent.REJECT ? ServerEventData.Reject :
					T extends ServerEvent.USER_INFO ? ServerEventData.UserInfo :
						never;
}