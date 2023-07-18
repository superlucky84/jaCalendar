import { h, render as lithentRender, ref } from 'lithent';
import htm from 'htm';
import { TYPE_DATE_WEEK, TYPE_DATE, TYPE_MONTH, TYPE_YEAR } from '@/constants';

import { BodyTmpl } from '@/tmpl/mainBodyTmpl';
import { DateLayer } from '@/layer/date';
import { WeekLayer } from '@/layer/week';
import { MonthLayer } from '@/layer/month';
import { YearLayer } from '@/layer/year';

const html = htm.bind(h);

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
    this._weekLayer = new WeekLayer(
      options.bodyWeekTmpl,
      options.customOptions,
      language,
      weekStartDay
    );

    /**
     * DateLayer
     * @type {DateLayer}
     * @private
     */
    this._dateLayer = new DateLayer(
      options.bodyDateTmpl,
      options.customOptions,
      language,
      weekStartDay
    );

    /**
     * MonthLayer
     * @type {MonthLayer}
     * @private
     */
    this._monthLayer = new MonthLayer(
      options.bodyMonthTmpl,
      options.customOptions,
      language
    );

    /**
     * YearLayer
     * @type {YearLayer}
     * @private
     */
    this._yearLayer = new YearLayer(
      options.bodyYearTmpl,
      options.customOptions,
      language
    );

    /**
     * Current Layer
     * @type {DateLayer|MonthLayer|YearLayer}
     * @private
     */
    this._currentLayer = this._dateLayer;
  }
  _getLayer(type) {
    switch (type) {
      case TYPE_DATE_WEEK:
        return this._weekLayer;
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
    const layer = this._getLayer(type);
    const Tmpl = layer._tmpl;
    const context = Object.assign(layer._makeContext(date), { Tmpl });

    if (this.updater) {
      this.updater.value(context);
    } else {
      this.updater = ref();
      this.remove = lithentRender(
        html`<${BodyTmpl} ...${context} updater=${this.updater} />`,
        this._container
      );
    }
  }

  /**
   * Returns date elements
   * @returns {HTMLElement[]}
   */
  getDateElements() {
    // this._currentLayer.getDateElements();
    return [];
  }

  /**
   * Destory
   */
  destroy() {
    this.remove();

    this._container = null;
    this._currentLayer = null;
    this._dateLayer = null;
    this._monthLayer = null;
    this._yearLayer = null;
  }
}
