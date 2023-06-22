import { h, render as lithentRender } from 'lithent';
import htm from 'htm';
import { LayerBase } from '@/layer/base';
import { TYPE_MONTH } from '@/constants';
import { BodyTmpl } from '@/tmpl/monthBodyTmpl';

const html = htm.bind(h);

const DATE_SELECTOR = '.tui-calendar-month';

/**
 * @class
 * @extends LayerBase
 * @param {string} language - Initial language
 * @ignore
 */
export class MonthLayer extends LayerBase {
  constructor(language) {
    super(language);

    /**
     * Layer type
     * @type {string}
     * @private
     */
    this._type = TYPE_MONTH;
    this.removeTmpl = null;
  }

  /**
   * @override
   * @returns {object} Template context
   * @private
   */
  _makeContext(date) {
    const monthsShort = this._localeText.titles.MMM;

    return {
      year: date.getFullYear(),
      Jan: monthsShort[0],
      Feb: monthsShort[1],
      Mar: monthsShort[2],
      Apr: monthsShort[3],
      May: monthsShort[4],
      Jun: monthsShort[5],
      Jul: monthsShort[6],
      Aug: monthsShort[7],
      Sep: monthsShort[8],
      Oct: monthsShort[9],
      Nov: monthsShort[10],
      Dec: monthsShort[11],
    };
  }

  /**
   * Render month-layer element
   * @override
   * @param {Date} date Date to render
   * @param {HTMLElement} container A container element for the rendered element
   */
  render(date, container) {
    var context = this._makeContext(date);

    if (this.removeTmpl) {
      this.removeTmpl();
    }

    console.log('aa', container);
    this.removeTmpl = lithentRender(
      html`<${BodyTmpl} ...${context} />`,
      container
    );
    this._element = container.firstChild;
  }

  /**
   * Returns month elements
   * @override
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    // return this._element.querySelectorAll(DATE_SELECTOR);
  }
}
