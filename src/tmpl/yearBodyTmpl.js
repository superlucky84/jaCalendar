import { dateUtil } from '@/helper/dateUtil';
import { mount } from 'lithent';
import { lTag as html } from 'lithent/tag';

export const BodyTmpl = mount(() => {
  return ({ yearGroups }) =>
    html`
      <table>
        <caption>
          <span>Years</span>
        </caption>
        <tbody>
          ${yearGroups.map(
            years =>
              html`
                <tr>
                  ${years.map(
                    year =>
                      html`
                        <td
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
