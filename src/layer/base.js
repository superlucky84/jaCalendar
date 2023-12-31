import { localeTexts } from '@/locale/localeTexts';
import { DEFAULT_LANGUAGE_TYPE } from '@/constants';

/**
 * @abstract
 * @class
 * @ignore
 * @param {string} language - Initial language
 * Layer base
 */
export class LayerBase {
  constructor(language) {
    this.language = language || DEFAULT_LANGUAGE_TYPE;

    /**
     * Language type
     * @type {string}
     * @private
     */
    this._localeText = localeTexts[language];

    /**
     * Layer type
     * @type {string}
     * @private
     */
    this._type = 'base';
  }

  /**
   * Make context
   * @abstract
   * @throws {Error}
   * @returns {object}
   * @private
   */
  makeContext() {
    throwOverrideError(this.getType(), 'makeContext');
  }

  /**
   * Render the layer element
   * @abstract
   * @throws {Error}
   */
  render() {
    throwOverrideError(this.getType(), 'render');
  }

  /**
   * Returns layer type
   * @returns {string}
   */
  getType() {
    return this._type;
  }

  /**
   * Set language
   * @param {string} language - Language name
   */
  changeLanguage(language) {
    this._localeText = localeTexts[language];
  }

  /**
   * Remove elements
   */
  remove() {
    if (this._element) {
      this.remove();
    }
    this._element = null;
  }
}

/**
 * Throw - method override error
 * @ignore
 * @param {string} layerType - Layer type
 * @param {string} methodName - Method name
 * @throws {Error}
 */
function throwOverrideError(layerType, methodName) {
  throw new Error(
    layerType + ' layer does not have the "' + methodName + '" method.'
  );
}
