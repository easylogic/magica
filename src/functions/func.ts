import { IKeyValue, IMultiCallback, ISplitedMethod } from "../types";

export function debounce(callback: IMultiCallback, delay = 0) {

    if (delay === 0) {
        return callback;
    }

    var t: NodeJS.Timeout | undefined = undefined;

    return function (...args: any[]) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(...args);
        }, delay || 300);
    }
}

export function makeRequestAnimationFrame (callback: IMultiCallback, context: any) {
    return (...args: any[]) => {
        requestAnimationFrame(() => {
            callback.apply(context, args);
        });
    };
}


export function throttle(callback: IMultiCallback, delay: number) {

    var t: NodeJS.Timeout | null | undefined = undefined;

    return function (...args: any[]) {
        if (!t) {
            t = setTimeout(function () {
                callback(...args);
                t = null;
            }, delay || 300);
        }

    }
}

export function ifCheck(callback: Function, context: IKeyValue, checkMethods: any[]) {
    return (...args: any) => {
        const ifResult = checkMethods.every((check: { target: string | number; }) => {
            return context[check.target].apply(context, args);
        });

        if (ifResult) {
            callback.apply(context, args);
        }
    }
}

export function keyEach(obj: IKeyValue, callback: (key: string, value: any, index: number) => void) {
    Object.keys(obj).forEach((key, index) => {
        callback(key, obj[key], index);
    })
}

export function defaultValue(value: any, defaultValue: any) {
    return typeof value == 'undefined' ? defaultValue : value;
}

export function isUndefined(value: null) {
    return typeof value == 'undefined' || value === null;
}

export function isNotUndefined(value: any) {
    return isUndefined(value) === false;
}

export function isBoolean(value: any) {
    return typeof value == 'boolean'
}

export function isString(value: any) {
    return typeof value == 'string'
}

export function isArray(value: any) {
    return Array.isArray(value);
}

export function isNotString(value: any) {
    return isString(value) === false;
}

export function isObject(value: any) {
    return typeof value == 'object' && !Array.isArray(value) && !isNumber(value) && !isString(value) && value !== null;
}

export function isFunction(value: any) {
    return typeof value == 'function'
}

export function isNumber(value: any) {
    return typeof value == 'number';
}

export function isZero(num: number) {
    return num === 0;
}

export function isNotZero(num: number) {
    return !isZero(num);
}

export function clone(obj: any) {
    if (isUndefined(obj)) return undefined;
    return JSON.parse(JSON.stringify(obj));
}