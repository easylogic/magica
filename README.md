# sapa

sapa is a library that creates a UI with a simple event system.
# Basic concept

sapa helps you to create applications naturally in html without compiling.

* No compile
* No virtual dom 
* Simple DOM event system 
* Support Typescript

# Install 

`
npm install @easylogic/sapa
`

# How to use in es6

```js
import {App, UIElement, SUBSCRIBE, CLICK} from '@easylogic/sapa'

```

# How to use in browser 

```html
<script type='text/javascript' src='https://cdn.jsdelivr.net/npm/@easylogic/sapa@0.3.2/dist/sapa.umd.js'></script>
<script type='text/javacript'>
    const {App, CLICK, SUBSCRIBE, UIElement} = sapa;   // or window.sapa 
</script>

```

# View examples 

```
npm run dev 
open localhost:8080/examples/first.html
```


# Core System Design 



## Start a application 

```js

import {start, UIElement} from '@easylogic/sapa';

class SampleElement extends UIElement { }

start(SampleElement, {
    container: document.getElementById('sample') // default value is document.body
})
```

The `start` method defines the point in time of the first run. Apply the template to the location specified by container.


## DOM Based Class System

```js
class MyElement extends UIElement {
    template () {
        return `<div>my element</div>`
    }
}

```

Use the `template ()` method to specify the actual HTML string for MyElement.

A UIElement can be contained in other UIElement.

```js
class SecondElement extends UIElement {
    components () {
        return { MyElement }
    }
    template () {
        return `
        <div>
            <object refClass='MyElement' />
        </div>
        `
    }
}

```

It creates MyElement internally when SecondElement is created. At this time, the parent property of MyElement becomes the instance of SecondElement.

### register component
You can register global components using registElement .

```js

class GlobalElement extends UIElement { }

registElement({
    GlobalElement
})

class Test extends UIElement {
    template() {
        return `
            <div>
                <object refClass='GlobalElement'></object>
            </div>

        `
    }
}

```

### add component alias 

```js

class GlobalElement extends UIElement { }

registElement({
    GlobalElement
})

registAlias('global-element', GlobalElement)

class Test extends UIElement {
    template() {
        return `
            <div>
                <object refClass='global-element'></object>
            </div>

        `
    }
}

```

### `refClass` attribute

To create an instance of a newly defined Element, use the `refClass` property.

```js
<object refClass="MyElement" />
```

Using the tag object has no special meaning and is used only as a name meaning creating an object.

It is free to define it in the form below.


```js
<span refClass="MyElement" />
```

### createComponent function 

You can create object tags more easily by using the createComponent function.

```js

createComponent('GlobalElement', {ref: '$globalElement'}) 

==> // output 

<object refClass="GlobalElement" ref="$globalElement" ></object>

```


```js

class Test extends UIElement {
    template() {
        return `
            <div>
                ${createComponent('GlobalElement', {
                    ref: '$globalElement'
                })}
            </div>

        `
    }
}

```


### Pass props 

sapa can create props as it is to create html.

```js

class SecondElement extends UIElement {
    components () {
        return { MyElement }
    }
    template () {
        return `
            <div>
                <object refClass='MyElement' title="my element title" />
            </div>
        `
    }
}


```




### Passing variables as props

sapa uses html strings.

So, when passing a certain variable as props, it must be converted into a string.

In this case, it provides a way to keep the reference as it is without converting the variable to a string.



```js

class SecondElement extends UIElement {
    components () {
        return { MyElement }
    }
    template () {
        return `
            <div>
                <object refClass='MyElement' title=${variable({
                    title: 'my element title'
                })} />
            </div>
        `
    }
}


```

You can also pass props object. 


```js

class SecondElement extends UIElement {
    components () {
        return { MyElement }
    }
    template () {
        return `
            <div>
                <object refClass='MyElement' ${variable({
                    title: 'my element title',
                    description: 'my element description'
                })}></object>
            </div>
        `
    }
}


```



### Using props 

It can be used by referencing the value of props through `this.props`.

```js

class MyElement extends UIElement {

    template () {
        const titleObject = this.props.title;
        return `
            <div>
                ${titleObject.title}
            </div>
        `
    }
}

```

### Local State 

UIElement provides a state that is simple to use.

```js

class MyElement extends UIElement {

    // initialize local state 
    initState() {
        return {
            title: this.props.title
        }

    }

    template () {
        const {title} = this.state; 
        return `
            <div>
                ${title}
            </div>
        `
    }
}


```


### Access DOM 

Use `this.$el`

$el is jQuery-liked DOM wrapper object.

```js
class Test extends UIElement {
    template () { return '<div class="test-item"></div>' }

    [CLICK()] () {
        if (this.$el.hasClass('test-item')) {
            console.log('this element has .test-item')
        }
    }
}
```


### ref  

When the DOM is created, the DOM with the ref attribute is managed as a variable that can be used in advance.

```js
template () {
    return `<div><span ref='$text'></span></div>`
}
[CLICK('$text')]  (e) { 
    console.log(this.refs.$text.html())
}
```

You can apply CLICK events to the `$text` DOM object.

