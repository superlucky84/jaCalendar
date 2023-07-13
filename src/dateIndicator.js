import {
  Calendar,
  CLASS_NAME_HEADER,
  CLASS_NAME_BODY,
  CLASS_NAME_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
  CLASS_NAME_NEXT_WEEK_BTN,
} from '@/calendar';
import { dateUtil } from '@/helper/dateUtil';

import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

const CLASS_NAME_SELECTABLE = 'ja-selectable';

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
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks }) =>
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
                <td data-timestamp=${item.timestamp}>${item.dayInMonth}</td>
              `
          )}
        </tr>
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
    selectedList,
  }) {
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
      bodyDateTmpl: null,
    });

    this.type = type;
    this.selectedList = selectedList;
    this.dateElements = this.calendar.getDateElements();
    this.dateLayer = this.calendar._body._container;
    this.calendar.on('draw', this._calendarUpdated.bind(this));

    this._addClassForDateElements();
    this._addEvent();
  }

  update(calendarOptions = {}) {
    const { selectedList, ...options } = calendarOptions;
    if (calendarOptions.selectedList) {
      this.selectedList = selectedList;
    }

    this.calendar.draw(options);
  }

  _calendarUpdated(event) {
    this.dateElements = event.dateElements;
    this._addClassForDateElements();
  }

  _addClassForDateElements() {
    Array.from(this.dateElements).forEach(item => {
      item.classList.add(CLASS_NAME_SELECTABLE);

      const itemDate = this._getDateFromElement(item);
      const classNameList = this._getAddingClassNameList(itemDate);

      if (classNameList.length) {
        item.classList.add(...classNameList);
      }
    });
  }

  _getAddingClassNameList(itemDate) {
    return Object.entries(this.selectedList).reduce((acc, [key, value]) => {
      if (dateUtil.isSame(itemDate, new Date(Number(key)), this.type)) {
        acc = acc.concat(value);
      }

      return acc;
    }, []);
  }

  _addEvent() {
    this.dateLayer.addEventListener('click', event => {
      const target = event.target.closest(`.${CLASS_NAME_SELECTABLE}`);

      if (target) {
        const date = this._getDateFromElement(target);

        console.log(date);
      }
    });
  }

  _getDateFromElement(element) {
    return new Date(Number(element.dataset.timestamp));
  }
}
