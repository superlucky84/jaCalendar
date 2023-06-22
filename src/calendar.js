import { h, render as lithentRender, mount } from 'lithent';
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
  TYPE_DATE,
  TYPE_MONTH,
  TYPE_YEAR,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_CALENDAR_MONTH,
  CLASS_NAME_CALENDAR_YEAR,
  CLASS_NAME_HIDDEN,
  HEADER_SELECTOR,
  BODY_SELECTOR,
} from '@/constants';

const html = htm.bind(h);

/**
 * const calendar = DatePicker.createCalendar('#calendar-wrapper', {
 *     language: 'en',
 *     showToday: true,
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
      showToday: true,
      showJumpButtons: false,
      date: new Date(),
      type: TYPE_DATE,
      usageStatistics: true,
      weekStartDay: DEFAULT_WEEK_START_DAY,
      ...options,
    };

    this._container = container;

    lithentRender(html`<${LayoutTmpl} />`, this._container);

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
    var date, type;

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

  drawNext() {
    this.draw({
      date: this.getNextDate(),
    });
  }

  drawPrev() {
    this.draw({
      date: this.getPrevDate(),
    });
  }

  getNextDate() {
    if (this.getType() === TYPE_DATE) {
      return this._getRelativeDate(1);
    }

    return this.getNextYearDate();
  }

  getPrevDate() {
    if (this.getType() === TYPE_DATE) {
      return this._getRelativeDate(-1);
    }

    return this.getPrevYearDate();
  }

  getNextYearDate(customStep) {
    if (customStep) {
      return this._getRelativeDate(customStep);
    }

    switch (this.getType()) {
      case TYPE_DATE:
      case TYPE_MONTH:
        return this._getRelativeDate(12); // 12 months = 1 year
      case TYPE_YEAR:
        return this._getRelativeDate(108); // 108 months = 9 years = 12 * 9
      default:
        throw new Error('Unknown layer type');
    }
  }

  getPrevYearDate(customStep) {
    if (customStep) {
      return this._getRelativeDate(customStep);
    }

    switch (this.getType()) {
      case TYPE_DATE:
      case TYPE_MONTH:
        return this._getRelativeDate(-12); // 12 months = 1 year
      case TYPE_YEAR:
        return this._getRelativeDate(-108); // 108 months = 9 years = 12 * 9
      default:
        throw new Error('Unknown layer type');
    }
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
    const headerContainer = this._element.querySelector(HEADER_SELECTOR);

    this._header = new Header(headerContainer, options);
    this._header.on('click', ev => {
      var target = ev.target;
      if (target.classList.contains(CLASS_NAME_PREV_MONTH_BTN)) {
        this.drawPrev();
      } else if (target.classList.contains(CLASS_NAME_PREV_YEAR_BTN)) {
        this._onClickPrevYear();
      } else if (target.classList.contains(CLASS_NAME_NEXT_MONTH_BTN)) {
        this.drawNext();
      } else if (target.classList.contains(CLASS_NAME_NEXT_YEAR_BTN)) {
        this._onClickNextYear();
      }
    });
  }

  _initBody(options) {
    var bodyContainer = this._element.querySelector(BODY_SELECTOR);

    this._body = new Body(bodyContainer, options);
  }

  _onClickPrevYear() {
    if (this.getType() === TYPE_DATE) {
      this.draw({
        date: this._getRelativeDate(-12),
      });
    } else {
      this.drawPrev();
    }
  }

  _onClickNextYear() {
    if (this.getType() === TYPE_DATE) {
      this.draw({
        date: this._getRelativeDate(12),
      });
    } else {
      this.drawNext();
    }
  }

  _isValidType(type) {
    return type === TYPE_DATE || type === TYPE_MONTH || type === TYPE_YEAR;
  }

  _shouldUpdate(date, type) {
    var prevDate = this._date;

    if (!dateUtil.isValidDate(date)) {
      throw new Error('Invalid date');
    }

    if (!this._isValidType(type)) {
      throw new Error('Invalid layer type');
    }

    return (
      !prevDate ||
      prevDate.getFullYear() !== date.getFullYear() ||
      prevDate.getMonth() !== date.getMonth() ||
      this.getType() !== type
    );
  }

  _render() {
    var date = this._date;
    var type = this.getType();

    this._header.render(date, type);
    this._body.render(date, type);
    this._element.classList.remove(
      CLASS_NAME_CALENDAR_MONTH,
      CLASS_NAME_CALENDAR_YEAR
    );

    switch (type) {
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

  _getRelativeDate(step) {
    var prev = this._date;

    return new Date(prev.getFullYear(), prev.getMonth() + step);
  }
}
