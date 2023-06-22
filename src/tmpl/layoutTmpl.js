import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const LayoutTmpl = mount(
  () => () =>
    html`
      <div class="ja-calendar">
        <div class="ja-calendar-header"></div>
        <div class="ja-calendar-body"></div>
      </div>
    `
);
