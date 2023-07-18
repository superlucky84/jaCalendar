import { h, mount, Fragment, render as lithentRender } from 'lithent';
import htm from 'htm';
import { Header } from '@/layer/header';
import { Body } from '@/layer/body';
import { localeTexts } from '@/locale/localeTexts';

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
} from '@/constants';

export {
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_NEXT_WEEK_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
};

const html = htm.bind(h);

export class Calendar {
  constructor(options) {
    this.static = { localeTexts };

    options = {
      language: DEFAULT_LANGUAGE_TYPE,
      date: new Date(),
      type: TYPE_DATE,
      usageStatistics: true,
      weekStartDay: DEFAULT_WEEK_START_DAY,
      weekStartStandardDay: DEFAULT_WEEK_START_STANDRAD_DAY,
      headerTmpl: options.headerTmpl,
      bodyYearTmpl: options.bodyYearTmpl,
      bodyMonthTmpl: options.bodyMonthTmpl,
      bodyWeekTmpl: options.bodyWeekTmpl,
      bodyDateTmpl: options.bodyDateTmpl,
      customOptions: options.customOptions,
      ...options,
    };

    this.portalHeaderElement = options.portalHeaderElement;
    this._date = options.date;
    this._type = options.type;

    this._header = null;
    this._body = null;

    this._initHeader(options);
    this._initBody(options);
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

    const dataHeader = this._header.render(date, type);
    const dataBody = this._body.render(date, type);

    if (!this.reRender) {
      throw new Error('먼저 마운트 해야 합니다.');
    }

    this.reRender(dataHeader, dataBody);
  }

  mount() {
    const date = this._date;
    const type = this.getType();

    const dataHeader = this._header.render(date, type);
    const dataBody = this._body.render(date, type);

    if (this.portalHeaderElement) {
      this.reRender = (dataHeader, dataBody) => {
        this.reRenderHeader(dataHeader);
        this.reRenderBody(dataBody);
      };

      const PortalHeader = mount(renew => {
        let header = dataHeader;

        this.reRenderHeader = newHeader => {
          header = newHeader;
          renew();
        };

        return () => html`<${Fragment}>
          <${header[0]} ...${header[1]} />
        <//>`;
      });

      lithentRender(html`<${PortalHeader} />`, this.portalHeaderElement);

      return mount(renew => {
        let body = dataBody;

        this.reRenderBody = newBody => {
          body = newBody;
          renew();
        };

        return () => html`<${Fragment}>
          <${body[0]} ...${body[1]} />
        <//>`;
      });
    } else {
      return mount(renew => {
        let header = dataHeader;
        let body = dataBody;

        this.reRender = (newHeader, newBody) => {
          header = newHeader;
          body = newBody;
          renew();
        };

        return () => html`<${Fragment}>
          <${header[0]} ...${header[1]} />
          <${body[0]} ...${body[1]} />
        <//>`;
      });
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
