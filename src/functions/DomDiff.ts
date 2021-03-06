import { HTMLInstance, IDom, IKeyValue } from "../types";
import { isFunction } from "./func";

const setBooleanProp = (el: Element, name: string, value: boolean) => {
    if (value) {
        el.setAttribute(name, name);
        el[name] = value;
    } else {
        el.removeAttribute(name);
        el[name] = value;
    }
  };
  
const setProp = (el: Element, name: string, value: boolean|any) => {
    if (typeof value === 'boolean') {
        setBooleanProp(el, name, value);
    } else {
        el.setAttribute(name, value);
    }
};


const removeBooleanProp = (node: Element, name: string) => {
    node.removeAttribute(name);
    node[name] = false;
};

const removeUndefinedProp = (node: Element, name: string) => {
    node.removeAttribute(name);
}
  
const removeProp = (node: Element, name: string, value: any) => {
    if (typeof value === 'boolean') {
        removeBooleanProp(node, name);
    } else if (name) {
        removeUndefinedProp(node, name);
    }
};
  

const updateProp = (node: Element, name: string, newValue: any, oldValue: any) => {
    if (!newValue) {
      removeProp(node, name, oldValue);
    } else if (!oldValue || newValue !== oldValue) {
      setProp(node, name, newValue);
    }
  };


const updateProps = (node: Element, newProps: IKeyValue = {}, oldProps: IKeyValue = {}) => {

    const keyList: any[] = [];
    keyList.push.apply(keyList, Object.keys(newProps))
    keyList.push.apply(keyList, Object.keys(oldProps))

    const props = [...new Set(keyList)]
  
    for(var i = 0, len = props.length; i < len; i++) {
        const key = props[i];
        updateProp(node, key, newProps[key], oldProps[key]);
    }
};

/**
 * TEXT_NODE 일 때   둘 다 공백일 때는  비교하지 않는다. 
 * 
 * @param {*} node1 
 * @param {*} node2 
 */
function changed(node1: { nodeType: number; textContent: any; nodeName: any; }, node2: { textContent: any; nodeName: any; }) {
    return (
        (node1.nodeType === Node.TEXT_NODE && node1.textContent !== node2.textContent) 
        || node1.nodeName !== node2.nodeName
    ) 
}

function hasPassed(node1: Element) {

    // <!-- comment -->  형태의 주석일 때는 그냥 패스 
    if (node1?.nodeType === 8) {
        return true;
    }

    return (
        (node1.nodeType !== Node.TEXT_NODE && node1.getAttribute('data-domdiff-pass') === 'true') 
    ) 
}

/**
 * refClass 속성을 가지고 있으면 기존 el 을 대체한다. 
 * 
 */ 
function hasRefClass(node1: Element) {
    return (
        (node1.nodeType !== Node.TEXT_NODE && (node1.getAttribute('refClass'))) 
    ) 
}

function getProps (attributes: NamedNodeMap) {
    var results = {}
    const len = attributes.length;
    for(let i = 0; i < len; i++) {
        const t = attributes[i];
        results[t.name] = t.value;        
    }

    return results;
    
}

interface IUpdateElementOptions {
    removedElements?: never[];
    checkPassed?: (oldEl: Element, newEl: Element) => boolean;
}

function updateElement (parentElement: Element, oldEl: Element, newEl: Element, i: number, options: IUpdateElementOptions = {}) {

    if (!oldEl) {
        // console.log('replace');        
        parentElement.appendChild(newEl.cloneNode(true));
    } else if (!newEl) {
        // console.log('replace');        
        parentElement.removeChild(oldEl);
    } else if (hasPassed(oldEl) || hasPassed(newEl)) {
        // NOOP
        // data-domdiff-pass="true" 일 때는 아무것도 비교하지 않고 끝낸다. 
        // console.log(oldEl, newEl, 'passed');
    } else if (changed(newEl, oldEl) || hasRefClass(newEl)) {
        // node 가 같지 않으면 바꾸고, refClass 속성이 있으면 바꾸고
        parentElement.replaceChild(newEl.cloneNode(true), oldEl);
    } else if (
        newEl.nodeType !== Node.TEXT_NODE 

        && newEl.nodeType !== Node.COMMENT_NODE
        && newEl.toString() !== "[object HTMLUnknownElement]"
    ) {
        if (options.checkPassed && options.checkPassed(oldEl, newEl)) {
            // NOOP 
            // 정상적인 노드에서 checkPassed 가 true 이면 아무것도 하지 않는다. 
            // 다만 자식의 속성은 변경해야한다. 
        } else {
            // console.log(newEl);
            updateProps(oldEl, getProps(newEl.attributes), getProps(oldEl.attributes)); // added        
        }
        var oldChildren = children(oldEl);
        var newChildren = children(newEl);
        var max = Math.max(oldChildren.length, newChildren.length);

        for (var i = 0; i < max; i++) {
            updateElement(oldEl, oldChildren[i], newChildren[i], i);
        }
    }

}

const children = (el: Element): Element[] => {
    var element = el.firstChild; 

    if (!element) {
        return [] 
    }

    var results = [] as Element[]

    do {
        results.push(element as Element);
        element = element.nextSibling;
    } while (element);

    return results; 
}


export function DomDiff (A: HTMLInstance | IDom, B: HTMLInstance | IDom, options: IUpdateElementOptions = {}) {

    // initialize options parameter
    options.checkPassed = isFunction(options.checkPassed) ? options.checkPassed : undefined;
    options.removedElements = [];

    A = (A as IDom).el || A; 
    B = (B as IDom).el || B; 

    var childrenA = children(A as Element);
    var childrenB = children(B as Element); 

    var len = Math.max(childrenA.length, childrenB.length);
    for (var i = 0; i < len; i++) {
        updateElement(A as Element, childrenA[i], childrenB[i], i, options);
    }
}
