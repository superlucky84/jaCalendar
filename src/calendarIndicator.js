import { Calendar } from '@/calendar';
import { h, mount, Fragment, mountCallback, updateCallback } from 'lithent';
import htm from 'htm';

const html = htm.bind(h);

export const CalendarComponent = mount((_r, props) => {
  const { apiRef, ...options } = props;
  const calendar = new Calendar(options);
  const templateVDom = calendar.mount();

  mountCallback(() => () => calendar.destroy());

  updateCallback(
    () => {
      calendar.draw({ ...props });
    },
    () => [
      props.language,
      props.type,
      props.date,
      props.weekStartDay,
      props.weekStartStandardDay,
      props.headerTmpl,
      props.bodyYearTmpl,
      props.bodyMonthTmpl,
      props.bodyWeekTmpl,
      props.bodyDateTmpl,
      props.apiRef,
      props.customOptions,
      props.portalHeaderElement,
    ]
  );

  if (apiRef) {
    apiRef.value = {
      update(newOptions) {
        calendar.draw(newOptions);
      },
      getDate() {
        return calendar.getDate();
      },
      getType() {
        return calendar.getType();
      },
      getNextMonth() {
        return calendar.getNextMonth();
      },
      getPrevMonth() {
        return calendar.getPrevMonth();
      },
      getNextWeek() {
        return calendar.getNextWeek();
      },
      getPrevWeek() {
        return calendar.getPrevWeek();
      },
      getNextYear() {
        return calendar.getNextYear();
      },
      getPrevYear() {
        return calendar.getPrevYear();
      },
      getEventHandler() {
        return calendar.eventHandler;
      },
    };
  }

  return () => html`<${Fragment}><${templateVDom} /><//>`;
});
