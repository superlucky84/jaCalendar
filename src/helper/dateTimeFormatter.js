import {
  TYPE_DATE,
  TYPE_DATE_WEEK,
  TYPE_MONTH,
  TYPE_YEAR,
  TYPE_HOUR,
  TYPE_MINUTE,
  TYPE_MERIDIEM,
} from '@/constants';
import { dateUtil } from '@/helper/dateUtil';
import { localeTexts } from '@/locale/localeTexts';

const rFormableKeys = /\\?(yyyy|yy|mmmm|mmm|mm|m|dd|d|hh|h|a|wwww)/gi;
const mapForConverting = {
  yyyy: {
    expression: '(\\d{4}|\\d{2})',
    type: TYPE_YEAR,
  },
  yy: {
    expression: '(\\d{4}|\\d{2})',
    type: TYPE_YEAR,
  },
  y: {
    expression: '(\\d{4}|\\d{2})',
    type: TYPE_YEAR,
  },
  M: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  MM: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  MMM: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  MMMM: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  mmm: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  mmmm: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_MONTH,
  },
  WWWW: {
    expression: '(1[012]|0[1-9]|[1-9])',
    type: TYPE_DATE_WEEK,
  },
  dd: {
    expression: '([12]\\d{1}|3[01]|0[1-9]|[1-9])',
    type: TYPE_DATE,
  },
  d: {
    expression: '([12]\\d{1}|3[01]|0[1-9]|[1-9])',
    type: TYPE_DATE,
  },
  D: {
    expression: '([12]\\d{1}|3[01]|0[1-9]|[1-9])',
    type: TYPE_DATE,
  },
  DD: {
    expression: '([12]\\d{1}|3[01]|0[1-9]|[1-9])',
    type: TYPE_DATE,
  },
  h: {
    expression: '(d{1}|0\\d{1}|1\\d{1}|2[0123])',
    type: TYPE_HOUR,
  },
  hh: {
    expression: '(d{1}|[01]\\d{1}|2[0123])',
    type: TYPE_HOUR,
  },
  H: {
    expression: '(d{1}|0\\d{1}|1\\d{1}|2[0123])',
    type: TYPE_HOUR,
  },
  HH: {
    expression: '(d{1}|[01]\\d{1}|2[0123])',
    type: TYPE_HOUR,
  },
  m: {
    expression: '(d{1}|[012345]\\d{1})',
    type: TYPE_MINUTE,
  },
  mm: {
    expression: '(d{1}|[012345]\\d{1})',
    type: TYPE_MINUTE,
  },
  a: {
    expression: '([ap]m)',
    type: TYPE_MERIDIEM,
  },
  A: {
    expression: '([ap]m)',
    type: TYPE_MERIDIEM,
  },
};

/**
 * @class
 * @ignore
 */
export class DateTimeFormatter {
  constructor(rawStr, titles, weekStartDay, weekStartStandardDay) {
    /**
     * @type {string}
     * @private
     */
    this._rawStr = rawStr;

    /**
     * @type {Array}
     * @private
     * @example
     *  rawStr = "yyyy-MM-dd" --> keyOrder = ['year', 'month', 'date']
     *  rawStr = "MM/dd, yyyy" --> keyOrder = ['month', 'date', 'year']
     */
    this._keyOrder = null;

    /**
     * @type {RegExp}
     * @private
     */
    this._regExp = null;

    /**
     * Titles
     * @type {object}
     * @private
     */
    this._titles = titles || localeTexts.en.titles;

    this._weekStartDay = weekStartDay;
    this._weekStartStandardDay = weekStartStandardDay;

    this._parseFormat();
  }
  _parseFormat() {
    var regExpStr = '^';
    var matchedKeys = this._rawStr.match(rFormableKeys);
    var keyOrder = [];

    matchedKeys = matchedKeys.filter(key => key[0] !== '\\');
    matchedKeys.forEach((key, index) => {
      if (!/(m|w)/i.test(key)) {
        key = key.toLowerCase();
      }

      regExpStr += mapForConverting[key].expression + '[\\D\\s]*';
      keyOrder[index] = mapForConverting[key].type;
    });

    // This formatter does not allow additional numbers at the end of string.
    regExpStr += '$';

    this._keyOrder = keyOrder;

    this._regExp = new RegExp(regExpStr, 'gi');
  }

  parse(str) {
    var dateHash = {
      year: 0,
      month: 1,
      date: 1,
      hour: 0,
      minute: 0,
    };
    var hasMeridiem = false;
    var isPM = false;
    var matched;

    this._regExp.lastIndex = 0;
    matched = this._regExp.exec(str);

    if (!matched) {
      throw Error('DateTimeFormatter: Not matched - "' + str + '"');
    }

    // eslint-disable-next-line complexity
    this._keyOrder.forEach((name, index) => {
      var value = matched[index + 1];

      if (name === TYPE_MERIDIEM && /[ap]m/i.test(value)) {
        hasMeridiem = true;
        isPM = /pm/i.test(value);
      } else {
        value = Number(value);

        if (value !== 0 && !value) {
          throw Error(
            'DateTimeFormatter: Unknown value - ' + matched[index + 1]
          );
        }

        if (name === TYPE_YEAR && value < 100) {
          value += 2000;
        }

        dateHash[name] = value;
      }
    });

    if (hasMeridiem) {
      isPM = isPM || dateHash.hour > 12;
      dateHash.hour %= 12;
      if (isPM) {
        dateHash.hour += 12;
      }
    }

    return new Date(
      dateHash.year,
      dateHash.month - 1,
      dateHash.date,
      dateHash.hour,
      dateHash.minute
    );
  }

  getRawString() {
    return this._rawStr;
  }

  format(dateObj) {
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var dayInMonth = dateObj.getDate();
    var day = dateObj.getDay();
    var hour = dateObj.getHours();
    var minute = dateObj.getMinutes();
    var meridiem = 'a'; // Default value for unusing meridiem format
    var replaceMap;

    if (this._keyOrder.includes(TYPE_MERIDIEM)) {
      meridiem = hour >= 12 ? 'pm' : 'am';
      hour = dateUtil.getMeridiemHour(hour);
    }

    replaceMap = {
      yyyy: year,
      yy: String(year).substr(2, 2),
      M: month,
      MM: dateUtil.prependLeadingZero(month),
      MMM: this._titles.MMM[month - 1],
      MMMM: this._titles.MMMM[month - 1],
      d: dayInMonth,
      dd: dateUtil.prependLeadingZero(dayInMonth),
      D: this._titles.D[day],
      DD: this._titles.DD[day],
      hh: dateUtil.prependLeadingZero(hour),
      h: hour,
      mm: dateUtil.prependLeadingZero(minute),
      m: minute,
      A: meridiem.toUpperCase(),
      a: meridiem,
      WWWW:
        dateUtil.getWeekDayInMonth(
          dateObj,
          this._weekStartDay,
          this._weekStartStandardDay
        ) + this._titles.WWWW,
    };

    return this._rawStr.replace(rFormableKeys, function (key) {
      if (key[0] === '\\') {
        return key.substr(1);
      }

      return replaceMap[key] || replaceMap[key.toLowerCase()] || '';
    });
  }
}
