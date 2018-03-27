(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Uno"] = factory();
	else
		root["Uno"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Enum = __webpack_require__(3);

module.exports = new Enum({
  // numbers
  'ZERO': 0,
  'ONE': 1,
  'TWO': 2,
  'THREE': 3,
  'FOUR': 4,
  'FIVE': 5,
  'SIX': 6,
  'SEVEN': 7,
  'EIGHT': 8,
  'NINE': 9,
  // special cards
  'DRAW_TWO': 10,
  'REVERSE': 11,
  'SKIP': 12,
  'WILD': 13,
  'WILD_DRAW_FOUR': 14
}, 'Values');

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Shuffle = __webpack_require__(6);
var Values = __webpack_require__(0);
var Colors = __webpack_require__(2);

function card(value, color) {
  if (!value.is || color && !color.is) throw new Error("The parameter must be an enum.");

  color = color || null;

  var instance = Object.create({}, {
    value: {
      value: value
    },
    color: {
      get: function get(_) {
        return color;
      },
      set: function set(newColor) {
        if (!instance.isWildCard()) throw new Error("Only wild cards can have theirs colors changed.");else if (!newColor.is) throw new Error("The color must be a value from Colors enum.");
        color = newColor;
      }
    },
    isWildCard: {
      value: function isWildCard() {
        return instance.value.is(Values.WILD) || instance.value.is(Values.WILD_DRAW_FOUR);
      }
    },
    isSpecialCard: {
      value: function isSpecialCard() {
        return instance.isWildCard() || instance.value.is(Values.DRAW_TWO) || instance.value.is(Values.REVERSE) || instance.value.is(Values.SKIP);
      }
    },
    matches: {
      value: function matches(otherCard) {
        if (instance.isWildCard()) return true;else if (instance.color == null || otherCard.color == null) throw new Error("Both cards must have theirs colors set before comparing");

        return otherCard.value == instance.value || otherCard.color == instance.color;
      }
    },
    score: {
      get: function score() {
        switch (instance.value) {
          case Values.DRAW_TWO:
          case Values.SKIP:
          case Values.REVERSE:
            return 20;
          case Values.WILD:
          case Values.WILD_DRAW_FOUR:
            return 50;
          default:
            return value.value;
        }
      }
    }
  });

  if (!instance.isWildCard(instance) && !instance.color) {
    throw Error("Only wild cards can be initialized with no color");
  }

  instance.toString = function (_) {
    return (instance.color || 'NO_COLOR') + ' ' + instance.value;
  };

  return instance;
}

module.exports = card;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Enum = __webpack_require__(3);

module.exports = new Enum({
    'RED': 1,
    'BLUE': 2,
    'GREEN': 3,
    'YELLOW': 4
}, 'Colors');

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(12);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Shuffle = __webpack_require__(6);
var Values = __webpack_require__(0);
var Colors = __webpack_require__(2);
var card = __webpack_require__(1);

function createUnoDeck() {
  /*
    108 cards
     76x numbers (0-9, all colors)
    8x draw two (2x each color)
    8x reverse (2x each color)
    8x skip (2x each color)
    4x wild
    4x wild draw four
  */

  var deck = [];

  var createCards = function createCards(qty, value, color) {
    var cards = [];

    for (var i = 0; i < qty; i++) {
      cards.push(card(value, color));
    }return cards;
  };

  // for each color...
  for (var i = 1; i <= Colors.size; i++) {
    var color = Colors.get(i);

    // CREATE NUMBERS
    deck.push.apply(deck, createCards(1, Values.ZERO, color));
    for (var n = Values.ONE.value; n <= Values.NINE.value; n++) {
      deck.push.apply(deck, createCards(2, Values.get(n), color));
    }

    deck.push.apply(deck, createCards(2, Values.DRAW_TWO, color));
    deck.push.apply(deck, createCards(2, Values.SKIP, color));
    deck.push.apply(deck, createCards(2, Values.REVERSE, color));
  }

  deck.push.apply(deck, createCards(4, Values.WILD));
  deck.push.apply(deck, createCards(4, Values.WILD_DRAW_FOUR));

  return deck;
}

var deck = function deck() {
  var instance = Shuffle.shuffle({ deck: createUnoDeck() });

  var originalDraw = instance.draw;

  instance.draw = function (num) {
    var cards = [];

    // if the amount to draw is more than the cards we have...
    if (num >= instance.length) {
      var length = instance.length;

      // draw all we have...
      cards = cards.concat(originalDraw.call(instance, length));

      // regenerate the draw pile
      instance.reset();
      instance.shuffle();

      // then draw the rest we need
      num = num - length;
      if (num == 0) return cards;
    }

    return cards.concat(originalDraw.call(instance, num));
  };

  return instance;
};

module.exports = deck;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.__esModule = true;
var isType = function isType(type, value) {
  return (typeof value === "undefined" ? "undefined" : _typeof(value)) === type;
};
exports.isType = isType;
var isObject = function isObject(value) {
  return isType("object", value);
};
exports.isObject = isObject;
var isString = function isString(value) {
  return isType("string", value);
};
exports.isString = isString;
var isNumber = function isNumber(value) {
  return isType("number", value);
};
exports.isNumber = isNumber;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(7);
var deck = __webpack_require__(19);
var playingCardDeck = __webpack_require__(21);
var shuffle = module.exports = {};
var defaultOptions = {
  deck: new playingCardDeck().cards,
  random: function random() {
    return Math.random();
  }
};

shuffle.playingCards = function () {
  return new playingCardDeck().cards;
};

shuffle.shuffle = function (options) {
  if (!options) options = defaultOptions;

  if (!options.deck) options.deck = defaultOptions.deck;
  if (!options.random) options.random = defaultOptions.random;

  return new deck(options.deck, options.random);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;
exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }
  return debugs[set];
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) &&
  // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect &&
  // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(23);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(22);

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(18)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var util = __webpack_require__(7);
var EventEmitter = __webpack_require__(15).EventEmitter;

var Deck = __webpack_require__(4);
var Card = __webpack_require__(1);
var Values = __webpack_require__(0);
var Player = __webpack_require__(24);
var GameDirections = __webpack_require__(10);

var CARDS_PER_PLAYER = 7;

var game = function game(playerNames) {
  // extends EventEmitter
  // events:
  // - start (players)
  // - cardplay (player, card)
  // - uno (player)
  // - end (winner)

  var drawPile = null;
  var direction = null;
  var currentPlayer = null;
  var players = [];
  var discardedCard = null;

  // control vars
  /**
   * The player have draw in his turn?
   */
  var drawn = false;
  /**
   * How many cards must be drawn in the next draw() call.
   * It's used when there's a row of DRAW_TWO running.
   */
  var cardsToDraw = 0;
  /**
   * Who yelled uno?
   *
   * key: player name
   * value: true/false
   */
  var yellers = {};

  var instance = Object.create(EventEmitter.prototype, {
    newGame: {
      value: function newGame() {
        drawPile = Deck();
        direction = GameDirections.CLOCKWISE;

        players.forEach(function (p) {
          return p.hand = drawPile.draw(CARDS_PER_PLAYER);
        });

        // do not start with special cards (REVERSE, DRAW, etc)
        do {
          discardedCard = drawPile.draw()[0];
        } while (discardedCard.isSpecialCard());

        // select starting player
        currentPlayer = players[getRandomInt(0, players.length - 1)];
      }
    },
    getPlayer: {
      value: function value(name) {
        var player = players[getPlayerIndex(name)];
        if (!player) return null;
        return player;
      }
    },
    currentPlayer: {
      get: function get() {
        return currentPlayer;
      },
      set: function set(name) {
        // if we received a player, extract the name from it
        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') name = name.name;

        if (!name) throw new Error("Player name is invalid");

        var player = instance.getPlayer(name);
        if (!player) throw new Error("The given player does not exist");
        currentPlayer = instance.getPlayer(name);
      }
    },
    nextPlayer: {
      get: function get() {
        return getNextPlayer();
      }
    },
    discardedCard: {
      get: function get() {
        return discardedCard;
      },
      set: function set(card) {
        if (!card) return;
        if (card.color == null) throw new Error("Discarded cards cannot have theirs colors as null");

        discardedCard = card;
      }
    },
    playingDirection: {
      get: function get() {
        return direction;
      },
      set: function set(dir) {
        if (dir != GameDirections.CLOCKWISE && dir != GameDirections.COUNTER_CLOCKWISE) throw new Error("Invalid direction");

        if (dir != direction) reverseGame();
      }
    },
    draw: {
      value: function value() {
        var currentPlayer = instance.currentPlayer;

        draw(currentPlayer, cardsToDraw || 1);

        drawn = true;
        // reset UNO! yell state
        yellers[currentPlayer.name] = false;

        if (cardsToDraw > 0) {
          cardsToDraw = 0;
          goToNextPlayer();
        }
      }
    },
    pass: {
      value: function pass() {
        if (cardsToDraw > 0) throw new Error('There are ' + cardsToDraw + ' cards to draw before passing');
        if (!drawn) throw new Error(currentPlayer + ' must draw at least one card before passing');

        goToNextPlayer();
      }
    },
    play: {
      value: function play(card) {
        var currentPlayer = instance.currentPlayer;
        if (!card) return;
        // check if player has the card at hand...
        if (!currentPlayer.hasCard(card)) throw new Error(currentPlayer + ' does not have card ' + card + ' at hand');
        if (card.color == null) throw new Error("Card must have its color set before playing");
        // check if there isn't any pendent draw amount...
        if (cardsToDraw > 0 && card.value != Values.DRAW_TWO) // TODO: can throw DRAW_TWO on WILD_DRAW_FOUR?
          throw new Error(currentPlayer + ' must draw cards');
        // check if the played card matches the card from the discard pile...
        if (!card.matches(discardedCard)) throw new Error(discardedCard + ', from discard pile, does not match ' + card);

        currentPlayer.removeCard(card);
        discardedCard = card;

        instance.emit('cardplay', null, card, currentPlayer);

        if (currentPlayer.hand.length == 0) {
          var score = calculateScore();
          // game is over, we have a winner!
          instance.emit('end', null, currentPlayer, score);
          // TODO: how to stop game after it's finished? Finished variable? >.<
          return;
        }

        switch (discardedCard.value) {
          case Values.WILD_DRAW_FOUR:
            cardsToDraw += 4;
            break;
          case Values.DRAW_TWO:
            cardsToDraw += 2;
            break;
          case Values.SKIP:
            goToNextPlayer(true);
            break;
          case Values.REVERSE:
            reverseGame();
            if (players.length == 2)
              // Reverse works like Skip
              goToNextPlayer();
            break;
        }

        goToNextPlayer();
      }
    },
    uno: {
      value: function uno(yellingPlayer) {
        yellingPlayer = yellingPlayer || instance.currentPlayer;

        // the users that will draw;
        var drawingPlayers = void 0;

        // if player is the one who has 1 card, just mark as yelled
        // (he may yell UNO! before throwing his card, so he may have
        // 2 cards at hand when yelling uno)
        if (yellingPlayer.hand.length <= 2 && !yellers[yellingPlayer.name]) {
          yellers[yellingPlayer.name] = true;
          return [];
        } else {
          // else if the user has already yelled or if he has more than 2 cards...

          // is there anyone with 1 card at hand that did not yell uno?
          drawingPlayers = players.filter(function (p) {
            return p.hand.length == 1 && !yellers[p.name];
          });

          // if there isn't anyone...
          if (drawingPlayers.length == 0) {
            // the player was lying, so he will draw
            drawingPlayers = [yellingPlayer];
          }
        }

        drawingPlayers.forEach(function (p) {
          return draw(p, 2);
        });

        // return who drawn
        return drawingPlayers;
      }
    }
  });

  function init() {
    players = fixPlayers(playerNames);
    instance.newGame();
  };

  function fixPlayers(playerNames) {
    if (!playerNames || !playerNames.length || playerNames.length < 2 || playerNames.length > 10) throw new Error("There must be 2 to 10 players in the game");else if (findDuplicates(playerNames).length) throw new Error("Player names must be different");

    return playerNames.map(function (player) {
      if (typeof player == 'string') player = Player(player);

      return player;
    });
  };

  function getNextPlayer() {
    var idx = getPlayerIndex(currentPlayer);

    if (++idx == players.length) idx = 0;

    return players[idx];
  }

  function getPlayerIndex(playerName) {
    if (typeof playerName != 'string') playerName = playerName.name;

    return players.map(function (p) {
      return p.name;
    }).indexOf(playerName);
  }

  /**
   * Set current player to the next in the line,
   * with no validations, reseting all per-turn controllers
   * (`draw`, `cardsToDraw`, ...)
   */
  function goToNextPlayer(silent) {
    drawn = false;

    currentPlayer = getNextPlayer();
    if (!silent) instance.emit('nextplayer', null, currentPlayer);
  }

  function reverseGame() {
    players.reverse();
    direction = direction == GameDirections.CLOCKWISE ? GameDirections.COUNTER_CLOCKWISE : GameDirections.CLOCKWISE;
  }

  function draw(player, amount) {
    if (!player) throw new Error('Player is mandatory');

    player.hand = player.hand.concat(drawPile.draw(amount));
  }

  function calculateScore() {
    return players.map(function (player) {
      return player.hand;
    }).reduce(function (amount, cards) {
      amount += cards.reduce(function (s, c) {
        return s += c.score;
      }, 0);
      return amount;
    }, 0);
  }

  init();

  return instance;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// http://stackoverflow.com/a/840812/1574059
function findDuplicates(array) {
  // expects an string array
  var uniq = array.map(function (name, idx) {
    return { count: 1, name: name };
  }).reduce(function (a, b) {
    a[b.name] = (a[b.name] || 0) + b.count;
    return a;
  }, {});

  var duplicates = Object.keys(uniq).filter(function (a) {
    return uniq[a] > 1;
  });

  return duplicates;
}

module.exports = game;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Enum = __webpack_require__(3);

module.exports = new Enum({
    'CLOCKWISE': 1,
    'COUNTER_CLOCKWISE': 2
}, 'GameDirections');

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  Game: __webpack_require__(9),
  Card: __webpack_require__(1),
  Values: __webpack_require__(0),
  Colors: __webpack_require__(2)
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _interopRequire = function _interopRequire(obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
};

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var os = _interopRequire(__webpack_require__(17));

var EnumItem = _interopRequire(__webpack_require__(13));

var _isType = __webpack_require__(5);

var isString = _isType.isString;
var isNumber = _isType.isNumber;

var indexOf = __webpack_require__(14).indexOf;

var isBuffer = _interopRequire(__webpack_require__(16));

var endianness = os.endianness();

/**
 * Represents an Enum with enum items.
 * @param {Array || Object}  map     This are the enum items.
 * @param {String || Object} options This are options. [optional]
 */

var Enum = function () {
  function Enum(map, options) {
    var _this = this;

    _classCallCheck(this, Enum);

    /* implement the "ref type interface", so that Enum types can
     * be used in `node-ffi` function declarations and invokations.
     * In C, these Enums act as `uint32_t` types.
     *
     * https://github.com/TooTallNate/ref#the-type-interface
     */
    this.size = 4;
    this.indirection = 1;

    if (options && isString(options)) {
      options = { name: options };
    }

    this._options = options || {};
    this._options.separator = this._options.separator || " | ";
    this._options.endianness = this._options.endianness || endianness;
    this._options.ignoreCase = this._options.ignoreCase || false;
    this._options.freez = this._options.freez || false;

    this.enums = [];

    if (map.length) {
      this._enumLastIndex = map.length;
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        map[array[i]] = Math.pow(2, i);
      }
    }

    for (var member in map) {
      guardReservedKeys(this._options.name, member);
      this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
      this.enums.push(this[member]);
    }
    this._enumMap = map;

    if (this._options.ignoreCase) {
      this.getLowerCaseEnums = function () {
        var res = {};
        for (var i = 0, len = this.enums.length; i < len; i++) {
          res[this.enums[i].key.toLowerCase()] = this.enums[i];
        }
        return res;
      };
    }

    if (this._options.name) {
      this.name = this._options.name;
    }

    var isFlaggable = function isFlaggable() {
      for (var i = 0, len = _this.enums.length; i < len; i++) {
        var e = _this.enums[i];

        if (!(e.value !== 0 && !(e.value & e.value - 1))) {
          return false;
        }
      }
      return true;
    };

    this.isFlaggable = isFlaggable();
    if (this._options.freez) {
      this.freezeEnums(); //this will make instances of Enum non-extensible
    }
  }

  /**
   * Returns the appropriate EnumItem key.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {String}                           The get result.
   */

  Enum.prototype.getKey = function getKey(value) {
    var item = this.get(value);
    if (item) {
      return item.key;
    }
  };

  /**
   * Returns the appropriate EnumItem value.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {Number}                           The get result.
   */

  Enum.prototype.getValue = function getValue(key) {
    var item = this.get(key);
    if (item) {
      return item.value;
    }
  };

  /**
   * Returns the appropriate EnumItem.
   * @param  {EnumItem || String || Number} key The object to get with.
   * @return {EnumItem}                         The get result.
   */

  Enum.prototype.get = function get(key, offset) {
    if (key === null || key === undefined) {
      return;
    } // Buffer instance support, part of the ref Type interface
    if (isBuffer(key)) {
      key = key["readUInt32" + this._options.endianness](offset || 0);
    }

    if (EnumItem.isEnumItem(key)) {
      var foundIndex = indexOf.call(this.enums, key);
      if (foundIndex >= 0) {
        return key;
      }
      if (!this.isFlaggable || this.isFlaggable && key.key.indexOf(this._options.separator) < 0) {
        return;
      }
      return this.get(key.key);
    } else if (isString(key)) {

      var enums = this;
      if (this._options.ignoreCase) {
        enums = this.getLowerCaseEnums();
        key = key.toLowerCase();
      }

      if (key.indexOf(this._options.separator) > 0) {
        var parts = key.split(this._options.separator);

        var value = 0;
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];

          value |= enums[part].value;
        }

        return new EnumItem(key, value);
      } else {
        return enums[key];
      }
    } else {
      for (var m in this) {
        if (this.hasOwnProperty(m)) {
          if (this[m].value === key) {
            return this[m];
          }
        }
      }

      var result = null;

      if (this.isFlaggable) {
        for (var n in this) {
          if (this.hasOwnProperty(n)) {
            if ((key & this[n].value) !== 0) {
              if (result) {
                result += this._options.separator;
              } else {
                result = "";
              }
              result += n;
            }
          }
        }
      }

      return this.get(result || null);
    }
  };

  /**
   * Sets the Enum "value" onto the give `buffer` at the specified `offset`.
   * Part of the ref "Type interface".
   *
   * @param  {Buffer} buffer The Buffer instance to write to.
   * @param  {Number} offset The offset in the buffer to write to. Default 0.
   * @param  {EnumItem || String || Number} value The EnumItem to write.
   */

  Enum.prototype.set = function set(buffer, offset, value) {
    var item = this.get(value);
    if (item) {
      return buffer["writeUInt32" + this._options.endianness](item.value, offset || 0);
    }
  };

  /**
   * Define freezeEnums() as a property of the prototype.
   * make enumerable items nonconfigurable and deep freeze the properties. Throw Error on property setter.
   */

  Enum.prototype.freezeEnums = function freezeEnums() {
    function envSupportsFreezing() {
      return Object.isFrozen && Object.isSealed && Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor && Object.defineProperties && Object.__defineGetter__ && Object.__defineSetter__;
    }

    function freezer(o) {
      var props = Object.getOwnPropertyNames(o);
      props.forEach(function (p) {
        if (!Object.getOwnPropertyDescriptor(o, p).configurable) {
          return;
        }

        Object.defineProperties(o, p, { writable: false, configurable: false });
      });
      return o;
    }

    function getPropertyValue(value) {
      return value;
    }

    function deepFreezeEnums(o) {
      if ((typeof o === "undefined" ? "undefined" : _typeof(o)) !== "object" || o === null || Object.isFrozen(o) || Object.isSealed(o)) {
        return;
      }
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          o.__defineGetter__(key, getPropertyValue.bind(null, o[key]));
          o.__defineSetter__(key, function throwPropertySetError(value) {
            throw TypeError("Cannot redefine property; Enum Type is not extensible.");
          });
          deepFreezeEnums(o[key]);
        }
      }
      if (Object.freeze) {
        Object.freeze(o);
      } else {
        freezer(o);
      }
    }

    if (envSupportsFreezing()) {
      deepFreezeEnums(this);
    }

    return this;
  };

  /**
   * Return true whether the enumItem parameter passed in is an EnumItem object and 
   * has been included as constant of this Enum   
   * @param  {EnumItem} enumItem
   */

  Enum.prototype.isDefined = function isDefined(enumItem) {
    var condition = function condition(e) {
      return e === enumItem;
    };
    if (isString(enumItem) || isNumber(enumItem)) {
      condition = function condition(e) {
        return e.is(enumItem);
      };
    }
    return this.enums.some(condition);
  };

  /**
   * Returns JSON object representation of this Enum.
   * @return {String} JSON object representation of this Enum.
   */

  Enum.prototype.toJSON = function toJSON() {
    return this._enumMap;
  };

  /**
   * Extends the existing Enum with a New Map.
   * @param  {Array}  map  Map to extend from
   */

  Enum.prototype.extend = function extend(map) {
    if (map.length) {
      var array = map;
      map = {};

      for (var i = 0; i < array.length; i++) {
        var exponent = this._enumLastIndex + i;
        map[array[i]] = Math.pow(2, exponent);
      }

      for (var member in map) {
        guardReservedKeys(this._options.name, member);
        this[member] = new EnumItem(member, map[member], { ignoreCase: this._options.ignoreCase });
        this.enums.push(this[member]);
      }

      for (var key in this._enumMap) {
        map[key] = this._enumMap[key];
      }

      this._enumLastIndex += map.length;
      this._enumMap = map;

      if (this._options.freez) {
        this.freezeEnums(); //this will make instances of new Enum non-extensible
      }
    }
  };

  /**
   * Registers the Enum Type globally in node.js.
   * @param  {String} key Global variable. [optional]
   */

  Enum.register = function register() {
    var key = arguments[0] === undefined ? "Enum" : arguments[0];

    if (!global[key]) {
      global[key] = Enum;
    }
  };

  Enum.prototype[Symbol.iterator] = function () {
    var _this = this;

    var index = 0;
    return {
      next: function next() {
        return index < _this.enums.length ? { done: false, value: _this.enums[index++] } : { done: true };
      }
    };
  };

  return Enum;
}();

