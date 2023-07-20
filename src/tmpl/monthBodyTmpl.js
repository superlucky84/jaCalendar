import { dateUtil } from '@/helper/dateUtil';
import { mount } from 'lithent';
import { lTag as html } from 'lithent/tag';

export const BodyTmpl = mount(() => {
  return ({
    year,
    Jan,
    Feb,
    Mar,
    Apr,
    May,
    Jun,
    Jul,
    Aug,
    Sep,
    Oct,
    Nov,
    Dec,
  }) =>
    html`
      <table>
        <caption>
          <span>Months</span>
        </caption>
        <tbody>
          <tr>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 0)}>
              ${Jan}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 1)}>
              ${Feb}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 2)}>
              ${Mar}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 3)}>
              ${Apr}
            </td>
          </tr>
          <tr>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 4)}>
              ${May}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 5)}>
              ${Jun}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 6)}>
              ${Jul}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 7)}>
              ${Aug}
            </td>
          </tr>
          <tr>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 8)}>
              ${Sep}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 9)}>
              ${Oct}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 10)}>
              ${Nov}
            </td>
            <td data-timestamp=${dateUtil.getFirstDayTimestamp(year, 11)}>
              ${Dec}
            </td>
          </tr>
        </tbody>
      </table>
    `;
});
