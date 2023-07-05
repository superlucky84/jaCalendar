import { h, mount } from 'lithent';
import htm from 'htm';
import {
  CLASS_NAME_BODY_INNER,
  CLASS_NAME_BODY_HEADER,
  CLASS_NAME_SUN,
  CLASS_NAME_SAT,
  CLASS_NAME_WEEK,
} from '@/constants';
const html = htm.bind(h);

export const BodyTmpl = mount(() => {
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks }) =>
    html`
      <table class=${CLASS_NAME_BODY_INNER} cellspacing="0" cellpadding="0">
        <caption>
          <span>Dates</span>
        </caption>
        <thead class=${CLASS_NAME_BODY_HEADER}>
          <tr>
            <th class=${CLASS_NAME_SUN} scope="col">${Sun}</th>
            <th scope="col">${Mon}</th>
            <th scope="col">${Tue}</th>
            <th scope="col">${Wed}</th>
            <th scope="col">${Thu}</th>
            <th scope="col">${Fri}</th>
            <th class=${CLASS_NAME_SAT} scope="col">${Sat}</th>
          </tr>
        </thead>
        <tbody>
          <tr class=${CLASS_NAME_WEEK}>
            ${weeks.map(
              item =>
                html`
                  <td class=${item.className} data-timestamp=${item.timestamp}>
                    ${item.dayInMonth}
                  </td>
                `
            )}
          </tr>
        </tbody>
      </table>
    `;
});
