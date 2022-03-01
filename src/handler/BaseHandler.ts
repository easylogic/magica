import { IBaseHandler } from "../types";
import { MagicMethodResult } from '../functions/MagicMethod';


export class BaseHandler implements IBaseHandler {
    context: any;
    magicMethod: MagicMethodResult;
    callback: Function;
    constructor (context: any, magicMethod: MagicMethodResult, callback: Function) {
        this.context = context;
        this.magicMethod = magicMethod;
        this.callback = callback;

        this.initialize();
    }

    // 초기화 설정 
    initialize () {

    }

    // html 을 로드 할 때 
    load () {

    }

    // 새로고침 할 때 
    refresh () {

    }
    
    // 화면에 그린 이후에 실행 되는 로직들 
    render () {

    }

    getRef(id: string): any {
        return this.context.getRef(id);
    }

    run () {

    }

    destroy() {

    }
}