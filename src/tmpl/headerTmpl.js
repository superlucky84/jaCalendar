import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
import {
  CLASS_NAME_HEADER_INNER,
  CLASS_NAME_HAS_BTNS,
  CLASS_NAME_BTN,
  CLASS_NAME_TITLE,
  CLASS_NAME_NEXT_YEAR_BTN,
  CLASS_NAME_PREV_YEAR_BTN,
  CLASS_NAME_PREV_MONTH_BTN,
  CLASS_NAME_NEXT_MONTH_BTN,
  CLASS_NAME_HEADER_INFO,
  CLASS_NAME_TITLE_TODAY,
} from '@/constants';
const html = htm.bind(h);

export const HeaderTmpl = mount((_r, { showJumpButtons, isDateCalendar }) => {
  let Component;
  if (isDateCalendar) {
    if (showJumpButtons) {
      Component = PrevNextWithJumpButtons;
    } else {
      Component = PrevNextButtons;
    }
  } else {
    Component = YearButtons;
  }

  return ({ title, titleClass, showToday, todayText }) =>
    html`
      <${Fragment}>
        <${Component} title=${title} titleClass=${titleClass} />
        ${showToday && html`<${TodayButton} todayText=${todayText} />`}
      <//>
    `;
});

const PrevNextWithJumpButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class="${CLASS_NAME_HEADER_INNER} ${CLASS_NAME_HAS_BTNS}">
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_PREV_YEAR_BTN}">
          Prev year
        </button>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_PREV_MONTH_BTN}">
          Prev month</button
        ><em class="${CLASS_NAME_TITLE} ${titleClass}">${title}</em>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_NEXT_MONTH_BTN}">
          Next month
        </button>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_NEXT_YEAR_BTN}">
          Next year
        </button>
      </div>
    `;
});

const PrevNextButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class=${CLASS_NAME_HEADER_INNER}>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_PREV_MONTH_BTN}">
          Prev month
        </button>
        <em class="${CLASS_NAME_TITLE} ${titleClass}">${title}</em>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_NEXT_MONTH_BTN}">
          Next month
        </button>
      </div>
    `;
});

const YearButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class=${CLASS_NAME_HEADER_INNER}>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_PREV_YEAR_BTN}">
          Prev year
        </button>
        <em class="${CLASS_NAME_TITLE} ${titleClass}">${title}</em>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_NEXT_YEAR_BTN}">
          Next year
        </button>
      </div>
    `;
});

const TodayButton = mount(() => {
  return ({ todayText }) =>
    html`
      <div class=${CLASS_NAME_HEADER_INFO}>
        <p class=${CLASS_NAME_TITLE_TODAY}>${todayText}</p>
      </div>
    `;
});
