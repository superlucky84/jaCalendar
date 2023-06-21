import { Calendar } from './calendar';

const calendar = new Calendar(document.getElementById('calendar-wrapper'), {
  language: 'ko',
  showToday: true,
  showJumpButtons: true,
  date: new Date(),
  type: 'date',
});

console.log(calendar);
