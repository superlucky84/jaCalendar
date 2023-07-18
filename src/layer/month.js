import { LayerBase } from '@/layer/base';
import { TYPE_MONTH } from '@/constants';
import { BodyTmpl } from '@/tmpl/monthBodyTmpl';

/**
 * @class
 * @extends LayerBase
 * @param {string} language - Initial language
 * @ignore
 */
export class MonthLayer extends LayerBase {
  constructor(tmpl, customOptions, language) {
    super(language);

    /**
     * Layer type
     * @type {string}
     * @private
     */
    this._type = TYPE_MONTH;
    this._tmpl = tmpl || BodyTmpl;
    this._customOptions = customOptions;
  }

  /**
   * @override
   * @returns {object} Template context
   * @private
   */
  makeContext(date) {
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
      customOptions: this._customOptions,
    };
  }
}
