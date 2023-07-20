import { mount, Fragment } from 'lithent';
import { lTag as html } from 'lithent/tag';

export const BodyTmpl = mount((r, props) => {
  let context = props;

  if (props.updater) {
    props.updater.value = newContext => {
      context = newContext;
      r();
    };
  }

  return () => {
    return html`<${Fragment}><${context.Tmpl} ...${context} /><//>`;
  };
});
