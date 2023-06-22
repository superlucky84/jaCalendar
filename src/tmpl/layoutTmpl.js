import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const LayoutTmpl = mount(
  () => () =>
    html`
      <div class="tui-calendar">
        <div class="tui-calendar-header"></div>
        <div class="tui-calendar-body"></div>
      </div>
    `
);
