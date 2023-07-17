import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const HeaderTmpl = mount(() => {
  return ({ events, isDateCalendar, isWeekCalendar, title, type }) => html`
    <div>
      ${!isWeekCalendar &&
      html`<button onClick=${events.drawPrevYear}>Prev year</button>`}
      ${isDateCalendar &&
      html`<button onClick=${events.drawPrevMonth}>Prev month</button>`}
      ${isWeekCalendar &&
      html`<button onClick=${events.drawPrevWeek}>Prev week</button>`}
      <em>${title}</em>
      ${isWeekCalendar &&
      html`<button onClick=${events.drawNextWeek}>Next week</button>`}
      ${isDateCalendar &&
      html`<button onClick=${events.drawNextMonth}>Next month</button>`}
      ${!isWeekCalendar &&
      html`<button onClick=${events.drawNextYear}>Next year</button>`}
    </div>
  `;
});
