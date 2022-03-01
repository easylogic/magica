
import { test } from 'vitest';
import magica from './magica';
import { CLICK } from '../Event';
import { PREVENT } from '..';

test("magica", () => {
    magica(CLICK('document') + PREVENT , () => {
        console.log('click');
    })
})
