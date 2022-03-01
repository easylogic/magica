import MagicMethod from "./MagicMethod";
import { DomEventHandler } from '../handler/DomEventHandler';
import { IKeyValue, IMultiCallback } from '../types/index';
import { BaseStore } from '../BaseStore';
import SubscribeHandler from "../handler/SubscribeHandler";
import { BindHandler } from '../handler/BindHandler';
import CallbackHandler from '../handler/CallbackHandler';
import { isString } from './func';
import { LoadHandler } from '../handler/LoadHandler';

export const context = {

  store: new BaseStore(),

  /* magic check method  */

  self(e: any) {
    return e && e.$dt && e.$dt.is(e.target);
  },

  isAltKey(e: any) {
    return e.altKey;
  },

  isCtrlKey(e: any) {
    return e.ctrlKey;
  },

  isShiftKey(e: any) {
    return e.shiftKey;
  },

  isMetaKey(e: any) {
    return e.metaKey || e.key == 'Meta' || e.code.indexOf('Meta') > -1 ;
  },

  isMouseLeftButton(e: any) {
    return e.buttons === 1;     // 1 is left button 
  },

  isMouseRightButton(e: any) {
    return e.buttons === 2;     // 2 is right button 
  }, 

  hasMouse(e: any) { 
    return e.pointerType === 'mouse';
  },

  hasTouch(e: any) {
    return e.pointerType === 'touch';
  },

  hasPen(e: any) {
    return e.pointerType === 'pen';
  }, 

  /** before check method */

  /* after check method */

  preventDefault(e: any) {
    e.preventDefault();
    return true;
  },

  stopPropagation(e: any) {
    e.stopPropagation();
    return true;
  }
}

const handlers: IKeyValue = {
    'domevent': DomEventHandler,
    'subscribe': SubscribeHandler,
    'bind': BindHandler,
    'callback': CallbackHandler,
    'load': LoadHandler
}


class Magica {
    str: string;
    callback: Function;
    handlerInstance: any;
    constructor(str: string, callback: Function) {
        this.str = str;
        this.callback = callback;

        this.initialize();
    }

    get context() {
        return context;
    }

    initialize() {
        const it = MagicMethod.parse(this.str);

        if (!it) {
            throw new Error(`${this.str} is not a magic method`);
        }
    
        const handler = handlers[it.method];
    
        if (handler) {
            this.handlerInstance = new handler(context, it, this.callback);
        }
    }

    destroy() {
        if (this.handlerInstance) {
            this.handlerInstance.destroy();
        }
    }

}

export function magica (str: string|IKeyValue, callback?: Function): Magica| Magica[] {

  if (isString(str)) {
    return new Magica(str as string, callback as Function);
  } else {
    return Object.keys(str).map(key => {
      return new Magica(key, str[key]);
    })
  }
}

export function emit (event: string | IMultiCallback, ...args: any[]) {
    context.store.emit(event, ...args);
}