module.exports = Enum;

// private

var reservedKeys = ["_options", "get", "getKey", "getValue", "enums", "isFlaggable", "_enumMap", "toJSON", "_enumLastIndex"];

function guardReservedKeys(customName, key) {
  if (customName && key === "name" || indexOf.call(reservedKeys, key) >= 0) {
    throw new Error("Enum key " + key + " is a reserved word!");
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _isType = __webpack_require__(5);

var isObject = _isType.isObject;
var isString = _isType.isString;

/**
 * Represents an Item of an Enum.
 * @param {String} key   The Enum key.
 * @param {Number} value The Enum value.
 */

var EnumItem = function () {

  /*constructor reference so that, this.constructor===EnumItem//=>true */

  function EnumItem(key, value) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, EnumItem);

    this.key = key;
    this.value = value;

    this._options = options;
    this._options.ignoreCase = this._options.ignoreCase || false;
  }

  /**
   * Checks if the flagged EnumItem has the passing object.
   * @param  {EnumItem || String || Number} value The object to check with.
   * @return {Boolean}                            The check result.
   */

  EnumItem.prototype.has = function has(value) {
    if (EnumItem.isEnumItem(value)) {
      return (this.value & value.value) !== 0;
    } else if (isString(value)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      }
      return this.key.indexOf(value) >= 0;
    } else {
      return (this.value & value) !== 0;
    }
  };

  /**
   * Checks if the EnumItem is the same as the passing object.
   * @param  {EnumItem || String || Number} key The object to check with.
   * @return {Boolean}                          The check result.
   */

  EnumItem.prototype.is = function is(key) {
    if (EnumItem.isEnumItem(key)) {
      return this.key === key.key;
    } else if (isString(key)) {
      if (this._options.ignoreCase) {
        return this.key.toLowerCase() === key.toLowerCase();
      }
      return this.key === key;
    } else {
      return this.value === key;
    }
  };

  /**
   * Returns String representation of this EnumItem.
   * @return {String} String representation of this EnumItem.
   */

  EnumItem.prototype.toString = function toString() {
    return this.key;
  };

  /**
   * Returns JSON object representation of this EnumItem.
   * @return {String} JSON object representation of this EnumItem.
   */

  EnumItem.prototype.toJSON = function toJSON() {
    return this.key;
  };

  /**
   * Returns the value to compare with.
   * @return {String} The value to compare with.
   */

  EnumItem.prototype.valueOf = function valueOf() {
    return this.value;
  };

  EnumItem.isEnumItem = function isEnumItem(value) {
    return value instanceof EnumItem || isObject(value) && value.key !== undefined && value.value !== undefined;
  };

  return EnumItem;
}();

