# jsonify-console
Overrides console.log and console.error so that a single JSON string is written to stdout or stderr, respectively. Handles Error objects and circular references.

# Usage

```
require('jsonify-console');

// Use console.log and console.error as normal, including Error objects.

```

# Example 1: Variables
This code...

```
const o = { b: true, s: 'string', i: 10, f: 56.65, a: ['a', 'b', 'c'], o: { o2: 'object 2' } };
o.circ = o;
console.log('JSON error logging enabled', o);
```

...logs this string:

```
[
  "JSON error logging enabled",
  {
    "b": true,
    "s": "string",
    "i": 10,
    "f": 56.65,
    "a": [
      "a",
      "b",
      "c"
    ],
    "o": {
      "o2": "object 2"
    },
    "circ": "[Circular]"
  }
]
```

# Example 2: Error objects
This code...

```
const e = new Error('Some error');
e.code = 500;
e.data = {
  model: { stuff: 'bad news' },
};

console.error('There was a problem.', e);
```

...logs this string:

```
[
  "There was a problem.",
  {
    "stack": [
      "Error: Some error",
      "    at Object.<anonymous> (/Users/xxx/jsonify-console/test.js:4:11)",
      "    at Module._compile (module.js:624:30)",
      "    at Object.Module._extensions..js (module.js:635:10)",
      "    at Module.load (module.js:545:32)",
      "    at tryModuleLoad (module.js:508:12)",
      "    at Function.Module._load (module.js:500:3)",
      "    at Function.Module.runMain (module.js:665:10)",
      "    at startup (bootstrap_node.js:201:16)",
      "    at bootstrap_node.js:626:3"
    ],
    "message": "Some error",
    "code": 500,
    "data": {
      "model": {
        "stuff": "bad news"
      }
    }
  }
]
```
