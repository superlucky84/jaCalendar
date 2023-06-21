import { h, render as lithentRender, mount } from 'lithent';
import htm from 'htm';
import { Header } from './header';
import { Body } from '@/body';
import { CustomEvents } from './customEvents';
import { localeTexts } from '@/localeTexts';
import { dateUtil } from './dateUtil';

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

    options = Object.assign(
      {
        language: DEFAULT_LANGUAGE_TYPE,
        showToday: true,
        showJumpButtons: false,
        date: new Date(),
        type: TYPE_DATE,
        usageStatistics: true,
        weekStartDay: DEFAULT_WEEK_START_DAY,
      },
      options
    );

    /**
     * Container element
     * @type {HTMLElement}
     * @private
     */
    this._container = container;
    const Template = mount(
      () => () =>
        html`
          <div class="tui-calendar">
            <div class="tui-calendar-header"></div>
            <div class="tui-calendar-body"></div>
          </div>
        `
    );
    lithentRender(html`<${Template} />`, this._container);

    /**
     * Wrapper element
     * @type {HTMLElement}
     * @private
     */
    this._element = this._container.firstChild;

    /**
     * Date
     * @type {Date}
     * @private
     */
    this._date = null;

    /**
     * Layer type
     * @type {string}
     * @private
     */
    this._type = null;

    /**
     * Header box
     * @type {Header}
     * @private
     */
    this._header = null;

    /**
     * Body box
     * @type {Body}
     * @private
     */
    this._body = null;

    this._initHeader(options);
    this._initBody(options);
    this.draw({
      date: options.date,
      type: options.type,
    });
  }

  /**
   * Initialize header
   * @param {object} options - Header options
   * @private
   */
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

  /**
   * Initialize body
   * @param {object} options - Body options
   * @private
   */
  _initBody(options) {
    var bodyContainer = this._element.querySelector(BODY_SELECTOR);

    this._body = new Body(bodyContainer, options);
  }

  /**
   * clickHandler - prev year button
   * @private
   */
  _onClickPrevYear() {
    if (this.getType() === TYPE_DATE) {
      this.draw({
        date: this._getRelativeDate(-12),
      });
    } else {
      this.drawPrev();
    }
  }

  /**
   * clickHandler - next year button
   * @private
   */
  _onClickNextYear() {
    if (this.getType() === TYPE_DATE) {
      this.draw({
        date: this._getRelativeDate(12),
      });
    } else {
      this.drawNext();
    }
  }

  /**
   * Returns whether the layer type is valid
   * @param {string} type - Layer type to check
   * @returns {boolean}
   * @private
   */
  _isValidType(type) {
    return type === TYPE_DATE || type === TYPE_MONTH || type === TYPE_YEAR;
  }

  /**
   * @param {Date} date - Date to draw
   * @param {string} type - Layer type to draw
   * @returns {boolean}
   * @private
   */
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

  /**
   * Render header & body elements
   * @private
   */
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

  /**
   * Returns relative date
   * @param {number} step - Month step
   * @returns {Date}
   * @private
   */
  _getRelativeDate(step) {
    var prev = this._date;

    return new Date(prev.getFullYear(), prev.getMonth() + step);
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

  /**
   * Show the calendar.
   */
  show() {
    this._element.classList.remove(CLASS_NAME_HIDDEN);
  }

  /**
   * Hide the calendar.
   */
  hide() {
    this._element.classList.add(CLASS_NAME_HIDDEN);
  }

  /**
   * Draw the next page.
   */
  drawNext() {
    this.draw({
      date: this.getNextDate(),
    });
  }

  /**
   * Draw the previous page.
   */
  drawPrev() {
    this.draw({
      date: this.getPrevDate(),
    });
  }

  /**
   * Return the next date.
   * @returns {Date}
   */
  getNextDate() {
    if (this.getType() === TYPE_DATE) {
      return this._getRelativeDate(1);
    }

    return this.getNextYearDate();
  }

  /**
   * Return the previous date.
   * @returns {Date}
   */
  getPrevDate() {
    if (this.getType() === TYPE_DATE) {
      return this._getRelativeDate(-1);
    }

    return this.getPrevYearDate();
  }

  /**
   * Return the date a year later.
   * @param {number} [customStep] - custom step for getting relative date
   * @returns {Date}
   */
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

  /**
   * Return the date a year previously.
   * @param {number} [customStep] - custom step for getting relative date
   * @returns {Date}
   */
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

  /**
   * Change language.
   * @param {string} language - Language code. English('en') and Korean('ko') are provided as default.
   * @see To set to the other languages, use {@link DatePicker#localeTexts DatePicker.localeTexts}.
   */
  changeLanguage(language) {
    this._header.changeLanguage(language);
    this._body.changeLanguage(language);
    this._render();
  }

  /**
   * Return the rendered date.
   * @returns {Date}
   */
  getDate() {
    return new Date(this._date);
  }

  /**
   * Return the calendar's type.
   * @returns {('date'|'month'|'year')}
   */
  getType() {
    return this._type;
  }

  /**
   * Returns HTML elements for dates.
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    return this._body.getDateElements();
  }

  /**
   * Apply a CSS class to the calendar.
   * @param {string} className - Class name
   */
  addCssClass(className) {
    this._element.classList.add(className);
  }

  /**
   * Remove a CSS class from the calendar.
   * @param {string} className - Class name
   */
  removeCssClass(className) {
    this._element.classList.remove(className);
  }

  /**
   * Destroy the calendar.
   */
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
}
