import { TYPE_DATE, TYPE_MONTH, TYPE_YEAR, TYPE_WEEK } from '@/constants';

const isDate = obj => obj instanceof Date;
const isNumber = obj => typeof obj == 'number';
const DAYS_OF_WEEK = 7;

export const dateUtil = {
  /**
   * Get weeks count by paramenter
   * @param {number} year A year
   * @param {number} month A month
   * @returns {number} Weeks count (4~6)
   **/
  getWeeksCount(year, month) {
    var firstDay = dateUtil.getFirstDay(year, month),
      lastDate = dateUtil.getLastDayInMonth(year, month);

    return Math.ceil((firstDay + lastDate) / 7);
  },

  /**
   * @param {Date} date - Date instance
   * @returns {boolean}
   */
  isValidDate(date) {
    return isDate(date) && !isNaN(date.getTime());
  },

  /**
   * Get which day is first by parameters that include year and month information.
   * @param {number} year A year
   * @param {number} month A month
   * @returns {number} (0~6)
   */
  getFirstDay(year, month) {
    return new Date(year, month - 1, 1).getDay();
  },

  /**
   * Get timestamp of the first day.
   * @param {number} year A year
   * @param {number} month A month
   * @returns {number} timestamp
   */
  getFirstDayTimestamp(year, month) {
    return new Date(year, month, 1).getTime();
  },

  /**
   * Get last date by parameters that include year and month information.
   * @param {number} year A year
   * @param {number} month A month
   * @returns {number} (1~31)
   */
  getLastDayInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  /**
   * Chagne number 0~9 to '00~09'
   * @param {number} number number
   * @returns {string}
   * @example
   *  dateUtil.prependLeadingZero(0); //  '00'
   *  dateUtil.prependLeadingZero(9); //  '09'
   *  dateUtil.prependLeadingZero(12); //  '12'
   */
  prependLeadingZero(number) {
    var prefix = '';

    if (number < 10) {
      prefix = '0';
    }

    return prefix + number;
  },

  /**
   * Get meridiem hour
   * @param {number} hour - Original hour
   * @returns {number} Converted meridiem hour
   */
  getMeridiemHour(hour) {
    hour %= 12;

    if (hour === 0) {
      hour = 12;
    }

    return hour;
  },

  /**
   * Get week day in month
   * @param {object} date - 검사하려는 날짜
   * @param {number} stardardFirstWeekDay - 1일이 무슨요일부터 있어야 1주차로 취급할건지 (default 목요일)
   * @param {number} startWeekDay - 달력이 무슨요일부터 시작하는지 (default 일요일)
   * @returns {number}
   */
  getWeekDayInMonth(date, stardardFirstWeekDay = 4, startWeekDay = 0) {
    let startOneWeekDiff = -1;
    const currentDate = date.getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    if (firstDay <= stardardFirstWeekDay) {
      startOneWeekDiff = 0;
    }

    return (
      Math.ceil((currentDate + firstDay - startWeekDay) / 7) + startOneWeekDiff
    );
  },

  // 날짜가 해당하는 주의 시작일
  getStartDayInWeek(date, weekStartDay) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const thisTime = new Date(year, month - 1, day);
    const thisyoil = thisTime.getDay();
    const isYypeA = weekStartDay > thisyoil;
    const diffDay = isYypeA
      ? DAYS_OF_WEEK - weekStartDay + thisyoil
      : thisyoil - weekStartDay;
    return day - diffDay;
  },

  // 날짜가 해당하는 주의 기준요일에 해당하는 날짜
  getStandardDayInWeek(date, weekStartDay, weekStartStandardDay) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const thisTime = new Date(year, month - 1, day);
    const thisyoil = thisTime.getDay();
    const isYypeA = weekStartDay > thisyoil;
    const diffDay = isYypeA
      ? DAYS_OF_WEEK - weekStartDay + thisyoil
      : thisyoil - weekStartDay;

    const weekBaseList = [0, 1, 2, 3, 4, 5, 6];
    const rebaseWeekList = [
      ...weekBaseList.splice(weekBaseList.indexOf(weekStartDay)),
      ...weekBaseList,
    ];
    const diffDay2 =
      rebaseWeekList.indexOf(weekStartStandardDay) -
      rebaseWeekList.indexOf(weekStartDay);

    const result = day - diffDay + diffDay2;

    return new Date(year, month - 1, result);
  },

  /**
   * Returns number or default
   * @param {*} any - Any value
   * @param {number} defaultNumber - Default number
   * @throws Will throw an error if the defaultNumber is invalid.
   * @returns {number}
   */
  getSafeNumber(any, defaultNumber) {
    if (isNaN(defaultNumber) || !isNumber(defaultNumber)) {
      throw Error('The defaultNumber must be a valid number.');
    }
    if (isNaN(any)) {
      return defaultNumber;
    }

    return Number(any);
  },

  /**
   * Return date of the week
   * @param {number} year - Year
   * @param {number} month - Month
   * @param {number} weekNumber - Week number (0~5)
   * @param {number} dayNumber - Day number (0: sunday, 1: monday, ....)
   * @returns {number}
   */
  getDateOfWeek(year, month, weekNumber, dayNumber) {
    var firstDayOfMonth = new Date(year, month - 1).getDay();
    var dateOffset = firstDayOfMonth - dayNumber - 1;

    return new Date(year, month - 1, weekNumber * 7 - dateOffset);
  },

  /**
   * Returns range arr
   * @param {number} start - Start value
   * @param {number} end - End value
   * @returns {Array}
   */
  getRangeArr(start, end) {
    var arr = [];
    var i;

    if (start > end) {
      for (i = end; i >= start; i -= 1) {
        arr.push(i);
      }
    } else {
      for (i = start; i <= end; i += 1) {
        arr.push(i);
      }
    }

    return arr;
  },

  /**
   * Returns cloned date with the start of a unit of time
   * @param {Date|number} date - Original date
   * @param {string} [type = TYPE_DATE] - Unit type
   * @throws {Error}
   * @returns {Date}
   */
  cloneWithStartOf(date, type) {
    type = type || TYPE_DATE;
    date = new Date(date);

    // Does not consider time-level yet.
    date.setHours(0, 0, 0, 0);

    switch (type) {
      case TYPE_WEEK:
      case TYPE_DATE:
        break;
      case TYPE_MONTH:
        date.setDate(1);
        break;
      case TYPE_YEAR:
        date.setMonth(0, 1);
        break;
      default:
        throw Error('Unsupported type: ' + type);
    }

    return date;
  },

  /**
   * Returns cloned date with the end of a unit of time
   * @param {Date|number} date - Original date
   * @param {string} [type = TYPE_DATE] - Unit type
   * @throws {Error}
   * @returns {Date}
   */
  cloneWithEndOf(date, type) {
    type = type || TYPE_DATE;
    date = new Date(date);

    // Does not consider time-level yet.
    date.setHours(23, 59, 59, 999);

    switch (type) {
      case TYPE_DATE:
        break;
      case TYPE_MONTH:
        date.setMonth(date.getMonth() + 1, 0);
        break;
      case TYPE_YEAR:
        date.setMonth(11, 31);
        break;
      default:
        throw Error('Unsupported type: ' + type);
    }

    return date;
  },

  /**
   * Compare two dates
   * @param {Date|number} dateA - Date
   * @param {Date|number} dateB - Date
   * @param {string} [cmpLevel] - Comparing level
   * @returns {number}
   */
  compare(dateA, dateB, cmpLevel) {
    var aTimestamp, bTimestamp;

    if (!(dateUtil.isValidDate(dateA) && dateUtil.isValidDate(dateB))) {
      return NaN;
    }

    if (!cmpLevel) {
      aTimestamp = dateA.getTime();
      bTimestamp = dateB.getTime();
    } else {
      aTimestamp = dateUtil.cloneWithStartOf(dateA, cmpLevel).getTime();
      bTimestamp = dateUtil.cloneWithStartOf(dateB, cmpLevel).getTime();
    }

    if (aTimestamp > bTimestamp) {
      return 1;
    }

    return aTimestamp === bTimestamp ? 0 : -1;
  },

  /**
   * Returns whether two dates are same
   * @param {Date|number} dateA - Date
   * @param {Date|number} dateB - Date
   * @param {string} [cmpLevel] - Comparing level
   * @returns {boolean}
   */
  isSame(dateA, dateB, cmpLevel) {
    return dateUtil.compare(dateA, dateB, cmpLevel) === 0;
  },

  /**
   * Returns whether the target is in range
   * @param {Date|number} start - Range start
   * @param {Date|number} end - Range end
   * @param {Date|number} target - Target
   * @param {string} [cmpLevel = TYPE_DATE] - Comparing level
   * @returns {boolean}
   */
  inRange(start, end, target, cmpLevel) {
    return (
      dateUtil.compare(start, target, cmpLevel) < 1 &&
      dateUtil.compare(end, target, cmpLevel) > -1
    );
  },
};
