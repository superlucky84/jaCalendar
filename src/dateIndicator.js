import { Calendar, CLASS_NAME_HEADER, CLASS_NAME_BODY } from '@/calendar';
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
  return ({
    events,
    showJumpButtons,
    isDateCalendar,
    isWeekCalendar,
    titleClass,
    title,
    type,
  }) => html`
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
                    'week'
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

export class DateIndicator {
  constructor({
    type,
    date,
    container,
    weekStartDay,
    weekStartStandardDay,
    showJumpButtons,
    language,
    customOptions,
  }) {
    this.type = type;
    this.customOptions = customOptions;

    this.calendar = new Calendar(container, {
      date,
      language,
      weekStartDay,
      weekStartStandardDay,
      showJumpButtons,
      type,
      layoutTmpl: LayoutTmpl,
      headerTmpl: HeaderTmpl,
      bodyYearTmpl: null,
      bodyMonthTmpl: null,
      bodyWeekTmpl: BodyWeekTmpl,
      bodyDateTmpl: BodyDateTmpl,
      customOptions,
    });
  }

  update(calendarOptions = {}) {
    this.calendar.draw(calendarOptions);
  }

  _getDateFromElement(element) {
    return new Date(Number(element.dataset.timestamp));
  }
}
