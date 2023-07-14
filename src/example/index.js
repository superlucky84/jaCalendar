import { DateIndicator } from '@/dateIndicator';

const ins = new DateIndicator({
  container: document.getElementById('calendar-wrapper'),
  language: 'ko',
  type: 'week',
  date: new Date(),
  weekStartDay: 'sun',
  weekStartStandardDay: 'thu',
  showJumpButtons: true,
  customOptions: {
    1689300057808: ['classA', 'classB', 'classC'],
    1689131591000: ['classA', 'classB'],
  },
});

console.log('window.ins', ins);
window.ins = ins;
