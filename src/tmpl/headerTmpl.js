import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
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
      <div class="tui-calendar-header-inner tui-calendar-has-btns">
        <button class="tui-calendar-btn tui-calendar-btn-prev-year">
          Prev year
        </button>
        <button class="tui-calendar-btn tui-calendar-btn-prev-month">
          Prev month</button
        ><em class="tui-calendar-title ${titleClass}">${title}</em>
        <button class="tui-calendar-btn tui-calendar-btn-next-month">
          Next month
        </button>
        <button class="tui-calendar-btn tui-calendar-btn-next-year">
          Next year
        </button>
      </div>
    `;
});

const PrevNextButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class="tui-calendar-header-inner">
        <button class="tui-calendar-btn tui-calendar-btn-prev-month">
          Prev month
        </button>
        <em class="tui-calendar-title ${titleClass}">${title}</em>' +
        <button class="tui-calendar-btn tui-calendar-btn-next-month">
          Next month
        </button>
      </div>
    `;
});

const YearButtons = mount(() => {
  return ({ title, titleClass }) =>
    html`
      <div class="tui-calendar-header-inner">
        <button class="tui-calendar-btn tui-calendar-btn-prev-year">
          Prev year
        </button>
        <em class="tui-calendar-title ${titleClass}">${title}</em>
        <button class="tui-calendar-btn tui-calendar-btn-next-year">
          Next year
        </button>
      </div>
    `;
});

const TodayButton = mount(() => {
  return ({ todayText }) =>
    html`
      <div class="tui-calendar-header-info">
        <p class="tui-calendar-title-today">${todayText}</p>
      </div>
    `;
});
