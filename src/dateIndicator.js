import { Calendar } from '@/calendar';
import { dateUtil } from '@/helper/dateUtil';

const CLASS_NAME_SELECTABLE = 'ja-selectable';

export class DateIndicator {
  constructor({
    type,
    date,
    container,
    weekStartDay,
    weekStartStandardDay,
    showJumpButtons,
    language,
    selectedList,
  }) {
    this.calendar = new Calendar(container, {
      date,
      language,
      weekStartDay,
      weekStartStandardDay,
      showJumpButtons,
      type,
      layoutTmpl: null,
      headerTmpl: null,
      bodyYearTmpl: null,
      bodyMonthTmpl: null,
      bodyWeekTmpl: null,
      bodyDateTmpl: null,
    });

    this.type = type;
    this.selectedList = selectedList;
    this.dateElements = this.calendar.getDateElements();
    this.dateLayer = this.calendar._body._container;
    this.calendar.on('draw', this._calendarUpdated.bind(this));

    this._addClassForDateElements();
    this._addEvent();
  }

  update(calendarOptions = {}) {
    const { selectedList, ...options } = calendarOptions;
    if (calendarOptions.selectedList) {
      this.selectedList = selectedList;
    }

    this.calendar.draw(options);
  }

  _calendarUpdated(event) {
    this.dateElements = event.dateElements;
    this._addClassForDateElements();
  }

  _addClassForDateElements() {
    Array.from(this.dateElements).forEach(item => {
      item.classList.add(CLASS_NAME_SELECTABLE);

      const itemDate = this._getDateFromElement(item);
      const classNameList = this._getAddingClassNameList(itemDate);

      if (classNameList.length) {
        item.classList.add(...classNameList);
      }
    });
  }

  _getAddingClassNameList(itemDate) {
    return Object.entries(this.selectedList).reduce((acc, [key, value]) => {
      if (dateUtil.isSame(itemDate, new Date(Number(key)), this.type)) {
        acc = acc.concat(value);
      }

      return acc;
    }, []);
  }

  _addEvent() {
    this.dateLayer.addEventListener('click', event => {
      const target = event.target.closest(`.${CLASS_NAME_SELECTABLE}`);

      if (target) {
        const date = this._getDateFromElement(target);

        console.log(date);
      }
    });
  }

  _getDateFromElement(element) {
    return new Date(Number(element.dataset.timestamp));
  }
}
