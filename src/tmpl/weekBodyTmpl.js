import { mount } from 'lithent';
import { lTag as html } from 'lithent/tag';

export const BodyTmpl = mount(() => {
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks }) =>
    html`
      <table cellspacing="0" cellpadding="0">
        <caption>
          <span>Dates</span>
        </caption>
        <thead>
          <tr>
            <th scope="col">${Sun}</th>
            <th scope="col">${Mon}</th>
            <th scope="col">${Tue}</th>
            <th scope="col">${Wed}</th>
            <th scope="col">${Thu}</th>
            <th scope="col">${Fri}</th>
            <th scope="col">${Sat}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            ${weeks.map(
              item =>
                html`
                  <td data-timestamp=${item.timestamp}>${item.dayInMonth}</td>
                `
            )}
          </tr>
        </tbody>
      </table>
    `;
});
