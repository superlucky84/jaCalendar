import { h, render as lithentRender } from 'lithent';
import htm from 'htm';
import { Header } from '@/layer/header';
import { Body } from '@/layer/body';
import { LayoutTmpl } from '@/tmpl/layoutTmpl';
import { CustomEvents } from '@/helper/customEvents';
import { localeTexts } from '@/locale/localeTexts';
import { dateUtil } from '@/helper/dateUtil';

import {
  DEFAULT_WEEK_START_DAY,
  DEFAULT_LANGUAGE_TYPE,
  DEFAULT_WEEK_START_STANDRAD_DAY,
  TYPE_DATE,
  TYPE_WEEK,
  TYPE_MONTH,
  TYPE_YEAR,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_NEXT_WEEK_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_CALENDAR_MONTH,
  CLASS_NAME_CALENDAR_WEEK,
  CLASS_NAME_CALENDAR_YEAR,
  CLASS_NAME_HIDDEN,
  CLASS_NAME_HEADER,
  CLASS_NAME_BODY,
  CLASS_NAME_BTN,
} from '@/constants';

export {
  CLASS_NAME_BTN,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_NEXT_WEEK_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
  CLASS_NAME_HEADER,
  CLASS_NAME_BODY,
};

const html = htm.bind(h);

/**
 * const calendar = DatePicker.createCalendar('#calendar-wrapper', {
 *     language: 'en',
 *     showJumpButtons: false,
 *     date: new Date(),
 *     type: 'date',
 *     weekStartDay: 'Mon',
 * });
 *
 * calendar.on('draw', (event) => {
 *     console.log(event.date);
 *     console.log(event.type);
 *     for (let i = 0, len = event.dateElements.length; i < len; i += 1) {
 *         const el = event.dateElements[i];
 *         const date = new Date(getData(el, 'timestamp'));
 *         console.log(date);
 *     }
 * });
 */
export class Calendar extends CustomEvents {
  constructor(container, options) {
    super();

    this.static = { localeTexts };

    options = {
      language: DEFAULT_LANGUAGE_TYPE,
      showJumpButtons: false,
      date: new Date(),
      type: TYPE_DATE,
      usageStatistics: true,
      weekStartDay: DEFAULT_WEEK_START_DAY,
      weekStartStandardDay: DEFAULT_WEEK_START_STANDRAD_DAY,
      layoutTmpl: options.layoutTmpl,
      headerTmpl: options.headerTmpl,
      bodyYearTmpl: options.bodyYearTmpl,
      bodyMonthTmpl: options.bodyMonthTmpl,
      bodyWeekTmpl: options.bodyWeekTmpl,
      bodyDateTmpl: options.bodyDateTmpl,
      ...options,
    };

    this._container = container;

    lithentRender(
      html`<${options.layoutTmpl || LayoutTmpl} />`,
      this._container
    );

    this._element = this._container.firstChild;
    this._date = null;
    this._type = null;
    this._header = null;
    this._body = null;

    this._initHeader(options);
    this._initBody(options);
    this.draw({
      date: options.date,
      type: options.type,
    });
  }

  /**
   * Draw the calendar.
   * @param {Object} [options] - Draw options
   *   @param {Date} [options.date] - Date to set
   *   @param {('date'|'month'|'year')} [options.type = 'date'] - Calendar type. Determine whether to show a date, month, or year.
   * @example
   * calendar.draw();
   * calendar.draw({
   *     date: new Date()
   * });
   * calendar.draw({
   *     type: 'month'
   * });
   * calendar.draw({
   *     type: 'month',
   *     date: new Date()
   * });
   */
  draw(options) {
    let date;
    let type;

    options = options || {};
    date = options.date || this._date;
    type = (options.type || this.getType()).toLowerCase();

    if (this._shouldUpdate(date, type)) {
      this._date = date;
      this._type = type;
      this._render();
    }

    this.fire('draw', {
      date: this._date,
      type: type,
      dateElements: this._body.getDateElements(),
    });
  }

  show() {
    this._element.classList.remove(CLASS_NAME_HIDDEN);
  }

  hide() {
    this._element.classList.add(CLASS_NAME_HIDDEN);
  }

  drawNextMonth() {
    this.draw({
      date: this.getNextDate(),
    });
  }

  drawPrevMonth() {
    this.draw({
      date: this.getPrevDate(),
    });
  }

  drawNextWeek() {
    this.draw({
      date: this._getRelativeWeek(7),
    });
  }

