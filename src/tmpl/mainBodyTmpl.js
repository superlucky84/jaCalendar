import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

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
