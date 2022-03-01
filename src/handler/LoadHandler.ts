import { BaseHandler } from "./BaseHandler";
import { MagicMethodResult } from '../functions/MagicMethod';
import { Dom } from '../functions/Dom';

export class LoadHandler extends BaseHandler {

  constructor(context: any, magicMethod: MagicMethodResult, callback: Function) {
    super(context, magicMethod, callback);
  }

  initialize(): void {
      this.load();
  }

  async load() {

    const it = this.magicMethod;
    const callback = this.callback;

    const $element = Array.from(document.querySelectorAll(it.args[0])).map(it => Dom.create(it as any));

    if (!$element.length) {
      console.warn(`[LOAD] element not found: ${it.args[0]}`);
      return;
    }
    const isDomDiff = !!it.keys['domdiff'];

    await $element.forEach(async ($el) => {
      var newTemplate = await callback.call(this, $el);
      const div = Dom.create('div');      
      div.html(newTemplate);

      const fragment = Dom.create(div.createChildrenFragment());

      if (isDomDiff) {
        $el.htmlDiff(fragment.el);
      } else {
        $el.html(fragment.el);
      }

    })

  }

}