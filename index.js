function enableErrorToJSON() {
  if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', { // eslint-disable-line object-shorthand,no-extend-native
      value: function getValue() {
        const alt = {};
        if (this.stack) {
          alt.stack = this.stack.split('\n');
        }

        Object.getOwnPropertyNames(this).forEach(function assignKey(key) {
          if (key === 'stack') { return; }
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

function overrideConsole() {
  function flatten(...statements) {
    const line = {};
    for (let i = 0; i < statements.length; i++) {
      line[i] = statements[i];
    }
    return line;
  }

  function consoleLog(...statements) {
    const line = flatten(statements);
    process.stdout.write(`${stringify(line, 2)}\n`);
  }

  function consoleErr(...statements) {
    const line = flatten(statements);
    process.stderr.write(`${stringify(line, 2)}\n`);
  }

  console.log = consoleLog;
  console.error = consoleErr;
}

function enableJSONErrorLogging() {
  enableErrorToJSON();
  overrideConsole();
}

enableJSONErrorLogging();
