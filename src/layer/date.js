import { h, render as lithentRender } from 'lithent';
import htm from 'htm';
import { dateUtil } from '@/helper/dateUtil';
import { TYPE_DATE, WEEK_START_DAY_MAP } from '@/constants';
import { LayerBase } from '@/layer/base';
import { BodyTmpl } from '@/tmpl/dateBodyTmpl';
import {
  DATE_SELECTOR_DATE as DATE_SELECTOR,
  CLASS_NAME_CALENDER_DATE,
  CLASS_NAME_CALENDER_PREV_MONTH,
  CLASS_NAME_CALENDER_NEXT_MONTH,
  CLASS_NAME_CALENDAR_SUN,
  CLASS_NAME_CALENDAR_SAT,
} from '@/constants';

const html = htm.bind(h);
const DAYS_OF_WEEK = 7;

/**
 * @ignore
 * @class
 * @extends LayerBase
 * @param {string} language - Initial language
 */
export class DateLayer extends LayerBase {
  constructor(language, weekStartDay) {
    super(language);
    this.weekStartDay =
      WEEK_START_DAY_MAP[String(weekStartDay).toLowerCase()] || 0;
    this._type = TYPE_DATE;
  }

  /**
   * Layer type
   * @type {string}
   * @private
   */

  /**
   * @override
   * @private
   * @returns {object} Template context
   */
  _makeContext(date) {
    var daysShort = this._localeText.titles.D;
    var year, month, days, i;

    date = date || new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;

    if (this.weekStartDay) {
      days = daysShort.slice();
      for (i = 0; i < this.weekStartDay; i += 1) {
        days.push(days.shift());
      }
      daysShort = days;
    }

    return {
      Sun: daysShort[0],
      Mon: daysShort[1],
      Tue: daysShort[2],
      Wed: daysShort[3],
      Thu: daysShort[4],
      Fri: daysShort[5],
      Sat: daysShort[6],
      year: year,
      month: month,
      weeks: this._getWeeks(year, month),
    };
  }

  /**
   * weeks (templating) for date-calendar
   * @param {number} year - Year
   * @param {number} month - Month
   * @returns {Array.<Array.<Date>>}
   * @private
   */
  _getWeeks(year, month) {
    let weekNumber = 0;
    let weeksCount = 6; // Fix for no changing height
    const weeks = [];
    let week;
    let dates;
    let i;

    while (weekNumber < weeksCount) {
      dates = [];

      for (
        i = this.weekStartDay;
        i < DAYS_OF_WEEK + this.weekStartDay;
        i += 1
      ) {
        dates.push(dateUtil.getDateOfWeek(year, month, weekNumber, i));
      }

      week = this._getWeek(year, month, dates);

      if (this.weekStartDay && !_isFirstWeek(weekNumber, week[0].dayInMonth)) {
        weeks.push(this._getFirstWeek(year, month));
        weeksCount -= 1; // Fix for no changing height
      }

      weeks.push(week);
      weekNumber += 1;
    }

    return weeks;
  }

  /**
   * week (templating) for date-calendar
   * @param {number} currentYear
   * @param {number} currentMonth
   * @param {Array.<Date>} dates
   * @private
   */
  _getWeek(currentYear, currentMonth, dates) {
    var firstDateOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1);
    var lastDateOfCurrentMonth = new Date(currentYear, currentMonth, 0);
    var contexts = [];
    var i = 0;
    var length = dates.length;
    var date, className;

    for (; i < length; i += 1) {
      className = CLASS_NAME_CALENDER_DATE;
      date = dates[i];

      if (date < firstDateOfCurrentMonth) {
        className += ` ${CLASS_NAME_CALENDER_PREV_MONTH}`;
      }

      if (date > lastDateOfCurrentMonth) {
        className += ` ${CLASS_NAME_CALENDER_NEXT_MONTH}`;
      }

      if (date.getDay() === 0) {
        className += ` ${CLASS_NAME_CALENDAR_SUN}`;
      } else if (date.getDay() === 6) {
        className += ` ${CLASS_NAME_CALENDAR_SAT}`;
      }

      contexts.push({
        dayInMonth: date.getDate(),
        className: className,
        timestamp: date.getTime(),
      });
    }

    return contexts;
  }

  /**
   * Render date-layer
   * @override
   * @param {Date} date Date to render
   * @param {HTMLElement} container A container element for the rendered element
   */
  render(date, container) {
    var context = this._makeContext(date);

    this.remove = lithentRender(html`<${BodyTmpl} ...${context} />`, container);
    this._element = container.firstChild;
  }

  /**
   * Return date elements
   * @override
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    return this._element.querySelectorAll(DATE_SELECTOR);
  }

  _getFirstWeek(year, month) {
    var firstWeekDates = [];
    var i;

    for (i = this.weekStartDay; i < DAYS_OF_WEEK + this.weekStartDay; i += 1) {
      firstWeekDates.push(dateUtil.getDateOfWeek(year, month, -1, i));
    }

    return this._getWeek(year, month, firstWeekDates);
  }
}

function _isFirstWeek(weekIndex, dayInMonth) {
  return weekIndex || dayInMonth === 1 || dayInMonth > DAYS_OF_WEEK;
}
