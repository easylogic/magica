import { BaseHandler } from "./BaseHandler";
import { MagicMethodResult } from '../functions/MagicMethod';

export default class SubscribeHandler extends BaseHandler {

  constructor(context: any, magicMethod: MagicMethodResult, callback: Function) {
    super(context, magicMethod, callback);
  }

  initialize() {
    this.parseSubscribe();
  }

  destroy(): void {
      this.context.store.offAll(this);
  }

  createLocalCallback(event: string, callback: Function) {
    var newCallback = callback.bind(this);
    newCallback.displayName = `${event}`;

    return newCallback;
  }

  /**
   * initialize store event
   *
   * you can define '@xxx' method(event) in UIElement
   *
   * Store Event 를 초기화 한다. 
   *
   */
  parseSubscribe() {
    const it = this.magicMethod;

    const events = it.args.join(' ');

    const checkMethodList: string[] = [];
    const eventList: string[] = [];

    let debounce = 0;
    let throttle = 0;
    let isAllTrigger = false;
    let isSelfTrigger = false;
    let isFrameTrigger = false;

    it.pipes.forEach(pipe => {
      if (pipe.type === 'function') {
        switch (pipe.func) {
          case 'debounce':
            debounce = +(pipe.args?.[0] || 0);
            break;
          case 'throttle':
            throttle = +(pipe.args?.[0] || 0);
            break;
          case 'allTrigger':
            isAllTrigger = true;
            break;
          case 'selfTrigger':
            isSelfTrigger = true;
            break;
          case 'frame':
            isFrameTrigger = true;
            break;
        }
      } else if (pipe.type === 'keyword') {
        const method = `${pipe.value}`;
        if (this[method]) {
          checkMethodList.push(method);
        } else {
          eventList.push(method);
        }
      }
    })

    const originalCallback = this.callback;
    [...eventList, events]
      .filter(Boolean)
      .forEach((e: string) => {
        var callback = this.createLocalCallback(e, originalCallback)
        this.context.store.on(e, callback, this, debounce, throttle, isAllTrigger, isSelfTrigger, checkMethodList, isFrameTrigger);
      });
  }
}