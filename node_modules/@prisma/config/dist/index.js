"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all5) => {
  for (var name in all5)
    __defProp(target, name, { get: all5[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  defaultTestConfig: () => defaultTestConfig,
  defineConfig: () => defineConfig,
  loadConfigFromFile: () => loadConfigFromFile
});
module.exports = __toCommonJS(index_exports);

// ../debug/dist/index.mjs
var __defProp2 = Object.defineProperty;
var __export2 = (target, all5) => {
  for (var name in all5)
    __defProp2(target, name, { get: all5[name], enumerable: true });
};
var colors_exports = {};
__export2(colors_exports, {
  $: () => $,
  bgBlack: () => bgBlack,
  bgBlue: () => bgBlue,
  bgCyan: () => bgCyan,
  bgGreen: () => bgGreen,
  bgMagenta: () => bgMagenta,
  bgRed: () => bgRed,
  bgWhite: () => bgWhite,
  bgYellow: () => bgYellow,
  black: () => black,
  blue: () => blue,
  bold: () => bold,
  cyan: () => cyan,
  dim: () => dim,
  gray: () => gray,
  green: () => green,
  grey: () => grey,
  hidden: () => hidden,
  inverse: () => inverse,
  italic: () => italic,
  magenta: () => magenta,
  red: () => red,
  reset: () => reset,
  strikethrough: () => strikethrough,
  underline: () => underline,
  white: () => white,
  yellow: () => yellow
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close2 = `\x1B[${y}m`;
  return function(txt) {
    if (!$.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close2) ? txt.replace(rgx, close2 + open) : txt) + close2;
  };
}
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
var MAX_ARGS_HISTORY = 100;
var COLORS = ["green", "yellow", "blue", "magenta", "cyan", "red"];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof process !== "undefined" ? process.env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
  enable(namespace) {
    if (typeof namespace === "string") {
      globalThis.DEBUG = namespace;
    }
  },
  disable() {
    const prev = globalThis.DEBUG;
    globalThis.DEBUG = "";
    return prev;
  },
  // this is the core logic to check if logging should happen or not
  enabled(namespace) {
    const listenedNamespaces = globalThis.DEBUG.split(",").map((s) => {
      return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    });
    const isListened = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
      return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
    });
    const isExcluded = listenedNamespaces.some((listenedNamespace) => {
      if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
      return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
    });
    return isListened && !isExcluded;
  },
  log: (...args2) => {
    const [namespace, format7, ...rest] = args2;
    const logWithFormatting = console.warn ?? console.log;
    logWithFormatting(`${namespace} ${format7}`, ...rest);
  },
  formatters: {}
  // not implemented
};
function debugCreate(namespace) {
  const instanceProps = {
    color: COLORS[lastColor++ % COLORS.length],
    enabled: topProps.enabled(namespace),
    namespace,
    log: topProps.log,
    extend: () => {
    }
    // not implemented
  };
  const debugCall = (...args2) => {
    const { enabled: enabled2, namespace: namespace2, color, log } = instanceProps;
    if (args2.length !== 0) {
      argsHistory.push([namespace2, ...args2]);
    }
    if (argsHistory.length > MAX_ARGS_HISTORY) {
      argsHistory.shift();
    }
    if (topProps.enabled(namespace2) || enabled2) {
      const stringArgs = args2.map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        return safeStringify(arg);
      });
      const ms = `+${Date.now() - lastTimestamp}ms`;
      lastTimestamp = Date.now();
      if (globalThis.DEBUG_COLORS) {
        log(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
      } else {
        log(namespace2, ...stringArgs, ms);
      }
    }
  };
  return new Proxy(debugCall, {
    get: (_, prop) => instanceProps[prop],
    set: (_, prop, value3) => instanceProps[prop] = value3
  });
}
var Debug = new Proxy(debugCreate, {
  get: (_, prop) => topProps[prop],
  set: (_, prop, value3) => topProps[prop] = value3
});
function safeStringify(value3, indent = 2) {
  const cache = /* @__PURE__ */ new Set();
  return JSON.stringify(
    value3,
    (key, value22) => {
      if (typeof value22 === "object" && value22 !== null) {
        if (cache.has(value22)) {
          return `[Circular *]`;
        }
        cache.add(value22);
      } else if (typeof value22 === "bigint") {
        return value22.toString();
      }
      return value22;
    },
    indent
  );
}

// ../driver-adapter-utils/dist/index.mjs
function isDriverAdapterError(error) {
  return error["name"] === "DriverAdapterError" && typeof error["cause"] === "object";
}
function ok(value3) {
  return {
    ok: true,
    value: value3,
    map(fn) {
      return ok(fn(value3));
    },
    flatMap(fn) {
      return fn(value3);
    }
  };
}
function err(error) {
  return {
    ok: false,
    error,
    map() {
      return err(error);
    },
    flatMap() {
      return err(error);
    }
  };
}
var debug = Debug("driver-adapter-utils");
var ErrorRegistryInternal = class {
  registeredErrors = [];
  consumeError(id) {
    return this.registeredErrors[id];
  }
  registerNewError(error) {
    let i = 0;
    while (this.registeredErrors[i] !== void 0) {
      i++;
    }
    this.registeredErrors[i] = { error };
    return i;
  }
};
var bindMigrationAwareSqlAdapterFactory = (adapterFactory) => {
  const errorRegistry = new ErrorRegistryInternal();
  const boundFactory = {
    adapterName: adapterFactory.adapterName,
    provider: adapterFactory.provider,
    errorRegistry,
    connect: async (...args2) => {
      const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args2);
      return ctx.map((ctx2) => bindAdapter(ctx2, errorRegistry));
    },
    connectToShadowDb: async (...args2) => {
      const ctx = await wrapAsync(errorRegistry, adapterFactory.connectToShadowDb.bind(adapterFactory))(...args2);
      return ctx.map((ctx2) => bindAdapter(ctx2, errorRegistry));
    }
  };
  return boundFactory;
};
var bindAdapter = (adapter4, errorRegistry = new ErrorRegistryInternal()) => {
  const boundAdapter = {
    adapterName: adapter4.adapterName,
    errorRegistry,
    queryRaw: wrapAsync(errorRegistry, adapter4.queryRaw.bind(adapter4)),
    executeRaw: wrapAsync(errorRegistry, adapter4.executeRaw.bind(adapter4)),
    executeScript: wrapAsync(errorRegistry, adapter4.executeScript.bind(adapter4)),
    dispose: wrapAsync(errorRegistry, adapter4.dispose.bind(adapter4)),
    provider: adapter4.provider,
    startTransaction: async (...args2) => {
      const ctx = await wrapAsync(errorRegistry, adapter4.startTransaction.bind(adapter4))(...args2);
      return ctx.map((ctx2) => bindTransaction(errorRegistry, ctx2));
    }
  };
  if (adapter4.getConnectionInfo) {
    boundAdapter.getConnectionInfo = wrapSync(errorRegistry, adapter4.getConnectionInfo.bind(adapter4));
  }
  return boundAdapter;
};
var bindTransaction = (errorRegistry, transaction) => {
  return {
    adapterName: transaction.adapterName,
    provider: transaction.provider,
    options: transaction.options,
    queryRaw: wrapAsync(errorRegistry, transaction.queryRaw.bind(transaction)),
    executeRaw: wrapAsync(errorRegistry, transaction.executeRaw.bind(transaction)),
    commit: wrapAsync(errorRegistry, transaction.commit.bind(transaction)),
    rollback: wrapAsync(errorRegistry, transaction.rollback.bind(transaction))
  };
};
function wrapAsync(registry, fn) {
  return async (...args2) => {
    try {
      return ok(await fn(...args2));
    } catch (error) {
      debug("[error@wrapAsync]", error);
      if (isDriverAdapterError(error)) {
        return err(error.cause);
      }
      const id = registry.registerNewError(error);
      return err({ kind: "GenericJs", id });
    }
  };
}
function wrapSync(registry, fn) {
  return (...args2) => {
    try {
      return ok(fn(...args2));
    } catch (error) {
      debug("[error@wrapSync]", error);
      if (isDriverAdapterError(error)) {
        return err(error.cause);
      }
      const id = registry.registerNewError(error);
      return err({ kind: "GenericJs", id });
    }
  };
}
var mockAdapterErrors = {
  queryRaw: new Error("Not implemented: queryRaw"),
  executeRaw: new Error("Not implemented: executeRaw"),
  startTransaction: new Error("Not implemented: startTransaction"),
  executeScript: new Error("Not implemented: executeScript"),
  dispose: new Error("Not implemented: dispose")
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Function.js
var isFunction = (input) => typeof input === "function";
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self) {
          return body(self, ...args2);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value3) => () => value3;
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constNull = /* @__PURE__ */ constant(null);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Either.js
var Either_exports = {};
__export(Either_exports, {
  Do: () => Do,
  TypeId: () => TypeId3,
  all: () => all,
  andThen: () => andThen,
  ap: () => ap,
  bind: () => bind2,
  bindTo: () => bindTo2,
  filterOrLeft: () => filterOrLeft,
  flatMap: () => flatMap,
  flip: () => flip,
  fromNullable: () => fromNullable,
  fromOption: () => fromOption2,
  gen: () => gen,
  getEquivalence: () => getEquivalence,
  getLeft: () => getLeft2,
  getOrElse: () => getOrElse,
  getOrNull: () => getOrNull,
  getOrThrow: () => getOrThrow,
  getOrThrowWith: () => getOrThrowWith,
  getOrUndefined: () => getOrUndefined,
  getRight: () => getRight2,
  isEither: () => isEither2,
  isLeft: () => isLeft2,
  isRight: () => isRight2,
  left: () => left2,
  let: () => let_2,
  liftPredicate: () => liftPredicate,
  map: () => map,
  mapBoth: () => mapBoth,
  mapLeft: () => mapLeft,
  match: () => match,
  merge: () => merge,
  orElse: () => orElse,
  right: () => right2,
  transposeMapOption: () => transposeMapOption,
  transposeOption: () => transposeOption,
  try: () => try_,
  void: () => void_,
  zipWith: () => zipWith
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Equivalence.js
var make = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
var isStrictEquivalent = (x, y) => x === y;
var strict = () => isStrictEquivalent;
var number = /* @__PURE__ */ strict();
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make((x, y) => self(f(x), f(y))));
var Date2 = /* @__PURE__ */ mapInput(number, (date3) => date3.getTime());
var array = (item) => make((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});
var struct = (fields) => {
  const keys6 = Object.keys(fields);
  return make((self, that) => {
    for (const key of keys6) {
      if (!fields[key](self[key], that[key])) {
        return false;
      }
    }
    return true;
  });
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/doNotation.js
var let_ = (map15) => dual(3, (self, name, f) => map15(self, (a) => ({
  ...a,
  [name]: f(a)
})));
var bindTo = (map15) => dual(2, (self, name) => map15(self, (a) => ({
  [name]: a
})));
var bind = (map15, flatMap12) => dual(3, (self, name, f) => flatMap12(self, (a) => map15(f(a), (b) => ({
  ...a,
  [name]: b
}))));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/version.js
var moduleVersion = "3.16.12";
var getCurrentVersion = () => moduleVersion;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/GlobalValue.js
var globalStoreId = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ getCurrentVersion()}`;
var globalStore;
var globalValue = (id, compute) => {
  if (!globalStore) {
    globalThis[globalStoreId] ??= /* @__PURE__ */ new Map();
    globalStore = globalThis[globalStoreId];
  }
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Predicate.js
var isTruthy = (input) => !!input;
var isSet = (input) => input instanceof Set;
var isMap = (input) => input instanceof Map;
var isString = (input) => typeof input === "string";
var isNumber = (input) => typeof input === "number";
var isBoolean = (input) => typeof input === "boolean";
var isBigInt = (input) => typeof input === "bigint";
var isSymbol = (input) => typeof input === "symbol";
var isFunction2 = isFunction;
var isUndefined = (input) => input === void 0;
var isNotUndefined = (input) => input !== void 0;
var isNotNull = (input) => input !== null;
var isNever = (_) => false;
var isRecordOrArray = (input) => typeof input === "object" && input !== null;
var isObject = (input) => isRecordOrArray(input) || isFunction2(input);
var hasProperty = /* @__PURE__ */ dual(2, (self, property2) => isObject(self) && property2 in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag2) => hasProperty(self, "_tag") && self["_tag"] === tag2);
var isNullable = (input) => input === null || input === void 0;
var isNotNullable = (input) => input !== null && input !== void 0;
var isUint8Array = (input) => input instanceof Uint8Array;
var isDate = (input) => input instanceof Date;
var isIterable = (input) => hasProperty(input, Symbol.iterator);
var isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);
var isPromiseLike = (input) => hasProperty(input, "then") && isFunction2(input.then);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/errors.js
var getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Utils.js
var GenKindTypeId = /* @__PURE__ */ Symbol.for("effect/Gen/GenKind");
var isGenKind = (u) => isObject(u) && GenKindTypeId in u;
var GenKindImpl = class {
  value;
  constructor(value3) {
    this.value = value3;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  [GenKindTypeId] = GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SingleShotGen = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};
var adapter = () => function() {
  let x = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    x = arguments[i](x);
  }
  return new GenKindImpl(x);
};
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;
var PCGRandom = class {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max3) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % max3;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
var YieldWrapTypeId = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var YieldWrap = class {
  /**
   * @since 3.0.6
   */
  #value;
  constructor(value3) {
    this.#value = value3;
  }
  /**
   * @since 3.0.6
   */
  [YieldWrapTypeId]() {
    return this.#value;
  }
};
function yieldWrapGet(self) {
  if (typeof self === "object" && self !== null && YieldWrapTypeId in self) {
    return self[YieldWrapTypeId]();
  }
  throw new Error(getBugErrorMessage("yieldWrapGet"));
}
var structuralRegionState = /* @__PURE__ */ globalValue("effect/Utils/isStructuralRegion", () => ({
  enabled: false,
  tester: void 0
}));
var standard = {
  effect_internal_function: (body) => {
    return body();
  }
};
var forced = {
  effect_internal_function: (body) => {
    try {
      return body();
    } finally {
    }
  }
};
var isNotOptimizedAway = /* @__PURE__ */ standard.effect_internal_function(() => new Error().stack)?.includes("effect_internal_function") === true;
var internalCall = isNotOptimizedAway ? standard.effect_internal_function : forced.effect_internal_function;
var genConstructor = function* () {
}.constructor;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Hash.js
var randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
var symbol = /* @__PURE__ */ Symbol.for("effect/Hash");
var hash = (self) => {
  if (structuralRegionState.enabled === true) {
    return 0;
  }
  switch (typeof self) {
    case "number":
      return number2(self);
    case "bigint":
      return string(self.toString(10));
    case "boolean":
      return string(String(self));
    case "symbol":
      return string(String(self));
    case "string":
      return string(self);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self === null) {
        return string("null");
      } else if (self instanceof Date) {
        return hash(self.toISOString());
      } else if (self instanceof URL) {
        return hash(self.href);
      } else if (isHash(self)) {
        return self[symbol]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number2(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
var combine = (b) => (self) => self * 53 ^ b;
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var isHash = (u) => hasProperty(u, symbol);
var number2 = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(h);
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys6) => {
  let h = 12289;
  for (let i = 0; i < keys6.length; i++) {
    h ^= pipe(string(keys6[i]), combine(hash(o[keys6[i]])));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, Object.keys(o));
var array2 = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};
var cached = function() {
  if (arguments.length === 1) {
    const self2 = arguments[0];
    return function(hash4) {
      Object.defineProperty(self2, symbol, {
        value() {
          return hash4;
        },
        enumerable: false
      });
      return hash4;
    };
  }
  const self = arguments[0];
  const hash3 = arguments[1];
  Object.defineProperty(self, symbol, {
    value() {
      return hash3;
    },
    enumerable: false
  });
  return hash3;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Equal.js
var symbol2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "object" || selfType === "function") {
    if (self !== null && that !== null) {
      if (isEqual(self) && isEqual(that)) {
        if (hash(self) === hash(that) && self[symbol2](that)) {
          return true;
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
        }
      } else if (self instanceof Date && that instanceof Date) {
        return self.toISOString() === that.toISOString();
      } else if (self instanceof URL && that instanceof URL) {
        return self.href === that.href;
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self) && Array.isArray(that)) {
        return self.length === that.length && self.every((v, i) => compareBoth(v, that[i]));
      }
      if (Object.getPrototypeOf(self) === Object.prototype && Object.getPrototypeOf(self) === Object.prototype) {
        const keysSelf = Object.keys(self);
        const keysThat = Object.keys(that);
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!(key in that && compareBoth(self[key], that[key]))) {
              return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
            }
          }
          return true;
        }
      }
      return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
}
var isEqual = (u) => hasProperty(u, symbol2);
var equivalence = () => equals;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJSON = (x) => {
  try {
    if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
      return x.toJSON();
    } else if (Array.isArray(x)) {
      return x.map(toJSON);
    }
  } catch {
    return {};
  }
  return redact(x);
};
var format = (x) => JSON.stringify(x, null, 2);
var BaseProto = {
  toJSON() {
    return toJSON(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var Class = class {
  /**
   * @since 2.0.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  /**
   * @since 2.0.0
   */
  toString() {
    return format(this.toJSON());
  }
};
var toStringUnknown = (u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch {
    return String(u);
  }
};
var stringifyCircular = (obj, whitespace) => {
  let cache = [];
  const retVal = JSON.stringify(obj, (_key, value3) => typeof value3 === "object" && value3 !== null ? cache.includes(value3) ? void 0 : cache.push(value3) && (redactableState.fiberRefs !== void 0 && isRedactable(value3) ? value3[symbolRedactable](redactableState.fiberRefs) : value3) : value3, whitespace);
  cache = void 0;
  return retVal;
};
var symbolRedactable = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable");
var isRedactable = (u) => typeof u === "object" && u !== null && symbolRedactable in u;
var redactableState = /* @__PURE__ */ globalValue("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
}));
var withRedactableContext = (context3, f) => {
  const prev = redactableState.fiberRefs;
  redactableState.fiberRefs = context3;
  try {
    return f();
  } finally {
    redactableState.fiberRefs = prev;
  }
};
var redact = (u) => {
  if (isRedactable(u) && redactableState.fiberRefs !== void 0) {
    return u[symbolRedactable](redactableState.fiberRefs);
  }
  return u;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Pipeable.js
var pipeArguments = (self, args2) => {
  switch (args2.length) {
    case 0:
      return self;
    case 1:
      return args2[0](self);
    case 2:
      return args2[1](args2[0](self));
    case 3:
      return args2[2](args2[1](args2[0](self)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/opCodes/effect.js
var OP_ASYNC = "Async";
var OP_COMMIT = "Commit";
var OP_FAILURE = "Failure";
var OP_ON_FAILURE = "OnFailure";
var OP_ON_SUCCESS = "OnSuccess";
var OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
var OP_SUCCESS = "Success";
var OP_SYNC = "Sync";
var OP_TAG = "Tag";
var OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
var OP_WHILE = "While";
var OP_ITERATOR = "Iterator";
var OP_WITH_RUNTIME = "WithRuntime";
var OP_YIELD = "Yield";
var OP_REVERT_FLAGS = "RevertFlags";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
var StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
var SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
var ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
var effectVariance = {
  /* c8 ignore next */
  _R: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _,
  _V: /* @__PURE__ */ getCurrentVersion()
};
var sinkVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _L: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var channelVariance = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return cached(this, random(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var StructuralPrototype = {
  [symbol]() {
    return cached(this, structure(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};
var Base = /* @__PURE__ */ function() {
  function Base3() {
  }
  Base3.prototype = CommitPrototype;
  return Base3;
}();

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/option.js
var TypeId = /* @__PURE__ */ Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return cached(this, combine(hash(this._tag))(hash(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneHash = /* @__PURE__ */ hash("None");
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input) => hasProperty(input, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var some = (value3) => {
  const a = Object.create(SomeProto);
  a.value = value3;
  return a;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/either.js
var TypeId2 = /* @__PURE__ */ Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _R: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(this.right, that.right);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(this.left, that.left);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = (input) => hasProperty(input, TypeId2);
var isLeft = (ma) => ma._tag === "Left";
var isRight = (ma) => ma._tag === "Right";
var left = (left3) => {
  const a = Object.create(LeftProto);
  a.left = left3;
  return a;
};
var right = (right3) => {
  const a = Object.create(RightProto);
  a.right = right3;
  return a;
};
var getLeft = (self) => isRight(self) ? none : some(self.left);
var getRight = (self) => isLeft(self) ? none : some(self.right);
var fromOption = /* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? left(onNone()) : right(self.value));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Either.js
var TypeId3 = TypeId2;
var right2 = right;
var void_ = /* @__PURE__ */ right2(void 0);
var left2 = left;
var fromNullable = /* @__PURE__ */ dual(2, (self, onNullable) => self == null ? left2(onNullable(self)) : right2(self));
var fromOption2 = fromOption;
var try_ = (evaluate2) => {
  if (isFunction2(evaluate2)) {
    try {
      return right2(evaluate2());
    } catch (e) {
      return left2(e);
    }
  } else {
    try {
      return right2(evaluate2.try());
    } catch (e) {
      return left2(evaluate2.catch(e));
    }
  }
};
var isEither2 = isEither;
var isLeft2 = isLeft;
var isRight2 = isRight;
var getRight2 = getRight;
var getLeft2 = getLeft;
var getEquivalence = ({
  left: left3,
  right: right3
}) => make((x, y) => isLeft2(x) ? isLeft2(y) && left3(x.left, y.left) : isRight2(y) && right3(x.right, y.right));
var mapBoth = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? left2(onLeft(self.left)) : right2(onRight(self.right)));
var mapLeft = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(f(self.left)) : right2(self.right));
var map = /* @__PURE__ */ dual(2, (self, f) => isRight2(self) ? right2(f(self.right)) : left2(self.left));
var match = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? onLeft(self.left) : onRight(self.right));
var liftPredicate = /* @__PURE__ */ dual(3, (a, predicate, orLeftWith) => predicate(a) ? right2(a) : left2(orLeftWith(a)));
var filterOrLeft = /* @__PURE__ */ dual(3, (self, predicate, orLeftWith) => flatMap(self, (r) => predicate(r) ? right2(r) : left2(orLeftWith(r))));
var merge = /* @__PURE__ */ match({
  onLeft: identity,
  onRight: identity
});
var getOrElse = /* @__PURE__ */ dual(2, (self, onLeft) => isLeft2(self) ? onLeft(self.left) : self.right);
var getOrNull = /* @__PURE__ */ getOrElse(constNull);
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var getOrThrowWith = /* @__PURE__ */ dual(2, (self, onLeft) => {
  if (isRight2(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
var getOrThrow = /* @__PURE__ */ getOrThrowWith(() => new Error("getOrThrow called on a Left"));
var orElse = /* @__PURE__ */ dual(2, (self, that) => isLeft2(self) ? that(self.left) : right2(self.right));
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(self.left) : f(self.right));
var andThen = /* @__PURE__ */ dual(2, (self, f) => flatMap(self, (a) => {
  const b = isFunction2(f) ? f(a) : f;
  return isEither2(b) ? b : right2(b);
}));
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => flatMap(self, (r) => map(that, (r2) => f(r, r2))));
var ap = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, (f, a) => f(a)));
var all = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const e of input) {
      if (isLeft2(e)) {
        return e;
      }
      out2.push(e.right);
    }
    return right2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isLeft2(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right2(out);
};
var flip = (self) => isLeft2(self) ? right2(self.left) : left2(self.right);
var adapter2 = /* @__PURE__ */ adapter();
var gen = (...args2) => {
  const f = args2.length === 1 ? args2[0] : args2[1].bind(args2[0]);
  const iterator = f(adapter2);
  let state = iterator.next();
  while (!state.done) {
    const current = isGenKind(state.value) ? state.value.value : yieldWrapGet(state.value);
    if (isLeft2(current)) {
      return current;
    }
    state = iterator.next(current.right);
  }
  return right2(state.value);
};
var Do = /* @__PURE__ */ right2({});
var bind2 = /* @__PURE__ */ bind(map, flatMap);
var bindTo2 = /* @__PURE__ */ bindTo(map);
var let_2 = /* @__PURE__ */ let_(map);
var transposeOption = (self) => {
  return isNone(self) ? right2(none) : map(self.value, some);
};
var transposeMapOption = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? right2(none) : map(f(self.value), some));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/array.js
var isNonEmptyArray = (self) => self.length > 0;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Order.js
var make2 = (compare2) => (self, that) => self === that ? 0 : compare2(self, that);
var number3 = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var bigint = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var mapInput2 = /* @__PURE__ */ dual(2, (self, f) => make2((b1, b2) => self(f(b1), f(b2))));
var struct2 = (fields) => {
  const keys6 = Object.keys(fields);
  return make2((self, that) => {
    for (const key of keys6) {
      const o = fields[key](self[key], that[key]);
      if (o !== 0) {
        return o;
      }
    }
    return 0;
  });
};
var lessThan = (O) => dual(2, (self, that) => O(self, that) === -1);
var greaterThan = (O) => dual(2, (self, that) => O(self, that) === 1);
var lessThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== 1);
var greaterThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== -1);
var min = (O) => dual(2, (self, that) => self === that || O(self, that) < 1 ? self : that);
var max = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);
var clamp = (O) => dual(2, (self, options) => min(O)(options.maximum, max(O)(options.minimum, self)));
var between = (O) => dual(2, (self, options) => !lessThan(O)(self, options.minimum) && !greaterThan(O)(self, options.maximum));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Option.js
var none2 = () => none;
var some2 = some;
var isOption2 = isOption;
var isNone2 = isNone;
var isSome2 = isSome;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var getRight3 = getRight;
var getOrElse2 = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var orElse2 = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? that() : self);
var orElseSome = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? some2(onNone()) : self);
var fromNullable2 = (nullableValue) => nullableValue == null ? none2() : some2(nullableValue);
var getOrNull2 = /* @__PURE__ */ getOrElse2(constNull);
var getOrUndefined2 = /* @__PURE__ */ getOrElse2(constUndefined);
var liftThrowable = (f) => (...a) => {
  try {
    return some2(f(...a));
  } catch {
    return none2();
  }
};
var getOrThrowWith2 = /* @__PURE__ */ dual(2, (self, onNone) => {
  if (isSome2(self)) {
    return self.value;
  }
  throw onNone();
});
var map2 = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var flatMapNullable = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : fromNullable2(f(self.value)));
var filterMap = flatMap2;
var filter = /* @__PURE__ */ dual(2, (self, predicate) => filterMap(self, (b) => predicate(b) ? some(b) : none));
var getEquivalence2 = (isEquivalent) => make((x, y) => isNone2(x) ? isNone2(y) : isNone2(y) ? false : isEquivalent(x.value, y.value));
var containsWith = (isEquivalent) => dual(2, (self, a) => isNone2(self) ? false : isEquivalent(self.value, a));
var _equivalence = /* @__PURE__ */ equivalence();
var contains = /* @__PURE__ */ containsWith(_equivalence);
var exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone2(self) ? false : refinement(self.value));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Tuple.js
var make3 = (...elements) => elements;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Iterable.js
var findFirst = /* @__PURE__ */ dual(2, (self, f) => {
  let i = 0;
  for (const a of self) {
    const o = f(a, i);
    if (isBoolean(o)) {
      if (o) {
        return some2(a);
      }
    } else {
      if (isSome2(o)) {
        return o;
      }
    }
    i++;
  }
  return none2();
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Array.js
var allocate = (n) => new Array(n);
var makeBy = /* @__PURE__ */ dual(2, (n, f) => {
  const max3 = Math.max(1, Math.floor(n));
  const out = new Array(max3);
  for (let i = 0; i < max3; i++) {
    out[i] = f(i);
  }
  return out;
});
var fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
var ensure = (self) => Array.isArray(self) ? self : [self];
var match3 = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty());
var matchLeft = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty());
var prepend = /* @__PURE__ */ dual(2, (self, head4) => [head4, ...self]);
var append = /* @__PURE__ */ dual(2, (self, last3) => [...self, last3]);
var appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable(self).concat(fromIterable(that)));
var isArray = Array.isArray;
var isEmptyArray = (self) => self.length === 0;
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var isOutOfBounds = (i, as4) => i < 0 || i >= as4.length;
var clamp2 = (i, as4) => Math.floor(Math.min(Math.max(0, i), as4.length));
var get = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBounds(i, self) ? none2() : some2(self[i]);
});
var unsafeGet = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBounds(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
var head = /* @__PURE__ */ get(0);
var headNonEmpty = /* @__PURE__ */ unsafeGet(0);
var last = (self) => isNonEmptyReadonlyArray(self) ? some2(lastNonEmpty(self)) : none2();
var lastNonEmpty = (self) => self[self.length - 1];
var tailNonEmpty = (self) => self.slice(1);
var spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
};
var span = /* @__PURE__ */ dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
var drop = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self);
  return input.slice(clamp2(n, input), input.length);
});
var findFirst2 = findFirst;
var reverse = (self) => Array.from(self).reverse();
var sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
var zip = /* @__PURE__ */ dual(2, (self, that) => zipWith2(self, that, make3));
var zipWith2 = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as4 = fromIterable(self);
  const bs = fromIterable(that);
  if (isNonEmptyReadonlyArray(as4) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as4), headNonEmpty(bs))];
    const len = Math.min(as4.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as4[i], bs[i]);
    }
    return out;
  }
  return [];
});
var containsWith2 = (isEquivalent) => dual(2, (self, a) => {
  for (const i of self) {
    if (isEquivalent(a, i)) {
      return true;
    }
  }
  return false;
});
var _equivalence2 = /* @__PURE__ */ equivalence();
var splitAt = /* @__PURE__ */ dual(2, (self, n) => {
  const input = Array.from(self);
  const _n = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n);
    }
    return [[], input];
  }
  return [input, []];
});
var splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
  const _n = Math.max(1, Math.floor(n));
  return _n >= self.length ? [copy(self), []] : [prepend(self.slice(1, _n), headNonEmpty(self)), self.slice(_n)];
});
var copy = (self) => self.slice();
var unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
  const a = fromIterable(self);
  const b = fromIterable(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe2 = dedupeWith(isEquivalent);
      return dedupe2(appendAll(a, b));
    }
    return a;
  }
  return b;
});
var union = /* @__PURE__ */ dual(2, (self, that) => unionWith(self, that, _equivalence2));
var intersectionWith = (isEquivalent) => {
  const has8 = containsWith2(isEquivalent);
  return dual(2, (self, that) => fromIterable(self).filter((a) => has8(that, a)));
};
var intersection = /* @__PURE__ */ intersectionWith(_equivalence2);
var empty = () => [];
var of = (a) => [a];
var map3 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var flatMap3 = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    const inner = f(self[i], i);
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
var flatten = /* @__PURE__ */ flatMap3(identity);
var filterMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  const as4 = fromIterable(self);
  const out = [];
  for (let i = 0; i < as4.length; i++) {
    const o = f(as4[i], i);
    if (isSome2(o)) {
      out.push(o.value);
    }
  }
  return out;
});
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b));
var unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome2(o = f(next))) {
    const [a, b2] = o.value;
    out.push(a);
    next = b2;
  }
  return out;
};
var getEquivalence3 = array;
var dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input = fromIterable(self);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)];
    const rest = tailNonEmpty(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
var dedupe = (self) => dedupeWith(self, equivalence());
var join = /* @__PURE__ */ dual(2, (self, sep) => fromIterable(self).join(sep));

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/precondition/PreconditionFailure.js
var PreconditionFailure = class _PreconditionFailure extends Error {
  constructor(interruptExecution = false) {
    super();
    this.interruptExecution = interruptExecution;
    this.footprint = _PreconditionFailure.SharedFootPrint;
  }
  static isFailure(err2) {
    return err2 != null && err2.footprint === _PreconditionFailure.SharedFootPrint;
  }
};
PreconditionFailure.SharedFootPrint = Symbol.for("fast-check/PreconditionFailure");

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/stream/StreamHelpers.js
var Nil = class {
  [Symbol.iterator]() {
    return this;
  }
  next(value3) {
    return { value: value3, done: true };
  }
};
Nil.nil = new Nil();
function nilHelper() {
  return Nil.nil;
}
function* mapHelper(g, f) {
  for (const v of g) {
    yield f(v);
  }
}
function* flatMapHelper(g, f) {
  for (const v of g) {
    yield* f(v);
  }
}
function* filterHelper(g, f) {
  for (const v of g) {
    if (f(v)) {
      yield v;
    }
  }
}
function* takeNHelper(g, n) {
  for (let i = 0; i < n; ++i) {
    const cur = g.next();
    if (cur.done) {
      break;
    }
    yield cur.value;
  }
}
function* takeWhileHelper(g, f) {
  let cur = g.next();
  while (!cur.done && f(cur.value)) {
    yield cur.value;
    cur = g.next();
  }
}
function* joinHelper(g, others) {
  for (let cur = g.next(); !cur.done; cur = g.next()) {
    yield cur.value;
  }
  for (const s of others) {
    for (let cur = s.next(); !cur.done; cur = s.next()) {
      yield cur.value;
    }
  }
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/stream/Stream.js
var safeSymbolIterator = Symbol.iterator;
var Stream = class _Stream {
  static nil() {
    return new _Stream(nilHelper());
  }
  static of(...elements) {
    return new _Stream(elements[safeSymbolIterator]());
  }
  constructor(g) {
    this.g = g;
  }
  next() {
    return this.g.next();
  }
  [Symbol.iterator]() {
    return this.g;
  }
  map(f) {
    return new _Stream(mapHelper(this.g, f));
  }
  flatMap(f) {
    return new _Stream(flatMapHelper(this.g, f));
  }
  dropWhile(f) {
    let foundEligible = false;
    function* helper(v) {
      if (foundEligible || !f(v)) {
        foundEligible = true;
        yield v;
      }
    }
    return this.flatMap(helper);
  }
  drop(n) {
    if (n <= 0) {
      return this;
    }
    let idx = 0;
    function helper() {
      return idx++ < n;
    }
    return this.dropWhile(helper);
  }
  takeWhile(f) {
    return new _Stream(takeWhileHelper(this.g, f));
  }
  take(n) {
    return new _Stream(takeNHelper(this.g, n));
  }
  filter(f) {
    return new _Stream(filterHelper(this.g, f));
  }
  every(f) {
    for (const v of this.g) {
      if (!f(v)) {
        return false;
      }
    }
    return true;
  }
  has(f) {
    for (const v of this.g) {
      if (f(v)) {
        return [true, v];
      }
    }
    return [false, null];
  }
  join(...others) {
    return new _Stream(joinHelper(this.g, others));
  }
  getNthOrLast(nth) {
    let remaining = nth;
    let last3 = null;
    for (const v of this.g) {
      if (remaining-- === 0)
        return v;
      last3 = v;
    }
    return last3;
  }
};
function stream(g) {
  return new Stream(g);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/symbols.js
var cloneMethod = Symbol.for("fast-check/cloneMethod");
function hasCloneMethod(instance) {
  return instance !== null && (typeof instance === "object" || typeof instance === "function") && cloneMethod in instance && typeof instance[cloneMethod] === "function";
}
function cloneIfNeeded(instance) {
  return hasCloneMethod(instance) ? instance[cloneMethod]() : instance;
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/arbitrary/definition/Value.js
var safeObjectDefineProperty = Object.defineProperty;
var Value = class {
  constructor(value_, context3, customGetValue = void 0) {
    this.value_ = value_;
    this.context = context3;
    this.hasToBeCloned = customGetValue !== void 0 || hasCloneMethod(value_);
    this.readOnce = false;
    if (this.hasToBeCloned) {
      safeObjectDefineProperty(this, "value", { get: customGetValue !== void 0 ? customGetValue : this.getValue });
    } else {
      this.value = value_;
    }
  }
  getValue() {
    if (this.hasToBeCloned) {
      if (!this.readOnce) {
        this.readOnce = true;
        return this.value_;
      }
      return this.value_[cloneMethod]();
    }
    return this.value_;
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/arbitrary/definition/Arbitrary.js
var safeObjectAssign = Object.assign;
var Arbitrary = class {
  filter(refinement) {
    return new FilterArbitrary(this, refinement);
  }
  map(mapper, unmapper) {
    return new MapArbitrary(this, mapper, unmapper);
  }
  chain(chainer) {
    return new ChainArbitrary(this, chainer);
  }
  noShrink() {
    return new NoShrinkArbitrary(this);
  }
  noBias() {
    return new NoBiasArbitrary(this);
  }
};
var ChainArbitrary = class extends Arbitrary {
  constructor(arb, chainer) {
    super();
    this.arb = arb;
    this.chainer = chainer;
  }
  generate(mrng, biasFactor) {
    const clonedMrng = mrng.clone();
    const src = this.arb.generate(mrng, biasFactor);
    return this.valueChainer(src, mrng, clonedMrng, biasFactor);
  }
  canShrinkWithoutContext(value3) {
    return false;
  }
  shrink(value3, context3) {
    if (this.isSafeContext(context3)) {
      return (!context3.stoppedForOriginal ? this.arb.shrink(context3.originalValue, context3.originalContext).map((v) => this.valueChainer(v, context3.clonedMrng.clone(), context3.clonedMrng, context3.originalBias)) : Stream.nil()).join(context3.chainedArbitrary.shrink(value3, context3.chainedContext).map((dst) => {
        const newContext = safeObjectAssign(safeObjectAssign({}, context3), {
          chainedContext: dst.context,
          stoppedForOriginal: true
        });
        return new Value(dst.value_, newContext);
      }));
    }
    return Stream.nil();
  }
  valueChainer(v, generateMrng, clonedMrng, biasFactor) {
    const chainedArbitrary = this.chainer(v.value_);
    const dst = chainedArbitrary.generate(generateMrng, biasFactor);
    const context3 = {
      originalBias: biasFactor,
      originalValue: v.value_,
      originalContext: v.context,
      stoppedForOriginal: false,
      chainedArbitrary,
      chainedContext: dst.context,
      clonedMrng
    };
    return new Value(dst.value_, context3);
  }
  isSafeContext(context3) {
    return context3 != null && typeof context3 === "object" && "originalBias" in context3 && "originalValue" in context3 && "originalContext" in context3 && "stoppedForOriginal" in context3 && "chainedArbitrary" in context3 && "chainedContext" in context3 && "clonedMrng" in context3;
  }
};
var MapArbitrary = class extends Arbitrary {
  constructor(arb, mapper, unmapper) {
    super();
    this.arb = arb;
    this.mapper = mapper;
    this.unmapper = unmapper;
    this.bindValueMapper = (v) => this.valueMapper(v);
  }
  generate(mrng, biasFactor) {
    const g = this.arb.generate(mrng, biasFactor);
    return this.valueMapper(g);
  }
  canShrinkWithoutContext(value3) {
    if (this.unmapper !== void 0) {
      try {
        const unmapped = this.unmapper(value3);
        return this.arb.canShrinkWithoutContext(unmapped);
      } catch (_err) {
        return false;
      }
    }
    return false;
  }
  shrink(value3, context3) {
    if (this.isSafeContext(context3)) {
      return this.arb.shrink(context3.originalValue, context3.originalContext).map(this.bindValueMapper);
    }
    if (this.unmapper !== void 0) {
      const unmapped = this.unmapper(value3);
      return this.arb.shrink(unmapped, void 0).map(this.bindValueMapper);
    }
    return Stream.nil();
  }
  mapperWithCloneIfNeeded(v) {
    const sourceValue = v.value;
    const mappedValue = this.mapper(sourceValue);
    if (v.hasToBeCloned && (typeof mappedValue === "object" && mappedValue !== null || typeof mappedValue === "function") && Object.isExtensible(mappedValue) && !hasCloneMethod(mappedValue)) {
      Object.defineProperty(mappedValue, cloneMethod, { get: () => () => this.mapperWithCloneIfNeeded(v)[0] });
    }
    return [mappedValue, sourceValue];
  }
  valueMapper(v) {
    const [mappedValue, sourceValue] = this.mapperWithCloneIfNeeded(v);
    const context3 = { originalValue: sourceValue, originalContext: v.context };
    return new Value(mappedValue, context3);
  }
  isSafeContext(context3) {
    return context3 != null && typeof context3 === "object" && "originalValue" in context3 && "originalContext" in context3;
  }
};
var FilterArbitrary = class extends Arbitrary {
  constructor(arb, refinement) {
    super();
    this.arb = arb;
    this.refinement = refinement;
    this.bindRefinementOnValue = (v) => this.refinementOnValue(v);
  }
  generate(mrng, biasFactor) {
    while (true) {
      const g = this.arb.generate(mrng, biasFactor);
      if (this.refinementOnValue(g)) {
        return g;
      }
    }
  }
  canShrinkWithoutContext(value3) {
    return this.arb.canShrinkWithoutContext(value3) && this.refinement(value3);
  }
  shrink(value3, context3) {
    return this.arb.shrink(value3, context3).filter(this.bindRefinementOnValue);
  }
  refinementOnValue(v) {
    return this.refinement(v.value);
  }
};
var NoShrinkArbitrary = class extends Arbitrary {
  constructor(arb) {
    super();
    this.arb = arb;
  }
  generate(mrng, biasFactor) {
    return this.arb.generate(mrng, biasFactor);
  }
  canShrinkWithoutContext(value3) {
    return this.arb.canShrinkWithoutContext(value3);
  }
  shrink(_value, _context) {
    return Stream.nil();
  }
  noShrink() {
    return this;
  }
};
var NoBiasArbitrary = class extends Arbitrary {
  constructor(arb) {
    super();
    this.arb = arb;
  }
  generate(mrng, _biasFactor) {
    return this.arb.generate(mrng, void 0);
  }
  canShrinkWithoutContext(value3) {
    return this.arb.canShrinkWithoutContext(value3);
  }
  shrink(value3, context3) {
    return this.arb.shrink(value3, context3);
  }
  noBias() {
    return this;
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/utils/apply.js
var untouchedApply = Function.prototype.apply;
var ApplySymbol = Symbol("apply");
function safeExtractApply(f) {
  try {
    return f.apply;
  } catch (err2) {
    return void 0;
  }
}
function safeApplyHacky(f, instance, args2) {
  const ff = f;
  ff[ApplySymbol] = untouchedApply;
  const out = ff[ApplySymbol](instance, args2);
  delete ff[ApplySymbol];
  return out;
}
function safeApply(f, instance, args2) {
  if (safeExtractApply(f) === untouchedApply) {
    return f.apply(instance, args2);
  }
  return safeApplyHacky(f, instance, args2);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/utils/globals.js
var SArray = typeof Array !== "undefined" ? Array : void 0;
var SError = typeof Error !== "undefined" ? Error : void 0;
var SString = typeof String !== "undefined" ? String : void 0;
var SencodeURIComponent = typeof encodeURIComponent !== "undefined" ? encodeURIComponent : void 0;
var SSymbol = Symbol;
var untouchedForEach = Array.prototype.forEach;
var untouchedIndexOf = Array.prototype.indexOf;
var untouchedJoin = Array.prototype.join;
var untouchedMap = Array.prototype.map;
var untouchedFilter = Array.prototype.filter;
var untouchedPush = Array.prototype.push;
var untouchedPop = Array.prototype.pop;
var untouchedSplice = Array.prototype.splice;
var untouchedSlice = Array.prototype.slice;
var untouchedSort = Array.prototype.sort;
var untouchedEvery = Array.prototype.every;
function extractIndexOf(instance) {
  try {
    return instance.indexOf;
  } catch (err2) {
    return void 0;
  }
}
function extractJoin(instance) {
  try {
    return instance.join;
  } catch (err2) {
    return void 0;
  }
}
function extractMap(instance) {
  try {
    return instance.map;
  } catch (err2) {
    return void 0;
  }
}
function extractFilter(instance) {
  try {
    return instance.filter;
  } catch (err2) {
    return void 0;
  }
}
function extractPush(instance) {
  try {
    return instance.push;
  } catch (err2) {
    return void 0;
  }
}
function extractSlice(instance) {
  try {
    return instance.slice;
  } catch (err2) {
    return void 0;
  }
}
function safeIndexOf(instance, ...args2) {
  if (extractIndexOf(instance) === untouchedIndexOf) {
    return instance.indexOf(...args2);
  }
  return safeApply(untouchedIndexOf, instance, args2);
}
function safeJoin(instance, ...args2) {
  if (extractJoin(instance) === untouchedJoin) {
    return instance.join(...args2);
  }
  return safeApply(untouchedJoin, instance, args2);
}
function safeMap(instance, fn) {
  if (extractMap(instance) === untouchedMap) {
    return instance.map(fn);
  }
  return safeApply(untouchedMap, instance, [fn]);
}
function safeFilter(instance, predicate) {
  if (extractFilter(instance) === untouchedFilter) {
    return instance.filter(predicate);
  }
  return safeApply(untouchedFilter, instance, [predicate]);
}
function safePush(instance, ...args2) {
  if (extractPush(instance) === untouchedPush) {
    return instance.push(...args2);
  }
  return safeApply(untouchedPush, instance, args2);
}
function safeSlice(instance, ...args2) {
  if (extractSlice(instance) === untouchedSlice) {
    return instance.slice(...args2);
  }
  return safeApply(untouchedSlice, instance, args2);
}
var untouchedGetTime = Date.prototype.getTime;
var untouchedToISOString = Date.prototype.toISOString;
function extractGetTime(instance) {
  try {
    return instance.getTime;
  } catch (err2) {
    return void 0;
  }
}
function extractToISOString(instance) {
  try {
    return instance.toISOString;
  } catch (err2) {
    return void 0;
  }
}
function safeGetTime(instance) {
  if (extractGetTime(instance) === untouchedGetTime) {
    return instance.getTime();
  }
  return safeApply(untouchedGetTime, instance, []);
}
function safeToISOString(instance) {
  if (extractToISOString(instance) === untouchedToISOString) {
    return instance.toISOString();
  }
  return safeApply(untouchedToISOString, instance, []);
}
var untouchedAdd = Set.prototype.add;
var untouchedHas = Set.prototype.has;
var untouchedSet = WeakMap.prototype.set;
var untouchedGet = WeakMap.prototype.get;
var untouchedMapSet = Map.prototype.set;
var untouchedMapGet = Map.prototype.get;
function extractMapSet(instance) {
  try {
    return instance.set;
  } catch (err2) {
    return void 0;
  }
}
function extractMapGet(instance) {
  try {
    return instance.get;
  } catch (err2) {
    return void 0;
  }
}
function safeMapSet(instance, key, value3) {
  if (extractMapSet(instance) === untouchedMapSet) {
    return instance.set(key, value3);
  }
  return safeApply(untouchedMapSet, instance, [key, value3]);
}
function safeMapGet(instance, key) {
  if (extractMapGet(instance) === untouchedMapGet) {
    return instance.get(key);
  }
  return safeApply(untouchedMapGet, instance, [key]);
}
var untouchedSplit = String.prototype.split;
var untouchedStartsWith = String.prototype.startsWith;
var untouchedEndsWith = String.prototype.endsWith;
var untouchedSubstring = String.prototype.substring;
var untouchedToLowerCase = String.prototype.toLowerCase;
var untouchedToUpperCase = String.prototype.toUpperCase;
var untouchedPadStart = String.prototype.padStart;
var untouchedCharCodeAt = String.prototype.charCodeAt;
var untouchedNormalize = String.prototype.normalize;
var untouchedReplace = String.prototype.replace;
function extractSplit(instance) {
  try {
    return instance.split;
  } catch (err2) {
    return void 0;
  }
}
function extractCharCodeAt(instance) {
  try {
    return instance.charCodeAt;
  } catch (err2) {
    return void 0;
  }
}
function safeSplit(instance, ...args2) {
  if (extractSplit(instance) === untouchedSplit) {
    return instance.split(...args2);
  }
  return safeApply(untouchedSplit, instance, args2);
}
function safeCharCodeAt(instance, index) {
  if (extractCharCodeAt(instance) === untouchedCharCodeAt) {
    return instance.charCodeAt(index);
  }
  return safeApply(untouchedCharCodeAt, instance, [index]);
}
var untouchedNumberToString = Number.prototype.toString;
function extractNumberToString(instance) {
  try {
    return instance.toString;
  } catch (err2) {
    return void 0;
  }
}
function safeNumberToString(instance, ...args2) {
  if (extractNumberToString(instance) === untouchedNumberToString) {
    return instance.toString(...args2);
  }
  return safeApply(untouchedNumberToString, instance, args2);
}
var untouchedToString = Object.prototype.toString;
function safeToString(instance) {
  return safeApply(untouchedToString, instance, []);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/stream/LazyIterableIterator.js
var LazyIterableIterator = class {
  constructor(producer) {
    this.producer = producer;
  }
  [Symbol.iterator]() {
    if (this.it === void 0) {
      this.it = this.producer();
    }
    return this.it;
  }
  next() {
    if (this.it === void 0) {
      this.it = this.producer();
    }
    return this.it.next();
  }
};
function makeLazy(producer) {
  return new LazyIterableIterator(producer);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/TupleArbitrary.js
var safeArrayIsArray = Array.isArray;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/property/IRawProperty.js
var safeMathLog = Math.log;
function runIdToFrequency(runId) {
  return 2 + ~~(safeMathLog(runId + 1) * 0.4342944819032518);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/configuration/GlobalParameters.js
var globalParameters = {};
function readConfigureGlobal() {
  return globalParameters;
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/NoUndefinedAsContext.js
var UndefinedContextPlaceholder = Symbol("UndefinedContextPlaceholder");
function noUndefinedAsContext(value3) {
  if (value3.context !== void 0) {
    return value3;
  }
  if (value3.hasToBeCloned) {
    return new Value(value3.value_, UndefinedContextPlaceholder, () => value3.value);
  }
  return new Value(value3.value_, UndefinedContextPlaceholder);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/property/AsyncProperty.generic.js
var AsyncProperty = class _AsyncProperty {
  constructor(arb, predicate) {
    this.arb = arb;
    this.predicate = predicate;
    const { asyncBeforeEach, asyncAfterEach, beforeEach, afterEach } = readConfigureGlobal() || {};
    if (asyncBeforeEach !== void 0 && beforeEach !== void 0) {
      throw SError(`Global "asyncBeforeEach" and "beforeEach" parameters can't be set at the same time when running async properties`);
    }
    if (asyncAfterEach !== void 0 && afterEach !== void 0) {
      throw SError(`Global "asyncAfterEach" and "afterEach" parameters can't be set at the same time when running async properties`);
    }
    this.beforeEachHook = asyncBeforeEach || beforeEach || _AsyncProperty.dummyHook;
    this.afterEachHook = asyncAfterEach || afterEach || _AsyncProperty.dummyHook;
  }
  isAsync() {
    return true;
  }
  generate(mrng, runId) {
    const value3 = this.arb.generate(mrng, runId != null ? runIdToFrequency(runId) : void 0);
    return noUndefinedAsContext(value3);
  }
  shrink(value3) {
    if (value3.context === void 0 && !this.arb.canShrinkWithoutContext(value3.value_)) {
      return Stream.nil();
    }
    const safeContext = value3.context !== UndefinedContextPlaceholder ? value3.context : void 0;
    return this.arb.shrink(value3.value_, safeContext).map(noUndefinedAsContext);
  }
  async runBeforeEach() {
    await this.beforeEachHook();
  }
  async runAfterEach() {
    await this.afterEachHook();
  }
  async run(v, dontRunHook) {
    if (!dontRunHook) {
      await this.beforeEachHook();
    }
    try {
      const output = await this.predicate(v);
      return output == null || output === true ? null : {
        error: new SError("Property failed by returning false"),
        errorMessage: "Error: Property failed by returning false"
      };
    } catch (err2) {
      if (PreconditionFailure.isFailure(err2))
        return err2;
      if (err2 instanceof SError && err2.stack) {
        return { error: err2, errorMessage: err2.stack };
      }
      return { error: err2, errorMessage: SString(err2) };
    } finally {
      if (!dontRunHook) {
        await this.afterEachHook();
      }
    }
  }
  beforeEach(hookFunction) {
    const previousBeforeEachHook = this.beforeEachHook;
    this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
    return this;
  }
  afterEach(hookFunction) {
    const previousAfterEachHook = this.afterEachHook;
    this.afterEachHook = () => hookFunction(previousAfterEachHook);
    return this;
  }
};
AsyncProperty.dummyHook = () => {
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/property/Property.generic.js
var Property = class _Property {
  constructor(arb, predicate) {
    this.arb = arb;
    this.predicate = predicate;
    const { beforeEach = _Property.dummyHook, afterEach = _Property.dummyHook, asyncBeforeEach, asyncAfterEach } = readConfigureGlobal() || {};
    if (asyncBeforeEach !== void 0) {
      throw SError(`"asyncBeforeEach" can't be set when running synchronous properties`);
    }
    if (asyncAfterEach !== void 0) {
      throw SError(`"asyncAfterEach" can't be set when running synchronous properties`);
    }
    this.beforeEachHook = beforeEach;
    this.afterEachHook = afterEach;
  }
  isAsync() {
    return false;
  }
  generate(mrng, runId) {
    const value3 = this.arb.generate(mrng, runId != null ? runIdToFrequency(runId) : void 0);
    return noUndefinedAsContext(value3);
  }
  shrink(value3) {
    if (value3.context === void 0 && !this.arb.canShrinkWithoutContext(value3.value_)) {
      return Stream.nil();
    }
    const safeContext = value3.context !== UndefinedContextPlaceholder ? value3.context : void 0;
    return this.arb.shrink(value3.value_, safeContext).map(noUndefinedAsContext);
  }
  runBeforeEach() {
    this.beforeEachHook();
  }
  runAfterEach() {
    this.afterEachHook();
  }
  run(v, dontRunHook) {
    if (!dontRunHook) {
      this.beforeEachHook();
    }
    try {
      const output = this.predicate(v);
      return output == null || output === true ? null : {
        error: new SError("Property failed by returning false"),
        errorMessage: "Error: Property failed by returning false"
      };
    } catch (err2) {
      if (PreconditionFailure.isFailure(err2))
        return err2;
      if (err2 instanceof SError && err2.stack) {
        return { error: err2, errorMessage: err2.stack };
      }
      return { error: err2, errorMessage: SString(err2) };
    } finally {
      if (!dontRunHook) {
        this.afterEachHook();
      }
    }
  }
  beforeEach(hookFunction) {
    const previousBeforeEachHook = this.beforeEachHook;
    this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
    return this;
  }
  afterEach(hookFunction) {
    const previousAfterEachHook = this.afterEachHook;
    this.afterEachHook = () => hookFunction(previousAfterEachHook);
    return this;
  }
};
Property.dummyHook = () => {
};

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/pure-rand-default.js
var pure_rand_default_exports = {};
__export(pure_rand_default_exports, {
  __commitHash: () => __commitHash,
  __type: () => __type,
  __version: () => __version,
  congruential32: () => congruential32,
  generateN: () => generateN,
  mersenne: () => MersenneTwister_default,
  skipN: () => skipN,
  uniformArrayIntDistribution: () => uniformArrayIntDistribution,
  uniformBigIntDistribution: () => uniformBigIntDistribution,
  uniformIntDistribution: () => uniformIntDistribution,
  unsafeGenerateN: () => unsafeGenerateN,
  unsafeSkipN: () => unsafeSkipN,
  unsafeUniformArrayIntDistribution: () => unsafeUniformArrayIntDistribution,
  unsafeUniformBigIntDistribution: () => unsafeUniformBigIntDistribution,
  unsafeUniformIntDistribution: () => unsafeUniformIntDistribution,
  xoroshiro128plus: () => xoroshiro128plus,
  xorshift128plus: () => xorshift128plus
});

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/generator/RandomGenerator.js
function unsafeGenerateN(rng, num) {
  var out = [];
  for (var idx = 0; idx != num; ++idx) {
    out.push(rng.unsafeNext());
  }
  return out;
}
function generateN(rng, num) {
  var nextRng = rng.clone();
  var out = unsafeGenerateN(nextRng, num);
  return [out, nextRng];
}
function unsafeSkipN(rng, num) {
  for (var idx = 0; idx != num; ++idx) {
    rng.unsafeNext();
  }
}
function skipN(rng, num) {
  var nextRng = rng.clone();
  unsafeSkipN(nextRng, num);
  return nextRng;
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/generator/LinearCongruential.js
var MULTIPLIER = 214013;
var INCREMENT = 2531011;
var MASK = 4294967295;
var MASK_2 = (1 << 31) - 1;
var computeNextSeed = function(seed) {
  return seed * MULTIPLIER + INCREMENT & MASK;
};
var computeValueFromNextSeed = function(nextseed) {
  return (nextseed & MASK_2) >> 16;
};
var LinearCongruential32 = function() {
  function LinearCongruential322(seed) {
    this.seed = seed;
  }
  LinearCongruential322.prototype.clone = function() {
    return new LinearCongruential322(this.seed);
  };
  LinearCongruential322.prototype.next = function() {
    var nextRng = new LinearCongruential322(this.seed);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  LinearCongruential322.prototype.unsafeNext = function() {
    var s1 = computeNextSeed(this.seed);
    var v1 = computeValueFromNextSeed(s1);
    var s2 = computeNextSeed(s1);
    var v2 = computeValueFromNextSeed(s2);
    this.seed = computeNextSeed(s2);
    var v3 = computeValueFromNextSeed(this.seed);
    var vnext = v3 + (v2 + (v1 << 15) << 15);
    return vnext | 0;
  };
  LinearCongruential322.prototype.getState = function() {
    return [this.seed];
  };
  return LinearCongruential322;
}();
function fromState(state) {
  var valid = state.length === 1;
  if (!valid) {
    throw new Error("The state must have been produced by a congruential32 RandomGenerator");
  }
  return new LinearCongruential32(state[0]);
}
var congruential32 = Object.assign(function(seed) {
  return new LinearCongruential32(seed);
}, { fromState });

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/generator/MersenneTwister.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from, pack2) {
  if (pack2 || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var MersenneTwister = function() {
  function MersenneTwister2(states, index) {
    this.states = states;
    this.index = index;
  }
  MersenneTwister2.twist = function(prev) {
    var mt = prev.slice();
    for (var idx = 0; idx !== MersenneTwister2.N - MersenneTwister2.M; ++idx) {
      var y_1 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
      mt[idx] = mt[idx + MersenneTwister2.M] ^ y_1 >>> 1 ^ -(y_1 & 1) & MersenneTwister2.A;
    }
    for (var idx = MersenneTwister2.N - MersenneTwister2.M; idx !== MersenneTwister2.N - 1; ++idx) {
      var y_2 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
      mt[idx] = mt[idx + MersenneTwister2.M - MersenneTwister2.N] ^ y_2 >>> 1 ^ -(y_2 & 1) & MersenneTwister2.A;
    }
    var y = (mt[MersenneTwister2.N - 1] & MersenneTwister2.MASK_UPPER) + (mt[0] & MersenneTwister2.MASK_LOWER);
    mt[MersenneTwister2.N - 1] = mt[MersenneTwister2.M - 1] ^ y >>> 1 ^ -(y & 1) & MersenneTwister2.A;
    return mt;
  };
  MersenneTwister2.seeded = function(seed) {
    var out = Array(MersenneTwister2.N);
    out[0] = seed;
    for (var idx = 1; idx !== MersenneTwister2.N; ++idx) {
      var xored = out[idx - 1] ^ out[idx - 1] >>> 30;
      out[idx] = Math.imul(MersenneTwister2.F, xored) + idx | 0;
    }
    return out;
  };
  MersenneTwister2.from = function(seed) {
    return new MersenneTwister2(MersenneTwister2.twist(MersenneTwister2.seeded(seed)), 0);
  };
  MersenneTwister2.prototype.clone = function() {
    return new MersenneTwister2(this.states, this.index);
  };
  MersenneTwister2.prototype.next = function() {
    var nextRng = new MersenneTwister2(this.states, this.index);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  MersenneTwister2.prototype.unsafeNext = function() {
    var y = this.states[this.index];
    y ^= this.states[this.index] >>> MersenneTwister2.U;
    y ^= y << MersenneTwister2.S & MersenneTwister2.B;
    y ^= y << MersenneTwister2.T & MersenneTwister2.C;
    y ^= y >>> MersenneTwister2.L;
    if (++this.index >= MersenneTwister2.N) {
      this.states = MersenneTwister2.twist(this.states);
      this.index = 0;
    }
    return y;
  };
  MersenneTwister2.prototype.getState = function() {
    return __spreadArray([this.index], __read(this.states), false);
  };
  MersenneTwister2.fromState = function(state) {
    var valid = state.length === MersenneTwister2.N + 1 && state[0] >= 0 && state[0] < MersenneTwister2.N;
    if (!valid) {
      throw new Error("The state must have been produced by a mersenne RandomGenerator");
    }
    return new MersenneTwister2(state.slice(1), state[0]);
  };
  MersenneTwister2.N = 624;
  MersenneTwister2.M = 397;
  MersenneTwister2.R = 31;
  MersenneTwister2.A = 2567483615;
  MersenneTwister2.F = 1812433253;
  MersenneTwister2.U = 11;
  MersenneTwister2.S = 7;
  MersenneTwister2.B = 2636928640;
  MersenneTwister2.T = 15;
  MersenneTwister2.C = 4022730752;
  MersenneTwister2.L = 18;
  MersenneTwister2.MASK_LOWER = Math.pow(2, MersenneTwister2.R) - 1;
  MersenneTwister2.MASK_UPPER = Math.pow(2, MersenneTwister2.R);
  return MersenneTwister2;
}();
function fromState2(state) {
  return MersenneTwister.fromState(state);
}
var MersenneTwister_default = Object.assign(function(seed) {
  return MersenneTwister.from(seed);
}, { fromState: fromState2 });

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/generator/XorShift.js
var XorShift128Plus = function() {
  function XorShift128Plus2(s01, s00, s11, s10) {
    this.s01 = s01;
    this.s00 = s00;
    this.s11 = s11;
    this.s10 = s10;
  }
  XorShift128Plus2.prototype.clone = function() {
    return new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
  };
  XorShift128Plus2.prototype.next = function() {
    var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  XorShift128Plus2.prototype.unsafeNext = function() {
    var a0 = this.s00 ^ this.s00 << 23;
    var a1 = this.s01 ^ (this.s01 << 23 | this.s00 >>> 9);
    var b0 = a0 ^ this.s10 ^ (a0 >>> 18 | a1 << 14) ^ (this.s10 >>> 5 | this.s11 << 27);
    var b1 = a1 ^ this.s11 ^ a1 >>> 18 ^ this.s11 >>> 5;
    var out = this.s00 + this.s10 | 0;
    this.s01 = this.s11;
    this.s00 = this.s10;
    this.s11 = b1;
    this.s10 = b0;
    return out;
  };
  XorShift128Plus2.prototype.jump = function() {
    var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
    nextRng.unsafeJump();
    return nextRng;
  };
  XorShift128Plus2.prototype.unsafeJump = function() {
    var ns01 = 0;
    var ns00 = 0;
    var ns11 = 0;
    var ns10 = 0;
    var jump = [1667051007, 2321340297, 1548169110, 304075285];
    for (var i = 0; i !== 4; ++i) {
      for (var mask = 1; mask; mask <<= 1) {
        if (jump[i] & mask) {
          ns01 ^= this.s01;
          ns00 ^= this.s00;
          ns11 ^= this.s11;
          ns10 ^= this.s10;
        }
        this.unsafeNext();
      }
    }
    this.s01 = ns01;
    this.s00 = ns00;
    this.s11 = ns11;
    this.s10 = ns10;
  };
  XorShift128Plus2.prototype.getState = function() {
    return [this.s01, this.s00, this.s11, this.s10];
  };
  return XorShift128Plus2;
}();
function fromState3(state) {
  var valid = state.length === 4;
  if (!valid) {
    throw new Error("The state must have been produced by a xorshift128plus RandomGenerator");
  }
  return new XorShift128Plus(state[0], state[1], state[2], state[3]);
}
var xorshift128plus = Object.assign(function(seed) {
  return new XorShift128Plus(-1, ~seed, seed | 0, 0);
}, { fromState: fromState3 });

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/generator/XoroShiro.js
var XoroShiro128Plus = function() {
  function XoroShiro128Plus2(s01, s00, s11, s10) {
    this.s01 = s01;
    this.s00 = s00;
    this.s11 = s11;
    this.s10 = s10;
  }
  XoroShiro128Plus2.prototype.clone = function() {
    return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
  };
  XoroShiro128Plus2.prototype.next = function() {
    var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  XoroShiro128Plus2.prototype.unsafeNext = function() {
    var out = this.s00 + this.s10 | 0;
    var a0 = this.s10 ^ this.s00;
    var a1 = this.s11 ^ this.s01;
    var s00 = this.s00;
    var s01 = this.s01;
    this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
    this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
    this.s10 = a1 << 5 ^ a0 >>> 27;
    this.s11 = a0 << 5 ^ a1 >>> 27;
    return out;
  };
  XoroShiro128Plus2.prototype.jump = function() {
    var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
    nextRng.unsafeJump();
    return nextRng;
  };
  XoroShiro128Plus2.prototype.unsafeJump = function() {
    var ns01 = 0;
    var ns00 = 0;
    var ns11 = 0;
    var ns10 = 0;
    var jump = [3639956645, 3750757012, 1261568508, 386426335];
    for (var i = 0; i !== 4; ++i) {
      for (var mask = 1; mask; mask <<= 1) {
        if (jump[i] & mask) {
          ns01 ^= this.s01;
          ns00 ^= this.s00;
          ns11 ^= this.s11;
          ns10 ^= this.s10;
        }
        this.unsafeNext();
      }
    }
    this.s01 = ns01;
    this.s00 = ns00;
    this.s11 = ns11;
    this.s10 = ns10;
  };
  XoroShiro128Plus2.prototype.getState = function() {
    return [this.s01, this.s00, this.s11, this.s10];
  };
  return XoroShiro128Plus2;
}();
function fromState4(state) {
  var valid = state.length === 4;
  if (!valid) {
    throw new Error("The state must have been produced by a xoroshiro128plus RandomGenerator");
  }
  return new XoroShiro128Plus(state[0], state[1], state[2], state[3]);
}
var xoroshiro128plus = Object.assign(function(seed) {
  return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
}, { fromState: fromState4 });

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/internals/ArrayInt.js
function addArrayIntToNew(arrayIntA, arrayIntB) {
  if (arrayIntA.sign !== arrayIntB.sign) {
    return substractArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
  }
  var data = [];
  var reminder = 0;
  var dataA = arrayIntA.data;
  var dataB = arrayIntB.data;
  for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    var current = vA + vB + reminder;
    data.push(current >>> 0);
    reminder = ~~(current / 4294967296);
  }
  if (reminder !== 0) {
    data.push(reminder);
  }
  return { sign: arrayIntA.sign, data: data.reverse() };
}
function addOneToPositiveArrayInt(arrayInt) {
  arrayInt.sign = 1;
  var data = arrayInt.data;
  for (var index = data.length - 1; index >= 0; --index) {
    if (data[index] === 4294967295) {
      data[index] = 0;
    } else {
      data[index] += 1;
      return arrayInt;
    }
  }
  data.unshift(1);
  return arrayInt;
}
function isStrictlySmaller(dataA, dataB) {
  var maxLength2 = Math.max(dataA.length, dataB.length);
  for (var index = 0; index < maxLength2; ++index) {
    var indexA = index + dataA.length - maxLength2;
    var indexB = index + dataB.length - maxLength2;
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    if (vA < vB)
      return true;
    if (vA > vB)
      return false;
  }
  return false;
}
function substractArrayIntToNew(arrayIntA, arrayIntB) {
  if (arrayIntA.sign !== arrayIntB.sign) {
    return addArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
  }
  var dataA = arrayIntA.data;
  var dataB = arrayIntB.data;
  if (isStrictlySmaller(dataA, dataB)) {
    var out = substractArrayIntToNew(arrayIntB, arrayIntA);
    out.sign = -out.sign;
    return out;
  }
  var data = [];
  var reminder = 0;
  for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    var current = vA - vB - reminder;
    data.push(current >>> 0);
    reminder = current < 0 ? 1 : 0;
  }
  return { sign: arrayIntA.sign, data: data.reverse() };
}
function trimArrayIntInplace(arrayInt) {
  var data = arrayInt.data;
  var firstNonZero = 0;
  for (; firstNonZero !== data.length && data[firstNonZero] === 0; ++firstNonZero) {
  }
  if (firstNonZero === data.length) {
    arrayInt.sign = 1;
    arrayInt.data = [0];
    return arrayInt;
  }
  data.splice(0, firstNonZero);
  return arrayInt;
}
function fromNumberToArrayInt64(out, n) {
  if (n < 0) {
    var posN = -n;
    out.sign = -1;
    out.data[0] = ~~(posN / 4294967296);
    out.data[1] = posN >>> 0;
  } else {
    out.sign = 1;
    out.data[0] = ~~(n / 4294967296);
    out.data[1] = n >>> 0;
  }
  return out;
}
function substractArrayInt64(out, arrayIntA, arrayIntB) {
  var lowA = arrayIntA.data[1];
  var highA = arrayIntA.data[0];
  var signA = arrayIntA.sign;
  var lowB = arrayIntB.data[1];
  var highB = arrayIntB.data[0];
  var signB = arrayIntB.sign;
  out.sign = 1;
  if (signA === 1 && signB === -1) {
    var low_1 = lowA + lowB;
    var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
    out.data[0] = high >>> 0;
    out.data[1] = low_1 >>> 0;
    return out;
  }
  var lowFirst = lowA;
  var highFirst = highA;
  var lowSecond = lowB;
  var highSecond = highB;
  if (signA === -1) {
    lowFirst = lowB;
    highFirst = highB;
    lowSecond = lowA;
    highSecond = highA;
  }
  var reminderLow = 0;
  var low = lowFirst - lowSecond;
  if (low < 0) {
    reminderLow = 1;
    low = low >>> 0;
  }
  out.data[0] = highFirst - highSecond - reminderLow;
  out.data[1] = low;
  return out;
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformIntDistributionInternal.js
function unsafeUniformIntDistributionInternal(rangeSize, rng) {
  var MaxAllowed = rangeSize > 2 ? ~~(4294967296 / rangeSize) * rangeSize : 4294967296;
  var deltaV = rng.unsafeNext() + 2147483648;
  while (deltaV >= MaxAllowed) {
    deltaV = rng.unsafeNext() + 2147483648;
  }
  return deltaV % rangeSize;
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js
function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
  var rangeLength = rangeSize.length;
  while (true) {
    for (var index = 0; index !== rangeLength; ++index) {
      var indexRangeSize = index === 0 ? rangeSize[0] + 1 : 4294967296;
      var g = unsafeUniformIntDistributionInternal(indexRangeSize, rng);
      out[index] = g;
    }
    for (var index = 0; index !== rangeLength; ++index) {
      var current = out[index];
      var currentInRange = rangeSize[index];
      if (current < currentInRange) {
        return out;
      } else if (current > currentInRange) {
        break;
      }
    }
  }
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UnsafeUniformArrayIntDistribution.js
function unsafeUniformArrayIntDistribution(from, to, rng) {
  var rangeSize = trimArrayIntInplace(addOneToPositiveArrayInt(substractArrayIntToNew(to, from)));
  var emptyArrayIntData = rangeSize.data.slice(0);
  var g = unsafeUniformArrayIntDistributionInternal(emptyArrayIntData, rangeSize.data, rng);
  return trimArrayIntInplace(addArrayIntToNew({ sign: 1, data: g }, from));
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UniformArrayIntDistribution.js
function uniformArrayIntDistribution(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformArrayIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformArrayIntDistribution(from, to, nextRng2), nextRng2];
  };
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UnsafeUniformBigIntDistribution.js
var SBigInt = typeof BigInt !== "undefined" ? BigInt : void 0;
function unsafeUniformBigIntDistribution(from, to, rng) {
  var diff8 = to - from + SBigInt(1);
  var MinRng = SBigInt(-2147483648);
  var NumValues = SBigInt(4294967296);
  var FinalNumValues = NumValues;
  var NumIterations = 1;
  while (FinalNumValues < diff8) {
    FinalNumValues *= NumValues;
    ++NumIterations;
  }
  var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff8;
  while (true) {
    var value3 = SBigInt(0);
    for (var num = 0; num !== NumIterations; ++num) {
      var out = rng.unsafeNext();
      value3 = NumValues * value3 + (SBigInt(out) - MinRng);
    }
    if (value3 < MaxAcceptedRandom) {
      var inDiff = value3 % diff8;
      return inDiff + from;
    }
  }
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UniformBigIntDistribution.js
function uniformBigIntDistribution(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformBigIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformBigIntDistribution(from, to, nextRng2), nextRng2];
  };
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UnsafeUniformIntDistribution.js
var safeNumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
var sharedA = { sign: 1, data: [0, 0] };
var sharedB = { sign: 1, data: [0, 0] };
var sharedC = { sign: 1, data: [0, 0] };
var sharedData = [0, 0];
function uniformLargeIntInternal(from, to, rangeSize, rng) {
  var rangeSizeArrayIntValue = rangeSize <= safeNumberMaxSafeInteger ? fromNumberToArrayInt64(sharedC, rangeSize) : substractArrayInt64(sharedC, fromNumberToArrayInt64(sharedA, to), fromNumberToArrayInt64(sharedB, from));
  if (rangeSizeArrayIntValue.data[1] === 4294967295) {
    rangeSizeArrayIntValue.data[0] += 1;
    rangeSizeArrayIntValue.data[1] = 0;
  } else {
    rangeSizeArrayIntValue.data[1] += 1;
  }
  unsafeUniformArrayIntDistributionInternal(sharedData, rangeSizeArrayIntValue.data, rng);
  return sharedData[0] * 4294967296 + sharedData[1] + from;
}
function unsafeUniformIntDistribution(from, to, rng) {
  var rangeSize = to - from;
  if (rangeSize <= 4294967295) {
    var g = unsafeUniformIntDistributionInternal(rangeSize + 1, rng);
    return g + from;
  }
  return uniformLargeIntInternal(from, to, rangeSize, rng);
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/distribution/UniformIntDistribution.js
function uniformIntDistribution(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformIntDistribution(from, to, nextRng2), nextRng2];
  };
}

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/pure-rand-default.js
var __type = "module";
var __version = "6.1.0";
var __commitHash = "a413dd2b721516be2ef29adffb515c5ae67bfbad";

// ../../node_modules/.pnpm/pure-rand@6.1.0/node_modules/pure-rand/lib/esm/pure-rand.js
var pure_rand_default = pure_rand_default_exports;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/configuration/VerbosityLevel.js
var VerbosityLevel;
(function(VerbosityLevel2) {
  VerbosityLevel2[VerbosityLevel2["None"] = 0] = "None";
  VerbosityLevel2[VerbosityLevel2["Verbose"] = 1] = "Verbose";
  VerbosityLevel2[VerbosityLevel2["VeryVerbose"] = 2] = "VeryVerbose";
})(VerbosityLevel || (VerbosityLevel = {}));

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/configuration/QualifiedParameters.js
var safeDateNow = Date.now;
var safeMathMin = Math.min;
var safeMathRandom = Math.random;
var QualifiedParameters = class _QualifiedParameters {
  constructor(op) {
    const p = op || {};
    this.seed = _QualifiedParameters.readSeed(p);
    this.randomType = _QualifiedParameters.readRandomType(p);
    this.numRuns = _QualifiedParameters.readNumRuns(p);
    this.verbose = _QualifiedParameters.readVerbose(p);
    this.maxSkipsPerRun = _QualifiedParameters.readOrDefault(p, "maxSkipsPerRun", 100);
    this.timeout = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "timeout", null));
    this.skipAllAfterTimeLimit = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "skipAllAfterTimeLimit", null));
    this.interruptAfterTimeLimit = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "interruptAfterTimeLimit", null));
    this.markInterruptAsFailure = _QualifiedParameters.readBoolean(p, "markInterruptAsFailure");
    this.skipEqualValues = _QualifiedParameters.readBoolean(p, "skipEqualValues");
    this.ignoreEqualValues = _QualifiedParameters.readBoolean(p, "ignoreEqualValues");
    this.logger = _QualifiedParameters.readOrDefault(p, "logger", (v) => {
      console.log(v);
    });
    this.path = _QualifiedParameters.readOrDefault(p, "path", "");
    this.unbiased = _QualifiedParameters.readBoolean(p, "unbiased");
    this.examples = _QualifiedParameters.readOrDefault(p, "examples", []);
    this.endOnFailure = _QualifiedParameters.readBoolean(p, "endOnFailure");
    this.reporter = _QualifiedParameters.readOrDefault(p, "reporter", null);
    this.asyncReporter = _QualifiedParameters.readOrDefault(p, "asyncReporter", null);
    this.errorWithCause = _QualifiedParameters.readBoolean(p, "errorWithCause");
  }
  toParameters() {
    const orUndefined2 = (value3) => value3 !== null ? value3 : void 0;
    const parameters = {
      seed: this.seed,
      randomType: this.randomType,
      numRuns: this.numRuns,
      maxSkipsPerRun: this.maxSkipsPerRun,
      timeout: orUndefined2(this.timeout),
      skipAllAfterTimeLimit: orUndefined2(this.skipAllAfterTimeLimit),
      interruptAfterTimeLimit: orUndefined2(this.interruptAfterTimeLimit),
      markInterruptAsFailure: this.markInterruptAsFailure,
      skipEqualValues: this.skipEqualValues,
      ignoreEqualValues: this.ignoreEqualValues,
      path: this.path,
      logger: this.logger,
      unbiased: this.unbiased,
      verbose: this.verbose,
      examples: this.examples,
      endOnFailure: this.endOnFailure,
      reporter: orUndefined2(this.reporter),
      asyncReporter: orUndefined2(this.asyncReporter),
      errorWithCause: this.errorWithCause
    };
    return parameters;
  }
  static read(op) {
    return new _QualifiedParameters(op);
  }
};
QualifiedParameters.createQualifiedRandomGenerator = (random2) => {
  return (seed) => {
    const rng = random2(seed);
    if (rng.unsafeJump === void 0) {
      rng.unsafeJump = () => unsafeSkipN(rng, 42);
    }
    return rng;
  };
};
QualifiedParameters.readSeed = (p) => {
  if (p.seed == null)
    return safeDateNow() ^ safeMathRandom() * 4294967296;
  const seed32 = p.seed | 0;
  if (p.seed === seed32)
    return seed32;
  const gap = p.seed - seed32;
  return seed32 ^ gap * 4294967296;
};
QualifiedParameters.readRandomType = (p) => {
  if (p.randomType == null)
    return pure_rand_default.xorshift128plus;
  if (typeof p.randomType === "string") {
    switch (p.randomType) {
      case "mersenne":
        return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_default.mersenne);
      case "congruential":
      case "congruential32":
        return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_default.congruential32);
      case "xorshift128plus":
        return pure_rand_default.xorshift128plus;
      case "xoroshiro128plus":
        return pure_rand_default.xoroshiro128plus;
      default:
        throw new Error(`Invalid random specified: '${p.randomType}'`);
    }
  }
  const mrng = p.randomType(0);
  if ("min" in mrng && mrng.min !== -2147483648) {
    throw new Error(`Invalid random number generator: min must equal -0x80000000, got ${String(mrng.min)}`);
  }
  if ("max" in mrng && mrng.max !== 2147483647) {
    throw new Error(`Invalid random number generator: max must equal 0x7fffffff, got ${String(mrng.max)}`);
  }
  if ("unsafeJump" in mrng) {
    return p.randomType;
  }
  return QualifiedParameters.createQualifiedRandomGenerator(p.randomType);
};
QualifiedParameters.readNumRuns = (p) => {
  const defaultValue = 100;
  if (p.numRuns != null)
    return p.numRuns;
  if (p.num_runs != null)
    return p.num_runs;
  return defaultValue;
};
QualifiedParameters.readVerbose = (p) => {
  if (p.verbose == null)
    return VerbosityLevel.None;
  if (typeof p.verbose === "boolean") {
    return p.verbose === true ? VerbosityLevel.Verbose : VerbosityLevel.None;
  }
  if (p.verbose <= VerbosityLevel.None) {
    return VerbosityLevel.None;
  }
  if (p.verbose >= VerbosityLevel.VeryVerbose) {
    return VerbosityLevel.VeryVerbose;
  }
  return p.verbose | 0;
};
QualifiedParameters.readBoolean = (p, key) => p[key] === true;
QualifiedParameters.readOrDefault = (p, key, defaultValue) => {
  const value3 = p[key];
  return value3 != null ? value3 : defaultValue;
};
QualifiedParameters.safeTimeout = (value3) => {
  if (value3 === null) {
    return null;
  }
  return safeMathMin(value3, 2147483647);
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/utils/stringify.js
var safeArrayFrom = Array.from;
var safeBufferIsBuffer = typeof Buffer !== "undefined" ? Buffer.isBuffer : void 0;
var safeJsonStringify = JSON.stringify;
var safeNumberIsNaN = Number.isNaN;
var safeObjectKeys = Object.keys;
var safeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
var safeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var safeObjectGetPrototypeOf = Object.getPrototypeOf;
var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
var safePositiveInfinity = Number.POSITIVE_INFINITY;
var toStringMethod = Symbol.for("fast-check/toStringMethod");
function hasToStringMethod(instance) {
  return instance !== null && (typeof instance === "object" || typeof instance === "function") && toStringMethod in instance && typeof instance[toStringMethod] === "function";
}
var asyncToStringMethod = Symbol.for("fast-check/asyncToStringMethod");
function hasAsyncToStringMethod(instance) {
  return instance !== null && (typeof instance === "object" || typeof instance === "function") && asyncToStringMethod in instance && typeof instance[asyncToStringMethod] === "function";
}
var findSymbolNameRegex = /^Symbol\((.*)\)$/;
function getSymbolDescription(s) {
  if (s.description !== void 0)
    return s.description;
  const m = findSymbolNameRegex.exec(SString(s));
  return m && m[1].length ? m[1] : null;
}
function stringifyNumber(numValue) {
  switch (numValue) {
    case 0:
      return 1 / numValue === safeNegativeInfinity ? "-0" : "0";
    case safeNegativeInfinity:
      return "Number.NEGATIVE_INFINITY";
    case safePositiveInfinity:
      return "Number.POSITIVE_INFINITY";
    default:
      return numValue === numValue ? SString(numValue) : "Number.NaN";
  }
}
function isSparseArray(arr) {
  let previousNumberedIndex = -1;
  for (const index in arr) {
    const numberedIndex = Number(index);
    if (numberedIndex !== previousNumberedIndex + 1)
      return true;
    previousNumberedIndex = numberedIndex;
  }
  return previousNumberedIndex + 1 !== arr.length;
}
function stringifyInternal(value3, previousValues, getAsyncContent) {
  const currentValues = [...previousValues, value3];
  if (typeof value3 === "object") {
    if (safeIndexOf(previousValues, value3) !== -1) {
      return "[cyclic]";
    }
  }
  if (hasAsyncToStringMethod(value3)) {
    const content = getAsyncContent(value3);
    if (content.state === "fulfilled") {
      return content.value;
    }
  }
  if (hasToStringMethod(value3)) {
    try {
      return value3[toStringMethod]();
    } catch (err2) {
    }
  }
  switch (safeToString(value3)) {
    case "[object Array]": {
      const arr = value3;
      if (arr.length >= 50 && isSparseArray(arr)) {
        const assignments = [];
        for (const index in arr) {
          if (!safeNumberIsNaN(Number(index)))
            safePush(assignments, `${index}:${stringifyInternal(arr[index], currentValues, getAsyncContent)}`);
        }
        return assignments.length !== 0 ? `Object.assign(Array(${arr.length}),{${safeJoin(assignments, ",")}})` : `Array(${arr.length})`;
      }
      const stringifiedArray = safeJoin(safeMap(arr, (v) => stringifyInternal(v, currentValues, getAsyncContent)), ",");
      return arr.length === 0 || arr.length - 1 in arr ? `[${stringifiedArray}]` : `[${stringifiedArray},]`;
    }
    case "[object BigInt]":
      return `${value3}n`;
    case "[object Boolean]": {
      const unboxedToString = value3 == true ? "true" : "false";
      return typeof value3 === "boolean" ? unboxedToString : `new Boolean(${unboxedToString})`;
    }
    case "[object Date]": {
      const d = value3;
      return safeNumberIsNaN(safeGetTime(d)) ? `new Date(NaN)` : `new Date(${safeJsonStringify(safeToISOString(d))})`;
    }
    case "[object Map]":
      return `new Map(${stringifyInternal(Array.from(value3), currentValues, getAsyncContent)})`;
    case "[object Null]":
      return `null`;
    case "[object Number]":
      return typeof value3 === "number" ? stringifyNumber(value3) : `new Number(${stringifyNumber(Number(value3))})`;
    case "[object Object]": {
      try {
        const toStringAccessor = value3.toString;
        if (typeof toStringAccessor === "function" && toStringAccessor !== Object.prototype.toString) {
          return value3.toString();
        }
      } catch (err2) {
        return "[object Object]";
      }
      const mapper = (k) => `${k === "__proto__" ? '["__proto__"]' : typeof k === "symbol" ? `[${stringifyInternal(k, currentValues, getAsyncContent)}]` : safeJsonStringify(k)}:${stringifyInternal(value3[k], currentValues, getAsyncContent)}`;
      const stringifiedProperties = [
        ...safeMap(safeObjectKeys(value3), mapper),
        ...safeMap(safeFilter(safeObjectGetOwnPropertySymbols(value3), (s) => {
          const descriptor = safeObjectGetOwnPropertyDescriptor(value3, s);
          return descriptor && descriptor.enumerable;
        }), mapper)
      ];
      const rawRepr = "{" + safeJoin(stringifiedProperties, ",") + "}";
      if (safeObjectGetPrototypeOf(value3) === null) {
        return rawRepr === "{}" ? "Object.create(null)" : `Object.assign(Object.create(null),${rawRepr})`;
      }
      return rawRepr;
    }
    case "[object Set]":
      return `new Set(${stringifyInternal(Array.from(value3), currentValues, getAsyncContent)})`;
    case "[object String]":
      return typeof value3 === "string" ? safeJsonStringify(value3) : `new String(${safeJsonStringify(value3)})`;
    case "[object Symbol]": {
      const s = value3;
      if (SSymbol.keyFor(s) !== void 0) {
        return `Symbol.for(${safeJsonStringify(SSymbol.keyFor(s))})`;
      }
      const desc = getSymbolDescription(s);
      if (desc === null) {
        return "Symbol()";
      }
      const knownSymbol = desc.startsWith("Symbol.") && SSymbol[desc.substring(7)];
      return s === knownSymbol ? desc : `Symbol(${safeJsonStringify(desc)})`;
    }
    case "[object Promise]": {
      const promiseContent = getAsyncContent(value3);
      switch (promiseContent.state) {
        case "fulfilled":
          return `Promise.resolve(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
        case "rejected":
          return `Promise.reject(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
        case "pending":
          return `new Promise(() => {/*pending*/})`;
        case "unknown":
        default:
          return `new Promise(() => {/*unknown*/})`;
      }
    }
    case "[object Error]":
      if (value3 instanceof Error) {
        return `new Error(${stringifyInternal(value3.message, currentValues, getAsyncContent)})`;
      }
      break;
    case "[object Undefined]":
      return `undefined`;
    case "[object Int8Array]":
    case "[object Uint8Array]":
    case "[object Uint8ClampedArray]":
    case "[object Int16Array]":
    case "[object Uint16Array]":
    case "[object Int32Array]":
    case "[object Uint32Array]":
    case "[object Float32Array]":
    case "[object Float64Array]":
    case "[object BigInt64Array]":
    case "[object BigUint64Array]": {
      if (typeof safeBufferIsBuffer === "function" && safeBufferIsBuffer(value3)) {
        return `Buffer.from(${stringifyInternal(safeArrayFrom(value3.values()), currentValues, getAsyncContent)})`;
      }
      const valuePrototype = safeObjectGetPrototypeOf(value3);
      const className = valuePrototype && valuePrototype.constructor && valuePrototype.constructor.name;
      if (typeof className === "string") {
        const typedArray = value3;
        const valuesFromTypedArr = typedArray.values();
        return `${className}.from(${stringifyInternal(safeArrayFrom(valuesFromTypedArr), currentValues, getAsyncContent)})`;
      }
      break;
    }
  }
  try {
    return value3.toString();
  } catch (_a) {
    return safeToString(value3);
  }
}
function stringify(value3) {
  return stringifyInternal(value3, [], () => ({ state: "unknown", value: void 0 }));
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/DecorateProperty.js
var safeDateNow2 = Date.now;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/reporter/ExecutionStatus.js
var ExecutionStatus;
(function(ExecutionStatus2) {
  ExecutionStatus2[ExecutionStatus2["Success"] = 0] = "Success";
  ExecutionStatus2[ExecutionStatus2["Skipped"] = -1] = "Skipped";
  ExecutionStatus2[ExecutionStatus2["Failure"] = 1] = "Failure";
})(ExecutionStatus || (ExecutionStatus = {}));

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/runner/reporter/RunExecution.js
var RunExecution = class _RunExecution {
  constructor(verbosity, interruptedAsFailure) {
    this.verbosity = verbosity;
    this.interruptedAsFailure = interruptedAsFailure;
    this.isSuccess = () => this.pathToFailure == null;
    this.firstFailure = () => this.pathToFailure ? +safeSplit(this.pathToFailure, ":")[0] : -1;
    this.numShrinks = () => this.pathToFailure ? safeSplit(this.pathToFailure, ":").length - 1 : 0;
    this.rootExecutionTrees = [];
    this.currentLevelExecutionTrees = this.rootExecutionTrees;
    this.failure = null;
    this.numSkips = 0;
    this.numSuccesses = 0;
    this.interrupted = false;
  }
  appendExecutionTree(status, value3) {
    const currentTree = { status, value: value3, children: [] };
    this.currentLevelExecutionTrees.push(currentTree);
    return currentTree;
  }
  fail(value3, id, failure) {
    if (this.verbosity >= VerbosityLevel.Verbose) {
      const currentTree = this.appendExecutionTree(ExecutionStatus.Failure, value3);
      this.currentLevelExecutionTrees = currentTree.children;
    }
    if (this.pathToFailure == null)
      this.pathToFailure = `${id}`;
    else
      this.pathToFailure += `:${id}`;
    this.value = value3;
    this.failure = failure;
  }
  skip(value3) {
    if (this.verbosity >= VerbosityLevel.VeryVerbose) {
      this.appendExecutionTree(ExecutionStatus.Skipped, value3);
    }
    if (this.pathToFailure == null) {
      ++this.numSkips;
    }
  }
  success(value3) {
    if (this.verbosity >= VerbosityLevel.VeryVerbose) {
      this.appendExecutionTree(ExecutionStatus.Success, value3);
    }
    if (this.pathToFailure == null) {
      ++this.numSuccesses;
    }
  }
  interrupt() {
    this.interrupted = true;
  }
  extractFailures() {
    if (this.isSuccess()) {
      return [];
    }
    const failures2 = [];
    let cursor = this.rootExecutionTrees;
    while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus.Failure) {
      const failureTree = cursor[cursor.length - 1];
      failures2.push(failureTree.value);
      cursor = failureTree.children;
    }
    return failures2;
  }
  toRunDetails(seed, basePath, maxSkips, qParams) {
    if (!this.isSuccess()) {
      return {
        failed: true,
        interrupted: this.interrupted,
        numRuns: this.firstFailure() + 1 - this.numSkips,
        numSkips: this.numSkips,
        numShrinks: this.numShrinks(),
        seed,
        counterexample: this.value,
        counterexamplePath: _RunExecution.mergePaths(basePath, this.pathToFailure),
        error: this.failure.errorMessage,
        errorInstance: this.failure.error,
        failures: this.extractFailures(),
        executionSummary: this.rootExecutionTrees,
        verbose: this.verbosity,
        runConfiguration: qParams.toParameters()
      };
    }
    const considerInterruptedAsFailure = this.interruptedAsFailure || this.numSuccesses === 0;
    const failed = this.numSkips > maxSkips || this.interrupted && considerInterruptedAsFailure;
    const out = {
      failed,
      interrupted: this.interrupted,
      numRuns: this.numSuccesses,
      numSkips: this.numSkips,
      numShrinks: 0,
      seed,
      counterexample: null,
      counterexamplePath: null,
      error: null,
      errorInstance: null,
      failures: [],
      executionSummary: this.rootExecutionTrees,
      verbose: this.verbosity,
      runConfiguration: qParams.toParameters()
    };
    return out;
  }
};
RunExecution.mergePaths = (offsetPath, path2) => {
  if (offsetPath.length === 0)
    return path2;
  const offsetItems = offsetPath.split(":");
  const remainingItems = path2.split(":");
  const middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
  return [...offsetItems.slice(0, offsetItems.length - 1), `${middle}`, ...remainingItems.slice(1)].join(":");
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/random/generator/Random.js
var Random = class _Random {
  constructor(sourceRng) {
    this.internalRng = sourceRng.clone();
  }
  clone() {
    return new _Random(this.internalRng);
  }
  next(bits) {
    return unsafeUniformIntDistribution(0, (1 << bits) - 1, this.internalRng);
  }
  nextBoolean() {
    return unsafeUniformIntDistribution(0, 1, this.internalRng) == 1;
  }
  nextInt(min3, max3) {
    return unsafeUniformIntDistribution(min3 == null ? _Random.MIN_INT : min3, max3 == null ? _Random.MAX_INT : max3, this.internalRng);
  }
  nextBigInt(min3, max3) {
    return unsafeUniformBigIntDistribution(min3, max3, this.internalRng);
  }
  nextArrayInt(min3, max3) {
    return unsafeUniformArrayIntDistribution(min3, max3, this.internalRng);
  }
  nextDouble() {
    const a = this.next(26);
    const b = this.next(27);
    return (a * _Random.DBL_FACTOR + b) * _Random.DBL_DIVISOR;
  }
  getState() {
    if ("getState" in this.internalRng && typeof this.internalRng.getState === "function") {
      return this.internalRng.getState();
    }
    return void 0;
  }
};
Random.MIN_INT = 2147483648 | 0;
Random.MAX_INT = 2147483647 | 0;
Random.DBL_FACTOR = Math.pow(2, 27);
Random.DBL_DIVISOR = Math.pow(2, -53);

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/builders/StableArbitraryGeneratorCache.js
var safeArrayIsArray2 = Array.isArray;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BiasNumericRange.js
var safeMathFloor = Math.floor;
var safeMathLog2 = Math.log;
function integerLogLike(v) {
  return safeMathFloor(safeMathLog2(v) / safeMathLog2(2));
}
function biasNumericRange(min3, max3, logLike) {
  if (min3 === max3) {
    return [{ min: min3, max: max3 }];
  }
  if (min3 < 0 && max3 > 0) {
    const logMin = logLike(-min3);
    const logMax = logLike(max3);
    return [
      { min: -logMin, max: logMax },
      { min: max3 - logMax, max: max3 },
      { min: min3, max: min3 + logMin }
    ];
  }
  const logGap = logLike(max3 - min3);
  const arbCloseToMin = { min: min3, max: min3 + logGap };
  const arbCloseToMax = { min: max3 - logGap, max: max3 };
  return min3 < 0 ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkInteger.js
var safeMathCeil = Math.ceil;
var safeMathFloor2 = Math.floor;
function halvePosInteger(n) {
  return safeMathFloor2(n / 2);
}
function halveNegInteger(n) {
  return safeMathCeil(n / 2);
}
function shrinkInteger(current, target, tryTargetAsap) {
  const realGap = current - target;
  function* shrinkDecr() {
    let previous = tryTargetAsap ? void 0 : target;
    const gap = tryTargetAsap ? realGap : halvePosInteger(realGap);
    for (let toremove = gap; toremove > 0; toremove = halvePosInteger(toremove)) {
      const next = toremove === realGap ? target : current - toremove;
      yield new Value(next, previous);
      previous = next;
    }
  }
  function* shrinkIncr() {
    let previous = tryTargetAsap ? void 0 : target;
    const gap = tryTargetAsap ? realGap : halveNegInteger(realGap);
    for (let toremove = gap; toremove < 0; toremove = halveNegInteger(toremove)) {
      const next = toremove === realGap ? target : current - toremove;
      yield new Value(next, previous);
      previous = next;
    }
  }
  return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/IntegerArbitrary.js
var safeMathSign = Math.sign;
var safeNumberIsInteger = Number.isInteger;
var safeObjectIs = Object.is;
var IntegerArbitrary = class _IntegerArbitrary extends Arbitrary {
  constructor(min3, max3) {
    super();
    this.min = min3;
    this.max = max3;
  }
  generate(mrng, biasFactor) {
    const range = this.computeGenerateRange(mrng, biasFactor);
    return new Value(mrng.nextInt(range.min, range.max), void 0);
  }
  canShrinkWithoutContext(value3) {
    return typeof value3 === "number" && safeNumberIsInteger(value3) && !safeObjectIs(value3, -0) && this.min <= value3 && value3 <= this.max;
  }
  shrink(current, context3) {
    if (!_IntegerArbitrary.isValidContext(current, context3)) {
      const target = this.defaultTarget();
      return shrinkInteger(current, target, true);
    }
    if (this.isLastChanceTry(current, context3)) {
      return Stream.of(new Value(context3, void 0));
    }
    return shrinkInteger(current, context3, false);
  }
  defaultTarget() {
    if (this.min <= 0 && this.max >= 0) {
      return 0;
    }
    return this.min < 0 ? this.max : this.min;
  }
  computeGenerateRange(mrng, biasFactor) {
    if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
      return { min: this.min, max: this.max };
    }
    const ranges = biasNumericRange(this.min, this.max, integerLogLike);
    if (ranges.length === 1) {
      return ranges[0];
    }
    const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
    return id < 0 ? ranges[0] : ranges[id + 1];
  }
  isLastChanceTry(current, context3) {
    if (current > 0)
      return current === context3 + 1 && current > this.min;
    if (current < 0)
      return current === context3 - 1 && current < this.max;
    return false;
  }
  static isValidContext(current, context3) {
    if (context3 === void 0) {
      return false;
    }
    if (typeof context3 !== "number") {
      throw new Error(`Invalid context type passed to IntegerArbitrary (#1)`);
    }
    if (context3 !== 0 && safeMathSign(current) !== safeMathSign(context3)) {
      throw new Error(`Invalid context value passed to IntegerArbitrary (#2)`);
    }
    return true;
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/integer.js
var safeNumberIsInteger2 = Number.isInteger;
function buildCompleteIntegerConstraints(constraints) {
  const min3 = constraints.min !== void 0 ? constraints.min : -2147483648;
  const max3 = constraints.max !== void 0 ? constraints.max : 2147483647;
  return { min: min3, max: max3 };
}
function integer(constraints = {}) {
  const fullConstraints = buildCompleteIntegerConstraints(constraints);
  if (fullConstraints.min > fullConstraints.max) {
    throw new Error("fc.integer maximum value should be equal or greater than the minimum one");
  }
  if (!safeNumberIsInteger2(fullConstraints.min)) {
    throw new Error("fc.integer minimum value should be an integer");
  }
  if (!safeNumberIsInteger2(fullConstraints.max)) {
    throw new Error("fc.integer maximum value should be an integer");
  }
  return new IntegerArbitrary(fullConstraints.min, fullConstraints.max);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DepthContext.js
var depthContextCache = /* @__PURE__ */ new Map();
function getDepthContextFor(contextMeta) {
  if (contextMeta === void 0) {
    return { depth: 0 };
  }
  if (typeof contextMeta !== "string") {
    return contextMeta;
  }
  const cachedContext = safeMapGet(depthContextCache, contextMeta);
  if (cachedContext !== void 0) {
    return cachedContext;
  }
  const context3 = { depth: 0 };
  safeMapSet(depthContextCache, contextMeta, context3);
  return context3;
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/NoopSlicedGenerator.js
var NoopSlicedGenerator = class {
  constructor(arb, mrng, biasFactor) {
    this.arb = arb;
    this.mrng = mrng;
    this.biasFactor = biasFactor;
  }
  attemptExact() {
    return;
  }
  next() {
    return this.arb.generate(this.mrng, this.biasFactor);
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/SlicedBasedGenerator.js
var safeMathMin2 = Math.min;
var safeMathMax = Math.max;
var SlicedBasedGenerator = class {
  constructor(arb, mrng, slices, biasFactor) {
    this.arb = arb;
    this.mrng = mrng;
    this.slices = slices;
    this.biasFactor = biasFactor;
    this.activeSliceIndex = 0;
    this.nextIndexInSlice = 0;
    this.lastIndexInSlice = -1;
  }
  attemptExact(targetLength) {
    if (targetLength !== 0 && this.mrng.nextInt(1, this.biasFactor) === 1) {
      const eligibleIndices = [];
      for (let index = 0; index !== this.slices.length; ++index) {
        const slice = this.slices[index];
        if (slice.length === targetLength) {
          safePush(eligibleIndices, index);
        }
      }
      if (eligibleIndices.length === 0) {
        return;
      }
      this.activeSliceIndex = eligibleIndices[this.mrng.nextInt(0, eligibleIndices.length - 1)];
      this.nextIndexInSlice = 0;
      this.lastIndexInSlice = targetLength - 1;
    }
  }
  next() {
    if (this.nextIndexInSlice <= this.lastIndexInSlice) {
      return new Value(this.slices[this.activeSliceIndex][this.nextIndexInSlice++], void 0);
    }
    if (this.mrng.nextInt(1, this.biasFactor) !== 1) {
      return this.arb.generate(this.mrng, this.biasFactor);
    }
    this.activeSliceIndex = this.mrng.nextInt(0, this.slices.length - 1);
    const slice = this.slices[this.activeSliceIndex];
    if (this.mrng.nextInt(1, this.biasFactor) !== 1) {
      this.nextIndexInSlice = 1;
      this.lastIndexInSlice = slice.length - 1;
      return new Value(slice[0], void 0);
    }
    const rangeBoundaryA = this.mrng.nextInt(0, slice.length - 1);
    const rangeBoundaryB = this.mrng.nextInt(0, slice.length - 1);
    this.nextIndexInSlice = safeMathMin2(rangeBoundaryA, rangeBoundaryB);
    this.lastIndexInSlice = safeMathMax(rangeBoundaryA, rangeBoundaryB);
    return new Value(slice[this.nextIndexInSlice++], void 0);
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BuildSlicedGenerator.js
function buildSlicedGenerator(arb, mrng, slices, biasFactor) {
  if (biasFactor === void 0 || slices.length === 0 || mrng.nextInt(1, biasFactor) !== 1) {
    return new NoopSlicedGenerator(arb, mrng, biasFactor);
  }
  return new SlicedBasedGenerator(arb, mrng, slices, biasFactor);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/ArrayArbitrary.js
var safeMathFloor3 = Math.floor;
var safeMathLog3 = Math.log;
var safeMathMax2 = Math.max;
var safeArrayIsArray3 = Array.isArray;
function biasedMaxLength(minLength2, maxLength2) {
  if (minLength2 === maxLength2) {
    return minLength2;
  }
  return minLength2 + safeMathFloor3(safeMathLog3(maxLength2 - minLength2) / safeMathLog3(2));
}
var ArrayArbitrary = class _ArrayArbitrary extends Arbitrary {
  constructor(arb, minLength2, maxGeneratedLength, maxLength2, depthIdentifier, setBuilder, customSlices) {
    super();
    this.arb = arb;
    this.minLength = minLength2;
    this.maxGeneratedLength = maxGeneratedLength;
    this.maxLength = maxLength2;
    this.setBuilder = setBuilder;
    this.customSlices = customSlices;
    this.lengthArb = integer({ min: minLength2, max: maxGeneratedLength });
    this.depthContext = getDepthContextFor(depthIdentifier);
  }
  preFilter(tab) {
    if (this.setBuilder === void 0) {
      return tab;
    }
    const s = this.setBuilder();
    for (let index = 0; index !== tab.length; ++index) {
      s.tryAdd(tab[index]);
    }
    return s.getData();
  }
  static makeItCloneable(vs, shrinkables) {
    vs[cloneMethod] = () => {
      const cloned = [];
      for (let idx = 0; idx !== shrinkables.length; ++idx) {
        safePush(cloned, shrinkables[idx].value);
      }
      this.makeItCloneable(cloned, shrinkables);
      return cloned;
    };
    return vs;
  }
  generateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems) {
    let numSkippedInRow = 0;
    const s = setBuilder();
    const slicedGenerator = buildSlicedGenerator(this.arb, mrng, this.customSlices, biasFactorItems);
    while (s.size() < N && numSkippedInRow < this.maxGeneratedLength) {
      const current = slicedGenerator.next();
      if (s.tryAdd(current)) {
        numSkippedInRow = 0;
      } else {
        numSkippedInRow += 1;
      }
    }
    return s.getData();
  }
  safeGenerateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems) {
    const depthImpact = safeMathMax2(0, N - biasedMaxLength(this.minLength, this.maxGeneratedLength));
    this.depthContext.depth += depthImpact;
    try {
      return this.generateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems);
    } finally {
      this.depthContext.depth -= depthImpact;
    }
  }
  generateNItems(N, mrng, biasFactorItems) {
    const items = [];
    const slicedGenerator = buildSlicedGenerator(this.arb, mrng, this.customSlices, biasFactorItems);
    slicedGenerator.attemptExact(N);
    for (let index = 0; index !== N; ++index) {
      const current = slicedGenerator.next();
      safePush(items, current);
    }
    return items;
  }
  safeGenerateNItems(N, mrng, biasFactorItems) {
    const depthImpact = safeMathMax2(0, N - biasedMaxLength(this.minLength, this.maxGeneratedLength));
    this.depthContext.depth += depthImpact;
    try {
      return this.generateNItems(N, mrng, biasFactorItems);
    } finally {
      this.depthContext.depth -= depthImpact;
    }
  }
  wrapper(itemsRaw, shrunkOnce, itemsRawLengthContext, startIndex) {
    const items = shrunkOnce ? this.preFilter(itemsRaw) : itemsRaw;
    let cloneable = false;
    const vs = [];
    const itemsContexts = [];
    for (let idx = 0; idx !== items.length; ++idx) {
      const s = items[idx];
      cloneable = cloneable || s.hasToBeCloned;
      safePush(vs, s.value);
      safePush(itemsContexts, s.context);
    }
    if (cloneable) {
      _ArrayArbitrary.makeItCloneable(vs, items);
    }
    const context3 = {
      shrunkOnce,
      lengthContext: itemsRaw.length === items.length && itemsRawLengthContext !== void 0 ? itemsRawLengthContext : void 0,
      itemsContexts,
      startIndex
    };
    return new Value(vs, context3);
  }
  generate(mrng, biasFactor) {
    const biasMeta = this.applyBias(mrng, biasFactor);
    const targetSize = biasMeta.size;
    const items = this.setBuilder !== void 0 ? this.safeGenerateNItemsNoDuplicates(this.setBuilder, targetSize, mrng, biasMeta.biasFactorItems) : this.safeGenerateNItems(targetSize, mrng, biasMeta.biasFactorItems);
    return this.wrapper(items, false, void 0, 0);
  }
  applyBias(mrng, biasFactor) {
    if (biasFactor === void 0) {
      return { size: this.lengthArb.generate(mrng, void 0).value };
    }
    if (this.minLength === this.maxGeneratedLength) {
      return { size: this.lengthArb.generate(mrng, void 0).value, biasFactorItems: biasFactor };
    }
    if (mrng.nextInt(1, biasFactor) !== 1) {
      return { size: this.lengthArb.generate(mrng, void 0).value };
    }
    if (mrng.nextInt(1, biasFactor) !== 1 || this.minLength === this.maxGeneratedLength) {
      return { size: this.lengthArb.generate(mrng, void 0).value, biasFactorItems: biasFactor };
    }
    const maxBiasedLength = biasedMaxLength(this.minLength, this.maxGeneratedLength);
    const targetSizeValue = integer({ min: this.minLength, max: maxBiasedLength }).generate(mrng, void 0);
    return { size: targetSizeValue.value, biasFactorItems: biasFactor };
  }
  canShrinkWithoutContext(value3) {
    if (!safeArrayIsArray3(value3) || this.minLength > value3.length || value3.length > this.maxLength) {
      return false;
    }
    for (let index = 0; index !== value3.length; ++index) {
      if (!(index in value3)) {
        return false;
      }
      if (!this.arb.canShrinkWithoutContext(value3[index])) {
        return false;
      }
    }
    const filtered = this.preFilter(safeMap(value3, (item) => new Value(item, void 0)));
    return filtered.length === value3.length;
  }
  shrinkItemByItem(value3, safeContext, endIndex) {
    const shrinks = [];
    for (let index = safeContext.startIndex; index < endIndex; ++index) {
      safePush(shrinks, makeLazy(() => this.arb.shrink(value3[index], safeContext.itemsContexts[index]).map((v) => {
        const beforeCurrent = safeMap(safeSlice(value3, 0, index), (v2, i) => new Value(cloneIfNeeded(v2), safeContext.itemsContexts[i]));
        const afterCurrent = safeMap(safeSlice(value3, index + 1), (v2, i) => new Value(cloneIfNeeded(v2), safeContext.itemsContexts[i + index + 1]));
        return [
          [...beforeCurrent, v, ...afterCurrent],
          void 0,
          index
        ];
      })));
    }
    return Stream.nil().join(...shrinks);
  }
  shrinkImpl(value3, context3) {
    if (value3.length === 0) {
      return Stream.nil();
    }
    const safeContext = context3 !== void 0 ? context3 : { shrunkOnce: false, lengthContext: void 0, itemsContexts: [], startIndex: 0 };
    return this.lengthArb.shrink(value3.length, safeContext.lengthContext).drop(safeContext.shrunkOnce && safeContext.lengthContext === void 0 && value3.length > this.minLength + 1 ? 1 : 0).map((lengthValue) => {
      const sliceStart = value3.length - lengthValue.value;
      return [
        safeMap(safeSlice(value3, sliceStart), (v, index) => new Value(cloneIfNeeded(v), safeContext.itemsContexts[index + sliceStart])),
        lengthValue.context,
        0
      ];
    }).join(makeLazy(() => value3.length > this.minLength ? this.shrinkItemByItem(value3, safeContext, 1) : this.shrinkItemByItem(value3, safeContext, value3.length))).join(value3.length > this.minLength ? makeLazy(() => {
      const subContext = {
        shrunkOnce: false,
        lengthContext: void 0,
        itemsContexts: safeSlice(safeContext.itemsContexts, 1),
        startIndex: 0
      };
      return this.shrinkImpl(safeSlice(value3, 1), subContext).filter((v) => this.minLength <= v[0].length + 1).map((v) => {
        return [[new Value(cloneIfNeeded(value3[0]), safeContext.itemsContexts[0]), ...v[0]], void 0, 0];
      });
    }) : Stream.nil());
  }
  shrink(value3, context3) {
    return this.shrinkImpl(value3, context3).map((contextualValue) => this.wrapper(contextualValue[0], true, contextualValue[1], contextualValue[2]));
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/MaxLengthFromMinLength.js
var safeMathFloor4 = Math.floor;
var safeMathMin3 = Math.min;
var MaxLengthUpperBound = 2147483647;
var orderedSize = ["xsmall", "small", "medium", "large", "xlarge"];
var orderedRelativeSize = ["-4", "-3", "-2", "-1", "=", "+1", "+2", "+3", "+4"];
var DefaultSize = "small";
function maxLengthFromMinLength(minLength2, size7) {
  switch (size7) {
    case "xsmall":
      return safeMathFloor4(1.1 * minLength2) + 1;
    case "small":
      return 2 * minLength2 + 10;
    case "medium":
      return 11 * minLength2 + 100;
    case "large":
      return 101 * minLength2 + 1e3;
    case "xlarge":
      return 1001 * minLength2 + 1e4;
    default:
      throw new Error(`Unable to compute lengths based on received size: ${size7}`);
  }
}
function relativeSizeToSize(size7, defaultSize) {
  const sizeInRelative = safeIndexOf(orderedRelativeSize, size7);
  if (sizeInRelative === -1) {
    return size7;
  }
  const defaultSizeInSize = safeIndexOf(orderedSize, defaultSize);
  if (defaultSizeInSize === -1) {
    throw new Error(`Unable to offset size based on the unknown defaulted one: ${defaultSize}`);
  }
  const resultingSizeInSize = defaultSizeInSize + sizeInRelative - 4;
  return resultingSizeInSize < 0 ? orderedSize[0] : resultingSizeInSize >= orderedSize.length ? orderedSize[orderedSize.length - 1] : orderedSize[resultingSizeInSize];
}
function maxGeneratedLengthFromSizeForArbitrary(size7, minLength2, maxLength2, specifiedMaxLength) {
  const { baseSize: defaultSize = DefaultSize, defaultSizeToMaxWhenMaxSpecified } = readConfigureGlobal() || {};
  const definedSize = size7 !== void 0 ? size7 : specifiedMaxLength && defaultSizeToMaxWhenMaxSpecified ? "max" : defaultSize;
  if (definedSize === "max") {
    return maxLength2;
  }
  const finalSize = relativeSizeToSize(definedSize, defaultSize);
  return safeMathMin3(maxLengthFromMinLength(minLength2, finalSize), maxLength2);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/array.js
function array3(arb, constraints = {}) {
  const size7 = constraints.size;
  const minLength2 = constraints.minLength || 0;
  const maxLengthOrUnset = constraints.maxLength;
  const depthIdentifier = constraints.depthIdentifier;
  const maxLength2 = maxLengthOrUnset !== void 0 ? maxLengthOrUnset : MaxLengthUpperBound;
  const specifiedMaxLength = maxLengthOrUnset !== void 0;
  const maxGeneratedLength = maxGeneratedLengthFromSizeForArbitrary(size7, minLength2, maxLength2, specifiedMaxLength);
  const customSlices = constraints.experimentalCustomSlices || [];
  return new ArrayArbitrary(arb, minLength2, maxGeneratedLength, maxLength2, depthIdentifier, void 0, customSlices);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToCharString.js
var indexToCharStringMapper = String.fromCodePoint;
function indexToCharStringUnmapper(c) {
  if (typeof c !== "string") {
    throw new Error("Cannot unmap non-string");
  }
  if (c.length === 0 || c.length > 2) {
    throw new Error("Cannot unmap string with more or less than one character");
  }
  const c1 = safeCharCodeAt(c, 0);
  if (c.length === 1) {
    return c1;
  }
  const c2 = safeCharCodeAt(c, 1);
  if (c1 < 55296 || c1 > 56319 || c2 < 56320 || c2 > 57343) {
    throw new Error("Cannot unmap invalid surrogate pairs");
  }
  return c.codePointAt(0);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CharacterArbitraryBuilder.js
function buildCharacterArbitrary(min3, max3, mapToCode, unmapFromCode) {
  return integer({ min: min3, max: max3 }).map((n) => indexToCharStringMapper(mapToCode(n)), (c) => unmapFromCode(indexToCharStringUnmapper(c)));
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/IndexToPrintableIndex.js
function indexToPrintableIndexMapper(v) {
  if (v < 95)
    return v + 32;
  if (v <= 126)
    return v - 95;
  return v;
}
function indexToPrintableIndexUnmapper(v) {
  if (v >= 32 && v <= 126)
    return v - 32;
  if (v >= 0 && v <= 31)
    return v + 95;
  return v;
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/char.js
function identity2(v) {
  return v;
}
function char() {
  return buildCharacterArbitrary(32, 126, identity2, identity2);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/fullUnicode.js
var gapSize = 57343 + 1 - 55296;
function unicodeMapper(v) {
  if (v < 55296)
    return indexToPrintableIndexMapper(v);
  return v + gapSize;
}
function unicodeUnmapper(v) {
  if (v < 55296)
    return indexToPrintableIndexUnmapper(v);
  if (v <= 57343)
    return -1;
  return v - gapSize;
}
function fullUnicode() {
  return buildCharacterArbitrary(0, 1114111 - gapSize, unicodeMapper, unicodeUnmapper);
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/unicode.js
var gapSize2 = 57343 + 1 - 55296;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/context.js
var ContextImplem = class _ContextImplem {
  constructor() {
    this.receivedLogs = [];
  }
  log(data) {
    this.receivedLogs.push(data);
  }
  size() {
    return this.receivedLogs.length;
  }
  toString() {
    return JSON.stringify({ logs: this.receivedLogs });
  }
  [cloneMethod]() {
    return new _ContextImplem();
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/TimeToDate.js
var safeNaN = Number.NaN;
var safeNumberIsNaN2 = Number.isNaN;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/date.js
var safeNumberIsNaN3 = Number.isNaN;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/CloneArbitrary.js
var safeIsArray = Array.isArray;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/StrictlyEqualSet.js
var safeNumberIsNaN4 = Number.isNaN;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/FrequencyArbitrary.js
var safePositiveInfinity2 = Number.POSITIVE_INFINITY;
var safeMaxSafeInteger = Number.MAX_SAFE_INTEGER;
var safeNumberIsInteger3 = Number.isInteger;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/nat.js
var safeNumberIsInteger4 = Number.isInteger;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/builders/CharacterRangeArbitraryBuilder.js
var safeStringFromCharCode = String.fromCharCode;
function percentCharArbMapper(c) {
  const encoded = SencodeURIComponent(c);
  return c !== encoded ? encoded : `%${safeNumberToString(safeCharCodeAt(c, 0), 16)}`;
}
function percentCharArbUnmapper(value3) {
  if (typeof value3 !== "string") {
    throw new Error("Unsupported");
  }
  const decoded = decodeURIComponent(value3);
  return decoded;
}
var percentCharArb = fullUnicode().map(percentCharArbMapper, percentCharArbUnmapper);

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/GraphemeRangesHelpers.js
var safeStringFromCodePoint = String.fromCodePoint;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/AdapterArbitrary.js
var AdaptedValue = Symbol("adapted-value");

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DoubleHelpers.js
var safeNegativeInfinity2 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity3 = Number.POSITIVE_INFINITY;
var safeEpsilon = Number.EPSILON;
var f64 = new Float64Array(1);
var u32 = new Uint32Array(f64.buffer, f64.byteOffset);

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/FloatingOnlyHelpers.js
var safeNumberIsInteger5 = Number.isInteger;
var safeNegativeInfinity3 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity4 = Number.POSITIVE_INFINITY;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/DoubleOnlyHelpers.js
var safeNegativeInfinity4 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity5 = Number.POSITIVE_INFINITY;
var safeMaxValue = Number.MAX_VALUE;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/double.js
var safeNumberIsInteger6 = Number.isInteger;
var safeNumberIsNaN5 = Number.isNaN;
var safeNegativeInfinity5 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity6 = Number.POSITIVE_INFINITY;
var safeMaxValue2 = Number.MAX_VALUE;
var safeNaN2 = Number.NaN;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/FloatHelpers.js
var safeNegativeInfinity6 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity7 = Number.POSITIVE_INFINITY;
var MIN_VALUE_32 = 2 ** -126 * 2 ** -23;
var MAX_VALUE_32 = 2 ** 127 * (1 + (2 ** 23 - 1) / 2 ** 23);
var EPSILON_32 = 2 ** -23;
var f32 = new Float32Array(1);
var u322 = new Uint32Array(f32.buffer, f32.byteOffset);

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/FloatOnlyHelpers.js
var safeNegativeInfinity7 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity8 = Number.POSITIVE_INFINITY;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/float.js
var safeNumberIsInteger7 = Number.isInteger;
var safeNumberIsNaN6 = Number.isNaN;
var safeNegativeInfinity8 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity9 = Number.POSITIVE_INFINITY;
var safeNaN3 = Number.NaN;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/TextEscaper.js
function escapeForTemplateString(originalText) {
  return originalText.replace(/([$`\\])/g, "\\$1").replace(/\r/g, "\\r");
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/maxSafeInteger.js
var safeMinSafeInteger = Number.MIN_SAFE_INTEGER;
var safeMaxSafeInteger2 = Number.MAX_SAFE_INTEGER;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/maxSafeNat.js
var safeMaxSafeInteger3 = Number.MAX_SAFE_INTEGER;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/NatToStringifiedNat.js
var safeNumberParseInt = Number.parseInt;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/sparseArray.js
var safeArrayIsArray4 = SArray.isArray;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js
var noKeyValue = Symbol("no-key");

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/SubarrayArbitrary.js
var safeArrayIsArray5 = Array.isArray;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/mappers/UintToBase32String.js
var encodeSymbolLookupTable = {
  10: "A",
  11: "B",
  12: "C",
  13: "D",
  14: "E",
  15: "F",
  16: "G",
  17: "H",
  18: "J",
  19: "K",
  20: "M",
  21: "N",
  22: "P",
  23: "Q",
  24: "R",
  25: "S",
  26: "T",
  27: "V",
  28: "W",
  29: "X",
  30: "Y",
  31: "Z"
};
function encodeSymbol(symbol3) {
  return symbol3 < 10 ? SString(symbol3) : encodeSymbolLookupTable[symbol3];
}
function pad(value3, paddingLength) {
  let extraPadding = "";
  while (value3.length + extraPadding.length < paddingLength) {
    extraPadding += "0";
  }
  return extraPadding + value3;
}
function smallUintToBase32StringMapper(num) {
  let base32Str = "";
  for (let remaining = num; remaining !== 0; ) {
    const next = remaining >> 5;
    const current = remaining - (next << 5);
    base32Str = encodeSymbol(current) + base32Str;
    remaining = next;
  }
  return base32Str;
}
function uintToBase32StringMapper(num, paddingLength) {
  const head4 = ~~(num / 1073741824);
  const tail = num & 1073741823;
  return pad(smallUintToBase32StringMapper(head4), paddingLength - 6) + pad(smallUintToBase32StringMapper(tail), 6);
}
function paddedUintToBase32StringMapper(paddingLength) {
  return function padded(num) {
    return uintToBase32StringMapper(num, paddingLength);
  };
}

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/ulid.js
var padded10Mapper = paddedUintToBase32StringMapper(10);
var padded8Mapper = paddedUintToBase32StringMapper(8);

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/check/model/commands/CommandsIterable.js
var CommandsIterable = class _CommandsIterable {
  constructor(commands2, metadataForReplay) {
    this.commands = commands2;
    this.metadataForReplay = metadataForReplay;
  }
  [Symbol.iterator]() {
    return this.commands[Symbol.iterator]();
  }
  [cloneMethod]() {
    return new _CommandsIterable(this.commands.map((c) => c.clone()), this.metadataForReplay);
  }
  toString() {
    const serializedCommands = this.commands.filter((c) => c.hasRan).map((c) => c.toString()).join(",");
    const metadata = this.metadataForReplay();
    return metadata.length !== 0 ? `${serializedCommands} /*${metadata}*/` : serializedCommands;
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/implementations/SchedulerImplem.js
var defaultSchedulerAct = (f) => f();
var SchedulerImplem = class _SchedulerImplem {
  constructor(act, taskSelector) {
    this.act = act;
    this.taskSelector = taskSelector;
    this.lastTaskId = 0;
    this.sourceTaskSelector = taskSelector.clone();
    this.scheduledTasks = [];
    this.triggeredTasks = [];
    this.scheduledWatchers = [];
  }
  static buildLog(reportItem) {
    return `[task\${${reportItem.taskId}}] ${reportItem.label.length !== 0 ? `${reportItem.schedulingType}::${reportItem.label}` : reportItem.schedulingType} ${reportItem.status}${reportItem.outputValue !== void 0 ? ` with value ${escapeForTemplateString(reportItem.outputValue)}` : ""}`;
  }
  log(schedulingType, taskId, label, metadata, status, data) {
    this.triggeredTasks.push({
      status,
      schedulingType,
      taskId,
      label,
      metadata,
      outputValue: data !== void 0 ? stringify(data) : void 0
    });
  }
  scheduleInternal(schedulingType, label, task, metadata, customAct, thenTaskToBeAwaited) {
    let trigger = null;
    const taskId = ++this.lastTaskId;
    const scheduledPromise = new Promise((resolve, reject) => {
      trigger = () => {
        (thenTaskToBeAwaited ? task.then(() => thenTaskToBeAwaited()) : task).then((data) => {
          this.log(schedulingType, taskId, label, metadata, "resolved", data);
          return resolve(data);
        }, (err2) => {
          this.log(schedulingType, taskId, label, metadata, "rejected", err2);
          return reject(err2);
        });
      };
    });
    this.scheduledTasks.push({
      original: task,
      scheduled: scheduledPromise,
      trigger,
      schedulingType,
      taskId,
      label,
      metadata,
      customAct
    });
    if (this.scheduledWatchers.length !== 0) {
      this.scheduledWatchers[0]();
    }
    return scheduledPromise;
  }
  schedule(task, label, metadata, customAct) {
    return this.scheduleInternal("promise", label || "", task, metadata, customAct || defaultSchedulerAct);
  }
  scheduleFunction(asyncFunction, customAct) {
    return (...args2) => this.scheduleInternal("function", `${asyncFunction.name}(${args2.map(stringify).join(",")})`, asyncFunction(...args2), void 0, customAct || defaultSchedulerAct);
  }
  scheduleSequence(sequenceBuilders, customAct) {
    const status = { done: false, faulty: false };
    const dummyResolvedPromise = { then: (f) => f() };
    let resolveSequenceTask = () => {
    };
    const sequenceTask = new Promise((resolve) => resolveSequenceTask = resolve);
    sequenceBuilders.reduce((previouslyScheduled, item) => {
      const [builder, label, metadata] = typeof item === "function" ? [item, item.name, void 0] : [item.builder, item.label, item.metadata];
      return previouslyScheduled.then(() => {
        const scheduled = this.scheduleInternal("sequence", label, dummyResolvedPromise, metadata, customAct || defaultSchedulerAct, () => builder());
        scheduled.catch(() => {
          status.faulty = true;
          resolveSequenceTask();
        });
        return scheduled;
      });
    }, dummyResolvedPromise).then(() => {
      status.done = true;
      resolveSequenceTask();
    }, () => {
    });
    return Object.assign(status, {
      task: Promise.resolve(sequenceTask).then(() => {
        return { done: status.done, faulty: status.faulty };
      })
    });
  }
  count() {
    return this.scheduledTasks.length;
  }
  internalWaitOne() {
    if (this.scheduledTasks.length === 0) {
      throw new Error("No task scheduled");
    }
    const taskIndex = this.taskSelector.nextTaskIndex(this.scheduledTasks);
    const [scheduledTask] = this.scheduledTasks.splice(taskIndex, 1);
    return scheduledTask.customAct(async () => {
      scheduledTask.trigger();
      try {
        await scheduledTask.scheduled;
      } catch (_err) {
      }
    });
  }
  async waitOne(customAct) {
    const waitAct = customAct || defaultSchedulerAct;
    await this.act(() => waitAct(async () => await this.internalWaitOne()));
  }
  async waitAll(customAct) {
    while (this.scheduledTasks.length > 0) {
      await this.waitOne(customAct);
    }
  }
  async waitFor(unscheduledTask, customAct) {
    let taskResolved = false;
    let awaiterPromise = null;
    const awaiter = async () => {
      while (!taskResolved && this.scheduledTasks.length > 0) {
        await this.waitOne(customAct);
      }
      awaiterPromise = null;
    };
    const handleNotified = () => {
      if (awaiterPromise !== null) {
        return;
      }
      awaiterPromise = Promise.resolve().then(awaiter);
    };
    const clearAndReplaceWatcher = () => {
      const handleNotifiedIndex = this.scheduledWatchers.indexOf(handleNotified);
      if (handleNotifiedIndex !== -1) {
        this.scheduledWatchers.splice(handleNotifiedIndex, 1);
      }
      if (handleNotifiedIndex === 0 && this.scheduledWatchers.length !== 0) {
        this.scheduledWatchers[0]();
      }
    };
    const rewrappedTask = unscheduledTask.then((ret) => {
      taskResolved = true;
      if (awaiterPromise === null) {
        clearAndReplaceWatcher();
        return ret;
      }
      return awaiterPromise.then(() => {
        clearAndReplaceWatcher();
        return ret;
      });
    }, (err2) => {
      taskResolved = true;
      if (awaiterPromise === null) {
        clearAndReplaceWatcher();
        throw err2;
      }
      return awaiterPromise.then(() => {
        clearAndReplaceWatcher();
        throw err2;
      });
    });
    if (this.scheduledTasks.length > 0 && this.scheduledWatchers.length === 0) {
      handleNotified();
    }
    this.scheduledWatchers.push(handleNotified);
    return rewrappedTask;
  }
  report() {
    return [
      ...this.triggeredTasks,
      ...this.scheduledTasks.map((t) => ({
        status: "pending",
        schedulingType: t.schedulingType,
        taskId: t.taskId,
        label: t.label,
        metadata: t.metadata
      }))
    ];
  }
  toString() {
    return "schedulerFor()`\n" + this.report().map(_SchedulerImplem.buildLog).map((log) => `-> ${log}`).join("\n") + "`";
  }
  [cloneMethod]() {
    return new _SchedulerImplem(this.act, this.sourceTaskSelector);
  }
};

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ReadRegex.js
var TokenizerBlockMode;
(function(TokenizerBlockMode2) {
  TokenizerBlockMode2[TokenizerBlockMode2["Full"] = 0] = "Full";
  TokenizerBlockMode2[TokenizerBlockMode2["Character"] = 1] = "Character";
})(TokenizerBlockMode || (TokenizerBlockMode = {}));

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/TokenizeRegex.js
var safeStringFromCodePoint2 = String.fromCodePoint;

// ../../node_modules/.pnpm/fast-check@3.23.2/node_modules/fast-check/lib/esm/arbitrary/stringMatching.js
var safeStringFromCodePoint3 = String.fromCodePoint;
var wordChars = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"];
var digitChars = [..."0123456789"];
var spaceChars = [..." 	\r\n\v\f"];
var newLineChars = [..."\r\n"];
var terminatorChars = [...""];
var newLineAndTerminatorChars = [...newLineChars, ...terminatorChars];
var defaultChar = char();

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/schema/util.js
var getKeysForIndexSignature = (input, parameter) => {
  switch (parameter._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(input);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(input);
    case "Refinement":
      return getKeysForIndexSignature(input, parameter.from);
  }
};
var ownKeys = (o) => Object.keys(o).concat(Object.getOwnPropertySymbols(o));
var memoizeThunk = (f) => {
  let done4 = false;
  let a;
  return () => {
    if (done4) {
      return a;
    }
    a = f();
    done4 = true;
    return a;
  };
};
var formatDate = (date3) => {
  try {
    return date3.toISOString();
  } catch {
    return String(date3);
  }
};
var formatUnknown = (u, checkCircular = true) => {
  if (Array.isArray(u)) {
    return `[${u.map((i) => formatUnknown(i, checkCircular)).join(",")}]`;
  }
  if (isDate(u)) {
    return formatDate(u);
  }
  if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString) {
    return u["toString"]();
  }
  if (isString(u)) {
    return JSON.stringify(u);
  }
  if (isNumber(u) || u == null || isBoolean(u) || isSymbol(u)) {
    return String(u);
  }
  if (isBigInt(u)) {
    return String(u) + "n";
  }
  if (isIterable(u)) {
    return `${u.constructor.name}(${formatUnknown(Array.from(u), checkCircular)})`;
  }
  try {
    if (checkCircular) {
      JSON.stringify(u);
    }
    const pojo = `{${ownKeys(u).map((k) => `${isString(k) ? JSON.stringify(k) : String(k)}:${formatUnknown(u[k], false)}`).join(",")}}`;
    const name = u.constructor.name;
    return u.constructor !== Object.prototype.constructor ? `${name}(${pojo})` : pojo;
  } catch {
    return "<circular structure>";
  }
};
var formatPropertyKey = (name) => typeof name === "string" ? JSON.stringify(name) : String(name);
var isNonEmpty = (x) => Array.isArray(x);
var isSingle = (x) => !Array.isArray(x);
var formatPathKey = (key) => `[${formatPropertyKey(key)}]`;
var formatPath = (path2) => isNonEmpty(path2) ? path2.map(formatPathKey).join("") : formatPathKey(path2);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/schema/errors.js
var getErrorMessage = (reason, details, path2, ast) => {
  let out = reason;
  if (path2 && isNonEmptyReadonlyArray(path2)) {
    out += `
at path: ${formatPath(path2)}`;
  }
  if (details !== void 0) {
    out += `
details: ${details}`;
  }
  if (ast) {
    out += `
schema (${ast._tag}): ${ast}`;
  }
  return out;
};
var getInvalidArgumentErrorMessage = (details) => getErrorMessage("Invalid Argument", details);
var getUnsupportedSchemaErrorMessage = (details, path2, ast) => getErrorMessage("Unsupported schema", details, path2, ast);
var getEquivalenceUnsupportedErrorMessage = (ast, path2) => getUnsupportedSchemaErrorMessage("Cannot build an Equivalence", path2, ast);
var getSchemaExtendErrorMessage = (x, y, path2) => getErrorMessage("Unsupported schema or overlapping types", `cannot extend ${x} with ${y}`, path2);
var getSchemaUnsupportedLiteralSpanErrorMessage = (ast) => getErrorMessage("Unsupported template literal span", void 0, void 0, ast);
var getASTUnsupportedSchemaErrorMessage = (ast) => getUnsupportedSchemaErrorMessage(void 0, void 0, ast);
var getASTUnsupportedKeySchemaErrorMessage = (ast) => getErrorMessage("Unsupported key schema", void 0, void 0, ast);
var getASTUnsupportedLiteralErrorMessage = (literal2) => getErrorMessage("Unsupported literal", `literal value: ${formatUnknown(literal2)}`);
var getASTDuplicateIndexSignatureErrorMessage = (type) => getErrorMessage("Duplicate index signature", `${type} index signature`);
var getASTIndexSignatureParameterErrorMessage = /* @__PURE__ */ getErrorMessage("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types");
var getASTRequiredElementFollowinAnOptionalElementErrorMessage = /* @__PURE__ */ getErrorMessage("Invalid element", "A required element cannot follow an optional element. ts(1257)");
var getASTDuplicatePropertySignatureTransformationErrorMessage = (key) => getErrorMessage("Duplicate property signature transformation", `Duplicate key ${formatUnknown(key)}`);
var getASTUnsupportedRenameSchemaErrorMessage = (ast) => getUnsupportedSchemaErrorMessage(void 0, void 0, ast);
var getASTDuplicatePropertySignatureErrorMessage = (key) => getErrorMessage("Duplicate property signature", `Duplicate key ${formatUnknown(key)}`);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/schema/schemaId.js
var DateFromSelfSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/DateFromSelf");
var GreaterThanSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThan");
var GreaterThanOrEqualToSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanOrEqualTo");
var LessThanSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThan");
var LessThanOrEqualToSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanOrEqualTo");
var IntSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Int");
var NonNaNSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/NonNaN");
var FiniteSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Finite");
var JsonNumberSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/JsonNumber");
var BetweenSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Between");
var GreaterThanBigintSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanBigint");
var GreaterThanOrEqualToBigIntSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanOrEqualToBigint");
var LessThanBigIntSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanBigint");
var LessThanOrEqualToBigIntSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanOrEqualToBigint");
var BetweenBigintSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/BetweenBigint");
var MinLengthSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/MinLength");
var MaxLengthSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/MaxLength");
var LengthSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Length");
var MinItemsSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/MinItems");
var MaxItemsSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/MaxItems");
var ItemsCountSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/ItemsCount");

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Number.js
var Order = number3;
var clamp3 = /* @__PURE__ */ clamp(Order);
var remainder = /* @__PURE__ */ dual(2, (dividend, divisor) => {
  const selfDecCount = (dividend.toString().split(".")[1] || "").length;
  const divisorDecCount = (divisor.toString().split(".")[1] || "").length;
  const decCount = selfDecCount > divisorDecCount ? selfDecCount : divisorDecCount;
  const selfInt = parseInt(dividend.toFixed(decCount).replace(".", ""));
  const divisorInt = parseInt(divisor.toFixed(decCount).replace(".", ""));
  return selfInt % divisorInt / Math.pow(10, decCount);
});
var parse = (s) => {
  if (s === "NaN") {
    return some(NaN);
  }
  if (s === "Infinity") {
    return some(Infinity);
  }
  if (s === "-Infinity") {
    return some(-Infinity);
  }
  if (s.trim() === "") {
    return none;
  }
  const n = Number(s);
  return Number.isNaN(n) ? none : some(n);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/RegExp.js
var escape = (string5) => string5.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/SchemaAST.js
var BrandAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Brand");
var SchemaIdAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId");
var MessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Message");
var MissingMessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage");
var IdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier");
var TitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Title");
var AutoTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle");
var DescriptionAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Description");
var ExamplesAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Examples");
var DefaultAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Default");
var JSONSchemaAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema");
var ArbitraryAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary");
var PrettyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty");
var EquivalenceAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence");
var DocumentationAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Documentation");
var ConcurrencyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency");
var BatchingAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Batching");
var ParseIssueTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle");
var ParseOptionsAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions");
var DecodingFallbackAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback");
var SurrogateAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate");
var StableFilterAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter");
var getAnnotation = /* @__PURE__ */ dual(2, (annotated, key) => Object.prototype.hasOwnProperty.call(annotated.annotations, key) ? some2(annotated.annotations[key]) : none2());
var getBrandAnnotation = /* @__PURE__ */ getAnnotation(BrandAnnotationId);
var getMessageAnnotation = /* @__PURE__ */ getAnnotation(MessageAnnotationId);
var getMissingMessageAnnotation = /* @__PURE__ */ getAnnotation(MissingMessageAnnotationId);
var getTitleAnnotation = /* @__PURE__ */ getAnnotation(TitleAnnotationId);
var getAutoTitleAnnotation = /* @__PURE__ */ getAnnotation(AutoTitleAnnotationId);
var getIdentifierAnnotation = /* @__PURE__ */ getAnnotation(IdentifierAnnotationId);
var getDescriptionAnnotation = /* @__PURE__ */ getAnnotation(DescriptionAnnotationId);
var getConcurrencyAnnotation = /* @__PURE__ */ getAnnotation(ConcurrencyAnnotationId);
var getBatchingAnnotation = /* @__PURE__ */ getAnnotation(BatchingAnnotationId);
var getParseIssueTitleAnnotation = /* @__PURE__ */ getAnnotation(ParseIssueTitleAnnotationId);
var getParseOptionsAnnotation = /* @__PURE__ */ getAnnotation(ParseOptionsAnnotationId);
var getDecodingFallbackAnnotation = /* @__PURE__ */ getAnnotation(DecodingFallbackAnnotationId);
var getSurrogateAnnotation = /* @__PURE__ */ getAnnotation(SurrogateAnnotationId);
var getStableFilterAnnotation = /* @__PURE__ */ getAnnotation(StableFilterAnnotationId);
var hasStableFilter = (annotated) => exists(getStableFilterAnnotation(annotated), (b) => b === true);
var JSONIdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier");
var getJSONIdentifierAnnotation = /* @__PURE__ */ getAnnotation(JSONIdentifierAnnotationId);
var getJSONIdentifier = (annotated) => orElse2(getJSONIdentifierAnnotation(annotated), () => getIdentifierAnnotation(annotated));
var ParseJsonSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/ParseJson");
var Declaration = class {
  typeParameters;
  decodeUnknown;
  encodeUnknown;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Declaration";
  constructor(typeParameters, decodeUnknown3, encodeUnknown3, annotations3 = {}) {
    this.typeParameters = typeParameters;
    this.decodeUnknown = decodeUnknown3;
    this.encodeUnknown = encodeUnknown3;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => "<declaration schema>");
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var createASTGuard = (tag2) => (ast) => ast._tag === tag2;
var Literal = class {
  literal;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Literal";
  constructor(literal2, annotations3 = {}) {
    this.literal = literal2;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => formatUnknown(this.literal));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isLiteral = /* @__PURE__ */ createASTGuard("Literal");
var $null = /* @__PURE__ */ new Literal(null);
var UniqueSymbol = class {
  symbol;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UniqueSymbol";
  constructor(symbol3, annotations3 = {}) {
    this.symbol = symbol3;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => formatUnknown(this.symbol));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      symbol: String(this.symbol),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isUniqueSymbol = /* @__PURE__ */ createASTGuard("UniqueSymbol");
var UndefinedKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UndefinedKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var undefinedKeyword = /* @__PURE__ */ new UndefinedKeyword({
  [TitleAnnotationId]: "undefined"
});
var VoidKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "VoidKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var voidKeyword = /* @__PURE__ */ new VoidKeyword({
  [TitleAnnotationId]: "void"
});
var NeverKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NeverKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var neverKeyword = /* @__PURE__ */ new NeverKeyword({
  [TitleAnnotationId]: "never"
});
var isNeverKeyword = /* @__PURE__ */ createASTGuard("NeverKeyword");
var UnknownKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UnknownKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var unknownKeyword = /* @__PURE__ */ new UnknownKeyword({
  [TitleAnnotationId]: "unknown"
});
var AnyKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "AnyKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var anyKeyword = /* @__PURE__ */ new AnyKeyword({
  [TitleAnnotationId]: "any"
});
var StringKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "StringKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var stringKeyword = /* @__PURE__ */ new StringKeyword({
  [TitleAnnotationId]: "string",
  [DescriptionAnnotationId]: "a string"
});
var isStringKeyword = /* @__PURE__ */ createASTGuard("StringKeyword");
var NumberKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NumberKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var numberKeyword = /* @__PURE__ */ new NumberKeyword({
  [TitleAnnotationId]: "number",
  [DescriptionAnnotationId]: "a number"
});
var isNumberKeyword = /* @__PURE__ */ createASTGuard("NumberKeyword");
var BooleanKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "BooleanKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var booleanKeyword = /* @__PURE__ */ new BooleanKeyword({
  [TitleAnnotationId]: "boolean",
  [DescriptionAnnotationId]: "a boolean"
});
var isBooleanKeyword = /* @__PURE__ */ createASTGuard("BooleanKeyword");
var BigIntKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "BigIntKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var bigIntKeyword = /* @__PURE__ */ new BigIntKeyword({
  [TitleAnnotationId]: "bigint",
  [DescriptionAnnotationId]: "a bigint"
});
var SymbolKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "SymbolKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var symbolKeyword = /* @__PURE__ */ new SymbolKeyword({
  [TitleAnnotationId]: "symbol",
  [DescriptionAnnotationId]: "a symbol"
});
var isSymbolKeyword = /* @__PURE__ */ createASTGuard("SymbolKeyword");
var ObjectKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "ObjectKeyword";
  constructor(annotations3 = {}) {
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var objectKeyword = /* @__PURE__ */ new ObjectKeyword({
  [TitleAnnotationId]: "object",
  [DescriptionAnnotationId]: "an object in the TypeScript meaning, i.e. the `object` type"
});
var Enums = class {
  enums;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Enums";
  constructor(enums, annotations3 = {}) {
    this.enums = enums;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => `<enum ${this.enums.length} value(s): ${this.enums.map(([_, value3]) => JSON.stringify(value3)).join(" | ")}>`);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      enums: this.enums,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isEnums = /* @__PURE__ */ createASTGuard("Enums");
var isTemplateLiteralSpanType = (ast) => {
  switch (ast._tag) {
    case "Literal":
    case "NumberKeyword":
    case "StringKeyword":
    case "TemplateLiteral":
      return true;
    case "Union":
      return ast.types.every(isTemplateLiteralSpanType);
  }
  return false;
};
var templateLiteralSpanUnionTypeToString = (type) => {
  switch (type._tag) {
    case "Literal":
      return JSON.stringify(String(type.literal));
    case "StringKeyword":
      return "string";
    case "NumberKeyword":
      return "number";
    case "TemplateLiteral":
      return String(type);
    case "Union":
      return type.types.map(templateLiteralSpanUnionTypeToString).join(" | ");
  }
};
var templateLiteralSpanTypeToString = (type) => {
  switch (type._tag) {
    case "Literal":
      return String(type.literal);
    case "StringKeyword":
      return "${string}";
    case "NumberKeyword":
      return "${number}";
    case "TemplateLiteral":
      return "${" + String(type) + "}";
    case "Union":
      return "${" + type.types.map(templateLiteralSpanUnionTypeToString).join(" | ") + "}";
  }
};
var TemplateLiteralSpan = class {
  literal;
  /**
   * @since 3.10.0
   */
  type;
  constructor(type, literal2) {
    this.literal = literal2;
    if (isTemplateLiteralSpanType(type)) {
      this.type = type;
    } else {
      throw new Error(getSchemaUnsupportedLiteralSpanErrorMessage(type));
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return templateLiteralSpanTypeToString(this.type) + this.literal;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      literal: this.literal
    };
  }
};
var TemplateLiteral = class {
  head;
  spans;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TemplateLiteral";
  constructor(head4, spans, annotations3 = {}) {
    this.head = head4;
    this.spans = spans;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => formatTemplateLiteral(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      head: this.head,
      spans: this.spans.map((span2) => span2.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatTemplateLiteral = (ast) => "`" + ast.head + ast.spans.map(String).join("") + "`";
var isTemplateLiteral = /* @__PURE__ */ createASTGuard("TemplateLiteral");
var Type = class {
  type;
  annotations;
  constructor(type, annotations3 = {}) {
    this.type = type;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type);
  }
};
var OptionalType = class extends Type {
  isOptional;
  constructor(type, isOptional, annotations3 = {}) {
    super(type, annotations3);
    this.isOptional = isOptional;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
};
var getRestASTs = (rest) => rest.map((annotatedAST) => annotatedAST.type);
var TupleType = class {
  elements;
  rest;
  isReadonly;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TupleType";
  constructor(elements, rest, isReadonly, annotations3 = {}) {
    this.elements = elements;
    this.rest = rest;
    this.isReadonly = isReadonly;
    this.annotations = annotations3;
    let hasOptionalElement = false;
    let hasIllegalRequiredElement = false;
    for (const e of elements) {
      if (e.isOptional) {
        hasOptionalElement = true;
      } else if (hasOptionalElement) {
        hasIllegalRequiredElement = true;
        break;
      }
    }
    if (hasIllegalRequiredElement || hasOptionalElement && rest.length > 1) {
      throw new Error(getASTRequiredElementFollowinAnOptionalElementErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => formatTuple(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      elements: this.elements.map((e) => e.toJSON()),
      rest: this.rest.map((ast) => ast.toJSON()),
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatTuple = (ast) => {
  const formattedElements = ast.elements.map(String).join(", ");
  return matchLeft(ast.rest, {
    onEmpty: () => `readonly [${formattedElements}]`,
    onNonEmpty: (head4, tail) => {
      const formattedHead = String(head4);
      const wrappedHead = formattedHead.includes(" | ") ? `(${formattedHead})` : formattedHead;
      if (tail.length > 0) {
        const formattedTail = tail.map(String).join(", ");
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`;
        } else {
          return `readonly [...${wrappedHead}[], ${formattedTail}]`;
        }
      } else {
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[]]`;
        } else {
          return `ReadonlyArray<${formattedHead}>`;
        }
      }
    }
  });
};
var PropertySignature = class extends OptionalType {
  name;
  isReadonly;
  constructor(name, type, isOptional, isReadonly, annotations3) {
    super(type, isOptional, annotations3);
    this.name = name;
    this.isReadonly = isReadonly;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + String(this.name) + (this.isOptional ? "?" : "") + ": " + this.type;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      name: String(this.name),
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return true;
    case "Refinement":
      return isParameter(ast.from);
  }
  return false;
};
var IndexSignature = class {
  type;
  isReadonly;
  /**
   * @since 3.10.0
   */
  parameter;
  constructor(parameter, type, isReadonly) {
    this.type = type;
    this.isReadonly = isReadonly;
    if (isParameter(parameter)) {
      this.parameter = parameter;
    } else {
      throw new Error(getASTIndexSignatureParameterErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + `[x: ${this.parameter}]: ${this.type}`;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      parameter: this.parameter.toJSON(),
      type: this.type.toJSON(),
      isReadonly: this.isReadonly
    };
  }
};
var TypeLiteral = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TypeLiteral";
  /**
   * @since 3.10.0
   */
  propertySignatures;
  /**
   * @since 3.10.0
   */
  indexSignatures;
  constructor(propertySignatures, indexSignatures, annotations3 = {}) {
    this.annotations = annotations3;
    const keys6 = {};
    for (let i = 0; i < propertySignatures.length; i++) {
      const name = propertySignatures[i].name;
      if (Object.prototype.hasOwnProperty.call(keys6, name)) {
        throw new Error(getASTDuplicatePropertySignatureErrorMessage(name));
      }
      keys6[name] = null;
    }
    const parameters = {
      string: false,
      symbol: false
    };
    for (let i = 0; i < indexSignatures.length; i++) {
      const encodedParameter = getEncodedParameter(indexSignatures[i].parameter);
      if (isStringKeyword(encodedParameter)) {
        if (parameters.string) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("string"));
        }
        parameters.string = true;
      } else if (isSymbolKeyword(encodedParameter)) {
        if (parameters.symbol) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("symbol"));
        }
        parameters.symbol = true;
      }
    }
    this.propertySignatures = propertySignatures;
    this.indexSignatures = indexSignatures;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => formatTypeLiteral(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
      indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatIndexSignatures = (iss) => iss.map(String).join("; ");
var formatTypeLiteral = (ast) => {
  if (ast.propertySignatures.length > 0) {
    const pss = ast.propertySignatures.map(String).join("; ");
    if (ast.indexSignatures.length > 0) {
      return `{ ${pss}; ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return `{ ${pss} }`;
    }
  } else {
    if (ast.indexSignatures.length > 0) {
      return `{ ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return "{}";
    }
  }
};
var isTypeLiteral = /* @__PURE__ */ createASTGuard("TypeLiteral");
var sortCandidates = /* @__PURE__ */ sort(/* @__PURE__ */ mapInput2(Order, (ast) => {
  switch (ast._tag) {
    case "AnyKeyword":
      return 0;
    case "UnknownKeyword":
      return 1;
    case "ObjectKeyword":
      return 2;
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3;
  }
  return 4;
}));
var literalMap = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword"
};
var flatten2 = (candidates) => flatMap3(candidates, (ast) => isUnion(ast) ? flatten2(ast.types) : [ast]);
var unify = (candidates) => {
  const cs = sortCandidates(candidates);
  const out = [];
  const uniques = {};
  const literals = [];
  for (const ast of cs) {
    switch (ast._tag) {
      case "NeverKeyword":
        break;
      case "AnyKeyword":
        return [anyKeyword];
      case "UnknownKeyword":
        return [unknownKeyword];
      // uniques
      case "ObjectKeyword":
      case "UndefinedKeyword":
      case "VoidKeyword":
      case "StringKeyword":
      case "NumberKeyword":
      case "BooleanKeyword":
      case "BigIntKeyword":
      case "SymbolKeyword": {
        if (!uniques[ast._tag]) {
          uniques[ast._tag] = ast;
          out.push(ast);
        }
        break;
      }
      case "Literal": {
        const type = typeof ast.literal;
        switch (type) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const _tag = literalMap[type];
            if (!uniques[_tag] && !literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
          // null
          case "object": {
            if (!literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
        }
        break;
      }
      case "UniqueSymbol": {
        if (!uniques["SymbolKeyword"] && !literals.includes(ast.symbol)) {
          literals.push(ast.symbol);
          out.push(ast);
        }
        break;
      }
      case "TupleType": {
        if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      case "TypeLiteral": {
        if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
          if (!uniques["{}"]) {
            uniques["{}"] = ast;
            out.push(ast);
          }
        } else if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      default:
        out.push(ast);
    }
  }
  return out;
};
var Union = class _Union {
  types;
  annotations;
  static make = (types, annotations3) => {
    return isMembers(types) ? new _Union(types, annotations3) : types.length === 1 ? types[0] : neverKeyword;
  };
  /** @internal */
  static unify = (candidates, annotations3) => {
    return _Union.make(unify(flatten2(candidates)), annotations3);
  };
  /**
   * @since 3.10.0
   */
  _tag = "Union";
  constructor(types, annotations3 = {}) {
    this.types = types;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => this.types.map(String).join(" | "));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      types: this.types.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var mapMembers = (members, f) => members.map(f);
var isMembers = (as4) => as4.length > 1;
var isUnion = /* @__PURE__ */ createASTGuard("Union");
var toJSONMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
var Suspend = class {
  f;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Suspend";
  constructor(f, annotations3 = {}) {
    this.f = f;
    this.annotations = annotations3;
    this.f = memoizeThunk(f);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getExpected(this).pipe(orElse2(() => flatMap2(liftThrowable(this.f)(), (ast) => getExpected(ast))), getOrElse2(() => "<suspended schema>"));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    const ast = this.f();
    let out = toJSONMemoMap.get(ast);
    if (out) {
      return out;
    }
    toJSONMemoMap.set(ast, {
      _tag: this._tag
    });
    out = {
      _tag: this._tag,
      ast: ast.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
    toJSONMemoMap.set(ast, out);
    return out;
  }
};
var Refinement = class {
  from;
  filter;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(from, filter8, annotations3 = {}) {
    this.from = from;
    this.filter = filter8;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getIdentifierAnnotation(this).pipe(getOrElse2(() => match2(getOrElseExpected(this), {
      onNone: () => `{ ${this.from} | filter }`,
      onSome: (expected) => isRefinement(this.from) ? String(this.from) + " & " + expected : expected
    })));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isRefinement = /* @__PURE__ */ createASTGuard("Refinement");
var defaultParseOption = {};
var Transformation = class {
  from;
  to;
  transformation;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Transformation";
  constructor(from, to, transformation, annotations3 = {}) {
    this.from = from;
    this.to = to;
    this.transformation = transformation;
    this.annotations = annotations3;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse2(getExpected(this), () => `(${String(this.from)} <-> ${String(this.to)})`);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isTransformation = /* @__PURE__ */ createASTGuard("Transformation");
var FinalTransformation = class {
  decode;
  encode;
  /**
   * @since 3.10.0
   */
  _tag = "FinalTransformation";
  constructor(decode6, encode5) {
    this.decode = decode6;
    this.encode = encode5;
  }
};
var createTransformationGuard = (tag2) => (ast) => ast._tag === tag2;
var ComposeTransformation = class {
  /**
   * @since 3.10.0
   */
  _tag = "ComposeTransformation";
};
var composeTransformation = /* @__PURE__ */ new ComposeTransformation();
var PropertySignatureTransformation = class {
  from;
  to;
  decode;
  encode;
  constructor(from, to, decode6, encode5) {
    this.from = from;
    this.to = to;
    this.decode = decode6;
    this.encode = encode5;
  }
};
var isRenamingPropertySignatureTransformation = (t) => t.decode === identity && t.encode === identity;
var TypeLiteralTransformation = class {
  propertySignatureTransformations;
  /**
   * @since 3.10.0
   */
  _tag = "TypeLiteralTransformation";
  constructor(propertySignatureTransformations) {
    this.propertySignatureTransformations = propertySignatureTransformations;
    const fromKeys = {};
    const toKeys = {};
    for (const pst of propertySignatureTransformations) {
      const from = pst.from;
      if (fromKeys[from]) {
        throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(from));
      }
      fromKeys[from] = true;
      const to = pst.to;
      if (toKeys[to]) {
        throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(to));
      }
      toKeys[to] = true;
    }
  }
};
var isTypeLiteralTransformation = /* @__PURE__ */ createTransformationGuard("TypeLiteralTransformation");
var annotations = (ast, overrides) => {
  const d = Object.getOwnPropertyDescriptors(ast);
  const value3 = {
    ...ast.annotations,
    ...overrides
  };
  const surrogate = getSurrogateAnnotation(ast);
  if (isSome2(surrogate)) {
    value3[SurrogateAnnotationId] = annotations(surrogate.value, overrides);
  }
  d.annotations.value = value3;
  return Object.create(Object.getPrototypeOf(ast), d);
};
var keyof = (ast) => Union.unify(_keyof(ast));
var STRING_KEYWORD_PATTERN = "[\\s\\S]*";
var NUMBER_KEYWORD_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
var getTemplateLiteralSpanTypePattern = (type, capture2) => {
  switch (type._tag) {
    case "Literal":
      return escape(String(type.literal));
    case "StringKeyword":
      return STRING_KEYWORD_PATTERN;
    case "NumberKeyword":
      return NUMBER_KEYWORD_PATTERN;
    case "TemplateLiteral":
      return getTemplateLiteralPattern(type, capture2, false);
    case "Union":
      return type.types.map((type2) => getTemplateLiteralSpanTypePattern(type2, capture2)).join("|");
  }
};
var handleTemplateLiteralSpanTypeParens = (type, s, capture2, top) => {
  if (isUnion(type)) {
    if (capture2 && !top) {
      return `(?:${s})`;
    }
  } else if (!capture2 || !top) {
    return s;
  }
  return `(${s})`;
};
var getTemplateLiteralPattern = (ast, capture2, top) => {
  let pattern2 = ``;
  if (ast.head !== "") {
    const head4 = escape(ast.head);
    pattern2 += capture2 && top ? `(${head4})` : head4;
  }
  for (const span2 of ast.spans) {
    const spanPattern = getTemplateLiteralSpanTypePattern(span2.type, capture2);
    pattern2 += handleTemplateLiteralSpanTypeParens(span2.type, spanPattern, capture2, top);
    if (span2.literal !== "") {
      const literal2 = escape(span2.literal);
      pattern2 += capture2 && top ? `(${literal2})` : literal2;
    }
  }
  return pattern2;
};
var getTemplateLiteralRegExp = (ast) => new RegExp(`^${getTemplateLiteralPattern(ast, false, true)}$`);
var getTemplateLiteralCapturingRegExp = (ast) => new RegExp(`^${getTemplateLiteralPattern(ast, true, true)}$`);
var getIndexSignatures = (ast) => {
  const annotation = getSurrogateAnnotation(ast);
  if (isSome2(annotation)) {
    return getIndexSignatures(annotation.value);
  }
  switch (ast._tag) {
    case "TypeLiteral":
      return ast.indexSignatures.slice();
    case "Suspend":
      return getIndexSignatures(ast.f());
    case "Refinement":
      return getIndexSignatures(ast.from);
  }
  return [];
};
var getNumberIndexedAccess = (ast) => {
  switch (ast._tag) {
    case "TupleType": {
      let hasOptional = false;
      let out = [];
      for (const e of ast.elements) {
        if (e.isOptional) {
          hasOptional = true;
        }
        out.push(e.type);
      }
      if (hasOptional) {
        out.push(undefinedKeyword);
      }
      out = out.concat(getRestASTs(ast.rest));
      return Union.make(out);
    }
    case "Refinement":
      return getNumberIndexedAccess(ast.from);
    case "Union":
      return Union.make(ast.types.map(getNumberIndexedAccess));
    case "Suspend":
      return getNumberIndexedAccess(ast.f());
  }
  throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
};
var getTypeLiteralPropertySignature = (ast, name) => {
  const ops = findFirst2(ast.propertySignatures, (ps) => ps.name === name);
  if (isSome2(ops)) {
    return ops.value;
  }
  if (isString(name)) {
    let out = void 0;
    for (const is2 of ast.indexSignatures) {
      const encodedParameter = getEncodedParameter(is2.parameter);
      switch (encodedParameter._tag) {
        case "TemplateLiteral": {
          const regex = getTemplateLiteralRegExp(encodedParameter);
          if (regex.test(name)) {
            return new PropertySignature(name, is2.type, false, true);
          }
          break;
        }
        case "StringKeyword": {
          if (out === void 0) {
            out = new PropertySignature(name, is2.type, false, true);
          }
        }
      }
    }
    if (out) {
      return out;
    }
  } else if (isSymbol(name)) {
    for (const is2 of ast.indexSignatures) {
      const encodedParameter = getEncodedParameter(is2.parameter);
      if (isSymbolKeyword(encodedParameter)) {
        return new PropertySignature(name, is2.type, false, true);
      }
    }
  }
};
var getPropertyKeyIndexedAccess = (ast, name) => {
  const annotation = getSurrogateAnnotation(ast);
  if (isSome2(annotation)) {
    return getPropertyKeyIndexedAccess(annotation.value, name);
  }
  switch (ast._tag) {
    case "TypeLiteral": {
      const ps = getTypeLiteralPropertySignature(ast, name);
      if (ps) {
        return ps;
      }
      break;
    }
    case "Union":
      return new PropertySignature(name, Union.make(ast.types.map((ast2) => getPropertyKeyIndexedAccess(ast2, name).type)), false, true);
    case "Suspend":
      return getPropertyKeyIndexedAccess(ast.f(), name);
    case "Refinement":
      return getPropertyKeyIndexedAccess(ast.from, name);
  }
  throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
};
var getPropertyKeys = (ast) => {
  const annotation = getSurrogateAnnotation(ast);
  if (isSome2(annotation)) {
    return getPropertyKeys(annotation.value);
  }
  switch (ast._tag) {
    case "TypeLiteral":
      return ast.propertySignatures.map((ps) => ps.name);
    case "Union":
      return ast.types.slice(1).reduce((out, ast2) => intersection(out, getPropertyKeys(ast2)), getPropertyKeys(ast.types[0]));
    case "Suspend":
      return getPropertyKeys(ast.f());
    case "Refinement":
      return getPropertyKeys(ast.from);
    case "Transformation":
      return getPropertyKeys(ast.to);
  }
  return [];
};
var record2 = (key, value3) => {
  const propertySignatures = [];
  const indexSignatures = [];
  const go3 = (key2) => {
    switch (key2._tag) {
      case "NeverKeyword":
        break;
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
      case "Refinement":
        indexSignatures.push(new IndexSignature(key2, value3, true));
        break;
      case "Literal":
        if (isString(key2.literal) || isNumber(key2.literal)) {
          propertySignatures.push(new PropertySignature(key2.literal, value3, false, true));
        } else {
          throw new Error(getASTUnsupportedLiteralErrorMessage(key2.literal));
        }
        break;
      case "Enums": {
        for (const [_, name] of key2.enums) {
          propertySignatures.push(new PropertySignature(name, value3, false, true));
        }
        break;
      }
      case "UniqueSymbol":
        propertySignatures.push(new PropertySignature(key2.symbol, value3, false, true));
        break;
      case "Union":
        key2.types.forEach(go3);
        break;
      default:
        throw new Error(getASTUnsupportedKeySchemaErrorMessage(key2));
    }
  };
  go3(key);
  return {
    propertySignatures,
    indexSignatures
  };
};
var pick = (ast, keys6) => {
  const annotation = getSurrogateAnnotation(ast);
  if (isSome2(annotation)) {
    return pick(annotation.value, keys6);
  }
  switch (ast._tag) {
    case "TypeLiteral": {
      const pss = [];
      const names = {};
      for (const ps of ast.propertySignatures) {
        names[ps.name] = null;
        if (keys6.includes(ps.name)) {
          pss.push(ps);
        }
      }
      for (const key of keys6) {
        if (!(key in names)) {
          const ps = getTypeLiteralPropertySignature(ast, key);
          if (ps) {
            pss.push(ps);
          }
        }
      }
      return new TypeLiteral(pss, []);
    }
    case "Union":
      return new TypeLiteral(keys6.map((name) => getPropertyKeyIndexedAccess(ast, name)), []);
    case "Suspend":
      return pick(ast.f(), keys6);
    case "Refinement":
      return pick(ast.from, keys6);
    case "Transformation": {
      switch (ast.transformation._tag) {
        case "ComposeTransformation":
          return new Transformation(pick(ast.from, keys6), pick(ast.to, keys6), composeTransformation);
        case "TypeLiteralTransformation": {
          const ts = [];
          const fromKeys = [];
          for (const k of keys6) {
            const t = ast.transformation.propertySignatureTransformations.find((t2) => t2.to === k);
            if (t) {
              ts.push(t);
              fromKeys.push(t.from);
            } else {
              fromKeys.push(k);
            }
          }
          return isNonEmptyReadonlyArray(ts) ? new Transformation(pick(ast.from, fromKeys), pick(ast.to, keys6), new TypeLiteralTransformation(ts)) : pick(ast.from, fromKeys);
        }
      }
    }
  }
  throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
};
var omit = (ast, keys6) => {
  let indexSignatures = getIndexSignatures(ast);
  if (indexSignatures.length > 0) {
    if (indexSignatures.some((is2) => isStringKeyword(getEncodedParameter(is2.parameter)))) {
      indexSignatures = indexSignatures.filter((is2) => !isTemplateLiteral(getEncodedParameter(is2.parameter)));
    }
    return new TypeLiteral([], indexSignatures);
  }
  return pick(ast, getPropertyKeys(ast).filter((name) => !keys6.includes(name)));
};
var orUndefined = (ast) => Union.make([ast, undefinedKeyword]);
var partial = (ast, options) => {
  const exact = options?.exact === true;
  switch (ast._tag) {
    case "TupleType":
      return new TupleType(ast.elements.map((e) => new OptionalType(exact ? e.type : orUndefined(e.type), true)), match3(ast.rest, {
        onEmpty: () => ast.rest,
        onNonEmpty: (rest) => [new Type(Union.make([...getRestASTs(rest), undefinedKeyword]))]
      }), ast.isReadonly);
    case "TypeLiteral":
      return new TypeLiteral(ast.propertySignatures.map((ps) => new PropertySignature(ps.name, exact ? ps.type : orUndefined(ps.type), true, ps.isReadonly, ps.annotations)), ast.indexSignatures.map((is2) => new IndexSignature(is2.parameter, orUndefined(is2.type), is2.isReadonly)));
    case "Union":
      return Union.make(ast.types.map((member) => partial(member, options)));
    case "Suspend":
      return new Suspend(() => partial(ast.f(), options));
    case "Declaration":
    case "Refinement":
      throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
    case "Transformation": {
      if (isTypeLiteralTransformation(ast.transformation) && ast.transformation.propertySignatureTransformations.every(isRenamingPropertySignatureTransformation)) {
        return new Transformation(partial(ast.from, options), partial(ast.to, options), ast.transformation);
      }
      throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
    }
  }
  return ast;
};
var required = (ast) => {
  switch (ast._tag) {
    case "TupleType":
      return new TupleType(ast.elements.map((e) => new OptionalType(e.type, false)), ast.rest, ast.isReadonly);
    case "TypeLiteral":
      return new TypeLiteral(ast.propertySignatures.map((f) => new PropertySignature(f.name, f.type, false, f.isReadonly, f.annotations)), ast.indexSignatures);
    case "Union":
      return Union.make(ast.types.map((member) => required(member)));
    case "Suspend":
      return new Suspend(() => required(ast.f()));
    case "Declaration":
    case "Refinement":
      throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
    case "Transformation": {
      if (isTypeLiteralTransformation(ast.transformation) && ast.transformation.propertySignatureTransformations.every(isRenamingPropertySignatureTransformation)) {
        return new Transformation(required(ast.from), required(ast.to), ast.transformation);
      }
      throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
    }
  }
  return ast;
};
var mutable = (ast) => {
  switch (ast._tag) {
    case "TupleType":
      return ast.isReadonly === false ? ast : new TupleType(ast.elements, ast.rest, false, ast.annotations);
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (ps) => ps.isReadonly === false ? ps : new PropertySignature(ps.name, ps.type, ps.isOptional, false, ps.annotations));
      const indexSignatures = changeMap(ast.indexSignatures, (is2) => is2.isReadonly === false ? is2 : new IndexSignature(is2.parameter, is2.type, false));
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
    }
    case "Union": {
      const types = changeMap(ast.types, mutable);
      return types === ast.types ? ast : Union.make(types, ast.annotations);
    }
    case "Suspend":
      return new Suspend(() => mutable(ast.f()), ast.annotations);
    case "Refinement": {
      const from = mutable(ast.from);
      return from === ast.from ? ast : new Refinement(from, ast.filter, ast.annotations);
    }
    case "Transformation": {
      const from = mutable(ast.from);
      const to = mutable(ast.to);
      return from === ast.from && to === ast.to ? ast : new Transformation(from, to, ast.transformation, ast.annotations);
    }
  }
  return ast;
};
var pickAnnotations = (annotationIds) => (annotated) => {
  let out = void 0;
  for (const id of annotationIds) {
    if (Object.prototype.hasOwnProperty.call(annotated.annotations, id)) {
      if (out === void 0) {
        out = {};
      }
      out[id] = annotated.annotations[id];
    }
  }
  return out;
};
var omitAnnotations = (annotationIds) => (annotated) => {
  const out = {
    ...annotated.annotations
  };
  for (const id of annotationIds) {
    delete out[id];
  }
  return out;
};
var preserveTransformationAnnotations = /* @__PURE__ */ pickAnnotations([ExamplesAnnotationId, DefaultAnnotationId, JSONSchemaAnnotationId, ArbitraryAnnotationId, PrettyAnnotationId, EquivalenceAnnotationId]);
var typeAST = (ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, typeAST);
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown, ast.annotations);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = typeAST(e.type);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, typeAST);
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((type) => new Type(type)), ast.isReadonly, ast.annotations);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (p) => {
        const type = typeAST(p.type);
        return type === p.type ? p : new PropertySignature(p.name, type, p.isOptional, p.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is2) => {
        const type = typeAST(is2.type);
        return type === is2.type ? is2 : new IndexSignature(is2.parameter, type, is2.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
    }
    case "Union": {
      const types = changeMap(ast.types, typeAST);
      return types === ast.types ? ast : Union.make(types, ast.annotations);
    }
    case "Suspend":
      return new Suspend(() => typeAST(ast.f()), ast.annotations);
    case "Refinement": {
      const from = typeAST(ast.from);
      return from === ast.from ? ast : new Refinement(from, ast.filter, ast.annotations);
    }
    case "Transformation": {
      const preserve = preserveTransformationAnnotations(ast);
      return typeAST(preserve !== void 0 ? annotations(ast.to, preserve) : ast.to);
    }
  }
  return ast;
};
var createJSONIdentifierAnnotation = (annotated) => match2(getJSONIdentifier(annotated), {
  onNone: () => void 0,
  onSome: (identifier2) => ({
    [JSONIdentifierAnnotationId]: identifier2
  })
});
function changeMap(as4, f) {
  let changed = false;
  const out = allocate(as4.length);
  for (let i = 0; i < as4.length; i++) {
    const a = as4[i];
    const fa = f(a);
    if (fa !== a) {
      changed = true;
    }
    out[i] = fa;
  }
  return changed ? out : as4;
}
var getTransformationFrom = (ast) => {
  switch (ast._tag) {
    case "Transformation":
      return ast.from;
    case "Refinement":
      return getTransformationFrom(ast.from);
    case "Suspend":
      return getTransformationFrom(ast.f());
  }
};
var encodedAST_ = (ast, isBound) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, (ast2) => encodedAST_(ast2, isBound));
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown, ast.annotations);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = encodedAST_(e.type, isBound);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, (ast2) => encodedAST_(ast2, isBound));
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((ast2) => new Type(ast2)), ast.isReadonly, createJSONIdentifierAnnotation(ast));
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (ps) => {
        const type = encodedAST_(ps.type, isBound);
        return type === ps.type ? ps : new PropertySignature(ps.name, type, ps.isOptional, ps.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is2) => {
        const type = encodedAST_(is2.type, isBound);
        return type === is2.type ? is2 : new IndexSignature(is2.parameter, type, is2.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, createJSONIdentifierAnnotation(ast));
    }
    case "Union": {
      const types = changeMap(ast.types, (ast2) => encodedAST_(ast2, isBound));
      return types === ast.types ? ast : Union.make(types, createJSONIdentifierAnnotation(ast));
    }
    case "Suspend":
      return new Suspend(() => encodedAST_(ast.f(), isBound), createJSONIdentifierAnnotation(ast));
    case "Refinement": {
      const from = encodedAST_(ast.from, isBound);
      if (isBound) {
        if (from === ast.from) {
          return ast;
        }
        if (getTransformationFrom(ast.from) === void 0 && hasStableFilter(ast)) {
          return new Refinement(from, ast.filter, ast.annotations);
        }
      }
      const identifier2 = createJSONIdentifierAnnotation(ast);
      return identifier2 ? annotations(from, identifier2) : from;
    }
    case "Transformation": {
      const identifier2 = createJSONIdentifierAnnotation(ast);
      return encodedAST_(identifier2 ? annotations(ast.from, identifier2) : ast.from, isBound);
    }
  }
  return ast;
};
var encodedAST = (ast) => encodedAST_(ast, false);
var encodedBoundAST = (ast) => encodedAST_(ast, true);
var toJSONAnnotations = (annotations3) => {
  const out = {};
  for (const k of Object.getOwnPropertySymbols(annotations3)) {
    out[String(k)] = annotations3[k];
  }
  return out;
};
var getEncodedParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return ast;
    case "Refinement":
      return getEncodedParameter(ast.from);
  }
};
var equals2 = (self, that) => {
  switch (self._tag) {
    case "Literal":
      return isLiteral(that) && that.literal === self.literal;
    case "UniqueSymbol":
      return isUniqueSymbol(that) && that.symbol === self.symbol;
    case "UndefinedKeyword":
    case "VoidKeyword":
    case "NeverKeyword":
    case "UnknownKeyword":
    case "AnyKeyword":
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
    case "ObjectKeyword":
      return that._tag === self._tag;
    case "TemplateLiteral":
      return isTemplateLiteral(that) && that.head === self.head && equalsTemplateLiteralSpan(that.spans, self.spans);
    case "Enums":
      return isEnums(that) && equalsEnums(that.enums, self.enums);
    case "Union":
      return isUnion(that) && equalsUnion(self.types, that.types);
    case "Refinement":
    case "TupleType":
    case "TypeLiteral":
    case "Suspend":
    case "Transformation":
    case "Declaration":
      return self === that;
  }
};
var equalsTemplateLiteralSpan = /* @__PURE__ */ getEquivalence3((self, that) => {
  return self.literal === that.literal && equals2(self.type, that.type);
});
var equalsEnums = /* @__PURE__ */ getEquivalence3((self, that) => that[0] === self[0] && that[1] === self[1]);
var equalsUnion = /* @__PURE__ */ getEquivalence3(equals2);
var intersection2 = /* @__PURE__ */ intersectionWith(equals2);
var _keyof = (ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const annotation = getSurrogateAnnotation(ast);
      if (isSome2(annotation)) {
        return _keyof(annotation.value);
      }
      break;
    }
    case "TypeLiteral":
      return ast.propertySignatures.map((p) => isSymbol(p.name) ? new UniqueSymbol(p.name) : new Literal(p.name)).concat(ast.indexSignatures.map((is2) => getEncodedParameter(is2.parameter)));
    case "Suspend":
      return _keyof(ast.f());
    case "Union":
      return ast.types.slice(1).reduce((out, ast2) => intersection2(out, _keyof(ast2)), _keyof(ast.types[0]));
    case "Transformation":
      return _keyof(ast.to);
  }
  throw new Error(getASTUnsupportedSchemaErrorMessage(ast));
};
var compose = (ab, cd) => new Transformation(ab, cd, composeTransformation);
var rename = (ast, mapping) => {
  switch (ast._tag) {
    case "TypeLiteral": {
      const propertySignatureTransformations = [];
      for (const key of ownKeys(mapping)) {
        const name = mapping[key];
        if (name !== void 0) {
          propertySignatureTransformations.push(new PropertySignatureTransformation(key, name, identity, identity));
        }
      }
      if (propertySignatureTransformations.length === 0) {
        return ast;
      }
      return new Transformation(ast, new TypeLiteral(ast.propertySignatures.map((ps) => {
        const name = mapping[ps.name];
        return new PropertySignature(name === void 0 ? ps.name : name, typeAST(ps.type), ps.isOptional, ps.isReadonly, ps.annotations);
      }), ast.indexSignatures), new TypeLiteralTransformation(propertySignatureTransformations));
    }
    case "Union":
      return Union.make(ast.types.map((ast2) => rename(ast2, mapping)));
    case "Suspend":
      return new Suspend(() => rename(ast.f(), mapping));
    case "Transformation":
      return compose(ast, rename(typeAST(ast), mapping));
  }
  throw new Error(getASTUnsupportedRenameSchemaErrorMessage(ast));
};
var formatKeyword = (ast) => getOrElse2(getExpected(ast), () => ast._tag);
function getBrands(ast) {
  return match2(getBrandAnnotation(ast), {
    onNone: () => "",
    onSome: (brands) => brands.map((brand2) => ` & Brand<${formatUnknown(brand2)}>`).join("")
  });
}
var getOrElseExpected = (ast) => getTitleAnnotation(ast).pipe(orElse2(() => getDescriptionAnnotation(ast)), orElse2(() => getAutoTitleAnnotation(ast)), map2((s) => s + getBrands(ast)));
var getExpected = (ast) => orElse2(getIdentifierAnnotation(ast), () => getOrElseExpected(ast));
var pruneUndefined = (ast, self, onTransformation) => {
  switch (ast._tag) {
    case "UndefinedKeyword":
      return neverKeyword;
    case "Union": {
      const types = [];
      let hasUndefined = false;
      for (const type of ast.types) {
        const pruned = self(type);
        if (pruned) {
          hasUndefined = true;
          if (!isNeverKeyword(pruned)) {
            types.push(pruned);
          }
        } else {
          types.push(type);
        }
      }
      if (hasUndefined) {
        return Union.make(types);
      }
      break;
    }
    case "Suspend":
      return self(ast.f());
    case "Transformation":
      return onTransformation(ast);
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/BigDecimal.js
var FINITE_INT_REGEX = /^[+-]?\d+$/;
var TypeId4 = /* @__PURE__ */ Symbol.for("effect/BigDecimal");
var BigDecimalProto = {
  [TypeId4]: TypeId4,
  [symbol]() {
    const normalized = normalize(this);
    return pipe(hash(normalized.value), combine(number2(normalized.scale)), cached(this));
  },
  [symbol2](that) {
    return isBigDecimal(that) && equals3(this, that);
  },
  toString() {
    return `BigDecimal(${format2(this)})`;
  },
  toJSON() {
    return {
      _id: "BigDecimal",
      value: String(this.value),
      scale: this.scale
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isBigDecimal = (u) => hasProperty(u, TypeId4);
var make4 = (value3, scale2) => {
  const o = Object.create(BigDecimalProto);
  o.value = value3;
  o.scale = scale2;
  return o;
};
var unsafeMakeNormalized = (value3, scale2) => {
  if (value3 !== bigint0 && value3 % bigint10 === bigint0) {
    throw new RangeError("Value must be normalized");
  }
  const o = make4(value3, scale2);
  o.normalized = o;
  return o;
};
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint10 = /* @__PURE__ */ BigInt(10);
var zero = /* @__PURE__ */ unsafeMakeNormalized(bigint0, 0);
var normalize = (self) => {
  if (self.normalized === void 0) {
    if (self.value === bigint0) {
      self.normalized = zero;
    } else {
      const digits = `${self.value}`;
      let trail = 0;
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] === "0") {
          trail++;
        } else {
          break;
        }
      }
      if (trail === 0) {
        self.normalized = self;
      }
      const value3 = BigInt(digits.substring(0, digits.length - trail));
      const scale2 = self.scale - trail;
      self.normalized = unsafeMakeNormalized(value3, scale2);
    }
  }
  return self.normalized;
};
var scale = /* @__PURE__ */ dual(2, (self, scale2) => {
  if (scale2 > self.scale) {
    return make4(self.value * bigint10 ** BigInt(scale2 - self.scale), scale2);
  }
  if (scale2 < self.scale) {
    return make4(self.value / bigint10 ** BigInt(self.scale - scale2), scale2);
  }
  return self;
});
var Order2 = /* @__PURE__ */ make2((self, that) => {
  const scmp = number3(sign(self), sign(that));
  if (scmp !== 0) {
    return scmp;
  }
  if (self.scale > that.scale) {
    return bigint(self.value, scale(that, self.scale).value);
  }
  if (self.scale < that.scale) {
    return bigint(scale(self, that.scale).value, that.value);
  }
  return bigint(self.value, that.value);
});
var lessThan2 = /* @__PURE__ */ lessThan(Order2);
var lessThanOrEqualTo2 = /* @__PURE__ */ lessThanOrEqualTo(Order2);
var greaterThan2 = /* @__PURE__ */ greaterThan(Order2);
var greaterThanOrEqualTo2 = /* @__PURE__ */ greaterThanOrEqualTo(Order2);
var between2 = /* @__PURE__ */ between(Order2);
var clamp4 = /* @__PURE__ */ clamp(Order2);
var sign = (n) => n.value === bigint0 ? 0 : n.value < bigint0 ? -1 : 1;
var abs = (n) => n.value < bigint0 ? make4(-n.value, n.scale) : n;
var Equivalence = /* @__PURE__ */ make((self, that) => {
  if (self.scale > that.scale) {
    return scale(that, self.scale).value === self.value;
  }
  if (self.scale < that.scale) {
    return scale(self, that.scale).value === that.value;
  }
  return self.value === that.value;
});
var equals3 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(self, that));
var unsafeFromNumber = (n) => getOrThrowWith2(safeFromNumber(n), () => new RangeError(`Number must be finite, got ${n}`));
var safeFromNumber = (n) => {
  if (!Number.isFinite(n)) {
    return none2();
  }
  const string5 = `${n}`;
  if (string5.includes("e")) {
    return fromString(string5);
  }
  const [lead, trail = ""] = string5.split(".");
  return some2(make4(BigInt(`${lead}${trail}`), trail.length));
};
var fromString = (s) => {
  if (s === "") {
    return some2(zero);
  }
  let base;
  let exp;
  const seperator = s.search(/[eE]/);
  if (seperator !== -1) {
    const trail = s.slice(seperator + 1);
    base = s.slice(0, seperator);
    exp = Number(trail);
    if (base === "" || !Number.isSafeInteger(exp) || !FINITE_INT_REGEX.test(trail)) {
      return none2();
    }
  } else {
    base = s;
    exp = 0;
  }
  let digits;
  let offset;
  const dot = base.search(/\./);
  if (dot !== -1) {
    const lead = base.slice(0, dot);
    const trail = base.slice(dot + 1);
    digits = `${lead}${trail}`;
    offset = trail.length;
  } else {
    digits = base;
    offset = 0;
  }
  if (!FINITE_INT_REGEX.test(digits)) {
    return none2();
  }
  const scale2 = offset - exp;
  if (!Number.isSafeInteger(scale2)) {
    return none2();
  }
  return some2(make4(BigInt(digits), scale2));
};
var format2 = (n) => {
  const normalized = normalize(n);
  if (Math.abs(normalized.scale) >= 16) {
    return toExponential(normalized);
  }
  const negative2 = normalized.value < bigint0;
  const absolute = negative2 ? `${normalized.value}`.substring(1) : `${normalized.value}`;
  let before;
  let after;
  if (normalized.scale >= absolute.length) {
    before = "0";
    after = "0".repeat(normalized.scale - absolute.length) + absolute;
  } else {
    const location = absolute.length - normalized.scale;
    if (location > absolute.length) {
      const zeros = location - absolute.length;
      before = `${absolute}${"0".repeat(zeros)}`;
      after = "";
    } else {
      after = absolute.slice(location);
      before = absolute.slice(0, location);
    }
  }
  const complete2 = after === "" ? before : `${before}.${after}`;
  return negative2 ? `-${complete2}` : complete2;
};
var toExponential = (n) => {
  if (isZero(n)) {
    return "0e+0";
  }
  const normalized = normalize(n);
  const digits = `${abs(normalized).value}`;
  const head4 = digits.slice(0, 1);
  const tail = digits.slice(1);
  let output = `${isNegative(normalized) ? "-" : ""}${head4}`;
  if (tail !== "") {
    output += `.${tail}`;
  }
  const exp = tail.length - normalized.scale;
  return `${output}e${exp >= 0 ? "+" : ""}${exp}`;
};
var unsafeToNumber = (n) => Number(format2(n));
var isZero = (n) => n.value === bigint0;
var isNegative = (n) => n.value < bigint0;
var isPositive = (n) => n.value > bigint0;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/BigInt.js
var Order3 = bigint;
var clamp5 = /* @__PURE__ */ clamp(Order3);
var toNumber = (b) => {
  if (b > BigInt(Number.MAX_SAFE_INTEGER) || b < BigInt(Number.MIN_SAFE_INTEGER)) {
    return none2();
  }
  return some2(Number(b));
};
var fromString2 = (s) => {
  try {
    return s.trim() === "" ? none2() : some2(BigInt(s));
  } catch {
    return none2();
  }
};
var fromNumber = (n) => {
  if (n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER) {
    return none2();
  }
  try {
    return some2(BigInt(n));
  } catch {
    return none2();
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Boolean.js
var not = (self) => !self;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/context.js
var TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
var ReferenceTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Reference");
var STMSymbolKey = "effect/STM";
var STMTypeId = /* @__PURE__ */ Symbol.for(STMSymbolKey);
var TagProto = {
  ...EffectPrototype,
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _Service: (_) => _,
    _Identifier: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make5(this, self);
  }
};
var ReferenceProto = {
  ...TagProto,
  [ReferenceTypeId]: ReferenceTypeId
};
var makeGenericTag = (key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag2 = Object.create(TagProto);
  Object.defineProperty(tag2, "stack", {
    get() {
      return creationError.stack;
    }
  });
  tag2.key = key;
  return tag2;
};
var Reference = () => (id, options) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function ReferenceClass() {
  }
  Object.setPrototypeOf(ReferenceClass, ReferenceProto);
  ReferenceClass.key = id;
  ReferenceClass.defaultValue = options.defaultValue;
  Object.defineProperty(ReferenceClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return ReferenceClass;
};
var TypeId5 = /* @__PURE__ */ Symbol.for("effect/Context");
var ContextProto = {
  [TypeId5]: {
    _Services: (_) => _
  },
  [symbol2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol]() {
    return cached(this, number2(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var makeContext = (unsafeMap) => {
  const context3 = Object.create(ContextProto);
  context3.unsafeMap = unsafeMap;
  return context3;
};
var serviceNotFoundError = (tag2) => {
  const error = new Error(`Service not found${tag2.key ? `: ${String(tag2.key)}` : ""}`);
  if (tag2.stack) {
    const lines = tag2.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
var isContext = (u) => hasProperty(u, TypeId5);
var isReference = (u) => hasProperty(u, ReferenceTypeId);
var _empty = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
var empty2 = () => _empty;
var make5 = (tag2, service) => makeContext(/* @__PURE__ */ new Map([[tag2.key, service]]));
var add = /* @__PURE__ */ dual(3, (self, tag2, service) => {
  const map15 = new Map(self.unsafeMap);
  map15.set(tag2.key, service);
  return makeContext(map15);
});
var defaultValueCache = /* @__PURE__ */ globalValue("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
var getDefaultValue = (tag2) => {
  if (defaultValueCache.has(tag2.key)) {
    return defaultValueCache.get(tag2.key);
  }
  const value3 = tag2.defaultValue();
  defaultValueCache.set(tag2.key, value3);
  return value3;
};
var unsafeGetReference = (self, tag2) => {
  return self.unsafeMap.has(tag2.key) ? self.unsafeMap.get(tag2.key) : getDefaultValue(tag2);
};
var unsafeGet2 = /* @__PURE__ */ dual(2, (self, tag2) => {
  if (!self.unsafeMap.has(tag2.key)) {
    if (ReferenceTypeId in tag2) return getDefaultValue(tag2);
    throw serviceNotFoundError(tag2);
  }
  return self.unsafeMap.get(tag2.key);
});
var get2 = unsafeGet2;
var getOption = /* @__PURE__ */ dual(2, (self, tag2) => {
  if (!self.unsafeMap.has(tag2.key)) {
    return isReference(tag2) ? some(getDefaultValue(tag2)) : none;
  }
  return some(self.unsafeMap.get(tag2.key));
});
var merge2 = /* @__PURE__ */ dual(2, (self, that) => {
  const map15 = new Map(self.unsafeMap);
  for (const [tag2, s] of that.unsafeMap) {
    map15.set(tag2, s);
  }
  return makeContext(map15);
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Context.js
var GenericTag = makeGenericTag;
var empty3 = empty2;
var make6 = make5;
var add2 = add;
var get3 = get2;
var unsafeGet3 = unsafeGet2;
var getOption2 = getOption;
var merge3 = merge2;
var Reference2 = Reference;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Chunk.js
var TypeId6 = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy2(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
var emptyArray = [];
var getEquivalence4 = (isEquivalent) => make((self, that) => self.length === that.length && toReadonlyArray(self).every((value3, i) => isEquivalent(value3, unsafeGet4(that, i))));
var _equivalence3 = /* @__PURE__ */ getEquivalence4(equals);
var ChunkProto = {
  [TypeId6]: {
    _A: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence3(this, that);
  },
  [symbol]() {
    return cached(this, array2(toReadonlyArray(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = (backing) => {
  const chunk3 = Object.create(ChunkProto);
  chunk3.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk3.length = 0;
      chunk3.depth = 0;
      chunk3.left = chunk3;
      chunk3.right = chunk3;
      break;
    }
    case "IConcat": {
      chunk3.length = backing.left.length + backing.right.length;
      chunk3.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk3.left = backing.left;
      chunk3.right = backing.right;
      break;
    }
    case "IArray": {
      chunk3.length = backing.array.length;
      chunk3.depth = 0;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
    case "ISingleton": {
      chunk3.length = 1;
      chunk3.depth = 0;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
    case "ISlice": {
      chunk3.length = backing.length;
      chunk3.depth = backing.chunk.depth + 1;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
  }
  return chunk3;
};
var isChunk = (u) => hasProperty(u, TypeId6);
var _empty2 = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
var empty4 = () => _empty2;
var make7 = (...as4) => unsafeFromNonEmptyArray(as4);
var of2 = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
var fromIterable2 = (self) => isChunk(self) ? self : unsafeFromArray(fromIterable(self));
var copyToArray = (self, array6, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy2(self.backing.array, 0, array6, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array6, initial);
      copyToArray(self.right, array6, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array6[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self.length) {
        array6[j] = unsafeGet4(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
var toReadonlyArray_ = (self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = {
        _tag: "IArray",
        array: arr
      };
      self.left = _empty2;
      self.right = _empty2;
      self.depth = 0;
      return arr;
    }
  }
};
var toReadonlyArray = toReadonlyArray_;
var reverseChunk = (self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse(self.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse2(self.backing.right),
        right: reverse2(self.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse(toReadonlyArray(self)));
  }
};
var reverse2 = reverseChunk;
var unsafeFromArray = (self) => self.length === 0 ? empty4() : self.length === 1 ? of2(self[0]) : makeChunk({
  _tag: "IArray",
  array: self
});
var unsafeFromNonEmptyArray = (self) => unsafeFromArray(self);
var unsafeGet4 = /* @__PURE__ */ dual(2, (self, index) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.a;
    }
    case "IArray": {
      if (index >= self.length || index < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.array[index];
    }
    case "IConcat": {
      return index < self.left.length ? unsafeGet4(self.left, index) : unsafeGet4(self.right, index - self.left.length);
    }
    case "ISlice": {
      return unsafeGet4(self.backing.chunk, index + self.backing.offset);
    }
  }
});
var append2 = /* @__PURE__ */ dual(2, (self, a) => appendAll2(self, of2(a)));
var prepend2 = /* @__PURE__ */ dual(2, (self, elem) => appendAll2(of2(elem), self));
var drop2 = /* @__PURE__ */ dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty2;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          offset: self.backing.offset + n,
          length: self.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return drop2(self.right, n - self.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop2(self.left, n),
          right: self.right
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: n,
          length: self.length - n
        });
      }
    }
  }
});
var appendAll2 = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff8 = that.depth - self.depth;
  if (Math.abs(diff8) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self,
      right: that
    });
  } else if (diff8 < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = appendAll2(self.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self.left,
        right: nr
      });
    } else {
      const nrr = appendAll2(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll2(self, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll2(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
var isEmpty = (self) => self.length === 0;
var isNonEmpty2 = (self) => self.length > 0;
var unsafeHead = (self) => unsafeGet4(self, 0);
var headNonEmpty2 = unsafeHead;
var tailNonEmpty2 = (self) => drop2(self, 1);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Duration.js
var TypeId7 = /* @__PURE__ */ Symbol.for("effect/Duration");
var bigint02 = /* @__PURE__ */ BigInt(0);
var bigint24 = /* @__PURE__ */ BigInt(24);
var bigint60 = /* @__PURE__ */ BigInt(60);
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var bigint1e6 = /* @__PURE__ */ BigInt(1e6);
var bigint1e9 = /* @__PURE__ */ BigInt(1e9);
var DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
    if (input[0] === -Infinity || input[1] === -Infinity || Number.isNaN(input[0]) || Number.isNaN(input[1])) {
      return zero2;
    }
    if (input[0] === Infinity || input[1] === Infinity) {
      return infinity;
    }
    return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
  } else if (isString(input)) {
    const match10 = DURATION_REGEX.exec(input);
    if (match10) {
      const [_, valueStr, unit] = match10;
      const value3 = Number(valueStr);
      switch (unit) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value3);
        case "second":
        case "seconds":
          return seconds(value3);
        case "minute":
        case "minutes":
          return minutes(value3);
        case "hour":
        case "hours":
          return hours(value3);
        case "day":
        case "days":
          return days(value3);
        case "week":
        case "weeks":
          return weeks(value3);
      }
    }
  }
  throw new Error("Invalid DurationInput");
};
var zeroValue = {
  _tag: "Millis",
  millis: 0
};
var infinityValue = {
  _tag: "Infinity"
};
var DurationProto = {
  [TypeId7]: TypeId7,
  [symbol]() {
    return cached(this, structure(this.value));
  },
  [symbol2](that) {
    return isDuration(that) && equals4(this, that);
  },
  toString() {
    return `Duration(${format3(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make8 = (input) => {
  const duration2 = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration2.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration2.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration2.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6))
      };
    } else {
      duration2.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input <= bigint02) {
    duration2.value = zeroValue;
  } else {
    duration2.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration2;
};
var isDuration = (u) => hasProperty(u, TypeId7);
var isFinite = (self) => self.value._tag !== "Infinity";
var isZero2 = (self) => {
  switch (self.value._tag) {
    case "Millis": {
      return self.value.millis === 0;
    }
    case "Nanos": {
      return self.value.nanos === bigint02;
    }
    case "Infinity": {
      return false;
    }
  }
};
var zero2 = /* @__PURE__ */ make8(0);
var infinity = /* @__PURE__ */ make8(Infinity);
var nanos = (nanos2) => make8(nanos2);
var micros = (micros2) => make8(micros2 * bigint1e3);
var millis = (millis2) => make8(millis2);
var seconds = (seconds2) => make8(seconds2 * 1e3);
var minutes = (minutes2) => make8(minutes2 * 6e4);
var hours = (hours2) => make8(hours2 * 36e5);
var days = (days2) => make8(days2 * 864e5);
var weeks = (weeks2) => make8(weeks2 * 6048e5);
var toMillis = (self) => match4(self, {
  onMillis: (millis2) => millis2,
  onNanos: (nanos2) => Number(nanos2) / 1e6
});
var toNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return none2();
    case "Nanos":
      return some2(_self.value.nanos);
    case "Millis":
      return some2(BigInt(Math.round(_self.value.millis * 1e6)));
  }
};
var unsafeToNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
var toHrTime = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
  }
};
var match4 = /* @__PURE__ */ dual(2, (self, options) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
var matchWith = /* @__PURE__ */ dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
var Order4 = /* @__PURE__ */ make2((self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0,
  onNanos: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0
}));
var between3 = /* @__PURE__ */ between(/* @__PURE__ */ mapInput2(Order4, decode));
var Equivalence2 = (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 === that2,
  onNanos: (self2, that2) => self2 === that2
});
var _clamp = /* @__PURE__ */ clamp(Order4);
var clamp6 = /* @__PURE__ */ dual(2, (self, options) => _clamp(decode(self), {
  minimum: decode(options.minimum),
  maximum: decode(options.maximum)
}));
var lessThan3 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 < that2,
  onNanos: (self2, that2) => self2 < that2
}));
var lessThanOrEqualTo3 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 <= that2,
  onNanos: (self2, that2) => self2 <= that2
}));
var greaterThan3 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 > that2,
  onNanos: (self2, that2) => self2 > that2
}));
var greaterThanOrEqualTo3 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 >= that2,
  onNanos: (self2, that2) => self2 >= that2
}));
var equals4 = /* @__PURE__ */ dual(2, (self, that) => Equivalence2(decode(self), decode(that)));
var parts = (self) => {
  const duration2 = decode(self);
  if (duration2.value._tag === "Infinity") {
    return {
      days: Infinity,
      hours: Infinity,
      minutes: Infinity,
      seconds: Infinity,
      millis: Infinity,
      nanos: Infinity
    };
  }
  const nanos2 = unsafeToNanos(duration2);
  const ms = nanos2 / bigint1e6;
  const sec = ms / bigint1e3;
  const min3 = sec / bigint60;
  const hr = min3 / bigint60;
  const days2 = hr / bigint24;
  return {
    days: Number(days2),
    hours: Number(hr % bigint24),
    minutes: Number(min3 % bigint60),
    seconds: Number(sec % bigint60),
    millis: Number(ms % bigint1e3),
    nanos: Number(nanos2 % bigint1e6)
  };
};
var format3 = (self) => {
  const duration2 = decode(self);
  if (duration2.value._tag === "Infinity") {
    return "Infinity";
  }
  if (isZero2(duration2)) {
    return "0";
  }
  const fragments = parts(duration2);
  const pieces = [];
  if (fragments.days !== 0) {
    pieces.push(`${fragments.days}d`);
  }
  if (fragments.hours !== 0) {
    pieces.push(`${fragments.hours}h`);
  }
  if (fragments.minutes !== 0) {
    pieces.push(`${fragments.minutes}m`);
  }
  if (fragments.seconds !== 0) {
    pieces.push(`${fragments.seconds}s`);
  }
  if (fragments.millis !== 0) {
    pieces.push(`${fragments.millis}ms`);
  }
  if (fragments.nanos !== 0) {
    pieces.push(`${fragments.nanos}ns`);
  }
  return pieces.join(" ");
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashMap/config.js
var SIZE = 5;
var BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, SIZE);
var MASK2 = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashMap/bitwise.js
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift, h) {
  return h >>> shift & MASK2;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/stack.js
var make9 = (value3, previous) => ({
  value: value3,
  previous
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashMap/array.js
function arrayUpdate(mutate4, at, v, arr) {
  let out = arr;
  if (!mutate4) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate4, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate4) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ;
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate4) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate4, at, v, arr) {
  const len = arr.length;
  if (mutate4) {
    let i2 = len;
    while (i2 >= at) arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashMap/node.js
var EmptyNode = class _EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash3, key, size7) {
    const v = f(none2());
    if (isNone2(v)) return new _EmptyNode();
    ++size7.value;
    return new LeafNode(edit, hash3, key, v);
  }
};
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode(node) {
  return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
var LeafNode = class _LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash3, key, value3) {
    this.edit = edit;
    this.hash = hash3;
    this.key = key;
    this.value = value3;
  }
  modify(edit, shift, f, hash3, key, size7) {
    if (equals(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value) return this;
      else if (isNone2(v2)) {
        ;
        --size7.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new _LeafNode(edit, hash3, key, v2);
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash3, new _LeafNode(edit, hash3, key, v));
  }
};
var CollisionNode = class _CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash3, children) {
    this.edit = edit;
    this.hash = hash3;
    this.children = children;
  }
  modify(edit, shift, f, hash3, key, size7) {
    if (hash3 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size7);
      if (list === this.children) return this;
      return list.length > 1 ? new _CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size7.value;
    return mergeLeaves(edit, shift, this.hash, this, hash3, new LeafNode(edit, hash3, key, v));
  }
  updateCollisionList(mutate4, edit, hash3, list, f, key, size7) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals(key, child.key)) {
        const value3 = child.value;
        const newValue2 = f(value3);
        if (newValue2 === value3) return list;
        if (isNone2(newValue2)) {
          ;
          --size7.value;
          return arraySpliceOut(mutate4, i, list);
        }
        return arrayUpdate(mutate4, i, new LeafNode(edit, hash3, key, newValue2), list);
      }
    }
    const newValue = f(none2());
    if (isNone2(newValue)) return list;
    ++size7.value;
    return arrayUpdate(mutate4, len, new LeafNode(edit, hash3, key, newValue), list);
  }
};
var IndexedNode = class _IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash3, key, size7) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash3);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists3 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists3) {
      const _newChild = new EmptyNode().modify(edit, shift + SIZE, f, hash3, key, size7);
      if (!_newChild) return this;
      return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new _IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child = current.modify(edit, shift + SIZE, f, hash3, key, size7);
    if (current === child) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new _IndexedNode(edit, bitmap, newChildren);
  }
};
var ArrayNode = class _ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size7, children) {
    this.edit = edit;
    this.size = size7;
    this.children = children;
  }
  modify(edit, shift, f, hash3, key, size7) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash3);
    const child = children[frag];
    const newChild = (child || new EmptyNode()).modify(edit, shift + SIZE, f, hash3, key, size7);
    if (child === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ;
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      ;
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new _ArrayNode(edit, count, newChildren);
  }
};
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children);
}
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = make9(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashMap.js
var HashMapSymbolKey = "effect/HashMap";
var HashMapTypeId = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
var HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol]() {
    let hash3 = hash(HashMapSymbolKey);
    for (const item of this) {
      hash3 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return cached(this, hash3);
  },
  [symbol2](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash(item[0], hash(item[0])));
        if (isNone2(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl = (editable, edit, root, size7) => {
  const map15 = Object.create(HashMapProto);
  map15._editable = editable;
  map15._edit = edit;
  map15._root = root;
  map15._size = size7;
  return map15;
};
var HashMapIterator = class _HashMapIterator {
  map;
  f;
  v;
  constructor(map15, f) {
    this.map = map15;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone2(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new _HashMapIterator(this.map, this.f);
  }
};
var applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none2();
var visitLazy = (node, f, cont = void 0) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome2(node.value)) {
        return some2({
          value: f(node.key, node.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
var visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child = children[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
var _empty3 = /* @__PURE__ */ makeImpl(false, 0, /* @__PURE__ */ new EmptyNode(), 0);
var empty5 = () => _empty3;
var fromIterable3 = (entries2) => {
  const map15 = beginMutation(empty5());
  for (const entry of entries2) {
    set(map15, entry[0], entry[1]);
  }
  return endMutation(map15);
};
var isHashMap = (u) => hasProperty(u, HashMapTypeId);
var isEmpty2 = (self) => self && isEmptyNode(self._root);
var get4 = /* @__PURE__ */ dual(2, (self, key) => getHash(self, key, hash(key)));
var getHash = /* @__PURE__ */ dual(3, (self, key, hash3) => {
  let node = self._root;
  let shift = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals(key, node.key) ? node.value : none2();
      }
      case "CollisionNode": {
        if (hash3 === node.hash) {
          const children = node.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child = children[i];
            if ("key" in child && equals(key, child.key)) {
              return child.value;
            }
          }
        }
        return none2();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash3);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift += SIZE;
          break;
        }
        return none2();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift, hash3)];
        if (node) {
          shift += SIZE;
          break;
        }
        return none2();
      }
      default:
        return none2();
    }
  }
});
var has = /* @__PURE__ */ dual(2, (self, key) => isSome2(getHash(self, key, hash(key))));
var set = /* @__PURE__ */ dual(3, (self, key, value3) => modifyAt(self, key, () => some2(value3)));
var setTree = /* @__PURE__ */ dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    ;
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root ? self : makeImpl(self._editable, self._edit, newRoot, newSize);
});
var keys = (self) => new HashMapIterator(self, (key) => key);
var size = (self) => self._size;
var beginMutation = (self) => makeImpl(true, self._edit + 1, self._root, self._size);
var endMutation = (self) => {
  ;
  self._editable = false;
  return self;
};
var modifyAt = /* @__PURE__ */ dual(3, (self, key, f) => modifyHash(self, key, hash(key), f));
var modifyHash = /* @__PURE__ */ dual(4, (self, key, hash3, f) => {
  const size7 = {
    value: self._size
  };
  const newRoot = self._root.modify(self._editable ? self._edit : NaN, 0, f, hash3, key, size7);
  return pipe(self, setTree(newRoot, size7.value));
});
var remove2 = /* @__PURE__ */ dual(2, (self, key) => modifyAt(self, key, none2));
var map4 = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, empty5(), (map15, value3, key) => set(map15, key, f(value3, key))));
var forEach = /* @__PURE__ */ dual(2, (self, f) => reduce2(self, void 0, (_, value3, key) => f(value3, key)));
var reduce2 = /* @__PURE__ */ dual(3, (self, zero3, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return isSome2(root.value) ? f(zero3, root.value.value, root.key) : zero3;
  }
  if (root._tag === "EmptyNode") {
    return zero3;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len; ) {
      const child = children[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome2(child.value)) {
            zero3 = f(zero3, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero3;
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/hashSet.js
var HashSetSymbolKey = "effect/HashSet";
var HashSetTypeId = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
var HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol]() {
    return cached(this, combine(hash(this._keyMap))(hash(HashSetSymbolKey)));
  },
  [symbol2](that) {
    if (isHashSet(that)) {
      return size(this._keyMap) === size(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = (keyMap) => {
  const set6 = Object.create(HashSetProto);
  set6._keyMap = keyMap;
  return set6;
};
var isHashSet = (u) => hasProperty(u, HashSetTypeId);
var _empty4 = /* @__PURE__ */ makeImpl2(/* @__PURE__ */ empty5());
var empty6 = () => _empty4;
var fromIterable4 = (elements) => {
  const set6 = beginMutation2(empty6());
  for (const value3 of elements) {
    add3(set6, value3);
  }
  return endMutation2(set6);
};
var make10 = (...elements) => {
  const set6 = beginMutation2(empty6());
  for (const value3 of elements) {
    add3(set6, value3);
  }
  return endMutation2(set6);
};
var has2 = /* @__PURE__ */ dual(2, (self, value3) => has(self._keyMap, value3));
var size2 = (self) => size(self._keyMap);
var beginMutation2 = (self) => makeImpl2(beginMutation(self._keyMap));
var endMutation2 = (self) => {
  ;
  self._keyMap._editable = false;
  return self;
};
var mutate = /* @__PURE__ */ dual(2, (self, f) => {
  const transient = beginMutation2(self);
  f(transient);
  return endMutation2(transient);
});
var add3 = /* @__PURE__ */ dual(2, (self, value3) => self._keyMap._editable ? (set(value3, true)(self._keyMap), self) : makeImpl2(set(value3, true)(self._keyMap)));
var remove3 = /* @__PURE__ */ dual(2, (self, value3) => self._keyMap._editable ? (remove2(value3)(self._keyMap), self) : makeImpl2(remove2(value3)(self._keyMap)));
var difference2 = /* @__PURE__ */ dual(2, (self, that) => mutate(self, (set6) => {
  for (const value3 of that) {
    remove3(set6, value3);
  }
}));
var union2 = /* @__PURE__ */ dual(2, (self, that) => mutate(empty6(), (set6) => {
  forEach2(self, (value3) => add3(set6, value3));
  for (const value3 of that) {
    add3(set6, value3);
  }
}));
var forEach2 = /* @__PURE__ */ dual(2, (self, f) => forEach(self._keyMap, (_, k) => f(k)));
var reduce3 = /* @__PURE__ */ dual(3, (self, zero3, f) => reduce2(self._keyMap, zero3, (z, _, a) => f(z, a)));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/HashSet.js
var isHashSet2 = isHashSet;
var empty7 = empty6;
var fromIterable5 = fromIterable4;
var make11 = make10;
var has3 = has2;
var size3 = size2;
var add4 = add3;
var remove4 = remove3;
var difference3 = difference2;
var union3 = union2;
var reduce4 = reduce3;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/MutableRef.js
var TypeId8 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
var MutableRefProto = {
  [TypeId8]: TypeId8,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON(this.current)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make12 = (value3) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value3;
  return ref;
};
var get5 = (self) => self.current;
var set2 = /* @__PURE__ */ dual(2, (self, value3) => {
  self.current = value3;
  return self;
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberId.js
var FiberIdSymbolKey = "effect/FiberId";
var FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
var OP_NONE = "None";
var OP_RUNTIME = "Runtime";
var OP_COMPOSITE = "Composite";
var emptyHash = /* @__PURE__ */ string(`${FiberIdSymbolKey}-${OP_NONE}`);
var None = class {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  id = -1;
  startTimeMillis = -1;
  [symbol]() {
    return emptyHash;
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Runtime = class {
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id, startTimeMillis) {
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol]() {
    return cached(this, string(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Composite = class {
  left;
  right;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  _hash;
  [symbol]() {
    return pipe(string(`${FiberIdSymbolKey}-${this._tag}`), combine(hash(this.left)), combine(hash(this.right)), cached(this));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_COMPOSITE && equals(this.left, that.left) && equals(this.right, that.right);
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: toJSON(this.left),
      right: toJSON(this.right)
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var none3 = /* @__PURE__ */ new None();
var runtime = (id, startTimeMillis) => {
  return new Runtime(id, startTimeMillis);
};
var composite = (left3, right3) => {
  return new Composite(left3, right3);
};
var isFiberId = (self) => hasProperty(self, FiberIdTypeId);
var ids = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty7();
    }
    case OP_RUNTIME: {
      return make11(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self.left), union3(ids(self.right)));
    }
  }
};
var _fiberCounter = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make12(0));
var threadName = (self) => {
  const identifiers = Array.from(ids(self)).map((n) => `#${n}`).join(",");
  return identifiers;
};
var unsafeMake = () => {
  const id = get5(_fiberCounter);
  pipe(_fiberCounter, set2(id + 1));
  return new Runtime(id, Date.now());
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/FiberId.js
var none4 = none3;
var runtime2 = runtime;
var composite2 = composite;
var isFiberId2 = isFiberId;
var threadName2 = threadName;
var unsafeMake2 = unsafeMake;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/HashMap.js
var isHashMap2 = isHashMap;
var empty8 = empty5;
var fromIterable6 = fromIterable3;
var isEmpty3 = isEmpty2;
var get6 = get4;
var set3 = set;
var keys2 = keys;
var modifyAt2 = modifyAt;
var map6 = map4;
var reduce5 = reduce2;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/List.js
var TypeId9 = /* @__PURE__ */ Symbol.for("effect/List");
var toArray2 = (self) => fromIterable(self);
var getEquivalence5 = (isEquivalent) => mapInput(getEquivalence3(isEquivalent), toArray2);
var _equivalence4 = /* @__PURE__ */ getEquivalence5(equals);
var ConsProto = {
  [TypeId9]: TypeId9,
  _tag: "Cons",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray2(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag && _equivalence4(this, that);
  },
  [symbol]() {
    return cached(this, array2(toArray2(this)));
  },
  [Symbol.iterator]() {
    let done4 = false;
    let self = this;
    return {
      next() {
        if (done4) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done4 = true;
          return this.return();
        }
        const value3 = self.head;
        self = self.tail;
        return {
          done: done4,
          value: value3
        };
      },
      return(value3) {
        if (!done4) {
          done4 = true;
        }
        return {
          done: true,
          value: value3
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeCons = (head4, tail) => {
  const cons2 = Object.create(ConsProto);
  cons2.head = head4;
  cons2.tail = tail;
  return cons2;
};
var NilHash = /* @__PURE__ */ string("Nil");
var NilProto = {
  [TypeId9]: TypeId9,
  _tag: "Nil",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol]() {
    return NilHash;
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var _Nil = /* @__PURE__ */ Object.create(NilProto);
var isList = (u) => hasProperty(u, TypeId9);
var isNil = (self) => self._tag === "Nil";
var isCons = (self) => self._tag === "Cons";
var nil = () => _Nil;
var cons = (head4, tail) => makeCons(head4, tail);
var empty9 = nil;
var of3 = (value3) => makeCons(value3, _Nil);
var fromIterable7 = (prefix) => {
  const iterator = prefix[Symbol.iterator]();
  let next;
  if ((next = iterator.next()) && !next.done) {
    const result = makeCons(next.value, _Nil);
    let curr = result;
    while ((next = iterator.next()) && !next.done) {
      const temp = makeCons(next.value, _Nil);
      curr.tail = temp;
      curr = temp;
    }
    return result;
  } else {
    return _Nil;
  }
};
var appendAll3 = /* @__PURE__ */ dual(2, (self, that) => prependAll(that, self));
var prepend3 = /* @__PURE__ */ dual(2, (self, element2) => cons(element2, self));
var prependAll = /* @__PURE__ */ dual(2, (self, prefix) => {
  if (isNil(self)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
var reduce6 = /* @__PURE__ */ dual(3, (self, zero3, f) => {
  let acc = zero3;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
var reverse3 = (self) => {
  let result = empty9();
  let these = self;
  while (!isNil(these)) {
    result = prepend3(result, these.head);
    these = these.tail;
  }
  return result;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/data.js
var ArrayProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Array.prototype), {
  [symbol]() {
    return cached(this, array2(this));
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var Structural = /* @__PURE__ */ function() {
  function Structural2(args2) {
    if (args2) {
      Object.assign(this, args2);
    }
  }
  Structural2.prototype = StructuralPrototype;
  return Structural2;
}();
var struct3 = (as4) => Object.assign(Object.create(StructuralPrototype), as4);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/differ/contextPatch.js
var ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance(a) {
  return a;
}
var PatchProto = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};
var EmptyProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Empty"
});
var _empty5 = /* @__PURE__ */ Object.create(EmptyProto);
var empty10 = () => _empty5;
var AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AndThen"
});
var makeAndThen = (first2, second) => {
  const o = Object.create(AndThenProto);
  o.first = first2;
  o.second = second;
  return o;
};
var AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AddService"
});
var makeAddService = (key, service) => {
  const o = Object.create(AddServiceProto);
  o.key = key;
  o.service = service;
  return o;
};
var RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "RemoveService"
});
var makeRemoveService = (key) => {
  const o = Object.create(RemoveServiceProto);
  o.key = key;
  return o;
};
var UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "UpdateService"
});
var makeUpdateService = (key, update3) => {
  const o = Object.create(UpdateServiceProto);
  o.key = key;
  o.update = update3;
  return o;
};
var diff = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch9 = empty10();
  for (const [tag2, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag2)) {
      const old = missingServices.get(tag2);
      missingServices.delete(tag2);
      if (!equals(old, newService)) {
        patch9 = combine3(makeUpdateService(tag2, () => newService))(patch9);
      }
    } else {
      missingServices.delete(tag2);
      patch9 = combine3(makeAddService(tag2, newService))(patch9);
    }
  }
  for (const [tag2] of missingServices.entries()) {
    patch9 = combine3(makeRemoveService(tag2))(patch9);
  }
  return patch9;
};
var combine3 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen(self, that));
var patch = /* @__PURE__ */ dual(2, (self, context3) => {
  if (self._tag === "Empty") {
    return context3;
  }
  let wasServiceUpdated = false;
  let patches = of2(self);
  const updatedContext = new Map(context3.unsafeMap);
  while (isNonEmpty2(patches)) {
    const head4 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head4._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head4.key, head4.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(prepend2(tail, head4.second), head4.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head4.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head4.key, head4.update(updatedContext.get(head4.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map15 = /* @__PURE__ */ new Map();
  for (const [tag2] of context3.unsafeMap) {
    if (updatedContext.has(tag2)) {
      map15.set(tag2, updatedContext.get(tag2));
      updatedContext.delete(tag2);
    }
  }
  for (const [tag2, s] of updatedContext) {
    map15.set(tag2, s);
  }
  return makeContext(map15);
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
var HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance2(a) {
  return a;
}
var PatchProto2 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance2,
    _Key: variance2,
    _Patch: variance2
  }
};
var EmptyProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Empty"
});
var _empty6 = /* @__PURE__ */ Object.create(EmptyProto2);
var empty11 = () => _empty6;
var AndThenProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "AndThen"
});
var makeAndThen2 = (first2, second) => {
  const o = Object.create(AndThenProto2);
  o.first = first2;
  o.second = second;
  return o;
};
var AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Add"
});
var makeAdd = (value3) => {
  const o = Object.create(AddProto);
  o.value = value3;
  return o;
};
var RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Remove"
});
var makeRemove = (value3) => {
  const o = Object.create(RemoveProto);
  o.value = value3;
  return o;
};
var diff2 = (oldValue, newValue) => {
  const [removed, patch9] = reduce4([oldValue, empty11()], ([set6, patch10], value3) => {
    if (has3(value3)(set6)) {
      return [remove4(value3)(set6), patch10];
    }
    return [set6, combine4(makeAdd(value3))(patch10)];
  })(newValue);
  return reduce4(patch9, (patch10, value3) => combine4(makeRemove(value3))(patch10))(removed);
};
var combine4 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen2(self, that));
var patch2 = /* @__PURE__ */ dual(2, (self, oldValue) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let set6 = oldValue;
  let patches = of2(self);
  while (isNonEmpty2(patches)) {
    const head4 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head4._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(head4.first)(prepend2(head4.second)(tail));
        break;
      }
      case "Add": {
        set6 = add4(head4.value)(set6);
        patches = tail;
        break;
      }
      case "Remove": {
        set6 = remove4(head4.value)(set6);
        patches = tail;
      }
    }
  }
  return set6;
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/differ/readonlyArrayPatch.js
var ReadonlyArrayPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function variance3(a) {
  return a;
}
var PatchProto3 = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: {
    _Value: variance3,
    _Patch: variance3
  }
};
var EmptyProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Empty"
});
var _empty7 = /* @__PURE__ */ Object.create(EmptyProto3);
var empty12 = () => _empty7;
var AndThenProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "AndThen"
});
var makeAndThen3 = (first2, second) => {
  const o = Object.create(AndThenProto3);
  o.first = first2;
  o.second = second;
  return o;
};
var AppendProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Append"
});
var makeAppend = (values4) => {
  const o = Object.create(AppendProto);
  o.values = values4;
  return o;
};
var SliceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Slice"
});
var makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
var UpdateProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Update"
});
var makeUpdate = (index, patch9) => {
  const o = Object.create(UpdateProto);
  o.index = index;
  o.patch = patch9;
  return o;
};
var diff3 = (options) => {
  let i = 0;
  let patch9 = empty12();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals(valuePatch, options.differ.empty)) {
      patch9 = combine5(patch9, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch9 = combine5(patch9, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch9 = combine5(patch9, makeAppend(drop(i)(options.newValue)));
  }
  return patch9;
};
var combine5 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen3(self, that));
var patch3 = /* @__PURE__ */ dual(3, (self, oldValue, differ3) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray2 = oldValue.slice();
  let patches = of(self);
  while (isNonEmptyArray2(patches)) {
    const head4 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head4._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head4.first, head4.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value3 of head4.values) {
          readonlyArray2.push(value3);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray2 = readonlyArray2.slice(head4.from, head4.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray2[head4.index] = differ3.patch(head4.patch, readonlyArray2[head4.index]);
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray2;
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/differ.js
var DifferTypeId = /* @__PURE__ */ Symbol.for("effect/Differ");
var DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make15 = (params) => {
  const differ3 = Object.create(DifferProto);
  differ3.empty = params.empty;
  differ3.diff = params.diff;
  differ3.combine = params.combine;
  differ3.patch = params.patch;
  return differ3;
};
var environment = () => make15({
  empty: empty10(),
  combine: (first2, second) => combine3(second)(first2),
  diff: (oldValue, newValue) => diff(oldValue, newValue),
  patch: (patch9, oldValue) => patch(oldValue)(patch9)
});
var hashSet = () => make15({
  empty: empty11(),
  combine: (first2, second) => combine4(second)(first2),
  diff: (oldValue, newValue) => diff2(oldValue, newValue),
  patch: (patch9, oldValue) => patch2(oldValue)(patch9)
});
var readonlyArray = (differ3) => make15({
  empty: empty12(),
  combine: (first2, second) => combine5(first2, second),
  diff: (oldValue, newValue) => diff3({
    oldValue,
    newValue,
    differ: differ3
  }),
  patch: (patch9, oldValue) => patch3(patch9, oldValue, differ3)
});
var update = () => updateWith((_, a) => a);
var updateWith = (f) => make15({
  empty: identity,
  combine: (first2, second) => {
    if (first2 === identity) {
      return second;
    }
    if (second === identity) {
      return first2;
    }
    return (a) => second(first2(a));
  },
  diff: (oldValue, newValue) => {
    if (equals(oldValue, newValue)) {
      return identity;
    }
    return constant(newValue);
  },
  patch: (patch9, oldValue) => f(oldValue, patch9(oldValue))
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
var BIT_MASK = 255;
var BIT_SHIFT = 8;
var active = (patch9) => patch9 & BIT_MASK;
var enabled = (patch9) => patch9 >> BIT_SHIFT & BIT_MASK;
var make16 = (active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT);
var empty13 = /* @__PURE__ */ make16(0, 0);
var enable = (flag) => make16(flag, flag);
var disable = (flag) => make16(flag, 0);
var exclude = /* @__PURE__ */ dual(2, (self, flag) => make16(active(self) & ~flag, enabled(self)));
var andThen2 = /* @__PURE__ */ dual(2, (self, that) => self | that);
var invert = (n) => ~n >>> 0 & BIT_MASK;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/runtimeFlags.js
var None2 = 0;
var Interruption = 1 << 0;
var OpSupervision = 1 << 1;
var RuntimeMetrics = 1 << 2;
var WindDown = 1 << 4;
var CooperativeYielding = 1 << 5;
var cooperativeYielding = (self) => isEnabled(self, CooperativeYielding);
var enable2 = /* @__PURE__ */ dual(2, (self, flag) => self | flag);
var interruptible = (self) => interruption(self) && !windDown(self);
var interruption = (self) => isEnabled(self, Interruption);
var isEnabled = /* @__PURE__ */ dual(2, (self, flag) => (self & flag) !== 0);
var make17 = (...flags) => flags.reduce((a, b) => a | b, 0);
var none5 = /* @__PURE__ */ make17(None2);
var runtimeMetrics = (self) => isEnabled(self, RuntimeMetrics);
var windDown = (self) => isEnabled(self, WindDown);
var diff4 = /* @__PURE__ */ dual(2, (self, that) => make16(self ^ that, that));
var patch4 = /* @__PURE__ */ dual(2, (self, patch9) => self & (invert(active(patch9)) | enabled(patch9)) | active(patch9) & enabled(patch9));
var differ = /* @__PURE__ */ make15({
  empty: empty13,
  diff: (oldValue, newValue) => diff4(oldValue, newValue),
  combine: (first2, second) => andThen2(second)(first2),
  patch: (_patch, oldValue) => patch4(oldValue, _patch)
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/RuntimeFlagsPatch.js
var enable3 = enable;
var disable2 = disable;
var exclude2 = exclude;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/blockedRequests.js
var par = (self, that) => ({
  _tag: "Par",
  left: self,
  right: that
});
var seq = (self, that) => ({
  _tag: "Seq",
  left: self,
  right: that
});
var flatten3 = (self) => {
  let current = of3(self);
  let updated = empty9();
  while (1) {
    const [parallel5, sequential5] = reduce6(current, [parallelCollectionEmpty(), empty9()], ([parallel6, sequential6], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel6, par2), appendAll3(sequential6, seq2)];
    });
    updated = merge4(updated, parallel5);
    if (isNil(sequential5)) {
      return reverse3(updated);
    }
    current = sequential5;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var step = (requests) => {
  let current = requests;
  let parallel5 = parallelCollectionEmpty();
  let stack = empty9();
  let sequential5 = empty9();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel5, sequential5];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left3 = current.left;
        const right3 = current.right;
        switch (left3._tag) {
          case "Empty": {
            current = right3;
            break;
          }
          case "Par": {
            const l = left3.left;
            const r = left3.right;
            current = par(seq(l, right3), seq(r, right3));
            break;
          }
          case "Seq": {
            const l = left3.left;
            const r = left3.right;
            current = seq(l, seq(r, right3));
            break;
          }
          case "Single": {
            current = left3;
            sequential5 = cons(right3, sequential5);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel5 = parallelCollectionAdd(parallel5, current);
        if (isNil(stack)) {
          return [parallel5, sequential5];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var merge4 = (sequential5, parallel5) => {
  if (isNil(sequential5)) {
    return of3(parallelCollectionToSequentialCollection(parallel5));
  }
  if (parallelCollectionIsEmpty(parallel5)) {
    return sequential5;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential5.head);
  const parKeys = parallelCollectionKeys(parallel5);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential5.head, parallelCollectionToSequentialCollection(parallel5)), sequential5.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel5), sequential5);
};
var EntryTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/Entry");
var EntryImpl = class {
  request;
  result;
  listeners;
  ownerId;
  state;
  [EntryTypeId] = blockedRequestVariance;
  constructor(request, result, listeners, ownerId, state) {
    this.request = request;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
};
var blockedRequestVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
var parallelVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var ParallelImpl = class {
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map15) {
    this.map = map15;
  }
};
var parallelCollectionEmpty = () => new ParallelImpl(empty8());
var parallelCollectionAdd = (self, blockedRequest) => new ParallelImpl(modifyAt2(self.map, blockedRequest.dataSource, (_) => orElseSome(map2(_, append2(blockedRequest.blockedRequest)), () => of2(blockedRequest.blockedRequest))));
var parallelCollectionCombine = (self, that) => new ParallelImpl(reduce5(self.map, that.map, (map15, value3, key) => set3(map15, key, match2(get6(map15, key), {
  onNone: () => value3,
  onSome: (other) => appendAll2(value3, other)
}))));
var parallelCollectionIsEmpty = (self) => isEmpty3(self.map);
var parallelCollectionKeys = (self) => Array.from(keys2(self.map));
var parallelCollectionToSequentialCollection = (self) => sequentialCollectionMake(map6(self.map, (x) => of2(x)));
var SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
var sequentialVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var SequentialImpl = class {
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map15) {
    this.map = map15;
  }
};
var sequentialCollectionMake = (map15) => new SequentialImpl(map15);
var sequentialCollectionCombine = (self, that) => new SequentialImpl(reduce5(that.map, self.map, (map15, value3, key) => set3(map15, key, match2(get6(map15, key), {
  onNone: () => empty4(),
  onSome: (a) => appendAll2(a, value3)
}))));
var sequentialCollectionKeys = (self) => Array.from(keys2(self.map));
var sequentialCollectionToChunk = (self) => Array.from(self.map);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/opCodes/cause.js
var OP_DIE = "Die";
var OP_EMPTY = "Empty";
var OP_FAIL = "Fail";
var OP_INTERRUPT = "Interrupt";
var OP_PARALLEL = "Parallel";
var OP_SEQUENTIAL = "Sequential";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/cause.js
var CauseSymbolKey = "effect/Cause";
var CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
var variance4 = {
  /* c8 ignore next */
  _E: (_) => _
};
var proto = {
  [CauseTypeId]: variance4,
  [symbol]() {
    return pipe(hash(CauseSymbolKey), combine(hash(flattenCause(this))), cached(this));
  },
  [symbol2](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON(this.left),
          right: toJSON(this.right)
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var empty14 = /* @__PURE__ */ (() => {
  const o = /* @__PURE__ */ Object.create(proto);
  o._tag = OP_EMPTY;
  return o;
})();
var fail = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
var die = (defect) => {
  const o = Object.create(proto);
  o._tag = OP_DIE;
  o.defect = defect;
  return o;
};
var interrupt = (fiberId2) => {
  const o = Object.create(proto);
  o._tag = OP_INTERRUPT;
  o.fiberId = fiberId2;
  return o;
};
var parallel = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left3;
  o.right = right3;
  return o;
};
var sequential = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left3;
  o.right = right3;
  return o;
};
var isCause = (u) => hasProperty(u, CauseTypeId);
var isEmptyType = (self) => self._tag === OP_EMPTY;
var isFailType = (self) => self._tag === OP_FAIL;
var isEmpty5 = (self) => {
  if (self._tag === OP_EMPTY) {
    return true;
  }
  return reduce7(self, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY: {
        return some2(acc);
      }
      case OP_DIE:
      case OP_FAIL:
      case OP_INTERRUPT: {
        return some2(false);
      }
      default: {
        return none2();
      }
    }
  });
};
var isInterrupted = (self) => isSome2(interruptOption(self));
var isInterruptedOnly = (self) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self);
var failures = (self) => reverse2(reduce7(self, empty4(), (list, cause) => cause._tag === OP_FAIL ? some2(pipe(list, prepend2(cause.error))) : none2()));
var defects = (self) => reverse2(reduce7(self, empty4(), (list, cause) => cause._tag === OP_DIE ? some2(pipe(list, prepend2(cause.defect))) : none2()));
var interruptors = (self) => reduce7(self, empty7(), (set6, cause) => cause._tag === OP_INTERRUPT ? some2(pipe(set6, add4(cause.fiberId))) : none2());
var failureOption = (self) => find(self, (cause) => cause._tag === OP_FAIL ? some2(cause.error) : none2());
var failureOrCause = (self) => {
  const option3 = failureOption(self);
  switch (option3._tag) {
    case "None": {
      return right2(self);
    }
    case "Some": {
      return left2(option3.value);
    }
  }
};
var interruptOption = (self) => find(self, (cause) => cause._tag === OP_INTERRUPT ? some2(cause.fiberId) : none2());
var stripFailures = (self) => match5(self, {
  onEmpty: empty14,
  onFail: () => empty14,
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
});
var electFailures = (self) => match5(self, {
  onEmpty: empty14,
  onFail: die,
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
});
var causeEquals = (left3, right3) => {
  let leftStack = of2(left3);
  let rightStack = of2(right3);
  while (isNonEmpty2(leftStack) && isNonEmpty2(rightStack)) {
    const [leftParallel, leftSequential] = pipe(headNonEmpty2(leftStack), reduce7([empty7(), empty4()], ([parallel5, sequential5], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel5, union3(par2)), pipe(sequential5, appendAll2(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe(headNonEmpty2(rightStack), reduce7([empty7(), empty4()], ([parallel5, sequential5], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some2([pipe(parallel5, union3(par2)), pipe(sequential5, appendAll2(seq2))]);
    }));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
var flattenCause = (cause) => {
  return flattenCauseLoop(of2(cause), empty4());
};
var flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel5, sequential5] = pipe(causes, reduce([empty7(), empty4()], ([parallel6, sequential6], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return [pipe(parallel6, union3(par2)), pipe(sequential6, appendAll2(seq2))];
    }));
    const updated = size3(parallel5) > 0 ? pipe(flattened, prepend2(parallel5)) : flattened;
    if (isEmpty(sequential5)) {
      return reverse2(updated);
    }
    causes = sequential5;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
var find = /* @__PURE__ */ dual(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option3 = pf(item);
    switch (option3._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL:
          case OP_PARALLEL: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option3;
      }
    }
  }
  return none2();
});
var evaluateCause = (self) => {
  let cause = self;
  const stack = [];
  let _parallel = empty7();
  let _sequential = empty4();
  while (cause !== void 0) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        _parallel = add4(_parallel, make7(cause._tag, cause.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add4(_parallel, make7(cause._tag, cause.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add4(_parallel, make7(cause._tag, cause.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(cause.left.left, sequential(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(sequential(cause.left.left, cause.right), sequential(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend2(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
var IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left3, right3) => left3 && right3,
  parallelCase: (_, left3, right3) => left3 && right3
};
var OP_SEQUENTIAL_CASE = "SequentialCase";
var OP_PARALLEL_CASE = "ParallelCase";
var match5 = /* @__PURE__ */ dual(2, (self, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt: onInterrupt2,
  onParallel,
  onSequential
}) => {
  return reduceWithContext(self, void 0, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId2) => onInterrupt2(fiberId2),
    sequentialCase: (_, left3, right3) => onSequential(left3, right3),
    parallelCase: (_, left3, right3) => onParallel(left3, right3)
  });
});
var reduce7 = /* @__PURE__ */ dual(3, (self, zero3, pf) => {
  let accumulator = zero3;
  let cause = self;
  const causes = [];
  while (cause !== void 0) {
    const option3 = pf(accumulator, cause);
    accumulator = isSome2(option3) ? option3.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = void 0;
        break;
      }
    }
    if (cause === void 0 && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
var reduceWithContext = /* @__PURE__ */ dual(3, (self, context3, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY: {
        output.push(right2(reducer.emptyCase(context3)));
        break;
      }
      case OP_FAIL: {
        output.push(right2(reducer.failCase(context3, cause.error)));
        break;
      }
      case OP_DIE: {
        output.push(right2(reducer.dieCase(context3, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right2(reducer.interruptCase(context3, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left2({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left2({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either4 = output.pop();
    switch (either4._tag) {
      case "Left": {
        switch (either4.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value3 = reducer.sequentialCase(context3, left3, right3);
            accumulator.push(value3);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value3 = reducer.parallelCase(context3, left3, right3);
            accumulator.push(value3);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either4.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
var pretty = (cause, options) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  return prettyErrors(cause).map(function(e) {
    if (options?.renderErrorCause !== true || e.cause === void 0) {
      return e.stack;
    }
    return `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}`;
  }).join("\n");
};
var renderErrorCause = (cause, prefix) => {
  const lines = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length; i < len; i++) {
    stack += `
${prefix}${lines[i]}`;
  }
  if (cause.cause) {
    stack += ` {
${renderErrorCause(cause.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
};
var PrettyError = class _PrettyError extends globalThis.Error {
  span = void 0;
  constructor(originalError) {
    const originalErrorIsObject = typeof originalError === "object" && originalError !== null;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(prettyErrorMessage(originalError), originalErrorIsObject && "cause" in originalError && typeof originalError.cause !== "undefined" ? {
      cause: new _PrettyError(originalError.cause)
    } : void 0);
    if (this.message === "") {
      this.message = "An error has occurred";
    }
    Error.stackTraceLimit = prevLimit;
    this.name = originalError instanceof Error ? originalError.name : "Error";
    if (originalErrorIsObject) {
      if (spanSymbol in originalError) {
        this.span = originalError[spanSymbol];
      }
      Object.keys(originalError).forEach((key) => {
        if (!(key in this)) {
          this[key] = originalError[key];
        }
      });
    }
    this.stack = prettyErrorStack(`${this.name}: ${this.message}`, originalError instanceof Error && originalError.stack ? originalError.stack : "", this.span);
  }
};
var prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return u;
  }
  if (typeof u === "object" && u !== null && u instanceof Error) {
    return u.message;
  }
  try {
    if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) {
      return u["toString"]();
    }
  } catch {
  }
  return stringifyCircular(u);
};
var locationRegex = /\((.*)\)/g;
var spanToTrace = /* @__PURE__ */ globalValue("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap());
var prettyErrorStack = (message, stack, span2) => {
  const out = [message];
  const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes(" at new BaseEffectError") || lines[i].includes(" at new YieldableError")) {
      i++;
      continue;
    }
    if (lines[i].includes("Generator.next")) {
      break;
    }
    if (lines[i].includes("effect_internal_function")) {
      break;
    }
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (span2) {
    let current = span2;
    let i = 0;
    while (current && current._tag === "Span" && i < 10) {
      const stackFn = spanToTrace.get(current);
      if (typeof stackFn === "function") {
        const stack2 = stackFn();
        if (typeof stack2 === "string") {
          const locationMatchAll = stack2.matchAll(locationRegex);
          let match10 = false;
          for (const [, location] of locationMatchAll) {
            match10 = true;
            out.push(`    at ${current.name} (${location})`);
          }
          if (!match10) {
            out.push(`    at ${current.name} (${stack2.replace(/^at /, "")})`);
          }
        } else {
          out.push(`    at ${current.name}`);
        }
      } else {
        out.push(`    at ${current.name}`);
      }
      current = getOrUndefined2(current.parent);
      i++;
    }
  }
  return out.join("\n");
};
var spanSymbol = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
var prettyErrors = (cause) => reduceWithContext(cause, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [new PrettyError(unknownError)];
  },
  failCase: (_, error) => {
    return [new PrettyError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/opCodes/deferred.js
var OP_STATE_PENDING = "Pending";
var OP_STATE_DONE = "Done";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/deferred.js
var DeferredSymbolKey = "effect/Deferred";
var DeferredTypeId = /* @__PURE__ */ Symbol.for(DeferredSymbolKey);
var deferredVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var pending = (joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
};
var done = (effect) => {
  return {
    _tag: OP_STATE_DONE,
    effect
  };
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/singleShotGen.js
var SingleShotGen2 = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/core.js
var blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive("Blocked");
  effect.effect_instruction_i0 = blockedRequests;
  effect.effect_instruction_i1 = _continue;
  return effect;
};
var runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive("RunBlocked");
  effect.effect_instruction_i0 = blockedRequests;
  return effect;
};
var EffectTypeId2 = /* @__PURE__ */ Symbol.for("effect/Effect");
var RevertFlags = class {
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch9, op) {
    this.patch = patch9;
    this.op = op;
  }
};
var EffectPrimitive = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return cached(this, random(this));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: toJSON(this.effect_instruction_i0),
      effect_instruction_i1: toJSON(this.effect_instruction_i1),
      effect_instruction_i2: toJSON(this.effect_instruction_i2)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveFailure = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Failure" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveSuccess = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Success" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var isEffect = (u) => hasProperty(u, EffectTypeId2);
var withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive(OP_WITH_RUNTIME);
  effect.effect_instruction_i0 = withRuntime;
  return effect;
};
var acquireUseRelease = /* @__PURE__ */ dual(3, (acquire, use, release) => uninterruptibleMask((restore) => flatMap7(acquire, (a) => flatMap7(exit(suspend(() => restore(use(a)))), (exit3) => {
  return suspend(() => release(a, exit3)).pipe(matchCauseEffect({
    onFailure: (cause) => {
      switch (exit3._tag) {
        case OP_FAILURE:
          return failCause(sequential(exit3.effect_instruction_i0, cause));
        case OP_SUCCESS:
          return failCause(cause);
      }
    },
    onSuccess: () => exit3
  }));
}))));
var as = /* @__PURE__ */ dual(2, (self, value3) => flatMap7(self, () => succeed(value3)));
var asVoid = (self) => as(self, void 0);
var custom = function() {
  const wrapper = new EffectPrimitive(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
};
var unsafeAsync = (register, blockingOn = none4) => {
  const effect = new EffectPrimitive(OP_ASYNC);
  let cancelerRef = void 0;
  effect.effect_instruction_i0 = (resume2) => {
    cancelerRef = register(resume2);
  };
  effect.effect_instruction_i1 = blockingOn;
  return onInterrupt(effect, (_) => isEffect(cancelerRef) ? cancelerRef : void_2);
};
var asyncInterrupt = (register, blockingOn = none4) => suspend(() => unsafeAsync(register, blockingOn));
var async_ = (resume2, blockingOn = none4) => {
  return custom(resume2, function() {
    let backingResume = void 0;
    let pendingEffect = void 0;
    function proxyResume(effect2) {
      if (backingResume) {
        backingResume(effect2);
      } else if (pendingEffect === void 0) {
        pendingEffect = effect2;
      }
    }
    const effect = new EffectPrimitive(OP_ASYNC);
    effect.effect_instruction_i0 = (resume3) => {
      backingResume = resume3;
      if (pendingEffect) {
        resume3(pendingEffect);
      }
    };
    effect.effect_instruction_i1 = blockingOn;
    let cancelerRef = void 0;
    let controllerRef = void 0;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController();
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
    } else {
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
    }
    return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? void_2;
    }) : effect;
  });
};
var catchAll = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
  onFailure: f,
  onSuccess: succeed
}));
var originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
var capture = (obj, span2) => {
  if (isSome2(span2)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol) {
          return span2.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
};
var die2 = (defect) => isObject(defect) && !(spanSymbol in defect) ? withFiberRuntime((fiber) => failCause(die(capture(defect, currentSpanFromFiber(fiber))))) : failCause(die(defect));
var dieMessage = (message) => failCauseSync(() => die(new RuntimeException(message)));
var either2 = (self) => matchEffect(self, {
  onFailure: (e) => succeed(left2(e)),
  onSuccess: (a) => succeed(right2(a))
});
var exit = (self) => matchCause(self, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
});
var fail2 = (error) => isObject(error) && !(spanSymbol in error) ? withFiberRuntime((fiber) => failCause(fail(capture(error, currentSpanFromFiber(fiber))))) : failCause(fail(error));
var failSync = (evaluate2) => flatMap7(sync(evaluate2), fail2);
var failCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
var failCauseSync = (evaluate2) => flatMap7(sync(evaluate2), failCause);
var fiberId = /* @__PURE__ */ withFiberRuntime((state) => succeed(state.id()));
var fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
var flatMap7 = /* @__PURE__ */ dual(2, (self, f) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = f;
  return effect;
});
var step2 = (self) => {
  const effect = new EffectPrimitive("OnStep");
  effect.effect_instruction_i0 = self;
  return effect;
};
var flatten4 = (self) => flatMap7(self, identity);
var matchCause = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: (cause) => succeed(options.onFailure(cause)),
  onSuccess: (a) => succeed(options.onSuccess(a))
}));
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, options) => {
  const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect.effect_instruction_i0 = self;
  effect.effect_instruction_i1 = options.onFailure;
  effect.effect_instruction_i2 = options.onSuccess;
  return effect;
});
var matchEffect = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const defects2 = defects(cause);
    if (defects2.length > 0) {
      return failCause(electFailures(cause));
    }
    const failures2 = failures(cause);
    if (failures2.length > 0) {
      return options.onFailure(unsafeHead(failures2));
    }
    return failCause(cause);
  },
  onSuccess: options.onSuccess
}));
var forEachSequential = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  const ret = allocate(arr.length);
  let i = 0;
  return as(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: (b) => {
      ret[i++] = b;
    }
  }), ret);
}));
var forEachSequentialDiscard = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable(self);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
var interruptible2 = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable3(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
};
var map9 = /* @__PURE__ */ dual(2, (self, f) => flatMap7(self, (a) => sync(() => f(a))));
var mapBoth2 = /* @__PURE__ */ dual(2, (self, options) => matchEffect(self, {
  onFailure: (e) => failSync(() => options.onFailure(e)),
  onSuccess: (a) => sync(() => options.onSuccess(a))
}));
var mapError = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const either4 = failureOrCause(cause);
    switch (either4._tag) {
      case "Left": {
        return failSync(() => f(either4.left));
      }
      case "Right": {
        return failCause(either4.right);
      }
    }
  },
  onSuccess: succeed
}));
var onExit = /* @__PURE__ */ dual(2, (self, cleanup) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
  onFailure: (cause1) => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: (cause2) => exitFailCause(sequential(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: (success) => {
    const result = exitSucceed(success);
    return zipRight(cleanup(result), result);
  }
})));
var onInterrupt = /* @__PURE__ */ dual(2, (self, cleanup) => onExit(self, exitMatch({
  onFailure: (cause) => isInterruptedOnly(cause) ? asVoid(cleanup(interruptors(cause))) : void_2,
  onSuccess: () => void_2
})));
var succeed = (value3) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value3;
  return effect;
};
var suspend = (evaluate2) => {
  const effect = new EffectPrimitive(OP_COMMIT);
  effect.commit = evaluate2;
  return effect;
};
var sync = (thunk) => {
  const effect = new EffectPrimitive(OP_SYNC);
  effect.effect_instruction_i0 = thunk;
  return effect;
};
var tap = /* @__PURE__ */ dual((args2) => args2.length === 3 || args2.length === 2 && !(isObject(args2[1]) && "onlyEffect" in args2[1]), (self, f) => flatMap7(self, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return as(b, a);
  } else if (isPromiseLike(b)) {
    return unsafeAsync((resume2) => {
      b.then((_) => resume2(succeed(a)), (e) => resume2(fail2(new UnknownException(e, "An unknown error occurred in Effect.tap"))));
    });
  }
  return succeed(a);
}));
var transplant = (f) => withFiberRuntime((state) => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope2 = pipe(scopeOverride, getOrElse2(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some2(scope2)));
});
var uninterruptible = (self) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = () => self;
  return effect;
};
var uninterruptibleMask = (f) => custom(f, function() {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable2(Interruption);
  effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect;
});
var void_2 = /* @__PURE__ */ succeed(void 0);
var updateRuntimeFlags = (patch9) => {
  const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = patch9;
  effect.effect_instruction_i1 = void 0;
  return effect;
};
var whileLoop = (options) => {
  const effect = new EffectPrimitive(OP_WHILE);
  effect.effect_instruction_i0 = options.while;
  effect.effect_instruction_i1 = options.body;
  effect.effect_instruction_i2 = options.step;
  return effect;
};
var yieldNow = (options) => {
  const effect = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
};
var zip2 = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, (a) => map9(that, (b) => [a, b])));
var zipLeft = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, (a) => as(that, a)));
var zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, () => that));
var never = /* @__PURE__ */ asyncInterrupt(() => {
  const interval = setInterval(() => {
  }, 2 ** 31 - 1);
  return sync(() => clearInterval(interval));
});
var interruptFiber = (self) => flatMap7(fiberId, (fiberId2) => pipe(self, interruptAsFiber(fiberId2)));
var interruptAsFiber = /* @__PURE__ */ dual(2, (self, fiberId2) => flatMap7(self.interruptAsFork(fiberId2), () => self.await));
var logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FiberRefSymbolKey = "effect/FiberRef";
var FiberRefTypeId = /* @__PURE__ */ Symbol.for(FiberRefSymbolKey);
var fiberRefVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var fiberRefGet = (self) => withFiberRuntime((fiber) => exitSucceed(fiber.getFiberRef(self)));
var fiberRefGetWith = /* @__PURE__ */ dual(2, (self, f) => flatMap7(fiberRefGet(self), f));
var fiberRefSet = /* @__PURE__ */ dual(2, (self, value3) => fiberRefModify(self, () => [void 0, value3]));
var fiberRefModify = /* @__PURE__ */ dual(2, (self, f) => withFiberRuntime((state) => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return succeed(b);
}));
var RequestResolverSymbolKey = "effect/RequestResolver";
var RequestResolverTypeId = /* @__PURE__ */ Symbol.for(RequestResolverSymbolKey);
var requestResolverVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var RequestResolverImpl = class _RequestResolverImpl {
  runAll;
  target;
  [RequestResolverTypeId] = requestResolverVariance;
  constructor(runAll, target) {
    this.runAll = runAll;
    this.target = target;
  }
  [symbol]() {
    return cached(this, this.target ? hash(this.target) : random(this));
  }
  [symbol2](that) {
    return this.target ? isRequestResolver(that) && equals(this.target, that.target) : this === that;
  }
  identified(...ids3) {
    return new _RequestResolverImpl(this.runAll, fromIterable2(ids3));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isRequestResolver = (u) => hasProperty(u, RequestResolverTypeId);
var fiberRefLocally = /* @__PURE__ */ dual(3, (use, self, value3) => acquireUseRelease(zipLeft(fiberRefGet(self), fiberRefSet(self, value3)), () => use, (oldValue) => fiberRefSet(self, oldValue)));
var fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update(),
  fork: options?.fork ?? identity,
  join: options?.join
});
var fiberRefUnsafeMakeHashSet = (initial) => {
  const differ3 = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakeReadonlyArray = (initial) => {
  const differ3 = readonlyArray(update());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakeContext = (initial) => {
  const differ3 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakePatch = (initial, options) => {
  const _fiberRef = {
    ...CommitPrototype,
    [FiberRefTypeId]: fiberRefVariance,
    initial,
    commit() {
      return fiberRefGet(this);
    },
    diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
    combine: (first2, second) => options.differ.combine(first2, second),
    patch: (patch9) => (oldValue) => options.differ.patch(patch9, oldValue),
    fork: options.fork,
    join: options.join ?? ((_, n) => n)
  };
  return _fiberRef;
};
var fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: differ.empty
});
var currentContext = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty3()));
var currentSchedulingPriority = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
var currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
var currentLogAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty8()));
var currentLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
var currentLogSpan = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty9()));
var withSchedulingPriority = /* @__PURE__ */ dual(2, (self, scheduler2) => fiberRefLocally(self, currentSchedulingPriority, scheduler2));
var currentConcurrency = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
var currentRequestBatching = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
var currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelDebug)));
var currentMetricLabels = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty()));
var currentForkScopeOverride = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none2(), {
  fork: () => none2(),
  join: (parent, _) => parent
}));
var currentInterruptedCause = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty14, {
  fork: () => empty14,
  join: (parent, _) => parent
}));
var ScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Scope");
var CloseableScopeTypeId = /* @__PURE__ */ Symbol.for("effect/CloseableScope");
var scopeAddFinalizer = (self, finalizer) => self.addFinalizer(() => asVoid(finalizer));
var scopeClose = (self, exit3) => self.close(exit3);
var scopeFork = (self, strategy) => self.fork(strategy);
var YieldableError = /* @__PURE__ */ function() {
  class YieldableError2 extends globalThis.Error {
    commit() {
      return fail2(this);
    }
    toJSON() {
      const obj = {
        ...this
      };
      if (this.message) obj.message = this.message;
      if (this.cause) obj.cause = this.cause;
      return obj;
    }
    [NodeInspectSymbol]() {
      if (this.toString !== globalThis.Error.prototype.toString) {
        return this.stack ? `${this.toString()}
${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
      } else if ("Bun" in globalThis) {
        return pretty(fail(this), {
          renderErrorCause: true
        });
      }
      return this;
    }
  }
  Object.assign(YieldableError2.prototype, StructuralCommitPrototype);
  return YieldableError2;
}();
var makeException = (proto5, tag2) => {
  class Base3 extends YieldableError {
    _tag = tag2;
  }
  Object.assign(Base3.prototype, proto5);
  Base3.prototype.name = tag2;
  return Base3;
};
var RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
var RuntimeException = /* @__PURE__ */ makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
var InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
var InterruptedException = /* @__PURE__ */ makeException({
  [InterruptedExceptionTypeId]: InterruptedExceptionTypeId
}, "InterruptedException");
var isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
var IllegalArgumentExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/IllegalArgument");
var IllegalArgumentException = /* @__PURE__ */ makeException({
  [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
var NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
var NoSuchElementException = /* @__PURE__ */ makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
var InvalidPubSubCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
var InvalidPubSubCapacityException = /* @__PURE__ */ makeException({
  [InvalidPubSubCapacityExceptionTypeId]: InvalidPubSubCapacityExceptionTypeId
}, "InvalidPubSubCapacityException");
var ExceededCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/ExceededCapacityException");
var ExceededCapacityException = /* @__PURE__ */ makeException({
  [ExceededCapacityExceptionTypeId]: ExceededCapacityExceptionTypeId
}, "ExceededCapacityException");
var TimeoutExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/Timeout");
var TimeoutException = /* @__PURE__ */ makeException({
  [TimeoutExceptionTypeId]: TimeoutExceptionTypeId
}, "TimeoutException");
var UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
var UnknownException = /* @__PURE__ */ function() {
  class UnknownException2 extends YieldableError {
    _tag = "UnknownException";
    error;
    constructor(cause, message) {
      super(message ?? "An unknown error occurred", {
        cause
      });
      this.error = cause;
    }
  }
  Object.assign(UnknownException2.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException2;
}();
var exitIsExit = (u) => isEffect(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
var exitIsSuccess = (self) => self._tag === "Success";
var exitAs = /* @__PURE__ */ dual(2, (self, value3) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(value3);
    }
  }
});
var exitAsVoid = (self) => exitAs(self, void 0);
var exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel : sequential);
var exitDie = (defect) => exitFailCause(die(defect));
var exitFail = (error) => exitFailCause(fail(error));
var exitFailCause = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
var exitInterrupt = (fiberId2) => exitFailCause(interrupt(fiberId2));
var exitMap = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(self.effect_instruction_i0);
    case OP_SUCCESS:
      return exitSucceed(f(self.effect_instruction_i0));
  }
});
var exitMatch = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE:
      return onFailure(self.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self.effect_instruction_i0);
  }
});
var exitSucceed = (value3) => {
  const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect.effect_instruction_i0 = value3;
  return effect;
};
var exitVoid = /* @__PURE__ */ exitSucceed(void 0);
var exitZipWith = /* @__PURE__ */ dual(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitFailCause(self.effect_instruction_i0);
        case OP_FAILURE: {
          return exitFailCause(onFailure(self.effect_instruction_i0, that.effect_instruction_i0));
        }
      }
    }
    case OP_SUCCESS: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitSucceed(onSuccess(self.effect_instruction_i0, that.effect_instruction_i0));
        case OP_FAILURE:
          return exitFailCause(that.effect_instruction_i0);
      }
    }
  }
});
var exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable2(exits);
  if (!isNonEmpty2(list)) {
    return none2();
  }
  return pipe(tailNonEmpty2(list), reduce(pipe(headNonEmpty2(list), exitMap(of2)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: (list2, value3) => pipe(list2, prepend2(value3)),
    onFailure: combineCauses
  }))), exitMap(reverse2), exitMap((chunk3) => toReadonlyArray(chunk3)), some2);
};
var deferredUnsafeMake = (fiberId2) => {
  const _deferred = {
    ...CommitPrototype,
    [DeferredTypeId]: deferredVariance,
    state: make12(pending([])),
    commit() {
      return deferredAwait(this);
    },
    blockingOn: fiberId2
  };
  return _deferred;
};
var deferredAwait = (self) => asyncInterrupt((resume2) => {
  const state = get5(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return resume2(state.effect);
    }
    case OP_STATE_PENDING: {
      state.joiners.push(resume2);
      return deferredInterruptJoiner(self, resume2);
    }
  }
}, self.blockingOn);
var deferredUnsafeDone = (self, effect) => {
  const state = get5(self.state);
  if (state._tag === OP_STATE_PENDING) {
    set2(self.state, done(effect));
    for (let i = 0, len = state.joiners.length; i < len; i++) {
      state.joiners[i](effect);
    }
  }
};
var deferredInterruptJoiner = (self, joiner) => sync(() => {
  const state = get5(self.state);
  if (state._tag === OP_STATE_PENDING) {
    const index = state.joiners.indexOf(joiner);
    if (index >= 0) {
      state.joiners.splice(index, 1);
    }
  }
});
var constContext = /* @__PURE__ */ withFiberRuntime((fiber) => exitSucceed(fiber.currentContext));
var context2 = () => constContext;
var contextWithEffect = (f) => flatMap7(context2(), f);
var provideContext = /* @__PURE__ */ dual(2, (self, context3) => fiberRefLocally(currentContext, context3)(self));
var mapInputContext = /* @__PURE__ */ dual(2, (self, f) => contextWithEffect((context3) => provideContext(self, f(context3))));
var currentSpanFromFiber = (fiber) => {
  const span2 = fiber.currentSpan;
  return span2 !== void 0 && span2._tag === "Span" ? some2(span2) : none2();
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Exit.js
var isExit = exitIsExit;
var isSuccess = exitIsSuccess;
var failCause2 = exitFailCause;
var match6 = exitMatch;
var succeed2 = exitSucceed;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/MutableHashMap.js
var TypeId10 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
var MutableHashMapProto = {
  [TypeId10]: TypeId10,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var MutableHashMapIterator = class _MutableHashMapIterator {
  self;
  referentialIterator;
  bucketIterator;
  constructor(self) {
    this.self = self;
    this.referentialIterator = self.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
  }
  [Symbol.iterator]() {
    return new _MutableHashMapIterator(this.self);
  }
};
var BucketIterator = class {
  backing;
  constructor(backing) {
    this.backing = backing;
  }
  currentBucket;
  next() {
    if (this.currentBucket === void 0) {
      const result2 = this.backing.next();
      if (result2.done) {
        return result2;
      }
      this.currentBucket = result2.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = void 0;
      return this.next();
    }
    return result;
  }
};
var empty15 = () => {
  const self = Object.create(MutableHashMapProto);
  self.referential = /* @__PURE__ */ new Map();
  self.buckets = /* @__PURE__ */ new Map();
  self.bucketsSize = 0;
  return self;
};
var get7 = /* @__PURE__ */ dual(2, (self, key) => {
  if (isEqual(key) === false) {
    return self.referential.has(key) ? some2(self.referential.get(key)) : none2();
  }
  const hash3 = key[symbol]();
  const bucket = self.buckets.get(hash3);
  if (bucket === void 0) {
    return none2();
  }
  return getFromBucket(self, bucket, key);
});
var getFromBucket = (self, bucket, key, remove6 = false) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      const value3 = bucket[i][1];
      if (remove6) {
        bucket.splice(i, 1);
        self.bucketsSize--;
      }
      return some2(value3);
    }
  }
  return none2();
};
var has4 = /* @__PURE__ */ dual(2, (self, key) => isSome2(get7(self, key)));
var set4 = /* @__PURE__ */ dual(3, (self, key, value3) => {
  if (isEqual(key) === false) {
    self.referential.set(key, value3);
    return self;
  }
  const hash3 = key[symbol]();
  const bucket = self.buckets.get(hash3);
  if (bucket === void 0) {
    self.buckets.set(hash3, [[key, value3]]);
    self.bucketsSize++;
    return self;
  }
  removeFromBucket(self, bucket, key);
  bucket.push([key, value3]);
  self.bucketsSize++;
  return self;
});
var removeFromBucket = (self, bucket, key) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      bucket.splice(i, 1);
      self.bucketsSize--;
      return;
    }
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/clock.js
var ClockSymbolKey = "effect/Clock";
var ClockTypeId = /* @__PURE__ */ Symbol.for(ClockSymbolKey);
var clockTag = /* @__PURE__ */ GenericTag("effect/Clock");
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var globalClockScheduler = {
  unsafeSchedule(task, duration2) {
    const millis2 = toMillis(duration2);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = setTimeout(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clearTimeout(handle);
      return !completed;
    };
  }
};
var performanceNowNanos = /* @__PURE__ */ function() {
  const bigint1e62 = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e62;
  }
  let origin;
  return () => {
    if (origin === void 0) {
      origin = BigInt(Date.now()) * bigint1e62 - BigInt(Math.round(performance.now() * 1e6));
    }
    return origin + BigInt(Math.round(performance.now() * 1e6));
  };
}();
var processOrPerformanceNow = /* @__PURE__ */ function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();
var ClockImpl = class {
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return succeed(globalClockScheduler);
  }
  sleep(duration2) {
    return async_((resume2) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => resume2(void_2), duration2);
      return asVoid(sync(canceler));
    });
  }
};
var make19 = () => new ClockImpl();

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/opCodes/configError.js
var OP_AND = "And";
var OP_OR = "Or";
var OP_INVALID_DATA = "InvalidData";
var OP_MISSING_DATA = "MissingData";
var OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
var OP_UNSUPPORTED = "Unsupported";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/configError.js
var ConfigErrorSymbolKey = "effect/ConfigError";
var ConfigErrorTypeId = /* @__PURE__ */ Symbol.for(ConfigErrorSymbolKey);
var proto2 = {
  _tag: "ConfigError",
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
var And = (self, that) => {
  const error = Object.create(proto2);
  error._op = OP_AND;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
var Or = (self, that) => {
  const error = Object.create(proto2);
  error._op = OP_OR;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
var InvalidData = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_INVALID_DATA;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
var MissingData = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_MISSING_DATA;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe(this.path, join(options.pathDelim));
      return `(Missing data at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
var SourceUnavailable = (path2, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_SOURCE_UNAVAILABLE;
  error.path = path2;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
var Unsupported = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_UNSUPPORTED;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
var prefixed = /* @__PURE__ */ dual(2, (self, prefix) => {
  switch (self._op) {
    case OP_AND: {
      return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self.path], self.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self.path], self.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self.path], self.message);
    }
  }
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
var empty16 = {
  _tag: "Empty"
};
var patch5 = /* @__PURE__ */ dual(2, (path2, patch9) => {
  let input = of3(patch9);
  let output = path2;
  while (isCons(input)) {
    const patch10 = input.head;
    switch (patch10._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch10.first, cons(patch10.second, input.tail));
        break;
      }
      case "MapName": {
        output = map3(output, patch10.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend(output, patch10.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output), contains(patch10.name));
        if (containsName) {
          output = tailNonEmpty(output);
          input = input.tail;
        } else {
          return left2(MissingData(output, `Expected ${patch10.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right2(output);
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/opCodes/config.js
var OP_CONSTANT = "Constant";
var OP_FAIL2 = "Fail";
var OP_FALLBACK = "Fallback";
var OP_DESCRIBED = "Described";
var OP_LAZY = "Lazy";
var OP_MAP_OR_FAIL = "MapOrFail";
var OP_NESTED = "Nested";
var OP_PRIMITIVE = "Primitive";
var OP_SEQUENCE = "Sequence";
var OP_HASHMAP = "HashMap";
var OP_ZIP_WITH = "ZipWith";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/configProvider.js
var concat = (l, r) => [...l, ...r];
var ConfigProviderSymbolKey = "effect/ConfigProvider";
var ConfigProviderTypeId = /* @__PURE__ */ Symbol.for(ConfigProviderSymbolKey);
var configProviderTag = /* @__PURE__ */ GenericTag("effect/ConfigProvider");
var FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
var FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for(FlatConfigProviderSymbolKey);
var make21 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path2, config2, split2 = true) => options.load(path2, config2, split2),
  enumerateChildren: options.enumerateChildren
});
var fromFlat = (flat) => make21({
  load: (config2) => flatMap7(fromFlatLoop(flat, empty(), config2, false), (chunk3) => match2(head(chunk3), {
    onNone: () => fail2(MissingData(empty(), `Expected a single value having structure: ${config2}`)),
    onSome: succeed
  })),
  flattened: flat
});
var fromEnv = (options) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, options);
  const makePathString = (path2) => pipe(path2, join(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path2, primitive2, split2 = true) => {
    const pathString = makePathString(path2);
    const current = getEnv();
    const valueOpt = pathString in current ? some2(current[pathString]) : none2();
    return pipe(valueOpt, mapError(() => MissingData(path2, `Expected ${pathString} to exist in the process context`)), flatMap7((value3) => parsePrimitive(value3, path2, primitive2, seqDelim, split2)));
  };
  const enumerateChildren = (path2) => sync(() => {
    const current = getEnv();
    const keys6 = Object.keys(current);
    const keyPaths = keys6.map((value3) => unmakePathString(value3.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0; i < path2.length; i++) {
        const pathComponent = pipe(path2, unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === void 0 || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path2.length, path2.length + 1));
    return fromIterable5(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty16
  }));
};
var extend = (leftDef, rightDef, left3, right3) => {
  const leftPad = unfold(left3.length, (index) => index >= right3.length ? none2() : some2([leftDef(index), index + 1]));
  const rightPad = unfold(right3.length, (index) => index >= left3.length ? none2() : some2([rightDef(index), index + 1]));
  const leftExtension = concat(left3, leftPad);
  const rightExtension = concat(right3, rightPad);
  return [leftExtension, rightExtension];
};
var appendConfigPath = (path2, config2) => {
  let op = config2;
  if (op._tag === "Nested") {
    const out = path2.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path2;
};
var fromFlatLoop = (flat, prefix, config2, split2) => {
  const op = config2;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split2));
    }
    case OP_FAIL2: {
      return fail2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(suspend(() => fromFlatLoop(flat, prefix, op.first, split2)), catchAll((error1) => {
        if (op.condition(error1)) {
          return pipe(fromFlatLoop(flat, prefix, op.second, split2), catchAll((error2) => fail2(Or(error1, error2))));
        }
        return fail2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split2));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split2), flatMap7(forEachSequential((a) => pipe(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat(prefix, of(op.name)), op.config, split2));
    }
    case OP_PRIMITIVE: {
      return pipe(patch5(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.load(prefix2, op, split2), flatMap7((values4) => {
        if (values4.length === 0) {
          const name = pipe(last(prefix2), getOrElse2(() => "<n/a>"));
          return fail2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed(values4);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe(patch5(prefix, flat.patch), flatMap7((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap7(indicesFrom), flatMap7((indices) => {
        if (indices.length === 0) {
          return suspend(() => map9(fromFlatLoop(flat, prefix, op.config, true), of));
        }
        return pipe(forEachSequential(indices, (index) => fromFlatLoop(flat, append(prefix, `[${index}]`), op.config, true)), map9((chunkChunk) => {
          const flattened = flatten(chunkChunk);
          if (flattened.length === 0) {
            return of(empty());
          }
          return of(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe(patch5(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.enumerateChildren(prefix2), flatMap7((keys6) => {
        return pipe(keys6, forEachSequential((key) => fromFlatLoop(flat, concat(prefix2, of(key)), op.valueConfig, split2)), map9((matrix) => {
          if (matrix.length === 0) {
            return of(empty8());
          }
          return pipe(transpose(matrix), map3((values4) => fromIterable6(zip(fromIterable(keys6), values4))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split2), either2, flatMap7((left3) => pipe(fromFlatLoop(flat, prefix, op.right, split2), either2, flatMap7((right3) => {
        if (isLeft2(left3) && isLeft2(right3)) {
          return fail2(And(left3.left, right3.left));
        }
        if (isLeft2(left3) && isRight2(right3)) {
          return fail2(left3.left);
        }
        if (isRight2(left3) && isLeft2(right3)) {
          return fail2(right3.left);
        }
        if (isRight2(left3) && isRight2(right3)) {
          const path2 = pipe(prefix, join("."));
          const fail7 = fromFlatLoopFail(prefix, path2);
          const [lefts, rights] = extend(fail7, fail7, pipe(left3.right, map3(right2)), pipe(right3.right, map3(right2)));
          return pipe(lefts, zip(rights), forEachSequential(([left4, right4]) => pipe(zip2(left4, right4), map9(([left5, right5]) => op.zip(left5, right5)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
};
var fromFlatLoopFail = (prefix, path2) => (index) => left2(MissingData(prefix, `The element at index ${index} in a sequence at path "${path2}" was missing`));
var splitPathString = (text, delim) => {
  const split2 = text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split2;
};
var parsePrimitive = (text, path2, primitive2, delimiter, split2) => {
  if (!split2) {
    return pipe(primitive2.parse(text), mapBoth2({
      onFailure: prefixed(path2),
      onSuccess: of
    }));
  }
  return pipe(splitPathString(text, delimiter), forEachSequential((char2) => primitive2.parse(char2.trim())), mapError(prefixed(path2)));
};
var transpose = (array6) => {
  return Object.keys(array6[0]).map((column) => array6.map((row) => row[column]));
};
var indicesFrom = (quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth2({
  onFailure: () => empty(),
  onSuccess: sort(Order)
}), either2, map9(merge));
var QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
var parseQuotedIndex = (str) => {
  const match10 = str.match(QUOTED_INDEX_REGEX);
  if (match10 !== null) {
    const matchedIndex = match10[2];
    return pipe(matchedIndex !== void 0 && matchedIndex.length > 0 ? some2(matchedIndex) : none2(), flatMap2(parseInteger));
  }
  return none2();
};
var parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none2() : some2(parsedIndex);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/defaultServices/console.js
var TypeId11 = /* @__PURE__ */ Symbol.for("effect/Console");
var consoleTag = /* @__PURE__ */ GenericTag("effect/Console");
var defaultConsole = {
  [TypeId11]: TypeId11,
  assert(condition, ...args2) {
    return sync(() => {
      console.assert(condition, ...args2);
    });
  },
  clear: /* @__PURE__ */ sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args2) {
    return sync(() => {
      console.debug(...args2);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args2) {
    return sync(() => {
      console.dirxml(...args2);
    });
  },
  error(...args2) {
    return sync(() => {
      console.error(...args2);
    });
  },
  group(options) {
    return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
  },
  groupEnd: /* @__PURE__ */ sync(() => {
    console.groupEnd();
  }),
  info(...args2) {
    return sync(() => {
      console.info(...args2);
    });
  },
  log(...args2) {
    return sync(() => {
      console.log(...args2);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args2) {
    return sync(() => {
      console.timeLog(label, ...args2);
    });
  },
  trace(...args2) {
    return sync(() => {
      console.trace(...args2);
    });
  },
  warn(...args2) {
    return sync(() => {
      console.warn(...args2);
    });
  },
  unsafe: console
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/random.js
var RandomSymbolKey = "effect/Random";
var RandomTypeId = /* @__PURE__ */ Symbol.for(RandomSymbolKey);
var randomTag = /* @__PURE__ */ GenericTag("effect/Random");
var RandomImpl = class {
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map9(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min3, max3) {
    return map9(this.next, (n) => (max3 - min3) * n + min3);
  }
  nextIntBetween(min3, max3) {
    return sync(() => this.PRNG.integer(max3 - min3) + min3);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};
var shuffleWith = (elements, nextIntBounded) => {
  return suspend(() => pipe(sync(() => Array.from(elements)), flatMap7((buffer) => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map9((k) => swap(buffer, n - 1, k)))), as(fromIterable2(buffer)));
  })));
};
var swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
var make22 = (seed) => new RandomImpl(hash(seed));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/tracer.js
var TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
var make23 = (options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
var tracerTag = /* @__PURE__ */ GenericTag("effect/Tracer");
var spanTag = /* @__PURE__ */ GenericTag("effect/ParentSpan");
var randomHexString = /* @__PURE__ */ function() {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function(length2) {
    let result = "";
    for (let i = 0; i < length2; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}();
var NativeSpan = class {
  name;
  parent;
  context;
  startTime;
  kind;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  links;
  constructor(name, parent, context3, links, startTime, kind) {
    this.name = name;
    this.parent = parent;
    this.context = context3;
    this.startTime = startTime;
    this.kind = kind;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
    this.links = Array.from(links);
  }
  end(endTime, exit3) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit3,
      startTime: this.status.startTime
    };
  }
  attribute(key, value3) {
    this.attributes.set(key, value3);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
};
var nativeTracer = /* @__PURE__ */ make23({
  span: (name, parent, context3, links, startTime, kind) => new NativeSpan(name, parent, context3, links, startTime, kind),
  context: (f) => f()
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/defaultServices.js
var liveServices = /* @__PURE__ */ pipe(/* @__PURE__ */ empty3(), /* @__PURE__ */ add2(clockTag, /* @__PURE__ */ make19()), /* @__PURE__ */ add2(consoleTag, defaultConsole), /* @__PURE__ */ add2(randomTag, /* @__PURE__ */ make22(/* @__PURE__ */ Math.random())), /* @__PURE__ */ add2(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add2(tracerTag, nativeTracer));
var currentServices = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));
var defaultServicesWith = (f) => withFiberRuntime((fiber) => f(fiber.currentDefaultServices));
var configProviderWith = (f) => defaultServicesWith((services) => f(services.unsafeMap.get(configProviderTag.key)));
var config = (config2) => configProviderWith((_) => _.load(config2));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberRefs.js
function unsafeMake3(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
function empty17() {
  return unsafeMake3(/* @__PURE__ */ new Map());
}
var FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var FiberRefsImpl = class {
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = void 0;
  while (ret === void 0) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty(parentStack)[0];
      const parentAncestors = tailNonEmpty(parentStack);
      const childFiberId = headNonEmpty(childStack)[0];
      const childRefValue = headNonEmpty(childStack)[1];
      const childAncestors = tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
var joinAs = /* @__PURE__ */ dual(3, (self, fiberId2, that) => {
  const parentFiberRefs = new Map(self.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol2](fiberId2)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [[fiberId2, fiberRef.join(fiberRef.initial, childValue)]]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch9 = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch9)(oldValue));
        if (!equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol2](fiberId2)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId2, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
var forkAs = /* @__PURE__ */ dual(2, (self, childId) => {
  const map15 = /* @__PURE__ */ new Map();
  unsafeForkAs(self, map15, childId);
  return new FiberRefsImpl(map15);
});
var unsafeForkAs = (self, map15, fiberId2) => {
  self.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals(oldValue, newValue)) {
      map15.set(fiberRef, stack);
    } else {
      map15.set(fiberRef, [[fiberId2, newValue], ...stack]);
    }
  });
};
var delete_ = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
var get8 = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return none2();
  }
  return some2(headNonEmpty(self.locals.get(fiberRef))[1]);
});
var getOrDefault = /* @__PURE__ */ dual(2, (self, fiberRef) => pipe(get8(self, fiberRef), getOrElse2(() => fiberRef.initial)));
var updateAs = /* @__PURE__ */ dual(2, (self, {
  fiberId: fiberId2,
  fiberRef,
  value: value3
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(/* @__PURE__ */ new Map([[fiberRef, [[fiberId2, value3]]]]));
  }
  const locals = new Map(self.locals);
  unsafeUpdateAs(locals, fiberId2, fiberRef, value3);
  return new FiberRefsImpl(locals);
});
var unsafeUpdateAs = (locals, fiberId2, fiberRef, value3) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty(oldStack);
    if (currentId[symbol2](fiberId2)) {
      if (equals(currentValue, value3)) {
        return;
      } else {
        newStack = [[fiberId2, value3], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId2, value3], ...oldStack];
    }
  } else {
    newStack = [[fiberId2, value3]];
  }
  locals.set(fiberRef, newStack);
};
var updateManyAs = /* @__PURE__ */ dual(2, (self, {
  entries: entries2,
  forkAs: forkAs2
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries2));
  }
  const locals = new Map(self.locals);
  if (forkAs2 !== void 0) {
    unsafeForkAs(self, locals, forkAs2);
  }
  entries2.forEach(([fiberRef, values4]) => {
    if (values4.length === 1) {
      unsafeUpdateAs(locals, values4[0][0], fiberRef, values4[0][1]);
    } else {
      values4.forEach(([fiberId2, value3]) => {
        unsafeUpdateAs(locals, fiberId2, fiberRef, value3);
      });
    }
  });
  return new FiberRefsImpl(locals);
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/FiberRefs.js
var getOrDefault2 = getOrDefault;
var updateManyAs2 = updateManyAs;
var empty18 = empty17;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/LogLevel.js
var All = logLevelAll;
var Fatal = logLevelFatal;
var Error2 = logLevelError;
var Warning = logLevelWarning;
var Info = logLevelInfo;
var Debug2 = logLevelDebug;
var Trace = logLevelTrace;
var None3 = logLevelNone;
var Order5 = /* @__PURE__ */ pipe(Order, /* @__PURE__ */ mapInput2((level) => level.ordinal));
var greaterThan4 = /* @__PURE__ */ greaterThan(Order5);
var fromLiteral = (literal2) => {
  switch (literal2) {
    case "All":
      return All;
    case "Debug":
      return Debug2;
    case "Error":
      return Error2;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None3;
    case "Warning":
      return Warning;
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/logSpan.js
var formatLabel = (key) => key.replace(/[\s="]/g, "_");
var render = (now2) => (self) => {
  const label = formatLabel(self.label);
  return `${label}=${now2 - self.startTime}ms`;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Effectable.js
var EffectPrototype2 = EffectPrototype;
var Base2 = Base;
var Class2 = class extends Base2 {
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberRefs/patch.js
var OP_EMPTY2 = "Empty";
var OP_ADD = "Add";
var OP_REMOVE = "Remove";
var OP_UPDATE = "Update";
var OP_AND_THEN = "AndThen";
var empty19 = {
  _tag: OP_EMPTY2
};
var diff5 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch9 = empty19;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== void 0) {
      const oldValue2 = headNonEmpty(old)[1];
      if (!equals(oldValue2, newValue2)) {
        patch9 = combine6({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch9);
      }
    } else {
      patch9 = combine6({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch9);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch9 = combine6({
      _tag: OP_REMOVE,
      fiberRef
    })(patch9);
  }
  return patch9;
};
var combine6 = /* @__PURE__ */ dual(2, (self, that) => ({
  _tag: OP_AND_THEN,
  first: self,
  second: that
}));
var patch6 = /* @__PURE__ */ dual(3, (self, fiberId2, oldValue) => {
  let fiberRefs2 = oldValue;
  let patches = of(self);
  while (isNonEmptyReadonlyArray(patches)) {
    const head4 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head4._tag) {
      case OP_EMPTY2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head4.fiberRef,
          value: head4.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs2 = delete_(fiberRefs2, head4.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value3 = getOrDefault(fiberRefs2, head4.fiberRef);
        fiberRefs2 = updateAs(fiberRefs2, {
          fiberId: fiberId2,
          fiberRef: head4.fiberRef,
          value: head4.fiberRef.patch(head4.patch)(value3)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN: {
        patches = prepend(head4.first)(prepend(head4.second)(tail));
        break;
      }
    }
  }
  return fiberRefs2;
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/label.js
var MetricLabelSymbolKey = "effect/MetricLabel";
var MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
var MetricLabelImpl = class {
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  _hash;
  constructor(key, value3) {
    this.key = key;
    this.value = value3;
    this._hash = string(MetricLabelSymbolKey + this.key + this.value);
  }
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make24 = (key, value3) => {
  return new MetricLabelImpl(key, value3);
};
var isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/executionStrategy.js
var OP_SEQUENTIAL2 = "Sequential";
var OP_PARALLEL2 = "Parallel";
var OP_PARALLEL_N = "ParallelN";
var sequential2 = {
  _tag: OP_SEQUENTIAL2
};
var parallel2 = {
  _tag: OP_PARALLEL2
};
var parallelN = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism
});
var isSequential = (self) => self._tag === OP_SEQUENTIAL2;
var isParallel = (self) => self._tag === OP_PARALLEL2;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/ExecutionStrategy.js
var sequential3 = sequential2;
var parallel3 = parallel2;
var parallelN2 = parallelN;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/FiberRefsPatch.js
var diff6 = diff5;
var patch7 = patch6;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberStatus.js
var FiberStatusSymbolKey = "effect/FiberStatus";
var FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
var OP_DONE = "Done";
var OP_RUNNING = "Running";
var OP_SUSPENDED = "Suspended";
var DoneHash = /* @__PURE__ */ string(`${FiberStatusSymbolKey}-${OP_DONE}`);
var Done = class {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol]() {
    return DoneHash;
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
};
var Running = class {
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags2) {
    this.runtimeFlags = runtimeFlags2;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
};
var Suspended = class {
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags2, blockingOn) {
    this.runtimeFlags = runtimeFlags2;
    this.blockingOn = blockingOn;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), combine(hash(this.blockingOn)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals(this.blockingOn, that.blockingOn);
  }
};
var done2 = /* @__PURE__ */ new Done();
var running = (runtimeFlags2) => new Running(runtimeFlags2);
var suspended = (runtimeFlags2, blockingOn) => new Suspended(runtimeFlags2, blockingOn);
var isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
var isDone = (self) => self._tag === OP_DONE;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/FiberStatus.js
var done3 = done2;
var running2 = running;
var suspended2 = suspended;
var isDone2 = isDone;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Micro.js
var TypeId12 = /* @__PURE__ */ Symbol.for("effect/Micro");
var MicroExitTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit");
var MicroCauseTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause");
var microCauseVariance = {
  _E: identity
};
var MicroCauseImpl = class extends globalThis.Error {
  _tag;
  traces;
  [MicroCauseTypeId];
  constructor(_tag, originalError, traces) {
    const causeName = `MicroCause.${_tag}`;
    let name;
    let message;
    let stack;
    if (originalError instanceof globalThis.Error) {
      name = `(${causeName}) ${originalError.name}`;
      message = originalError.message;
      const messageLines = message.split("\n").length;
      stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
    } else {
      name = causeName;
      message = toStringUnknown(originalError, 0);
      stack = `${name}: ${message}`;
    }
    if (traces.length > 0) {
      stack += `
    ${traces.join("\n    ")}`;
    }
    super(message);
    this._tag = _tag;
    this.traces = traces;
    this[MicroCauseTypeId] = microCauseVariance;
    this.name = name;
    this.stack = stack;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [NodeInspectSymbol]() {
    return this.stack;
  }
};
var Die = class extends MicroCauseImpl {
  defect;
  constructor(defect, traces = []) {
    super("Die", defect, traces);
    this.defect = defect;
  }
};
var causeDie = (defect, traces = []) => new Die(defect, traces);
var Interrupt = class extends MicroCauseImpl {
  constructor(traces = []) {
    super("Interrupt", "interrupted", traces);
  }
};
var causeInterrupt = (traces = []) => new Interrupt(traces);
var causeIsInterrupt = (self) => self._tag === "Interrupt";
var MicroFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber");
var fiberVariance = {
  _A: identity,
  _E: identity
};
var MicroFiberImpl = class {
  context;
  interruptible;
  [MicroFiberTypeId];
  _stack = [];
  _observers = [];
  _exit;
  _children;
  currentOpCount = 0;
  constructor(context3, interruptible4 = true) {
    this.context = context3;
    this.interruptible = interruptible4;
    this[MicroFiberTypeId] = fiberVariance;
  }
  getRef(ref) {
    return unsafeGetReference(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    this._observers.push(cb);
    return () => {
      const index = this._observers.indexOf(cb);
      if (index >= 0) {
        this._observers.splice(index, 1);
      }
    };
  }
  _interrupted = false;
  unsafeInterrupt() {
    if (this._exit) {
      return;
    }
    this._interrupted = true;
    if (this.interruptible) {
      this.evaluate(exitInterrupt2);
    }
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(effect) {
    if (this._exit) {
      return;
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit3 = this.runLoop(effect);
    if (exit3 === Yield) {
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap8(interruptChildren, () => exit3));
    }
    this._exit = exit3;
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i](exit3);
    }
    this._observers.length = 0;
  }
  runLoop(effect) {
    let yielding = false;
    let current = effect;
    this.currentOpCount = 0;
    try {
      while (true) {
        this.currentOpCount++;
        if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
          yielding = true;
          const prev = current;
          current = flatMap8(yieldNow2, () => prev);
        }
        current = current[evaluate](this);
        if (current === Yield) {
          const yielded = this._yielded;
          if (MicroExitTypeId in yielded) {
            this._yielded = void 0;
            return yielded;
          }
          return Yield;
        }
      }
    } catch (error) {
      if (!hasProperty(current, evaluate)) {
        return exitDie2(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
      }
      return exitDie2(error);
    }
  }
  getCont(symbol3) {
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const cont = op[ensureCont] && op[ensureCont](this);
      if (cont) return {
        [symbol3]: cont
      };
      if (op[symbol3]) return op;
    }
  }
  // cancel the yielded operation, or for the yielded exit value
  _yielded = void 0;
  yieldWith(value3) {
    this._yielded = value3;
    return Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set();
  }
};
var fiberMiddleware = /* @__PURE__ */ globalValue("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
}));
var fiberInterruptAll = (fibers) => suspend2(() => {
  for (const fiber of fibers) fiber.unsafeInterrupt();
  const iter = fibers[Symbol.iterator]();
  const wait = suspend2(() => {
    let result = iter.next();
    while (!result.done) {
      if (result.value.unsafePoll()) {
        result = iter.next();
        continue;
      }
      const fiber = result.value;
      return async((resume2) => {
        fiber.addObserver((_) => {
          resume2(wait);
        });
      });
    }
    return exitVoid2;
  });
  return wait;
});
var identifier = /* @__PURE__ */ Symbol.for("effect/Micro/identifier");
var args = /* @__PURE__ */ Symbol.for("effect/Micro/args");
var evaluate = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate");
var successCont = /* @__PURE__ */ Symbol.for("effect/Micro/successCont");
var failureCont = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont");
var ensureCont = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont");
var Yield = /* @__PURE__ */ Symbol.for("effect/Micro/Yield");
var microVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
var MicroProto = {
  ...EffectPrototype2,
  _op: "Micro",
  [TypeId12]: microVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  },
  toString() {
    return format(this);
  },
  [NodeInspectSymbol]() {
    return format(this);
  }
};
function defaultEvaluate(_fiber) {
  return exitDie2(`Micro.evaluate: Not implemented`);
}
var makePrimitiveProto = (options) => ({
  ...MicroProto,
  [identifier]: options.op,
  [evaluate]: options.eval ?? defaultEvaluate,
  [successCont]: options.contA,
  [failureCont]: options.contE,
  [ensureCont]: options.ensure
});
var makePrimitive = (options) => {
  const Proto2 = makePrimitiveProto(options);
  return function() {
    const self = Object.create(Proto2);
    self[args] = options.single === false ? arguments : arguments[0];
    return self;
  };
};
var makeExit = (options) => {
  const Proto2 = {
    ...makePrimitiveProto(options),
    [MicroExitTypeId]: MicroExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isMicroExit(that) && that._tag === options.op && equals(this[args], that[args]);
    },
    [symbol]() {
      return cached(this, combine(string(options.op))(hash(this[args])));
    }
  };
  return function(value3) {
    const self = Object.create(Proto2);
    self[args] = value3;
    self[successCont] = void 0;
    self[failureCont] = void 0;
    self[ensureCont] = void 0;
    return self;
  };
};
var succeed3 = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  eval(fiber) {
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var failCause3 = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  eval(fiber) {
    let cont = fiber.getCont(failureCont);
    while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) {
      cont = fiber.getCont(failureCont);
    }
    return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var sync2 = /* @__PURE__ */ makePrimitive({
  op: "Sync",
  eval(fiber) {
    const value3 = this[args]();
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](value3, fiber) : fiber.yieldWith(exitSucceed2(value3));
  }
});
var suspend2 = /* @__PURE__ */ makePrimitive({
  op: "Suspend",
  eval(_fiber) {
    return this[args]();
  }
});
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  eval(fiber) {
    let resumed = false;
    fiber.getRef(CurrentScheduler).scheduleTask(() => {
      if (resumed) return;
      fiber.evaluate(exitVoid2);
    }, this[args] ?? 0);
    return fiber.yieldWith(() => {
      resumed = true;
    });
  }
});
var yieldNow2 = /* @__PURE__ */ yieldNowWith(0);
var void_3 = /* @__PURE__ */ succeed3(void 0);
var withMicroFiber = /* @__PURE__ */ makePrimitive({
  op: "WithMicroFiber",
  eval(fiber) {
    return this[args](fiber);
  }
});
var asyncOptions = /* @__PURE__ */ makePrimitive({
  op: "Async",
  single: false,
  eval(fiber) {
    const register = this[args][0];
    let resumed = false;
    let yielded = false;
    const controller = this[args][1] ? new AbortController() : void 0;
    const onCancel = register((effect) => {
      if (resumed) return;
      resumed = true;
      if (yielded) {
        fiber.evaluate(effect);
      } else {
        yielded = effect;
      }
    }, controller?.signal);
    if (yielded !== false) return yielded;
    yielded = true;
    fiber._yielded = () => {
      resumed = true;
    };
    if (controller === void 0 && onCancel === void 0) {
      return Yield;
    }
    fiber._stack.push(asyncFinalizer(() => {
      resumed = true;
      controller?.abort();
      return onCancel ?? exitVoid2;
    }));
    return Yield;
  }
});
var asyncFinalizer = /* @__PURE__ */ makePrimitive({
  op: "AsyncFinalizer",
  ensure(fiber) {
    if (fiber.interruptible) {
      fiber.interruptible = false;
      fiber._stack.push(setInterruptible(true));
    }
  },
  contE(cause, _fiber) {
    return causeIsInterrupt(cause) ? flatMap8(this[args](), () => failCause3(cause)) : failCause3(cause);
  }
});
var async = (register) => asyncOptions(register, register.length >= 2);
var as2 = /* @__PURE__ */ dual(2, (self, value3) => map10(self, (_) => value3));
var exit2 = (self) => matchCause2(self, {
  onFailure: exitFailCause2,
  onSuccess: exitSucceed2
});
var flatMap8 = /* @__PURE__ */ dual(2, (self, f) => {
  const onSuccess = Object.create(OnSuccessProto);
  onSuccess[args] = self;
  onSuccess[successCont] = f;
  return onSuccess;
});
var OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var map10 = /* @__PURE__ */ dual(2, (self, f) => flatMap8(self, (a) => succeed3(f(a))));
var isMicroExit = (u) => hasProperty(u, MicroExitTypeId);
var exitSucceed2 = succeed3;
var exitFailCause2 = failCause3;
var exitInterrupt2 = /* @__PURE__ */ exitFailCause2(/* @__PURE__ */ causeInterrupt());
var exitDie2 = (defect) => exitFailCause2(causeDie(defect));
var exitVoid2 = /* @__PURE__ */ exitSucceed2(void 0);
var exitVoidAll = (exits) => {
  for (const exit3 of exits) {
    if (exit3._tag === "Failure") {
      return exit3;
    }
  }
  return exitVoid2;
};
var setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
var MicroSchedulerDefault = class {
  tasks = [];
  running = false;
  /**
   * @since 3.5.9
   */
  scheduleTask(task, _priority) {
    this.tasks.push(task);
    if (!this.running) {
      this.running = true;
      setImmediate(this.afterScheduled);
    }
  }
  /**
   * @since 3.5.9
   */
  afterScheduled = () => {
    this.running = false;
    this.runTasks();
  };
  /**
   * @since 3.5.9
   */
  runTasks() {
    const tasks = this.tasks;
    this.tasks = [];
    for (let i = 0, len = tasks.length; i < len; i++) {
      tasks[i]();
    }
  }
  /**
   * @since 3.5.9
   */
  shouldYield(fiber) {
    return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    while (this.tasks.length > 0) {
      this.runTasks();
    }
  }
};
var updateContext = /* @__PURE__ */ dual(2, (self, f) => withMicroFiber((fiber) => {
  const prev = fiber.context;
  fiber.context = f(prev);
  return onExit2(self, () => {
    fiber.context = prev;
    return void_3;
  });
}));
var provideContext2 = /* @__PURE__ */ dual(2, (self, provided) => updateContext(self, merge3(provided)));
var MaxOpsBeforeYield = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
};
var CurrentConcurrency = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentConcurrency", {
  defaultValue: () => "unbounded"
})) {
};
var CurrentScheduler = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentScheduler", {
  defaultValue: () => new MicroSchedulerDefault()
})) {
};
var matchCauseEffect2 = /* @__PURE__ */ dual(2, (self, options) => {
  const primitive2 = Object.create(OnSuccessAndFailureProto);
  primitive2[args] = self;
  primitive2[successCont] = options.onSuccess;
  primitive2[failureCont] = options.onFailure;
  return primitive2;
});
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var matchCause2 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect2(self, {
  onFailure: (cause) => sync2(() => options.onFailure(cause)),
  onSuccess: (value3) => sync2(() => options.onSuccess(value3))
}));
var MicroScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroScope");
var MicroScopeImpl = class _MicroScopeImpl {
  [MicroScopeTypeId];
  state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Set()
  };
  constructor() {
    this[MicroScopeTypeId] = MicroScopeTypeId;
  }
  unsafeAddFinalizer(finalizer) {
    if (this.state._tag === "Open") {
      this.state.finalizers.add(finalizer);
    }
  }
  addFinalizer(finalizer) {
    return suspend2(() => {
      if (this.state._tag === "Open") {
        this.state.finalizers.add(finalizer);
        return void_3;
      }
      return finalizer(this.state.exit);
    });
  }
  unsafeRemoveFinalizer(finalizer) {
    if (this.state._tag === "Open") {
      this.state.finalizers.delete(finalizer);
    }
  }
  close(microExit) {
    return suspend2(() => {
      if (this.state._tag === "Open") {
        const finalizers = Array.from(this.state.finalizers).reverse();
        this.state = {
          _tag: "Closed",
          exit: microExit
        };
        return flatMap8(forEach3(finalizers, (finalizer) => exit2(finalizer(microExit))), exitVoidAll);
      }
      return void_3;
    });
  }
  get fork() {
    return sync2(() => {
      const newScope = new _MicroScopeImpl();
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      function fin(exit3) {
        return newScope.close(exit3);
      }
      this.state.finalizers.add(fin);
      newScope.unsafeAddFinalizer((_) => sync2(() => this.unsafeRemoveFinalizer(fin)));
      return newScope;
    });
  }
};
var onExit2 = /* @__PURE__ */ dual(2, (self, f) => uninterruptibleMask2((restore) => matchCauseEffect2(restore(self), {
  onFailure: (cause) => flatMap8(f(exitFailCause2(cause)), () => failCause3(cause)),
  onSuccess: (a) => flatMap8(f(exitSucceed2(a)), () => succeed3(a))
})));
var setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  ensure(fiber) {
    fiber.interruptible = this[args];
    if (fiber._interrupted && fiber.interruptible) {
      return () => exitInterrupt2;
    }
  }
});
var interruptible3 = (self) => withMicroFiber((fiber) => {
  if (fiber.interruptible) return self;
  fiber.interruptible = true;
  fiber._stack.push(setInterruptible(false));
  if (fiber._interrupted) return exitInterrupt2;
  return self;
});
var uninterruptibleMask2 = (f) => withMicroFiber((fiber) => {
  if (!fiber.interruptible) return f(identity);
  fiber.interruptible = false;
  fiber._stack.push(setInterruptible(true));
  return f(interruptible3);
});
var whileLoop2 = /* @__PURE__ */ makePrimitive({
  op: "While",
  contA(value3, fiber) {
    this[args].step(value3);
    if (this[args].while()) {
      fiber._stack.push(this);
      return this[args].body();
    }
    return exitVoid2;
  },
  eval(fiber) {
    if (this[args].while()) {
      fiber._stack.push(this);
      return this[args].body();
    }
    return exitVoid2;
  }
});
var forEach3 = (iterable, f, options) => withMicroFiber((parent) => {
  const concurrencyOption = options?.concurrency === "inherit" ? parent.getRef(CurrentConcurrency) : options?.concurrency ?? 1;
  const concurrency = concurrencyOption === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrencyOption);
  const items = fromIterable(iterable);
  let length2 = items.length;
  if (length2 === 0) {
    return options?.discard ? void_3 : succeed3([]);
  }
  const out = options?.discard ? void 0 : new Array(length2);
  let index = 0;
  if (concurrency === 1) {
    return as2(whileLoop2({
      while: () => index < items.length,
      body: () => f(items[index], index),
      step: out ? (b) => out[index++] = b : (_) => index++
    }), out);
  }
  return async((resume2) => {
    const fibers = /* @__PURE__ */ new Set();
    let result = void 0;
    let inProgress = 0;
    let doneCount = 0;
    let pumping = false;
    let interrupted = false;
    function pump() {
      pumping = true;
      while (inProgress < concurrency && index < length2) {
        const currentIndex = index;
        const item = items[currentIndex];
        index++;
        inProgress++;
        try {
          const child = unsafeFork(parent, f(item, currentIndex), true, true);
          fibers.add(child);
          child.addObserver((exit3) => {
            fibers.delete(child);
            if (interrupted) {
              return;
            } else if (exit3._tag === "Failure") {
              if (result === void 0) {
                result = exit3;
                length2 = index;
                fibers.forEach((fiber) => fiber.unsafeInterrupt());
              }
            } else if (out !== void 0) {
              out[currentIndex] = exit3.value;
            }
            doneCount++;
            inProgress--;
            if (doneCount === length2) {
              resume2(result ?? succeed3(out));
            } else if (!pumping && inProgress < concurrency) {
              pump();
            }
          });
        } catch (err2) {
          result = exitDie2(err2);
          length2 = index;
          fibers.forEach((fiber) => fiber.unsafeInterrupt());
        }
      }
      pumping = false;
    }
    pump();
    return suspend2(() => {
      interrupted = true;
      index = length2;
      return fiberInterruptAll(fibers);
    });
  });
});
var unsafeFork = (parent, effect, immediate = false, daemon = false) => {
  const child = new MicroFiberImpl(parent.context, parent.interruptible);
  if (!daemon) {
    parent.children().add(child);
    child.addObserver(() => parent.children().delete(child));
  }
  if (immediate) {
    child.evaluate(effect);
  } else {
    parent.getRef(CurrentScheduler).scheduleTask(() => child.evaluate(effect), 0);
  }
  return child;
};
var runFork = (effect, options) => {
  const fiber = new MicroFiberImpl(CurrentScheduler.context(options?.scheduler ?? new MicroSchedulerDefault()));
  fiber.evaluate(effect);
  if (options?.signal) {
    if (options.signal.aborted) {
      fiber.unsafeInterrupt();
    } else {
      const abort = () => fiber.unsafeInterrupt();
      options.signal.addEventListener("abort", abort, {
        once: true
      });
      fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
    }
  }
  return fiber;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Scheduler.js
var PriorityBuckets = class {
  /**
   * @since 2.0.0
   */
  buckets = [];
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    const length2 = this.buckets.length;
    let bucket = void 0;
    let index = 0;
    for (; index < length2; index++) {
      if (this.buckets[index][0] <= priority) {
        bucket = this.buckets[index];
      } else {
        break;
      }
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index === length2) {
      this.buckets.push([priority, [task]]);
    } else {
      this.buckets.splice(index, 0, [priority, [task]]);
    }
  }
};
var MixedScheduler = class {
  maxNextTickBeforeTimer;
  /**
   * @since 2.0.0
   */
  running = false;
  /**
   * @since 2.0.0
   */
  tasks = /* @__PURE__ */ new PriorityBuckets();
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  /**
   * @since 2.0.0
   */
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
};
var defaultScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
var SyncScheduler = class {
  /**
   * @since 2.0.0
   */
  tasks = /* @__PURE__ */ new PriorityBuckets();
  /**
   * @since 2.0.0
   */
  deferred = false;
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    if (this.deferred) {
      defaultScheduler.scheduleTask(task, priority);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks) {
        for (let i = 0; i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
};
var currentScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/completedRequestMap.js
var currentRequestMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/concurrency.js
var match8 = (concurrency, sequential5, unbounded, bounded) => {
  switch (concurrency) {
    case void 0:
      return sequential5();
    case "unbounded":
      return unbounded();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" ? unbounded() : concurrency2 > 1 ? bounded(concurrency2) : sequential5());
    default:
      return concurrency > 1 ? bounded(concurrency) : sequential5();
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberMessage.js
var OP_INTERRUPT_SIGNAL = "InterruptSignal";
var OP_STATEFUL = "Stateful";
var OP_RESUME = "Resume";
var OP_YIELD_NOW = "YieldNow";
var interruptSignal = (cause) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause
});
var stateful = (onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
});
var resume = (effect) => ({
  _tag: OP_RESUME,
  effect
});
var yieldNow3 = () => ({
  _tag: OP_YIELD_NOW
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberScope.js
var FiberScopeSymbolKey = "effect/FiberScope";
var FiberScopeTypeId = /* @__PURE__ */ Symbol.for(FiberScopeSymbolKey);
var Global = class {
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none4;
  roots = /* @__PURE__ */ new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
};
var Local = class {
  fiberId;
  parent;
  [FiberScopeTypeId] = FiberScopeTypeId;
  constructor(fiberId2, parent) {
    this.fiberId = fiberId2;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
};
var unsafeMake4 = (fiber) => {
  return new Local(fiber.id(), fiber);
};
var globalScope = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiber.js
var FiberSymbolKey = "effect/Fiber";
var FiberTypeId = /* @__PURE__ */ Symbol.for(FiberSymbolKey);
var fiberVariance2 = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var fiberProto = {
  [FiberTypeId]: fiberVariance2,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var RuntimeFiberSymbolKey = "effect/Fiber";
var RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for(RuntimeFiberSymbolKey);
var join2 = (self) => zipLeft(flatten4(self.await), self.inheritAll);
var _never = {
  ...CommitPrototype,
  commit() {
    return join2(this);
  },
  ...fiberProto,
  id: () => none4,
  await: never,
  children: /* @__PURE__ */ succeed([]),
  inheritAll: never,
  poll: /* @__PURE__ */ succeed(/* @__PURE__ */ none2()),
  interruptAsFork: () => never
};
var currentFiberURI = "effect/FiberCurrent";

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/logger.js
var LoggerSymbolKey = "effect/Logger";
var LoggerTypeId = /* @__PURE__ */ Symbol.for(LoggerSymbolKey);
var loggerVariance = {
  /* c8 ignore next */
  _Message: (_) => _,
  /* c8 ignore next */
  _Output: (_) => _
};
var makeLogger = (log) => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var none6 = {
  [LoggerTypeId]: loggerVariance,
  log: constVoid,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var textOnly = /^[^\s"=]*$/;
var format4 = (quoteValue, whitespace) => ({
  annotations: annotations3,
  cause,
  date: date3,
  fiberId: fiberId2,
  logLevel: logLevel2,
  message,
  spans
}) => {
  const formatValue = (value3) => value3.match(textOnly) ? value3 : quoteValue(value3);
  const format7 = (label, value3) => `${formatLabel(label)}=${formatValue(value3)}`;
  const append3 = (label, value3) => " " + format7(label, value3);
  let out = format7("timestamp", date3.toISOString());
  out += append3("level", logLevel2.label);
  out += append3("fiber", threadName(fiberId2));
  const messages = ensure(message);
  for (let i = 0; i < messages.length; i++) {
    out += append3("message", toStringUnknown(messages[i], whitespace));
  }
  if (!isEmptyType(cause)) {
    out += append3("cause", pretty(cause, {
      renderErrorCause: true
    }));
  }
  for (const span2 of spans) {
    out += " " + render(date3.getTime())(span2);
  }
  for (const [label, value3] of annotations3) {
    out += append3(label, toStringUnknown(value3, whitespace));
  }
  return out;
};
var escapeDoubleQuotes = (s) => `"${s.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
var stringLogger = /* @__PURE__ */ makeLogger(/* @__PURE__ */ format4(escapeDoubleQuotes));
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
};
var logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warning: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};
var hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
var processStdoutIsTTY = hasProcessStdout && process.stdout.isTTY === true;
var hasProcessStdoutOrDeno = hasProcessStdout || "Deno" in globalThis;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/boundaries.js
var MetricBoundariesSymbolKey = "effect/MetricBoundaries";
var MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
var MetricBoundariesImpl = class {
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values4) {
    this.values = values4;
    this._hash = pipe(string(MetricBoundariesSymbolKey), combine(array2(this.values)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricBoundaries(u) && equals(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
var fromIterable8 = (iterable) => {
  const values4 = pipe(iterable, appendAll(of2(Number.POSITIVE_INFINITY)), dedupe);
  return new MetricBoundariesImpl(values4);
};
var exponential = (options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromIterable8);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/keyType.js
var MetricKeyTypeSymbolKey = "effect/MetricKeyType";
var MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for(MetricKeyTypeSymbolKey);
var CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
var CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
var FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
var FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for(FrequencyKeyTypeSymbolKey);
var GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
var GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for(GaugeKeyTypeSymbolKey);
var HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
var HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
var SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
var SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for(SummaryKeyTypeSymbolKey);
var metricKeyTypeVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var CounterKeyType = class {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint2) {
    this.incremental = incremental;
    this.bigint = bigint2;
    this._hash = string(CounterKeyTypeSymbolKey);
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FrequencyKeyTypeHash = /* @__PURE__ */ string(FrequencyKeyTypeSymbolKey);
var FrequencyKeyType = class {
  preregisteredWords;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [FrequencyKeyTypeTypeId] = FrequencyKeyTypeTypeId;
  constructor(preregisteredWords) {
    this.preregisteredWords = preregisteredWords;
  }
  [symbol]() {
    return FrequencyKeyTypeHash;
  }
  [symbol2](that) {
    return isFrequencyKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeKeyTypeHash = /* @__PURE__ */ string(GaugeKeyTypeSymbolKey);
var GaugeKeyType = class {
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [GaugeKeyTypeTypeId] = GaugeKeyTypeTypeId;
  constructor(bigint2) {
    this.bigint = bigint2;
  }
  [symbol]() {
    return GaugeKeyTypeHash;
  }
  [symbol2](that) {
    return isGaugeKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramKeyType = class {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
    this._hash = pipe(string(HistogramKeyTypeSymbolKey), combine(hash(this.boundaries)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryKeyType = class {
  maxAge;
  maxSize;
  error;
  quantiles;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [SummaryKeyTypeTypeId] = SummaryKeyTypeTypeId;
  constructor(maxAge, maxSize, error, quantiles) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
    this.error = error;
    this.quantiles = quantiles;
    this._hash = pipe(string(SummaryKeyTypeSymbolKey), combine(hash(this.maxAge)), combine(hash(this.maxSize)), combine(hash(this.error)), combine(array2(this.quantiles)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isSummaryKey(that) && equals(this.maxAge, that.maxAge) && this.maxSize === that.maxSize && this.error === that.error && equals(this.quantiles, that.quantiles);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter = (options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
var histogram = (boundaries) => {
  return new HistogramKeyType(boundaries);
};
var isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
var isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
var isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
var isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
var isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/key.js
var MetricKeySymbolKey = "effect/MetricKey";
var MetricKeyTypeId = /* @__PURE__ */ Symbol.for(MetricKeySymbolKey);
var metricKeyVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var arrayEquivilence = /* @__PURE__ */ getEquivalence3(equals);
var MetricKeyImpl = class {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = []) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe(string(this.name + this.description), combine(hash(this.keyType)), combine(array2(this.tags)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricKey(u) && this.name === u.name && equals(this.keyType, u.keyType) && equals(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
var counter2 = (name, options) => new MetricKeyImpl(name, counter(options), fromNullable2(options?.description));
var histogram2 = (name, boundaries, description) => new MetricKeyImpl(name, histogram(boundaries), fromNullable2(description));
var taggedWithLabels = /* @__PURE__ */ dual(2, (self, extraTags) => extraTags.length === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, union(self.tags, extraTags)));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/state.js
var MetricStateSymbolKey = "effect/MetricState";
var MetricStateTypeId = /* @__PURE__ */ Symbol.for(MetricStateSymbolKey);
var CounterStateSymbolKey = "effect/MetricState/Counter";
var CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
var FrequencyStateSymbolKey = "effect/MetricState/Frequency";
var FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
var GaugeStateSymbolKey = "effect/MetricState/Gauge";
var GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
var HistogramStateSymbolKey = "effect/MetricState/Histogram";
var HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
var SummaryStateSymbolKey = "effect/MetricState/Summary";
var SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
var metricStateVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var CounterState = class {
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count) {
    this.count = count;
  }
  [symbol]() {
    return pipe(hash(CounterStateSymbolKey), combine(hash(this.count)), cached(this));
  }
  [symbol2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var arrayEquals = /* @__PURE__ */ getEquivalence3(equals);
var FrequencyState = class {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  _hash;
  [symbol]() {
    return pipe(string(FrequencyStateSymbolKey), combine(array2(fromIterable(this.occurrences.entries()))), cached(this));
  }
  [symbol2](that) {
    return isFrequencyState(that) && arrayEquals(fromIterable(this.occurrences.entries()), fromIterable(that.occurrences.entries()));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeState = class {
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value3) {
    this.value = value3;
  }
  [symbol]() {
    return pipe(hash(GaugeStateSymbolKey), combine(hash(this.value)), cached(this));
  }
  [symbol2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramState = class {
  buckets;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [HistogramStateTypeId] = HistogramStateTypeId;
  constructor(buckets, count, min3, max3, sum) {
    this.buckets = buckets;
    this.count = count;
    this.min = min3;
    this.max = max3;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(HistogramStateSymbolKey), combine(hash(this.buckets)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isHistogramState(that) && equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryState = class {
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [SummaryStateTypeId] = SummaryStateTypeId;
  constructor(error, quantiles, count, min3, max3, sum) {
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min3;
    this.max = max3;
    this.sum = sum;
  }
  [symbol]() {
    return pipe(hash(SummaryStateSymbolKey), combine(hash(this.error)), combine(hash(this.quantiles)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isSummaryState(that) && this.error === that.error && equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter3 = (count) => new CounterState(count);
var frequency2 = (occurrences) => {
  return new FrequencyState(occurrences);
};
var gauge2 = (count) => new GaugeState(count);
var histogram3 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
var summary2 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
var isCounterState = (u) => hasProperty(u, CounterStateTypeId);
var isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
var isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
var isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
var isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/hook.js
var MetricHookSymbolKey = "effect/MetricHook";
var MetricHookTypeId = /* @__PURE__ */ Symbol.for(MetricHookSymbolKey);
var metricHookVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var make25 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var bigint03 = /* @__PURE__ */ BigInt(0);
var counter4 = (key) => {
  let sum = key.keyType.bigint ? bigint03 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value3) => value3 >= bigint03 : (value3) => value3 >= 0 : (_value) => true;
  const update3 = (value3) => {
    if (canUpdate(value3)) {
      sum = sum + value3;
    }
  };
  return make25({
    get: () => counter3(sum),
    update: update3,
    modify: update3
  });
};
var frequency3 = (key) => {
  const values4 = /* @__PURE__ */ new Map();
  for (const word of key.keyType.preregisteredWords) {
    values4.set(word, 0);
  }
  const update3 = (word) => {
    const slotCount = values4.get(word) ?? 0;
    values4.set(word, slotCount + 1);
  };
  return make25({
    get: () => frequency2(values4),
    update: update3,
    modify: update3
  });
};
var gauge3 = (_key, startAt) => {
  let value3 = startAt;
  return make25({
    get: () => gauge2(value3),
    update: (v) => {
      value3 = v;
    },
    modify: (v) => {
      value3 = value3 + v;
    }
  });
};
var histogram4 = (key) => {
  const bounds = key.keyType.boundaries.values;
  const size7 = bounds.length;
  const values4 = new Uint32Array(size7 + 1);
  const boundaries = new Float32Array(size7);
  let count = 0;
  let sum = 0;
  let min3 = Number.MAX_VALUE;
  let max3 = Number.MIN_VALUE;
  pipe(bounds, sort(Order), map3((n, i) => {
    boundaries[i] = n;
  }));
  const update3 = (value3) => {
    let from = 0;
    let to = size7;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value3 <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value3 <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values4[from] = values4[from] + 1;
    count = count + 1;
    sum = sum + value3;
    if (value3 < min3) {
      min3 = value3;
    }
    if (value3 > max3) {
      max3 = value3;
    }
  };
  const getBuckets = () => {
    const builder = allocate(size7);
    let cumulated = 0;
    for (let i = 0; i < size7; i++) {
      const boundary = boundaries[i];
      const value3 = values4[i];
      cumulated = cumulated + value3;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  };
  return make25({
    get: () => histogram3({
      buckets: getBuckets(),
      count,
      min: min3,
      max: max3,
      sum
    }),
    update: update3,
    modify: update3
  });
};
var summary3 = (key) => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = pipe(quantiles, sort(Order));
  const values4 = allocate(maxSize);
  let head4 = 0;
  let count = 0;
  let sum = 0;
  let min3 = 0;
  let max3 = 0;
  const snapshot = (now2) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values4[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now2 - t);
        if (greaterThanOrEqualTo3(age, zero2) && lessThanOrEqualTo3(age, maxAge)) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, sort(builder, Order));
  };
  const observe = (value3, timestamp) => {
    if (maxSize > 0) {
      head4 = head4 + 1;
      const target = head4 % maxSize;
      values4[target] = [timestamp, value3];
    }
    min3 = count === 0 ? value3 : Math.min(min3, value3);
    max3 = count === 0 ? value3 : Math.max(max3, value3);
    count = count + 1;
    sum = sum + value3;
  };
  return make25({
    get: () => summary2({
      error,
      quantiles: snapshot(Date.now()),
      count,
      min: min3,
      max: max3,
      sum
    }),
    update: ([value3, timestamp]) => observe(value3, timestamp),
    modify: ([value3, timestamp]) => observe(value3, timestamp)
  });
};
var calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty();
  }
  const head4 = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(error, sampleCount, none2(), 0, head4, sortedSamples);
  const resolved = of(resolvedHead);
  tail.forEach((quantile) => {
    resolved.push(resolveQuantile(error, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
  });
  return map3(resolved, (rq) => [rq.quantile, rq.value]);
};
var resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none2(),
        consumed: consumed_1,
        rest: []
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some2(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: []
      };
    }
    const headValue = headNonEmpty(rest_1);
    const sameHead = span(rest_1, (n) => n === headValue);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      const valueToReturn = isNone2(current_1) ? some2(headValue) : current_1;
      return {
        quantile: quantile_1,
        value: valueToReturn,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/pair.js
var MetricPairSymbolKey = "effect/MetricPair";
var MetricPairTypeId = /* @__PURE__ */ Symbol.for(MetricPairSymbolKey);
var metricPairVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var unsafeMake5 = (metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments(this, arguments);
    }
  };
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric/registry.js
var MetricRegistrySymbolKey = "effect/MetricRegistry";
var MetricRegistryTypeId = /* @__PURE__ */ Symbol.for(MetricRegistrySymbolKey);
var MetricRegistryImpl = class {
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = /* @__PURE__ */ empty15();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake5(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe(this.map, get7(key), getOrUndefined2);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value3 = pipe(this.map, get7(key), getOrUndefined2);
    if (value3 == null) {
      const counter6 = counter4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, counter6));
      }
      value3 = counter6;
    }
    return value3;
  }
  getFrequency(key) {
    let value3 = pipe(this.map, get7(key), getOrUndefined2);
    if (value3 == null) {
      const frequency5 = frequency3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, frequency5));
      }
      value3 = frequency5;
    }
    return value3;
  }
  getGauge(key) {
    let value3 = pipe(this.map, get7(key), getOrUndefined2);
    if (value3 == null) {
      const gauge5 = gauge3(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, gauge5));
      }
      value3 = gauge5;
    }
    return value3;
  }
  getHistogram(key) {
    let value3 = pipe(this.map, get7(key), getOrUndefined2);
    if (value3 == null) {
      const histogram6 = histogram4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, histogram6));
      }
      value3 = histogram6;
    }
    return value3;
  }
  getSummary(key) {
    let value3 = pipe(this.map, get7(key), getOrUndefined2);
    if (value3 == null) {
      const summary5 = summary3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, summary5));
      }
      value3 = summary5;
    }
    return value3;
  }
};
var make26 = () => {
  return new MetricRegistryImpl();
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/metric.js
var MetricSymbolKey = "effect/Metric";
var MetricTypeId = /* @__PURE__ */ Symbol.for(MetricSymbolKey);
var metricVariance = {
  /* c8 ignore next */
  _Type: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var globalMetricRegistry = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make26());
var make27 = function(keyType, unsafeUpdate, unsafeValue, unsafeModify) {
  const metric = Object.assign((effect) => tap(effect, (a) => update2(metric, a)), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    unsafeModify,
    register() {
      this.unsafeValue([]);
      return this;
    },
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
};
var counter5 = (name, options) => fromMetricKey(counter2(name, options));
var fromMetricKey = (key) => {
  let untaggedHook;
  const hookCache = /* @__PURE__ */ new WeakMap();
  const hook = (extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== void 0) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook2 = hookCache.get(extraTags);
    if (hook2 !== void 0) {
      return hook2;
    }
    hook2 = globalMetricRegistry.get(taggedWithLabels(key, extraTags));
    hookCache.set(extraTags, hook2);
    return hook2;
  };
  return make27(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get(), (input, extraTags) => hook(extraTags).modify(input));
};
var histogram5 = (name, boundaries, description) => fromMetricKey(histogram2(name, boundaries, description));
var tagged = /* @__PURE__ */ dual(3, (self, key, value3) => taggedWithLabels2(self, [make24(key, value3)]));
var taggedWithLabels2 = /* @__PURE__ */ dual(2, (self, extraTags) => {
  return make27(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, union(extraTags, extraTags1)), (extraTags1) => self.unsafeValue(union(extraTags, extraTags1)), (input, extraTags1) => self.unsafeModify(input, union(extraTags, extraTags1)));
});
var update2 = /* @__PURE__ */ dual(2, (self, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync(() => self.unsafeUpdate(input, tags))));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/request.js
var RequestSymbolKey = "effect/Request";
var RequestTypeId = /* @__PURE__ */ Symbol.for(RequestSymbolKey);
var requestVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var RequestPrototype = {
  ...StructuralPrototype,
  [RequestTypeId]: requestVariance
};
var Class3 = /* @__PURE__ */ function() {
  function Class7(args2) {
    if (args2) {
      Object.assign(this, args2);
    }
  }
  Class7.prototype = RequestPrototype;
  return Class7;
}();
var complete = /* @__PURE__ */ dual(2, (self, result) => fiberRefGetWith(currentRequestMap, (map15) => sync(() => {
  if (map15.has(self)) {
    const entry = map15.get(self);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/redBlackTree/iterator.js
var Direction = {
  Forward: 0,
  Backward: 1 << 0
};
var RedBlackTreeIterator = class _RedBlackTreeIterator {
  self;
  stack;
  direction;
  count = 0;
  constructor(self, stack, direction) {
    this.self = self;
    this.stack = stack;
    this.direction = direction;
  }
  /**
   * Clones the iterator
   */
  clone() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction);
  }
  /**
   * Reverse the traversal direction
   */
  reversed() {
    return new _RedBlackTreeIterator(this.self, this.stack.slice(), this.direction === Direction.Forward ? Direction.Backward : Direction.Forward);
  }
  /**
   * Iterator next
   */
  next() {
    const entry = this.entry;
    this.count++;
    if (this.direction === Direction.Forward) {
      this.moveNext();
    } else {
      this.movePrev();
    }
    switch (entry._tag) {
      case "None": {
        return {
          done: true,
          value: this.count
        };
      }
      case "Some": {
        return {
          done: false,
          value: entry.value
        };
      }
    }
  }
  /**
   * Returns the key
   */
  get key() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].key);
    }
    return none2();
  }
  /**
   * Returns the value
   */
  get value() {
    if (this.stack.length > 0) {
      return some2(this.stack[this.stack.length - 1].value);
    }
    return none2();
  }
  /**
   * Returns the key
   */
  get entry() {
    return map2(last(this.stack), (node) => [node.key, node.value]);
  }
  /**
   * Returns the position of this iterator in the sorted list
   */
  get index() {
    let idx = 0;
    const stack = this.stack;
    if (stack.length === 0) {
      const r = this.self._root;
      if (r != null) {
        return r.count;
      }
      return 0;
    } else if (stack[stack.length - 1].left != null) {
      idx = stack[stack.length - 1].left.count;
    }
    for (let s = stack.length - 2; s >= 0; --s) {
      if (stack[s + 1] === stack[s].right) {
        ;
        ++idx;
        if (stack[s].left != null) {
          idx += stack[s].left.count;
        }
      }
    }
    return idx;
  }
  /**
   * Advances iterator to next element in list
   */
  moveNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n.right != null) {
      n = n.right;
      while (n != null) {
        stack.push(n);
        n = n.left;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].right === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a next element
   */
  get hasNext() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].right != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].left === stack[s]) {
        return true;
      }
    }
    return false;
  }
  /**
   * Advances iterator to previous element in list
   */
  movePrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return;
    }
    let n = stack[stack.length - 1];
    if (n != null && n.left != null) {
      n = n.left;
      while (n != null) {
        stack.push(n);
        n = n.right;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].left === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  }
  /**
   * Checks if there is a previous element
   */
  get hasPrev() {
    const stack = this.stack;
    if (stack.length === 0) {
      return false;
    }
    if (stack[stack.length - 1].left != null) {
      return true;
    }
    for (let s = stack.length - 1; s > 0; --s) {
      if (stack[s - 1].right === stack[s]) {
        return true;
      }
    }
    return false;
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/redBlackTree/node.js
var Color = {
  Red: 0,
  Black: 1 << 0
};
var clone2 = ({
  color,
  count,
  key,
  left: left3,
  right: right3,
  value: value3
}) => ({
  color,
  key,
  value: value3,
  left: left3,
  right: right3,
  count
});
function swap2(n, v) {
  n.key = v.key;
  n.value = v.value;
  n.left = v.left;
  n.right = v.right;
  n.color = v.color;
  n.count = v.count;
}
var repaint = ({
  count,
  key,
  left: left3,
  right: right3,
  value: value3
}, color) => ({
  color,
  key,
  value: value3,
  left: left3,
  right: right3,
  count
});
var recount = (node) => {
  node.count = 1 + (node.left?.count ?? 0) + (node.right?.count ?? 0);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/redBlackTree.js
var RedBlackTreeSymbolKey = "effect/RedBlackTree";
var RedBlackTreeTypeId = /* @__PURE__ */ Symbol.for(RedBlackTreeSymbolKey);
var redBlackTreeVariance = {
  /* c8 ignore next */
  _Key: (_) => _,
  /* c8 ignore next */
  _Value: (_) => _
};
var RedBlackTreeProto = {
  [RedBlackTreeTypeId]: redBlackTreeVariance,
  [symbol]() {
    let hash3 = hash(RedBlackTreeSymbolKey);
    for (const item of this) {
      hash3 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return cached(this, hash3);
  },
  [symbol2](that) {
    if (isRedBlackTree(that)) {
      if ((this._root?.count ?? 0) !== (that._root?.count ?? 0)) {
        return false;
      }
      const entries2 = Array.from(that);
      return Array.from(this).every((itemSelf, i) => {
        const itemThat = entries2[i];
        return equals(itemSelf[0], itemThat[0]) && equals(itemSelf[1], itemThat[1]);
      });
    }
    return false;
  },
  [Symbol.iterator]() {
    const stack = [];
    let n = this._root;
    while (n != null) {
      stack.push(n);
      n = n.left;
    }
    return new RedBlackTreeIterator(this, stack, Direction.Forward);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "RedBlackTree",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl3 = (ord, root) => {
  const tree = Object.create(RedBlackTreeProto);
  tree._ord = ord;
  tree._root = root;
  return tree;
};
var isRedBlackTree = (u) => hasProperty(u, RedBlackTreeTypeId);
var empty20 = (ord) => makeImpl3(ord, void 0);
var fromIterable9 = /* @__PURE__ */ dual(2, (entries2, ord) => {
  let tree = empty20(ord);
  for (const [key, value3] of entries2) {
    tree = insert(tree, key, value3);
  }
  return tree;
});
var findFirst4 = /* @__PURE__ */ dual(2, (self, key) => {
  const cmp = self._ord;
  let node = self._root;
  while (node !== void 0) {
    const d = cmp(key, node.key);
    if (equals(key, node.key)) {
      return some2(node.value);
    }
    if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return none2();
});
var has5 = /* @__PURE__ */ dual(2, (self, key) => isSome2(findFirst4(self, key)));
var insert = /* @__PURE__ */ dual(3, (self, key, value3) => {
  const cmp = self._ord;
  let n = self._root;
  const n_stack = [];
  const d_stack = [];
  while (n != null) {
    const d = cmp(key, n.key);
    n_stack.push(n);
    d_stack.push(d);
    if (d <= 0) {
      n = n.left;
    } else {
      n = n.right;
    }
  }
  n_stack.push({
    color: Color.Red,
    key,
    value: value3,
    left: void 0,
    right: void 0,
    count: 1
  });
  for (let s = n_stack.length - 2; s >= 0; --s) {
    const n2 = n_stack[s];
    if (d_stack[s] <= 0) {
      n_stack[s] = {
        color: n2.color,
        key: n2.key,
        value: n2.value,
        left: n_stack[s + 1],
        right: n2.right,
        count: n2.count + 1
      };
    } else {
      n_stack[s] = {
        color: n2.color,
        key: n2.key,
        value: n2.value,
        left: n2.left,
        right: n_stack[s + 1],
        count: n2.count + 1
      };
    }
  }
  for (let s = n_stack.length - 1; s > 1; --s) {
    const p = n_stack[s - 1];
    const n3 = n_stack[s];
    if (p.color === Color.Black || n3.color === Color.Black) {
      break;
    }
    const pp = n_stack[s - 2];
    if (pp.left === p) {
      if (p.left === n3) {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.left = p.right;
          p.color = Color.Black;
          p.right = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = p;
            } else {
              ppp.right = p;
            }
          }
          break;
        }
      } else {
        const y = pp.right;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.right = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.right = n3.left;
          pp.color = Color.Red;
          pp.left = n3.right;
          n3.color = Color.Black;
          n3.left = p;
          n3.right = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.left === pp) {
              ppp.left = n3;
            } else {
              ppp.right = n3;
            }
          }
          break;
        }
      }
    } else {
      if (p.right === n3) {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          pp.color = Color.Red;
          pp.right = p.left;
          p.color = Color.Black;
          p.left = pp;
          n_stack[s - 2] = p;
          n_stack[s - 1] = n3;
          recount(pp);
          recount(p);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = p;
            } else {
              ppp.left = p;
            }
          }
          break;
        }
      } else {
        const y = pp.left;
        if (y && y.color === Color.Red) {
          p.color = Color.Black;
          pp.left = repaint(y, Color.Black);
          pp.color = Color.Red;
          s -= 1;
        } else {
          p.left = n3.right;
          pp.color = Color.Red;
          pp.right = n3.left;
          n3.color = Color.Black;
          n3.right = p;
          n3.left = pp;
          n_stack[s - 2] = n3;
          n_stack[s - 1] = p;
          recount(pp);
          recount(p);
          recount(n3);
          if (s >= 3) {
            const ppp = n_stack[s - 3];
            if (ppp.right === pp) {
              ppp.right = n3;
            } else {
              ppp.left = n3;
            }
          }
          break;
        }
      }
    }
  }
  n_stack[0].color = Color.Black;
  return makeImpl3(self._ord, n_stack[0]);
});
var keysForward = (self) => keys3(self, Direction.Forward);
var keys3 = (self, direction) => {
  const begin = self[Symbol.iterator]();
  let count = 0;
  return {
    [Symbol.iterator]: () => keys3(self, direction),
    next: () => {
      count++;
      const entry = begin.key;
      if (direction === Direction.Forward) {
        begin.moveNext();
      } else {
        begin.movePrev();
      }
      switch (entry._tag) {
        case "None": {
          return {
            done: true,
            value: count
          };
        }
        case "Some": {
          return {
            done: false,
            value: entry.value
          };
        }
      }
    }
  };
};
var removeFirst = /* @__PURE__ */ dual(2, (self, key) => {
  if (!has5(self, key)) {
    return self;
  }
  const ord = self._ord;
  const cmp = ord;
  let node = self._root;
  const stack = [];
  while (node !== void 0) {
    const d = cmp(key, node.key);
    stack.push(node);
    if (equals(key, node.key)) {
      node = void 0;
    } else if (d <= 0) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  if (stack.length === 0) {
    return self;
  }
  const cstack = new Array(stack.length);
  let n = stack[stack.length - 1];
  cstack[cstack.length - 1] = {
    color: n.color,
    key: n.key,
    value: n.value,
    left: n.left,
    right: n.right,
    count: n.count
  };
  for (let i = stack.length - 2; i >= 0; --i) {
    n = stack[i];
    if (n.left === stack[i + 1]) {
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: cstack[i + 1],
        right: n.right,
        count: n.count
      };
    } else {
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: n.left,
        right: cstack[i + 1],
        count: n.count
      };
    }
  }
  n = cstack[cstack.length - 1];
  if (n.left !== void 0 && n.right !== void 0) {
    const split2 = cstack.length;
    n = n.left;
    while (n.right != null) {
      cstack.push(n);
      n = n.right;
    }
    const v = cstack[split2 - 1];
    cstack.push({
      color: n.color,
      key: v.key,
      value: v.value,
      left: n.left,
      right: n.right,
      count: n.count
    });
    cstack[split2 - 1].key = n.key;
    cstack[split2 - 1].value = n.value;
    for (let i = cstack.length - 2; i >= split2; --i) {
      n = cstack[i];
      cstack[i] = {
        color: n.color,
        key: n.key,
        value: n.value,
        left: n.left,
        right: cstack[i + 1],
        count: n.count
      };
    }
    cstack[split2 - 1].left = cstack[split2];
  }
  n = cstack[cstack.length - 1];
  if (n.color === Color.Red) {
    const p = cstack[cstack.length - 2];
    if (p.left === n) {
      p.left = void 0;
    } else if (p.right === n) {
      p.right = void 0;
    }
    cstack.pop();
    for (let i = 0; i < cstack.length; ++i) {
      cstack[i].count--;
    }
    return makeImpl3(ord, cstack[0]);
  } else {
    if (n.left !== void 0 || n.right !== void 0) {
      if (n.left !== void 0) {
        swap2(n, n.left);
      } else if (n.right !== void 0) {
        swap2(n, n.right);
      }
      n.color = Color.Black;
      for (let i = 0; i < cstack.length - 1; ++i) {
        cstack[i].count--;
      }
      return makeImpl3(ord, cstack[0]);
    } else if (cstack.length === 1) {
      return makeImpl3(ord, void 0);
    } else {
      for (let i = 0; i < cstack.length; ++i) {
        cstack[i].count--;
      }
      const parent = cstack[cstack.length - 2];
      fixDoubleBlack(cstack);
      if (parent.left === n) {
        parent.left = void 0;
      } else {
        parent.right = void 0;
      }
    }
  }
  return makeImpl3(ord, cstack[0]);
});
var fixDoubleBlack = (stack) => {
  let n, p, s, z;
  for (let i = stack.length - 1; i >= 0; --i) {
    n = stack[i];
    if (i === 0) {
      n.color = Color.Black;
      return;
    }
    p = stack[i - 1];
    if (p.left === n) {
      s = p.right;
      if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.right = clone2(s);
        z = s.right = clone2(s.right);
        p.right = s.left;
        s.left = p;
        s.right = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.right = clone2(s);
        z = s.left = clone2(s.left);
        p.right = z.left;
        s.left = z.right;
        z.left = p;
        z.right = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = z;
          } else {
            pp.right = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.right = repaint(s, Color.Red);
          return;
        } else {
          p.right = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone2(s);
        p.right = s.left;
        s.left = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.left === p) {
            pp.left = s;
          } else {
            pp.right = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    } else {
      s = p.left;
      if (s !== void 0 && s.left !== void 0 && s.left.color === Color.Red) {
        s = p.left = clone2(s);
        z = s.left = clone2(s.left);
        p.left = s.right;
        s.right = p;
        s.left = z;
        s.color = p.color;
        n.color = Color.Black;
        p.color = Color.Black;
        z.color = Color.Black;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        return;
      } else if (s !== void 0 && s.right !== void 0 && s.right.color === Color.Red) {
        s = p.left = clone2(s);
        z = s.right = clone2(s.right);
        p.left = z.right;
        s.right = z.left;
        z.right = p;
        z.left = s;
        z.color = p.color;
        p.color = Color.Black;
        s.color = Color.Black;
        n.color = Color.Black;
        recount(p);
        recount(s);
        recount(z);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = z;
          } else {
            pp.left = z;
          }
        }
        stack[i - 1] = z;
        return;
      }
      if (s !== void 0 && s.color === Color.Black) {
        if (p.color === Color.Red) {
          p.color = Color.Black;
          p.left = repaint(s, Color.Red);
          return;
        } else {
          p.left = repaint(s, Color.Red);
          continue;
        }
      } else if (s !== void 0) {
        s = clone2(s);
        p.left = s.right;
        s.right = p;
        s.color = p.color;
        p.color = Color.Red;
        recount(p);
        recount(s);
        if (i > 1) {
          const pp = stack[i - 2];
          if (pp.right === p) {
            pp.right = s;
          } else {
            pp.left = s;
          }
        }
        stack[i - 1] = s;
        stack[i] = p;
        if (i + 1 < stack.length) {
          stack[i + 1] = n;
        } else {
          stack.push(n);
        }
        i = i + 2;
      }
    }
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/RedBlackTree.js
var fromIterable10 = fromIterable9;
var has6 = has5;
var insert2 = insert;
var keys4 = keysForward;
var removeFirst2 = removeFirst;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/SortedSet.js
var TypeId13 = /* @__PURE__ */ Symbol.for("effect/SortedSet");
var SortedSetProto = {
  [TypeId13]: {
    _A: (_) => _
  },
  [symbol]() {
    return pipe(hash(this.keyTree), combine(hash(TypeId13)), cached(this));
  },
  [symbol2](that) {
    return isSortedSet(that) && equals(this.keyTree, that.keyTree);
  },
  [Symbol.iterator]() {
    return keys4(this.keyTree);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "SortedSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromTree = (keyTree) => {
  const a = Object.create(SortedSetProto);
  a.keyTree = keyTree;
  return a;
};
var isSortedSet = (u) => hasProperty(u, TypeId13);
var fromIterable11 = /* @__PURE__ */ dual(2, (iterable, ord) => fromTree(fromIterable10(Array.from(iterable).map((k) => [k, true]), ord)));
var add5 = /* @__PURE__ */ dual(2, (self, value3) => has6(self.keyTree, value3) ? self : fromTree(insert2(self.keyTree, value3, true)));
var every4 = /* @__PURE__ */ dual(2, (self, predicate) => {
  for (const value3 of self) {
    if (!predicate(value3)) {
      return false;
    }
  }
  return true;
});
var has7 = /* @__PURE__ */ dual(2, (self, value3) => has6(self.keyTree, value3));
var isSubset2 = /* @__PURE__ */ dual(2, (self, that) => every4(self, (a) => has7(that, a)));
var remove5 = /* @__PURE__ */ dual(2, (self, value3) => fromTree(removeFirst2(self.keyTree, value3)));
var values3 = (self) => keys4(self.keyTree);
var getEquivalence6 = () => (a, b) => isSubset2(a, b) && isSubset2(b, a);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/supervisor.js
var SupervisorSymbolKey = "effect/Supervisor";
var SupervisorTypeId = /* @__PURE__ */ Symbol.for(SupervisorSymbolKey);
var supervisorVariance = {
  /* c8 ignore next */
  _T: (_) => _
};
var ProxySupervisor = class _ProxySupervisor {
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context3, effect, parent, fiber) {
    this.underlying.onStart(context3, effect, parent, fiber);
  }
  onEnd(value3, fiber) {
    this.underlying.onEnd(value3, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new _ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
};
var Zip = class _Zip {
  left;
  right;
  _tag = "Zip";
  [SupervisorTypeId] = supervisorVariance;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  get value() {
    return zip2(this.left.value, this.right.value);
  }
  onStart(context3, effect, parent, fiber) {
    this.left.onStart(context3, effect, parent, fiber);
    this.right.onStart(context3, effect, parent, fiber);
  }
  onEnd(value3, fiber) {
    this.left.onEnd(value3, fiber);
    this.right.onEnd(value3, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new _Zip(this, right3);
  }
};
var isZip = (self) => hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
var Track = class {
  [SupervisorTypeId] = supervisorVariance;
  fibers = /* @__PURE__ */ new Set();
  get value() {
    return sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var Const = class {
  effect;
  [SupervisorTypeId] = supervisorVariance;
  constructor(effect) {
    this.effect = effect;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var FibersIn = class {
  ref;
  [SupervisorTypeId] = supervisorVariance;
  constructor(ref) {
    this.ref = ref;
  }
  get value() {
    return sync(() => get5(this.ref));
  }
  onStart(_context, _effect, _parent, fiber) {
    pipe(this.ref, set2(pipe(get5(this.ref), add5(fiber))));
  }
  onEnd(_value, fiber) {
    pipe(this.ref, set2(pipe(get5(this.ref), remove5(fiber))));
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map9(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var fromEffect = (effect) => {
  return new Const(effect);
};
var none7 = /* @__PURE__ */ globalValue("effect/Supervisor/none", () => fromEffect(void_2));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Differ.js
var make29 = make15;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/supervisor/patch.js
var OP_EMPTY3 = "Empty";
var OP_ADD_SUPERVISOR = "AddSupervisor";
var OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
var OP_AND_THEN2 = "AndThen";
var empty22 = {
  _tag: OP_EMPTY3
};
var combine7 = (self, that) => {
  return {
    _tag: OP_AND_THEN2,
    first: self,
    second: that
  };
};
var patch8 = (self, supervisor) => {
  return patchLoop(supervisor, of2(self));
};
var patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty2(patches)) {
    const head4 = headNonEmpty2(patches);
    switch (head4._tag) {
      case OP_EMPTY3: {
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head4.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head4.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_AND_THEN2: {
        patches = prepend2(head4.first)(prepend2(head4.second)(tailNonEmpty2(patches)));
        break;
      }
    }
  }
  return supervisor;
};
var removeSupervisor = (self, that) => {
  if (equals(self, that)) {
    return none7;
  } else {
    if (isZip(self)) {
      return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
    } else {
      return self;
    }
  }
};
var toSet2 = (self) => {
  if (equals(self, none7)) {
    return empty7();
  } else {
    if (isZip(self)) {
      return pipe(toSet2(self.left), union3(toSet2(self.right)));
    } else {
      return make11(self);
    }
  }
};
var diff7 = (oldValue, newValue) => {
  if (equals(oldValue, newValue)) {
    return empty22;
  }
  const oldSupervisors = toSet2(oldValue);
  const newSupervisors = toSet2(newValue);
  const added = pipe(newSupervisors, difference3(oldSupervisors), reduce4(empty22, (patch9, supervisor) => combine7(patch9, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe(oldSupervisors, difference3(newSupervisors), reduce4(empty22, (patch9, supervisor) => combine7(patch9, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine7(added, removed);
};
var differ2 = /* @__PURE__ */ make29({
  empty: empty22,
  patch: patch8,
  combine: combine7,
  diff: diff7
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/fiberRuntime.js
var fiberStarted = /* @__PURE__ */ counter5("effect_fiber_started", {
  incremental: true
});
var fiberActive = /* @__PURE__ */ counter5("effect_fiber_active");
var fiberSuccesses = /* @__PURE__ */ counter5("effect_fiber_successes", {
  incremental: true
});
var fiberFailures = /* @__PURE__ */ counter5("effect_fiber_failures", {
  incremental: true
});
var fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram5("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds");
var EvaluationSignalContinue = "Continue";
var EvaluationSignalDone = "Done";
var EvaluationSignalYieldNow = "Yield";
var runtimeFiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var absurd = (_) => {
  throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
var YieldedOp = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp");
var yieldedOpChannel = /* @__PURE__ */ globalValue("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
}));
var contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value3) => {
    return internalCall(() => cont.effect_instruction_i1(value3));
  },
  ["OnStep"]: (_, _cont, value3) => {
    return exitSucceed(exitSucceed(value3));
  },
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value3) => {
    return internalCall(() => cont.effect_instruction_i2(value3));
  },
  [OP_REVERT_FLAGS]: (self, cont, value3) => {
    self.patchRuntimeFlags(self.currentRuntimeFlags, cont.patch);
    if (interruptible(self.currentRuntimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value3);
    }
  },
  [OP_WHILE]: (self, cont, value3) => {
    internalCall(() => cont.effect_instruction_i2(value3));
    if (internalCall(() => cont.effect_instruction_i0())) {
      self.pushStack(cont);
      return internalCall(() => cont.effect_instruction_i1());
    } else {
      return void_2;
    }
  },
  [OP_ITERATOR]: (self, cont, value3) => {
    const state = internalCall(() => cont.effect_instruction_i0.next(value3));
    if (state.done) return exitSucceed(state.value);
    self.pushStack(cont);
    return yieldWrapGet(state.value);
  }
};
var drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self, runtimeFlags2, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return interruptible(runtimeFlags2) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self, runtimeFlags2, cur, message) => {
    message.onFiber(self, running2(runtimeFlags2));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap7(yieldNow(), () => cur);
  }
};
var runBlockedRequests = (self) => forEachSequentialDiscard(flatten3(self), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential5]) => {
  const map15 = /* @__PURE__ */ new Map();
  const arr = [];
  for (const block of sequential5) {
    arr.push(toReadonlyArray(block));
    for (const entry of block) {
      map15.set(entry.request, entry);
    }
  }
  const flat = arr.flat();
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
    entry.listeners.interrupted = true;
  })), currentRequestMap, map15);
}, false, false));
var _version = /* @__PURE__ */ getCurrentVersion();
var FiberRuntime = class extends Class2 {
  [FiberTypeId] = fiberVariance2;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  _fiberRefs;
  _fiberId;
  _queue = /* @__PURE__ */ new Array();
  _children = null;
  _observers = /* @__PURE__ */ new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _isYielding = false;
  currentRuntimeFlags;
  currentOpCount = 0;
  currentSupervisor;
  currentScheduler;
  currentTracer;
  currentSpan;
  currentContext;
  currentDefaultServices;
  constructor(fiberId2, fiberRefs0, runtimeFlags0) {
    super();
    this.currentRuntimeFlags = runtimeFlags0;
    this._fiberId = fiberId2;
    this._fiberRefs = fiberRefs0;
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this.refreshRefCache();
  }
  commit() {
    return join2(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect) {
    this.tell(resume(effect));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((_, status) => status);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((state, status) => {
      if (isDone2(status)) {
        return state.currentRuntimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return unsafeMake4(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = /* @__PURE__ */ new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status) => {
        deferredUnsafeDone(deferred, sync(() => f(fiber, status)));
      }));
      return deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async_((resume2) => {
      const cb = (exit3) => resume2(succeed(exit3));
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch9 = pipe(
        diff4(parentRuntimeFlags, updatedRuntimeFlags),
        // Do not inherit WindDown or Interruption!
        exclude2(Interruption),
        exclude2(WindDown)
      );
      return updateRuntimeFlags(patch9);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return sync(() => fromNullable2(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId2) {
    return sync(() => this.tell(interruptSignal(interrupt(fiberId2))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(fiberId2) {
    this.tell(interruptSignal(interrupt(fiberId2)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this.currentRuntimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value3) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value: value3
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(currentServices);
    this.currentTracer = this.currentDefaultServices.unsafeMap.get(tracerTag.key);
    this.currentSupervisor = this.getFiberRef(currentSupervisor);
    this.currentScheduler = this.getFiberRef(currentScheduler);
    this.currentContext = this.getFiberRef(currentContext);
    this.currentSpan = this.currentContext.unsafeMap.get(spanTag.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs2) {
    this._fiberRefs = fiberRefs2;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child) {
    this.getChildren().add(child);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child) {
    this.getChildren().delete(child);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(scope2) {
    const children = this._children;
    this._children = null;
    if (children !== null && children.size > 0) {
      for (const child of children) {
        if (child._exitValue === null) {
          scope2.add(this.currentRuntimeFlags, child);
        }
      }
    }
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags2, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags2, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !isEmpty5(this.getFiberRef(currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone3 = false;
      const body = () => {
        const next = it.next();
        if (!next.done) {
          return asVoid(next.value.await);
        } else {
          return sync(() => {
            isDone3 = true;
          });
        }
      };
      return whileLoop({
        while: () => !isDone3,
        body,
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(exit3) {
    if (runtimeMetrics(this.currentRuntimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit3._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit3._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit3.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit3.cause, level);
      }
    }
  }
  setExitValue(exit3) {
    this._exitValue = exit3;
    this.reportExitValue(exit3);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit3);
    }
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel2 = isSome2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan4(minimumLogLevel, logLevel2)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations3 = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size3(loggers) > 0) {
      const clockService = get3(this.getFiberRef(currentServices), clockTag);
      const date3 = new Date(clockService.unsafeCurrentTimeMillis());
      withRedactableContext(contextMap, () => {
        for (const logger of loggers) {
          logger.log({
            fiberId: this.id(),
            logLevel: logLevel2,
            message,
            cause,
            context: contextMap,
            spans,
            annotations: annotations3,
            date: date3
          });
        }
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done3 : suspended2(this.currentRuntimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this.currentSupervisor.onResume(this);
    try {
      let effect = interruptible(this.currentRuntimeFlags) && this.isInterrupted() ? exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        const eff = effect;
        const exit3 = this.runLoop(eff);
        if (exit3 === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this.currentRuntimeFlags)) {
              this.tell(yieldNow3());
              this.tell(resume(exitVoid));
              effect = null;
            } else {
              effect = exitVoid;
            }
          } else if (op._op === OP_ASYNC) {
            effect = null;
          }
        } else {
          this.currentRuntimeFlags = pipe(this.currentRuntimeFlags, enable2(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect = flatMap7(interruption2, () => exit3);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit3);
            } else {
              this.tell(resume(exit3));
            }
            effect = null;
          }
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect) {
    this.tell(resume(effect));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch9) {
    const newRuntimeFlags = patch4(oldRuntimeFlags, patch9);
    globalThis[currentFiberURI] = this;
    this.currentRuntimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags2, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    };
    if (interruptible(runtimeFlags2)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this.currentRuntimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE && frame._op !== OP_ITERATOR) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return sync(() => unsafeGet3(this.currentContext, op));
  }
  ["Left"](op) {
    return fail2(op.left);
  }
  ["None"](_) {
    return fail2(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  ["Micro"](op) {
    return unsafeAsync((microResume) => {
      let resume2 = microResume;
      const fiber = runFork(provideContext2(op, this.currentContext));
      fiber.addObserver((exit3) => {
        if (exit3._tag === "Success") {
          return resume2(exitSucceed(exit3.value));
        }
        switch (exit3.cause._tag) {
          case "Interrupt": {
            return resume2(exitFailCause(interrupt(none4)));
          }
          case "Fail": {
            return resume2(fail2(exit3.cause.error));
          }
          case "Die": {
            return resume2(die2(exit3.cause.defect));
          }
        }
      });
      return unsafeAsync((abortResume) => {
        resume2 = (_) => {
          abortResume(void_2);
        };
        fiber.unsafeInterrupt();
      });
    });
  }
  [OP_SYNC](op) {
    const value3 = internalCall(() => op.effect_instruction_i0());
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value3);
    } else {
      yieldedOpChannel.currentOp = exitSucceed(value3);
      return YieldedOp;
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== void 0) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return internalCall(() => cont.effect_instruction_i1(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause));
          } else {
            return exitFailCause(stripFailures(cause));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this.currentRuntimeFlags, cont.patch);
          if (interruptible(this.currentRuntimeFlags) && this.isInterrupted()) {
            return exitFailCause(sequential(cause, this.getInterruptedCause()));
          } else {
            return exitFailCause(cause);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause(cause);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return internalCall(() => op.effect_instruction_i0(this, running2(this.currentRuntimeFlags)));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this.currentRuntimeFlags = snap.flags;
      const patchRefs = diff6(snap.refs, refs);
      const patchFlags = diff4(snap.flags, flags);
      return exitSucceed(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch7(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber.currentRuntimeFlags = patch4(patchFlags)(newFiber.currentRuntimeFlags);
        return op.effect_instruction_i1;
      })));
    }
    return uninterruptibleMask((restore) => flatMap7(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this.currentRuntimeFlags;
    const newRuntimeFlags = patch4(oldRuntimeFlags, updateFlags);
    if (interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this.currentRuntimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff4(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
      } else {
        return exitVoid;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this.currentRuntimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this._isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check2 = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check2()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid;
    }
  }
  [OP_ITERATOR](op) {
    return contOpSuccess[OP_ITERATOR](this, op, void 0);
  }
  [OP_COMMIT](op) {
    return internalCall(() => op.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this.currentRuntimeFlags & OpSupervision) !== 0) {
        this.currentSupervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this.currentRuntimeFlags, cur);
      }
      if (!this._isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this.currentScheduler.shouldYield(this);
        if (shouldYield !== false) {
          this._isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap7(yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        cur = this.currentTracer.context(() => {
          if (_version !== cur[EffectTypeId2]._V) {
            return dieMessage(`Cannot execute an Effect versioned ${cur[EffectTypeId2]._V} with a Runtime of version ${getCurrentVersion()}`);
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS || op._op === OP_FAILURE ? op : exitFailCause(die(op));
        }
      } catch (e) {
        if (cur !== YieldedOp && !hasProperty(cur, "_op") || !(cur._op in this)) {
          cur = dieMessage(`Not a valid effect: ${toStringUnknown(cur)}`);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential(die(e), interrupt(none4)));
        } else {
          cur = die2(e);
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
};
var currentMinimumLogLevel = /* @__PURE__ */ globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
var loggerWithConsoleLog = (self) => makeLogger((opts) => {
  const services = getOrDefault2(opts.context, currentServices);
  get3(services, consoleTag).unsafe.log(self.log(opts));
});
var defaultLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
var tracerLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations: annotations3,
  cause,
  context: context3,
  fiberId: fiberId2,
  logLevel: logLevel2,
  message
}) => {
  const span2 = getOption2(getOrDefault(context3, currentContext), spanTag);
  if (span2._tag === "None" || span2.value._tag === "ExternalSpan") {
    return;
  }
  const clockService = unsafeGet3(getOrDefault(context3, currentServices), clockTag);
  const attributes = {};
  for (const [key, value3] of annotations3) {
    attributes[key] = value3;
  }
  attributes["effect.fiberId"] = threadName2(fiberId2);
  attributes["effect.logLevel"] = logLevel2.label;
  if (cause !== null && cause._tag !== "Empty") {
    attributes["effect.cause"] = pretty(cause, {
      renderErrorCause: true
    });
  }
  span2.value.event(toStringUnknown(Array.isArray(message) ? message[0] : message), clockService.unsafeCurrentTimeNanos(), attributes);
}));
var currentLoggers = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make11(defaultLogger, tracerLogger)));
var forEach6 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (self, f, options) => withFiberRuntime((r) => {
  const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
  if (options?.discard) {
    return match8(options.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
  }
  return match8(options?.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachParUnbounded(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachParN(self, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
var forEachParUnbounded = (self, f, batching) => suspend(() => {
  const as4 = fromIterable(self);
  const array6 = new Array(as4.length);
  const fn = (a, i) => flatMap7(f(a, i), (b) => sync(() => array6[i] = b));
  return zipRight(forEachConcurrentDiscard(as4, fn, batching, false), succeed(array6));
});
var forEachConcurrentDiscard = (self, f, batching, processAll, n) => uninterruptibleMask((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self).reverse();
  let target = todos.length;
  if (target === 0) {
    return void_2;
  }
  let counter6 = 0;
  let interrupted = false;
  const fibersCount = n ? Math.min(todos.length, n) : todos.length;
  const fibers = /* @__PURE__ */ new Set();
  const results = new Array();
  const interruptAll = () => fibers.forEach((fiber) => {
    fiber.currentScheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0);
  });
  const startOrder = new Array();
  const joinOrder = new Array();
  const residual = new Array();
  const collectExits = () => {
    const exits = results.filter(({
      exit: exit3
    }) => exit3._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit3
    }) => exit3);
    if (exits.length === 0) {
      exits.push(exitVoid);
    }
    return exits;
  };
  const runFiber = (eff, interruptImmediately = false) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent.currentRuntimeFlags, globalScope);
    parent.currentScheduler.scheduleTask(() => {
      if (interruptImmediately) {
        fiber.unsafeInterruptAsFork(parent.id());
      }
      fiber.resume(runnable);
    }, 0);
    return fiber;
  };
  const onInterruptSignal = () => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted = true;
    interruptAll();
  };
  const stepOrExit = batching ? step2 : exit;
  const processingFiber = runFiber(async_((resume2) => {
    const pushResult = (res, index) => {
      if (res._op === "Blocked") {
        residual.push(res);
      } else {
        results.push({
          index,
          exit: res
        });
        if (res._op === "Failure" && !interrupted) {
          onInterruptSignal();
        }
      }
    };
    const next = () => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index = counter6++;
        const returnNextElement = () => {
          const a2 = todos.pop();
          index = counter6++;
          return flatMap7(yieldNow(), () => flatMap7(stepOrExit(restore(f(a2, index))), onRes));
        };
        const onRes = (res) => {
          if (todos.length > 0) {
            pushResult(res, index);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed(res);
        };
        const todo = flatMap7(stepOrExit(restore(f(a, index))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted) {
          fiber.currentScheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0);
        }
        fiber.addObserver((wrapped) => {
          let exit3;
          if (wrapped._op === "Failure") {
            exit3 = wrapped;
          } else {
            exit3 = wrapped.effect_instruction_i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit3, index);
          if (results.length === target) {
            resume2(succeed(getOrElse2(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid)));
          } else if (residual.length + results.length === target) {
            const exits = collectExits();
            const requests = residual.map((blocked2) => blocked2.effect_instruction_i0).reduce(par);
            resume2(succeed(blocked(requests, forEachConcurrentDiscard([getOrElse2(exitCollectAll(exits, {
              parallel: true
            }), () => exitVoid), ...residual.map((blocked2) => blocked2.effect_instruction_i1)], (i) => i, batching, true, n))));
          } else {
            next();
          }
        });
      }
    };
    for (let i = 0; i < fibersCount; i++) {
      next();
    }
  }));
  return asVoid(onExit(flatten4(restore(join2(processingFiber))), exitMatch({
    onFailure: (cause) => {
      onInterruptSignal();
      const target2 = residual.length + 1;
      const concurrency = Math.min(typeof n === "number" ? n : residual.length, residual.length);
      const toPop = Array.from(residual);
      return async_((cb) => {
        const exits = [];
        let count = 0;
        let index = 0;
        const check2 = (index2, hitNext) => (exit3) => {
          exits[index2] = exit3;
          count++;
          if (count === target2) {
            cb(exitSucceed(exitFailCause(cause)));
          }
          if (toPop.length > 0 && hitNext) {
            next();
          }
        };
        const next = () => {
          runFiber(toPop.pop(), true).addObserver(check2(index, true));
          index++;
        };
        processingFiber.addObserver(check2(index, false));
        index++;
        for (let i = 0; i < concurrency; i++) {
          next();
        }
      });
    },
    onSuccess: () => forEachSequential(joinOrder, (f2) => f2.inheritAll)
  })));
})));
var forEachParN = (self, n, f, batching) => suspend(() => {
  const as4 = fromIterable(self);
  const array6 = new Array(as4.length);
  const fn = (a, i) => map9(f(a, i), (b) => array6[i] = b);
  return zipRight(forEachConcurrentDiscard(as4, fn, batching, false, n), succeed(array6));
});
var forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
var unsafeFork2 = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
var unsafeForkUnstarted = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
};
var unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake2();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault(childFiberRefs, currentContext);
  const supervisor = childFiber.currentSupervisor;
  supervisor.onStart(childContext, effect, some2(parentFiber), childFiber);
  childFiber.addObserver((exit3) => supervisor.onEnd(exit3, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse2(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
var forkWithScopeOverride = (self, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed(unsafeFork2(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
var parallelFinalizers = (self) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    switch (scope2.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return flatMap7(scopeFork(scope2, parallel3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var parallelNFinalizers = (parallelism) => (self) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    if (scope2.strategy._tag === "ParallelN" && scope2.strategy.parallelism === parallelism) {
      return self;
    }
    return flatMap7(scopeFork(scope2, parallelN2(parallelism)), (inner) => scopeExtend(self, inner));
  }
}));
var finalizersMaskInternal = (strategy, concurrentFinalizers) => (self) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self(identity),
  onSome: (scope2) => {
    if (concurrentFinalizers === true) {
      const patch9 = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
      switch (scope2.strategy._tag) {
        case "Parallel":
          return patch9(self(parallelFinalizers));
        case "Sequential":
          return patch9(self(sequentialFinalizers));
        case "ParallelN":
          return patch9(self(parallelNFinalizers(scope2.strategy.parallelism)));
      }
    } else {
      return self(identity);
    }
  }
}));
var sequentialFinalizers = (self) => contextWithEffect((context3) => match2(getOption2(context3, scopeTag), {
  onNone: () => self,
  onSome: (scope2) => {
    switch (scope2.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return flatMap7(scopeFork(scope2, sequential3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var scopeTag = /* @__PURE__ */ GenericTag("effect/Scope");
var scopeUnsafeAddFinalizer = (scope2, fin) => {
  if (scope2.state._tag === "Open") {
    scope2.state.finalizers.set({}, fin);
  }
};
var ScopeImplProto = {
  [ScopeTypeId]: ScopeTypeId,
  [CloseableScopeTypeId]: CloseableScopeTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  fork(strategy) {
    return sync(() => {
      const newScope = scopeUnsafeMake(strategy);
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      const key = {};
      const fin = (exit3) => newScope.close(exit3);
      this.state.finalizers.set(key, fin);
      scopeUnsafeAddFinalizer(newScope, (_) => sync(() => {
        if (this.state._tag === "Open") {
          this.state.finalizers.delete(key);
        }
      }));
      return newScope;
    });
  },
  close(exit3) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return void_2;
      }
      const finalizers = Array.from(this.state.finalizers.values()).reverse();
      this.state = {
        _tag: "Closed",
        exit: exit3
      };
      if (finalizers.length === 0) {
        return void_2;
      }
      return isSequential(this.strategy) ? pipe(forEachSequential(finalizers, (fin) => exit(fin(exit3))), flatMap7((results) => pipe(exitCollectAll(results), map2(exitAsVoid), getOrElse2(() => exitVoid)))) : isParallel(this.strategy) ? pipe(forEachParUnbounded(finalizers, (fin) => exit(fin(exit3)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse2(() => exitVoid)))) : pipe(forEachParN(finalizers, this.strategy.parallelism, (fin) => exit(fin(exit3)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse2(() => exitVoid))));
    });
  },
  addFinalizer(fin) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return fin(this.state.exit);
      }
      this.state.finalizers.set({}, fin);
      return void_2;
    });
  }
};
var scopeUnsafeMake = (strategy = sequential2) => {
  const scope2 = Object.create(ScopeImplProto);
  scope2.strategy = strategy;
  scope2.state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Map()
  };
  return scope2;
};
var scopeExtend = /* @__PURE__ */ dual(2, (effect, scope2) => mapInputContext(
  effect,
  // @ts-expect-error
  merge3(make6(scopeTag, scope2))
));
var fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ2,
  fork: empty22
});
var currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none5);
var currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none7);
var invokeWithInterrupt = (self, entries2, onInterrupt2) => fiberIdWith((id) => flatMap7(flatMap7(forkDaemon(interruptible2(self)), (processing) => async_((cb) => {
  const counts = entries2.map((_) => _.listeners.count);
  const checkDone = () => {
    if (counts.every((count) => count === 0)) {
      if (entries2.every((_) => {
        if (_.result.state.current._tag === "Pending") {
          return true;
        } else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) {
          return true;
        } else {
          return false;
        }
      })) {
        cleanup.forEach((f) => f());
        onInterrupt2?.();
        cb(interruptFiber(processing));
      }
    }
  };
  processing.addObserver((exit3) => {
    cleanup.forEach((f) => f());
    cb(exit3);
  });
  const cleanup = entries2.map((r, i) => {
    const observer = (count) => {
      counts[i] = count;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = entries2.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete(entry.request, exitInterrupt(id)));
})));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Cause.js
var empty24 = empty14;
var fail3 = fail;
var die3 = die;
var interrupt2 = interrupt;
var parallel4 = parallel;
var sequential4 = sequential;
var isCause2 = isCause;
var isFailType2 = isFailType;
var IllegalArgumentException2 = IllegalArgumentException;
var pretty2 = pretty;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Scope.js
var close = scopeClose;
var fork = scopeFork;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/runtime.js
var makeDual = (f) => function() {
  if (arguments.length === 1) {
    const runtime4 = arguments[0];
    return (effect, ...args2) => f(runtime4, effect, ...args2);
  }
  return f.apply(this, arguments);
};
var unsafeFork3 = /* @__PURE__ */ makeDual((runtime4, self, options) => {
  const fiberId2 = unsafeMake2();
  const fiberRefUpdates = [[currentContext, [[fiberId2, runtime4.context]]]];
  if (options?.scheduler) {
    fiberRefUpdates.push([currentScheduler, [[fiberId2, options.scheduler]]]);
  }
  let fiberRefs2 = updateManyAs2(runtime4.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId2
  });
  if (options?.updateRefs) {
    fiberRefs2 = options.updateRefs(fiberRefs2, fiberId2);
  }
  const fiberRuntime = new FiberRuntime(fiberId2, fiberRefs2, runtime4.runtimeFlags);
  let effect = self;
  if (options?.scope) {
    effect = flatMap7(fork(options.scope, sequential2), (closeableScope) => zipRight(scopeAddFinalizer(closeableScope, fiberIdWith((id) => equals(id, fiberRuntime.id()) ? void_2 : interruptAsFiber(fiberRuntime, id))), onExit(self, (exit3) => close(closeableScope, exit3))));
  }
  const supervisor = fiberRuntime.currentSupervisor;
  if (supervisor !== none7) {
    supervisor.onStart(runtime4.context, effect, none2(), fiberRuntime);
    fiberRuntime.addObserver((exit3) => supervisor.onEnd(exit3, fiberRuntime));
  }
  globalScope.add(runtime4.runtimeFlags, fiberRuntime);
  if (options?.immediate === false) {
    fiberRuntime.resume(effect);
  } else {
    fiberRuntime.start(effect);
  }
  return fiberRuntime;
});
var unsafeRunSync = /* @__PURE__ */ makeDual((runtime4, effect) => {
  const result = unsafeRunSyncExit(runtime4)(effect);
  if (result._tag === "Failure") {
    throw fiberFailure(result.effect_instruction_i0);
  }
  return result.effect_instruction_i0;
});
var AsyncFiberExceptionImpl = class extends Error {
  fiber;
  _tag = "AsyncFiberException";
  constructor(fiber) {
    super(`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    this.fiber = fiber;
    this.name = this._tag;
    this.stack = this.message;
  }
};
var asyncFiberException = (fiber) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new AsyncFiberExceptionImpl(fiber);
  Error.stackTraceLimit = limit;
  return error;
};
var FiberFailureId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
var FiberFailureCauseId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var FiberFailureImpl = class extends Error {
  [FiberFailureId];
  [FiberFailureCauseId];
  constructor(cause) {
    const head4 = prettyErrors(cause)[0];
    super(head4?.message || "An error has occurred");
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause;
    this.name = head4 ? `(FiberFailure) ${head4.name}` : "FiberFailure";
    if (head4?.stack) {
      this.stack = head4.stack;
    }
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[FiberFailureCauseId].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + pretty(this[FiberFailureCauseId], {
      renderErrorCause: true
    });
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var fiberFailure = (cause) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new FiberFailureImpl(cause);
  Error.stackTraceLimit = limit;
  return error;
};
var fastPath = (effect) => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed(op.right);
    }
    case "Some": {
      return exitSucceed(op.value);
    }
    case "None": {
      return exitFail(NoSuchElementException());
    }
  }
};
var unsafeRunSyncExit = /* @__PURE__ */ makeDual((runtime4, effect) => {
  const op = fastPath(effect);
  if (op) {
    return op;
  }
  const scheduler2 = new SyncScheduler();
  const fiberRuntime = unsafeFork3(runtime4)(effect, {
    scheduler: scheduler2
  });
  scheduler2.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  return exitDie(capture(asyncFiberException(fiberRuntime), currentSpanFromFiber(fiberRuntime)));
});
var unsafeRunPromise = /* @__PURE__ */ makeDual((runtime4, effect, options) => unsafeRunPromiseExit(runtime4, effect, options).then((result) => {
  switch (result._tag) {
    case OP_SUCCESS: {
      return result.effect_instruction_i0;
    }
    case OP_FAILURE: {
      throw fiberFailure(result.effect_instruction_i0);
    }
  }
}));
var unsafeRunPromiseExit = /* @__PURE__ */ makeDual((runtime4, effect, options) => new Promise((resolve) => {
  const op = fastPath(effect);
  if (op) {
    resolve(op);
  }
  const fiber = unsafeFork3(runtime4)(effect);
  fiber.addObserver((exit3) => {
    resolve(exit3);
  });
  if (options?.signal !== void 0) {
    if (options.signal.aborted) {
      fiber.unsafeInterruptAsFork(fiber.id());
    } else {
      options.signal.addEventListener("abort", () => {
        fiber.unsafeInterruptAsFork(fiber.id());
      }, {
        once: true
      });
    }
  }
}));
var RuntimeImpl = class {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context3, runtimeFlags2, fiberRefs2) {
    this.context = context3;
    this.runtimeFlags = runtimeFlags2;
    this.fiberRefs = fiberRefs2;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make30 = (options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
var defaultRuntimeFlags = /* @__PURE__ */ make17(Interruption, CooperativeYielding, RuntimeMetrics);
var defaultRuntime = /* @__PURE__ */ make30({
  context: /* @__PURE__ */ empty3(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: /* @__PURE__ */ empty18()
});
var unsafeForkEffect = /* @__PURE__ */ unsafeFork3(defaultRuntime);
var unsafeRunPromiseEffect = /* @__PURE__ */ unsafeRunPromise(defaultRuntime);
var unsafeRunSyncEffect = /* @__PURE__ */ unsafeRunSync(defaultRuntime);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Data.js
var struct4 = struct3;
var array4 = (as4) => unsafeArray(as4.slice(0));
var unsafeArray = (as4) => Object.setPrototypeOf(as4, ArrayProto);
var Class4 = Structural;
var Error3 = /* @__PURE__ */ function() {
  const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  const O = {
    BaseEffectError: class extends YieldableError {
      constructor(args2) {
        super(args2?.message, args2?.cause ? {
          cause: args2.cause
        } : void 0);
        if (args2) {
          Object.assign(this, args2);
          Object.defineProperty(this, plainArgsSymbol, {
            value: args2,
            enumerable: false
          });
        }
      }
      toJSON() {
        return {
          ...this[plainArgsSymbol],
          ...this
        };
      }
    }
  };
  return O.BaseEffectError;
}();
var TaggedError = (tag2) => {
  const O = {
    BaseEffectError: class extends Error3 {
      _tag = tag2;
    }
  };
  O.BaseEffectError.prototype.name = tag2;
  return O.BaseEffectError;
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/dateTime.js
var TypeId14 = /* @__PURE__ */ Symbol.for("effect/DateTime");
var TimeZoneTypeId = /* @__PURE__ */ Symbol.for("effect/DateTime/TimeZone");
var Proto = {
  [TypeId14]: TypeId14,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [NodeInspectSymbol]() {
    return this.toString();
  },
  toJSON() {
    return toDateUtc(this).toJSON();
  }
};
var ProtoUtc = {
  ...Proto,
  _tag: "Utc",
  [symbol]() {
    return cached(this, number2(this.epochMillis));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Utc" && this.epochMillis === that.epochMillis;
  },
  toString() {
    return `DateTime.Utc(${toDateUtc(this).toJSON()})`;
  }
};
var ProtoZoned = {
  ...Proto,
  _tag: "Zoned",
  [symbol]() {
    return pipe(number2(this.epochMillis), combine(hash(this.zone)), cached(this));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Zoned" && this.epochMillis === that.epochMillis && equals(this.zone, that.zone);
  },
  toString() {
    return `DateTime.Zoned(${formatIsoZoned(this)})`;
  }
};
var ProtoTimeZone = {
  [TimeZoneTypeId]: TimeZoneTypeId,
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var ProtoTimeZoneNamed = {
  ...ProtoTimeZone,
  _tag: "Named",
  [symbol]() {
    return cached(this, string(`Named:${this.id}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
  },
  toString() {
    return `TimeZone.Named(${this.id})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Named",
      id: this.id
    };
  }
};
var ProtoTimeZoneOffset = {
  ...ProtoTimeZone,
  _tag: "Offset",
  [symbol]() {
    return cached(this, string(`Offset:${this.offset}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
  },
  toString() {
    return `TimeZone.Offset(${offsetToString(this.offset)})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Offset",
      offset: this.offset
    };
  }
};
var makeZonedProto = (epochMillis, zone, partsUtc) => {
  const self = Object.create(ProtoZoned);
  self.epochMillis = epochMillis;
  self.zone = zone;
  Object.defineProperty(self, "partsUtc", {
    value: partsUtc,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "adjustedEpochMillis", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "partsAdjusted", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var isDateTime = (u) => hasProperty(u, TypeId14);
var isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
var isTimeZoneOffset = (u) => isTimeZone(u) && u._tag === "Offset";
var isTimeZoneNamed = (u) => isTimeZone(u) && u._tag === "Named";
var isUtc = (self) => self._tag === "Utc";
var isZoned = (self) => self._tag === "Zoned";
var Equivalence3 = /* @__PURE__ */ make((a, b) => a.epochMillis === b.epochMillis);
var makeUtc = (epochMillis) => {
  const self = Object.create(ProtoUtc);
  self.epochMillis = epochMillis;
  Object.defineProperty(self, "partsUtc", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var unsafeFromDate = (date3) => {
  const epochMillis = date3.getTime();
  if (Number.isNaN(epochMillis)) {
    throw new IllegalArgumentException2("Invalid date");
  }
  return makeUtc(epochMillis);
};
var unsafeMake6 = (input) => {
  if (isDateTime(input)) {
    return input;
  } else if (input instanceof Date) {
    return unsafeFromDate(input);
  } else if (typeof input === "object") {
    const date3 = /* @__PURE__ */ new Date(0);
    setPartsDate(date3, input);
    return unsafeFromDate(date3);
  } else if (typeof input === "string" && !hasZone(input)) {
    return unsafeFromDate(/* @__PURE__ */ new Date(input + "Z"));
  }
  return unsafeFromDate(new Date(input));
};
var hasZone = (input) => /Z|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
var minEpochMillis = -864e13 + 12 * 60 * 60 * 1e3;
var maxEpochMillis = 864e13 - 14 * 60 * 60 * 1e3;
var unsafeMakeZoned = (input, options) => {
  if (options?.timeZone === void 0 && isDateTime(input) && isZoned(input)) {
    return input;
  }
  const self = unsafeMake6(input);
  if (self.epochMillis < minEpochMillis || self.epochMillis > maxEpochMillis) {
    throw new IllegalArgumentException2(`Epoch millis out of range: ${self.epochMillis}`);
  }
  let zone;
  if (options?.timeZone === void 0) {
    const offset = new Date(self.epochMillis).getTimezoneOffset() * -60 * 1e3;
    zone = zoneMakeOffset(offset);
  } else if (isTimeZone(options?.timeZone)) {
    zone = options.timeZone;
  } else if (typeof options?.timeZone === "number") {
    zone = zoneMakeOffset(options.timeZone);
  } else {
    const parsedZone = zoneFromString(options.timeZone);
    if (isNone2(parsedZone)) {
      throw new IllegalArgumentException2(`Invalid time zone: ${options.timeZone}`);
    }
    zone = parsedZone.value;
  }
  if (options?.adjustForTimeZone !== true) {
    return makeZonedProto(self.epochMillis, zone, self.partsUtc);
  }
  return makeZonedFromAdjusted(self.epochMillis, zone);
};
var makeZoned = /* @__PURE__ */ liftThrowable(unsafeMakeZoned);
var zonedStringRegex = /^(.{17,35})\[(.+)\]$/;
var makeZonedFromString = (input) => {
  const match10 = zonedStringRegex.exec(input);
  if (match10 === null) {
    const offset = parseOffset(input);
    return offset !== null ? makeZoned(input, {
      timeZone: offset
    }) : none2();
  }
  const [, isoString, timeZone] = match10;
  return makeZoned(isoString, {
    timeZone
  });
};
var validZoneCache = /* @__PURE__ */ globalValue("effect/DateTime/validZoneCache", () => /* @__PURE__ */ new Map());
var formatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "longOffset",
  fractionalSecondDigits: 3,
  hourCycle: "h23"
};
var zoneMakeIntl = (format7) => {
  const zoneId = format7.resolvedOptions().timeZone;
  if (validZoneCache.has(zoneId)) {
    return validZoneCache.get(zoneId);
  }
  const zone = Object.create(ProtoTimeZoneNamed);
  zone.id = zoneId;
  zone.format = format7;
  validZoneCache.set(zoneId, zone);
  return zone;
};
var zoneUnsafeMakeNamed = (zoneId) => {
  if (validZoneCache.has(zoneId)) {
    return validZoneCache.get(zoneId);
  }
  try {
    return zoneMakeIntl(new Intl.DateTimeFormat("en-US", {
      ...formatOptions,
      timeZone: zoneId
    }));
  } catch {
    throw new IllegalArgumentException2(`Invalid time zone: ${zoneId}`);
  }
};
var zoneMakeOffset = (offset) => {
  const zone = Object.create(ProtoTimeZoneOffset);
  zone.offset = offset;
  return zone;
};
var zoneMakeNamed = /* @__PURE__ */ liftThrowable(zoneUnsafeMakeNamed);
var offsetZoneRegex = /^(?:GMT|[+-])/;
var zoneFromString = (zone) => {
  if (offsetZoneRegex.test(zone)) {
    const offset = parseOffset(zone);
    return offset === null ? none2() : some2(zoneMakeOffset(offset));
  }
  return zoneMakeNamed(zone);
};
var zoneToString = (self) => {
  if (self._tag === "Offset") {
    return offsetToString(self.offset);
  }
  return self.id;
};
var toDateUtc = (self) => new Date(self.epochMillis);
var toDate = (self) => {
  if (self._tag === "Utc") {
    return new Date(self.epochMillis);
  } else if (self.zone._tag === "Offset") {
    return new Date(self.epochMillis + self.zone.offset);
  } else if (self.adjustedEpochMillis !== void 0) {
    return new Date(self.adjustedEpochMillis);
  }
  const parts2 = self.zone.format.formatToParts(self.epochMillis).filter((_) => _.type !== "literal");
  const date3 = /* @__PURE__ */ new Date(0);
  date3.setUTCFullYear(Number(parts2[2].value), Number(parts2[0].value) - 1, Number(parts2[1].value));
  date3.setUTCHours(Number(parts2[3].value), Number(parts2[4].value), Number(parts2[5].value), Number(parts2[6].value));
  self.adjustedEpochMillis = date3.getTime();
  return date3;
};
var zonedOffset = (self) => {
  const date3 = toDate(self);
  return date3.getTime() - toEpochMillis(self);
};
var offsetToString = (offset) => {
  const abs2 = Math.abs(offset);
  let hours2 = Math.floor(abs2 / (60 * 60 * 1e3));
  let minutes2 = Math.round(abs2 % (60 * 60 * 1e3) / (60 * 1e3));
  if (minutes2 === 60) {
    hours2 += 1;
    minutes2 = 0;
  }
  return `${offset < 0 ? "-" : "+"}${String(hours2).padStart(2, "0")}:${String(minutes2).padStart(2, "0")}`;
};
var zonedOffsetIso = (self) => offsetToString(zonedOffset(self));
var toEpochMillis = (self) => self.epochMillis;
var setPartsDate = (date3, parts2) => {
  if (parts2.year !== void 0) {
    date3.setUTCFullYear(parts2.year);
  }
  if (parts2.month !== void 0) {
    date3.setUTCMonth(parts2.month - 1);
  }
  if (parts2.day !== void 0) {
    date3.setUTCDate(parts2.day);
  }
  if (parts2.weekDay !== void 0) {
    const diff8 = parts2.weekDay - date3.getUTCDay();
    date3.setUTCDate(date3.getUTCDate() + diff8);
  }
  if (parts2.hours !== void 0) {
    date3.setUTCHours(parts2.hours);
  }
  if (parts2.minutes !== void 0) {
    date3.setUTCMinutes(parts2.minutes);
  }
  if (parts2.seconds !== void 0) {
    date3.setUTCSeconds(parts2.seconds);
  }
  if (parts2.millis !== void 0) {
    date3.setUTCMilliseconds(parts2.millis);
  }
};
var makeZonedFromAdjusted = (adjustedMillis, zone) => {
  const offset = zone._tag === "Offset" ? zone.offset : calculateNamedOffset(adjustedMillis, zone);
  return makeZonedProto(adjustedMillis - offset, zone);
};
var offsetRegex = /([+-])(\d{2}):(\d{2})$/;
var parseOffset = (offset) => {
  const match10 = offsetRegex.exec(offset);
  if (match10 === null) {
    return null;
  }
  const [, sign2, hours2, minutes2] = match10;
  return (sign2 === "+" ? 1 : -1) * (Number(hours2) * 60 + Number(minutes2)) * 60 * 1e3;
};
var calculateNamedOffset = (adjustedMillis, zone) => {
  const offset = zone.format.formatToParts(adjustedMillis).find((_) => _.type === "timeZoneName")?.value ?? "";
  if (offset === "GMT") {
    return 0;
  }
  const result = parseOffset(offset);
  if (result === null) {
    return zonedOffset(makeZonedProto(adjustedMillis, zone));
  }
  return result;
};
var formatIso = (self) => toDateUtc(self).toISOString();
var formatIsoOffset = (self) => {
  const date3 = toDate(self);
  return self._tag === "Utc" ? date3.toISOString() : `${date3.toISOString().slice(0, -1)}${zonedOffsetIso(self)}`;
};
var formatIsoZoned = (self) => self.zone._tag === "Offset" ? formatIsoOffset(self) : `${formatIsoOffset(self)}[${self.zone.id}]`;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/String.js
var toUpperCase = (self) => self.toUpperCase();
var toLowerCase = (self) => self.toLowerCase();
var capitalize = (self) => {
  if (self.length === 0) return self;
  return toUpperCase(self[0]) + self.slice(1);
};
var uncapitalize = (self) => {
  if (self.length === 0) return self;
  return toLowerCase(self[0]) + self.slice(1);
};
var isNonEmpty3 = (self) => self.length > 0;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Request.js
var Class5 = Class3;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Effect.js
var isEffect2 = isEffect;
var forEach7 = forEach6;
var succeed5 = succeed;
var suspend3 = suspend;
var _void = void_2;
var catchAll2 = catchAll;
var map11 = map9;
var mapBoth3 = mapBoth2;
var mapError2 = mapError;
var either3 = either2;
var flatMap10 = flatMap7;
var matchEffect2 = matchEffect;
var runFork2 = unsafeForkEffect;
var runPromise = unsafeRunPromiseEffect;
var runSync = unsafeRunSyncEffect;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/ConfigError.js
var InvalidData2 = InvalidData;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/redacted.js
var RedactedSymbolKey = "effect/Redacted";
var redactedRegistry = /* @__PURE__ */ globalValue("effect/Redacted/redactedRegistry", () => /* @__PURE__ */ new WeakMap());
var RedactedTypeId = /* @__PURE__ */ Symbol.for(RedactedSymbolKey);
var proto3 = {
  [RedactedTypeId]: {
    _A: (_) => _
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return "<redacted>";
  },
  toJSON() {
    return "<redacted>";
  },
  [NodeInspectSymbol]() {
    return "<redacted>";
  },
  [symbol]() {
    return pipe(hash(RedactedSymbolKey), combine(hash(redactedRegistry.get(this))), cached(this));
  },
  [symbol2](that) {
    return isRedacted(that) && equals(redactedRegistry.get(this), redactedRegistry.get(that));
  }
};
var isRedacted = (u) => hasProperty(u, RedactedTypeId);
var make31 = (value3) => {
  const redacted2 = Object.create(proto3);
  redactedRegistry.set(redacted2, value3);
  return redacted2;
};
var value = (self) => {
  if (redactedRegistry.has(self)) {
    return redactedRegistry.get(self);
  } else {
    throw new Error("Unable to get redacted value");
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/config.js
var ConfigSymbolKey = "effect/Config";
var ConfigTypeId = /* @__PURE__ */ Symbol.for(ConfigSymbolKey);
var configVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var proto4 = {
  ...CommitPrototype,
  [ConfigTypeId]: configVariance,
  commit() {
    return config(this);
  }
};
var mapOrFail = /* @__PURE__ */ dual(2, (self, f) => {
  const mapOrFail3 = Object.create(proto4);
  mapOrFail3._tag = OP_MAP_OR_FAIL;
  mapOrFail3.original = self;
  mapOrFail3.mapOrFail = f;
  return mapOrFail3;
});
var nested2 = /* @__PURE__ */ dual(2, (self, name) => {
  const nested3 = Object.create(proto4);
  nested3._tag = OP_NESTED;
  nested3.name = name;
  nested3.config = self;
  return nested3;
});
var primitive = (description, parse2) => {
  const primitive2 = Object.create(proto4);
  primitive2._tag = OP_PRIMITIVE;
  primitive2.description = description;
  primitive2.parse = parse2;
  return primitive2;
};
var string3 = (name) => {
  const config2 = primitive("a text property", right2);
  return name === void 0 ? config2 : nested2(config2, name);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Config.js
var mapOrFail2 = mapOrFail;
var string4 = string3;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/DateTime.js
var isDateTime2 = isDateTime;
var isTimeZoneOffset2 = isTimeZoneOffset;
var isTimeZoneNamed2 = isTimeZoneNamed;
var isUtc2 = isUtc;
var isZoned2 = isZoned;
var Equivalence4 = Equivalence3;
var unsafeFromDate2 = unsafeFromDate;
var unsafeMake7 = unsafeMake6;
var unsafeMakeZoned2 = unsafeMakeZoned;
var makeZonedFromString2 = makeZonedFromString;
var zoneUnsafeMakeNamed2 = zoneUnsafeMakeNamed;
var zoneMakeOffset2 = zoneMakeOffset;
var zoneFromString2 = zoneFromString;
var zoneToString2 = zoneToString;
var toDateUtc2 = toDateUtc;
var toEpochMillis2 = toEpochMillis;
var formatIso2 = formatIso;
var formatIsoZoned2 = formatIsoZoned;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/encoding/common.js
var DecodeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Encoding/errors/Decode");
var DecodeException = (input, message) => {
  const out = {
    _tag: "DecodeException",
    [DecodeExceptionTypeId]: DecodeExceptionTypeId,
    input
  };
  if (isString(message)) {
    out.message = message;
  }
  return out;
};
var EncodeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Encoding/errors/Encode");
var EncodeException = (input, message) => {
  const out = {
    _tag: "EncodeException",
    [EncodeExceptionTypeId]: EncodeExceptionTypeId,
    input
  };
  if (isString(message)) {
    out.message = message;
  }
  return out;
};
var encoder = /* @__PURE__ */ new TextEncoder();
var decoder = /* @__PURE__ */ new TextDecoder();

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/encoding/base64.js
var encode = (bytes) => {
  const length2 = bytes.length;
  let result = "";
  let i;
  for (i = 2; i < length2; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += base64abc[bytes[i] & 63];
  }
  if (i === length2 + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === length2) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
};
var decode2 = (str) => {
  const stripped = stripCrlf(str);
  const length2 = stripped.length;
  if (length2 % 4 !== 0) {
    return left2(DecodeException(stripped, `Length must be a multiple of 4, but is ${length2}`));
  }
  const index = stripped.indexOf("=");
  if (index !== -1 && (index < length2 - 2 || index === length2 - 2 && stripped[length2 - 1] !== "=")) {
    return left2(DecodeException(stripped, "Found a '=' character, but it is not at the end"));
  }
  try {
    const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
    const result = new Uint8Array(3 * (length2 / 4) - missingOctets);
    for (let i = 0, j = 0; i < length2; i += 4, j += 3) {
      const buffer = getBase64Code(stripped.charCodeAt(i)) << 18 | getBase64Code(stripped.charCodeAt(i + 1)) << 12 | getBase64Code(stripped.charCodeAt(i + 2)) << 6 | getBase64Code(stripped.charCodeAt(i + 3));
      result[j] = buffer >> 16;
      result[j + 1] = buffer >> 8 & 255;
      result[j + 2] = buffer & 255;
    }
    return right2(result);
  } catch (e) {
    return left2(DecodeException(stripped, e instanceof Error ? e.message : "Invalid input"));
  }
};
var stripCrlf = (str) => str.replace(/[\n\r]/g, "");
function getBase64Code(charCode) {
  if (charCode >= base64codes.length) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  return code;
}
var base64abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"];
var base64codes = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/encoding/base64Url.js
var encode2 = (data) => encode(data).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
var decode3 = (str) => {
  const stripped = stripCrlf(str);
  const length2 = stripped.length;
  if (length2 % 4 === 1) {
    return left2(DecodeException(stripped, `Length should be a multiple of 4, but is ${length2}`));
  }
  if (!/^[-_A-Z0-9]*?={0,2}$/i.test(stripped)) {
    return left2(DecodeException(stripped, "Invalid input"));
  }
  let sanitized = length2 % 4 === 2 ? `${stripped}==` : length2 % 4 === 3 ? `${stripped}=` : stripped;
  sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/");
  return decode2(sanitized);
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/internal/encoding/hex.js
var encode3 = (bytes) => {
  let result = "";
  for (let i = 0; i < bytes.length; ++i) {
    result += bytesToHex[bytes[i]];
  }
  return result;
};
var decode4 = (str) => {
  const bytes = new TextEncoder().encode(str);
  if (bytes.length % 2 !== 0) {
    return left2(DecodeException(str, `Length must be a multiple of 2, but is ${bytes.length}`));
  }
  try {
    const length2 = bytes.length / 2;
    const result = new Uint8Array(length2);
    for (let i = 0; i < length2; i++) {
      const a = fromHexChar(bytes[i * 2]);
      const b = fromHexChar(bytes[i * 2 + 1]);
      result[i] = a << 4 | b;
    }
    return right2(result);
  } catch (e) {
    return left2(DecodeException(str, e instanceof Error ? e.message : "Invalid input"));
  }
};
var bytesToHex = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
var fromHexChar = (byte) => {
  if (48 <= byte && byte <= 57) {
    return byte - 48;
  }
  if (97 <= byte && byte <= 102) {
    return byte - 97 + 10;
  }
  if (65 <= byte && byte <= 70) {
    return byte - 65 + 10;
  }
  throw new TypeError("Invalid input");
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Encoding.js
var encodeBase64 = (input) => typeof input === "string" ? encode(encoder.encode(input)) : encode(input);
var decodeBase64 = (str) => decode2(str);
var decodeBase64String = (str) => map(decodeBase64(str), (_) => decoder.decode(_));
var encodeBase64Url = (input) => typeof input === "string" ? encode2(encoder.encode(input)) : encode2(input);
var decodeBase64Url = (str) => decode3(str);
var decodeBase64UrlString = (str) => map(decodeBase64Url(str), (_) => decoder.decode(_));
var encodeHex = (input) => typeof input === "string" ? encode3(encoder.encode(input)) : encode3(input);
var decodeHex = (str) => decode4(str);
var decodeHexString = (str) => map(decodeHex(str), (_) => decoder.decode(_));
var encodeUriComponent = (str) => try_({
  try: () => encodeURIComponent(str),
  catch: (e) => EncodeException2(str, e instanceof Error ? e.message : "Invalid input")
});
var decodeUriComponent = (str) => try_({
  try: () => decodeURIComponent(str),
  catch: (e) => DecodeException2(str, e instanceof Error ? e.message : "Invalid input")
});
var DecodeException2 = DecodeException;
var EncodeException2 = EncodeException;

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/ParseResult.js
var Pointer = class {
  path;
  actual;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Pointer";
  constructor(path2, actual, issue) {
    this.path = path2;
    this.actual = actual;
    this.issue = issue;
  }
};
var Unexpected = class {
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Unexpected";
  constructor(actual, message) {
    this.actual = actual;
    this.message = message;
  }
};
var Missing = class {
  ast;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Missing";
  /**
   * @since 3.10.0
   */
  actual = void 0;
  constructor(ast, message) {
    this.ast = ast;
    this.message = message;
  }
};
var Composite2 = class {
  ast;
  actual;
  issues;
  output;
  /**
   * @since 3.10.0
   */
  _tag = "Composite";
  constructor(ast, actual, issues, output) {
    this.ast = ast;
    this.actual = actual;
    this.issues = issues;
    this.output = output;
  }
};
var Refinement2 = class {
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Transformation2 = class {
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Transformation";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Type2 = class {
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Type";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var Forbidden = class {
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Forbidden";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var ParseErrorTypeId = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
var ParseError = class extends (/* @__PURE__ */ TaggedError("ParseError")) {
  /**
   * @since 3.10.0
   */
  [ParseErrorTypeId] = ParseErrorTypeId;
  get message() {
    return this.toString();
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return TreeFormatter.formatIssueSync(this.issue);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _id: "ParseError",
      message: this.toString()
    };
  }
  /**
   * @since 3.10.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var parseError = (issue) => new ParseError({
  issue
});
var succeed7 = right2;
var fail6 = left2;
var _try = try_;
var fromOption3 = fromOption2;
var isEither3 = isEither2;
var flatMap11 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: left2,
    onRight: f
  }) : flatMap10(self, f);
});
var map13 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? map(self, f) : map11(self, f);
});
var mapError3 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? mapLeft(self, f) : mapError2(self, f);
});
var mapBoth4 = /* @__PURE__ */ dual(2, (self, options) => {
  return isEither3(self) ? mapBoth(self, {
    onLeft: options.onFailure,
    onRight: options.onSuccess
  }) : mapBoth3(self, options);
});
var orElse5 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: f,
    onRight: right2
  }) : catchAll2(self, f);
});
var mergeInternalOptions = (options, overrideOptions) => {
  if (overrideOptions === void 0 || isNumber(overrideOptions)) {
    return options;
  }
  if (options === void 0) {
    return overrideOptions;
  }
  return {
    ...options,
    ...overrideOptions
  };
};
var getEither = (ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (u, overrideOptions) => parser(u, mergeInternalOptions(options, overrideOptions));
};
var getSync = (ast, isDecoding, options) => {
  const parser = getEither(ast, isDecoding, options);
  return (input, overrideOptions) => getOrThrowWith(parser(input, overrideOptions), parseError);
};
var getOption3 = (ast, isDecoding, options) => {
  const parser = getEither(ast, isDecoding, options);
  return (input, overrideOptions) => getRight3(parser(input, overrideOptions));
};
var getEffect = (ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (input, overrideOptions) => parser(input, {
    ...mergeInternalOptions(options, overrideOptions),
    isEffectAllowed: true
  });
};
var decodeUnknownSync = (schema, options) => getSync(schema.ast, true, options);
var decodeUnknownOption = (schema, options) => getOption3(schema.ast, true, options);
var decodeUnknownEither = (schema, options) => getEither(schema.ast, true, options);
var decodeUnknown = (schema, options) => getEffect(schema.ast, true, options);
var encodeUnknownSync = (schema, options) => getSync(schema.ast, false, options);
var encodeUnknownOption = (schema, options) => getOption3(schema.ast, false, options);
var encodeUnknownEither = (schema, options) => getEither(schema.ast, false, options);
var encodeUnknown = (schema, options) => getEffect(schema.ast, false, options);
var decodeSync = decodeUnknownSync;
var decodeOption = decodeUnknownOption;
var validateSync = (schema, options) => getSync(typeAST(schema.ast), true, options);
var validateOption = (schema, options) => getOption3(typeAST(schema.ast), true, options);
var validateEither = (schema, options) => getEither(typeAST(schema.ast), true, options);
var validate3 = (schema, options) => getEffect(typeAST(schema.ast), true, options);
var is = (schema, options) => {
  const parser = goMemo(typeAST(schema.ast), true);
  return (u, overrideOptions) => isRight2(parser(u, {
    exact: true,
    ...mergeInternalOptions(options, overrideOptions)
  }));
};
var asserts = (schema, options) => {
  const parser = goMemo(typeAST(schema.ast), true);
  return (u, overrideOptions) => {
    const result = parser(u, {
      exact: true,
      ...mergeInternalOptions(options, overrideOptions)
    });
    if (isLeft2(result)) {
      throw parseError(result.left);
    }
  };
};
var encodeSync = encodeUnknownSync;
var encodeOption = encodeUnknownOption;
var decodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var encodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var goMemo = (ast, isDecoding) => {
  const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
  const memo2 = memoMap.get(ast);
  if (memo2) {
    return memo2;
  }
  const raw = go(ast, isDecoding);
  const parseOptionsAnnotation = getParseOptionsAnnotation(ast);
  const parserWithOptions = isSome2(parseOptionsAnnotation) ? (i, options) => raw(i, mergeInternalOptions(options, parseOptionsAnnotation.value)) : raw;
  const decodingFallbackAnnotation = getDecodingFallbackAnnotation(ast);
  const parser = isDecoding && isSome2(decodingFallbackAnnotation) ? (i, options) => handleForbidden(orElse5(parserWithOptions(i, options), decodingFallbackAnnotation.value), ast, i, options) : parserWithOptions;
  memoMap.set(ast, parser);
  return parser;
};
var getConcurrency = (ast) => getOrUndefined2(getConcurrencyAnnotation(ast));
var getBatching = (ast) => getOrUndefined2(getBatchingAnnotation(ast));
var go = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from = goMemo(ast.from, true);
        return (i, options) => {
          options = options ?? defaultParseOption;
          const allErrors = options?.errors === "all";
          const result = flatMap11(orElse5(from(i, options), (ef) => {
            const issue = new Refinement2(ast, i, "From", ef);
            if (allErrors && hasStableFilter(ast) && isComposite2(ef)) {
              return match2(ast.filter(i, options, ast), {
                onNone: () => left2(issue),
                onSome: (ep) => left2(new Composite2(ast, i, [issue, new Refinement2(ast, i, "Predicate", ep)]))
              });
            }
            return left2(issue);
          }), (a) => match2(ast.filter(a, options, ast), {
            onNone: () => right2(a),
            onSome: (ep) => left2(new Refinement2(ast, i, "Predicate", ep))
          }));
          return handleForbidden(result, ast, i, options);
        };
      } else {
        const from = goMemo(typeAST(ast), true);
        const to = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) => handleForbidden(flatMap11(from(i, options), (a) => to(a, options)), ast, i, options);
      }
    }
    case "Transformation": {
      const transform3 = getFinalTransformation(ast.transformation, isDecoding);
      const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i, options) => handleForbidden(flatMap11(mapError3(from(i, options), (e) => new Transformation2(ast, i, isDecoding ? "Encoded" : "Type", e)), (a) => flatMap11(mapError3(transform3(a, options ?? defaultParseOption, ast, i), (e) => new Transformation2(ast, i, "Transformation", e)), (i2) => mapError3(to(i2, options), (e) => new Transformation2(ast, i, isDecoding ? "Type" : "Encoded", e)))), ast, i, options);
    }
    case "Declaration": {
      const parse2 = isDecoding ? ast.decodeUnknown(...ast.typeParameters) : ast.encodeUnknown(...ast.typeParameters);
      return (i, options) => handleForbidden(parse2(i, options ?? defaultParseOption, ast), ast, i, options);
    }
    case "Literal":
      return fromRefinement(ast, (u) => u === ast.literal);
    case "UniqueSymbol":
      return fromRefinement(ast, (u) => u === ast.symbol);
    case "UndefinedKeyword":
      return fromRefinement(ast, isUndefined);
    case "NeverKeyword":
      return fromRefinement(ast, isNever);
    case "UnknownKeyword":
    case "AnyKeyword":
    case "VoidKeyword":
      return right2;
    case "StringKeyword":
      return fromRefinement(ast, isString);
    case "NumberKeyword":
      return fromRefinement(ast, isNumber);
    case "BooleanKeyword":
      return fromRefinement(ast, isBoolean);
    case "BigIntKeyword":
      return fromRefinement(ast, isBigInt);
    case "SymbolKeyword":
      return fromRefinement(ast, isSymbol);
    case "ObjectKeyword":
      return fromRefinement(ast, isObject);
    case "Enums":
      return fromRefinement(ast, (u) => ast.enums.some(([_, value3]) => value3 === u));
    case "TemplateLiteral": {
      const regex = getTemplateLiteralRegExp(ast);
      return fromRefinement(ast, (u) => isString(u) && regex.test(u));
    }
    case "TupleType": {
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = ast.rest.map((annotatedAST) => goMemo(annotatedAST.type, isDecoding));
      let requiredTypes = ast.elements.filter((e) => !e.isOptional);
      if (ast.rest.length > 0) {
        requiredTypes = requiredTypes.concat(ast.rest.slice(1));
      }
      const requiredLen = requiredTypes.length;
      const expectedIndexes = ast.elements.length > 0 ? ast.elements.map((_, i) => i).join(" | ") : "never";
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isArray(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const output = [];
        const len = input.length;
        for (let i2 = len; i2 <= requiredLen - 1; i2++) {
          const e = new Pointer(i2, input, new Missing(requiredTypes[i2 - len]));
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return left2(new Composite2(ast, input, e, output));
          }
        }
        if (ast.rest.length === 0) {
          for (let i2 = ast.elements.length; i2 <= len - 1; i2++) {
            const e = new Pointer(i2, input, new Unexpected(input[i2], `is unexpected, expected: ${expectedIndexes}`));
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return left2(new Composite2(ast, input, e, output));
            }
          }
        }
        let i = 0;
        let queue = void 0;
        for (; i < elements.length; i++) {
          if (len < i + 1) {
            if (ast.elements[i].isOptional) {
              continue;
            }
          } else {
            const parser = elements[i];
            const te = parser(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              }
              output.push([stepKey++, te.right]);
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap10(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                }
                output2.push([nk, t.right]);
                return _void;
              }));
            }
          }
        }
        if (isNonEmptyReadonlyArray(rest)) {
          const [head4, ...tail] = rest;
          for (; i < len - tail.length; i++) {
            const te = head4(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              } else {
                output.push([stepKey++, te.right]);
              }
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap10(either3(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                } else {
                  output2.push([nk, t.right]);
                  return _void;
                }
              }));
            }
          }
          for (let j = 0; j < tail.length; j++) {
            i += j;
            if (len < i + 1) {
              continue;
            } else {
              const te = tail[j](input[i], options);
              if (isEither3(te)) {
                if (isLeft2(te)) {
                  const e = new Pointer(i, input, te.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output)));
                  }
                }
                output.push([stepKey++, te.right]);
              } else {
                const nk = stepKey++;
                const index = i;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap10(either3(te), (t) => {
                  if (isLeft2(t)) {
                    const e = new Pointer(index, input, t.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                    }
                  }
                  output2.push([nk, t.right]);
                  return _void;
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => isNonEmptyArray2(es2) ? left2(new Composite2(ast, input, sortByIndex(es2), sortByIndex(output2))) : right2(sortByIndex(output2));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es),
              output: copy(output)
            };
            return flatMap10(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          output,
          es
        });
      };
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return fromRefinement(ast, isNotNullable);
      }
      const propertySignatures = [];
      const expectedKeysMap = {};
      const expectedKeys = [];
      for (const ps of ast.propertySignatures) {
        propertySignatures.push([goMemo(ps.type, isDecoding), ps]);
        expectedKeysMap[ps.name] = null;
        expectedKeys.push(ps.name);
      }
      const indexSignatures = ast.indexSignatures.map((is2) => [goMemo(is2.parameter, isDecoding), goMemo(is2.type, isDecoding), is2.parameter]);
      const expectedAST = Union.make(ast.indexSignatures.map((is2) => is2.parameter).concat(expectedKeys.map((key) => isSymbol(key) ? new UniqueSymbol(key) : new Literal(key))));
      const expected = goMemo(expectedAST, isDecoding);
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isRecord(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        const onExcessPropertyPreserve = options?.onExcessProperty === "preserve";
        const output = {};
        let inputKeys;
        if (onExcessPropertyError || onExcessPropertyPreserve) {
          inputKeys = ownKeys(input);
          for (const key of inputKeys) {
            const te = expected(key, options);
            if (isEither3(te) && isLeft2(te)) {
              if (onExcessPropertyError) {
                const e = new Pointer(key, input, new Unexpected(input[key], `is unexpected, expected: ${String(expectedAST)}`));
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, output));
                }
              } else {
                output[key] = input[key];
              }
            }
          }
        }
        let queue = void 0;
        const isExact = options?.exact === true;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = propertySignatures[i][1];
          const name = ps.name;
          const hasKey = Object.prototype.hasOwnProperty.call(input, name);
          if (!hasKey) {
            if (ps.isOptional) {
              continue;
            } else if (isExact) {
              const e = new Pointer(name, input, new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
          }
          const parser = propertySignatures[i][0];
          const te = parser(input[name], options);
          if (isEither3(te)) {
            if (isLeft2(te)) {
              const e = new Pointer(name, input, hasKey ? te.left : new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
            output[name] = te.right;
          } else {
            const nk = stepKey++;
            const index = name;
            if (!queue) {
              queue = [];
            }
            queue.push(({
              es: es2,
              output: output2
            }) => flatMap10(either3(te), (t) => {
              if (isLeft2(t)) {
                const e = new Pointer(index, input, hasKey ? t.left : new Missing(ps));
                if (allErrors) {
                  es2.push([nk, e]);
                  return _void;
                } else {
                  return left2(new Composite2(ast, input, e, output2));
                }
              }
              output2[index] = t.right;
              return _void;
            }));
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const indexSignature = indexSignatures[i];
          const parameter = indexSignature[0];
          const type = indexSignature[1];
          const keys6 = getKeysForIndexSignature(input, indexSignature[2]);
          for (const key of keys6) {
            const keu = parameter(key, options);
            if (isEither3(keu) && isRight2(keu)) {
              const vpr = type(input[key], options);
              if (isEither3(vpr)) {
                if (isLeft2(vpr)) {
                  const e = new Pointer(key, input, vpr.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, output));
                  }
                } else {
                  if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                    output[key] = vpr.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index = key;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap10(either3(vpr), (tv) => {
                  if (isLeft2(tv)) {
                    const e = new Pointer(index, input, tv.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, output2));
                    }
                  } else {
                    if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                      output2[key] = tv.right;
                    }
                    return _void;
                  }
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => {
          if (isNonEmptyArray2(es2)) {
            return left2(new Composite2(ast, input, sortByIndex(es2), output2));
          }
          if (options?.propertyOrder === "original") {
            const keys6 = inputKeys || ownKeys(input);
            for (const name of expectedKeys) {
              if (keys6.indexOf(name) === -1) {
                keys6.push(name);
              }
            }
            const out = {};
            for (const key of keys6) {
              if (Object.prototype.hasOwnProperty.call(output2, key)) {
                out[key] = output2[key];
              }
            }
            return right2(out);
          }
          return right2(output2);
        };
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es),
              output: Object.assign({}, output)
            };
            return flatMap10(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          es,
          output
        });
      };
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, isDecoding);
      const ownKeys2 = ownKeys(searchTree.keys);
      const ownKeysLen = ownKeys2.length;
      const astTypesLen = ast.types.length;
      const map15 = /* @__PURE__ */ new Map();
      for (let i = 0; i < astTypesLen; i++) {
        map15.set(ast.types[i], goMemo(ast.types[i], isDecoding));
      }
      const concurrency = getConcurrency(ast) ?? 1;
      const batching = getBatching(ast);
      return (input, options) => {
        const es = [];
        let stepKey = 0;
        let candidates = [];
        if (ownKeysLen > 0) {
          if (isRecordOrArray(input)) {
            for (let i = 0; i < ownKeysLen; i++) {
              const name = ownKeys2[i];
              const buckets = searchTree.keys[name].buckets;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const literal2 = String(input[name]);
                if (Object.prototype.hasOwnProperty.call(buckets, literal2)) {
                  candidates = candidates.concat(buckets[literal2]);
                } else {
                  const {
                    candidates: candidates2,
                    literals
                  } = searchTree.keys[name];
                  const literalsUnion = Union.make(literals);
                  const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([new PropertySignature(name, literalsUnion, false, true)], []) : Union.make(candidates2);
                  es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Type2(literalsUnion, input[name])))]);
                }
              } else {
                const {
                  candidates: candidates2,
                  literals
                } = searchTree.keys[name];
                const fakePropertySignature = new PropertySignature(name, Union.make(literals), false, true);
                const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([fakePropertySignature], []) : Union.make(candidates2);
                es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Missing(fakePropertySignature)))]);
              }
            }
          } else {
            const errorAst = searchTree.candidates.length === astTypesLen ? ast : Union.make(searchTree.candidates);
            es.push([stepKey++, new Type2(errorAst, input)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = void 0;
        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          const pr = map15.get(candidate)(input, options);
          if (isEither3(pr) && (!queue || queue.length === 0)) {
            if (isRight2(pr)) {
              return pr;
            } else {
              es.push([stepKey++, pr.left]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) => suspend3(() => {
              if ("finalResult" in state) {
                return _void;
              } else {
                return flatMap10(either3(pr), (t) => {
                  if (isRight2(t)) {
                    state.finalResult = t;
                  } else {
                    state.es.push([nk, t.left]);
                  }
                  return _void;
                });
              }
            }));
          }
        }
        const computeResult = (es2) => isNonEmptyArray2(es2) ? es2.length === 1 && es2[0][1]._tag === "Type" ? left2(es2[0][1]) : left2(new Composite2(ast, input, sortByIndex(es2))) : (
          // this should never happen
          left2(new Type2(ast, input))
        );
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend3(() => {
            const state = {
              es: copy(es)
            };
            return flatMap10(forEach7(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => {
              if ("finalResult" in state) {
                return state.finalResult;
              }
              return computeResult(state.es);
            });
          });
        }
        return computeResult(es);
      };
    }
    case "Suspend": {
      const get10 = memoizeThunk(() => goMemo(annotations(ast.f(), ast.annotations), isDecoding));
      return (a, options) => get10()(a, options);
    }
  }
};
var fromRefinement = (ast, refinement) => (u) => refinement(u) ? right2(u) : left2(new Type2(ast, u));
var getLiterals = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration": {
      const annotation = getSurrogateAnnotation(ast);
      if (isSome2(annotation)) {
        return getLiterals(annotation.value, isDecoding);
      }
      break;
    }
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature2 = ast.propertySignatures[i];
        const type = isDecoding ? encodedAST(propertySignature2.type) : typeAST(propertySignature2.type);
        if (isLiteral(type) && !propertySignature2.isOptional) {
          out.push([propertySignature2.name, type]);
        }
      }
      return out;
    }
    case "TupleType": {
      const out = [];
      for (let i = 0; i < ast.elements.length; i++) {
        const element2 = ast.elements[i];
        const type = isDecoding ? encodedAST(element2.type) : typeAST(element2.type);
        if (isLiteral(type) && !element2.isOptional) {
          out.push([i, type]);
        }
      }
      return out;
    }
    case "Refinement":
      return getLiterals(ast.from, isDecoding);
    case "Suspend":
      return getLiterals(ast.f(), isDecoding);
    case "Transformation":
      return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
  }
  return [];
};
var getSearchTree = (members, isDecoding) => {
  const keys6 = {};
  const otherwise = [];
  const candidates = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const tags = getLiterals(member, isDecoding);
    if (tags.length > 0) {
      candidates.push(member);
      for (let j = 0; j < tags.length; j++) {
        const [key, literal2] = tags[j];
        const hash3 = String(literal2.literal);
        keys6[key] = keys6[key] || {
          buckets: {},
          literals: [],
          candidates: []
        };
        const buckets = keys6[key].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash3)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash3].push(member);
          keys6[key].literals.push(literal2);
          keys6[key].candidates.push(member);
        } else {
          buckets[hash3] = [member];
          keys6[key].literals.push(literal2);
          keys6[key].candidates.push(member);
          break;
        }
      }
    } else {
      otherwise.push(member);
    }
  }
  return {
    keys: keys6,
    otherwise,
    candidates
  };
};
var dropRightRefinement = (ast) => isRefinement(ast) ? dropRightRefinement(ast.from) : ast;
var handleForbidden = (effect, ast, actual, options) => {
  if (options?.isEffectAllowed === true) {
    return effect;
  }
  if (isEither3(effect)) {
    return effect;
  }
  const scheduler2 = new SyncScheduler();
  const fiber = runFork2(effect, {
    scheduler: scheduler2
  });
  scheduler2.flush();
  const exit3 = fiber.unsafePoll();
  if (exit3) {
    if (isSuccess(exit3)) {
      return right2(exit3.value);
    }
    const cause = exit3.cause;
    if (isFailType2(cause)) {
      return left2(cause.error);
    }
    return left2(new Forbidden(ast, actual, pretty2(cause)));
  }
  return left2(new Forbidden(ast, actual, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
};
var compare = ([a], [b]) => a > b ? 1 : a < b ? -1 : 0;
function sortByIndex(es) {
  return es.sort(compare).map((t) => t[1]);
}
var getFinalTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return right2;
    case "TypeLiteralTransformation":
      return (input) => {
        let out = right2(input);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from, to] = isDecoding ? [pst.from, pst.to] : [pst.to, pst.from];
          const transformation2 = isDecoding ? pst.decode : pst.encode;
          const f = (input2) => {
            const o = transformation2(Object.prototype.hasOwnProperty.call(input2, from) ? some2(input2[from]) : none2());
            delete input2[from];
            if (isSome2(o)) {
              input2[to] = o.value;
            }
            return input2;
          };
          out = map13(out, f);
        }
        return out;
      };
  }
};
var makeTree = (value3, forest = []) => ({
  value: value3,
  forest
});
var TreeFormatter = {
  formatIssue: (issue) => map13(formatTree(issue), drawTree),
  formatIssueSync: (issue) => {
    const e = TreeFormatter.formatIssue(issue);
    return isEither3(e) ? getOrThrow(e) : runSync(e);
  },
  formatError: (error) => TreeFormatter.formatIssue(error.issue),
  formatErrorSync: (error) => TreeFormatter.formatIssueSync(error.issue)
};
var drawTree = (tree) => tree.value + draw("\n", tree.forest);
var draw = (indentation, forest) => {
  let r = "";
  const len = forest.length;
  let tree;
  for (let i = 0; i < len; i++) {
    tree = forest[i];
    const isLast = i === len - 1;
    r += indentation + (isLast ? "\u2514" : "\u251C") + "\u2500 " + tree.value;
    r += draw(indentation + (len > 1 && !isLast ? "\u2502  " : "   "), tree.forest);
  }
  return r;
};
var formatTransformationKind = (kind) => {
  switch (kind) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
};
var formatRefinementKind = (kind) => {
  switch (kind) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
};
var getAnnotated = (issue) => "ast" in issue ? some2(issue.ast) : none2();
var Either_void = /* @__PURE__ */ right2(void 0);
var getCurrentMessage = (issue) => getAnnotated(issue).pipe(flatMap2(getMessageAnnotation), match2({
  onNone: () => Either_void,
  onSome: (messageAnnotation) => {
    const union5 = messageAnnotation(issue);
    if (isString(union5)) {
      return right2({
        message: union5,
        override: false
      });
    }
    if (isEffect2(union5)) {
      return map11(union5, (message) => ({
        message,
        override: false
      }));
    }
    if (isString(union5.message)) {
      return right2({
        message: union5.message,
        override: union5.override
      });
    }
    return map11(union5.message, (message) => ({
      message,
      override: union5.override
    }));
  }
}));
var createParseIssueGuard = (tag2) => (issue) => issue._tag === tag2;
var isComposite2 = /* @__PURE__ */ createParseIssueGuard("Composite");
var isRefinement2 = /* @__PURE__ */ createParseIssueGuard("Refinement");
var isTransformation2 = /* @__PURE__ */ createParseIssueGuard("Transformation");
var getMessage = (issue) => flatMap11(getCurrentMessage(issue), (currentMessage) => {
  if (currentMessage !== void 0) {
    const useInnerMessage = !currentMessage.override && (isComposite2(issue) || isRefinement2(issue) && issue.kind === "From" || isTransformation2(issue) && issue.kind !== "Transformation");
    return useInnerMessage ? isTransformation2(issue) || isRefinement2(issue) ? getMessage(issue.issue) : Either_void : right2(currentMessage.message);
  }
  return Either_void;
});
var getParseIssueTitleAnnotation2 = (issue) => getAnnotated(issue).pipe(flatMap2(getParseIssueTitleAnnotation), flatMapNullable((annotation) => annotation(issue)), getOrUndefined2);
function getRefinementExpected(ast) {
  return getDescriptionAnnotation(ast).pipe(orElse2(() => getTitleAnnotation(ast)), orElse2(() => getAutoTitleAnnotation(ast)), orElse2(() => getIdentifierAnnotation(ast)), getOrElse2(() => `{ ${ast.from} | filter }`));
}
function getDefaultTypeMessage(issue) {
  if (issue.message !== void 0) {
    return issue.message;
  }
  const expected = isRefinement(issue.ast) ? getRefinementExpected(issue.ast) : String(issue.ast);
  return `Expected ${expected}, actual ${formatUnknown(issue.actual)}`;
}
var formatTypeMessage = (issue) => map13(getMessage(issue), (message) => message ?? getParseIssueTitleAnnotation2(issue) ?? getDefaultTypeMessage(issue));
var getParseIssueTitle = (issue) => getParseIssueTitleAnnotation2(issue) ?? String(issue.ast);
var formatForbiddenMessage = (issue) => issue.message ?? "is forbidden";
var formatUnexpectedMessage = (issue) => issue.message ?? "is unexpected";
var formatMissingMessage = (issue) => {
  const missingMessageAnnotation = getMissingMessageAnnotation(issue.ast);
  if (isSome2(missingMessageAnnotation)) {
    const annotation = missingMessageAnnotation.value();
    return isString(annotation) ? right2(annotation) : annotation;
  }
  return right2(issue.message ?? "is missing");
};
var formatTree = (issue) => {
  switch (issue._tag) {
    case "Type":
      return map13(formatTypeMessage(issue), makeTree);
    case "Forbidden":
      return right2(makeTree(getParseIssueTitle(issue), [makeTree(formatForbiddenMessage(issue))]));
    case "Unexpected":
      return right2(makeTree(formatUnexpectedMessage(issue)));
    case "Missing":
      return map13(formatMissingMessage(issue), makeTree);
    case "Transformation":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map13(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatTransformationKind(issue.kind), [tree])]));
      });
    case "Refinement":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map13(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatRefinementKind(issue.kind), [tree])]));
      });
    case "Pointer":
      return map13(formatTree(issue.issue), (tree) => makeTree(formatPath(issue.path), [tree]));
    case "Composite":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        const parseIssueTitle = getParseIssueTitle(issue);
        return isNonEmpty(issue.issues) ? map13(forEach7(issue.issues, formatTree), (forest) => makeTree(parseIssueTitle, forest)) : map13(formatTree(issue.issues), (tree) => makeTree(parseIssueTitle, [tree]));
      });
  }
};
var makeArrayFormatterIssue = (_tag, path2, message) => ({
  _tag,
  path: path2,
  message
});
var ArrayFormatter = {
  formatIssue: (issue) => getArrayFormatterIssues(issue, void 0, []),
  formatIssueSync: (issue) => {
    const e = ArrayFormatter.formatIssue(issue);
    return isEither3(e) ? getOrThrow(e) : runSync(e);
  },
  formatError: (error) => ArrayFormatter.formatIssue(error.issue),
  formatErrorSync: (error) => ArrayFormatter.formatIssueSync(error.issue)
};
var getArrayFormatterIssues = (issue, parentTag, path2) => {
  const _tag = issue._tag;
  switch (_tag) {
    case "Type":
      return map13(formatTypeMessage(issue), (message) => [makeArrayFormatterIssue(parentTag ?? _tag, path2, message)]);
    case "Forbidden":
      return right2([makeArrayFormatterIssue(_tag, path2, formatForbiddenMessage(issue))]);
    case "Unexpected":
      return right2([makeArrayFormatterIssue(_tag, path2, formatUnexpectedMessage(issue))]);
    case "Missing":
      return map13(formatMissingMessage(issue), (message) => [makeArrayFormatterIssue(_tag, path2, message)]);
    case "Pointer":
      return getArrayFormatterIssues(issue.issue, void 0, path2.concat(issue.path));
    case "Composite":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2([makeArrayFormatterIssue(_tag, path2, message)]);
        }
        return isNonEmpty(issue.issues) ? map13(forEach7(issue.issues, (issue2) => getArrayFormatterIssues(issue2, void 0, path2)), flatten) : getArrayFormatterIssues(issue.issues, void 0, path2);
      });
    case "Refinement":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2([makeArrayFormatterIssue(_tag, path2, message)]);
        }
        return getArrayFormatterIssues(issue.issue, issue.kind === "Predicate" ? _tag : void 0, path2);
      });
    case "Transformation":
      return flatMap11(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2([makeArrayFormatterIssue(_tag, path2, message)]);
        }
        return getArrayFormatterIssues(issue.issue, issue.kind === "Transformation" ? _tag : void 0, path2);
      });
  }
};

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Redacted.js
var isRedacted2 = isRedacted;
var make33 = make31;
var value2 = value;
var getEquivalence7 = (isEquivalent) => make((x, y) => isEquivalent(value2(x), value2(y)));

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Schema.js
var Schema_exports = {};
__export(Schema_exports, {
  Any: () => Any,
  Array: () => Array$,
  ArrayEnsure: () => ArrayEnsure,
  ArrayFormatterIssue: () => ArrayFormatterIssue,
  BetweenBigDecimalSchemaId: () => BetweenBigDecimalSchemaId,
  BetweenBigIntSchemaId: () => BetweenBigIntSchemaId,
  BetweenDateSchemaId: () => BetweenDateSchemaId,
  BetweenDurationSchemaId: () => BetweenDurationSchemaId,
  BetweenSchemaId: () => BetweenSchemaId2,
  BigDecimal: () => BigDecimal,
  BigDecimalFromNumber: () => BigDecimalFromNumber,
  BigDecimalFromSelf: () => BigDecimalFromSelf,
  BigInt: () => BigInt$,
  BigIntFromNumber: () => BigIntFromNumber,
  BigIntFromSelf: () => BigIntFromSelf,
  Boolean: () => Boolean$,
  BooleanFromString: () => BooleanFromString,
  BooleanFromUnknown: () => BooleanFromUnknown,
  BrandSchemaId: () => BrandSchemaId,
  Capitalize: () => Capitalize,
  Capitalized: () => Capitalized,
  CapitalizedSchemaId: () => CapitalizedSchemaId,
  Cause: () => Cause,
  CauseFromSelf: () => CauseFromSelf,
  Char: () => Char,
  Chunk: () => Chunk,
  ChunkFromSelf: () => ChunkFromSelf,
  Class: () => Class6,
  Config: () => Config,
  Data: () => Data,
  DataFromSelf: () => DataFromSelf,
  Date: () => Date$,
  DateFromNumber: () => DateFromNumber,
  DateFromSelf: () => DateFromSelf,
  DateFromSelfSchemaId: () => DateFromSelfSchemaId2,
  DateFromString: () => DateFromString,
  DateTimeUtc: () => DateTimeUtc,
  DateTimeUtcFromDate: () => DateTimeUtcFromDate,
  DateTimeUtcFromNumber: () => DateTimeUtcFromNumber,
  DateTimeUtcFromSelf: () => DateTimeUtcFromSelf,
  DateTimeZoned: () => DateTimeZoned,
  DateTimeZonedFromSelf: () => DateTimeZonedFromSelf,
  Defect: () => Defect,
  Duration: () => Duration,
  DurationFromMillis: () => DurationFromMillis,
  DurationFromNanos: () => DurationFromNanos,
  DurationFromSelf: () => DurationFromSelf,
  Either: () => Either,
  EitherFromSelf: () => EitherFromSelf,
  EitherFromUnion: () => EitherFromUnion,
  EndsWithSchemaId: () => EndsWithSchemaId,
  Enums: () => Enums2,
  Exit: () => Exit,
  ExitFromSelf: () => ExitFromSelf,
  FiberId: () => FiberId,
  FiberIdFromSelf: () => FiberIdFromSelf,
  Finite: () => Finite,
  FiniteSchemaId: () => FiniteSchemaId2,
  FromPropertySignature: () => FromPropertySignature,
  GreaterThanBigDecimalSchemaId: () => GreaterThanBigDecimalSchemaId,
  GreaterThanBigIntSchemaId: () => GreaterThanBigIntSchemaId,
  GreaterThanDateSchemaId: () => GreaterThanDateSchemaId,
  GreaterThanDurationSchemaId: () => GreaterThanDurationSchemaId,
  GreaterThanOrEqualToBigDecimalSchemaId: () => GreaterThanOrEqualToBigDecimalSchemaId,
  GreaterThanOrEqualToBigIntSchemaId: () => GreaterThanOrEqualToBigIntSchemaId2,
  GreaterThanOrEqualToDateSchemaId: () => GreaterThanOrEqualToDateSchemaId,
  GreaterThanOrEqualToDurationSchemaId: () => GreaterThanOrEqualToDurationSchemaId,
  GreaterThanOrEqualToSchemaId: () => GreaterThanOrEqualToSchemaId2,
  GreaterThanSchemaId: () => GreaterThanSchemaId2,
  HashMap: () => HashMap,
  HashMapFromSelf: () => HashMapFromSelf,
  HashSet: () => HashSet,
  HashSetFromSelf: () => HashSetFromSelf,
  IncludesSchemaId: () => IncludesSchemaId,
  InstanceOfSchemaId: () => InstanceOfSchemaId,
  Int: () => Int,
  IntSchemaId: () => IntSchemaId2,
  ItemsCountSchemaId: () => ItemsCountSchemaId2,
  JsonNumber: () => JsonNumber,
  JsonNumberSchemaId: () => JsonNumberSchemaId2,
  LengthSchemaId: () => LengthSchemaId2,
  LessThanBigDecimalSchemaId: () => LessThanBigDecimalSchemaId,
  LessThanBigIntSchemaId: () => LessThanBigIntSchemaId2,
  LessThanDateSchemaId: () => LessThanDateSchemaId,
  LessThanDurationSchemaId: () => LessThanDurationSchemaId,
  LessThanOrEqualToBigDecimalSchemaId: () => LessThanOrEqualToBigDecimalSchemaId,
  LessThanOrEqualToBigIntSchemaId: () => LessThanOrEqualToBigIntSchemaId2,
  LessThanOrEqualToDateSchemaId: () => LessThanOrEqualToDateSchemaId,
  LessThanOrEqualToDurationSchemaId: () => LessThanOrEqualToDurationSchemaId,
  LessThanOrEqualToSchemaId: () => LessThanOrEqualToSchemaId2,
  LessThanSchemaId: () => LessThanSchemaId2,
  List: () => List,
  ListFromSelf: () => ListFromSelf,
  Literal: () => Literal2,
  Lowercase: () => Lowercase,
  Lowercased: () => Lowercased,
  LowercasedSchemaId: () => LowercasedSchemaId,
  Map: () => map14,
  MapFromRecord: () => MapFromRecord,
  MapFromSelf: () => MapFromSelf,
  MaxItemsSchemaId: () => MaxItemsSchemaId2,
  MaxLengthSchemaId: () => MaxLengthSchemaId2,
  MinItemsSchemaId: () => MinItemsSchemaId2,
  MinLengthSchemaId: () => MinLengthSchemaId2,
  MultipleOfSchemaId: () => MultipleOfSchemaId,
  Negative: () => Negative,
  NegativeBigDecimalFromSelf: () => NegativeBigDecimalFromSelf,
  NegativeBigDecimalSchemaId: () => NegativeBigDecimalSchemaId,
  NegativeBigInt: () => NegativeBigInt,
  NegativeBigIntFromSelf: () => NegativeBigIntFromSelf,
  Never: () => Never,
  NonEmptyArray: () => NonEmptyArray,
  NonEmptyArrayEnsure: () => NonEmptyArrayEnsure,
  NonEmptyChunk: () => NonEmptyChunk,
  NonEmptyChunkFromSelf: () => NonEmptyChunkFromSelf,
  NonEmptyString: () => NonEmptyString,
  NonEmptyTrimmedString: () => NonEmptyTrimmedString,
  NonNaN: () => NonNaN,
  NonNaNSchemaId: () => NonNaNSchemaId2,
  NonNegative: () => NonNegative,
  NonNegativeBigDecimalFromSelf: () => NonNegativeBigDecimalFromSelf,
  NonNegativeBigDecimalSchemaId: () => NonNegativeBigDecimalSchemaId,
  NonNegativeBigInt: () => NonNegativeBigInt,
  NonNegativeBigIntFromSelf: () => NonNegativeBigIntFromSelf,
  NonNegativeInt: () => NonNegativeInt,
  NonPositive: () => NonPositive,
  NonPositiveBigDecimalFromSelf: () => NonPositiveBigDecimalFromSelf,
  NonPositiveBigDecimalSchemaId: () => NonPositiveBigDecimalSchemaId,
  NonPositiveBigInt: () => NonPositiveBigInt,
  NonPositiveBigIntFromSelf: () => NonPositiveBigIntFromSelf,
  Not: () => Not,
  Null: () => Null,
  NullOr: () => NullOr,
  NullishOr: () => NullishOr,
  Number: () => Number$,
  NumberFromString: () => NumberFromString,
  Object: () => Object$,
  Option: () => Option,
  OptionFromNonEmptyTrimmedString: () => OptionFromNonEmptyTrimmedString,
  OptionFromNullOr: () => OptionFromNullOr,
  OptionFromNullishOr: () => OptionFromNullishOr,
  OptionFromSelf: () => OptionFromSelf,
  OptionFromUndefinedOr: () => OptionFromUndefinedOr,
  PatternSchemaId: () => PatternSchemaId,
  Positive: () => Positive,
  PositiveBigDecimalFromSelf: () => PositiveBigDecimalFromSelf,
  PositiveBigDecimalSchemaId: () => PositiveBigDecimalSchemaId,
  PositiveBigInt: () => PositiveBigInt,
  PositiveBigIntFromSelf: () => PositiveBigIntFromSelf,
  PropertyKey: () => PropertyKey$,
  PropertySignatureDeclaration: () => PropertySignatureDeclaration,
  PropertySignatureTransformation: () => PropertySignatureTransformation2,
  PropertySignatureTypeId: () => PropertySignatureTypeId,
  ReadonlyMap: () => ReadonlyMap,
  ReadonlyMapFromRecord: () => ReadonlyMapFromRecord,
  ReadonlyMapFromSelf: () => ReadonlyMapFromSelf,
  ReadonlySet: () => ReadonlySet,
  ReadonlySetFromSelf: () => ReadonlySetFromSelf,
  Record: () => Record,
  Redacted: () => Redacted,
  RedactedFromSelf: () => RedactedFromSelf,
  RefineSchemaId: () => RefineSchemaId,
  Set: () => set5,
  SetFromSelf: () => SetFromSelf,
  SortedSet: () => SortedSet,
  SortedSetFromSelf: () => SortedSetFromSelf,
  StartsWithSchemaId: () => StartsWithSchemaId,
  String: () => String$,
  StringFromBase64: () => StringFromBase64,
  StringFromBase64Url: () => StringFromBase64Url,
  StringFromHex: () => StringFromHex,
  StringFromUriComponent: () => StringFromUriComponent,
  Struct: () => Struct,
  Symbol: () => Symbol$,
  SymbolFromSelf: () => SymbolFromSelf,
  TaggedClass: () => TaggedClass2,
  TaggedError: () => TaggedError2,
  TaggedRequest: () => TaggedRequest,
  TaggedStruct: () => TaggedStruct,
  TemplateLiteral: () => TemplateLiteral2,
  TemplateLiteralParser: () => TemplateLiteralParser,
  TimeZone: () => TimeZone,
  TimeZoneFromSelf: () => TimeZoneFromSelf,
  TimeZoneNamed: () => TimeZoneNamed,
  TimeZoneNamedFromSelf: () => TimeZoneNamedFromSelf,
  TimeZoneOffset: () => TimeZoneOffset,
  TimeZoneOffsetFromSelf: () => TimeZoneOffsetFromSelf,
  ToPropertySignature: () => ToPropertySignature,
  Trim: () => Trim,
  Trimmed: () => Trimmed,
  TrimmedSchemaId: () => TrimmedSchemaId,
  Tuple: () => Tuple,
  TypeId: () => TypeId15,
  ULID: () => ULID,
  ULIDSchemaId: () => ULIDSchemaId,
  URL: () => URL$,
  URLFromSelf: () => URLFromSelf,
  UUID: () => UUID,
  UUIDSchemaId: () => UUIDSchemaId,
  Uint8: () => Uint8,
  Uint8Array: () => Uint8Array$,
  Uint8ArrayFromBase64: () => Uint8ArrayFromBase64,
  Uint8ArrayFromBase64Url: () => Uint8ArrayFromBase64Url,
  Uint8ArrayFromHex: () => Uint8ArrayFromHex,
  Uint8ArrayFromSelf: () => Uint8ArrayFromSelf,
  Uncapitalize: () => Uncapitalize,
  Uncapitalized: () => Uncapitalized,
  UncapitalizedSchemaId: () => UncapitalizedSchemaId,
  Undefined: () => Undefined,
  UndefinedOr: () => UndefinedOr,
  Union: () => Union2,
  UniqueSymbolFromSelf: () => UniqueSymbolFromSelf,
  Unknown: () => Unknown,
  Uppercase: () => Uppercase,
  Uppercased: () => Uppercased,
  UppercasedSchemaId: () => UppercasedSchemaId,
  ValidDateFromSelf: () => ValidDateFromSelf,
  ValidDateSchemaId: () => ValidDateSchemaId,
  Void: () => Void,
  annotations: () => annotations2,
  asSchema: () => asSchema,
  asSerializable: () => asSerializable,
  asSerializableWithResult: () => asSerializableWithResult,
  asWithResult: () => asWithResult,
  asserts: () => asserts,
  attachPropertySignature: () => attachPropertySignature,
  between: () => between5,
  betweenBigDecimal: () => betweenBigDecimal,
  betweenBigInt: () => betweenBigInt,
  betweenDate: () => betweenDate,
  betweenDuration: () => betweenDuration,
  brand: () => brand,
  capitalized: () => capitalized,
  clamp: () => clamp8,
  clampBigDecimal: () => clampBigDecimal,
  clampBigInt: () => clampBigInt,
  clampDuration: () => clampDuration,
  compose: () => compose2,
  declare: () => declare,
  decode: () => decode5,
  decodeEither: () => decodeEither,
  decodeOption: () => decodeOption,
  decodePromise: () => decodePromise,
  decodeSync: () => decodeSync,
  decodeUnknown: () => decodeUnknown2,
  decodeUnknownEither: () => decodeUnknownEither2,
  decodeUnknownOption: () => decodeUnknownOption,
  decodeUnknownPromise: () => decodeUnknownPromise,
  decodeUnknownSync: () => decodeUnknownSync,
  deserialize: () => deserialize,
  deserializeExit: () => deserializeExit,
  deserializeFailure: () => deserializeFailure,
  deserializeSuccess: () => deserializeSuccess,
  element: () => element,
  encode: () => encode4,
  encodeEither: () => encodeEither,
  encodeOption: () => encodeOption,
  encodePromise: () => encodePromise,
  encodeSync: () => encodeSync,
  encodeUnknown: () => encodeUnknown2,
  encodeUnknownEither: () => encodeUnknownEither2,
  encodeUnknownOption: () => encodeUnknownOption,
  encodeUnknownPromise: () => encodeUnknownPromise,
  encodeUnknownSync: () => encodeUnknownSync,
  encodedBoundSchema: () => encodedBoundSchema,
  encodedSchema: () => encodedSchema,
  endsWith: () => endsWith,
  equivalence: () => equivalence2,
  exitSchema: () => exitSchema,
  extend: () => extend2,
  failureSchema: () => failureSchema,
  filter: () => filter7,
  filterEffect: () => filterEffect,
  finite: () => finite,
  format: () => format6,
  fromBrand: () => fromBrand,
  fromKey: () => fromKey,
  getClassTag: () => getClassTag,
  getNumberIndexedAccess: () => getNumberIndexedAccess2,
  greaterThan: () => greaterThan6,
  greaterThanBigDecimal: () => greaterThanBigDecimal,
  greaterThanBigInt: () => greaterThanBigInt,
  greaterThanDate: () => greaterThanDate,
  greaterThanDuration: () => greaterThanDuration,
  greaterThanOrEqualTo: () => greaterThanOrEqualTo5,
  greaterThanOrEqualToBigDecimal: () => greaterThanOrEqualToBigDecimal,
  greaterThanOrEqualToBigInt: () => greaterThanOrEqualToBigInt,
  greaterThanOrEqualToDate: () => greaterThanOrEqualToDate,
  greaterThanOrEqualToDuration: () => greaterThanOrEqualToDuration,
  head: () => head3,
  headNonEmpty: () => headNonEmpty3,
  headOrElse: () => headOrElse,
  includes: () => includes,
  instanceOf: () => instanceOf,
  int: () => int,
  is: () => is,
  isPropertySignature: () => isPropertySignature,
  isSchema: () => isSchema,
  itemsCount: () => itemsCount,
  keyof: () => keyof2,
  length: () => length,
  lessThan: () => lessThan5,
  lessThanBigDecimal: () => lessThanBigDecimal,
  lessThanBigInt: () => lessThanBigInt,
  lessThanDate: () => lessThanDate,
  lessThanDuration: () => lessThanDuration,
  lessThanOrEqualTo: () => lessThanOrEqualTo5,
  lessThanOrEqualToBigDecimal: () => lessThanOrEqualToBigDecimal,
  lessThanOrEqualToBigInt: () => lessThanOrEqualToBigInt,
  lessThanOrEqualToDate: () => lessThanOrEqualToDate,
  lessThanOrEqualToDuration: () => lessThanOrEqualToDuration,
  lowercased: () => lowercased,
  make: () => make34,
  makePropertySignature: () => makePropertySignature,
  maxItems: () => maxItems,
  maxLength: () => maxLength,
  minItems: () => minItems,
  minLength: () => minLength,
  multipleOf: () => multipleOf,
  mutable: () => mutable2,
  negative: () => negative,
  negativeBigDecimal: () => negativeBigDecimal,
  negativeBigInt: () => negativeBigInt,
  nonEmptyString: () => nonEmptyString2,
  nonNaN: () => nonNaN,
  nonNegative: () => nonNegative,
  nonNegativeBigDecimal: () => nonNegativeBigDecimal,
  nonNegativeBigInt: () => nonNegativeBigInt,
  nonPositive: () => nonPositive,
  nonPositiveBigDecimal: () => nonPositiveBigDecimal,
  nonPositiveBigInt: () => nonPositiveBigInt,
  omit: () => omit4,
  optional: () => optional,
  optionalElement: () => optionalElement,
  optionalToOptional: () => optionalToOptional,
  optionalToRequired: () => optionalToRequired,
  optionalWith: () => optionalWith,
  parseJson: () => parseJson,
  parseNumber: () => parseNumber,
  partial: () => partial2,
  partialWith: () => partialWith,
  pattern: () => pattern,
  pick: () => pick4,
  pickLiteral: () => pickLiteral,
  pluck: () => pluck,
  positive: () => positive,
  positiveBigDecimal: () => positiveBigDecimal,
  positiveBigInt: () => positiveBigInt,
  propertySignature: () => propertySignature,
  rename: () => rename2,
  required: () => required2,
  requiredToOptional: () => requiredToOptional,
  serializableSchema: () => serializableSchema,
  serialize: () => serialize,
  serializeExit: () => serializeExit,
  serializeFailure: () => serializeFailure,
  serializeSuccess: () => serializeSuccess,
  split: () => split,
  standardSchemaV1: () => standardSchemaV1,
  startsWith: () => startsWith,
  successSchema: () => successSchema,
  suspend: () => suspend5,
  symbolSerializable: () => symbolSerializable,
  symbolWithResult: () => symbolWithResult,
  tag: () => tag,
  transform: () => transform2,
  transformLiteral: () => transformLiteral,
  transformLiterals: () => transformLiterals,
  transformOrFail: () => transformOrFail,
  trimmed: () => trimmed,
  typeSchema: () => typeSchema,
  uncapitalized: () => uncapitalized,
  uppercased: () => uppercased,
  validDate: () => validDate,
  validate: () => validate4,
  validateEither: () => validateEither2,
  validateOption: () => validateOption,
  validatePromise: () => validatePromise,
  validateSync: () => validateSync,
  withConstructorDefault: () => withConstructorDefault,
  withDecodingDefault: () => withDecodingDefault,
  withDefaults: () => withDefaults
});

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Struct.js
var Struct_exports = {};
__export(Struct_exports, {
  evolve: () => evolve,
  get: () => get9,
  getEquivalence: () => getEquivalence8,
  getOrder: () => getOrder3,
  keys: () => keys5,
  omit: () => omit3,
  pick: () => pick3
});
var pick3 = /* @__PURE__ */ dual((args2) => isObject(args2[0]), (s, ...keys6) => {
  const out = {};
  for (const k of keys6) {
    if (k in s) {
      out[k] = s[k];
    }
  }
  return out;
});
var omit3 = /* @__PURE__ */ dual((args2) => isObject(args2[0]), (s, ...keys6) => {
  const out = {
    ...s
  };
  for (const k of keys6) {
    delete out[k];
  }
  return out;
});
var getEquivalence8 = struct;
var getOrder3 = struct2;
var evolve = /* @__PURE__ */ dual(2, (obj, t) => {
  const out = {
    ...obj
  };
  for (const k in t) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      out[k] = t[k](obj[k]);
    }
  }
  return out;
});
var get9 = (key) => (s) => s[key];
var keys5 = (o) => Object.keys(o);

// ../../node_modules/.pnpm/effect@3.16.12/node_modules/effect/dist/esm/Schema.js
var TypeId15 = /* @__PURE__ */ Symbol.for("effect/Schema");
function make34(ast) {
  return class SchemaClass {
    [TypeId15] = variance5;
    static ast = ast;
    static annotations(annotations3) {
      return make34(mergeSchemaAnnotations(this.ast, annotations3));
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static toString() {
      return String(ast);
    }
    static Type;
    static Encoded;
    static Context;
    static [TypeId15] = variance5;
  };
}
var variance5 = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _I: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var makeStandardResult = (exit3) => isSuccess(exit3) ? exit3.value : makeStandardFailureResult(pretty2(exit3.cause));
var makeStandardFailureResult = (message) => ({
  issues: [{
    message
  }]
});
var makeStandardFailureFromParseIssue = (issue) => map11(ArrayFormatter.formatIssue(issue), (issues) => ({
  issues: issues.map((issue2) => ({
    path: issue2.path,
    message: issue2.message
  }))
}));
var standardSchemaV1 = (schema, overrideOptions) => {
  const decodeUnknown3 = decodeUnknown(schema, {
    errors: "all"
  });
  return class StandardSchemaV1Class extends make34(schema.ast) {
    static "~standard" = {
      version: 1,
      vendor: "effect",
      validate(value3) {
        const scheduler2 = new SyncScheduler();
        const fiber = runFork2(matchEffect2(decodeUnknown3(value3, overrideOptions), {
          onFailure: makeStandardFailureFromParseIssue,
          onSuccess: (value4) => succeed5({
            value: value4
          })
        }), {
          scheduler: scheduler2
        });
        scheduler2.flush();
        const exit3 = fiber.unsafePoll();
        if (exit3) {
          return makeStandardResult(exit3);
        }
        return new Promise((resolve) => {
          fiber.addObserver((exit4) => {
            resolve(makeStandardResult(exit4));
          });
        });
      }
    };
  };
};
var builtInAnnotations = {
  schemaId: SchemaIdAnnotationId,
  message: MessageAnnotationId,
  missingMessage: MissingMessageAnnotationId,
  identifier: IdentifierAnnotationId,
  title: TitleAnnotationId,
  description: DescriptionAnnotationId,
  examples: ExamplesAnnotationId,
  default: DefaultAnnotationId,
  documentation: DocumentationAnnotationId,
  jsonSchema: JSONSchemaAnnotationId,
  arbitrary: ArbitraryAnnotationId,
  pretty: PrettyAnnotationId,
  equivalence: EquivalenceAnnotationId,
  concurrency: ConcurrencyAnnotationId,
  batching: BatchingAnnotationId,
  parseIssueTitle: ParseIssueTitleAnnotationId,
  parseOptions: ParseOptionsAnnotationId,
  decodingFallback: DecodingFallbackAnnotationId
};
var toASTAnnotations = (annotations3) => {
  if (!annotations3) {
    return {};
  }
  const out = {
    ...annotations3
  };
  for (const key in builtInAnnotations) {
    if (key in annotations3) {
      const id = builtInAnnotations[key];
      out[id] = annotations3[key];
      delete out[key];
    }
  }
  return out;
};
var mergeSchemaAnnotations = (ast, annotations3) => annotations(ast, toASTAnnotations(annotations3));
function asSchema(schema) {
  return schema;
}
var format6 = (schema) => String(schema.ast);
var encodedSchema = (schema) => make34(encodedAST(schema.ast));
var encodedBoundSchema = (schema) => make34(encodedBoundAST(schema.ast));
var typeSchema = (schema) => make34(typeAST(schema.ast));
var encodeUnknown2 = (schema, options) => {
  const encodeUnknown3 = encodeUnknown(schema, options);
  return (u, overrideOptions) => mapError3(encodeUnknown3(u, overrideOptions), parseError);
};
var encodeUnknownEither2 = (schema, options) => {
  const encodeUnknownEither3 = encodeUnknownEither(schema, options);
  return (u, overrideOptions) => mapLeft(encodeUnknownEither3(u, overrideOptions), parseError);
};
var encodeUnknownPromise = (schema, options) => {
  const parser = encodeUnknown2(schema, options);
  return (u, overrideOptions) => runPromise(parser(u, overrideOptions));
};
var encode4 = encodeUnknown2;
var encodeEither = encodeUnknownEither2;
var encodePromise = encodeUnknownPromise;
var decodeUnknown2 = (schema, options) => {
  const decodeUnknown3 = decodeUnknown(schema, options);
  return (u, overrideOptions) => mapError3(decodeUnknown3(u, overrideOptions), parseError);
};
var decodeUnknownEither2 = (schema, options) => {
  const decodeUnknownEither3 = decodeUnknownEither(schema, options);
  return (u, overrideOptions) => mapLeft(decodeUnknownEither3(u, overrideOptions), parseError);
};
var decodeUnknownPromise = (schema, options) => {
  const parser = decodeUnknown2(schema, options);
  return (u, overrideOptions) => runPromise(parser(u, overrideOptions));
};
var decode5 = decodeUnknown2;
var decodeEither = decodeUnknownEither2;
var decodePromise = decodeUnknownPromise;
var validate4 = (schema, options) => {
  const validate5 = validate3(schema, options);
  return (u, overrideOptions) => mapError3(validate5(u, overrideOptions), parseError);
};
var validateEither2 = (schema, options) => {
  const validateEither3 = validateEither(schema, options);
  return (u, overrideOptions) => mapLeft(validateEither3(u, overrideOptions), parseError);
};
var validatePromise = (schema, options) => {
  const parser = validate4(schema, options);
  return (u, overrideOptions) => runPromise(parser(u, overrideOptions));
};
var isSchema = (u) => hasProperty(u, TypeId15) && isObject(u[TypeId15]);
function getDefaultLiteralAST(literals) {
  return isMembers(literals) ? Union.make(mapMembers(literals, (literal2) => new Literal(literal2))) : new Literal(literals[0]);
}
function makeLiteralClass(literals, ast = getDefaultLiteralAST(literals)) {
  return class LiteralClass extends make34(ast) {
    static annotations(annotations3) {
      return makeLiteralClass(this.literals, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static literals = [...literals];
  };
}
function Literal2(...literals) {
  return isNonEmptyReadonlyArray(literals) ? makeLiteralClass(literals) : Never;
}
var pickLiteral = (...literals) => (_schema) => Literal2(...literals);
var UniqueSymbolFromSelf = (symbol3) => make34(new UniqueSymbol(symbol3));
var getDefaultEnumsAST = (enums) => new Enums(Object.keys(enums).filter((key) => typeof enums[enums[key]] !== "number").map((key) => [key, enums[key]]));
var makeEnumsClass = (enums, ast = getDefaultEnumsAST(enums)) => class EnumsClass extends make34(ast) {
  static annotations(annotations3) {
    return makeEnumsClass(this.enums, mergeSchemaAnnotations(this.ast, annotations3));
  }
  static enums = {
    ...enums
  };
};
var Enums2 = (enums) => makeEnumsClass(enums);
var TemplateLiteral2 = (...[head4, ...tail]) => {
  const spans = [];
  let h = "";
  let ts = tail;
  if (isSchema(head4)) {
    if (isLiteral(head4.ast)) {
      h = String(head4.ast.literal);
    } else {
      ts = [head4, ...ts];
    }
  } else {
    h = String(head4);
  }
  for (let i = 0; i < ts.length; i++) {
    const item = ts[i];
    if (isSchema(item)) {
      if (i < ts.length - 1) {
        const next = ts[i + 1];
        if (isSchema(next)) {
          if (isLiteral(next.ast)) {
            spans.push(new TemplateLiteralSpan(item.ast, String(next.ast.literal)));
            i++;
            continue;
          }
        } else {
          spans.push(new TemplateLiteralSpan(item.ast, String(next)));
          i++;
          continue;
        }
      }
      spans.push(new TemplateLiteralSpan(item.ast, ""));
    } else {
      spans.push(new TemplateLiteralSpan(new Literal(item), ""));
    }
  }
  if (isNonEmptyArray2(spans)) {
    return make34(new TemplateLiteral(h, spans));
  } else {
    return make34(new TemplateLiteral("", [new TemplateLiteralSpan(new Literal(h), "")]));
  }
};
function getTemplateLiteralParserCoercedElement(encoded, schema) {
  const ast = encoded.ast;
  switch (ast._tag) {
    case "Literal": {
      const literal2 = ast.literal;
      if (!isString(literal2)) {
        const s = String(literal2);
        return transform2(Literal2(s), schema, {
          strict: true,
          decode: () => literal2,
          encode: () => s
        });
      }
      break;
    }
    case "NumberKeyword":
      return compose2(NumberFromString, schema);
    case "Union": {
      const members = [];
      let hasCoercions = false;
      for (const member of ast.types) {
        const schema2 = make34(member);
        const encoded2 = encodedSchema(schema2);
        const coerced = getTemplateLiteralParserCoercedElement(encoded2, schema2);
        if (coerced) {
          hasCoercions = true;
        }
        members.push(coerced ?? schema2);
      }
      return hasCoercions ? compose2(Union2(...members), schema) : schema;
    }
  }
}
var TemplateLiteralParser = (...params) => {
  const encodedSchemas = [];
  const elements = [];
  const schemas = [];
  let coerced = false;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const schema = isSchema(param) ? param : Literal2(param);
    schemas.push(schema);
    const encoded = encodedSchema(schema);
    encodedSchemas.push(encoded);
    const element2 = getTemplateLiteralParserCoercedElement(encoded, schema);
    if (element2) {
      elements.push(element2);
      coerced = true;
    } else {
      elements.push(schema);
    }
  }
  const from = TemplateLiteral2(...encodedSchemas);
  const re = getTemplateLiteralCapturingRegExp(from.ast);
  let to = Tuple(...elements);
  if (coerced) {
    to = to.annotations({
      [AutoTitleAnnotationId]: format6(Tuple(...schemas))
    });
  }
  return class TemplateLiteralParserClass extends transformOrFail(from, to, {
    strict: false,
    decode: (i, _, ast) => {
      const match10 = re.exec(i);
      return match10 ? succeed7(match10.slice(1, params.length + 1)) : fail6(new Type2(ast, i, `${re.source}: no match for ${JSON.stringify(i)}`));
    },
    encode: (tuple2) => succeed7(tuple2.join(""))
  }) {
    static params = params.slice();
  };
};
var declareConstructor = (typeParameters, options, annotations3) => makeDeclareClass(typeParameters, new Declaration(typeParameters.map((tp) => tp.ast), (...typeParameters2) => options.decode(...typeParameters2.map(make34)), (...typeParameters2) => options.encode(...typeParameters2.map(make34)), toASTAnnotations(annotations3)));
var declarePrimitive = (is2, annotations3) => {
  const decodeUnknown3 = () => (input, _, ast) => is2(input) ? succeed7(input) : fail6(new Type2(ast, input));
  const encodeUnknown3 = decodeUnknown3;
  return makeDeclareClass([], new Declaration([], decodeUnknown3, encodeUnknown3, toASTAnnotations(annotations3)));
};
function makeDeclareClass(typeParameters, ast) {
  return class DeclareClass extends make34(ast) {
    static annotations(annotations3) {
      return makeDeclareClass(this.typeParameters, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static typeParameters = [...typeParameters];
  };
}
var declare = function() {
  if (Array.isArray(arguments[0])) {
    const typeParameters = arguments[0];
    const options = arguments[1];
    const annotations4 = arguments[2];
    return declareConstructor(typeParameters, options, annotations4);
  }
  const is2 = arguments[0];
  const annotations3 = arguments[1];
  return declarePrimitive(is2, annotations3);
};
var BrandSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Brand");
var fromBrand = (constructor, annotations3) => (self) => {
  const out = makeBrandClass(self, new Refinement(self.ast, function predicate(a, _, ast) {
    const either4 = constructor.either(a);
    return isLeft2(either4) ? some2(new Type2(ast, a, either4.left.map((v) => v.message).join(", "))) : none2();
  }, toASTAnnotations({
    schemaId: BrandSchemaId,
    [BrandSchemaId]: {
      constructor
    },
    ...annotations3
  })));
  return out;
};
var InstanceOfSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/InstanceOf");
var instanceOf = (constructor, annotations3) => declare((u) => u instanceof constructor, {
  title: constructor.name,
  description: `an instance of ${constructor.name}`,
  pretty: () => String,
  schemaId: InstanceOfSchemaId,
  [InstanceOfSchemaId]: {
    constructor
  },
  ...annotations3
});
var Undefined = class extends (/* @__PURE__ */ make34(undefinedKeyword)) {
};
var Void = class extends (/* @__PURE__ */ make34(voidKeyword)) {
};
var Null = class extends (/* @__PURE__ */ make34($null)) {
};
var Never = class extends (/* @__PURE__ */ make34(neverKeyword)) {
};
var Unknown = class extends (/* @__PURE__ */ make34(unknownKeyword)) {
};
var Any = class extends (/* @__PURE__ */ make34(anyKeyword)) {
};
var BigIntFromSelf = class extends (/* @__PURE__ */ make34(bigIntKeyword)) {
};
var SymbolFromSelf = class extends (/* @__PURE__ */ make34(symbolKeyword)) {
};
var String$ = class extends (/* @__PURE__ */ make34(stringKeyword)) {
};
var Number$ = class extends (/* @__PURE__ */ make34(numberKeyword)) {
};
var Boolean$ = class extends (/* @__PURE__ */ make34(booleanKeyword)) {
};
var Object$ = class extends (/* @__PURE__ */ make34(objectKeyword)) {
};
var getDefaultUnionAST = (members) => Union.make(members.map((m) => m.ast));
function makeUnionClass(members, ast = getDefaultUnionAST(members)) {
  return class UnionClass extends make34(ast) {
    static annotations(annotations3) {
      return makeUnionClass(this.members, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static members = [...members];
  };
}
function Union2(...members) {
  return isMembers(members) ? makeUnionClass(members) : isNonEmptyReadonlyArray(members) ? members[0] : Never;
}
var NullOr = (self) => Union2(self, Null);
var UndefinedOr = (self) => Union2(self, Undefined);
var NullishOr = (self) => Union2(self, Null, Undefined);
var keyof2 = (self) => make34(keyof(self.ast));
var element = (self) => new ElementImpl(new OptionalType(self.ast, false), self);
var optionalElement = (self) => new ElementImpl(new OptionalType(self.ast, true), self);
var ElementImpl = class _ElementImpl {
  ast;
  from;
  [TypeId15];
  _Token;
  constructor(ast, from) {
    this.ast = ast;
    this.from = from;
  }
  annotations(annotations3) {
    return new _ElementImpl(new OptionalType(this.ast.type, this.ast.isOptional, {
      ...this.ast.annotations,
      ...toASTAnnotations(annotations3)
    }), this.from);
  }
  toString() {
    return `${this.ast.type}${this.ast.isOptional ? "?" : ""}`;
  }
};
var getDefaultTupleTypeAST = (elements, rest) => new TupleType(elements.map((el) => isSchema(el) ? new OptionalType(el.ast, false) : el.ast), rest.map((el) => isSchema(el) ? new Type(el.ast) : el.ast), true);
function makeTupleTypeClass(elements, rest, ast = getDefaultTupleTypeAST(elements, rest)) {
  return class TupleTypeClass extends make34(ast) {
    static annotations(annotations3) {
      return makeTupleTypeClass(this.elements, this.rest, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static elements = [...elements];
    static rest = [...rest];
  };
}
function Tuple(...args2) {
  return Array.isArray(args2[0]) ? makeTupleTypeClass(args2[0], args2.slice(1)) : makeTupleTypeClass(args2, []);
}
function makeArrayClass(value3, ast) {
  return class ArrayClass extends makeTupleTypeClass([], [value3], ast) {
    static annotations(annotations3) {
      return makeArrayClass(this.value, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static value = value3;
  };
}
var Array$ = (value3) => makeArrayClass(value3);
function makeNonEmptyArrayClass(value3, ast) {
  return class NonEmptyArrayClass extends makeTupleTypeClass([value3], [value3], ast) {
    static annotations(annotations3) {
      return makeNonEmptyArrayClass(this.value, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static value = value3;
  };
}
var NonEmptyArray = (value3) => makeNonEmptyArrayClass(value3);
function ArrayEnsure(value3) {
  return transform2(Union2(value3, Array$(value3)), Array$(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => ensure(i),
    encode: (a) => a.length === 1 ? a[0] : a
  });
}
function NonEmptyArrayEnsure(value3) {
  return transform2(Union2(value3, NonEmptyArray(value3)), NonEmptyArray(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => isNonEmptyReadonlyArray(i) ? i : of(i),
    encode: (a) => a.length === 1 ? a[0] : a
  });
}
var formatPropertySignatureToken = (isOptional) => isOptional ? '"?:"' : '":"';
var PropertySignatureDeclaration = class extends OptionalType {
  isReadonly;
  defaultValue;
  /**
   * @since 3.10.0
   */
  _tag = "PropertySignatureDeclaration";
  constructor(type, isOptional, isReadonly, annotations3, defaultValue) {
    super(type, isOptional, annotations3);
    this.isReadonly = isReadonly;
    this.defaultValue = defaultValue;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    const token = formatPropertySignatureToken(this.isOptional);
    const type = String(this.type);
    return `PropertySignature<${token}, ${type}, never, ${token}, ${type}>`;
  }
};
var FromPropertySignature = class extends OptionalType {
  isReadonly;
  fromKey;
  constructor(type, isOptional, isReadonly, annotations3, fromKey2) {
    super(type, isOptional, annotations3);
    this.isReadonly = isReadonly;
    this.fromKey = fromKey2;
  }
};
var ToPropertySignature = class extends OptionalType {
  isReadonly;
  defaultValue;
  constructor(type, isOptional, isReadonly, annotations3, defaultValue) {
    super(type, isOptional, annotations3);
    this.isReadonly = isReadonly;
    this.defaultValue = defaultValue;
  }
};
var formatPropertyKey2 = (p) => {
  if (p === void 0) {
    return "never";
  }
  if (isString(p)) {
    return JSON.stringify(p);
  }
  return String(p);
};
var PropertySignatureTransformation2 = class {
  from;
  to;
  decode;
  encode;
  /**
   * @since 3.10.0
   */
  _tag = "PropertySignatureTransformation";
  constructor(from, to, decode6, encode5) {
    this.from = from;
    this.to = to;
    this.decode = decode6;
    this.encode = encode5;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return `PropertySignature<${formatPropertySignatureToken(this.to.isOptional)}, ${this.to.type}, ${formatPropertyKey2(this.from.fromKey)}, ${formatPropertySignatureToken(this.from.isOptional)}, ${this.from.type}>`;
  }
};
var mergeSignatureAnnotations = (ast, annotations3) => {
  switch (ast._tag) {
    case "PropertySignatureDeclaration": {
      return new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, {
        ...ast.annotations,
        ...annotations3
      }, ast.defaultValue);
    }
    case "PropertySignatureTransformation": {
      return new PropertySignatureTransformation2(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, {
        ...ast.to.annotations,
        ...annotations3
      }, ast.to.defaultValue), ast.decode, ast.encode);
    }
  }
};
var PropertySignatureTypeId = /* @__PURE__ */ Symbol.for("effect/PropertySignature");
var isPropertySignature = (u) => hasProperty(u, PropertySignatureTypeId);
var PropertySignatureImpl = class _PropertySignatureImpl {
  ast;
  [TypeId15];
  [PropertySignatureTypeId] = null;
  _TypeToken;
  _Key;
  _EncodedToken;
  _HasDefault;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  annotations(annotations3) {
    return new _PropertySignatureImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations3)));
  }
  toString() {
    return String(this.ast);
  }
};
var makePropertySignature = (ast) => new PropertySignatureImpl(ast);
var PropertySignatureWithFromImpl = class _PropertySignatureWithFromImpl extends PropertySignatureImpl {
  from;
  constructor(ast, from) {
    super(ast);
    this.from = from;
  }
  annotations(annotations3) {
    return new _PropertySignatureWithFromImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations3)), this.from);
  }
};
var propertySignature = (self) => new PropertySignatureWithFromImpl(new PropertySignatureDeclaration(self.ast, false, true, {}, void 0), self);
var withConstructorDefault = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  const ast = self.ast;
  switch (ast._tag) {
    case "PropertySignatureDeclaration":
      return makePropertySignature(new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, ast.annotations, defaultValue));
    case "PropertySignatureTransformation":
      return makePropertySignature(new PropertySignatureTransformation2(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, ast.to.annotations, defaultValue), ast.decode, ast.encode));
  }
});
var applyDefaultValue = (o, defaultValue) => match2(o, {
  onNone: () => some2(defaultValue()),
  onSome: (value3) => some2(value3 === void 0 ? defaultValue() : value3)
});
var pruneUndefined2 = (ast) => pruneUndefined(ast, pruneUndefined2, (ast2) => {
  const pruned = pruneUndefined2(ast2.to);
  if (pruned) {
    return new Transformation(ast2.from, pruned, ast2.transformation);
  }
});
var withDecodingDefault = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  const ast = self.ast;
  switch (ast._tag) {
    case "PropertySignatureDeclaration": {
      const to = typeAST(ast.type);
      return makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(ast.type, ast.isOptional, ast.isReadonly, ast.annotations), new ToPropertySignature(pruneUndefined2(to) ?? to, false, true, {}, ast.defaultValue), (o) => applyDefaultValue(o, defaultValue), identity));
    }
    case "PropertySignatureTransformation": {
      const to = ast.to.type;
      return makePropertySignature(new PropertySignatureTransformation2(ast.from, new ToPropertySignature(pruneUndefined2(to) ?? to, false, ast.to.isReadonly, ast.to.annotations, ast.to.defaultValue), (o) => applyDefaultValue(ast.decode(o), defaultValue), ast.encode));
    }
  }
});
var withDefaults = /* @__PURE__ */ dual(2, (self, defaults) => self.pipe(withDecodingDefault(defaults.decoding), withConstructorDefault(defaults.constructor)));
var fromKey = /* @__PURE__ */ dual(2, (self, key) => {
  const ast = self.ast;
  switch (ast._tag) {
    case "PropertySignatureDeclaration": {
      return makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(ast.type, ast.isOptional, ast.isReadonly, ast.annotations, key), new ToPropertySignature(typeAST(ast.type), ast.isOptional, ast.isReadonly, {}, ast.defaultValue), identity, identity));
    }
    case "PropertySignatureTransformation":
      return makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(ast.from.type, ast.from.isOptional, ast.from.isReadonly, ast.from.annotations, key), ast.to, ast.decode, ast.encode));
  }
});
var optionalToRequired = (from, to, options) => makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(from.ast, true, true, {}, void 0), new ToPropertySignature(to.ast, false, true, {}, void 0), (o) => some2(options.decode(o)), flatMap2(options.encode)));
var requiredToOptional = (from, to, options) => makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(from.ast, false, true, {}, void 0), new ToPropertySignature(to.ast, true, true, {}, void 0), flatMap2(options.decode), (o) => some2(options.encode(o))));
var optionalToOptional = (from, to, options) => makePropertySignature(new PropertySignatureTransformation2(new FromPropertySignature(from.ast, true, true, {}, void 0), new ToPropertySignature(to.ast, true, true, {}, void 0), options.decode, options.encode));
var optionalPropertySignatureAST = (self, options) => {
  const isExact = options?.exact;
  const defaultValue = options?.default;
  const isNullable2 = options?.nullable;
  const asOption = options?.as == "Option";
  const asOptionEncode = options?.onNoneEncoding ? orElse2(options.onNoneEncoding) : identity;
  if (isExact) {
    if (defaultValue) {
      if (isNullable2) {
        return withConstructorDefault(optionalToRequired(NullOr(self), typeSchema(self), {
          decode: match2({
            onNone: defaultValue,
            onSome: (a) => a === null ? defaultValue() : a
          }),
          encode: some2
        }), defaultValue).ast;
      } else {
        return withConstructorDefault(optionalToRequired(self, typeSchema(self), {
          decode: match2({
            onNone: defaultValue,
            onSome: identity
          }),
          encode: some2
        }), defaultValue).ast;
      }
    } else if (asOption) {
      if (isNullable2) {
        return optionalToRequired(NullOr(self), OptionFromSelf(typeSchema(self)), {
          decode: filter(isNotNull),
          encode: asOptionEncode
        }).ast;
      } else {
        return optionalToRequired(self, OptionFromSelf(typeSchema(self)), {
          decode: identity,
          encode: identity
        }).ast;
      }
    } else {
      if (isNullable2) {
        return optionalToOptional(NullOr(self), typeSchema(self), {
          decode: filter(isNotNull),
          encode: identity
        }).ast;
      } else {
        return new PropertySignatureDeclaration(self.ast, true, true, {}, void 0);
      }
    }
  } else {
    if (defaultValue) {
      if (isNullable2) {
        return withConstructorDefault(optionalToRequired(NullishOr(self), typeSchema(self), {
          decode: match2({
            onNone: defaultValue,
            onSome: (a) => a == null ? defaultValue() : a
          }),
          encode: some2
        }), defaultValue).ast;
      } else {
        return withConstructorDefault(optionalToRequired(UndefinedOr(self), typeSchema(self), {
          decode: match2({
            onNone: defaultValue,
            onSome: (a) => a === void 0 ? defaultValue() : a
          }),
          encode: some2
        }), defaultValue).ast;
      }
    } else if (asOption) {
      if (isNullable2) {
        return optionalToRequired(NullishOr(self), OptionFromSelf(typeSchema(self)), {
          decode: filter((a) => a != null),
          encode: asOptionEncode
        }).ast;
      } else {
        return optionalToRequired(UndefinedOr(self), OptionFromSelf(typeSchema(self)), {
          decode: filter(isNotUndefined),
          encode: asOptionEncode
        }).ast;
      }
    } else {
      if (isNullable2) {
        return optionalToOptional(NullishOr(self), UndefinedOr(typeSchema(self)), {
          decode: filter(isNotNull),
          encode: identity
        }).ast;
      } else {
        return new PropertySignatureDeclaration(UndefinedOr(self).ast, true, true, {}, void 0);
      }
    }
  }
};
var optional = (self) => {
  const ast = self.ast === undefinedKeyword || self.ast === neverKeyword ? undefinedKeyword : UndefinedOr(self).ast;
  return new PropertySignatureWithFromImpl(new PropertySignatureDeclaration(ast, true, true, {}, void 0), self);
};
var optionalWith = /* @__PURE__ */ dual((args2) => isSchema(args2[0]), (self, options) => {
  return new PropertySignatureWithFromImpl(optionalPropertySignatureAST(self, options), self);
});
var preserveMissingMessageAnnotation = /* @__PURE__ */ pickAnnotations([MissingMessageAnnotationId]);
var getDefaultTypeLiteralAST = (fields, records) => {
  const ownKeys2 = ownKeys(fields);
  const pss = [];
  if (ownKeys2.length > 0) {
    const from = [];
    const to = [];
    const transformations = [];
    for (let i = 0; i < ownKeys2.length; i++) {
      const key = ownKeys2[i];
      const field = fields[key];
      if (isPropertySignature(field)) {
        const ast = field.ast;
        switch (ast._tag) {
          case "PropertySignatureDeclaration": {
            const type = ast.type;
            const isOptional = ast.isOptional;
            const toAnnotations = ast.annotations;
            from.push(new PropertySignature(key, type, isOptional, true, preserveMissingMessageAnnotation(ast)));
            to.push(new PropertySignature(key, typeAST(type), isOptional, true, toAnnotations));
            pss.push(new PropertySignature(key, type, isOptional, true, toAnnotations));
            break;
          }
          case "PropertySignatureTransformation": {
            const fromKey2 = ast.from.fromKey ?? key;
            from.push(new PropertySignature(fromKey2, ast.from.type, ast.from.isOptional, true, ast.from.annotations));
            to.push(new PropertySignature(key, ast.to.type, ast.to.isOptional, true, ast.to.annotations));
            transformations.push(new PropertySignatureTransformation(fromKey2, key, ast.decode, ast.encode));
            break;
          }
        }
      } else {
        from.push(new PropertySignature(key, field.ast, false, true));
        to.push(new PropertySignature(key, typeAST(field.ast), false, true));
        pss.push(new PropertySignature(key, field.ast, false, true));
      }
    }
    if (isNonEmptyReadonlyArray(transformations)) {
      const issFrom = [];
      const issTo = [];
      for (const r of records) {
        const {
          indexSignatures,
          propertySignatures
        } = record2(r.key.ast, r.value.ast);
        propertySignatures.forEach((ps) => {
          from.push(ps);
          to.push(new PropertySignature(ps.name, typeAST(ps.type), ps.isOptional, ps.isReadonly, ps.annotations));
        });
        indexSignatures.forEach((is2) => {
          issFrom.push(is2);
          issTo.push(new IndexSignature(is2.parameter, typeAST(is2.type), is2.isReadonly));
        });
      }
      return new Transformation(new TypeLiteral(from, issFrom, {
        [AutoTitleAnnotationId]: "Struct (Encoded side)"
      }), new TypeLiteral(to, issTo, {
        [AutoTitleAnnotationId]: "Struct (Type side)"
      }), new TypeLiteralTransformation(transformations));
    }
  }
  const iss = [];
  for (const r of records) {
    const {
      indexSignatures,
      propertySignatures
    } = record2(r.key.ast, r.value.ast);
    propertySignatures.forEach((ps) => pss.push(ps));
    indexSignatures.forEach((is2) => iss.push(is2));
  }
  return new TypeLiteral(pss, iss);
};
var lazilyMergeDefaults = (fields, out) => {
  const ownKeys2 = ownKeys(fields);
  for (const key of ownKeys2) {
    const field = fields[key];
    if (out[key] === void 0 && isPropertySignature(field)) {
      const ast = field.ast;
      const defaultValue = ast._tag === "PropertySignatureDeclaration" ? ast.defaultValue : ast.to.defaultValue;
      if (defaultValue !== void 0) {
        out[key] = defaultValue();
      }
    }
  }
  return out;
};
function makeTypeLiteralClass(fields, records, ast = getDefaultTypeLiteralAST(fields, records)) {
  return class TypeLiteralClass extends make34(ast) {
    static annotations(annotations3) {
      return makeTypeLiteralClass(this.fields, this.records, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static fields = {
      ...fields
    };
    static records = [...records];
    static make = (props, options) => {
      const propsWithDefaults = lazilyMergeDefaults(fields, {
        ...props
      });
      return getDisableValidationMakeOption(options) ? propsWithDefaults : validateSync(this)(propsWithDefaults);
    };
    static pick(...keys6) {
      return Struct(pick3(fields, ...keys6));
    }
    static omit(...keys6) {
      return Struct(omit3(fields, ...keys6));
    }
  };
}
function Struct(fields, ...records) {
  return makeTypeLiteralClass(fields, records);
}
var tag = (tag2) => Literal2(tag2).pipe(propertySignature, withConstructorDefault(() => tag2));
var TaggedStruct = (value3, fields) => Struct({
  _tag: tag(value3),
  ...fields
});
function makeRecordClass(key, value3, ast) {
  return class RecordClass extends makeTypeLiteralClass({}, [{
    key,
    value: value3
  }], ast) {
    static annotations(annotations3) {
      return makeRecordClass(key, value3, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static key = key;
    static value = value3;
  };
}
var Record = (options) => makeRecordClass(options.key, options.value);
var pick4 = (...keys6) => (self) => make34(pick(self.ast, keys6));
var omit4 = (...keys6) => (self) => make34(omit(self.ast, keys6));
var pluck = /* @__PURE__ */ dual(2, (schema, key) => {
  const ps = getPropertyKeyIndexedAccess(typeAST(schema.ast), key);
  const value3 = make34(ps.isOptional ? orUndefined(ps.type) : ps.type);
  const out = transform2(schema.pipe(pick4(key)), value3, {
    strict: true,
    decode: (i) => i[key],
    encode: (a) => ps.isOptional && a === void 0 ? {} : {
      [key]: a
    }
  });
  return out;
});
function makeBrandClass(from, ast) {
  return class BrandClass extends make34(ast) {
    static annotations(annotations3) {
      return makeBrandClass(this.from, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static make = (a, options) => {
      return getDisableValidationMakeOption(options) ? a : validateSync(this)(a);
    };
    static from = from;
  };
}
var brand = (brand2, annotations3) => (self) => {
  const annotation = match2(getBrandAnnotation(self.ast), {
    onNone: () => [brand2],
    onSome: (brands) => [...brands, brand2]
  });
  const ast = annotations(self.ast, toASTAnnotations({
    [BrandAnnotationId]: annotation,
    ...annotations3
  }));
  return makeBrandClass(self, ast);
};
var partial2 = (self) => make34(partial(self.ast));
var partialWith = /* @__PURE__ */ dual((args2) => isSchema(args2[0]), (self, options) => make34(partial(self.ast, options)));
var required2 = (self) => make34(required(self.ast));
var mutable2 = (schema) => make34(mutable(schema.ast));
var intersectTypeLiterals = (x, y, path2) => {
  if (isTypeLiteral(x) && isTypeLiteral(y)) {
    const propertySignatures = [...x.propertySignatures];
    for (const ps of y.propertySignatures) {
      const name = ps.name;
      const i = propertySignatures.findIndex((ps2) => ps2.name === name);
      if (i === -1) {
        propertySignatures.push(ps);
      } else {
        const {
          isOptional,
          type
        } = propertySignatures[i];
        propertySignatures[i] = new PropertySignature(name, extendAST(type, ps.type, path2.concat(name)), isOptional, true);
      }
    }
    return new TypeLiteral(propertySignatures, x.indexSignatures.concat(y.indexSignatures));
  }
  throw new Error(getSchemaExtendErrorMessage(x, y, path2));
};
var preserveRefinementAnnotations = /* @__PURE__ */ omitAnnotations([IdentifierAnnotationId]);
var addRefinementToMembers = (refinement, asts) => asts.map((ast) => new Refinement(ast, refinement.filter, preserveRefinementAnnotations(refinement)));
var extendAST = (x, y, path2) => Union.make(intersectUnionMembers([x], [y], path2));
var getTypes = (ast) => isUnion(ast) ? ast.types : [ast];
var intersectUnionMembers = (xs, ys, path2) => flatMap3(xs, (x) => flatMap3(ys, (y) => {
  switch (y._tag) {
    case "Literal": {
      if (isString(y.literal) && isStringKeyword(x) || isNumber(y.literal) && isNumberKeyword(x) || isBoolean(y.literal) && isBooleanKeyword(x)) {
        return [y];
      }
      break;
    }
    case "StringKeyword": {
      if (y === stringKeyword) {
        if (isStringKeyword(x) || isLiteral(x) && isString(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path2));
        }
      } else if (x === stringKeyword) {
        return [y];
      }
      break;
    }
    case "NumberKeyword": {
      if (y === numberKeyword) {
        if (isNumberKeyword(x) || isLiteral(x) && isNumber(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path2));
        }
      } else if (x === numberKeyword) {
        return [y];
      }
      break;
    }
    case "BooleanKeyword": {
      if (y === booleanKeyword) {
        if (isBooleanKeyword(x) || isLiteral(x) && isBoolean(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path2));
        }
      } else if (x === booleanKeyword) {
        return [y];
      }
      break;
    }
    case "Union":
      return intersectUnionMembers(getTypes(x), y.types, path2);
    case "Suspend":
      return [new Suspend(() => extendAST(x, y.f(), path2))];
    case "Refinement":
      return addRefinementToMembers(y, intersectUnionMembers(getTypes(x), getTypes(y.from), path2));
    case "TypeLiteral": {
      switch (x._tag) {
        case "Union":
          return intersectUnionMembers(x.types, [y], path2);
        case "Suspend":
          return [new Suspend(() => extendAST(x.f(), y, path2))];
        case "Refinement":
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path2));
        case "TypeLiteral":
          return [intersectTypeLiterals(x, y, path2)];
        case "Transformation": {
          const transformation = x.transformation;
          const from = intersectTypeLiterals(x.from, y, path2);
          const to = intersectTypeLiterals(x.to, typeAST(y), path2);
          switch (transformation._tag) {
            case "TypeLiteralTransformation":
              return [new Transformation(from, to, new TypeLiteralTransformation(transformation.propertySignatureTransformations))];
            case "ComposeTransformation":
              return [new Transformation(from, to, composeTransformation)];
            case "FinalTransformation":
              return [new Transformation(from, to, new FinalTransformation((fromA, options, ast, fromI) => map13(transformation.decode(fromA, options, ast, fromI), (partial3) => ({
                ...fromA,
                ...partial3
              })), (toI, options, ast, toA) => map13(transformation.encode(toI, options, ast, toA), (partial3) => ({
                ...toI,
                ...partial3
              }))))];
          }
        }
      }
      break;
    }
    case "Transformation": {
      if (isTransformation(x)) {
        if (isTypeLiteralTransformation(y.transformation) && isTypeLiteralTransformation(x.transformation)) {
          return [new Transformation(intersectTypeLiterals(x.from, y.from, path2), intersectTypeLiterals(x.to, y.to, path2), new TypeLiteralTransformation(y.transformation.propertySignatureTransformations.concat(x.transformation.propertySignatureTransformations)))];
        }
      } else {
        return intersectUnionMembers([y], [x], path2);
      }
      break;
    }
  }
  throw new Error(getSchemaExtendErrorMessage(x, y, path2));
}));
var extend2 = /* @__PURE__ */ dual(2, (self, that) => make34(extendAST(self.ast, that.ast, [])));
var compose2 = /* @__PURE__ */ dual((args2) => isSchema(args2[1]), (from, to) => makeTransformationClass(from, to, compose(from.ast, to.ast)));
var suspend5 = (f) => make34(new Suspend(() => f().ast));
var RefineSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Refine");
function makeRefineClass(from, filter8, ast) {
  return class RefineClass extends make34(ast) {
    static annotations(annotations3) {
      return makeRefineClass(this.from, this.filter, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static [RefineSchemaId] = from;
    static from = from;
    static filter = filter8;
    static make = (a, options) => {
      return getDisableValidationMakeOption(options) ? a : validateSync(this)(a);
    };
  };
}
var fromFilterPredicateReturnTypeItem = (item, ast, input) => {
  if (isBoolean(item)) {
    return item ? none2() : some2(new Type2(ast, input));
  }
  if (isString(item)) {
    return some2(new Type2(ast, input, item));
  }
  if (item !== void 0) {
    if ("_tag" in item) {
      return some2(item);
    }
    const issue = new Type2(ast, input, item.message);
    return some2(isNonEmptyReadonlyArray(item.path) ? new Pointer(item.path, input, issue) : issue);
  }
  return none2();
};
var toFilterParseIssue = (out, ast, input) => {
  if (isSingle(out)) {
    return fromFilterPredicateReturnTypeItem(out, ast, input);
  }
  if (isNonEmptyReadonlyArray(out)) {
    const issues = filterMap2(out, (issue) => fromFilterPredicateReturnTypeItem(issue, ast, input));
    if (isNonEmptyReadonlyArray(issues)) {
      return some2(issues.length === 1 ? issues[0] : new Composite2(ast, input, issues));
    }
  }
  return none2();
};
function filter7(predicate, annotations3) {
  return (self) => {
    function filter8(input, options, ast2) {
      return toFilterParseIssue(predicate(input, options, ast2), ast2, input);
    }
    const ast = new Refinement(self.ast, filter8, toASTAnnotations(annotations3));
    return makeRefineClass(self, filter8, ast);
  };
}
var filterEffect = /* @__PURE__ */ dual(2, (self, f) => transformOrFail(self, typeSchema(self), {
  strict: true,
  decode: (i, options, ast) => flatMap11(f(i, options, ast), (filterReturnType) => match2(toFilterParseIssue(filterReturnType, ast, i), {
    onNone: () => succeed7(i),
    onSome: fail6
  })),
  encode: (a) => succeed7(a)
}));
function makeTransformationClass(from, to, ast) {
  return class TransformationClass extends make34(ast) {
    static annotations(annotations3) {
      return makeTransformationClass(this.from, this.to, mergeSchemaAnnotations(this.ast, annotations3));
    }
    static from = from;
    static to = to;
  };
}
var transformOrFail = /* @__PURE__ */ dual((args2) => isSchema(args2[0]) && isSchema(args2[1]), (from, to, options) => makeTransformationClass(from, to, new Transformation(from.ast, to.ast, new FinalTransformation(options.decode, options.encode))));
var transform2 = /* @__PURE__ */ dual((args2) => isSchema(args2[0]) && isSchema(args2[1]), (from, to, options) => transformOrFail(from, to, {
  strict: true,
  decode: (fromA, _options, _ast, toA) => succeed7(options.decode(fromA, toA)),
  encode: (toI, _options, _ast, toA) => succeed7(options.encode(toI, toA))
}));
function transformLiteral(from, to) {
  return transform2(Literal2(from), Literal2(to), {
    strict: true,
    decode: () => to,
    encode: () => from
  });
}
function transformLiterals(...pairs) {
  return Union2(...pairs.map(([from, to]) => transformLiteral(from, to)));
}
var attachPropertySignature = /* @__PURE__ */ dual((args2) => isSchema(args2[0]), (schema, key, value3, annotations3) => {
  const ast = extend2(typeSchema(schema), Struct({
    [key]: isSymbol(value3) ? UniqueSymbolFromSelf(value3) : Literal2(value3)
  })).ast;
  return make34(new Transformation(schema.ast, annotations3 ? mergeSchemaAnnotations(ast, annotations3) : ast, new TypeLiteralTransformation([new PropertySignatureTransformation(key, key, () => some2(value3), () => none2())])));
});
var annotations2 = /* @__PURE__ */ dual(2, (self, annotations3) => self.annotations(annotations3));
var rename2 = /* @__PURE__ */ dual(2, (self, mapping) => make34(rename(self.ast, mapping)));
var TrimmedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Trimmed");
var trimmed = (annotations3) => (self) => self.pipe(filter7((a) => a === a.trim(), {
  schemaId: TrimmedSchemaId,
  title: "trimmed",
  description: "a string with no leading or trailing whitespace",
  jsonSchema: {
    pattern: "^\\S[\\s\\S]*\\S$|^\\S$|^$"
  },
  ...annotations3
}));
var MaxLengthSchemaId2 = MaxLengthSchemaId;
var maxLength = (maxLength2, annotations3) => (self) => self.pipe(filter7((a) => a.length <= maxLength2, {
  schemaId: MaxLengthSchemaId2,
  title: `maxLength(${maxLength2})`,
  description: `a string at most ${maxLength2} character(s) long`,
  jsonSchema: {
    maxLength: maxLength2
  },
  ...annotations3
}));
var MinLengthSchemaId2 = MinLengthSchemaId;
var minLength = (minLength2, annotations3) => (self) => self.pipe(filter7((a) => a.length >= minLength2, {
  schemaId: MinLengthSchemaId2,
  title: `minLength(${minLength2})`,
  description: `a string at least ${minLength2} character(s) long`,
  jsonSchema: {
    minLength: minLength2
  },
  ...annotations3
}));
var LengthSchemaId2 = LengthSchemaId;
var length = (length2, annotations3) => (self) => {
  const minLength2 = isObject(length2) ? Math.max(0, Math.floor(length2.min)) : Math.max(0, Math.floor(length2));
  const maxLength2 = isObject(length2) ? Math.max(minLength2, Math.floor(length2.max)) : minLength2;
  if (minLength2 !== maxLength2) {
    return self.pipe(filter7((a) => a.length >= minLength2 && a.length <= maxLength2, {
      schemaId: LengthSchemaId2,
      title: `length({ min: ${minLength2}, max: ${maxLength2})`,
      description: `a string at least ${minLength2} character(s) and at most ${maxLength2} character(s) long`,
      jsonSchema: {
        minLength: minLength2,
        maxLength: maxLength2
      },
      ...annotations3
    }));
  }
  return self.pipe(filter7((a) => a.length === minLength2, {
    schemaId: LengthSchemaId2,
    title: `length(${minLength2})`,
    description: minLength2 === 1 ? `a single character` : `a string ${minLength2} character(s) long`,
    jsonSchema: {
      minLength: minLength2,
      maxLength: minLength2
    },
    ...annotations3
  }));
};
var PatternSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Pattern");
var pattern = (regex, annotations3) => (self) => {
  const source = regex.source;
  return self.pipe(filter7((a) => {
    regex.lastIndex = 0;
    return regex.test(a);
  }, {
    schemaId: PatternSchemaId,
    [PatternSchemaId]: {
      regex
    },
    // title: `pattern(/${source}/)`, // avoiding this because it can be very long
    description: `a string matching the pattern ${source}`,
    jsonSchema: {
      pattern: source
    },
    ...annotations3
  }));
};
var StartsWithSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/StartsWith");
var startsWith = (startsWith2, annotations3) => (self) => {
  const formatted = JSON.stringify(startsWith2);
  return self.pipe(filter7((a) => a.startsWith(startsWith2), {
    schemaId: StartsWithSchemaId,
    [StartsWithSchemaId]: {
      startsWith: startsWith2
    },
    title: `startsWith(${formatted})`,
    description: `a string starting with ${formatted}`,
    jsonSchema: {
      pattern: `^${startsWith2}`
    },
    ...annotations3
  }));
};
var EndsWithSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/EndsWith");
var endsWith = (endsWith2, annotations3) => (self) => {
  const formatted = JSON.stringify(endsWith2);
  return self.pipe(filter7((a) => a.endsWith(endsWith2), {
    schemaId: EndsWithSchemaId,
    [EndsWithSchemaId]: {
      endsWith: endsWith2
    },
    title: `endsWith(${formatted})`,
    description: `a string ending with ${formatted}`,
    jsonSchema: {
      pattern: `^.*${endsWith2}$`
    },
    ...annotations3
  }));
};
var IncludesSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Includes");
var includes = (searchString, annotations3) => (self) => {
  const formatted = JSON.stringify(searchString);
  return self.pipe(filter7((a) => a.includes(searchString), {
    schemaId: IncludesSchemaId,
    [IncludesSchemaId]: {
      includes: searchString
    },
    title: `includes(${formatted})`,
    description: `a string including ${formatted}`,
    jsonSchema: {
      pattern: `.*${searchString}.*`
    },
    ...annotations3
  }));
};
var LowercasedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Lowercased");
var lowercased = (annotations3) => (self) => self.pipe(filter7((a) => a === a.toLowerCase(), {
  schemaId: LowercasedSchemaId,
  title: "lowercased",
  description: "a lowercase string",
  jsonSchema: {
    pattern: "^[^A-Z]*$"
  },
  ...annotations3
}));
var Lowercased = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ lowercased({
  identifier: "Lowercased"
}))) {
};
var UppercasedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Uppercased");
var uppercased = (annotations3) => (self) => self.pipe(filter7((a) => a === a.toUpperCase(), {
  schemaId: UppercasedSchemaId,
  title: "uppercased",
  description: "an uppercase string",
  jsonSchema: {
    pattern: "^[^a-z]*$"
  },
  ...annotations3
}));
var Uppercased = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ uppercased({
  identifier: "Uppercased"
}))) {
};
var CapitalizedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Capitalized");
var capitalized = (annotations3) => (self) => self.pipe(filter7((a) => a[0]?.toUpperCase() === a[0], {
  schemaId: CapitalizedSchemaId,
  title: "capitalized",
  description: "a capitalized string",
  jsonSchema: {
    pattern: "^[^a-z]?.*$"
  },
  ...annotations3
}));
var Capitalized = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ capitalized({
  identifier: "Capitalized"
}))) {
};
var UncapitalizedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Uncapitalized");
var uncapitalized = (annotations3) => (self) => self.pipe(filter7((a) => a[0]?.toLowerCase() === a[0], {
  schemaId: UncapitalizedSchemaId,
  title: "uncapitalized",
  description: "a uncapitalized string",
  jsonSchema: {
    pattern: "^[^A-Z]?.*$"
  },
  ...annotations3
}));
var Uncapitalized = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ uncapitalized({
  identifier: "Uncapitalized"
}))) {
};
var Char = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ length(1, {
  identifier: "Char"
}))) {
};
var nonEmptyString2 = (annotations3) => minLength(1, {
  title: "nonEmptyString",
  description: "a non empty string",
  ...annotations3
});
var Lowercase = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string that will be converted to lowercase"
}), Lowercased, {
  strict: true,
  decode: (i) => i.toLowerCase(),
  encode: identity
}).annotations({
  identifier: "Lowercase"
})) {
};
var Uppercase = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string that will be converted to uppercase"
}), Uppercased, {
  strict: true,
  decode: (i) => i.toUpperCase(),
  encode: identity
}).annotations({
  identifier: "Uppercase"
})) {
};
var Capitalize = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string that will be converted to a capitalized format"
}), Capitalized, {
  strict: true,
  decode: (i) => capitalize(i),
  encode: identity
}).annotations({
  identifier: "Capitalize"
})) {
};
var Uncapitalize = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string that will be converted to an uncapitalized format"
}), Uncapitalized, {
  strict: true,
  decode: (i) => uncapitalize(i),
  encode: identity
}).annotations({
  identifier: "Uncapitalize"
})) {
};
var Trimmed = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ trimmed({
  identifier: "Trimmed"
}))) {
};
var NonEmptyTrimmedString = class extends (/* @__PURE__ */ Trimmed.pipe(/* @__PURE__ */ nonEmptyString2({
  identifier: "NonEmptyTrimmedString"
}))) {
};
var Trim = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string that will be trimmed"
}), Trimmed, {
  strict: true,
  decode: (i) => i.trim(),
  encode: identity
}).annotations({
  identifier: "Trim"
})) {
};
var split = (separator) => transform2(String$.annotations({
  description: "a string that will be split"
}), Array$(String$), {
  strict: true,
  decode: (i) => i.split(separator),
  encode: (a) => a.join(separator)
});
var getErrorMessage2 = (e) => e instanceof Error ? e.message : String(e);
var getParseJsonTransformation = (options) => transformOrFail(String$.annotations({
  description: "a string to be decoded into JSON"
}), Unknown, {
  strict: true,
  decode: (i, _, ast) => _try({
    try: () => JSON.parse(i, options?.reviver),
    catch: (e) => new Type2(ast, i, getErrorMessage2(e))
  }),
  encode: (a, _, ast) => _try({
    try: () => JSON.stringify(a, options?.replacer, options?.space),
    catch: (e) => new Type2(ast, a, getErrorMessage2(e))
  })
}).annotations({
  title: "parseJson",
  schemaId: ParseJsonSchemaId
});
var parseJson = (schemaOrOptions, o) => isSchema(schemaOrOptions) ? compose2(parseJson(o), schemaOrOptions) : getParseJsonTransformation(schemaOrOptions);
var NonEmptyString = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ nonEmptyString2({
  identifier: "NonEmptyString"
}))) {
};
var UUIDSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/UUID");
var uuidRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
var UUID = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ pattern(uuidRegexp, {
  schemaId: UUIDSchemaId,
  identifier: "UUID",
  jsonSchema: {
    format: "uuid",
    pattern: uuidRegexp.source
  },
  description: "a Universally Unique Identifier",
  arbitrary: () => (fc) => fc.uuid()
}))) {
};
var ULIDSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/ULID");
var ulidRegexp = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;
var ULID = class extends (/* @__PURE__ */ String$.pipe(/* @__PURE__ */ pattern(ulidRegexp, {
  schemaId: ULIDSchemaId,
  identifier: "ULID",
  description: "a Universally Unique Lexicographically Sortable Identifier",
  arbitrary: () => (fc) => fc.ulid()
}))) {
};
var URLFromSelf = class extends (/* @__PURE__ */ instanceOf(URL, {
  identifier: "URLFromSelf",
  arbitrary: () => (fc) => fc.webUrl().map((s) => new URL(s)),
  pretty: () => (url2) => url2.toString()
})) {
};
var URL$ = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a URL"
}), URLFromSelf, {
  strict: true,
  decode: (i, _, ast) => _try({
    try: () => new URL(i),
    catch: (e) => new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a URL. ${getErrorMessage2(e)}`)
  }),
  encode: (a) => succeed7(a.toString())
}).annotations({
  identifier: "URL",
  pretty: () => (url2) => url2.toString()
})) {
};
var FiniteSchemaId2 = FiniteSchemaId;
var finite = (annotations3) => (self) => self.pipe(filter7(Number.isFinite, {
  schemaId: FiniteSchemaId2,
  title: "finite",
  description: "a finite number",
  jsonSchema: {
    "type": "number"
  },
  ...annotations3
}));
var GreaterThanSchemaId2 = GreaterThanSchemaId;
var greaterThan6 = (exclusiveMinimum, annotations3) => (self) => self.pipe(filter7((a) => a > exclusiveMinimum, {
  schemaId: GreaterThanSchemaId2,
  title: `greaterThan(${exclusiveMinimum})`,
  description: exclusiveMinimum === 0 ? "a positive number" : `a number greater than ${exclusiveMinimum}`,
  jsonSchema: {
    exclusiveMinimum
  },
  ...annotations3
}));
var GreaterThanOrEqualToSchemaId2 = GreaterThanOrEqualToSchemaId;
var greaterThanOrEqualTo5 = (minimum, annotations3) => (self) => self.pipe(filter7((a) => a >= minimum, {
  schemaId: GreaterThanOrEqualToSchemaId2,
  title: `greaterThanOrEqualTo(${minimum})`,
  description: minimum === 0 ? "a non-negative number" : `a number greater than or equal to ${minimum}`,
  jsonSchema: {
    minimum
  },
  ...annotations3
}));
var MultipleOfSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/MultipleOf");
var multipleOf = (divisor, annotations3) => (self) => {
  const positiveDivisor = Math.abs(divisor);
  return self.pipe(filter7((a) => remainder(a, divisor) === 0, {
    schemaId: MultipleOfSchemaId,
    title: `multipleOf(${positiveDivisor})`,
    description: `a number divisible by ${positiveDivisor}`,
    jsonSchema: {
      multipleOf: positiveDivisor
    },
    ...annotations3
  }));
};
var IntSchemaId2 = IntSchemaId;
var int = (annotations3) => (self) => self.pipe(filter7((a) => Number.isSafeInteger(a), {
  schemaId: IntSchemaId2,
  title: "int",
  description: "an integer",
  jsonSchema: {
    type: "integer"
  },
  ...annotations3
}));
var LessThanSchemaId2 = LessThanSchemaId;
var lessThan5 = (exclusiveMaximum, annotations3) => (self) => self.pipe(filter7((a) => a < exclusiveMaximum, {
  schemaId: LessThanSchemaId2,
  title: `lessThan(${exclusiveMaximum})`,
  description: exclusiveMaximum === 0 ? "a negative number" : `a number less than ${exclusiveMaximum}`,
  jsonSchema: {
    exclusiveMaximum
  },
  ...annotations3
}));
var LessThanOrEqualToSchemaId2 = LessThanOrEqualToSchemaId;
var lessThanOrEqualTo5 = (maximum, annotations3) => (self) => self.pipe(filter7((a) => a <= maximum, {
  schemaId: LessThanOrEqualToSchemaId2,
  title: `lessThanOrEqualTo(${maximum})`,
  description: maximum === 0 ? "a non-positive number" : `a number less than or equal to ${maximum}`,
  jsonSchema: {
    maximum
  },
  ...annotations3
}));
var BetweenSchemaId2 = BetweenSchemaId;
var between5 = (minimum, maximum, annotations3) => (self) => self.pipe(filter7((a) => a >= minimum && a <= maximum, {
  schemaId: BetweenSchemaId2,
  title: `between(${minimum}, ${maximum})`,
  description: `a number between ${minimum} and ${maximum}`,
  jsonSchema: {
    minimum,
    maximum
  },
  ...annotations3
}));
var NonNaNSchemaId2 = NonNaNSchemaId;
var nonNaN = (annotations3) => (self) => self.pipe(filter7((a) => !Number.isNaN(a), {
  schemaId: NonNaNSchemaId2,
  title: "nonNaN",
  description: "a number excluding NaN",
  ...annotations3
}));
var positive = (annotations3) => greaterThan6(0, {
  title: "positive",
  ...annotations3
});
var negative = (annotations3) => lessThan5(0, {
  title: "negative",
  ...annotations3
});
var nonPositive = (annotations3) => lessThanOrEqualTo5(0, {
  title: "nonPositive",
  ...annotations3
});
var nonNegative = (annotations3) => greaterThanOrEqualTo5(0, {
  title: "nonNegative",
  ...annotations3
});
var clamp8 = (minimum, maximum) => (self) => {
  return transform2(self, typeSchema(self).pipe(between5(minimum, maximum)), {
    strict: false,
    decode: (i) => clamp3(i, {
      minimum,
      maximum
    }),
    encode: identity
  });
};
function parseNumber(self) {
  return transformOrFail(self, Number$, {
    strict: false,
    decode: (i, _, ast) => fromOption3(parse(i), () => new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a number`)),
    encode: (a) => succeed7(String(a))
  });
}
var NumberFromString = class extends (/* @__PURE__ */ parseNumber(String$.annotations({
  description: "a string to be decoded into a number"
})).annotations({
  identifier: "NumberFromString"
})) {
};
var Finite = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ finite({
  identifier: "Finite"
}))) {
};
var Int = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ int({
  identifier: "Int"
}))) {
};
var NonNaN = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ nonNaN({
  identifier: "NonNaN"
}))) {
};
var Positive = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ positive({
  identifier: "Positive"
}))) {
};
var Negative = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ negative({
  identifier: "Negative"
}))) {
};
var NonPositive = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ nonPositive({
  identifier: "NonPositive"
}))) {
};
var NonNegative = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ nonNegative({
  identifier: "NonNegative"
}))) {
};
var JsonNumberSchemaId2 = JsonNumberSchemaId;
var JsonNumber = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ finite({
  schemaId: JsonNumberSchemaId2,
  identifier: "JsonNumber"
}))) {
};
var Not = class extends (/* @__PURE__ */ transform2(/* @__PURE__ */ Boolean$.annotations({
  description: "a boolean that will be negated"
}), Boolean$, {
  strict: true,
  decode: (i) => not(i),
  encode: (a) => not(a)
})) {
};
var encodeSymbol2 = (sym, ast) => {
  const key = Symbol.keyFor(sym);
  return key === void 0 ? fail6(new Type2(ast, sym, `Unable to encode a unique symbol ${String(sym)} into a string`)) : succeed7(key);
};
var decodeSymbol = (s) => succeed7(Symbol.for(s));
var Symbol$ = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a globally shared symbol"
}), SymbolFromSelf, {
  strict: false,
  decode: (i) => decodeSymbol(i),
  encode: (a, _, ast) => encodeSymbol2(a, ast)
}).annotations({
  identifier: "Symbol"
})) {
};
var GreaterThanBigIntSchemaId = GreaterThanBigintSchemaId;
var greaterThanBigInt = (min3, annotations3) => (self) => self.pipe(filter7((a) => a > min3, {
  schemaId: GreaterThanBigIntSchemaId,
  [GreaterThanBigIntSchemaId]: {
    min: min3
  },
  title: `greaterThanBigInt(${min3})`,
  description: min3 === 0n ? "a positive bigint" : `a bigint greater than ${min3}n`,
  ...annotations3
}));
var GreaterThanOrEqualToBigIntSchemaId2 = GreaterThanOrEqualToBigIntSchemaId;
var greaterThanOrEqualToBigInt = (min3, annotations3) => (self) => self.pipe(filter7((a) => a >= min3, {
  schemaId: GreaterThanOrEqualToBigIntSchemaId2,
  [GreaterThanOrEqualToBigIntSchemaId2]: {
    min: min3
  },
  title: `greaterThanOrEqualToBigInt(${min3})`,
  description: min3 === 0n ? "a non-negative bigint" : `a bigint greater than or equal to ${min3}n`,
  ...annotations3
}));
var LessThanBigIntSchemaId2 = LessThanBigIntSchemaId;
var lessThanBigInt = (max3, annotations3) => (self) => self.pipe(filter7((a) => a < max3, {
  schemaId: LessThanBigIntSchemaId2,
  [LessThanBigIntSchemaId2]: {
    max: max3
  },
  title: `lessThanBigInt(${max3})`,
  description: max3 === 0n ? "a negative bigint" : `a bigint less than ${max3}n`,
  ...annotations3
}));
var LessThanOrEqualToBigIntSchemaId2 = LessThanOrEqualToBigIntSchemaId;
var lessThanOrEqualToBigInt = (max3, annotations3) => (self) => self.pipe(filter7((a) => a <= max3, {
  schemaId: LessThanOrEqualToBigIntSchemaId2,
  [LessThanOrEqualToBigIntSchemaId2]: {
    max: max3
  },
  title: `lessThanOrEqualToBigInt(${max3})`,
  description: max3 === 0n ? "a non-positive bigint" : `a bigint less than or equal to ${max3}n`,
  ...annotations3
}));
var BetweenBigIntSchemaId = BetweenBigintSchemaId;
var betweenBigInt = (min3, max3, annotations3) => (self) => self.pipe(filter7((a) => a >= min3 && a <= max3, {
  schemaId: BetweenBigIntSchemaId,
  [BetweenBigIntSchemaId]: {
    min: min3,
    max: max3
  },
  title: `betweenBigInt(${min3}, ${max3})`,
  description: `a bigint between ${min3}n and ${max3}n`,
  ...annotations3
}));
var positiveBigInt = (annotations3) => greaterThanBigInt(0n, {
  title: "positiveBigInt",
  ...annotations3
});
var negativeBigInt = (annotations3) => lessThanBigInt(0n, {
  title: "negativeBigInt",
  ...annotations3
});
var nonNegativeBigInt = (annotations3) => greaterThanOrEqualToBigInt(0n, {
  title: "nonNegativeBigInt",
  ...annotations3
});
var nonPositiveBigInt = (annotations3) => lessThanOrEqualToBigInt(0n, {
  title: "nonPositiveBigInt",
  ...annotations3
});
var clampBigInt = (minimum, maximum) => (self) => transform2(self, self.pipe(typeSchema, betweenBigInt(minimum, maximum)), {
  strict: false,
  decode: (i) => clamp5(i, {
    minimum,
    maximum
  }),
  encode: identity
});
var BigInt$ = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a bigint"
}), BigIntFromSelf, {
  strict: true,
  decode: (i, _, ast) => fromOption3(fromString2(i), () => new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a bigint`)),
  encode: (a) => succeed7(String(a))
}).annotations({
  identifier: "BigInt"
})) {
};
var PositiveBigIntFromSelf = /* @__PURE__ */ BigIntFromSelf.pipe(/* @__PURE__ */ positiveBigInt({
  identifier: "PositiveBigintFromSelf"
}));
var PositiveBigInt = /* @__PURE__ */ BigInt$.pipe(/* @__PURE__ */ positiveBigInt({
  identifier: "PositiveBigint"
}));
var NegativeBigIntFromSelf = /* @__PURE__ */ BigIntFromSelf.pipe(/* @__PURE__ */ negativeBigInt({
  identifier: "NegativeBigintFromSelf"
}));
var NegativeBigInt = /* @__PURE__ */ BigInt$.pipe(/* @__PURE__ */ negativeBigInt({
  identifier: "NegativeBigint"
}));
var NonPositiveBigIntFromSelf = /* @__PURE__ */ BigIntFromSelf.pipe(/* @__PURE__ */ nonPositiveBigInt({
  identifier: "NonPositiveBigintFromSelf"
}));
var NonPositiveBigInt = /* @__PURE__ */ BigInt$.pipe(/* @__PURE__ */ nonPositiveBigInt({
  identifier: "NonPositiveBigint"
}));
var NonNegativeBigIntFromSelf = /* @__PURE__ */ BigIntFromSelf.pipe(/* @__PURE__ */ nonNegativeBigInt({
  identifier: "NonNegativeBigintFromSelf"
}));
var NonNegativeBigInt = /* @__PURE__ */ BigInt$.pipe(/* @__PURE__ */ nonNegativeBigInt({
  identifier: "NonNegativeBigint"
}));
var BigIntFromNumber = class extends (/* @__PURE__ */ transformOrFail(Number$.annotations({
  description: "a number to be decoded into a bigint"
}), BigIntFromSelf.pipe(betweenBigInt(BigInt(Number.MIN_SAFE_INTEGER), BigInt(Number.MAX_SAFE_INTEGER))), {
  strict: true,
  decode: (i, _, ast) => fromOption3(fromNumber(i), () => new Type2(ast, i, `Unable to decode ${i} into a bigint`)),
  encode: (a, _, ast) => fromOption3(toNumber(a), () => new Type2(ast, a, `Unable to encode ${a}n into a number`))
}).annotations({
  identifier: "BigIntFromNumber"
})) {
};
var redactedArbitrary = (value3) => (fc) => value3(fc).map(make33);
var toComposite = (eff, onSuccess, ast, actual) => mapBoth4(eff, {
  onFailure: (e) => new Composite2(ast, actual, e),
  onSuccess
});
var redactedParse = (decodeUnknown3) => (u, options, ast) => isRedacted2(u) ? toComposite(decodeUnknown3(value2(u), options), make33, ast, u) : fail6(new Type2(ast, u));
var RedactedFromSelf = (value3) => declare([value3], {
  decode: (value4) => redactedParse(decodeUnknown(value4)),
  encode: (value4) => redactedParse(encodeUnknown(value4))
}, {
  description: "Redacted(<redacted>)",
  pretty: () => () => "Redacted(<redacted>)",
  arbitrary: redactedArbitrary,
  equivalence: getEquivalence7
});
function Redacted(value3) {
  return transform2(value3, RedactedFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => make33(i),
    encode: (a) => value2(a)
  });
}
var DurationFromSelf = class extends (/* @__PURE__ */ declare(isDuration, {
  identifier: "DurationFromSelf",
  pretty: () => String,
  arbitrary: () => (fc) => fc.oneof(fc.constant(infinity), fc.bigInt({
    min: 0n
  }).map((_) => nanos(_)), fc.maxSafeNat().map((_) => millis(_))),
  equivalence: () => Equivalence2
})) {
};
var DurationFromNanos = class extends (/* @__PURE__ */ transformOrFail(NonNegativeBigIntFromSelf.annotations({
  description: "a bigint to be decoded into a Duration"
}), DurationFromSelf.pipe(filter7((duration2) => isFinite(duration2), {
  description: "a finite duration"
})), {
  strict: true,
  decode: (i) => succeed7(nanos(i)),
  encode: (a, _, ast) => match2(toNanos(a), {
    onNone: () => fail6(new Type2(ast, a, `Unable to encode ${a} into a bigint`)),
    onSome: (nanos2) => succeed7(nanos2)
  })
}).annotations({
  identifier: "DurationFromNanos"
})) {
};
var NonNegativeInt = /* @__PURE__ */ NonNegative.pipe(int()).annotations({
  identifier: "NonNegativeInt"
});
var DurationFromMillis = class extends (/* @__PURE__ */ transform2(NonNegative.annotations({
  description: "a non-negative number to be decoded into a Duration"
}), DurationFromSelf, {
  strict: true,
  decode: (i) => millis(i),
  encode: (a) => toMillis(a)
}).annotations({
  identifier: "DurationFromMillis"
})) {
};
var DurationValueMillis = /* @__PURE__ */ TaggedStruct("Millis", {
  millis: NonNegativeInt
});
var DurationValueNanos = /* @__PURE__ */ TaggedStruct("Nanos", {
  nanos: BigInt$
});
var DurationValueInfinity = /* @__PURE__ */ TaggedStruct("Infinity", {});
var durationValueInfinity = /* @__PURE__ */ DurationValueInfinity.make({});
var DurationValue = /* @__PURE__ */ Union2(DurationValueMillis, DurationValueNanos, DurationValueInfinity).annotations({
  identifier: "DurationValue",
  description: "an JSON-compatible tagged union to be decoded into a Duration"
});
var FiniteHRTime = /* @__PURE__ */ Tuple(element(NonNegativeInt).annotations({
  title: "seconds"
}), element(NonNegativeInt).annotations({
  title: "nanos"
})).annotations({
  identifier: "FiniteHRTime"
});
var InfiniteHRTime = /* @__PURE__ */ Tuple(Literal2(-1), Literal2(0)).annotations({
  identifier: "InfiniteHRTime"
});
var HRTime = /* @__PURE__ */ Union2(FiniteHRTime, InfiniteHRTime).annotations({
  identifier: "HRTime",
  description: "a tuple of seconds and nanos to be decoded into a Duration"
});
var isDurationValue = (u) => typeof u === "object";
var Duration = class extends (/* @__PURE__ */ transform2(Union2(DurationValue, HRTime), DurationFromSelf, {
  strict: true,
  decode: (i) => {
    if (isDurationValue(i)) {
      switch (i._tag) {
        case "Millis":
          return millis(i.millis);
        case "Nanos":
          return nanos(i.nanos);
        case "Infinity":
          return infinity;
      }
    }
    const [seconds2, nanos2] = i;
    return seconds2 === -1 ? infinity : nanos(BigInt(seconds2) * BigInt(1e9) + BigInt(nanos2));
  },
  encode: (a) => {
    switch (a.value._tag) {
      case "Millis":
        return DurationValueMillis.make({
          millis: a.value.millis
        });
      case "Nanos":
        return DurationValueNanos.make({
          nanos: a.value.nanos
        });
      case "Infinity":
        return durationValueInfinity;
    }
  }
}).annotations({
  identifier: "Duration"
})) {
};
var clampDuration = (minimum, maximum) => (self) => transform2(self, self.pipe(typeSchema, betweenDuration(minimum, maximum)), {
  strict: false,
  decode: (i) => clamp6(i, {
    minimum,
    maximum
  }),
  encode: identity
});
var LessThanDurationSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanDuration");
var lessThanDuration = (max3, annotations3) => (self) => self.pipe(filter7((a) => lessThan3(a, max3), {
  schemaId: LessThanDurationSchemaId,
  [LessThanDurationSchemaId]: {
    max: max3
  },
  title: `lessThanDuration(${max3})`,
  description: `a Duration less than ${decode(max3)}`,
  ...annotations3
}));
var LessThanOrEqualToDurationSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/LessThanOrEqualToDuration");
var lessThanOrEqualToDuration = (max3, annotations3) => (self) => self.pipe(filter7((a) => lessThanOrEqualTo3(a, max3), {
  schemaId: LessThanDurationSchemaId,
  [LessThanDurationSchemaId]: {
    max: max3
  },
  title: `lessThanOrEqualToDuration(${max3})`,
  description: `a Duration less than or equal to ${decode(max3)}`,
  ...annotations3
}));
var GreaterThanDurationSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanDuration");
var greaterThanDuration = (min3, annotations3) => (self) => self.pipe(filter7((a) => greaterThan3(a, min3), {
  schemaId: GreaterThanDurationSchemaId,
  [GreaterThanDurationSchemaId]: {
    min: min3
  },
  title: `greaterThanDuration(${min3})`,
  description: `a Duration greater than ${decode(min3)}`,
  ...annotations3
}));
var GreaterThanOrEqualToDurationSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/GreaterThanOrEqualToDuration");
var greaterThanOrEqualToDuration = (min3, annotations3) => (self) => self.pipe(filter7((a) => greaterThanOrEqualTo3(a, min3), {
  schemaId: GreaterThanOrEqualToDurationSchemaId,
  [GreaterThanOrEqualToDurationSchemaId]: {
    min: min3
  },
  title: `greaterThanOrEqualToDuration(${min3})`,
  description: `a Duration greater than or equal to ${decode(min3)}`,
  ...annotations3
}));
var BetweenDurationSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/BetweenDuration");
var betweenDuration = (minimum, maximum, annotations3) => (self) => self.pipe(filter7((a) => between3(a, {
  minimum,
  maximum
}), {
  schemaId: BetweenDurationSchemaId,
  [BetweenDurationSchemaId]: {
    maximum,
    minimum
  },
  title: `betweenDuration(${minimum}, ${maximum})`,
  description: `a Duration between ${decode(minimum)} and ${decode(maximum)}`,
  ...annotations3
}));
var Uint8ArrayFromSelf = class extends (/* @__PURE__ */ declare(isUint8Array, {
  identifier: "Uint8ArrayFromSelf",
  pretty: () => (u8arr) => `new Uint8Array(${JSON.stringify(Array.from(u8arr))})`,
  arbitrary: () => (fc) => fc.uint8Array(),
  equivalence: () => getEquivalence3(equals)
})) {
};
var Uint8 = class extends (/* @__PURE__ */ Number$.pipe(/* @__PURE__ */ between5(0, 255, {
  identifier: "Uint8",
  description: "a 8-bit unsigned integer"
}))) {
};
var Uint8Array$ = class extends (/* @__PURE__ */ transform2(Array$(Uint8).annotations({
  description: "an array of 8-bit unsigned integers to be decoded into a Uint8Array"
}), Uint8ArrayFromSelf, {
  strict: true,
  decode: (i) => Uint8Array.from(i),
  encode: (a) => Array.from(a)
}).annotations({
  identifier: "Uint8Array"
})) {
};
var makeUint8ArrayTransformation = (id, decode6, encode5) => transformOrFail(String$.annotations({
  description: "a string to be decoded into a Uint8Array"
}), Uint8ArrayFromSelf, {
  strict: true,
  decode: (i, _, ast) => mapLeft(decode6(i), (decodeException) => new Type2(ast, i, decodeException.message)),
  encode: (a) => succeed7(encode5(a))
}).annotations({
  identifier: id
});
var Uint8ArrayFromBase64 = /* @__PURE__ */ makeUint8ArrayTransformation("Uint8ArrayFromBase64", decodeBase64, encodeBase64);
var Uint8ArrayFromBase64Url = /* @__PURE__ */ makeUint8ArrayTransformation("Uint8ArrayFromBase64Url", decodeBase64Url, encodeBase64Url);
var Uint8ArrayFromHex = /* @__PURE__ */ makeUint8ArrayTransformation("Uint8ArrayFromHex", decodeHex, encodeHex);
var makeEncodingTransformation = (id, decode6, encode5) => transformOrFail(String$.annotations({
  description: `A string that is interpreted as being ${id}-encoded and will be decoded into a UTF-8 string`
}), String$, {
  strict: true,
  decode: (i, _, ast) => mapLeft(decode6(i), (decodeException) => new Type2(ast, i, decodeException.message)),
  encode: (a) => succeed7(encode5(a))
}).annotations({
  identifier: `StringFrom${id}`
});
var StringFromBase64 = /* @__PURE__ */ makeEncodingTransformation("Base64", decodeBase64String, encodeBase64);
var StringFromBase64Url = /* @__PURE__ */ makeEncodingTransformation("Base64Url", decodeBase64UrlString, encodeBase64Url);
var StringFromHex = /* @__PURE__ */ makeEncodingTransformation("Hex", decodeHexString, encodeHex);
var StringFromUriComponent = /* @__PURE__ */ transformOrFail(String$.annotations({
  description: `A string that is interpreted as being UriComponent-encoded and will be decoded into a UTF-8 string`
}), String$, {
  strict: true,
  decode: (i, _, ast) => mapLeft(decodeUriComponent(i), (decodeException) => new Type2(ast, i, decodeException.message)),
  encode: (a, _, ast) => mapLeft(encodeUriComponent(a), (encodeException) => new Type2(ast, a, encodeException.message))
}).annotations({
  identifier: `StringFromUriComponent`
});
var MinItemsSchemaId2 = MinItemsSchemaId;
var minItems = (n, annotations3) => (self) => {
  const minItems2 = Math.floor(n);
  if (minItems2 < 1) {
    throw new Error(getInvalidArgumentErrorMessage(`Expected an integer greater than or equal to 1, actual ${n}`));
  }
  return self.pipe(filter7((a) => a.length >= minItems2, {
    schemaId: MinItemsSchemaId2,
    title: `minItems(${minItems2})`,
    description: `an array of at least ${minItems2} item(s)`,
    jsonSchema: {
      minItems: minItems2
    },
    [StableFilterAnnotationId]: true,
    ...annotations3
  }));
};
var MaxItemsSchemaId2 = MaxItemsSchemaId;
var maxItems = (n, annotations3) => (self) => {
  const maxItems2 = Math.floor(n);
  if (maxItems2 < 1) {
    throw new Error(getInvalidArgumentErrorMessage(`Expected an integer greater than or equal to 1, actual ${n}`));
  }
  return self.pipe(filter7((a) => a.length <= maxItems2, {
    schemaId: MaxItemsSchemaId2,
    title: `maxItems(${maxItems2})`,
    description: `an array of at most ${maxItems2} item(s)`,
    jsonSchema: {
      maxItems: maxItems2
    },
    [StableFilterAnnotationId]: true,
    ...annotations3
  }));
};
var ItemsCountSchemaId2 = ItemsCountSchemaId;
var itemsCount = (n, annotations3) => (self) => {
  const itemsCount2 = Math.floor(n);
  if (itemsCount2 < 0) {
    throw new Error(getInvalidArgumentErrorMessage(`Expected an integer greater than or equal to 0, actual ${n}`));
  }
  return self.pipe(filter7((a) => a.length === itemsCount2, {
    schemaId: ItemsCountSchemaId2,
    title: `itemsCount(${itemsCount2})`,
    description: `an array of exactly ${itemsCount2} item(s)`,
    jsonSchema: {
      minItems: itemsCount2,
      maxItems: itemsCount2
    },
    [StableFilterAnnotationId]: true,
    ...annotations3
  }));
};
var getNumberIndexedAccess2 = (self) => make34(getNumberIndexedAccess(self.ast));
function head3(self) {
  return transform2(self, OptionFromSelf(getNumberIndexedAccess2(typeSchema(self))), {
    strict: false,
    decode: (i) => head(i),
    encode: (a) => match2(a, {
      onNone: () => [],
      onSome: of
    })
  });
}
function headNonEmpty3(self) {
  return transform2(self, getNumberIndexedAccess2(typeSchema(self)), {
    strict: false,
    decode: (i) => headNonEmpty(i),
    encode: (a) => of(a)
  });
}
var headOrElse = /* @__PURE__ */ dual((args2) => isSchema(args2[0]), (self, fallback) => transformOrFail(self, getNumberIndexedAccess2(typeSchema(self)), {
  strict: true,
  decode: (i, _, ast) => i.length > 0 ? succeed7(i[0]) : fallback ? succeed7(fallback()) : fail6(new Type2(ast, i, "Unable to retrieve the first element of an empty array")),
  encode: (a) => succeed7(of(a))
}));
var ValidDateSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/ValidDate");
var validDate = (annotations3) => (self) => self.pipe(filter7((a) => !Number.isNaN(a.getTime()), {
  schemaId: ValidDateSchemaId,
  [ValidDateSchemaId]: {
    noInvalidDate: true
  },
  title: "validDate",
  description: "a valid Date",
  ...annotations3
}));
var LessThanDateSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanDate");
var lessThanDate = (max3, annotations3) => (self) => self.pipe(filter7((a) => a < max3, {
  schemaId: LessThanDateSchemaId,
  [LessThanDateSchemaId]: {
    max: max3
  },
  title: `lessThanDate(${formatDate(max3)})`,
  description: `a date before ${formatDate(max3)}`,
  ...annotations3
}));
var LessThanOrEqualToDateSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/LessThanOrEqualToDate");
var lessThanOrEqualToDate = (max3, annotations3) => (self) => self.pipe(filter7((a) => a <= max3, {
  schemaId: LessThanDateSchemaId,
  [LessThanDateSchemaId]: {
    max: max3
  },
  title: `lessThanOrEqualToDate(${formatDate(max3)})`,
  description: `a date before or equal to ${formatDate(max3)}`,
  ...annotations3
}));
var GreaterThanDateSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanDate");
var greaterThanDate = (min3, annotations3) => (self) => self.pipe(filter7((a) => a > min3, {
  schemaId: GreaterThanDateSchemaId,
  [GreaterThanDateSchemaId]: {
    min: min3
  },
  title: `greaterThanDate(${formatDate(min3)})`,
  description: `a date after ${formatDate(min3)}`,
  ...annotations3
}));
var GreaterThanOrEqualToDateSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/GreaterThanOrEqualToDate");
var greaterThanOrEqualToDate = (min3, annotations3) => (self) => self.pipe(filter7((a) => a >= min3, {
  schemaId: GreaterThanOrEqualToDateSchemaId,
  [GreaterThanOrEqualToDateSchemaId]: {
    min: min3
  },
  title: `greaterThanOrEqualToDate(${formatDate(min3)})`,
  description: `a date after or equal to ${formatDate(min3)}`,
  ...annotations3
}));
var BetweenDateSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/BetweenDate");
var betweenDate = (min3, max3, annotations3) => (self) => self.pipe(filter7((a) => a <= max3 && a >= min3, {
  schemaId: BetweenDateSchemaId,
  [BetweenDateSchemaId]: {
    max: max3,
    min: min3
  },
  title: `betweenDate(${formatDate(min3)}, ${formatDate(max3)})`,
  description: `a date between ${formatDate(min3)} and ${formatDate(max3)}`,
  ...annotations3
}));
var DateFromSelfSchemaId2 = DateFromSelfSchemaId;
var DateFromSelf = class extends (/* @__PURE__ */ declare(isDate, {
  identifier: "DateFromSelf",
  schemaId: DateFromSelfSchemaId2,
  [DateFromSelfSchemaId2]: {
    noInvalidDate: false
  },
  description: "a potentially invalid Date instance",
  pretty: () => (date3) => `new Date(${JSON.stringify(date3)})`,
  arbitrary: () => (fc) => fc.date({
    noInvalidDate: false
  }),
  equivalence: () => Date2
})) {
};
var ValidDateFromSelf = class extends (/* @__PURE__ */ DateFromSelf.pipe(/* @__PURE__ */ validDate({
  identifier: "ValidDateFromSelf",
  description: "a valid Date instance"
}))) {
};
var DateFromString = class extends (/* @__PURE__ */ transform2(String$.annotations({
  description: "a string to be decoded into a Date"
}), DateFromSelf, {
  strict: true,
  decode: (i) => new Date(i),
  encode: (a) => formatDate(a)
}).annotations({
  identifier: "DateFromString"
})) {
};
var Date$ = class extends (/* @__PURE__ */ DateFromString.pipe(/* @__PURE__ */ validDate({
  identifier: "Date"
}))) {
};
var DateFromNumber = class extends (/* @__PURE__ */ transform2(Number$.annotations({
  description: "a number to be decoded into a Date"
}), DateFromSelf, {
  strict: true,
  decode: (i) => new Date(i),
  encode: (a) => a.getTime()
}).annotations({
  identifier: "DateFromNumber"
})) {
};
var DateTimeUtcFromSelf = class extends (/* @__PURE__ */ declare((u) => isDateTime2(u) && isUtc2(u), {
  identifier: "DateTimeUtcFromSelf",
  description: "a DateTime.Utc instance",
  pretty: () => (dateTime) => dateTime.toString(),
  arbitrary: () => (fc) => fc.date({
    noInvalidDate: true
  }).map((date3) => unsafeFromDate2(date3)),
  equivalence: () => Equivalence4
})) {
};
var decodeDateTimeUtc = (input, ast) => _try({
  try: () => unsafeMake7(input),
  catch: () => new Type2(ast, input, `Unable to decode ${formatUnknown(input)} into a DateTime.Utc`)
});
var DateTimeUtcFromNumber = class extends (/* @__PURE__ */ transformOrFail(Number$.annotations({
  description: "a number to be decoded into a DateTime.Utc"
}), DateTimeUtcFromSelf, {
  strict: true,
  decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
  encode: (a) => succeed7(toEpochMillis2(a))
}).annotations({
  identifier: "DateTimeUtcFromNumber"
})) {
};
var DateTimeUtcFromDate = class extends (/* @__PURE__ */ transformOrFail(DateFromSelf.annotations({
  description: "a Date to be decoded into a DateTime.Utc"
}), DateTimeUtcFromSelf, {
  strict: true,
  decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
  encode: (a) => succeed7(toDateUtc2(a))
}).annotations({
  identifier: "DateTimeUtcFromDate"
})) {
};
var DateTimeUtc = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a DateTime.Utc"
}), DateTimeUtcFromSelf, {
  strict: true,
  decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
  encode: (a) => succeed7(formatIso2(a))
}).annotations({
  identifier: "DateTimeUtc"
})) {
};
var timeZoneOffsetArbitrary = () => (fc) => fc.integer({
  min: -12 * 60 * 60 * 1e3,
  max: 14 * 60 * 60 * 1e3
}).map(zoneMakeOffset2);
var TimeZoneOffsetFromSelf = class extends (/* @__PURE__ */ declare(isTimeZoneOffset2, {
  identifier: "TimeZoneOffsetFromSelf",
  description: "a TimeZone.Offset instance",
  pretty: () => (zone) => zone.toString(),
  arbitrary: timeZoneOffsetArbitrary
})) {
};
var TimeZoneOffset = class extends (/* @__PURE__ */ transform2(Number$.annotations({
  description: "a number to be decoded into a TimeZone.Offset"
}), TimeZoneOffsetFromSelf, {
  strict: true,
  decode: (i) => zoneMakeOffset2(i),
  encode: (a) => a.offset
}).annotations({
  identifier: "TimeZoneOffset"
})) {
};
var timeZoneNamedArbitrary = () => (fc) => fc.constantFrom(...Intl.supportedValuesOf("timeZone")).map(zoneUnsafeMakeNamed2);
var TimeZoneNamedFromSelf = class extends (/* @__PURE__ */ declare(isTimeZoneNamed2, {
  identifier: "TimeZoneNamedFromSelf",
  description: "a TimeZone.Named instance",
  pretty: () => (zone) => zone.toString(),
  arbitrary: timeZoneNamedArbitrary
})) {
};
var TimeZoneNamed = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a TimeZone.Named"
}), TimeZoneNamedFromSelf, {
  strict: true,
  decode: (i, _, ast) => _try({
    try: () => zoneUnsafeMakeNamed2(i),
    catch: () => new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a TimeZone.Named`)
  }),
  encode: (a) => succeed7(a.id)
}).annotations({
  identifier: "TimeZoneNamed"
})) {
};
var TimeZoneFromSelf = class extends (/* @__PURE__ */ Union2(TimeZoneOffsetFromSelf, TimeZoneNamedFromSelf)) {
};
var TimeZone = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a TimeZone"
}), TimeZoneFromSelf, {
  strict: true,
  decode: (i, _, ast) => match2(zoneFromString2(i), {
    onNone: () => fail6(new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a TimeZone`)),
    onSome: succeed7
  }),
  encode: (a) => succeed7(zoneToString2(a))
}).annotations({
  identifier: "TimeZone"
})) {
};
var timeZoneArbitrary = (fc) => fc.oneof(timeZoneOffsetArbitrary()(fc), timeZoneNamedArbitrary()(fc));
var DateTimeZonedFromSelf = class extends (/* @__PURE__ */ declare((u) => isDateTime2(u) && isZoned2(u), {
  identifier: "DateTimeZonedFromSelf",
  description: "a DateTime.Zoned instance",
  pretty: () => (dateTime) => dateTime.toString(),
  arbitrary: () => (fc) => fc.tuple(fc.integer({
    // time zone db supports +/- 1000 years or so
    min: -31536e9,
    max: 31536e9
  }), timeZoneArbitrary(fc)).map(([millis2, timeZone]) => unsafeMakeZoned2(millis2, {
    timeZone
  })),
  equivalence: () => Equivalence4
})) {
};
var DateTimeZoned = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a DateTime.Zoned"
}), DateTimeZonedFromSelf, {
  strict: true,
  decode: (i, _, ast) => match2(makeZonedFromString2(i), {
    onNone: () => fail6(new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a DateTime.Zoned`)),
    onSome: succeed7
  }),
  encode: (a) => succeed7(formatIsoZoned2(a))
}).annotations({
  identifier: "DateTimeZoned"
})) {
};
var OptionNoneEncoded = /* @__PURE__ */ Struct({
  _tag: Literal2("None")
}).annotations({
  description: "NoneEncoded"
});
var optionSomeEncoded = (value3) => Struct({
  _tag: Literal2("Some"),
  value: value3
}).annotations({
  description: `SomeEncoded<${format6(value3)}>`
});
var optionEncoded = (value3) => Union2(OptionNoneEncoded, optionSomeEncoded(value3)).annotations({
  description: `OptionEncoded<${format6(value3)}>`
});
var optionDecode = (input) => input._tag === "None" ? none2() : some2(input.value);
var optionArbitrary = (value3, ctx) => (fc) => fc.oneof(ctx, fc.record({
  _tag: fc.constant("None")
}), fc.record({
  _tag: fc.constant("Some"),
  value: value3(fc)
})).map(optionDecode);
var optionPretty = (value3) => match2({
  onNone: () => "none()",
  onSome: (a) => `some(${value3(a)})`
});
var optionParse = (decodeUnknown3) => (u, options, ast) => isOption2(u) ? isNone2(u) ? succeed7(none2()) : toComposite(decodeUnknown3(u.value, options), some2, ast, u) : fail6(new Type2(ast, u));
var OptionFromSelf = (value3) => {
  return declare([value3], {
    decode: (value4) => optionParse(decodeUnknown(value4)),
    encode: (value4) => optionParse(encodeUnknown(value4))
  }, {
    description: `Option<${format6(value3)}>`,
    pretty: optionPretty,
    arbitrary: optionArbitrary,
    equivalence: getEquivalence2
  });
};
var makeNoneEncoded = {
  _tag: "None"
};
var makeSomeEncoded = (value3) => ({
  _tag: "Some",
  value: value3
});
function Option(value3) {
  const value_ = asSchema(value3);
  const out = transform2(optionEncoded(value_), OptionFromSelf(typeSchema(value_)), {
    strict: true,
    decode: (i) => optionDecode(i),
    encode: (a) => match2(a, {
      onNone: () => makeNoneEncoded,
      onSome: makeSomeEncoded
    })
  });
  return out;
}
function OptionFromNullOr(value3) {
  return transform2(NullOr(value3), OptionFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => fromNullable2(i),
    encode: (a) => getOrNull2(a)
  });
}
function OptionFromNullishOr(value3, onNoneEncoding) {
  return transform2(NullishOr(value3), OptionFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => fromNullable2(i),
    encode: onNoneEncoding === null ? (a) => getOrNull2(a) : (a) => getOrUndefined2(a)
  });
}
function OptionFromUndefinedOr(value3) {
  return transform2(UndefinedOr(value3), OptionFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => fromNullable2(i),
    encode: (a) => getOrUndefined2(a)
  });
}
var OptionFromNonEmptyTrimmedString = class extends (/* @__PURE__ */ transform2(String$, /* @__PURE__ */ OptionFromSelf(NonEmptyTrimmedString), {
  strict: true,
  decode: (i) => filter(some2(i.trim()), isNonEmpty3),
  encode: (a) => getOrElse2(a, () => "")
})) {
};
var rightEncoded = (right3) => Struct({
  _tag: Literal2("Right"),
  right: right3
}).annotations({
  description: `RightEncoded<${format6(right3)}>`
});
var leftEncoded = (left3) => Struct({
  _tag: Literal2("Left"),
  left: left3
}).annotations({
  description: `LeftEncoded<${format6(left3)}>`
});
var eitherEncoded = (right3, left3) => Union2(rightEncoded(right3), leftEncoded(left3)).annotations({
  description: `EitherEncoded<${format6(left3)}, ${format6(right3)}>`
});
var eitherDecode = (input) => input._tag === "Left" ? left2(input.left) : right2(input.right);
var eitherArbitrary = (right3, left3) => (fc) => fc.oneof(fc.record({
  _tag: fc.constant("Left"),
  left: left3(fc)
}), fc.record({
  _tag: fc.constant("Right"),
  right: right3(fc)
})).map(eitherDecode);
var eitherPretty = (right3, left3) => match({
  onLeft: (e) => `left(${left3(e)})`,
  onRight: (a) => `right(${right3(a)})`
});
var eitherParse = (parseRight, decodeUnknownLeft) => (u, options, ast) => isEither2(u) ? match(u, {
  onLeft: (left3) => toComposite(decodeUnknownLeft(left3, options), left2, ast, u),
  onRight: (right3) => toComposite(parseRight(right3, options), right2, ast, u)
}) : fail6(new Type2(ast, u));
var EitherFromSelf = ({
  left: left3,
  right: right3
}) => {
  return declare([right3, left3], {
    decode: (right4, left4) => eitherParse(decodeUnknown(right4), decodeUnknown(left4)),
    encode: (right4, left4) => eitherParse(encodeUnknown(right4), encodeUnknown(left4))
  }, {
    description: `Either<${format6(right3)}, ${format6(left3)}>`,
    pretty: eitherPretty,
    arbitrary: eitherArbitrary,
    equivalence: (right4, left4) => getEquivalence({
      left: left4,
      right: right4
    })
  });
};
var makeLeftEncoded = (left3) => ({
  _tag: "Left",
  left: left3
});
var makeRightEncoded = (right3) => ({
  _tag: "Right",
  right: right3
});
var Either = ({
  left: left3,
  right: right3
}) => {
  const right_ = asSchema(right3);
  const left_ = asSchema(left3);
  const out = transform2(eitherEncoded(right_, left_), EitherFromSelf({
    left: typeSchema(left_),
    right: typeSchema(right_)
  }), {
    strict: true,
    decode: (i) => eitherDecode(i),
    encode: (a) => match(a, {
      onLeft: makeLeftEncoded,
      onRight: makeRightEncoded
    })
  });
  return out;
};
var EitherFromUnion = ({
  left: left3,
  right: right3
}) => {
  const right_ = asSchema(right3);
  const left_ = asSchema(left3);
  const toright = typeSchema(right_);
  const toleft = typeSchema(left_);
  const fromRight = transform2(right_, rightEncoded(toright), {
    strict: true,
    decode: (i) => makeRightEncoded(i),
    encode: (a) => a.right
  });
  const fromLeft = transform2(left_, leftEncoded(toleft), {
    strict: true,
    decode: (i) => makeLeftEncoded(i),
    encode: (a) => a.left
  });
  const out = transform2(Union2(fromRight, fromLeft), EitherFromSelf({
    left: toleft,
    right: toright
  }), {
    strict: true,
    decode: (i) => i._tag === "Left" ? left2(i.left) : right2(i.right),
    encode: (a) => match(a, {
      onLeft: makeLeftEncoded,
      onRight: makeRightEncoded
    })
  });
  return out;
};
var mapArbitrary = (key, value3, ctx) => {
  return (fc) => {
    const items = fc.array(fc.tuple(key(fc), value3(fc)));
    return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map((as4) => new Map(as4));
  };
};
var readonlyMapPretty = (key, value3) => (map15) => `new Map([${Array.from(map15.entries()).map(([k, v]) => `[${key(k)}, ${value3(v)}]`).join(", ")}])`;
var readonlyMapEquivalence = (key, value3) => {
  const arrayEquivalence = getEquivalence3(make(([ka, va], [kb, vb]) => key(ka, kb) && value3(va, vb)));
  return make((a, b) => arrayEquivalence(Array.from(a.entries()), Array.from(b.entries())));
};
var readonlyMapParse = (decodeUnknown3) => (u, options, ast) => isMap(u) ? toComposite(decodeUnknown3(Array.from(u.entries()), options), (as4) => new Map(as4), ast, u) : fail6(new Type2(ast, u));
var mapFromSelf_ = (key, value3, description) => declare([key, value3], {
  decode: (Key, Value2) => readonlyMapParse(decodeUnknown(Array$(Tuple(Key, Value2)))),
  encode: (Key, Value2) => readonlyMapParse(encodeUnknown(Array$(Tuple(Key, Value2))))
}, {
  description,
  pretty: readonlyMapPretty,
  arbitrary: mapArbitrary,
  equivalence: readonlyMapEquivalence
});
var ReadonlyMapFromSelf = ({
  key,
  value: value3
}) => mapFromSelf_(key, value3, `ReadonlyMap<${format6(key)}, ${format6(value3)}>`);
var MapFromSelf = ({
  key,
  value: value3
}) => mapFromSelf_(key, value3, `Map<${format6(key)}, ${format6(value3)}>`);
function ReadonlyMap({
  key,
  value: value3
}) {
  return transform2(Array$(Tuple(key, value3)), ReadonlyMapFromSelf({
    key: typeSchema(asSchema(key)),
    value: typeSchema(asSchema(value3))
  }), {
    strict: true,
    decode: (i) => new Map(i),
    encode: (a) => Array.from(a.entries())
  });
}
function map14({
  key,
  value: value3
}) {
  return transform2(Array$(Tuple(key, value3)), MapFromSelf({
    key: typeSchema(asSchema(key)),
    value: typeSchema(asSchema(value3))
  }), {
    strict: true,
    decode: (i) => new Map(i),
    encode: (a) => Array.from(a.entries())
  });
}
var ReadonlyMapFromRecord = ({
  key,
  value: value3
}) => transform2(Record({
  key: encodedBoundSchema(key),
  value: value3
}).annotations({
  description: "a record to be decoded into a ReadonlyMap"
}), ReadonlyMapFromSelf({
  key,
  value: typeSchema(value3)
}), {
  strict: true,
  decode: (i) => new Map(Object.entries(i)),
  encode: (a) => Object.fromEntries(a)
});
var MapFromRecord = ({
  key,
  value: value3
}) => transform2(Record({
  key: encodedBoundSchema(key),
  value: value3
}).annotations({
  description: "a record to be decoded into a Map"
}), MapFromSelf({
  key,
  value: typeSchema(value3)
}), {
  strict: true,
  decode: (i) => new Map(Object.entries(i)),
  encode: (a) => Object.fromEntries(a)
});
var setArbitrary = (item, ctx) => (fc) => {
  const items = fc.array(item(fc));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map((as4) => new Set(as4));
};
var readonlySetPretty = (item) => (set6) => `new Set([${Array.from(set6.values()).map((a) => item(a)).join(", ")}])`;
var readonlySetEquivalence = (item) => {
  const arrayEquivalence = getEquivalence3(item);
  return make((a, b) => arrayEquivalence(Array.from(a.values()), Array.from(b.values())));
};
var readonlySetParse = (decodeUnknown3) => (u, options, ast) => isSet(u) ? toComposite(decodeUnknown3(Array.from(u.values()), options), (as4) => new Set(as4), ast, u) : fail6(new Type2(ast, u));
var setFromSelf_ = (value3, description) => declare([value3], {
  decode: (item) => readonlySetParse(decodeUnknown(Array$(item))),
  encode: (item) => readonlySetParse(encodeUnknown(Array$(item)))
}, {
  description,
  pretty: readonlySetPretty,
  arbitrary: setArbitrary,
  equivalence: readonlySetEquivalence
});
var ReadonlySetFromSelf = (value3) => setFromSelf_(value3, `ReadonlySet<${format6(value3)}>`);
var SetFromSelf = (value3) => setFromSelf_(value3, `Set<${format6(value3)}>`);
function ReadonlySet(value3) {
  return transform2(Array$(value3), ReadonlySetFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => new Set(i),
    encode: (a) => Array.from(a)
  });
}
function set5(value3) {
  return transform2(Array$(value3), SetFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => new Set(i),
    encode: (a) => Array.from(a)
  });
}
var bigDecimalPretty = () => (val) => `BigDecimal(${format2(normalize(val))})`;
var bigDecimalArbitrary = () => (fc) => fc.tuple(fc.bigInt(), fc.integer({
  min: 0,
  max: 18
})).map(([value3, scale2]) => make4(value3, scale2));
var BigDecimalFromSelf = class extends (/* @__PURE__ */ declare(isBigDecimal, {
  identifier: "BigDecimalFromSelf",
  pretty: bigDecimalPretty,
  arbitrary: bigDecimalArbitrary,
  equivalence: () => Equivalence
})) {
};
var BigDecimal = class extends (/* @__PURE__ */ transformOrFail(String$.annotations({
  description: "a string to be decoded into a BigDecimal"
}), BigDecimalFromSelf, {
  strict: true,
  decode: (i, _, ast) => fromString(i).pipe(match2({
    onNone: () => fail6(new Type2(ast, i, `Unable to decode ${JSON.stringify(i)} into a BigDecimal`)),
    onSome: (val) => succeed7(normalize(val))
  })),
  encode: (a) => succeed7(format2(normalize(a)))
}).annotations({
  identifier: "BigDecimal"
})) {
};
var BigDecimalFromNumber = class extends (/* @__PURE__ */ transform2(Number$.annotations({
  description: "a number to be decoded into a BigDecimal"
}), BigDecimalFromSelf, {
  strict: true,
  decode: (i) => unsafeFromNumber(i),
  encode: (a) => unsafeToNumber(a)
}).annotations({
  identifier: "BigDecimalFromNumber"
})) {
};
var GreaterThanBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanBigDecimal");
var greaterThanBigDecimal = (min3, annotations3) => (self) => {
  const formatted = format2(min3);
  return self.pipe(filter7((a) => greaterThan2(a, min3), {
    schemaId: GreaterThanBigDecimalSchemaId,
    [GreaterThanBigDecimalSchemaId]: {
      min: min3
    },
    title: `greaterThanBigDecimal(${formatted})`,
    description: `a BigDecimal greater than ${formatted}`,
    ...annotations3
  }));
};
var GreaterThanOrEqualToBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/GreaterThanOrEqualToBigDecimal");
var greaterThanOrEqualToBigDecimal = (min3, annotations3) => (self) => {
  const formatted = format2(min3);
  return self.pipe(filter7((a) => greaterThanOrEqualTo2(a, min3), {
    schemaId: GreaterThanOrEqualToBigDecimalSchemaId,
    [GreaterThanOrEqualToBigDecimalSchemaId]: {
      min: min3
    },
    title: `greaterThanOrEqualToBigDecimal(${formatted})`,
    description: `a BigDecimal greater than or equal to ${formatted}`,
    ...annotations3
  }));
};
var LessThanBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanBigDecimal");
var lessThanBigDecimal = (max3, annotations3) => (self) => {
  const formatted = format2(max3);
  return self.pipe(filter7((a) => lessThan2(a, max3), {
    schemaId: LessThanBigDecimalSchemaId,
    [LessThanBigDecimalSchemaId]: {
      max: max3
    },
    title: `lessThanBigDecimal(${formatted})`,
    description: `a BigDecimal less than ${formatted}`,
    ...annotations3
  }));
};
var LessThanOrEqualToBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/LessThanOrEqualToBigDecimal");
var lessThanOrEqualToBigDecimal = (max3, annotations3) => (self) => {
  const formatted = format2(max3);
  return self.pipe(filter7((a) => lessThanOrEqualTo2(a, max3), {
    schemaId: LessThanOrEqualToBigDecimalSchemaId,
    [LessThanOrEqualToBigDecimalSchemaId]: {
      max: max3
    },
    title: `lessThanOrEqualToBigDecimal(${formatted})`,
    description: `a BigDecimal less than or equal to ${formatted}`,
    ...annotations3
  }));
};
var PositiveBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/PositiveBigDecimal");
var positiveBigDecimal = (annotations3) => (self) => self.pipe(filter7((a) => isPositive(a), {
  schemaId: PositiveBigDecimalSchemaId,
  title: "positiveBigDecimal",
  description: `a positive BigDecimal`,
  ...annotations3
}));
var PositiveBigDecimalFromSelf = /* @__PURE__ */ BigDecimalFromSelf.pipe(/* @__PURE__ */ positiveBigDecimal({
  identifier: "PositiveBigDecimalFromSelf"
}));
var NonNegativeBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/NonNegativeBigDecimal");
var nonNegativeBigDecimal = (annotations3) => (self) => self.pipe(filter7((a) => a.value >= 0n, {
  schemaId: NonNegativeBigDecimalSchemaId,
  title: "nonNegativeBigDecimal",
  description: `a non-negative BigDecimal`,
  ...annotations3
}));
var NonNegativeBigDecimalFromSelf = /* @__PURE__ */ BigDecimalFromSelf.pipe(/* @__PURE__ */ nonNegativeBigDecimal({
  identifier: "NonNegativeBigDecimalFromSelf"
}));
var NegativeBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/NegativeBigDecimal");
var negativeBigDecimal = (annotations3) => (self) => self.pipe(filter7((a) => isNegative(a), {
  schemaId: NegativeBigDecimalSchemaId,
  title: "negativeBigDecimal",
  description: `a negative BigDecimal`,
  ...annotations3
}));
var NegativeBigDecimalFromSelf = /* @__PURE__ */ BigDecimalFromSelf.pipe(/* @__PURE__ */ negativeBigDecimal({
  identifier: "NegativeBigDecimalFromSelf"
}));
var NonPositiveBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/schema/NonPositiveBigDecimal");
var nonPositiveBigDecimal = (annotations3) => (self) => self.pipe(filter7((a) => a.value <= 0n, {
  schemaId: NonPositiveBigDecimalSchemaId,
  title: "nonPositiveBigDecimal",
  description: `a non-positive BigDecimal`,
  ...annotations3
}));
var NonPositiveBigDecimalFromSelf = /* @__PURE__ */ BigDecimalFromSelf.pipe(/* @__PURE__ */ nonPositiveBigDecimal({
  identifier: "NonPositiveBigDecimalFromSelf"
}));
var BetweenBigDecimalSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/BetweenBigDecimal");
var betweenBigDecimal = (minimum, maximum, annotations3) => (self) => {
  const formattedMinimum = format2(minimum);
  const formattedMaximum = format2(maximum);
  return self.pipe(filter7((a) => between2(a, {
    minimum,
    maximum
  }), {
    schemaId: BetweenBigDecimalSchemaId,
    [BetweenBigDecimalSchemaId]: {
      maximum,
      minimum
    },
    title: `betweenBigDecimal(${formattedMinimum}, ${formattedMaximum})`,
    description: `a BigDecimal between ${formattedMinimum} and ${formattedMaximum}`,
    ...annotations3
  }));
};
var clampBigDecimal = (minimum, maximum) => (self) => transform2(self, self.pipe(typeSchema, betweenBigDecimal(minimum, maximum)), {
  strict: false,
  decode: (i) => clamp4(i, {
    minimum,
    maximum
  }),
  encode: identity
});
var chunkArbitrary = (item, ctx) => (fc) => {
  const items = fc.array(item(fc));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map(fromIterable2);
};
var chunkPretty = (item) => (c) => `Chunk(${toReadonlyArray(c).map(item).join(", ")})`;
var chunkParse = (decodeUnknown3) => (u, options, ast) => isChunk(u) ? isEmpty(u) ? succeed7(empty4()) : toComposite(decodeUnknown3(toReadonlyArray(u), options), fromIterable2, ast, u) : fail6(new Type2(ast, u));
var ChunkFromSelf = (value3) => {
  return declare([value3], {
    decode: (item) => chunkParse(decodeUnknown(Array$(item))),
    encode: (item) => chunkParse(encodeUnknown(Array$(item)))
  }, {
    description: `Chunk<${format6(value3)}>`,
    pretty: chunkPretty,
    arbitrary: chunkArbitrary,
    equivalence: getEquivalence4
  });
};
function Chunk(value3) {
  return transform2(Array$(value3), ChunkFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => i.length === 0 ? empty4() : fromIterable2(i),
    encode: (a) => toReadonlyArray(a)
  });
}
var nonEmptyChunkArbitrary = (item) => (fc) => array3(item(fc), {
  minLength: 1
}).map((as4) => unsafeFromNonEmptyArray(as4));
var nonEmptyChunkPretty = (item) => (c) => `NonEmptyChunk(${toReadonlyArray(c).map(item).join(", ")})`;
var nonEmptyChunkParse = (decodeUnknown3) => (u, options, ast) => isChunk(u) && isNonEmpty2(u) ? toComposite(decodeUnknown3(toReadonlyArray(u), options), unsafeFromNonEmptyArray, ast, u) : fail6(new Type2(ast, u));
var NonEmptyChunkFromSelf = (value3) => {
  return declare([value3], {
    decode: (item) => nonEmptyChunkParse(decodeUnknown(NonEmptyArray(item))),
    encode: (item) => nonEmptyChunkParse(encodeUnknown(NonEmptyArray(item)))
  }, {
    description: `NonEmptyChunk<${format6(value3)}>`,
    pretty: nonEmptyChunkPretty,
    arbitrary: nonEmptyChunkArbitrary,
    equivalence: getEquivalence4
  });
};
function NonEmptyChunk(value3) {
  return transform2(NonEmptyArray(value3), NonEmptyChunkFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => unsafeFromNonEmptyArray(i),
    encode: (a) => toReadonlyArray(a)
  });
}
var decodeData = (a) => Array.isArray(a) ? array4(a) : struct4(a);
var dataArbitrary = (item) => (fc) => item(fc).map(decodeData);
var dataPretty = (item) => (d) => `Data(${item(d)})`;
var dataParse = (decodeUnknown3) => (u, options, ast) => isEqual(u) ? toComposite(decodeUnknown3(u, options), decodeData, ast, u) : fail6(new Type2(ast, u));
var DataFromSelf = (value3) => {
  return declare([value3], {
    decode: (item) => dataParse(decodeUnknown(item)),
    encode: (item) => dataParse(encodeUnknown(item))
  }, {
    description: `Data<${format6(value3)}>`,
    pretty: dataPretty,
    arbitrary: dataArbitrary
  });
};
var Data = (value3) => {
  return transform2(value3, DataFromSelf(typeSchema(value3)), {
    strict: false,
    decode: (i) => decodeData(i),
    encode: (a) => Array.isArray(a) ? Array.from(a) : Object.assign({}, a)
  });
};
var isField = (u) => isSchema(u) || isPropertySignature(u);
var isFields = (fields) => ownKeys(fields).every((key) => isField(fields[key]));
var getFields = (hasFields) => "fields" in hasFields ? hasFields.fields : getFields(hasFields[RefineSchemaId]);
var getSchemaFromFieldsOr = (fieldsOr) => isFields(fieldsOr) ? Struct(fieldsOr) : isSchema(fieldsOr) ? fieldsOr : Struct(getFields(fieldsOr));
var getFieldsFromFieldsOr = (fieldsOr) => isFields(fieldsOr) ? fieldsOr : getFields(fieldsOr);
var Class6 = (identifier2) => (fieldsOr, annotations3) => makeClass({
  kind: "Class",
  identifier: identifier2,
  schema: getSchemaFromFieldsOr(fieldsOr),
  fields: getFieldsFromFieldsOr(fieldsOr),
  Base: Class4,
  annotations: annotations3
});
var getClassTag = (tag2) => withConstructorDefault(propertySignature(Literal2(tag2)), () => tag2);
var TaggedClass2 = (identifier2) => (tag2, fieldsOr, annotations3) => {
  const fields = getFieldsFromFieldsOr(fieldsOr);
  const schema = getSchemaFromFieldsOr(fieldsOr);
  const newFields = {
    _tag: getClassTag(tag2)
  };
  const taggedFields = extendFields(newFields, fields);
  return class TaggedClass extends makeClass({
    kind: "TaggedClass",
    identifier: identifier2 ?? tag2,
    schema: extend2(schema, Struct(newFields)),
    fields: taggedFields,
    Base: Class4,
    annotations: annotations3
  }) {
    static _tag = tag2;
  };
};
var TaggedError2 = (identifier2) => (tag2, fieldsOr, annotations3) => {
  class Base3 extends Error3 {
  }
  ;
  Base3.prototype.name = tag2;
  const fields = getFieldsFromFieldsOr(fieldsOr);
  const schema = getSchemaFromFieldsOr(fieldsOr);
  const newFields = {
    _tag: getClassTag(tag2)
  };
  const taggedFields = extendFields(newFields, fields);
  const hasMessageField = "message" in taggedFields;
  class TaggedErrorClass extends makeClass({
    kind: "TaggedError",
    identifier: identifier2 ?? tag2,
    schema: extend2(schema, Struct(newFields)),
    fields: taggedFields,
    Base: Base3,
    annotations: annotations3,
    disableToString: true
  }) {
    static _tag = tag2;
  }
  if (!hasMessageField) {
    Object.defineProperty(TaggedErrorClass.prototype, "message", {
      get() {
        return `{ ${ownKeys(fields).map((p) => `${formatPropertyKey(p)}: ${formatUnknown(this[p])}`).join(", ")} }`;
      },
      enumerable: false,
      // mirrors the built-in Error.prototype.message, whose descriptor is also non-enumerable
      configurable: true
    });
  }
  return TaggedErrorClass;
};
var extendFields = (a, b) => {
  const out = {
    ...a
  };
  for (const key of ownKeys(b)) {
    if (key in a) {
      throw new Error(getASTDuplicatePropertySignatureErrorMessage(key));
    }
    out[key] = b[key];
  }
  return out;
};
function getDisableValidationMakeOption(options) {
  return isBoolean(options) ? options : options?.disableValidation ?? false;
}
var astCache = /* @__PURE__ */ globalValue("effect/Schema/astCache", () => /* @__PURE__ */ new WeakMap());
var getClassAnnotations = (annotations3) => {
  if (annotations3 === void 0) {
    return [];
  } else if (Array.isArray(annotations3)) {
    return annotations3;
  } else {
    return [annotations3];
  }
};
var makeClass = ({
  Base: Base3,
  annotations: annotations3,
  disableToString,
  fields,
  identifier: identifier2,
  kind,
  schema
}) => {
  const classSymbol = Symbol.for(`effect/Schema/${kind}/${identifier2}`);
  const [typeAnnotations, transformationAnnotations, encodedAnnotations] = getClassAnnotations(annotations3);
  const typeSchema_ = typeSchema(schema);
  const declarationSurrogate = typeSchema_.annotations({
    identifier: identifier2,
    ...typeAnnotations
  });
  const typeSide = typeSchema_.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Type side)`,
    ...typeAnnotations
  });
  const constructorSchema = schema.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Constructor)`,
    ...typeAnnotations
  });
  const encodedSide = schema.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Encoded side)`,
    ...encodedAnnotations
  });
  const transformationSurrogate = schema.annotations({
    [JSONIdentifierAnnotationId]: identifier2,
    ...encodedAnnotations,
    ...typeAnnotations,
    ...transformationAnnotations
  });
  const fallbackInstanceOf = (u) => hasProperty(u, classSymbol) && is(typeSide)(u);
  const klass = class extends Base3 {
    constructor(props = {}, options = false) {
      props = {
        ...props
      };
      if (kind !== "Class") {
        delete props["_tag"];
      }
      props = lazilyMergeDefaults(fields, props);
      if (!getDisableValidationMakeOption(options)) {
        props = validateSync(constructorSchema)(props);
      }
      super(props, true);
    }
    // ----------------
    // Schema interface
    // ----------------
    static [TypeId15] = variance5;
    static get ast() {
      let out = astCache.get(this);
      if (out) {
        return out;
      }
      const declaration = declare([schema], {
        decode: () => (input, _, ast) => input instanceof this || fallbackInstanceOf(input) ? succeed7(input) : fail6(new Type2(ast, input)),
        encode: () => (input, options) => input instanceof this ? succeed7(input) : map13(encodeUnknown(typeSide)(input, options), (props) => new this(props, true))
      }, {
        identifier: identifier2,
        pretty: (pretty3) => (self) => `${identifier2}(${pretty3(self)})`,
        // @ts-expect-error
        arbitrary: (arb) => (fc) => arb(fc).map((props) => new this(props)),
        equivalence: identity,
        [SurrogateAnnotationId]: declarationSurrogate.ast,
        ...typeAnnotations
      });
      out = transform2(encodedSide, declaration, {
        strict: true,
        decode: (i) => new this(i, true),
        encode: identity
      }).annotations({
        [SurrogateAnnotationId]: transformationSurrogate.ast,
        ...transformationAnnotations
      }).ast;
      astCache.set(this, out);
      return out;
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static annotations(annotations4) {
      return make34(this.ast).annotations(annotations4);
    }
    static toString() {
      return `(${String(encodedSide)} <-> ${identifier2})`;
    }
    // ----------------
    // Class interface
    // ----------------
    static make(...args2) {
      return new this(...args2);
    }
    static fields = {
      ...fields
    };
    static identifier = identifier2;
    static extend(identifier3) {
      return (newFieldsOr, annotations4) => {
        const newFields = getFieldsFromFieldsOr(newFieldsOr);
        const newSchema = getSchemaFromFieldsOr(newFieldsOr);
        const extendedFields = extendFields(fields, newFields);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: extend2(schema, newSchema),
          fields: extendedFields,
          Base: this,
          annotations: annotations4
        });
      };
    }
    static transformOrFail(identifier3) {
      return (newFieldsOr, options, annotations4) => {
        const transformedFields = extendFields(fields, newFieldsOr);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: transformOrFail(schema, typeSchema(Struct(transformedFields)), options),
          fields: transformedFields,
          Base: this,
          annotations: annotations4
        });
      };
    }
    static transformOrFailFrom(identifier3) {
      return (newFields, options, annotations4) => {
        const transformedFields = extendFields(fields, newFields);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: transformOrFail(encodedSchema(schema), Struct(transformedFields), options),
          fields: transformedFields,
          Base: this,
          annotations: annotations4
        });
      };
    }
    // ----------------
    // other
    // ----------------
    get [classSymbol]() {
      return classSymbol;
    }
  };
  if (disableToString !== true) {
    Object.defineProperty(klass.prototype, "toString", {
      value() {
        return `${identifier2}({ ${ownKeys(fields).map((p) => `${formatPropertyKey(p)}: ${formatUnknown(this[p])}`).join(", ")} })`;
      },
      configurable: true,
      writable: true
    });
  }
  return klass;
};
var FiberIdNoneEncoded = /* @__PURE__ */ Struct({
  _tag: Literal2("None")
}).annotations({
  identifier: "FiberIdNoneEncoded"
});
var FiberIdRuntimeEncoded = /* @__PURE__ */ Struct({
  _tag: Literal2("Runtime"),
  id: Int,
  startTimeMillis: Int
}).annotations({
  identifier: "FiberIdRuntimeEncoded"
});
var FiberIdCompositeEncoded = /* @__PURE__ */ Struct({
  _tag: Literal2("Composite"),
  left: suspend5(() => FiberIdEncoded),
  right: suspend5(() => FiberIdEncoded)
}).annotations({
  identifier: "FiberIdCompositeEncoded"
});
var FiberIdEncoded = /* @__PURE__ */ Union2(FiberIdNoneEncoded, FiberIdRuntimeEncoded, FiberIdCompositeEncoded).annotations({
  identifier: "FiberIdEncoded"
});
var fiberIdArbitrary = (fc) => fc.letrec((tie) => ({
  None: fc.record({
    _tag: fc.constant("None")
  }),
  Runtime: fc.record({
    _tag: fc.constant("Runtime"),
    id: fc.integer(),
    startTimeMillis: fc.integer()
  }),
  Composite: fc.record({
    _tag: fc.constant("Composite"),
    left: tie("FiberId"),
    right: tie("FiberId")
  }),
  FiberId: fc.oneof(tie("None"), tie("Runtime"), tie("Composite"))
})).FiberId.map(fiberIdDecode);
var fiberIdPretty = (fiberId2) => {
  switch (fiberId2._tag) {
    case "None":
      return "FiberId.none";
    case "Runtime":
      return `FiberId.runtime(${fiberId2.id}, ${fiberId2.startTimeMillis})`;
    case "Composite":
      return `FiberId.composite(${fiberIdPretty(fiberId2.right)}, ${fiberIdPretty(fiberId2.left)})`;
  }
};
var FiberIdFromSelf = class extends (/* @__PURE__ */ declare(isFiberId2, {
  identifier: "FiberIdFromSelf",
  pretty: () => fiberIdPretty,
  arbitrary: () => fiberIdArbitrary
})) {
};
var fiberIdDecode = (input) => {
  switch (input._tag) {
    case "None":
      return none4;
    case "Runtime":
      return runtime2(input.id, input.startTimeMillis);
    case "Composite":
      return composite2(fiberIdDecode(input.left), fiberIdDecode(input.right));
  }
};
var fiberIdEncode = (input) => {
  switch (input._tag) {
    case "None":
      return {
        _tag: "None"
      };
    case "Runtime":
      return {
        _tag: "Runtime",
        id: input.id,
        startTimeMillis: input.startTimeMillis
      };
    case "Composite":
      return {
        _tag: "Composite",
        left: fiberIdEncode(input.left),
        right: fiberIdEncode(input.right)
      };
  }
};
var FiberId = class extends (/* @__PURE__ */ transform2(FiberIdEncoded, FiberIdFromSelf, {
  strict: true,
  decode: (i) => fiberIdDecode(i),
  encode: (a) => fiberIdEncode(a)
}).annotations({
  identifier: "FiberId"
})) {
};
var causeDieEncoded = (defect) => Struct({
  _tag: Literal2("Die"),
  defect
});
var CauseEmptyEncoded = /* @__PURE__ */ Struct({
  _tag: /* @__PURE__ */ Literal2("Empty")
});
var causeFailEncoded = (error) => Struct({
  _tag: Literal2("Fail"),
  error
});
var CauseInterruptEncoded = /* @__PURE__ */ Struct({
  _tag: /* @__PURE__ */ Literal2("Interrupt"),
  fiberId: FiberIdEncoded
});
var causeEncodedId = 0;
var causeEncoded = (error, defect) => {
  const error_ = asSchema(error);
  const defect_ = asSchema(defect);
  const suspended3 = suspend5(() => out);
  const out = Union2(CauseEmptyEncoded, causeFailEncoded(error_), causeDieEncoded(defect_), CauseInterruptEncoded, Struct({
    _tag: Literal2("Sequential"),
    left: suspended3,
    right: suspended3
  }), Struct({
    _tag: Literal2("Parallel"),
    left: suspended3,
    right: suspended3
  })).annotations({
    title: `CauseEncoded<${format6(error)}>`,
    [JSONIdentifierAnnotationId]: `CauseEncoded${causeEncodedId++}`
  });
  return out;
};
var causeArbitrary = (error, defect) => (fc) => fc.letrec((tie) => ({
  Empty: fc.record({
    _tag: fc.constant("Empty")
  }),
  Fail: fc.record({
    _tag: fc.constant("Fail"),
    error: error(fc)
  }),
  Die: fc.record({
    _tag: fc.constant("Die"),
    defect: defect(fc)
  }),
  Interrupt: fc.record({
    _tag: fc.constant("Interrupt"),
    fiberId: fiberIdArbitrary(fc)
  }),
  Sequential: fc.record({
    _tag: fc.constant("Sequential"),
    left: tie("Cause"),
    right: tie("Cause")
  }),
  Parallel: fc.record({
    _tag: fc.constant("Parallel"),
    left: tie("Cause"),
    right: tie("Cause")
  }),
  Cause: fc.oneof(tie("Empty"), tie("Fail"), tie("Die"), tie("Interrupt"), tie("Sequential"), tie("Parallel"))
})).Cause.map(causeDecode);
var causePretty = (error) => (cause) => {
  const f = (cause2) => {
    switch (cause2._tag) {
      case "Empty":
        return "Cause.empty";
      case "Fail":
        return `Cause.fail(${error(cause2.error)})`;
      case "Die":
        return `Cause.die(${pretty2(cause2)})`;
      case "Interrupt":
        return `Cause.interrupt(${fiberIdPretty(cause2.fiberId)})`;
      case "Sequential":
        return `Cause.sequential(${f(cause2.left)}, ${f(cause2.right)})`;
      case "Parallel":
        return `Cause.parallel(${f(cause2.left)}, ${f(cause2.right)})`;
    }
  };
  return f(cause);
};
var causeParse = (decodeUnknown3) => (u, options, ast) => isCause2(u) ? toComposite(decodeUnknown3(causeEncode(u), options), causeDecode, ast, u) : fail6(new Type2(ast, u));
var CauseFromSelf = ({
  defect,
  error
}) => {
  return declare([error, defect], {
    decode: (error2, defect2) => causeParse(decodeUnknown(causeEncoded(error2, defect2))),
    encode: (error2, defect2) => causeParse(encodeUnknown(causeEncoded(error2, defect2)))
  }, {
    title: `Cause<${error.ast}>`,
    pretty: causePretty,
    arbitrary: causeArbitrary
  });
};
function causeDecode(cause) {
  switch (cause._tag) {
    case "Empty":
      return empty24;
    case "Fail":
      return fail3(cause.error);
    case "Die":
      return die3(cause.defect);
    case "Interrupt":
      return interrupt2(fiberIdDecode(cause.fiberId));
    case "Sequential":
      return sequential4(causeDecode(cause.left), causeDecode(cause.right));
    case "Parallel":
      return parallel4(causeDecode(cause.left), causeDecode(cause.right));
  }
}
function causeEncode(cause) {
  switch (cause._tag) {
    case "Empty":
      return {
        _tag: "Empty"
      };
    case "Fail":
      return {
        _tag: "Fail",
        error: cause.error
      };
    case "Die":
      return {
        _tag: "Die",
        defect: cause.defect
      };
    case "Interrupt":
      return {
        _tag: "Interrupt",
        fiberId: cause.fiberId
      };
    case "Sequential":
      return {
        _tag: "Sequential",
        left: causeEncode(cause.left),
        right: causeEncode(cause.right)
      };
    case "Parallel":
      return {
        _tag: "Parallel",
        left: causeEncode(cause.left),
        right: causeEncode(cause.right)
      };
  }
}
var Cause = ({
  defect,
  error
}) => {
  const error_ = asSchema(error);
  const defect_ = asSchema(defect);
  const out = transform2(causeEncoded(error_, defect_), CauseFromSelf({
    error: typeSchema(error_),
    defect: typeSchema(defect_)
  }), {
    strict: false,
    decode: (i) => causeDecode(i),
    encode: (a) => causeEncode(a)
  });
  return out;
};
var Defect = class extends (/* @__PURE__ */ transform2(Unknown, Unknown, {
  strict: true,
  decode: (i) => {
    if (isObject(i) && "message" in i && typeof i.message === "string") {
      const err2 = new Error(i.message, {
        cause: i
      });
      if ("name" in i && typeof i.name === "string") {
        err2.name = i.name;
      }
      err2.stack = "stack" in i && typeof i.stack === "string" ? i.stack : "";
      return err2;
    }
    return String(i);
  },
  encode: (a) => {
    if (a instanceof Error) {
      return {
        name: a.name,
        message: a.message
        // no stack because of security reasons
      };
    }
    return prettyErrorMessage(a);
  }
}).annotations({
  identifier: "Defect"
})) {
};
var exitFailureEncoded = (error, defect) => Struct({
  _tag: Literal2("Failure"),
  cause: causeEncoded(error, defect)
});
var exitSuccessEncoded = (value3) => Struct({
  _tag: Literal2("Success"),
  value: value3
});
var exitEncoded = (value3, error, defect) => {
  return Union2(exitFailureEncoded(error, defect), exitSuccessEncoded(value3)).annotations({
    title: `ExitEncoded<${format6(value3)}, ${format6(error)}, ${format6(defect)}>`
  });
};
var exitDecode = (input) => {
  switch (input._tag) {
    case "Failure":
      return failCause2(causeDecode(input.cause));
    case "Success":
      return succeed2(input.value);
  }
};
var exitArbitrary = (value3, error, defect) => (fc) => fc.oneof(fc.record({
  _tag: fc.constant("Failure"),
  cause: causeArbitrary(error, defect)(fc)
}), fc.record({
  _tag: fc.constant("Success"),
  value: value3(fc)
})).map(exitDecode);
var exitPretty = (value3, error) => (exit3) => exit3._tag === "Failure" ? `Exit.failCause(${causePretty(error)(exit3.cause)})` : `Exit.succeed(${value3(exit3.value)})`;
var exitParse = (decodeUnknownValue, decodeUnknownCause) => (u, options, ast) => isExit(u) ? match6(u, {
  onFailure: (cause) => toComposite(decodeUnknownCause(cause, options), failCause2, ast, u),
  onSuccess: (value3) => toComposite(decodeUnknownValue(value3, options), succeed2, ast, u)
}) : fail6(new Type2(ast, u));
var ExitFromSelf = ({
  defect,
  failure,
  success
}) => declare([success, failure, defect], {
  decode: (success2, failure2, defect2) => exitParse(decodeUnknown(success2), decodeUnknown(CauseFromSelf({
    error: failure2,
    defect: defect2
  }))),
  encode: (success2, failure2, defect2) => exitParse(encodeUnknown(success2), encodeUnknown(CauseFromSelf({
    error: failure2,
    defect: defect2
  })))
}, {
  title: `Exit<${success.ast}, ${failure.ast}>`,
  pretty: exitPretty,
  arbitrary: exitArbitrary
});
var Exit = ({
  defect,
  failure,
  success
}) => {
  const success_ = asSchema(success);
  const failure_ = asSchema(failure);
  const defect_ = asSchema(defect);
  const out = transform2(exitEncoded(success_, failure_, defect_), ExitFromSelf({
    failure: typeSchema(failure_),
    success: typeSchema(success_),
    defect: typeSchema(defect_)
  }), {
    strict: false,
    decode: (i) => exitDecode(i),
    encode: (a) => a._tag === "Failure" ? {
      _tag: "Failure",
      cause: a.cause
    } : {
      _tag: "Success",
      value: a.value
    }
  });
  return out;
};
var hashSetArbitrary = (item, ctx) => (fc) => {
  const items = fc.array(item(fc));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map(fromIterable5);
};
var hashSetPretty = (item) => (set6) => `HashSet(${Array.from(set6).map((a) => item(a)).join(", ")})`;
var hashSetEquivalence = (item) => {
  const arrayEquivalence = getEquivalence3(item);
  return make((a, b) => arrayEquivalence(Array.from(a), Array.from(b)));
};
var hashSetParse = (decodeUnknown3) => (u, options, ast) => isHashSet2(u) ? toComposite(decodeUnknown3(Array.from(u), options), fromIterable5, ast, u) : fail6(new Type2(ast, u));
var HashSetFromSelf = (value3) => {
  return declare([value3], {
    decode: (item) => hashSetParse(decodeUnknown(Array$(item))),
    encode: (item) => hashSetParse(encodeUnknown(Array$(item)))
  }, {
    description: `HashSet<${format6(value3)}>`,
    pretty: hashSetPretty,
    arbitrary: hashSetArbitrary,
    equivalence: hashSetEquivalence
  });
};
function HashSet(value3) {
  return transform2(Array$(value3), HashSetFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => fromIterable5(i),
    encode: (a) => Array.from(a)
  });
}
var hashMapArbitrary = (key, value3, ctx) => (fc) => {
  const items = fc.array(fc.tuple(key(fc), value3(fc)));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map(fromIterable6);
};
var hashMapPretty = (key, value3) => (map15) => `HashMap([${Array.from(map15).map(([k, v]) => `[${key(k)}, ${value3(v)}]`).join(", ")}])`;
var hashMapEquivalence = (key, value3) => {
  const arrayEquivalence = getEquivalence3(make(([ka, va], [kb, vb]) => key(ka, kb) && value3(va, vb)));
  return make((a, b) => arrayEquivalence(Array.from(a), Array.from(b)));
};
var hashMapParse = (decodeUnknown3) => (u, options, ast) => isHashMap2(u) ? toComposite(decodeUnknown3(Array.from(u), options), fromIterable6, ast, u) : fail6(new Type2(ast, u));
var HashMapFromSelf = ({
  key,
  value: value3
}) => {
  return declare([key, value3], {
    decode: (key2, value4) => hashMapParse(decodeUnknown(Array$(Tuple(key2, value4)))),
    encode: (key2, value4) => hashMapParse(encodeUnknown(Array$(Tuple(key2, value4))))
  }, {
    description: `HashMap<${format6(key)}, ${format6(value3)}>`,
    pretty: hashMapPretty,
    arbitrary: hashMapArbitrary,
    equivalence: hashMapEquivalence
  });
};
var HashMap = ({
  key,
  value: value3
}) => {
  return transform2(Array$(Tuple(key, value3)), HashMapFromSelf({
    key: typeSchema(asSchema(key)),
    value: typeSchema(asSchema(value3))
  }), {
    strict: true,
    decode: (i) => fromIterable6(i),
    encode: (a) => Array.from(a)
  });
};
var listArbitrary = (item, ctx) => (fc) => {
  const items = fc.array(item(fc));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map(fromIterable7);
};
var listPretty = (item) => (set6) => `List(${Array.from(set6).map((a) => item(a)).join(", ")})`;
var listEquivalence = (item) => {
  const arrayEquivalence = getEquivalence3(item);
  return make((a, b) => arrayEquivalence(Array.from(a), Array.from(b)));
};
var listParse = (decodeUnknown3) => (u, options, ast) => isList(u) ? toComposite(decodeUnknown3(Array.from(u), options), fromIterable7, ast, u) : fail6(new Type2(ast, u));
var ListFromSelf = (value3) => {
  return declare([value3], {
    decode: (item) => listParse(decodeUnknown(Array$(item))),
    encode: (item) => listParse(encodeUnknown(Array$(item)))
  }, {
    description: `List<${format6(value3)}>`,
    pretty: listPretty,
    arbitrary: listArbitrary,
    equivalence: listEquivalence
  });
};
function List(value3) {
  return transform2(Array$(value3), ListFromSelf(typeSchema(asSchema(value3))), {
    strict: true,
    decode: (i) => fromIterable7(i),
    encode: (a) => Array.from(a)
  });
}
var sortedSetArbitrary = (item, ord, ctx) => (fc) => {
  const items = fc.array(item(fc));
  return (ctx.depthIdentifier !== void 0 ? fc.oneof(ctx, fc.constant([]), items) : items).map((as4) => fromIterable11(as4, ord));
};
var sortedSetPretty = (item) => (set6) => `new SortedSet([${Array.from(values3(set6)).map((a) => item(a)).join(", ")}])`;
var sortedSetParse = (decodeUnknown3, ord) => (u, options, ast) => isSortedSet(u) ? toComposite(decodeUnknown3(Array.from(values3(u)), options), (as4) => fromIterable11(as4, ord), ast, u) : fail6(new Type2(ast, u));
var SortedSetFromSelf = (value3, ordA, ordI) => {
  return declare([value3], {
    decode: (item) => sortedSetParse(decodeUnknown(Array$(item)), ordA),
    encode: (item) => sortedSetParse(encodeUnknown(Array$(item)), ordI)
  }, {
    description: `SortedSet<${format6(value3)}>`,
    pretty: sortedSetPretty,
    arbitrary: (arb, ctx) => sortedSetArbitrary(arb, ordA, ctx),
    equivalence: () => getEquivalence6()
  });
};
function SortedSet(value3, ordA) {
  const to = typeSchema(asSchema(value3));
  return transform2(Array$(value3), SortedSetFromSelf(to, ordA, ordA), {
    strict: true,
    decode: (i) => fromIterable11(i, ordA),
    encode: (a) => Array.from(values3(a))
  });
}
var BooleanFromUnknown = class extends (/* @__PURE__ */ transform2(Unknown, Boolean$, {
  strict: true,
  decode: (i) => isTruthy(i),
  encode: identity
}).annotations({
  identifier: "BooleanFromUnknown"
})) {
};
var BooleanFromString = class extends (/* @__PURE__ */ transform2(Literal2("true", "false").annotations({
  description: "a string to be decoded into a boolean"
}), Boolean$, {
  strict: true,
  decode: (i) => i === "true",
  encode: (a) => a ? "true" : "false"
}).annotations({
  identifier: "BooleanFromString"
})) {
};
var Config = (name, schema) => {
  const decodeUnknownEither3 = decodeUnknownEither(schema);
  return string4(name).pipe(mapOrFail2((s) => decodeUnknownEither3(s).pipe(mapLeft((error) => InvalidData2([], TreeFormatter.formatIssueSync(error))))));
};
var symbolSerializable = /* @__PURE__ */ Symbol.for("effect/Schema/Serializable/symbol");
var asSerializable = (serializable) => serializable;
var serializableSchema = (self) => self[symbolSerializable];
var serialize = (self) => encodeUnknown2(self[symbolSerializable])(self);
var deserialize = /* @__PURE__ */ dual(2, (self, value3) => decodeUnknown2(self[symbolSerializable])(value3));
var symbolWithResult = /* @__PURE__ */ Symbol.for("effect/Schema/Serializable/symbolResult");
var asWithResult = (withExit) => withExit;
var failureSchema = (self) => self[symbolWithResult].failure;
var successSchema = (self) => self[symbolWithResult].success;
var exitSchemaCache = /* @__PURE__ */ globalValue("effect/Schema/Serializable/exitSchemaCache", () => /* @__PURE__ */ new WeakMap());
var exitSchema = (self) => {
  const proto5 = Object.getPrototypeOf(self);
  if (!(symbolWithResult in proto5)) {
    return Exit({
      failure: failureSchema(self),
      success: successSchema(self),
      defect: Defect
    });
  }
  let schema = exitSchemaCache.get(proto5);
  if (schema === void 0) {
    schema = Exit({
      failure: failureSchema(self),
      success: successSchema(self),
      defect: Defect
    });
    exitSchemaCache.set(proto5, schema);
  }
  return schema;
};
var serializeFailure = /* @__PURE__ */ dual(2, (self, value3) => encode4(self[symbolWithResult].failure)(value3));
var deserializeFailure = /* @__PURE__ */ dual(2, (self, value3) => decodeUnknown2(self[symbolWithResult].failure)(value3));
var serializeSuccess = /* @__PURE__ */ dual(2, (self, value3) => encode4(self[symbolWithResult].success)(value3));
var deserializeSuccess = /* @__PURE__ */ dual(2, (self, value3) => decodeUnknown2(self[symbolWithResult].success)(value3));
var serializeExit = /* @__PURE__ */ dual(2, (self, value3) => encode4(exitSchema(self))(value3));
var deserializeExit = /* @__PURE__ */ dual(2, (self, value3) => decodeUnknown2(exitSchema(self))(value3));
var asSerializableWithResult = (procedure) => procedure;
var TaggedRequest = (identifier2) => (tag2, options, annotations3) => {
  const taggedFields = extendFields({
    _tag: getClassTag(tag2)
  }, options.payload);
  return class TaggedRequestClass extends makeClass({
    kind: "TaggedRequest",
    identifier: identifier2 ?? tag2,
    schema: Struct(taggedFields),
    fields: taggedFields,
    Base: Class5,
    annotations: annotations3
  }) {
    static _tag = tag2;
    static success = options.success;
    static failure = options.failure;
    get [symbolSerializable]() {
      return this.constructor;
    }
    get [symbolWithResult]() {
      return {
        failure: options.failure,
        success: options.success
      };
    }
  };
};
var equivalence2 = (schema) => go2(schema.ast, []);
var getEquivalenceAnnotation = /* @__PURE__ */ getAnnotation(EquivalenceAnnotationId);
var go2 = (ast, path2) => {
  const hook = getEquivalenceAnnotation(ast);
  if (isSome2(hook)) {
    switch (ast._tag) {
      case "Declaration":
        return hook.value(...ast.typeParameters.map((tp) => go2(tp, path2)));
      case "Refinement":
        return hook.value(go2(ast.from, path2));
      default:
        return hook.value();
    }
  }
  switch (ast._tag) {
    case "NeverKeyword":
      throw new Error(getEquivalenceUnsupportedErrorMessage(ast, path2));
    case "Transformation":
      return go2(ast.to, path2);
    case "Declaration":
    case "Literal":
    case "StringKeyword":
    case "TemplateLiteral":
    case "UniqueSymbol":
    case "SymbolKeyword":
    case "UnknownKeyword":
    case "AnyKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "UndefinedKeyword":
    case "VoidKeyword":
    case "Enums":
    case "ObjectKeyword":
      return equals;
    case "Refinement":
      return go2(ast.from, path2);
    case "Suspend": {
      const get10 = memoizeThunk(() => go2(ast.f(), path2));
      return (a, b) => get10()(a, b);
    }
    case "TupleType": {
      const elements = ast.elements.map((element2, i) => go2(element2.type, path2.concat(i)));
      const rest = ast.rest.map((annotatedAST) => go2(annotatedAST.type, path2));
      return make((a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) {
          return false;
        }
        const len = a.length;
        if (len !== b.length) {
          return false;
        }
        let i = 0;
        for (; i < Math.min(len, ast.elements.length); i++) {
          if (!elements[i](a[i], b[i])) {
            return false;
          }
        }
        if (isNonEmptyReadonlyArray(rest)) {
          const [head4, ...tail] = rest;
          for (; i < len - tail.length; i++) {
            if (!head4(a[i], b[i])) {
              return false;
            }
          }
          for (let j = 0; j < tail.length; j++) {
            i += j;
            if (!tail[j](a[i], b[i])) {
              return false;
            }
          }
        }
        return true;
      });
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return equals;
      }
      const propertySignatures = ast.propertySignatures.map((ps) => go2(ps.type, path2.concat(ps.name)));
      const indexSignatures = ast.indexSignatures.map((is2) => go2(is2.type, path2));
      return make((a, b) => {
        if (!isRecord(a) || !isRecord(b)) {
          return false;
        }
        const aStringKeys = Object.keys(a);
        const aSymbolKeys = Object.getOwnPropertySymbols(a);
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = ast.propertySignatures[i];
          const name = ps.name;
          const aHas = Object.prototype.hasOwnProperty.call(a, name);
          const bHas = Object.prototype.hasOwnProperty.call(b, name);
          if (ps.isOptional) {
            if (aHas !== bHas) {
              return false;
            }
          }
          if (aHas && bHas && !propertySignatures[i](a[name], b[name])) {
            return false;
          }
        }
        let bSymbolKeys;
        let bStringKeys;
        for (let i = 0; i < indexSignatures.length; i++) {
          const is2 = ast.indexSignatures[i];
          const encodedParameter = getEncodedParameter(is2.parameter);
          const isSymbol2 = isSymbolKeyword(encodedParameter);
          if (isSymbol2) {
            bSymbolKeys = bSymbolKeys || Object.getOwnPropertySymbols(b);
            if (aSymbolKeys.length !== bSymbolKeys.length) {
              return false;
            }
          } else {
            bStringKeys = bStringKeys || Object.keys(b);
            if (aStringKeys.length !== bStringKeys.length) {
              return false;
            }
          }
          const aKeys = isSymbol2 ? aSymbolKeys : aStringKeys;
          for (let j = 0; j < aKeys.length; j++) {
            const key = aKeys[j];
            if (!Object.prototype.hasOwnProperty.call(b, key) || !indexSignatures[i](a[key], b[key])) {
              return false;
            }
          }
        }
        return true;
      });
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, true);
      const ownKeys2 = ownKeys(searchTree.keys);
      const len = ownKeys2.length;
      return make((a, b) => {
        let candidates = [];
        if (len > 0 && isRecordOrArray(a)) {
          for (let i = 0; i < len; i++) {
            const name = ownKeys2[i];
            const buckets = searchTree.keys[name].buckets;
            if (Object.prototype.hasOwnProperty.call(a, name)) {
              const literal2 = String(a[name]);
              if (Object.prototype.hasOwnProperty.call(buckets, literal2)) {
                candidates = candidates.concat(buckets[literal2]);
              }
            }
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        const tuples = candidates.map((ast2) => [go2(ast2, path2), is({
          ast: ast2
        })]);
        for (let i = 0; i < tuples.length; i++) {
          const [equivalence3, is2] = tuples[i];
          if (is2(a) && is2(b)) {
            if (equivalence3(a, b)) {
              return true;
            }
          }
        }
        return false;
      });
    }
  }
};
var SymbolStruct = /* @__PURE__ */ TaggedStruct("symbol", {
  key: String$
}).annotations({
  description: "an object to be decoded into a globally shared symbol"
});
var SymbolFromStruct = /* @__PURE__ */ transformOrFail(SymbolStruct, SymbolFromSelf, {
  strict: true,
  decode: (i) => decodeSymbol(i.key),
  encode: (a, _, ast) => map13(encodeSymbol2(a, ast), (key) => SymbolStruct.make({
    key
  }))
});
var PropertyKey$ = class extends (/* @__PURE__ */ Union2(String$, Number$, SymbolFromStruct).annotations({
  identifier: "PropertyKey"
})) {
};
var ArrayFormatterIssue = class extends (/* @__PURE__ */ Struct({
  _tag: propertySignature(Literal2("Pointer", "Unexpected", "Missing", "Composite", "Refinement", "Transformation", "Type", "Forbidden")).annotations({
    description: "The tag identifying the type of parse issue"
  }),
  path: propertySignature(Array$(PropertyKey$)).annotations({
    description: "The path to the property where the issue occurred"
  }),
  message: propertySignature(String$).annotations({
    description: "A descriptive message explaining the issue"
  })
}).annotations({
  identifier: "ArrayFormatterIssue",
  description: "Represents an issue returned by the ArrayFormatter formatter"
})) {
};

// src/defaultConfig.ts
function defaultConfig() {
  return makePrismaConfigInternal({
    earlyAccess: true,
    loadedFromFile: null
  });
}

// src/defineConfig.ts
var debug2 = Debug("prisma:config:defineConfig");
function defineConfig(configInput) {
  const config2 = defaultConfig();
  debug2("[default]: %o", config2);
  defineSchemaConfig(config2, configInput);
  defineAdapterConfig(config2, configInput);
  defineStudioConfig(config2, configInput);
  defineMigrationsConfig(config2, configInput);
  defineTypedSqlConfig(config2, configInput);
  defineViewsConfig(config2, configInput);
  return config2;
}
function defineSchemaConfig(config2, configInput) {
  if (!configInput.schema) {
    return;
  }
  config2.schema = configInput.schema;
  debug2("[config.schema]: %o", config2.schema);
}
function defineMigrationsConfig(config2, configInput) {
  if (!configInput.migrations) {
    return;
  }
  config2.migrations = configInput.migrations;
  debug2("[config.migrations]: %o", config2.migrations);
}
function defineTypedSqlConfig(config2, configInput) {
  if (!configInput.typedSql) {
    return;
  }
  config2.typedSql = configInput.typedSql;
  debug2("[config.typedSql]: %o", config2.typedSql);
}
function defineViewsConfig(config2, configInput) {
  if (!configInput.views) {
    return;
  }
  config2.views = configInput.views;
  debug2("[config.views]: %o", config2.views);
}
function defineStudioConfig(config2, configInput) {
  if (!configInput.studio?.adapter) {
    return;
  }
  const { adapter: getAdapterFactory } = configInput.studio;
  config2.studio = {
    adapter: async () => {
      const adapterFactory = await getAdapterFactory();
      debug2("[config.studio.adapter]: %o", adapterFactory.adapterName);
      return adapterFactory;
    }
  };
  debug2("[config.studio]: %o", config2.studio);
}
function defineAdapterConfig(config2, configInput) {
  if (!configInput.adapter) {
    return;
  }
  const { adapter: getAdapterFactory } = configInput;
  config2.adapter = async () => {
    const adapterFactory = await getAdapterFactory();
    debug2("[config.migrate.adapter]: %o", adapterFactory.adapterName);
    return bindMigrationAwareSqlAdapterFactory(adapterFactory);
  };
  debug2("[config.adapter]: %o", config2.adapter);
}

// src/PrismaConfig.ts
var debug3 = Debug("prisma:config:PrismaConfig");
var SqlMigrationAwareDriverAdapterFactoryShape = Schema_exports.declare(
  (input) => {
    return typeof input === "function";
  },
  {
    identifier: "SqlMigrationAwareDriverAdapterFactory",
    encode: identity,
    decode: identity
  }
);
var ErrorCapturingSqlMigrationAwareDriverAdapterFactoryShape = Schema_exports.declare(
  (input) => {
    return typeof input === "function";
  },
  {
    identifier: "ErrorCapturingSqlMigrationAwareDriverAdapterFactory",
    encode: identity,
    decode: identity
  }
);
var MigrationsConfigShape = Schema_exports.Struct({
  path: Schema_exports.optional(Schema_exports.String)
});
if (false) {
  __testMigrationsConfigShapeValueA;
  __testMigrationsConfigShapeValueB;
}
var ViewsConfigShape = Schema_exports.Struct({
  path: Schema_exports.optional(Schema_exports.String)
});
if (false) {
  __testViewsConfigShapeValueA;
  __testViewsConfigShapeValueB;
}
var TypedSqlConfigShape = Schema_exports.Struct({
  path: Schema_exports.optional(Schema_exports.String)
});
if (false) {
  __testTypedSqlConfigShapeValueA;
  __testTypedSqlConfigShapeValueB;
}
var PrismaStudioConfigShape = Schema_exports.Struct({
  /**
   * Instantiates the Prisma driver adapter to use for Prisma Studio.
   */
  adapter: SqlMigrationAwareDriverAdapterFactoryShape
});
if (false) {
  __testPrismaStudioConfigShapeValueA;
  __testPrismaStudioConfigShapeValueB;
}
if (false) {
  __testPrismaConfig;
  __testPrismaConfigInternal;
}
var PrismaConfigShape = Schema_exports.Struct({
  earlyAccess: Schema_exports.Literal(true),
  schema: Schema_exports.optional(Schema_exports.String),
  studio: Schema_exports.optional(PrismaStudioConfigShape),
  adapter: Schema_exports.optional(SqlMigrationAwareDriverAdapterFactoryShape),
  migrations: Schema_exports.optional(MigrationsConfigShape),
  views: Schema_exports.optional(ViewsConfigShape),
  typedSql: Schema_exports.optional(TypedSqlConfigShape)
});
if (false) {
  __testPrismaConfigValueA;
  __testPrismaConfigValueB;
}
function parsePrismaConfigShape(input) {
  return Schema_exports.decodeUnknownEither(PrismaConfigShape, {})(input, {
    onExcessProperty: "error"
  });
}
var PRISMA_CONFIG_INTERNAL_BRAND = Symbol.for("PrismaConfigInternal");
var PrismaConfigInternalShape = Schema_exports.Struct({
  ...Struct_exports.omit(PrismaConfigShape.fields, "adapter"),
  adapter: Schema_exports.optional(ErrorCapturingSqlMigrationAwareDriverAdapterFactoryShape),
  loadedFromFile: Schema_exports.NullOr(Schema_exports.String)
});
if (false) {
  __testPrismaConfigInternalValueA;
  __testPrismaConfigInternalValueB;
}
function brandPrismaConfigInternal(config2) {
  Object.defineProperty(config2, "__brand", {
    value: PRISMA_CONFIG_INTERNAL_BRAND,
    writable: true,
    configurable: true,
    enumerable: false
  });
  return config2;
}
function parsePrismaConfigInternalShape(input) {
  debug3("Parsing PrismaConfigInternal: %o", input);
  if (typeof input === "object" && input !== null && input["__brand"] === PRISMA_CONFIG_INTERNAL_BRAND) {
    debug3("Short-circuit: input is already a PrismaConfigInternal object");
    return Either_exports.right(input);
  }
  return pipe(
    Schema_exports.decodeUnknownEither(PrismaConfigInternalShape, {})(input, {
      onExcessProperty: "error"
    }),
    // Brand the output type to make `PrismaConfigInternal` opaque, without exposing the `Effect/Brand` type
    // to the public API.
    // This is done to work around the following issues:
    // - https://github.com/microsoft/rushstack/issues/1308
    // - https://github.com/microsoft/rushstack/issues/4034
    // - https://github.com/microsoft/TypeScript/issues/58914
    Either_exports.map(brandPrismaConfigInternal)
  );
}
function makePrismaConfigInternal(makeArgs) {
  return pipe(PrismaConfigInternalShape.make(makeArgs), brandPrismaConfigInternal);
}
function parseDefaultExport(defaultExport) {
  const parseResultEither = pipe(
    // If the given config conforms to the `PrismaConfig` shape, feed it to `defineConfig`.
    parsePrismaConfigShape(defaultExport),
    Either_exports.map((config2) => {
      debug3("Parsed `PrismaConfig` shape: %o", config2);
      return defineConfig(config2);
    }),
    // Otherwise, try to parse it as a `PrismaConfigInternal` shape.
    Either_exports.orElse(() => parsePrismaConfigInternalShape(defaultExport))
  );
  if (Either_exports.isLeft(parseResultEither)) {
    throw parseResultEither.left;
  }
  return parseResultEither.right;
}

// src/defaultTestConfig.ts
function defaultTestConfig() {
  return makePrismaConfigInternal({
    earlyAccess: true,
    loadedFromFile: null
  });
}

// src/loadConfigFromFile.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_node_process = __toESM(require("node:process"));
var import_jiti = require("jiti");
var debug4 = Debug("prisma:config:loadConfigFromFile");
async function loadConfigFromFile({
  configFile,
  configRoot = import_node_process.default.cwd()
}) {
  const start = performance.now();
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;
  let resolvedPath;
  if (configFile) {
    resolvedPath = import_node_path.default.resolve(configRoot, configFile);
    if (!import_node_fs.default.existsSync(resolvedPath)) {
      debug4(`The given config file was not found at %s`, resolvedPath);
      return { resolvedPath, error: { _tag: "ConfigFileNotFound" } };
    }
  } else {
    resolvedPath = ["prisma.config.ts"].map((file) => import_node_path.default.resolve(configRoot, file)).find((file) => import_node_fs.default.existsSync(file)) ?? null;
    if (resolvedPath === null) {
      debug4(`No config file found in the current working directory %s`, configRoot);
      return { resolvedPath, config: defaultConfig() };
    }
  }
  try {
    const { required: required3, error } = await requireTypeScriptFile(resolvedPath);
    if (error) {
      return {
        resolvedPath,
        error
      };
    }
    debug4(`Config file loaded in %s`, getTime());
    let defaultExport;
    try {
      defaultExport = parseDefaultExport(required3["default"]);
    } catch (e) {
      const error2 = e;
      return {
        resolvedPath,
        error: {
          _tag: "ConfigFileParseError",
          error: error2
        }
      };
    }
    import_node_process.default.stdout.write(`Loaded Prisma config from "${resolvedPath}".
`);
    const prismaConfig = transformPathsInConfigToAbsolute(defaultExport, resolvedPath);
    return {
      config: {
        ...prismaConfig,
        loadedFromFile: resolvedPath
      },
      resolvedPath
    };
  } catch (e) {
    const error = e;
    return {
      resolvedPath,
      error: {
        _tag: "UnknownError",
        error
      }
    };
  }
}
async function requireTypeScriptFile(resolvedPath) {
  try {
    const jiti = (0, import_jiti.createJiti)(__filename, {
      interopDefault: true,
      moduleCache: false
    });
    const configExport = await jiti.import(resolvedPath);
    return {
      required: configExport,
      error: null
    };
  } catch (e) {
    const error = e;
    debug4("jiti import failed: %s", error.message);
    return {
      error: {
        _tag: "TypeScriptImportFailed",
        error
      }
    };
  }
}
function transformPathsInConfigToAbsolute(prismaConfig, resolvedPath) {
  function resolvePath(value3) {
    if (!value3) {
      return void 0;
    }
    return import_node_path.default.resolve(import_node_path.default.dirname(resolvedPath), value3);
  }
  return {
    ...prismaConfig,
    schema: resolvePath(prismaConfig.schema),
    migrations: {
      ...prismaConfig.migrations,
      path: resolvePath(prismaConfig.migrations?.path)
    },
    typedSql: {
      ...prismaConfig.typedSql,
      path: resolvePath(prismaConfig.typedSql?.path)
    },
    views: {
      ...prismaConfig.views,
      path: resolvePath(prismaConfig.views?.path)
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultTestConfig,
  defineConfig,
  loadConfigFromFile
});
