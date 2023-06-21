const isExisty = target => target !== null && target !== undefined;
const isString = target => typeof target === 'string';
const isObject = target =>
  typeof target === 'object' || typeof target === 'function';
const isArray = target => Array.isArray(target);
const isFunction = target => typeof target === 'function';

export class CustomEvents {
  constructor() {
    this.events = null;
    this.contexts = null;
  }

  _getHandlerItem(handler, context) {
    const item = { handler };

    if (context) {
      item.context = context;
    }

    return item;
  }

  _safeEvent(eventName) {
    var events = this.events;
    var byName;

    if (!events) {
      events = this.events = {};
    }

    if (eventName) {
      byName = events[eventName];

      if (!byName) {
        byName = [];
        events[eventName] = byName;
      }

      events = byName;
    }

    return events;
  }

  _safeContext() {
    var context = this.contexts;

    if (!context) {
      context = this.contexts = [];
    }

    return context;
  }

  _indexOfContext(ctx) {
    var context = this._safeContext();
    var index = 0;

    while (context[index]) {
      if (ctx === context[index][0]) {
        return index;
      }

      index += 1;
    }

    return -1;
  }

  _memorizeContext(ctx) {
    var context, index;

    if (!isExisty(ctx)) {
      return;
    }

    context = this._safeContext();
    index = this._indexOfContext(ctx);

    if (index > -1) {
      context[index][1] += 1;
    } else {
      context.push([ctx, 1]);
    }
  }

  _forgetContext(ctx) {
    var context, contextIndex;

    if (!isExisty(ctx)) {
      return;
    }

    context = this._safeContext();
    contextIndex = this._indexOfContext(ctx);

    if (contextIndex > -1) {
      context[contextIndex][1] -= 1;

      if (context[contextIndex][1] <= 0) {
        context.splice(contextIndex, 1);
      }
    }
  }

  _bindEvent(eventName, handler, context) {
    var events = this._safeEvent(eventName);
    this._memorizeContext(context);
    events.push(this._getHandlerItem(handler, context));
  }

  on(eventName, handler, context) {
    var self = this;

    if (isString(eventName)) {
      eventName = eventName.split(/\s+/g);
      forEach(eventName, function (name) {
        self._bindEvent(name, handler, context);
      });
    } else if (isObject(eventName)) {
      // [syntax 3, 4]
      context = handler;
      forEach(eventName, function (func, name) {
        self.on(name, func, context);
      });
    }
  }

  once(eventName, handler, context) {
    var self = this;

    if (isObject(eventName)) {
      context = handler;
      forEach(eventName, function (func, name) {
        self.once(name, func, context);
      });

      return;
    }

    function onceHandler() {
      // eslint-disable-line require-jsdoc
      handler.apply(context, arguments);
      self.off(eventName, onceHandler, context);
    }

    this.on(eventName, onceHandler, context);
  }

  _spliceMatches(arr, predicate) {
    var i = 0;
    var len;

    if (!isArray(arr)) {
      return;
    }

    for (len = arr.length; i < len; i += 1) {
      if (predicate(arr[i]) === true) {
        arr.splice(i, 1);
        len -= 1;
        i -= 1;
      }
    }
  }

  /**
   * Get matcher for unbind specific handler events
   * @param {function} handler - handler function
   * @returns {function} handler matcher
   * @private
   */
  _matchHandler(handler) {
    var self = this;

    return function (item) {
      var needRemove = handler === item.handler;

      if (needRemove) {
        self._forgetContext(item.context);
      }

      return needRemove;
    };
  }

  /**
   * Get matcher for unbind specific context events
   * @param {object} context - context
   * @returns {function} object matcher
   * @private
   */
  _matchContext(context) {
    var self = this;

    return function (item) {
      var needRemove = context === item.context;

      if (needRemove) {
        self._forgetContext(item.context);
      }

      return needRemove;
    };
  }

  /**
   * Get matcher for unbind specific hander, context pair events
   * @param {function} handler - handler function
   * @param {object} context - context
   * @returns {function} handler, context matcher
   * @private
   */
  _matchHandlerAndContext(handler, context) {
    var self = this;

    return function (item) {
      var matchHandler = handler === item.handler;
      var matchContext = context === item.context;
      var needRemove = matchHandler && matchContext;

      if (needRemove) {
        self._forgetContext(item.context);
      }

      return needRemove;
    };
  }

  /**
   * Unbind event by event name
   * @param {string} eventName - custom event name to unbind
   * @param {function} [handler] - handler function
   * @private
   */
  _offByEventName(eventName, handler) {
    var self = this;
    var andByHandler = isFunction(handler);
    var matchHandler = self._matchHandler(handler);

    eventName = eventName.split(R_EVENTNAME_SPLIT);

    forEach(eventName, function (name) {
      var handlerItems = self._safeEvent(name);

      if (andByHandler) {
        self._spliceMatches(handlerItems, matchHandler);
      } else {
        forEach(handlerItems, function (item) {
          self._forgetContext(item.context);
        });

        self.events[name] = [];
      }
    });
  }

  /**
   * Unbind event by handler function
   * @param {function} handler - handler function
   * @private
   */
  _offByHandler(handler) {
    var self = this;
    var matchHandler = this._matchHandler(handler);

    forEach(this._safeEvent(), function (handlerItems) {
      self._spliceMatches(handlerItems, matchHandler);
    });
  }

  /**
   * Unbind event by object(name: handler pair object or context object)
   * @param {object} obj - context or {name: handler} pair object
   * @param {function} handler - handler function
   * @private
   */
  _offByObject(obj, handler) {
    var self = this;
    var matchFunc;

    if (this._indexOfContext(obj) < 0) {
      forEach(obj, function (func, name) {
        self.off(name, func);
      });
    } else if (isString(handler)) {
      matchFunc = this._matchContext(obj);

      self._spliceMatches(this._safeEvent(handler), matchFunc);
    } else if (isFunction(handler)) {
      matchFunc = this._matchHandlerAndContext(handler, obj);

      forEach(this._safeEvent(), function (handlerItems) {
        self._spliceMatches(handlerItems, matchFunc);
      });
    } else {
      matchFunc = this._matchContext(obj);

      forEach(this._safeEvent(), function (handlerItems) {
        self._spliceMatches(handlerItems, matchFunc);
      });
    }
  }
  off(eventName, handler) {
    if (isString(eventName)) {
      // [syntax 1, 2]
      this._offByEventName(eventName, handler);
    } else if (!arguments.length) {
      // [syntax 8]
      this.events = {};
      this.contexts = [];
    } else if (isFunction(eventName)) {
      // [syntax 3]
      this._offByHandler(eventName);
    } else if (isObject(eventName)) {
      // [syntax 4, 5, 6]
      this._offByObject(eventName, handler);
    }
  }

  fire() {
    this.invoke.apply(this, arguments);
  }

  invoke(eventName) {
    var events, args, index, item;

    if (!this.hasListener(eventName)) {
      return true;
    }

    events = this._safeEvent(eventName);
    args = Array.prototype.slice.call(arguments, 1);
    index = 0;

    while (events[index]) {
      item = events[index];

      if (item.handler.apply(item.context, args) === false) {
        return false;
      }

      index += 1;
    }

    return true;
  }

  hasListener(eventName) {
    return this.getListenerLength(eventName) > 0;
  }

  getListenerLength(eventName) {
    var events = this._safeEvent(eventName);

    return events.length;
  }
}
