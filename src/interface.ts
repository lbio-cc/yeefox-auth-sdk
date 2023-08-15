export namespace YEEFOX_AUTH{
	export enum UserInfoField {
		CODE = 'code',
		WALLET = 'wallet',
		REAL_NAME = 'realName',
		PHONE = 'phone',
		ID_CARD = 'idCard',
	}

	export interface GrantUserInfoOptions {
		chain?: string,
	}
	
	export enum AuthEvent {
		USER_INFO = 'USER_INFO',
		TRANSFER = 'TRANSFER',
		GRANT_ASSET = 'GRANT_ASSET',
		SIGN = 'SIGN',
		READY = 'READY',
	}
	
	export namespace AuthEventData {
		export interface Ready {
			data:string,
		}
		
		export interface Common{
			custom?:string,
			appId?:string,
			sign?:string,
			data:any,
		}
		
		export interface UserInfo extends Common{
			data: {
				fields: UserInfoField[],
				chain?: string,
			}
		}
	}

	export type AuthEventDataType<T extends AuthEvent> = 
			T extends AuthEvent.READY ? AuthEventData.Ready :
			T extends AuthEvent.USER_INFO ? AuthEventData.UserInfo :
			never;

	export enum SerialEvent {
		READY = 'READY',
		APPROVE = 'APPROVE',
		REJECT = 'REJECT',
	}
	
	namespace SerialEventData{
        export interface Ready {
            data: string,
        }
        
        export interface Approve{
            serial:string,
        }
        
        export interface Reject{
            reason?:string,
        }
	}

	export type SerialEventDataType<T extends SerialEvent> = 
        T extends SerialEvent.READY ? SerialEventData.Ready :
        T extends SerialEvent.APPROVE ? SerialEventData.Approve :
        T extends SerialEvent.REJECT ? SerialEventData.Reject :
		never;
}