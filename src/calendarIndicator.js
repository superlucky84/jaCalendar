import { Calendar } from '@/calendar';
import { h, mount, Fragment } from 'lithent';
import htm from 'htm';

const html = htm.bind(h);

export const CalendarComponent = mount((_r, props) => {
  const options = { ...props };
  const calendar = new Calendar(options);
  const templateVDom = calendar.draw();

  return () => html`<${Fragment}><${templateVDom} /><//>`;
});
