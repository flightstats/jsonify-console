function enableErrorToJSON() {
  if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', { // eslint-disable-line object-shorthand,no-extend-native
      value: function getValue() {
        const alt = {};
        Object.getOwnPropertyNames(this).forEach(function assignKey(key) {
          alt[key] = this[key];
        }, this);

        return alt;
      },
      configurable: true,
      writable: true,
    });
  }
}

/**
 *  Check circular references.
 *
 *  @param ref A function that returns an alternative reference.
 *  @param methods A boolean that indicates functions should be
 *  coerced to strings.
 */
function circular(_ref, methods) {
  const ref = _ref || '[Circular]';
  const seen = [];
  return function go(key, given) {
    let val = given;
    if (typeof given === 'function' && methods) {
      val = given.toString();
    }

    val = typeof given === 'undefined' ? 'undefined' : val;

    if (!val || typeof (val) !== 'object') {
      return val;
    }
    if (seen.indexOf(val) !== -1) {
      if (typeof ref === 'function') return ref(val);
      return ref;
    }

    seen.push(val);
    return val;
  };
}

function stringify(obj, indent, ref, methods) {
  return JSON.stringify(obj, circular(ref, methods), indent);
}

function flatten(...statements) {
  const lines = {};
  for (let i = 0; i < statements.length; i++) {
    lines[i] = statements[i];
  }
  return stringify(lines);
}

function overrideConsole() {
  function consoleLog(...statements) {
    const line = flatten(...statements);
    process.stdout.write(`${line}\n`);
  }

  function consoleErr(...statements) {
    const line = flatten(...statements);
    process.stderr.write(`${line}\n`);
  }

  console.log = consoleLog;
  console.error = consoleErr;
}

function enableJSONErrorLogging() {
  enableErrorToJSON();
  overrideConsole();
}

enableJSONErrorLogging();
