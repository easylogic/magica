
import { isNumber, isObject } from "../functions/func";
import { BIND_CHECK_FUNCTION, BIND_CHECK_DEFAULT_FUNCTION } from "../Event";
import { BaseHandler } from "./BaseHandler";
import { IBindHandlerData, IDom, IKeyValue, BindVariableValue } from "../types";
import { MagicMethodResult } from '../functions/MagicMethod';
import { Dom } from '../functions/Dom';

const convertToPx = (key: string, value: any) => {

  if (isNumber(value)) {
    switch (key) {
      case 'width':
      case 'height':
      case 'top':
      case 'left':
      case 'right':
      case 'bottom':
        return value + 'px';
    }

  }

  return value;
}

/**
 * 
 * @param {Dom} $element 
 * @param {string} key 
 * @param {any} value 
 */
const applyElementAttribute = ($element: IDom, key: string | IKeyValue, value?: string | string[] | object | IKeyValue | Function) => {

  if (key === 'cssText') {
    /**
     * cssText: 'position:absolute'
     */
    ($element as IDom).cssText(value);
    return;
  } else if (key === "style") {
    /**
     * style: { key: value }
     */
    if (typeof (value) !== 'string') {

      const css = {}
      Object.entries(value as IKeyValue).forEach(([key, value]) => {
        css[key] = convertToPx(key, value);
      })


      $element.css(value);
    }

    return;
  } else if (key === "class") {
    //  "class" : [ 'className', 'className' ] 
    //  "class" : { key: true, key: false } 
    //  "class" : 'string-class' 

    if (Array.isArray(value)) {
      $element.addClass(...(value)?.filter(Boolean));
    } else if (isObject(value)) {
      const keys = Object.keys(value as IKeyValue);
      for (var i = 0, len = keys.length; i < len; i++) {
        const className = keys[i];
        const hasClass = (value as IKeyValue)[className];

        $element.toggleClass(className, hasClass);
      }
    } else {
      $element.htmlEl.className = value;
    }

    return;
  } else if (key === 'callback') {
    if (typeof value === 'function') {
      value();
      return;
    }
  }

  if (typeof value === 'undefined') {
    $element.removeAttr(key);
  } else {
    if ($element.el.nodeName === "TEXTAREA" && key === "value") {
      $element.text(value);
    } else if (key === 'text' || key === 'textContent') {
      $element.text(value);
    } else if (key === 'innerHTML' || key === 'html') {
      $element.html(value);
    } else if (key === 'htmlDiff') {
      $element.updateDiff(value);
    } else if (key === 'svgDiff') {
      $element.updateSVGDiff(value);
    } else if (key === 'value') {
      $element.val(value);
    } else {
      $element.attr(key, value);
    }
  }
};

export class BindHandler extends BaseHandler {
  _bindMethods: MagicMethodResult[] | undefined;

  constructor(context: any, magicMethod: MagicMethodResult, callback: Function) {
    super(context, magicMethod, callback);
  }

  initialize(): void {
      this.bindData();
  }


  // 어떻게 실행하는게 좋을까? 
  // this.runHandle('bind', ...);
  async bindData() {
    /**
     * BIND 를 해보자.
     * 이시점에 하는게 맞는지는 모르겠지만 일단은 해보자.
     * BIND 는 특정 element 에 html 이 아닌 데이타를 업데이트하기 위한 간단한 로직이다.
     */
    const it = this.magicMethod;
    const bindMethod = this.callback;

    const $element = Array.from(document.querySelectorAll(it.args[0])).map(it => Dom.create(it as any));

    if (!$element.length) {
      console.warn(`[BIND] element not found: ${it.args[0]}`);
      return;
    }

    await $element.forEach(async ($el) => {
      const results = (await bindMethod.call(this.context, $el)) as IBindHandlerData;

      if (!results) return;
  
      const keys = Object.keys(results);
      for (var elementKeyIndex = 0, len = keys.length; elementKeyIndex < len; elementKeyIndex++) {
        const key = keys[elementKeyIndex];
        const value = results[key];
  
        applyElementAttribute($el, key, value);
      }    
  
    })


  }

  destroy() {
    this._bindMethods = undefined
  }


}