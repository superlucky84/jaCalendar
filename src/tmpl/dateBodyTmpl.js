import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const BodyTmpl = mount(() => {
  return ({ Sun, Mon, Tue, Wed, Thu, Fri, Sat, weeks }) =>
    html`
      <table class="ja-calendar-body-inner" cellspacing="0" cellpadding="0">
        <caption>
          <span>Dates</span>
        </caption>
        <thead class="ja-calendar-body-header">
          <tr>
            <th class="ja-calendar-sun" scope="col">${Sun}</th>
            <th scope="col">${Mon}</th>
            <th scope="col">${Tue}</th>
            <th scope="col">${Wed}</th>
            <th scope="col">${Thu}</th>
            <th scope="col">${Fri}</th>
            <th class="ja-calendar-sat" scope="col">${Sat}</th>
          </tr>
        </thead>
        <tbody>
          ${weeks.map(
            week => html`
              <tr class="ja-calendar-week">
                ${week.map(
                  item =>
                    html`
                      <td
                        class=${item.className}
                        data-timestamp=${item.timestamp}
                      >
                        ${item.dayInMonth}
                      </td>
                    `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
});
