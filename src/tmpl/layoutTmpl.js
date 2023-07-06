import { h, mount } from 'lithent';
import htm from 'htm';
import { CLASS_NAME_HEADER, CLASS_NAME_BODY } from '@/constants';

const html = htm.bind(h);

export const LayoutTmpl = mount(
  () => () =>
    html`
      <div>
        <div class=${CLASS_NAME_HEADER}></div>
        <div class=${CLASS_NAME_BODY}></div>
      </div>
    `
);
