import { Calendar } from '@/calendar';
import { h, mount } from 'lithent';
import htm from 'htm';

const html = htm.bind(h);

export class CalendarClass {
  constructor({
    type,
    date,
    container,
    weekStartDay,
    weekStartStandardDay,
    language,
    layoutTmpl,
    headerTmpl,
    bodyYearTmpl,
    bodyMonthTmpl,
    bodyWeekTmpl,
    bodyDateTmpl,
    customOptions,
  }) {
    this.type = type;
    this.customOptions = customOptions;

    this.calendar = new Calendar(container, {
      date,
      language,
      weekStartDay,
      weekStartStandardDay,
      type,
      layoutTmpl,
      headerTmpl,
      bodyYearTmpl,
      bodyMonthTmpl,
      bodyWeekTmpl,
      bodyDateTmpl,
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
