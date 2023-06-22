import { Calendar } from '@/calendar';
import { dateUtil } from '@/helper/dateUtil';

const CLASS_NAME_SELECTABLE = 'ja-selectable';

export class DateIndicator {
  constructor({ type, container, selectedList }) {
    this.calendar = new Calendar(container, {
      language: 'ko',
      showToday: true,
      showJumpButtons: true,
      weekStartDay: 'Mon',
      date: new Date(),
      type,
    });

    this.type = type;
    this.selectedList = selectedList;
    this.dateElements = this.calendar.getDateElements();
    this.dateLayer = this.calendar._body._container;
    this.calendar.on('draw', this.calendarUpdated.bind(this));

    this.addClassForDateElements();
    this.addEvent();
  }

  changeOption(option) {
    this.calendar.draw(option);
  }

  calendarUpdated(event) {
    this.dateElements = event.dateElements;
    this.addClassForDateElements();
  }

  addClassForDateElements() {
    Array.from(this.dateElements).forEach(item => {
      item.classList.add(CLASS_NAME_SELECTABLE);

      const itemDate = this.getDateFromElement(item);
      const classNameList = this.getAddingClassNameList(itemDate);

      if (classNameList.length) {
        item.classList.add(...classNameList);
      }
    });
  }

  getAddingClassNameList(itemDate) {
    return Object.entries(this.selectedList).reduce((acc, [key, value]) => {
      if (dateUtil.isSame(itemDate, new Date(Number(key)), this.type)) {
        acc = acc.concat(value);
      }

      return acc;
    }, []);
  }

  addEvent() {
    this.dateLayer.addEventListener('click', event => {
      const target = event.target.closest(`.${CLASS_NAME_SELECTABLE}`);

      if (target) {
        const date = this.getDateFromElement(target);

        console.log(date);
      }
    });
  }

  getDateFromElement(element) {
    return new Date(Number(element.dataset.timestamp));
  }
}
