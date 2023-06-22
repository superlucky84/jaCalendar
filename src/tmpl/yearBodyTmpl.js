import { dateUtil } from '@/helper/dateUtil';
import { h, mount } from 'lithent';
import htm from 'htm';

import {
  CLASS_NAME_YEAR_GROUP,
  CLASS_NAME_YEAR,
  CLASS_NAME_BODY_INNER,
} from '@/constants';

const html = htm.bind(h);

export const BodyTmpl = mount(() => {
  return ({ yearGroups }) =>
    html`
      <table class=${CLASS_NAME_BODY_INNER}>
        <caption>
          <span>Years</span>
        </caption>
        <tbody>
          ${yearGroups.map(
            years =>
              html`
                <tr class=${CLASS_NAME_YEAR_GROUP}>
                  ${years.map(
                    year =>
                      html`
                        <td
                          class=${CLASS_NAME_YEAR}
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
