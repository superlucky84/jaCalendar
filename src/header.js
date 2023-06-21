import { h, render as lithentRender } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

import { CustomEvents } from './customEvents';
import { TYPE_DATE, TYPE_MONTH, TYPE_YEAR } from '@/constants';
import { localeTexts } from '@/localeTexts';
import { HeaderTmpl } from '@/headerTmpl';
import { DateTimeFormatter } from '@/dateTimeFormatter';

const CLASS_NAME_TITLE_MONTH = 'tui-calendar-title-month';
const CLASS_NAME_TITLE_YEAR = 'tui-calendar-title-year';
const CLASS_NAME_TITLE_YEAR_TO_YEAR = 'tui-calendar-title-year-to-year';
const SELECTOR_INNER_ELEM = '.tui-calendar-header-inner';
const SELECTOR_INFO_ELEM = '.tui-calendar-header-info';
const SELECTOR_BTN = '.tui-calendar-btn';
const YEAR_TITLE_FORMAT = 'yyyy';

/**
 * @ignore
 * @class
 * @param {HTMLElement} container - Header container or selector
 * @param {object} option - Header option
 * @param {string} option.language - Header language
 * @param {boolean} option.showToday - Has today box or not.
 * @param {boolean} option.showJumpButtons - Has jump buttons or not.
 */
export class Header extends CustomEvents {
  constructor(container, option) {
    super();

    this.tmplRemove = null;
    this.eventHandler = null;
    /**
     * Container element
     * @type {HTMLElement}
     * @private
     */
    this._container = container;

    /**
     * Header inner element
     * @type {HTMLElement}
     * @private
     */
    this._innerElement = null;

    /**
     * Header info element
     * @type {HTMLElement}
     * @private
     */
    this._infoElement = null;

    /**
     * Render today box or not
     * @type {boolean}
     * @private
     */
    this._showToday = option.showToday;

    /**
     * Render jump buttons or not (next,prev year on date calendar)
     * @type {boolean}
     * @private
     */
    this._showJumpButtons = option.showJumpButtons;

    /**
     * Year_Month title formatter
     * @type {DateTimeFormatter}
     * @private
     */
    this._yearMonthTitleFormatter = null;

    /**
     * Year title formatter
     * @type {DateTimeFormatter}
     * @private
     */
    this._yearTitleFormatter = null;

    /**
     * Today formatter
     * @type {DateTimeFormatter}
     * @private
     */
    this._todayFormatter = null;

    this._setFormatters(localeTexts[option.language]);
    this._setEvents(option);
  }

  /**
   * @param {object} localeText - Locale text
   * @private
   */
  _setFormatters(localeText) {
    this._yearMonthTitleFormatter = new DateTimeFormatter(
      localeText.titleFormat,
      localeText.titles
    );
    this._yearTitleFormatter = new DateTimeFormatter(
      YEAR_TITLE_FORMAT,
      localeText.titles
    );
    this._todayFormatter = new DateTimeFormatter(
      localeText.todayFormat,
      localeText.titles
    );
  }

  /**
   * @param {object} option - Constructor option
   * @private
   */
  _setEvents() {
    // mouseTouchEvent.on(this._container, 'click', this._onClickHandler, this);
    this.eventHandler = this._onClickHandler.bind(this);
    console.log(this._container);
    this._container.addEventListener('click', this.eventHandler);
  }

  /**
   * @private
   */
  _removeEvents() {
    this.off();
    // mouseTouchEvent.off(this._container, 'click', this._onClickHandler);
    this._container.removeEventListener('click', this.eventHandler);
  }

  /**
   * Fire customEvents
   * @param {Event} ev An event object
   * @private
   */
  _onClickHandler(ev) {
    const target = ev.target;

    if (target.closest(SELECTOR_BTN)) {
      this.fire('click', ev);
    }
  }

  /**
   * @param {string} type - Calendar type
   * @returns {string}
   * @private
   */
  _getTitleClass(type) {
    switch (type) {
      case TYPE_DATE:
        return CLASS_NAME_TITLE_MONTH;
      case TYPE_MONTH:
        return CLASS_NAME_TITLE_YEAR;
      case TYPE_YEAR:
        return CLASS_NAME_TITLE_YEAR_TO_YEAR;
      default:
        return '';
    }
  }

  /**
   * @param {Date} date - date
   * @param {string} type - Calendar type
   * @returns {string}
   * @private
   */
  _getTitleText(date, type) {
    var currentYear, start, end;

    switch (type) {
      case TYPE_DATE:
        return this._yearMonthTitleFormatter.format(date);
      case TYPE_MONTH:
        return this._yearTitleFormatter.format(date);
      case TYPE_YEAR:
        currentYear = date.getFullYear();
        start = new Date(currentYear - 4, 0, 1);
        end = new Date(currentYear + 4, 0, 1);

        return (
          this._yearTitleFormatter.format(start) +
          ' - ' +
          this._yearTitleFormatter.format(end)
        );
      default:
        return '';
    }
  }

  changeLanguage(language) {
    this._setFormatters(localeTexts[language]);
  }

  render(date, type) {
    const context = {
      showToday: this._showToday,
      showJumpButtons: this._showJumpButtons,
      todayText: this._todayFormatter.format(new Date()),
      isDateCalendar: type === TYPE_DATE,
      titleClass: this._getTitleClass(type),
      title: this._getTitleText(date, type),
    };

    if (this.tmplRemove) {
      this.tmplRemove();
    }

    this.tmplRemove = lithentRender(
      html`<${HeaderTmpl} ...${context} />`,
      this._container
    );

    this._innerElement = this._container.querySelector(SELECTOR_INNER_ELEM);
    if (context.showToday) {
      this._infoElement = this._container.querySelector(SELECTOR_INFO_ELEM);
    }
  }

  destroy() {
    this._removeEvents();
    this._innerElement.remove();
    this._infoElement.remove();
    this._container = null;
    this._showToday = null;
    this._showJumpButtons = null;
    this._yearMonthTitleFormatter = null;
    this._yearTitleFormatter = null;
    this._todayFormatter = null;
    this._innerElement = null;
    this._infoElement = null;
  }
}
