export namespace YEEFOX_AUTH {
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

	export namespace AuthMethodData{
		export interface UserInfo {
			fields: UserInfoField[],
			chain?: string,
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
		
		export interface AssetTransfer extends AssetHosting{
			recipient: string,
		}
	}
	
	export namespace AuthEventData {
		export interface Ready {
			data: string,
		}

		export interface UserCommon{
			custom?: string,
			sign?: string,
		}	
		
		export interface Common extends UserCommon{
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

	export type AuthEventDataType<T extends AuthEvent> =
		T extends AuthEvent.READY ? AuthEventData.Ready :
			T extends AuthEvent.USER_INFO ? AuthEventData.UserInfo :
				T extends AuthEvent.ASSET_VIEW ? AuthEventData.AssetView :
					T extends AuthEvent.ASSET_HOSTING ? AuthEventData.AssetHosting :
						T extends AuthEvent.ASSET_TRANSFER ? AuthEventData.AssetTransfer :
							never;

	export enum SerialEvent {
		READY = 'READY',
		APPROVE = 'APPROVE',
		REJECT = 'REJECT',
	}

	namespace SerialEventData {
		export interface Ready {
			data: string,
		}

		export interface Approve {
			serial: string,
		}

		export interface Reject {
			reason?: string,
		}
	}

	export type SerialEventDataType<T extends SerialEvent> =
		T extends SerialEvent.READY ? SerialEventData.Ready :
			T extends SerialEvent.APPROVE ? SerialEventData.Approve :
				T extends SerialEvent.REJECT ? SerialEventData.Reject :
					never;
}
