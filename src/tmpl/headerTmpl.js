import { h, mount, Fragment } from 'lithent';
import htm from 'htm';
const html = htm.bind(h);

export const HeaderTmpl = mount(
  (
    renew,
    {
      updater,
      customTmpl,
      events,
      showJumpButtons,
      isDateCalendar,
      isWeekCalendar,
      titleClass,
      title,
      type,
    }
  ) => {
    if (updater) {
      updater.value = context => {
        showJumpButtons = context.showJumpButtons;
        isDateCalendar = context.isDateCalendar;
        isWeekCalendar = context.isWeekCalendar;
        titleClass = context.titleClass;
        title = context.title;
        type = context.type;
        renew();
      };
    }

    return () => html`
      <>
        <${customTmpl}
          events=${events}
          showJumpButtons=${showJumpButtons}
          isDateCalendar=${isDateCalendar}
          isWeekCalendar=${isWeekCalendar}
          titleClass=${titleClass}
          title=${title}
          type=${type}
        />
      </>
    `;

    /*
    return () => html`
      <div>
        ${!isWeekCalendar &&
        html`<button onClick=${events.drawPrevYear}>Prev year</button>`}
        ${isDateCalendar &&
        html`<button onClick=${events.drawPrevMonth}>Prev month</button>`}
        ${isWeekCalendar &&
        html`<button onClick=${events.drawPrevWeek}>Prev week</button>`}
        <em>${title}</em>
        ${isWeekCalendar &&
        html`<button onClick=${events.drawNextWeek}>Next week</button>`}
        ${isDateCalendar &&
        html`<button onClick=${events.drawNextMonth}>Next month</button>`}
        ${!isWeekCalendar &&
        html`<button onClick=${events.drawNextYear}>Next year</button>`}
      </div>
    `;
    */
  }
);
