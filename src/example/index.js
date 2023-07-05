import { DateIndicator } from '@/dateIndicator';

const ins = new DateIndicator({
  container: document.getElementById('calendar-wrapper'),
  type: 'week',
  selectedList: {
    1687418469215: ['classA', 'classB', 'classC'],
    1687579980000: ['classA', 'classB'],
  },
});

console.log(ins);
