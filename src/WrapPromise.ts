export class WrapPromise<T = any> {
    constructor() {
        const handler: {
            get(target: object, p: string, receiver?: unknown): void,
            _resolve?: (value: any) => void,
            _reject?: (value: any) => void,
            _resolved: boolean,
        } = {
            get(target: Promise<T>, p: string, receiver?: unknown) {
                switch (p) {
                    case 'resolve':
                        return handler._resolve;
                    case 'reject':
                        return handler._reject;
                    case 'then':
                        return target.then.bind(target);
                    case 'catch':
                        return target.catch.bind(target);
                    case 'finally':
                        return target.finally.bind(target);
                    default:
                        return Reflect.get(target, p, receiver);
                }
            },
            _resolve: undefined,
            _resolved: false,
            _reject: undefined,
        };
        const promise = new Promise<T>((resolve, reject) => {
            handler._resolve = (value: any) => {
                if (!handler._resolved) {
                    handler._resolved = true;
                    resolve(value);
                }
            };
            handler._reject = (value: any) => {
                if (!handler._resolved) {
                    handler._resolved = true;
                    reject(value);
                }
            };
        });

        return new Proxy(promise, handler) as WrapPromise<T>;
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>{
        return this as Promise<TResult1 | TResult2>;
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>{
        return this as Promise<T | TResult>
    }

    reject<T = never>(reason?: any): Promise<T>{
        return Promise.resolve(reason);
    };

    /**
     * Creates a new resolved promise.
     * @returns A resolved promise.
     */
    resolve(): Promise<void>;

    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    resolve<T>(value: T | PromiseLike<T>): Promise<T>;
    
    resolve<T>(value?: T | PromiseLike<T>){
        return Promise.resolve(value);
    }

    finally(onfinally?: (() => void) | undefined | null): Promise<T>{
        return this as Promise<T>
    }
    get [Symbol.toStringTag](){ return 'WrapPromise'};
    
}