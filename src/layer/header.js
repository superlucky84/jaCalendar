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

const YEAR_TITLE_FORMAT = 'yyyy';

/**
 * @ignore
 * @class
 * @param {HTMLElement} container - Header container or selector
 * @param {object} option - Header option
 * @param {string} option.language - Header language
 */
export class Header {
  constructor(customTmpl, events, option) {
    this._tmpl = customTmpl || HeaderTmpl;
    this.tmplRemove = null;
    this.eventHandler = null;
    this.events = events;

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
      title: this._getTitleText(date, type),
      type,
    };

    return [this._tmpl, context];
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