  drawPrevWeek() {
    this.draw({
      date: this._getRelativeWeek(-7),
    });
  }

  getNextDate() {
    return this._getRelativeDate(1);
  }

  getPrevDate() {
    return this._getRelativeDate(-1);
  }

  changeLanguage(language) {
    this._header.changeLanguage(language);
    this._body.changeLanguage(language);
    this._render();
  }

  getDate() {
    return new Date(this._date);
  }

  getType() {
    return this._type;
  }

  getDateElements() {
    return this._body.getDateElements();
  }

  addCssClass(className) {
    this._element.classList.add(className);
  }

  removeCssClass(className) {
    this._element.classList.remove(className);
  }

  destroy() {
    this._header.destroy();
    this._body.destroy();
    this._element.remove();
    this._type = null;
    this._date = null;
    this._container = null;
    this._element = null;
    this._header = null;
    this._body = null;
  }

  _initHeader(options) {
    const headerContainer = this._element.querySelector(
      `.${CLASS_NAME_HEADER}`
    );

    this._header = new Header(options.headerTmpl, headerContainer, options);
    this._header.on('click', ev => {
      const target = ev.target;
      const targetClassList = target.classList;

      if (targetClassList.contains(CLASS_NAME_NEXT_YEAR_BTN)) {
        this._onClickNextYear();
      } else if (targetClassList.contains(CLASS_NAME_PREV_YEAR_BTN)) {
        this._onClickPrevYear();
      } else if (
        targetClassList.contains(CLASS_NAME_PREV_MONTH_BTN) &&
        [TYPE_WEEK, TYPE_DATE].includes(options.type)
      ) {
        this.drawPrevMonth();
      } else if (
        targetClassList.contains(CLASS_NAME_NEXT_MONTH_BTN) &&
        [TYPE_WEEK, TYPE_DATE].includes(options.type)
      ) {
        this.drawNextMonth();
      } else if (
        targetClassList.contains(CLASS_NAME_PREV_WEEK_BTN) &&
        options.type === TYPE_WEEK
      ) {
        this.drawPrevWeek();
      } else if (
        targetClassList.contains(CLASS_NAME_NEXT_WEEK_BTN) &&
        options.type === TYPE_WEEK
      ) {
        this.drawNextWeek();
      }
    });
  }

  _initBody(options) {
    var bodyContainer = this._element.querySelector(`.${CLASS_NAME_BODY}`);

    this._body = new Body(bodyContainer, options);
  }

  _onClickPrevYear() {
    if ([TYPE_DATE, TYPE_WEEK, TYPE_MONTH].includes(this.getType())) {
      this.draw({
        date: this._getRelativeDate(-12),
      });
    } else {
      this.draw({
        date: this._getRelativeDate(-108),
      });
    }
  }

  _onClickNextYear() {
    if ([TYPE_DATE, TYPE_WEEK, TYPE_MONTH].includes(this.getType())) {
      this.draw({
        date: this._getRelativeDate(12),
      });
    } else {
      this.draw({
        date: this._getRelativeDate(108),
      });
    }
  }

  _isValidType(type) {
    return (
      type === TYPE_DATE ||
      type === TYPE_MONTH ||
      type === TYPE_YEAR ||
      type === TYPE_WEEK
    );
  }

  _shouldUpdate(date, type) {
    if (!dateUtil.isValidDate(date)) {
      throw new Error('Invalid date');
    }

    if (!this._isValidType(type)) {
      throw new Error('Invalid layer type');
    }

    return true;
  }

  _render() {
    const date = this._date;
    const type = this.getType();

    this._header.render(date, type);
    this._body.render(date, type);
    this._element.classList.remove(
      CLASS_NAME_CALENDAR_WEEK,
      CLASS_NAME_CALENDAR_MONTH,
      CLASS_NAME_CALENDAR_YEAR
    );

    switch (type) {
      case TYPE_WEEK:
        this._element.classList.add(CLASS_NAME_CALENDAR_WEEK);
        break;
      case TYPE_MONTH:
        this._element.classList.add(CLASS_NAME_CALENDAR_MONTH);
        break;
      case TYPE_YEAR:
        this._element.classList.add(CLASS_NAME_CALENDAR_YEAR);
        break;
      default:
        break;
    }
  }

  _getRelativeWeek(step) {
    const prev = this._date;

    return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + step);
  }

  _getRelativeDate(step) {
    const prev = this._date;

    return new Date(prev.getFullYear(), prev.getMonth() + step);
  }
}