### LOAD 

`LOAD` can define the part that changed frequently.

```js
template () {
    return `
        <div>
            <div ref='$list'></div>
        </div>
    `
}

[LOAD('$list')] () {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return arr.map(value => `<div class='item'>${value}</div>`)
}

refresh( ) {
    this.load();
}
```

#### local load 

The load function can also specify directly within the template.

```js
template () {
    return `
        <div>
            <div ref='$list' load=${variable(() => { 
                const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                return arr.map(value => `<div class='item'>${value}</div>`)
            })}></div>
        </div>
    `
}

```


#### support async function 

```js
async [LOAD('$list')] () {
    return await api.get('xxxx').data;
}
```

### BIND 

`BIND` are used to change the attributes and style of a particular element. That is, it does not create the DOM itself.

```js
template () {
    return `
        <div>
            <div ref='$list'></div>
        </div>
    `
}

[BIND('$list')] () {
    return {
        'data-length': arr.length,
        style: {
            overflow: 'hidden'
        },
        cssText: `
            background-color: yellow;
            color: white;
            background-image: linear-gradient('xxxx')
        `,
        html: "<div></div>",
        innerHTML: "<div></div>",
        text: "blackblack",
        textContent: "redred",        
        class: {
            "is-selected": true,
            "is-focused": false,
        },
        class : [ 'className', 'className' ],
        class : 'string-class',
        htmlDiff: '<div><span></span></div>',
        svgDiff: '<g><rect /><circle /></g>',
        value: "input text",
    }
}

refresh( ) {
    this.load();
}
```

The final output after `BIND` is as follows.

```html
<div ref='$list' data-value='0' style='overflow:hidden'></div>
```

#### local bind 

The bind function can also specify directly within the template.

```js
template () {
    return `
        <div>
            <div ref='$list' bind=${variable(() => { 
                color: 'white'
            })}></div>
        </div>
    `
}

```

## Run separately

`LOAD` and `BIND` can be executed separately.

```js
this.load('$list')
this.bindData('$list');
```

## Life Cycle 

sapa has a life cycle. 

```js
UIElement ->
    created()
    initialize() -> 
        initState()
    render -> 
        template() 
        parseComponent() -> 
            create child component -> 
    load()            
    initializeEvent()
    afterRender()
```

| Method | Override | Description |
| --- | --- | --- |
| created | O | When the UIElement is created  |
| initialize | O | It is the same as `created` but it is used when creating initial data. |
| initState | O | Methods to initialize state  |
| template | O | Generate html at render time |
| afterRender | O | When the DOM is applied to the actual browser, the element can be accessed from outside |

## Method Based DOM Event Handler 

sapa sets the DOM Event in a unique way. sapa take full advantage of the fact that javascript's methods are strings.

```js
class Test extends UIElement {
    template() {
        return '<div>Text</div>'
    }

    [CLICK()] (e) {
        console.log(e);
    }
}
```

`[CLICK()]` is basically the same as `CLICK('$el')`. Sets `$el`'s click event automatically.

The `CLICK()` method internally creates a string. The final result is shown below.

```js
'click $el' (e) { 
    // console.log(e);
}
```

### Support DOM Event List 

```
CLICK = "click"
DOUBLECLICK = "dblclick"
MOUSEDOWN = "mousedown"
MOUSEUP = "mouseup"
MOUSEMOVE = "mousemove"
MOUSEOVER = "mouseover"
MOUSEOUT = "mouseout"
MOUSEENTER = "mouseenter"
MOUSELEAVE = "mouseleave"
TOUCHSTART = "touchstart"
TOUCHMOVE = "touchmove"
TOUCHEND = "touchend"
KEYDOWN = "keydown"
KEYUP = "keyup"
KEYPRESS = "keypress"
DRAG = "drag"
DRAGSTART = "dragstart"
DROP = "drop"
DRAGOVER = "dragover"
DRAGENTER = "dragenter"
DRAGLEAVE = "dragleave"
DRAGEXIT = "dragexit"
DRAGOUT = "dragout"
DRAGEND = "dragend"
CONTEXTMENU = "contextmenu"
CHANGE = "change"
INPUT = "input"
FOCUS = "focus"
FOCUSIN = "focusin"
FOCUSOUT = "focusout"
BLUR = "blur"
PASTE = "paste"
RESIZE = "resize"
SCROLL = "scroll"
SUBMIT = "submit"
POINTERSTART = "mousedown", "touchstart"
POINTERMOVE = "mousemove", "touchmove"
POINTEREND = "mouseup", "touchend"
CHANGEINPUT = "change", "input"
WHEEL = "wheel", "mousewheel", "DOMMouseScroll"
```

You can define any additional events you need. Common DOM events are defined.

You can set several DOM events at the same time.

```
POINTERSTART is a defined name. Two events are actually specified, namely `mousedown` and `touchstart`.
```

DOM events can have some special elements other than $ el.

### ref  

When the DOM is created, the DOM with the ref attribute is managed as a variable that can be used in advance.

```js
template () {
    return `<div><span ref='$text'></span></div>`
}
[CLICK('$text')]  (e) { }
```

