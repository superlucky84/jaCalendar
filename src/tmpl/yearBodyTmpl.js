import { dateUtil } from '@/dateUtil';
import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const BodyTmpl = mount(() => {
  return ({ yearGroups }) =>
    html`
      <table class="tui-calendar-body-inner">
        <caption>
          <span>Years</span>
        </caption>
        <tbody>
          ${yearGroups.map(
            years =>
              html`
                <tr class="tui-calendar-year-group">
                  ${years.map(
                    year =>
                      html`
                        <td
                          class="tui-calendar-year"
                          data-timestamp=${dateUtil.getFirstDayTimestamp(
                            year,
                            0
                          )}
                        >
                          ${year}
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
