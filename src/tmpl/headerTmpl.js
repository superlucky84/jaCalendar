import { h, mount } from 'lithent';
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
  CLASS_NAME_NEXT_WEEK_BTN,
  CLASS_NAME_PREV_WEEK_BTN,
} from '@/constants';
const html = htm.bind(h);

export const HeaderTmpl = mount(
  (_r, { showJumpButtons, isDateCalendar, isWeekCalendar }) => {
    let Component;
    if (isWeekCalendar) {
      Component = PrevNextWeekButtons;
    } else if (isDateCalendar) {
      if (showJumpButtons) {
        Component = PrevNextWithJumpButtons;
      } else {
        Component = PrevNextMonthButtons;
      }
    } else {
      Component = YearButtons;
    }

    return ({ title, titleClass }) =>
      html`<${Component} title=${title} titleClass=${titleClass} />`;
  }
);

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

const PrevNextMonthButtons = mount(() => {
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

const PrevNextWeekButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class=${CLASS_NAME_HEADER_INNER}>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_PREV_WEEK_BTN}">
          Prev week
        </button>
        <em class="${CLASS_NAME_TITLE} ${titleClass}">${title}</em>
        <button class="${CLASS_NAME_BTN} ${CLASS_NAME_NEXT_WEEK_BTN}">
          Next week
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