You can apply CLICK events to the `$text` DOM object.


### window, document 

Global objects such as window and document can also apply events to their methods.

```js
[RESIZE('window')] (e) { }
[POINTERSTART('document')] (e) { }
```

### delegate 

Applying events to individual DOMs may be bad for performance. In that case, use delegate to handle it.


```js
template () {
    return `
    <div>
        <div class='list' ref='$list'>
            <div class='item'>Item</div>
        </div>
    </div>
    `
}

[CLICK('$list .item')] (e) {
    // this method will run after .item element is clicked
}
```

This is also possible the css selector.


```js
[CLICK('$list .item:not(.selected)')] (e) {
    // do event 
    console.log(e.$dt.html())
}
```
You can run the method only when you click on the `.item` that is not applied to the` .selected` class.

`e.$dt` points to the element where the actual event occurred.


DOM events can have several PIPE functions.

PIPE is a concept that combines predefined functions in an event.

### ALT

The event will only work when Alt key is pressed.


```js
[CLICK() + ALT] (e) {
    // when alt key is pressed
}
```

In addition to ALT, you can use default key combinations such as CTRL, SHIFT, and META.

PIPE can be connected with `+` character.

```js
[CLICK() + ALT + CTRL] (e) {
    // when alt and control key are pressed 
}

```

### IF 

when checkTarget's result is true, this method is run

```js
checkTarget(e) {
    if (e.target.nodeType != 3) return false;
    return true; 
}
[CLICK() + IF('checkTarget')] (e) {}
```

### check LeftMouseButton or RightMouseButton 

```js
[CLICK() + LEFT_BUTTON] (e) {}

[CLICK() + RIGHT_BUTTON] (e) {}
```

### DEBOUNCE 

Some PIPEs can also use actual methods in other ways. A typical example is DEBOUNCE.

```js
[RESIZE('window') + DEBOUNCE(100)] (e) {}
```

TROTTLE is also available.

```js
[SCROLL('document') + TROTTLE(100)] (e) {}
```

## Method Based Messaging System 

sapa has a simple event system for sending messages between objects.

This also uses `method` string, just like specifying a DOM event.

### SUBSCRIBE 

SUBSCRIBE allows you to receive emit messages from elsewhere. 

Provides a callback to send and receive messages even if they are not connected.


```js

class A extends UIElement {
    [SUBSCRIBE('setLocale')] (locale) {
        console.log(locale);
    }
}

class B extends UIElement {
    template () {
        return `<button type="button">Click</button>`
    }

    [CLICK()] () {
        this.emit('setLocale', 'ko')
    }
}

App.start({
    components : {
        A, B
    },
    template : `
        <div>
            <A />
            <B />
        </div>
    `
})

```


### emit

`emit` is a method that delivers a message to an object other than itself.


```js
[CLICK()] () {
    this.emit('setLocale', 'ko')
}
```
why does not it send to its element?

The reason for not sending to itself is that there is a possibility that the event can run infinitely. Once I send the message, I can not come back to me.

### multiple SUBSCRIBE 

SUBSCRIBE can define several at the same time.

```js

[SUBSCRIBE('a', 'b', 'c')] () {
    // 
}

// this.emit('a')
// this.emit('b')
// this.emit('c')

```

### DEBOUNCE 

You can also slow down the execution time of a message.

```js

[SUBSCRIBE('a') + DEBOUNCE(100)] () {

}

```

### THROTTLE 

You can also slow down the execution time of a message.

```js

[SUBSCRIBE('a') + THROTTLE(100)] () {

}

```

### FRAME 

You can run subscribe function by requestAnimationFrame.

```js
class A extends UIElement {
    [SUBSCRIBE('animationStart') + FRAME] () {
        console.log('Aanimation is started.');
    }
}
```


#### IF

```js
class A extends UIElement {

    checkShow(locale) {
        return true;        // 실행 가능 
    }

    [SUBSCRIBE('setLocale') + IF("checkShow")] (locale) {
        console.log(locale);
    }
}
```


### trigger 

The trigger method allows you to execute an event defined on the object itself. Messages sent by trigger are not propagated elsewhere.
 
```js
this.trigger('setLocale', 'en')  // setLocale message is run only on self instance 
```

If you want to send a message only to the parent object, you can do the following:

```js
this.parent.trigger('setLocale', 'en'); 
```


### SUBSCRIBE_SELF 

trigger 함수로만 호출 할 수 있음.  나 자신의 이벤트를 실행하는 방법 


```js
class A extends UIElement {
    [SUBSCRIBE_SELF('setLocale')] (locale) {
        console.log(locale);
    }
}
```

# Simple example 

This sample make a clickable element.

```js

import {start, UIElement, CLICK} from 'sapa'

class Test extends UIElement {
    template() {
        return '<div>Text</div>'
    }

    [CLICK()] (e) {
        console.log(e);
    }
}

start(Test, {
    container: document.getElementById('app')
});

```

# Development

`
npm run dev
`

# How to build 

`
npm run build
`

# Projects 

* https://github.com/easylogic/editor - Web Design Editor



# LICENSE: MIT 

