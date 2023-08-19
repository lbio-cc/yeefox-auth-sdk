export declare class WrapPromise<T = any> {
    constructor();
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    reject<T = never>(reason?: any): Promise<T>;
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
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
    get [Symbol.toStringTag](): string;
}
