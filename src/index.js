import { Calendar } from './calendar';

const calendar = new Calendar(document.getElementById('calendar-wrapper'), {
  language: 'en',
  showToday: true,
  showJumpButtons: true,
  date: new Date(),
  type: 'month',
});

console.log(calendar);
