import { dateUtil } from '@/helper/dateUtil';
import { TYPE_DATE_WEEK, WEEK_START_DAY_MAP } from '@/constants';
import { LayerBase } from '@/layer/base';
import { BodyTmpl } from '@/tmpl/weekBodyTmpl';
import {
  CLASS_NAME_CALENDER_DATE,
  CLASS_NAME_CALENDER_PREV_MONTH,
  CLASS_NAME_CALENDER_NEXT_MONTH,
  CLASS_NAME_CALENDAR_SUN,
  CLASS_NAME_CALENDAR_SAT,
} from '@/constants';

const DAYS_OF_WEEK = 7;

/**
 * @ignore
 * @class
 * @extends LayerBase
 * @param {string} language - Initial language
 */
export class WeekLayer extends LayerBase {
  constructor(tmpl, customOptions, language, weekStartDay) {
    super(language);
    this.weekStartDay =
      WEEK_START_DAY_MAP[String(weekStartDay).toLowerCase()] || 0;
    this._type = TYPE_DATE_WEEK;
    this._tmpl = tmpl || BodyTmpl;
    this._customOptions = customOptions;
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
  makeContext(date) {
    var daysShort = this._localeText.titles.D;
    var year, month, day, days, i;

    date = date || new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

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
      weeks: this._getWeeks(year, month, day),
      customOptions: this._customOptions,
    };
  }

  /**
   * weeks (templating) for date-calendar
   * @param {number} year - Year
   * @param {number} month - Month
   * @returns {Array.<Array.<Date>>}
   * @private
   */
  _getWeeks(year, month, day) {
    let dates = [];
    let i;
    const firstDay = dateUtil.getStartDayInWeek(
      new Date(year, month - 1, day),
      this.weekStartDay
    );

    for (i = firstDay; i < firstDay + DAYS_OF_WEEK; i += 1) {
      dates.push(new Date(year, month - 1, i));
    }

    return this._getWeek(year, month, dates);
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
}
