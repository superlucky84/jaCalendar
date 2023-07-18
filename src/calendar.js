import { h, mount, render as lithentRender } from 'lithent';
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
  TYPE_DATE_WEEK,
  TYPE_MONTH,
  TYPE_YEAR,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_NEXT_WEEK_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_HIDDEN,
  CLASS_NAME_HEADER,
  CLASS_NAME_BODY,
} from '@/constants';

export {
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

export class Calendar extends CustomEvents {
  constructor(options) {
    super();

    this.static = { localeTexts };

    options = {
      language: DEFAULT_LANGUAGE_TYPE,
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
      customOptions: options.customOptions,
      ...options,
    };

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

    this._date = date;
    this._type = type;

    return this._render();
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

    return this._render();
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
    this._type = null;
    this._date = null;
    this._container = null;
    this._header = null;
    this._body = null;
  }

  _initHeader(options) {
    this._header = new Header(
      options.headerTmpl,
      {
        drawNextYear: this.drawNextYear.bind(this),
        drawPrevYear: this.drawPrevYear.bind(this),
        drawNextMonth: this.drawNextMonth.bind(this),
        drawPrevMonth: this.drawPrevMonth.bind(this),
        drawNextWeek: this.drawNextWeek.bind(this),
        drawPrevWeek: this.drawPrevWeek.bind(this),
      },
      options
    );
  }

  _initBody(options) {
    this._body = new Body(options);
  }

  drawPrevYear() {
    if ([TYPE_DATE, TYPE_DATE_WEEK, TYPE_MONTH].includes(this.getType())) {
      this.draw({
        date: this._getRelativeDate(-12),
      });
    } else {
      this.draw({
        date: this._getRelativeDate(-108),
      });
    }
  }

  drawNextYear() {
    if ([TYPE_DATE, TYPE_DATE_WEEK, TYPE_MONTH].includes(this.getType())) {
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
      type === TYPE_DATE_WEEK
    );
  }

  _render() {
    const date = this._date;
    const type = this.getType();

    const [HTmpl, hContext] = this._header.render(date, type);
    const [BTmpl, bContext] = this._body.render(date, type);

    return mount(() => {
      return () => html`<${Fragment}>
        <${HTmpl} ...${hContext} />
        <${BTmpl} ...${bContext} />
      <//>`;
    });
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
