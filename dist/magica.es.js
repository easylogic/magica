var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const MAGIC_METHOD_REG = /^@magic\:([a-zA-Z][a-zA-Z0-9]*)[\W]{1}(.*)*$/g;
const MAGIC_METHOD = "@magic:";
const SPLITTER = "|";
const FUNC_REGEXP = /(([\$a-z_\-]+)\([^\(\)]*\)|([a-z_\-]+))/gi;
const FUNC_START_CHARACTER = "(";
const FUNC_END_CHARACTER = ")";
class MagicMethod {
  static make(str, ...args) {
    return `${MAGIC_METHOD}${str} ${args.join(SPLITTER)}`;
  }
  static check(str) {
    return str.match(MAGIC_METHOD_REG) !== null;
  }
  static parse(str) {
    const matches = str.match(MAGIC_METHOD_REG);
    if (!matches) {
      return void 0;
    }
    const result = matches[0].split("@magic:")[1].split(SPLITTER).map((item) => item.trim());
    let [initializer, ...pipes] = result;
    const [method, ...args] = initializer.split(" ");
    const pipeList = pipes.map((it) => {
      return this.parsePipe(it);
    }).filter((it) => it.value);
    const pipeObjects = {
      "function": [],
      "keyword": [],
      "value": []
    };
    pipeList.forEach((pipe) => {
      if (pipe.type === "function") {
        pipeObjects.function.push(pipe);
      } else if (pipe.type === "keyword") {
        pipeObjects.keyword.push(pipe);
      } else {
        pipeObjects.value.push(pipe);
      }
    });
    return {
      originalMethod: str,
      method,
      args,
      pipes: pipeList,
      keys: pipeObjects
    };
  }
  static parsePipe(it) {
    const result = it.match(FUNC_REGEXP);
    if (!result) {
      return {
        type: "value",
        value: it
      };
    }
    const [value] = result;
    if (value.includes(FUNC_START_CHARACTER)) {
      const [func, rest] = value.split(FUNC_START_CHARACTER);
      const [args] = rest.split(FUNC_END_CHARACTER);
      return {
        type: "function",
        value,
        func,
        args: args.split(",").map((it2) => it2.trim()).filter(Boolean)
      };
    }
    return {
      type: "keyword",
      value: result[0]
    };
  }
}
const makeEventChecker = (value, split = SPLITTER) => {
  return ` ${split} ${value}`;
};
const MULTI_PREFIX = "ME@";
const PIPE = (...args) => {
  return args.join(SPLITTER);
};
const EVENT = (...args) => {
  return MULTI_PREFIX + PIPE(...args);
};
const COMMAND = EVENT;
const ON = EVENT;
const NAME_SAPARATOR = ":";
const SAPARATOR = " ";
const refManager = {};
const DOM_EVENT_MAKE = (...keys) => {
  var key = keys.join(NAME_SAPARATOR);
  return (...args) => {
    const [selector, ...result] = args;
    return MagicMethod.make("domevent", [key, selector].join(" "), ...result);
  };
};
const SUBSCRIBE_EVENT_MAKE = (...args) => {
  return MagicMethod.make("subscribe", ...args);
};
const CALLBACK_EVENT_MAKE = (...args) => {
  return MagicMethod.make("callback", ...args);
};
const CHECKER = (value, split = SPLITTER) => {
  return makeEventChecker(value, split);
};
const AFTER = (value, split = SPLITTER) => {
  return makeEventChecker(`after(${value})`, split);
};
const BEFORE = (value, split = SPLITTER) => {
  return makeEventChecker(`before(${value})`, split);
};
const IF = CHECKER;
const KEY = CHECKER;
const ARROW_UP = CHECKER("ArrowUp");
const ARROW_DOWN = CHECKER("ArrowDown");
const ARROW_LEFT = CHECKER("ArrowLeft");
const ARROW_RIGHT = CHECKER("ArrowRight");
const ENTER = CHECKER("Enter");
const SPACE = CHECKER("Space");
const ESCAPE = CHECKER("Escape");
const BACKSPACE = CHECKER("Backspace");
const DELETE = CHECKER("Delete");
const EQUAL = CHECKER("Equal");
const MINUS = CHECKER("Minus");
const BRACKET_RIGHT = CHECKER("BracketRight");
const BRACKET_LEFT = CHECKER("BracketLeft");
const ALT = CHECKER("isAltKey");
const SHIFT = CHECKER("isShiftKey");
const META = CHECKER("isMetaKey");
const CONTROL = CHECKER("isCtrlKey");
const MOUSE = CHECKER("hasMouse");
const TOUCH = CHECKER("hasTouch");
const PEN = CHECKER("hasPen");
const SELF = CHECKER("self");
const LEFT_BUTTON = CHECKER("isMouseLeftButton");
const RIGHT_BUTTON = CHECKER("isMouseRightButton");
const FIT = CHECKER("fit");
const PASSIVE = CHECKER("passive");
const DOMDIFF = CHECKER("domdiff");
const DEBOUNCE = (t = 100) => {
  return CHECKER(`debounce(${t})`);
};
const DELAY = (t = 300) => {
  return CHECKER(`delay(${t})`);
};
const D1000 = DEBOUNCE(1e3);
const THROTTLE = (t = 100) => {
  return CHECKER(`throttle(${t})`);
};
const ALL_TRIGGER = CHECKER("allTrigger()");
const SELF_TRIGGER = CHECKER("selfTrigger()");
const FRAME = CHECKER("frame()");
const CAPTURE = CHECKER("capture()");
const PREVENT = AFTER(`preventDefault`);
const STOP = AFTER(`stopPropagation`);
const SUBSCRIBE = SUBSCRIBE_EVENT_MAKE;
const SUBSCRIBE_ALL = (...args) => SUBSCRIBE_EVENT_MAKE(...args, ALL_TRIGGER);
const SUBSCRIBE_SELF = (...args) => SUBSCRIBE_EVENT_MAKE(...args, SELF_TRIGGER);
const CONFIG = (config, ...args) => SUBSCRIBE_EVENT_MAKE(`config:${config}`, ...args);
const CALLBACK = CALLBACK_EVENT_MAKE;
const RAF = CALLBACK("requestAnimationFrame");
const CUSTOM = DOM_EVENT_MAKE;
const CLICK = DOM_EVENT_MAKE("click");
const DOUBLECLICK = DOM_EVENT_MAKE("dblclick");
const MOUSEDOWN = DOM_EVENT_MAKE("mousedown");
const MOUSEUP = DOM_EVENT_MAKE("mouseup");
const MOUSEMOVE = DOM_EVENT_MAKE("mousemove");
const MOUSEOVER = DOM_EVENT_MAKE("mouseover");
const MOUSEOUT = DOM_EVENT_MAKE("mouseout");
const MOUSEENTER = DOM_EVENT_MAKE("mouseenter");
const MOUSELEAVE = DOM_EVENT_MAKE("mouseleave");
const TOUCHSTART = DOM_EVENT_MAKE("touchstart");
const TOUCHMOVE = DOM_EVENT_MAKE("touchmove");
const TOUCHEND = DOM_EVENT_MAKE("touchend");
const KEYDOWN = DOM_EVENT_MAKE("keydown");
const KEYUP = DOM_EVENT_MAKE("keyup");
const KEYPRESS = DOM_EVENT_MAKE("keypress");
const DRAG = DOM_EVENT_MAKE("drag");
const DRAGSTART = DOM_EVENT_MAKE("dragstart");
const DROP = DOM_EVENT_MAKE("drop");
const DRAGOVER = DOM_EVENT_MAKE("dragover");
const DRAGENTER = DOM_EVENT_MAKE("dragenter");
const DRAGLEAVE = DOM_EVENT_MAKE("dragleave");
const DRAGEXIT = DOM_EVENT_MAKE("dragexit");
const DRAGOUT = DOM_EVENT_MAKE("dragout");
const DRAGEND = DOM_EVENT_MAKE("dragend");
const CONTEXTMENU = DOM_EVENT_MAKE("contextmenu");
const CHANGE = DOM_EVENT_MAKE("change");
const INPUT = DOM_EVENT_MAKE("input");
const FOCUS = DOM_EVENT_MAKE("focus");
const FOCUSIN = DOM_EVENT_MAKE("focusin");
const FOCUSOUT = DOM_EVENT_MAKE("focusout");
const BLUR = DOM_EVENT_MAKE("blur");
const PASTE = DOM_EVENT_MAKE("paste");
const RESIZE = DOM_EVENT_MAKE("resize");
const SCROLL = DOM_EVENT_MAKE("scroll");
const SUBMIT = DOM_EVENT_MAKE("submit");
const POINTERSTART = (...args) => {
  return CUSTOM("pointerdown")(...args) + LEFT_BUTTON;
};
const POINTEROVER = CUSTOM("pointerover");
const POINTERENTER = CUSTOM("pointerenter");
const POINTEROUT = CUSTOM("pointerout");
const POINTERMOVE = CUSTOM("pointermove");
const POINTEREND = CUSTOM("pointerup");
const CHANGEINPUT = CUSTOM("change", "input");
const WHEEL = CUSTOM("wheel", "mousewheel", "DOMMouseScroll");
const ANIMATIONSTART = DOM_EVENT_MAKE("animationstart");
const ANIMATIONEND = DOM_EVENT_MAKE("animationend");
const ANIMATIONITERATION = DOM_EVENT_MAKE("animationiteration");
const TRANSITIONSTART = DOM_EVENT_MAKE("transitionstart");
const TRANSITIONEND = DOM_EVENT_MAKE("transitionend");
const TRANSITIONRUN = DOM_EVENT_MAKE("transitionrun");
const TRANSITIONCANCEL = DOM_EVENT_MAKE("transitioncancel");
const DOUBLETAB = CUSTOM("doubletab");
const LOAD = (value = "$el") => {
  return MagicMethod.make("load", value);
};
const getRef = (id) => {
  return refManager[id] || "";
};
const BIND_CHECK_FUNCTION = (field) => {
  return function() {
    return this.prevState[field] != this.state[field];
  };
};
const BIND_CHECK_DEFAULT_FUNCTION = () => {
  return true;
};
const BIND = (value = "$el", selector = "") => {
  return MagicMethod.make("bind", value, selector);
};
function normalizeWheelEvent(e) {
  let dx = e.deltaX;
  let dy = e.deltaY;
  if (dx === 0 && e.shiftKey) {
    [dy, dx] = [dx, dy];
  }
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    dy *= 8;
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    dy *= 24;
  }
  return [
    limit(dx, 24),
    limit(dy, 24),
    0
  ];
}
function limit(delta, maxDelta) {
  return Math.sign(delta) * Math.min(maxDelta, Math.abs(delta));
}
function debounce(callback, delay = 0) {
  if (delay === 0) {
    return callback;
  }
  var t = void 0;
  return function(...args) {
    if (t) {
      clearTimeout(t);
    }
    t = setTimeout(function() {
      callback(...args);
    }, delay || 300);
  };
}
function makeRequestAnimationFrame(callback, context) {
  return (...args) => {
    requestAnimationFrame(() => {
      callback.apply(context, args);
    });
  };
}
function throttle(callback, delay) {
  var t = void 0;
  return function(...args) {
    if (!t) {
      t = setTimeout(function() {
        callback(...args);
        t = null;
      }, delay || 300);
    }
  };
}
function ifCheck(callback, context, checkMethods) {
  return (...args) => {
    const ifResult = checkMethods.every((check) => {
      return context[check.target].apply(context, args);
    });
    if (ifResult) {
      callback.apply(context, args);
    }
  };
}
function isUndefined(value) {
  return typeof value == "undefined" || value === null;
}
function isNotUndefined(value) {
  return isUndefined(value) === false;
}
function isFunction(value) {
  return typeof value == "function";
}
class BaseStore {
  constructor(editor) {
    __publicField(this, "cachedCallback");
    __publicField(this, "callbacks");
    __publicField(this, "editor");
    __publicField(this, "source");
    __publicField(this, "promiseProxy");
    this.cachedCallback = {};
    this.callbacks = {};
    this.editor = editor;
    this.promiseProxy = new Proxy(this, {
      get: (target, key) => {
        return this.makePromiseEvent(key);
      }
    });
  }
  getCallbacks(event) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    return this.callbacks[event];
  }
  setCallbacks(event, list = []) {
    this.callbacks[event] = list;
  }
  on(event, originalCallback, context, debounceDelay = 0, throttleDelay = 0, enableAllTrigger = false, enableSelfTrigger = false, beforeMethods = [], frame = false) {
    var callback = originalCallback;
    if (debounceDelay > 0)
      callback = debounce(originalCallback, debounceDelay);
    else if (throttleDelay > 0)
      callback = throttle(originalCallback, throttleDelay);
    if (beforeMethods.length) {
      callback = ifCheck(callback, context, beforeMethods);
    }
    if (frame) {
      callback = makeRequestAnimationFrame(callback, context);
    }
    this.getCallbacks(event).push({ event, callback, context, originalCallback, enableAllTrigger, enableSelfTrigger });
    this.debug("add message event", event, context == null ? void 0 : context.sourceName);
    return () => {
      this.off(event, originalCallback);
    };
  }
  debug(message, event, sourceName) {
  }
  off(event, originalCallback) {
    this.debug("off message event", event);
    if (arguments.length == 1) {
      this.setCallbacks(event);
    } else if (arguments.length == 2) {
      this.setCallbacks(event, this.getCallbacks(event).filter((f) => {
        return f.originalCallback !== originalCallback;
      }));
    }
  }
  offAll(context) {
    Object.keys(this.callbacks).forEach((event) => {
      this.setCallbacks(event, this.getCallbacks(event).filter((f) => {
        return f.context !== context;
      }));
    });
    this.debug("off all message", context.sourceName);
  }
  getCachedCallbacks(event) {
    return this.getCallbacks(event);
  }
  get promise() {
    return this.promiseProxy;
  }
  get p() {
    return this.promise;
  }
  makePromiseEvent(event) {
    var list = this.getCachedCallbacks(event);
    const source = this.source;
    return (...args) => Promise.all(list.filter((f) => {
      return !f.enableSelfTrigger;
    }).filter((f) => {
      return f.enableAllTrigger || f.originalCallback.source !== source;
    }).map((f) => {
      return new Promise((resolve, reject) => {
        resolve(f.callback.apply(f.context, args));
      });
    }));
  }
  sendMessage(source, event, ...args) {
    this.sendMessageList(source, [
      [event, ...args]
    ]);
  }
  sendMessageList(source, messages = []) {
    messages.forEach(([event, ...args]) => {
      var list = this.getCachedCallbacks(event);
      if (list && list.length) {
        const runnableFunctions = list.filter((f) => !f.enableSelfTrigger);
        for (const f of runnableFunctions) {
          const result = f.callback.apply(f.context, args);
          if (isNotUndefined(result)) {
            if (result === false) {
              return;
            } else if (isFunction(result)) {
              result();
              return;
            }
          }
        }
      } else {
        console.warn(`message event [${event}] is not exist.`);
      }
    });
  }
  nextSendMessage(source, callback, ...args) {
    callback(...args);
  }
  triggerMessage(source, event, ...args) {
    var list = this.getCachedCallbacks(event);
    if (list) {
      for (var i = 0, len = list.length; i < len; i++) {
        const f = list[i];
        if (f.originalCallback.source === source) {
          f.callback.apply(f.context, args);
        }
      }
    } else {
      console.warn(event, " is not valid event");
    }
  }
  emit(event, ...args) {
    if (isFunction(event)) {
      event(...args);
    } else if (Array.isArray(event)) {
      this.sendMessageList(this.source, event);
    } else {
      this.sendMessage(this.source, event, ...args);
    }
  }
  nextTick(callback) {
    this.nextSendMessage(this.source, callback);
  }
  trigger(event, ...args) {
    if (isFunction(event)) {
      event(...args);
    } else {
      this.triggerMessage(this.source, event, ...args);
    }
  }
}
const setBooleanProp = (el, name, value) => {
  if (value) {
    el.setAttribute(name, name);
    el[name] = value;
  } else {
    el.removeAttribute(name);
    el[name] = value;
  }
};
const setProp = (el, name, value) => {
  if (typeof value === "boolean") {
    setBooleanProp(el, name, value);
  } else {
    el.setAttribute(name, value);
  }
};
const removeBooleanProp = (node, name) => {
  node.removeAttribute(name);
  node[name] = false;
};
const removeUndefinedProp = (node, name) => {
  node.removeAttribute(name);
};
const removeProp = (node, name, value) => {
  if (typeof value === "boolean") {
    removeBooleanProp(node, name);
  } else if (name) {
    removeUndefinedProp(node, name);
  }
};
const updateProp = (node, name, newValue, oldValue) => {
  if (!newValue) {
    removeProp(node, name, oldValue);
  } else if (!oldValue || newValue !== oldValue) {
    setProp(node, name, newValue);
  }
};
const updateProps = (node, newProps = {}, oldProps = {}) => {
  const keyList = [];
  keyList.push.apply(keyList, Object.keys(newProps));
  keyList.push.apply(keyList, Object.keys(oldProps));
  const props = [...new Set(keyList)];
  for (var i = 0, len = props.length; i < len; i++) {
    const key = props[i];
    updateProp(node, key, newProps[key], oldProps[key]);
  }
};
function changed(node1, node2) {
  return node1.nodeType === Node.TEXT_NODE && node1.textContent !== node2.textContent || node1.nodeName !== node2.nodeName;
}
function hasPassed(node1) {
  if ((node1 == null ? void 0 : node1.nodeType) === 8) {
    return true;
  }
  return node1.nodeType !== Node.TEXT_NODE && node1.getAttribute("data-domdiff-pass") === "true";
}
function hasRefClass(node1) {
  return node1.nodeType !== Node.TEXT_NODE && node1.getAttribute("refClass");
}
function getProps(attributes) {
  var results = {};
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const t = attributes[i];
    results[t.name] = t.value;
  }
  return results;
}
function updateElement(parentElement, oldEl, newEl, i, options = {}) {
  if (!oldEl) {
    parentElement.appendChild(newEl.cloneNode(true));
  } else if (!newEl) {
    parentElement.removeChild(oldEl);
  } else if (hasPassed(oldEl) || hasPassed(newEl))
    ;
  else if (changed(newEl, oldEl) || hasRefClass(newEl)) {
    parentElement.replaceChild(newEl.cloneNode(true), oldEl);
  } else if (newEl.nodeType !== Node.TEXT_NODE && newEl.nodeType !== Node.COMMENT_NODE && newEl.toString() !== "[object HTMLUnknownElement]") {
    if (options.checkPassed && options.checkPassed(oldEl, newEl))
      ;
    else {
      updateProps(oldEl, getProps(newEl.attributes), getProps(oldEl.attributes));
    }
    var oldChildren = children(oldEl);
    var newChildren = children(newEl);
    var max = Math.max(oldChildren.length, newChildren.length);
    for (var i = 0; i < max; i++) {
      updateElement(oldEl, oldChildren[i], newChildren[i], i);
    }
  }
}
const children = (el) => {
  var element = el.firstChild;
  if (!element) {
    return [];
  }
  var results = [];
  do {
    results.push(element);
    element = element.nextSibling;
  } while (element);
  return results;
};
function DomDiff(A, B, options = {}) {
  options.checkPassed = isFunction(options.checkPassed) ? options.checkPassed : void 0;
  options.removedElements = [];
  A = A.el || A;
  B = B.el || B;
  var childrenA = children(A);
  var childrenB = children(B);
  var len = Math.max(childrenA.length, childrenB.length);
  for (var i = 0; i < len; i++) {
    updateElement(A, childrenA[i], childrenB[i], i, options);
  }
}
class Dom {
  constructor(tag, className = "", attr = {}) {
    __publicField(this, "el");
    if (typeof tag !== "string") {
      this.el = tag;
    } else {
      var el = document.createElement(tag);
      if (className) {
        el.className = className;
      }
      for (var k in attr) {
        el.setAttribute(k, attr[k]);
      }
      this.el = el;
    }
  }
  static create(tag, className = "", attr = {}) {
    return new Dom(tag, className, attr);
  }
  static createByHTML(htmlString) {
    var div = Dom.create("div");
    var list = div.html(htmlString).children();
    if (list.length) {
      return Dom.create(list[0].el);
    }
    return null;
  }
  static getScrollTop() {
    return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  }
  static getScrollLeft() {
    return Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft);
  }
  static parse(html) {
    var parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }
  static body() {
    return Dom.create(document.body);
  }
  get htmlEl() {
    return this.el;
  }
  get inputEl() {
    return this.el;
  }
  get svgEl() {
    return this.el;
  }
  setAttr(obj) {
    Object.keys(obj).forEach((key) => {
      this.attr(key, obj[key]);
    });
    return this;
  }
  setAttrNS(obj, namespace = "http://www.w3.org/2000/svg") {
    Object.keys(obj).forEach((key) => {
      this.attrNS(key, obj[key], namespace);
    });
    return this;
  }
  setProp(obj) {
    Object.keys(obj).forEach((key) => {
      if (this.htmlEl[key] != obj[key]) {
        this.htmlEl[key] = obj[key];
      }
    });
    return this;
  }
  data(key, value) {
    if (arguments.length === 1) {
      return this.attr("data-" + key);
    } else if (arguments.length === 2) {
      return this.attr("data-" + key, value);
    }
    return this;
  }
  attr(key, value) {
    var _a, _b;
    if (arguments.length == 1) {
      return (_b = (_a = this.htmlEl).getAttribute) == null ? void 0 : _b.call(_a, key);
    }
    if (this.htmlEl.getAttribute(key) != value) {
      this.htmlEl.setAttribute(key, `${value}`);
    }
    return this;
  }
  attrNS(key, value, namespace = "http://www.w3.org/2000/svg") {
    if (arguments.length == 1) {
      return this.svgEl.getAttributeNS(namespace, key);
    }
    if (this.svgEl.getAttributeNS(namespace, key) != value) {
      this.svgEl.setAttributeNS(namespace, key, value);
    }
    return this;
  }
  attrKeyValue(keyField) {
    return {
      [`${this.htmlEl.getAttribute(keyField)}`]: this.val()
    };
  }
  attrs(...args) {
    return args.map((key) => {
      return this.htmlEl.getAttribute(key);
    });
  }
  styles(...args) {
    return args.map((key) => {
      return this.htmlEl.style[key];
    });
  }
  removeAttr(key) {
    this.htmlEl.removeAttribute(key);
    return this;
  }
  removeStyle(key) {
    this.htmlEl.style.removeProperty(key);
    return this;
  }
  is(checkElement) {
    return this.htmlEl === (checkElement.el || checkElement);
  }
  isTag(tag) {
    return this.htmlEl.tagName.toLowerCase() === tag.toLowerCase();
  }
  closest(cls) {
    var temp = this;
    var checkCls = false;
    while (!(checkCls = temp.hasClass(cls))) {
      if (temp.el.parentNode) {
        temp = Dom.create(temp.el.parentNode);
      } else {
        return null;
      }
    }
    if (checkCls) {
      return temp;
    }
    return null;
  }
  path() {
    if (!this.htmlEl)
      return [];
    let pathList = [this];
    let $parentNode = this.parent();
    if (!$parentNode.el)
      return pathList;
    while ($parentNode) {
      pathList.unshift($parentNode);
      $parentNode = $parentNode.parent();
      if (!$parentNode.el)
        break;
    }
    return pathList;
  }
  get $parent() {
    return this.parent();
  }
  parent() {
    return Dom.create(this.htmlEl.parentNode);
  }
  hasParent() {
    return !!this.htmlEl.parentNode;
  }
  removeClass(...args) {
    this.htmlEl.classList.remove(...args);
    return this;
  }
  hasClass(cls) {
    if (!this.htmlEl.classList)
      return false;
    return this.htmlEl.classList.contains(cls);
  }
  addClass(...args) {
    this.htmlEl.classList.add(...args);
    return this;
  }
  onlyOneClass(cls) {
    var parent = this.parent();
    parent.children().forEach((it) => {
      it.removeClass(cls);
    });
    this.addClass(cls);
  }
  toggleClass(cls, isForce) {
    this.htmlEl.classList.toggle(cls, isForce);
    return this;
  }
  html(html) {
    try {
      if (typeof html === "undefined") {
        return this.htmlEl.innerHTML;
      }
      if (typeof html === "string") {
        Object.assign(this.el, { innerHTML: html });
      } else {
        this.empty().append(html);
      }
      return this;
    } catch (e) {
      console.log(e, html);
      return this;
    }
  }
  htmlDiff(fragment) {
    DomDiff(this, fragment);
  }
  updateDiff(html, rootElement = "div") {
    DomDiff(this, Dom.create(rootElement).html(html));
  }
  updateSVGDiff(html, rootElement = "div") {
    DomDiff(this, Dom.create(rootElement).html(`<svg>${html}</svg>`).firstChild.firstChild);
  }
  find(selector) {
    return this.htmlEl.querySelector(selector);
  }
  $(selector) {
    var node = this.find(selector);
    return node ? Dom.create(node) : null;
  }
  findAll(selector) {
    return Array.from(this.htmlEl.querySelectorAll(selector));
  }
  $$(selector) {
    var arr = this.findAll(selector);
    return arr.map((node) => Dom.create(node));
  }
  empty() {
    while (this.htmlEl.firstChild)
      this.htmlEl.removeChild(this.htmlEl.firstChild);
    return this;
  }
  append(el) {
    if (typeof el === "string") {
      this.htmlEl.appendChild(document.createTextNode(el));
    } else {
      this.htmlEl.appendChild(el.el || el);
    }
    return this;
  }
  prepend(el) {
    if (typeof el === "string") {
      this.htmlEl.prepend(document.createTextNode(el));
    } else {
      this.htmlEl.prepend(el.el || el);
    }
    return this;
  }
  prependHTML(html) {
    var $dom = Dom.create("div").html(html);
    this.prepend($dom.createChildrenFragment());
    return $dom;
  }
  appendHTML(html) {
    var $dom = Dom.create("div").html(html);
    this.append($dom.createChildrenFragment());
    return $dom;
  }
  createChildrenFragment() {
    const list = this.children();
    var fragment = document.createDocumentFragment();
    list.forEach(($el) => fragment.appendChild($el.el));
    return fragment;
  }
  appendTo(target) {
    var t = target.el ? target.el : target;
    t.appendChild(this.htmlEl);
    return this;
  }
  remove() {
    if (this.htmlEl.parentNode) {
      this.htmlEl.parentNode.removeChild(this.htmlEl);
    }
    return this;
  }
  removeChild(el) {
    this.htmlEl.removeChild(el.el || el);
    return this;
  }
  text(value) {
    if (typeof value === "undefined") {
      return this.htmlEl.textContent;
    } else {
      var tempText = value;
      if (value instanceof Dom) {
        tempText = value.text();
      }
      if (this.htmlEl.textContent !== tempText) {
        this.htmlEl.textContent = tempText;
      }
      return this;
    }
  }
  css(key, value) {
    const el = this.htmlEl;
    if (typeof key === "string" && typeof value !== "undefined") {
      if (key.indexOf("--") === 0 && typeof value !== "undefined") {
        el.style.setProperty(key, value);
      } else {
        el.style[key] = value;
      }
    } else if (typeof key !== "undefined") {
      if (typeof key === "string") {
        return getComputedStyle(el)[key];
      } else {
        Object.entries(key).forEach(([localKey, value2]) => {
          if (localKey.indexOf("--") === 0 && typeof value2 !== "undefined") {
            el.style.setProperty(localKey, value2);
          } else {
            el.style[localKey] = value2;
          }
        });
      }
    }
    return this;
  }
  getComputedStyle(...list) {
    var css = getComputedStyle(this.htmlEl);
    var obj = {};
    list.forEach((it) => {
      obj[it] = css[it];
    });
    return obj;
  }
  getStyleList(...list) {
    const el = this.htmlEl;
    var style = {};
    var len = el.style.length;
    for (var i = 0; i < len; i++) {
      var key = el.style[i];
      style[key] = el.style[key];
    }
    list.forEach((key2) => {
      style[key2] = this.css(key2);
    });
    return style;
  }
  cssText(value) {
    const el = this.htmlEl;
    if (typeof value === "undefined") {
      return el.style.cssText;
    }
    return this;
  }
  cssFloat(key) {
    return parseFloat(this.css(key));
  }
  cssInt(key) {
    return parseInt(this.css(key));
  }
  px(key, value) {
    return this.css(key, `${value}px`);
  }
  rect() {
    return this.htmlEl.getBoundingClientRect();
  }
  bbox() {
    return this.el.getBBox();
  }
  isSVG() {
    return this.htmlEl.tagName.toUpperCase() === "SVG";
  }
  offsetRect() {
    const el = this.htmlEl;
    if (this.isSVG()) {
      const parentBox = this.parent().rect();
      const box = this.rect();
      return {
        x: box.x - parentBox.x,
        y: box.y - parentBox.y,
        top: box.x - parentBox.x,
        left: box.y - parentBox.y,
        width: box.width,
        height: box.height
      };
    }
    return {
      x: el.offsetLeft,
      y: el.offsetTop,
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
  offset() {
    var rect = this.rect();
    var scrollTop = Dom.getScrollTop();
    var scrollLeft = Dom.getScrollLeft();
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }
  offsetLeft() {
    return this.offset().left;
  }
  offsetTop() {
    return this.offset().top;
  }
  position() {
    if (this.htmlEl.style.top) {
      return {
        top: parseFloat(this.css("top")),
        left: parseFloat(this.css("left"))
      };
    } else {
      return this.rect();
    }
  }
  size() {
    return [this.width(), this.height()];
  }
  width() {
    return this.htmlEl.offsetWidth || this.rect().width;
  }
  contentWidth() {
    return this.width() - this.cssFloat("padding-left") - this.cssFloat("padding-right");
  }
  height() {
    return this.htmlEl.offsetHeight || this.rect().height;
  }
  contentHeight() {
    return this.height() - this.cssFloat("padding-top") - this.cssFloat("padding-bottom");
  }
  val(value) {
    if (typeof value === "undefined") {
      return this.inputEl.value;
    } else if (typeof value !== "undefined") {
      var tempValue = value;
      if (value instanceof Dom) {
        tempValue = value.val();
      } else {
        this.inputEl.value = tempValue;
      }
    }
    return this;
  }
  matches(selector) {
    if (this.htmlEl) {
      if (!this.htmlEl.matches)
        return null;
      if (this.htmlEl.matches(selector)) {
        return this;
      }
      return this.parent().matches(selector);
    }
    return null;
  }
  get value() {
    return this.inputEl.value;
  }
  get files() {
    return this.inputEl.files ? Array.from(this.inputEl.files) : [];
  }
  show(displayType = "block") {
    this.htmlEl.style.display = displayType != "none" ? displayType : "block";
    return this;
  }
  hide() {
    this.htmlEl.style.display = "none";
    return this;
  }
  isHide() {
    return this.htmlEl.style.display === "none";
  }
  isShow() {
    return !this.isHide();
  }
  toggle(isForce) {
    var currentHide = this.isHide();
    if (arguments.length == 1) {
      if (isForce) {
        return this.show();
      } else {
        return this.hide();
      }
    } else {
      if (currentHide) {
        return this.show();
      } else {
        return this.hide();
      }
    }
  }
  scrollIntoView() {
    this.htmlEl.scrollIntoView();
  }
  addScrollLeft(dt) {
    this.htmlEl.scrollLeft += dt;
    return this;
  }
  addScrollTop(dt) {
    this.htmlEl.scrollTop += dt;
    return this;
  }
  setScrollTop(scrollTop) {
    this.htmlEl.scrollTop = scrollTop;
    return this;
  }
  setScrollLeft(scrollLeft) {
    this.htmlEl.scrollLeft = scrollLeft;
    return this;
  }
  scrollTop() {
    if (this.htmlEl === document.body) {
      return Dom.getScrollTop();
    }
    return this.htmlEl.scrollTop;
  }
  scrollLeft() {
    if (this.htmlEl === document.body) {
      return Dom.getScrollLeft();
    }
    return this.htmlEl.scrollLeft;
  }
  scrollHeight() {
    return this.htmlEl.scrollHeight;
  }
  scrollWidth() {
    return this.htmlEl.scrollWidth;
  }
  on(eventName, callback, opt1) {
    this.htmlEl.addEventListener(eventName, callback, opt1);
    return this;
  }
  off(eventName, callback) {
    this.htmlEl.removeEventListener(eventName, callback);
    return this;
  }
  getElement() {
    return this.htmlEl;
  }
  createChild(tag, className = "", attrs = {}, css = {}) {
    let $element = Dom.create(tag, className, attrs);
    $element.css(css);
    this.append($element);
    return $element;
  }
  get firstChild() {
    return Dom.create(this.htmlEl.firstElementChild);
  }
  children() {
    var element = this.htmlEl.firstElementChild;
    if (!element) {
      return [];
    }
    var results = [];
    do {
      results.push(Dom.create(element));
      element = element.nextElementSibling;
    } while (element);
    return results;
  }
  childLength() {
    return this.htmlEl.children.length;
  }
  replace(newElement) {
    if (this.htmlEl.parentNode) {
      this.htmlEl.parentNode.replaceChild(newElement.el || newElement, this.htmlEl);
    }
    return this;
  }
  replaceChild(oldElement, newElement) {
    this.htmlEl.replaceChild(newElement.el || newElement, oldElement.el || oldElement);
    return this;
  }
  checked(isChecked = false) {
    if (arguments.length == 0) {
      return !!this.inputEl.checked;
    }
    this.inputEl.checked = !!isChecked;
    return this;
  }
  click() {
    this.htmlEl.click();
    return this;
  }
  focus() {
    this.htmlEl.focus();
    return this;
  }
  select() {
    if (this.attr("contenteditable") === "true") {
      var range = document.createRange();
      range.selectNodeContents(this.htmlEl);
      var sel = window.getSelection();
      sel == null ? void 0 : sel.removeAllRanges();
      sel == null ? void 0 : sel.addRange(range);
    } else {
      this.inputEl.select();
    }
    return this;
  }
  blur() {
    this.htmlEl.blur();
    return this;
  }
}
export { AFTER, ALL_TRIGGER, ALT, ANIMATIONEND, ANIMATIONITERATION, ANIMATIONSTART, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, BACKSPACE, BEFORE, BIND, BIND_CHECK_DEFAULT_FUNCTION, BIND_CHECK_FUNCTION, BLUR, BRACKET_LEFT, BRACKET_RIGHT, BaseStore, CALLBACK, CAPTURE, CHANGE, CHANGEINPUT, CHECKER, CLICK, COMMAND, CONFIG, CONTEXTMENU, CONTROL, CUSTOM, D1000, DEBOUNCE, DELAY, DELETE, DOMDIFF, DOUBLECLICK, DOUBLETAB, DRAG, DRAGEND, DRAGENTER, DRAGEXIT, DRAGLEAVE, DRAGOUT, DRAGOVER, DRAGSTART, DROP, Dom, ENTER, EQUAL, ESCAPE, EVENT, FIT, FOCUS, FOCUSIN, FOCUSOUT, FRAME, IF, INPUT, KEY, KEYDOWN, KEYPRESS, KEYUP, LEFT_BUTTON, LOAD, META, MINUS, MOUSE, MOUSEDOWN, MOUSEENTER, MOUSELEAVE, MOUSEMOVE, MOUSEOUT, MOUSEOVER, MOUSEUP, NAME_SAPARATOR, ON, PASSIVE, PASTE, PEN, PIPE, POINTEREND, POINTERENTER, POINTERMOVE, POINTEROUT, POINTEROVER, POINTERSTART, PREVENT, RAF, RESIZE, RIGHT_BUTTON, SAPARATOR, SCROLL, SELF, SELF_TRIGGER, SHIFT, SPACE, STOP, SUBMIT, SUBSCRIBE, SUBSCRIBE_ALL, SUBSCRIBE_SELF, THROTTLE, TOUCH, TOUCHEND, TOUCHMOVE, TOUCHSTART, TRANSITIONCANCEL, TRANSITIONEND, TRANSITIONRUN, TRANSITIONSTART, WHEEL, getRef, makeEventChecker, normalizeWheelEvent };
