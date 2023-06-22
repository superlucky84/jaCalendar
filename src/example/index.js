import { Calendar } from '@/calendar';

const calendar = new Calendar(document.getElementById('calendar-wrapper'), {
  language: 'ko',
  showToday: true,
  showJumpButtons: true,
  weekStartDay: 'Mon',
  date: new Date(),
  type: 'date',
});

calendar.on('draw', event => {
  console.log(event);

  /*
  for (let i = 0, len = event.dateElements.length; i < len; i += 1) {
    const el = event.dateElements[i];
    const date = new Date(Number(el.dataset.timestamp));
    console.log(date);
  }
  */
});
