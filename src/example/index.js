import { DateIndicator } from '@/dateIndicator';

const ins = new DateIndicator({
  container: document.getElementById('calendar-wrapper'),
  language: 'ko',
  type: 'week',
  date: new Date(),
  weekStartDay: 'sun',
  weekStartStandardDay: 'thu',
  showToday: true,
  showJumpButtons: true,
  selectedList: {
    1687418469215: ['classA', 'classB', 'classC'],
    1687579980000: ['classA', 'classB'],
  },
});

console.log(ins);
