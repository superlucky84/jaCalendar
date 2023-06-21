import { Calendar } from './calendar';

const calendar = new Calendar(document.getElementById('calendar-wrapper'), {
  language: 'en',
  showToday: true,
  showJumpButtons: false,
  date: new Date(),
  type: 'date',
});

console.log(calendar);
