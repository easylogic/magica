# magica

magica is an utility to use magic method.
# Install 

`
npm install @easylogic/magica
`

# How to use in es6

```js
import {SUBSCRIBE, CLICK} from '@easylogic/magica'

```

# View examples 

```
npm run dev 
```


# Base Sample 

```js

magica(CLICK('document button') + PREVENT , (e: any) => {
    emit('test', e);
})

magica(MOUSEOVER('document button') + PREVENT , (e: any) => {
    console.log('mouseover prevented', e.$dt);
})

magica(SUBSCRIBE('test'), (e) => {
    console.log('subscribe', e);
})

magica(BIND('button'), () => {
    return {
        style: {
            background: 'red',
            color: 'white'
        }
    }
})

magica(LOAD('button') + DOMDIFF, ($el) => {
    return `<div>${JSON.stringify($el.css('background-color'))}</div>`
})

emit('test');
```

# local build 

```sh
npm run build
```

# LICENSE: MIT 

