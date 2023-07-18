import { Calendar } from '@/calendar';
import { h, mount, Fragment, mountCallback, updateCallback } from 'lithent';
import htm from 'htm';

const html = htm.bind(h);

export const CalendarComponent = mount((_r, props) => {
  const { updateRef, ...options } = props;
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
      props.updateRef,
      props.customOptions,
    ]
  );

  if (updateRef) {
    updateRef.value = newOptions => {
      calendar.draw(newOptions);
    };
  }

  return () => html`<${Fragment}><${templateVDom} /><//>`;
});
