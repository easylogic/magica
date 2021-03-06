import { IKeyValue, IMultiCallback } from "../types";
export declare function debounce(callback: IMultiCallback, delay?: number): IMultiCallback;
export declare function makeRequestAnimationFrame(callback: IMultiCallback, context: any): (...args: any[]) => void;
export declare function throttle(callback: IMultiCallback, delay: number): (...args: any[]) => void;
export declare function ifCheck(callback: Function, context: IKeyValue, checkMethods: any[]): (...args: any) => void;
export declare function keyEach(obj: IKeyValue, callback: (key: string, value: any, index: number) => void): void;
export declare function defaultValue(value: any, defaultValue: any): any;
export declare function isUndefined(value: null): boolean;
export declare function isNotUndefined(value: any): boolean;
export declare function isBoolean(value: any): boolean;
export declare function isString(value: any): boolean;
export declare function isArray(value: any): boolean;
export declare function isNotString(value: any): boolean;
export declare function isObject(value: any): boolean;
export declare function isFunction(value: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function isZero(num: number): boolean;
export declare function isNotZero(num: number): boolean;
export declare function clone(obj: any): any;