module.exports = EnumItem;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var indexOf = Array.prototype.indexOf || function (find, i /*opt*/) {
  if (i === undefined) i = 0;
  if (i < 0) i += this.length;
  if (i < 0) i = 0;
  for (var n = this.length; i < n; i++) {
    if (i in this && this[i] === find) return i;
  }return -1;
};
exports.indexOf = indexOf;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.endianness = function () {
    return 'LE';
};

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname;
    } else return '';
};

exports.loadavg = function () {
    return [];
};

exports.uptime = function () {
    return 0;
};

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () {
    return [];
};

exports.type = function () {
    return 'Browser';
};

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces = exports.getNetworkInterfaces = function () {
    return {};
};

exports.arch = function () {
    return 'javascript';
};

exports.platform = function () {
    return 'browser';
};

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
    return '/';
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cards, random) {
  this.reset = function () {
    this.cards = cards.slice(0);
    this.length = this.cards.length;
  };
  this.shuffle = function () {
    fisherYates(this.cards);
  };

  this.reset();
  this.shuffle();

  this.deal = function (numberOfCards, arrayOfHands) {
    for (var i = 0; i < numberOfCards; i++) {
      for (var j = 0; j < arrayOfHands.length; j++) {
        arrayOfHands[j].push(this.cards.pop());
      }
    }this.length = this.cards.length;
  };

  this.draw = function (num) {
    if (!num || num <= 1) {
      this.length = this.cards.length - 1;
      return this.cards.pop();
    }

    var ret = [];
    for (var i = 0; i < num; i++) {
      ret.push(this.cards.pop());
    }this.length = this.cards.length;
    return ret;
  };

  this.drawFromBottomOfDeck = function (num) {
    if (!num || num < 1) {
      num = 1;
    }

    var ret = [];
    for (var i = 0; i < num; i++) {
      ret.push(this.cards.shift());
    }
    this.length = this.cards.length;

    if (ret.length === 1) {
      return ret[0];
    } else {
      return ret;
    }
  };

  this.drawRandom = function (num) {
    var _draw = function _draw() {
      var index = Math.floor(random() * this.cards.length);
      var card = this.cards[index];
      this.cards.splice(index, 1);
      this.length = this.cards.length;
      return card;
    };

    if (!num || num <= 1) {
      return _draw.apply(this);
    } else {
      var cards = [];
      for (var i = 0; i < num; i++) {
        cards.push(_draw.apply(this));
      }
      return cards;
    }
  };

  this.putOnTopOfDeck = function (cards) {
    if (!cards instanceof Array) this.cards.push(cards);else for (var i = 0; i < cards.length; i++) {
      this.cards.push(cards[i]);
    }this.length = this.cards.length;
  };

  this.putOnBottomOfDeck = function (cards) {
    if (!cards instanceof Array) this.cards.unshift(cards);else for (var i = 0; i < cards.length; i++) {
      this.cards.unshift(cards[i]);
    }this.length = this.cards.length;
  };

  //array shuffling algorithm: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  function fisherYates(arr) {
    var i = arr.length;
    if (i === 0) return false;
    while (--i) {
      var j = Math.floor(random() * (i + 1));
      var tempi = arr[i];
      var tempj = arr[j];
      arr[i] = tempj;
      arr[j] = tempi;
    }
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (suit, description, sort) {
  this.suit = suit;
  this.description = description;
  this.sort = sort;

  this.toString = function () {
    return this.description + ' of ' + this.suit + 's';
  };

  this.toShortDisplayString = function () {
    var suit = this.suit.substring(0, 1);
    var value;
    switch (this.sort) {
      case 11:
        value = 'J';
        break;
      case 12:
        value = 'Q';
        break;
      case 13:
        value = 'K';
        break;
      case 14:
        value = 'A';
        break;
      default:
        value = this.sort;
    }
    return value + suit;
  };
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var playingCard = __webpack_require__(20);

module.exports = function () {
  this.cards = [new playingCard('Club', 'Two', 2), new playingCard('Club', 'Three', 3), new playingCard('Club', 'Four', 4), new playingCard('Club', 'Five', 5), new playingCard('Club', 'Six', 6), new playingCard('Club', 'Seven', 7), new playingCard('Club', 'Eight', 8), new playingCard('Club', 'Nine', 9), new playingCard('Club', 'Ten', 10), new playingCard('Club', 'Jack', 11), new playingCard('Club', 'Queen', 12), new playingCard('Club', 'King', 13), new playingCard('Club', 'Ace', 14), new playingCard('Diamond', 'Two', 2), new playingCard('Diamond', 'Three', 3), new playingCard('Diamond', 'Four', 4), new playingCard('Diamond', 'Five', 5), new playingCard('Diamond', 'Six', 6), new playingCard('Diamond', 'Seven', 7), new playingCard('Diamond', 'Eight', 8), new playingCard('Diamond', 'Nine', 9), new playingCard('Diamond', 'Ten', 10), new playingCard('Diamond', 'Jack', 11), new playingCard('Diamond', 'Queen', 12), new playingCard('Diamond', 'King', 13), new playingCard('Diamond', 'Ace', 14), new playingCard('Heart', 'Two', 2), new playingCard('Heart', 'Three', 3), new playingCard('Heart', 'Four', 4), new playingCard('Heart', 'Five', 5), new playingCard('Heart', 'Six', 6), new playingCard('Heart', 'Seven', 7), new playingCard('Heart', 'Eight', 8), new playingCard('Heart', 'Nine', 9), new playingCard('Heart', 'Ten', 10), new playingCard('Heart', 'Jack', 11), new playingCard('Heart', 'Queen', 12), new playingCard('Heart', 'King', 13), new playingCard('Heart', 'Ace', 14), new playingCard('Spade', 'Two', 2), new playingCard('Spade', 'Three', 3), new playingCard('Spade', 'Four', 4), new playingCard('Spade', 'Five', 5), new playingCard('Spade', 'Six', 6), new playingCard('Spade', 'Seven', 7), new playingCard('Spade', 'Eight', 8), new playingCard('Spade', 'Nine', 9), new playingCard('Spade', 'Ten', 10), new playingCard('Spade', 'Jack', 11), new playingCard('Spade', 'Queen', 12), new playingCard('Spade', 'King', 13), new playingCard('Spade', 'Ace', 14)];
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function TempCtor() {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isBuffer(arg) {
  return arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Deck = __webpack_require__(4);

var player = function player(name) {
  name = !!name ? name.trim() : name;
  if (!name) throw new Error("Player must have a name");;

  var instance = {
    name: name,
    hand: []
  };

  instance.getCardByValue = function (value) {
    if (!value) return null;

    return instance.hand.find(function (c) {
      return c.value === value;
    });
  };

  instance.hasCard = function (card) {
    if (!card) return false;

    return instance.hand.some(function (c) {
      return c.value === card.value && c.color === card.color;
    });
  };

  instance.removeCard = function (card) {
    if (!instance.hasCard(card)) return;

    var i = instance.hand.findIndex(function (c) {
      return c.value === card.value && c.color === card.color;
    });
    instance.hand.splice(i, 1);
  };

  instance.valueOf = function () {
    return instance.name;
  };

  instance.toString = function () {
    return instance.name;
  };

  return instance;
};

module.exports = player;

/***/ })
/******/ ]);
});