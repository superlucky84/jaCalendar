import { h, render as lithentRender } from 'lithent';
import htm from 'htm';
import { TYPE_YEAR } from '@/constants';
import { dateUtil } from '@/helper/dateUtil';
import { BodyTmpl } from '@/tmpl/yearBodyTmpl';
import { LayerBase } from '@/layer/base';

const html = htm.bind(h);

/**
 * @class
 * @extends LayerBase
 * @param {string} language - Initial language
 * @ignore
 */
export class YearLayer extends LayerBase {
  constructor(tmpl, customOptions, language) {
    super(language);

    /**
     * Layer type
     * @type {string}
     * @private
     */
    this._type = TYPE_YEAR;
    this._tmpl = tmpl || BodyTmpl;
    this._customOptions = customOptions;
  }
  /**
   * @override
   * @returns {object} Template context
   * @private
   */
  _makeContext(date) {
    var year = date.getFullYear();

    return {
      yearGroups: [
        dateUtil.getRangeArr(year - 4, year - 2),
        dateUtil.getRangeArr(year - 1, year + 1),
        dateUtil.getRangeArr(year + 2, year + 4),
      ],
      getFirstDayTimestamp: dateUtil.getFirstDayTimestamp,
      customOptions: this._customOptions,
    };
  }

  /**
   * Render year-layer element
   * @override
   * @param {Date} date Date to render
   * @param {HTMLElement} container A container element for the rendered element
   */
  render(date, container) {
    var context = this._makeContext(date);

    if (this.remove) {
      this.remove();
    }
    // container.innerHTML = bodyTmpl(context);
    this.remove = lithentRender(
      html`<${this._tmpl} ...${context} />`,
      container
    );

    this._element = container.firstChild;
  }

  /**
   * Returns year elements
   * @override
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    return this._element.querySelectorAll('[data-timestamp]');
  }
}
