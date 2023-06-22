import { dateUtil } from '@/helper/dateUtil';
import { h, mount } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

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
      <table class="ja-calendar-body-inner">
        <caption>
          <span>Months</span>
        </caption>
        <tbody>
          <tr class="ja-calendar-month-group">
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 0)}
            >
              ${Jan}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 1)}
            >
              ${Feb}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 2)}
            >
              ${Mar}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 3)}
            >
              ${Apr}
            </td>
          </tr>
          <tr class="ja-calendar-month-group">
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 4)}
            >
              ${May}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 5)}
            >
              ${Jun}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 6)}
            >
              ${Jul}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 7)}
            >
              ${Aug}
            </td>
          </tr>
          <tr class="ja-calendar-month-group">
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 8)}
            >
              ${Sep}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 9)}
            >
              ${Oct}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 10)}
            >
              ${Nov}
            </td>
            <td
              class="ja-calendar-month"
              data-timestamp=${dateUtil.getFirstDayTimestamp(year, 11)}
            >
              ${Dec}
            </td>
          </tr>
        </tbody>
      </table>
    `;
});
