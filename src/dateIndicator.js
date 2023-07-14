import { Calendar } from '@/calendar';
export class DateIndicator {
  constructor({
    type,
    date,
    container,
    weekStartDay,
    weekStartStandardDay,
    showJumpButtons,
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
      showJumpButtons,
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
