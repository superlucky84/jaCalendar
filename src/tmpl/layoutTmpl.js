import { h, mount } from 'lithent';
import htm from 'htm';
import {
  CLASS_NAME_HEADER,
  CLASS_NAME_BODY,
  CLASS_NAME_CALENDAR,
} from '@/constants';

const html = htm.bind(h);

export const LayoutTmpl = mount(
  () => () =>
    html`
      <div class=${CLASS_NAME_CALENDAR}>
        <div class=${CLASS_NAME_HEADER}></div>
        <div class=${CLASS_NAME_BODY}></div>
      </div>
    `
);
