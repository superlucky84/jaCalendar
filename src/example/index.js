import { CLASS_NAME_HEADER, CLASS_NAME_BODY } from '@/calendar';
import { CalendarClass } from '@/calendarIndicator';
import { dateUtil } from '@/helper/dateUtil';
import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const LayoutTmpl = mount(
  () => () =>
    html`
      <div>
        asdga
        <div class=${CLASS_NAME_HEADER}></div>
        <div class=${CLASS_NAME_BODY}></div>
        vase
      </div>
    `
);

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

export const BodyWeekTmpl = mount(() => {
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks, customOptions }) =>
    html`
      <table cellspacing="0" cellpadding="0">
        <caption>
          <span>Date!!!s</span>
        </caption>
        <tr>
          ${weeks.map(item => html` <td>${item.dayInMonth}</td> `)}
        </tr>
        <tr>
          <th scope="col">${Sun}</th>
          <th scope="col">${Mon}</th>
          <th scope="col">${Tue}</th>
          <th scope="col">${Wed}</th>
          <th scope="col">${Thu}</th>
          <th scope="col">${Fri}</th>
          <th scope="col">${Sat}</th>
        </tr>
        <tr>
          ${weeks.map(
            item =>
              html`
                <td
                  class=${getTargetClass(
                    customOptions,
                    new Date(item.timestamp),
                    'date-week'
                  )}
                  onClick=${() => console.log(new Date(item.timestamp))}
                  data-timestamp=${item.timestamp}
                >
                  ${item.dayInMonth}
                </td>
              `
          )}
        </tr>
      </table>
    `;
});

const getTargetClass = (infos, targetDate, type) => {
  return Object.entries(infos)
    .reduce((acc, [key, value]) => {
      if (dateUtil.isSame(targetDate, new Date(Number(key)), type)) {
        acc = acc.concat(value);
      }

      return acc;
    }, [])
    .join(' ');
};

export const BodyDateTmpl = mount(() => {
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks, customOptions }) =>
    html`
      <table cellspacing="0" cellpadding="0">
        <caption>
          <span>Dates</span>
        </caption>
        <thead>
          <tr>
            <th scope="col">${Sun}</th>
            <th scope="col">${Mon}</th>
            <th scope="col">${Tue}</th>
            <th scope="col">${Wed}</th>
            <th scope="col">${Thu}</th>
            <th scope="col">${Fri}</th>
            <th scope="col">${Sat}</th>
          </tr>
        </thead>
        <tbody>
          ${weeks.map(
            week => html`
              <tr>
                ${week.map(
                  item =>
                    html`
                      <td
                        class=${getTargetClass(
                          customOptions,
                          new Date(item.timestamp),
                          'date'
                        )}
                        onClick=${() => console.log(new Date(item.timestamp))}
                        data-timestamp=${item.timestamp}
                      >
                        ${item.dayInMonth}
                      </td>
                    `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
});

const ins = new CalendarClass({
  container: document.getElementById('calendar-wrapper'),
  language: 'ko',
  type: 'date-week',
  date: new Date(),
  weekStartDay: 'sun',
  weekStartStandardDay: 'thu',
  layoutTmpl: LayoutTmpl,
  headerTmpl: HeaderTmpl,
  bodyYearTmpl: null,
  bodyMonthTmpl: null,
  bodyWeekTmpl: BodyWeekTmpl,
  bodyDateTmpl: BodyDateTmpl,
  customOptions: {
    1689300057808: ['classA', 'classB', 'classC'],
    1689131591000: ['classA', 'classB'],
  },
});

console.log('window.ins', ins);
window.ins = ins;
