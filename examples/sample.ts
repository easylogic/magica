
import { CLICK, PREVENT, MOUSEOVER, SUBSCRIBE, BIND, LOAD, DOMDIFF } from '../src/Event';
import {magica, emit} from '../src/functions/magica';

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