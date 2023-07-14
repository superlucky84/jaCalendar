import { h, ref, render as lithentRender } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

import { CustomEvents } from '@/helper/customEvents';
import {
  WEEK_START_DAY_MAP,
  TYPE_DATE,
  TYPE_DATE_WEEK,
  TYPE_MONTH,
  TYPE_YEAR,
} from '@/constants';
import { localeTexts } from '@/locale/localeTexts';
import { HeaderTmpl } from '@/tmpl/headerTmpl';
import { DateTimeFormatter } from '@/helper/dateTimeFormatter';
import { dateUtil } from '@/helper/dateUtil';

const CLASS_NAME_TITLE_MONTH = 'ja-calendar-title-month';
const CLASS_NAME_TITLE_YEAR = 'ja-calendar-title-year';
const CLASS_NAME_TITLE_YEAR_TO_YEAR = 'ja-calendar-title-year-to-year';
const SELECTOR_INNER_ELEM = '.ja-calendar-header-inner';
const SELECTOR_BTN = '.ja-calendar-btn';
const YEAR_TITLE_FORMAT = 'yyyy';

/**
 * @ignore
 * @class
 * @param {HTMLElement} container - Header container or selector
 * @param {object} option - Header option
 * @param {string} option.language - Header language
 */
export class Header extends CustomEvents {
  constructor(customTmpl, container, events, option) {
    super();

    this._customTmpl = customTmpl;
    this.tmplRemove = null;
    this.eventHandler = null;
    this.events = events;

    this._container = container;
    this._innerElement = null;
    this._infoElement = null;
    this._yearMonthTitleFormatter = null;
    this._yearTitleFormatter = null;
    this._weekStartDay = WEEK_START_DAY_MAP[option.weekStartDay.toLowerCase()];
    this._weekStartStandardDay =
      WEEK_START_DAY_MAP[option.weekStartStandardDay.toLowerCase()];

    this._setFormatters(
      localeTexts[option.language],
      this._weekStartDay,
      this._weekStartStandardDay
    );
    this._setEvents(option);
  }

  changeLanguage(language) {
    this._setFormatters(
      localeTexts[language],
      this._weekStartDay,
      this._weekStartStandardDay
    );
  }

  render(date, type) {
    const context = {
      events: this.events,
      isDateCalendar: type === TYPE_DATE,
      isWeekCalendar: type === TYPE_DATE_WEEK,
      titleClass: this._getTitleClass(type),
      title: this._getTitleText(date, type),
      type,
    };

    if (this.updater) {
      this.updater.value(context);
    } else {
      this.updater = ref();
      this.remove = lithentRender(
        html`<${HeaderTmpl}
          ...${context}
          updater=${this.updater}
          customTmpl=${this._customTmpl}
        />`,
        this._container
      );
      console.log('_CONTAINER', this._container);
      this._innerElement = this._container.querySelector(SELECTOR_INNER_ELEM);
    }
  }

  destroy() {
    this._removeEvents();
    this._innerElement.remove();
    this._infoElement.remove();
    this._container = null;
    this._yearMonthTitleFormatter = null;
    this._yearTitleFormatter = null;
    this._innerElement = null;
    this._infoElement = null;
  }

  _setFormatters(localeText, weekStartDay, weekStartStandardDay) {
    this._weekTitleFormatter = new DateTimeFormatter(
      'yyyy.MM (WWWW)',
      localeText.titles,
      weekStartDay,
      weekStartStandardDay
    );
    this._yearMonthTitleFormatter = new DateTimeFormatter(
      localeText.titleFormat,
      localeText.titles
    );
    this._yearTitleFormatter = new DateTimeFormatter(
      YEAR_TITLE_FORMAT,
      localeText.titles
    );
  }

  _setEvents() {
    this.eventHandler = this._onClickHandler.bind(this);
    this._container.addEventListener('click', this.eventHandler);
  }

  _removeEvents() {
    this.off();
    this._container.removeEventListener('click', this.eventHandler);
  }

  _onClickHandler(ev) {
    const target = ev.target;

    if (target.closest(SELECTOR_BTN)) {
      this.fire('click', ev);
    }
  }

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

  _getTitleText(date, type) {
    var currentYear, start, end;

    switch (type) {
      case TYPE_DATE_WEEK:
        const displayDate = dateUtil.getStandardDayInWeek(
          date,
          this._weekStartDay,
          this._weekStartStandardDay
        );

        return this._weekTitleFormatter.format(displayDate);
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
}
