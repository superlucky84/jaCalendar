import { Calendar } from '@/calendar';
import { h, mount } from 'lithent';
import htm from 'htm';

const html = htm.bind(h);

/*
  const calendar = new Calendar({
    date,
    language,
    weekStartDay,
    weekStartStandardDay,
    type,
    layoutTmpl,
    headerTmpl,
    bodyYearTmpl,
    bodyMonthTmpl,
    bodyWeekTmpl,
    bodyDateTmpl,
    customOptions,
  });
*/
export const CalendarComponent = mount((_r, props) => {
  const options = { ...props };
  const calendar = new Calendar(options);
  const templateVDom = calendar.draw();

  return () => templateVDom;
});
