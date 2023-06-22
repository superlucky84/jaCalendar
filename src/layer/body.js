import { TYPE_DATE, TYPE_MONTH, TYPE_YEAR } from '@/constants';

import { DateLayer } from '@/layer/date';
import { MonthLayer } from '@/layer/month';
import { YearLayer } from '@/layer/year';

/**
 * @ignore
 * @class
 */
export class Body {
  constructor(bodyContainer, options) {
    var language = options.language;
    var weekStartDay = options.weekStartDay;

    /**
     * Body container element
     * @type {HTMLElement}
     * @private
     */
    this._container = bodyContainer;

    /**
     * DateLayer
     * @type {DateLayer}
     * @private
     */
    this._dateLayer = new DateLayer(language, weekStartDay);

    /**
     * MonthLayer
     * @type {MonthLayer}
     * @private
     */
    this._monthLayer = new MonthLayer(language);

    /**
     * YearLayer
     * @type {YearLayer}
     * @private
     */
    this._yearLayer = new YearLayer(language);

    /**
     * Current Layer
     * @type {DateLayer|MonthLayer|YearLayer}
     * @private
     */
    this._currentLayer = this._dateLayer;
  }
  _getLayer(type) {
    switch (type) {
      case TYPE_DATE:
        return this._dateLayer;
      case TYPE_MONTH:
        return this._monthLayer;
      case TYPE_YEAR:
        return this._yearLayer;
      default:
        return this._currentLayer;
    }
  }

  /**
   * Iterate each layer
   * @param {Function} fn - function
   * @private
   */
  _eachLayer(fn) {
    [this._dateLayer, this._monthLayer, this._yearLayer].forEach(fn);
  }

  /**
   * Change language
   * @param {string} language - Language
   */
  changeLanguage(language) {
    this._eachLayer(function (layer) {
      layer.changeLanguage(language);
    });
  }

  /**
   * Render body
   * @param {Date} date - date
   * @param {string} type - Layer type
   */
  render(date, type) {
    var nextLayer = this._getLayer(type);
    var prevLayer = this._currentLayer;

    prevLayer.remove();
    nextLayer.render(date, this._container);

    this._currentLayer = nextLayer;
  }

  /**
   * Returns date elements
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    return this._currentLayer.getDateElements();
  }

  /**
   * Destory
   */
  destroy() {
    this._eachLayer(function (layer) {
      layer.remove();
    });

    this._container = null;
    this._currentLayer = null;
    this._dateLayer = null;
    this._monthLayer = null;
    this._yearLayer = null;
  }
}
