import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);
import { BodyTmpl as DateBodyTmpl } from '@/tmpl/dateBodyTmpl';
import { BodyTmpl as YearBodyTmpl } from '@/tmpl/yearBodyTmpl';
import { BodyTmpl as MonthBodyTmpl } from '@/tmpl/monthBodyTmpl';
import { BodyTmpl as WeekBodyTmpl } from '@/tmpl/weekBodyTmpl';

export const BodyTmpl = mount((r, props) => {
  const getTmpl = type => {
    return {
      date: DateBodyTmpl,
      month: MonthBodyTmpl,
      year: YearBodyTmpl,
      'date-week': WeekBodyTmpl,
    }[type];
  };
  let context = props;

  if (props.updater) {
    props.updater.value = newContext => {
      context = newContext;
      r();
    };
  }

  return () => {
    return html`<${Fragment}><${getTmpl(context.type)} ...${context} /><//>`;
  };
});
