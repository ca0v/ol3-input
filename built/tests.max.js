var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("node_modules/@ca0v/ceylon/ceylon/interfaces/expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/boolean-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/number-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/string-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/array-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/function-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/object-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/interfaces/expect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function equal(a, b) {
        if (a === b)
            return true;
        if ([Object, Array, Date, RegExp].some(function (t) { return a instanceof t !== b instanceof t; }))
            return false;
        if (typeof a == "object" && typeof b == "object") {
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a.length !== b.length)
                    return false;
                return a.every(function (v, i) { return equal(v, b[i]); });
            }
            if (a instanceof Date && b instanceof Date)
                return a.getTime() === b.getTime();
            if (a instanceof RegExp && b instanceof RegExp)
                return a.toString() === b.toString();
            var keys = Object.keys(a);
            if (keys.length !== Object.keys(b).length)
                return false;
            return keys.every(function (key) { return b.hasOwnProperty(key) && equal(a[key], b[key]); });
        }
        return a !== a && b !== b;
    }
    exports.equal = equal;
});
define("node_modules/@ca0v/ceylon/ceylon/assertion-error", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(_a) {
        var message = _a.message, expected = _a.expected, actual = _a.actual, showDiff = _a.showDiff;
        var error = new Error(message);
        error["expected"] = expected;
        error["actual"] = actual;
        error["showDiff"] = showDiff;
        error.name = "AssertionError";
        return error;
    }
    exports.default = default_1;
});
define("node_modules/@ca0v/ceylon/ceylon/assert", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/assertion-error"], function (require, exports, assertion_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert = function (_a) {
        var assertion = _a.assertion, message = _a.message, actual = _a.actual, expected = _a.expected;
        if (!assertion) {
            var error = assertion_error_1.default({
                actual: actual,
                expected: expected,
                message: message,
                showDiff: typeof actual !== "undefined" && typeof expected !== "undefined"
            });
            throw error;
        }
    };
    exports.default = assert;
});
define("node_modules/@ca0v/ceylon/ceylon/expectation", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", "node_modules/@ca0v/ceylon/ceylon/assert"], function (require, exports, fast_deep_equal_1, assert_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Expectation = (function () {
        function Expectation(actual) {
            this.actual = actual;
        }
        Expectation.prototype.toExist = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length !== 0,
                    message: message || "Expected array to exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length !== 0,
                    message: message || "Expected object to exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual !== "undefined" && this.actual !== null && this.actual !== "",
                    message: message || "Expected item to exist"
                });
            }
            return this;
        };
        Expectation.prototype.toNotExist = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === 0,
                    message: message || "Expected array to not exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length === 0,
                    message: message || "Expected object to not exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual === "undefined" || this.actual === null || this.actual === "",
                    message: message || "Expected item to not exist"
                });
            }
            return this;
        };
        Expectation.prototype.toBe = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual === value,
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to be " + JSON.stringify(value)
            });
            return this;
        };
        Expectation.prototype.toNotBe = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual !== value,
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to not be " + JSON.stringify(value)
            });
            return this;
        };
        Expectation.prototype.toEqual = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to equal " + JSON.stringify(value)
            });
            return this;
        };
        Expectation.prototype.toNotEqual = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: !fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || "Expected " + JSON.stringify(this.actual) + " to not equal " + JSON.stringify(value)
            });
            return this;
        };
        Expectation.prototype.toBeTrue = function (message) {
            return this.toBe(true, message);
        };
        Expectation.prototype.toBeFalse = function (message) {
            return this.toBe(false, message);
        };
        Expectation.prototype.toBeLessThan = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            else {
                assert_1.default({
                    assertion: this.actual < value,
                    message: message || "Expected " + this.actual + " to be less than " + value
                });
            }
            return this;
        };
        Expectation.prototype.toBeFewerThan = function (value, message) {
            return this.toBeLessThan(value, message);
        };
        Expectation.prototype.toBeLessThanOrEqualTo = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual <= value,
                message: message || "Expected " + this.actual + " to be less than or equal to " + value
            });
            return this;
        };
        Expectation.prototype.toBeFewerThanOrEqualTo = function (value, message) {
            return this.toBeLessThanOrEqualTo(value, message);
        };
        Expectation.prototype.toBeGreaterThan = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual > value,
                message: message || "Expected " + this.actual + " to be greater than " + value
            });
            return this;
        };
        Expectation.prototype.toBeMoreThan = function (value, message) {
            return this.toBeGreaterThan(value, message);
        };
        Expectation.prototype.toBeGreaterThanOrEqualTo = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual >= value,
                message: message || "Expected " + this.actual + " to be greater than or equal to " + value
            });
            return this;
        };
        Expectation.prototype.toBeMoreThanOrEqualTo = function (value, message) {
            return this.toBeGreaterThanOrEqualTo(value, message);
        };
        Expectation.prototype.toMatch = function (pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: pattern.test(this.actual),
                message: message || "Expected " + this.actual + " to match " + pattern
            });
            return this;
        };
        Expectation.prototype.toNotMatch = function (pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: !pattern.test(this.actual),
                message: message || "Expected " + this.actual + " to match " + pattern
            });
            return this;
        };
        Expectation.prototype.toInclude = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) >= 0,
                    message: message || "Expected " + this.actual + " to contain " + value
                });
            }
            else if (Array.isArray(this.actual)) {
                var included = false;
                for (var i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break;
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to contain " + JSON.stringify(value)
                });
            }
            else if (typeof this.actual === "object") {
                var included = true;
                var valueProperties = Object.getOwnPropertyNames(value);
                for (var i = 0; i < valueProperties.length; i++) {
                    if (!this.actual.hasOwnProperty(valueProperties[i])) {
                        included = false;
                        break;
                    }
                    if (!fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                        included = false;
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to contain " + JSON.stringify(value)
                });
            }
            return this;
        };
        Expectation.prototype.toContain = function (value, message) {
            return this.toInclude(value, message);
        };
        Expectation.prototype.toExclude = function (value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) === -1,
                    message: message || "Expected " + this.actual + " to not contain " + value
                });
            }
            else if (Array.isArray(this.actual)) {
                var included = false;
                for (var i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break;
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to not contain " + JSON.stringify(value)
                });
            }
            else if (typeof this.actual === "object") {
                var included = false;
                var valueProperties = Object.getOwnPropertyNames(value);
                for (var i = 0; i < valueProperties.length; i++) {
                    if (this.actual.hasOwnProperty(valueProperties[i])) {
                        if (fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                            included = true;
                            break;
                        }
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || "Expected " + JSON.stringify(this.actual) + " to not contain " + JSON.stringify(value)
                });
            }
            return this;
        };
        Expectation.prototype.toNotInclude = function (value, message) {
            return this.toExclude(value, message);
        };
        Expectation.prototype.toNotContain = function (value, message) {
            return this.toExclude(value, message);
        };
        Expectation.prototype.toThrow = function (error, message) {
            assert_1.default({
                assertion: typeof error === "undefined" ||
                    typeof error === "string" ||
                    error instanceof RegExp ||
                    typeof error === "function",
                message: "[error] argument should be a string, regular expression, or function"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            if (typeof error === "undefined") {
                var threw = false;
                try {
                    this.actual();
                }
                catch (e) {
                    threw = true;
                }
                assert_1.default({
                    assertion: threw,
                    message: message || "Expected function to throw"
                });
            }
            else if (typeof error === "string") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e.message === error,
                        message: message || "Expected error message to be \"" + error + "\"\""
                    });
                }
            }
            else if (error instanceof RegExp) {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: error.test(e.message),
                        message: message || "Expected error message to match " + error
                    });
                }
            }
            else if (typeof error === "function") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e instanceof error,
                        message: message || "Expected error to be " + error
                    });
                }
            }
            return this;
        };
        Expectation.prototype.toNotThrow = function (message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            var threw = false;
            try {
                this.actual();
            }
            catch (e) {
                threw = true;
            }
            assert_1.default({
                assertion: !threw,
                message: message || "Expected function to not throw"
            });
            return this;
        };
        Expectation.prototype.toBeA = function (constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: typeof this.actual === constructor,
                    expected: constructor,
                    message: message || "Expected item to be a " + constructor
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: this.actual instanceof constructor,
                    expected: constructor,
                    message: message || "Expected item to be a " + constructor
                });
            }
            return this;
        };
        Expectation.prototype.toBeAn = function (constructor, message) {
            return this.toBeA(constructor, message);
        };
        Expectation.prototype.toNotBeA = function (constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    assertion: !(typeof this.actual === constructor),
                    message: message || "Expected item to not be a " + constructor
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    assertion: !(this.actual instanceof constructor),
                    message: message || "Expected item to not be a " + constructor
                });
            }
            return this;
        };
        Expectation.prototype.toNotBeAn = function (constructor, message) {
            return this.toNotBeA(constructor, message);
        };
        Expectation.prototype.toIncludeKey = function (key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected function to have key " + key
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected array to have key " + key
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || "Expected object to have key " + key
                });
            }
            return this;
        };
        Expectation.prototype.toContainKey = function (key, message) {
            return this.toIncludeKey(key, message);
        };
        Expectation.prototype.toIncludeKeys = function (keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[keys] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (var i = 0; i < keys.length; i++) {
                this.toIncludeKey(keys[i], message);
            }
            return this;
        };
        Expectation.prototype.toContainKeys = function (keys, message) {
            return this.toIncludeKeys(keys, message);
        };
        Expectation.prototype.toExcludeKey = function (key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected function to not have key " + key
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected array to not have key " + key
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || "Expected object to not have key " + key
                });
            }
            return this;
        };
        Expectation.prototype.toNotIncludeKey = function (key, message) {
            return this.toExcludeKey(key, message);
        };
        Expectation.prototype.toNotContainKey = function (key, message) {
            return this.toExcludeKey(key, message);
        };
        Expectation.prototype.toExcludeKeys = function (keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[key] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (var i = 0; i < keys.length; i++) {
                this.toExcludeKey(keys[i], message);
            }
            return this;
        };
        Expectation.prototype.toNotIncludeKeys = function (keys, message) {
            return this.toExcludeKeys(keys, message);
        };
        Expectation.prototype.toNotContainKeys = function (keys, message) {
            return this.toExcludeKeys(keys, message);
        };
        Expectation.prototype.toHaveLength = function (value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual),
                message: "Item being tested should be a string or an array"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || "Expected string to have length " + value
                });
            }
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || "Expected array to have length " + value
                });
            }
            return this;
        };
        return Expectation;
    }());
    exports.default = Expectation;
});
define("node_modules/@ca0v/ceylon/ceylon/index", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/expectation", "node_modules/@ca0v/ceylon/ceylon/assert"], function (require, exports, expectation_1, assert_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assert = assert_2.default;
    var expect = function (actual) {
        return new expectation_1.default(actual);
    };
    exports.default = expect;
});
define("node_modules/@ca0v/ceylon/index", ["require", "exports", "node_modules/@ca0v/ceylon/ceylon/index", "node_modules/@ca0v/ceylon/ceylon/assert", "node_modules/@ca0v/ceylon/ceylon/fast-deep-equal", "node_modules/@ca0v/ceylon/ceylon/assertion-error", "node_modules/@ca0v/ceylon/ceylon/expectation"], function (require, exports, index_1, assert_3, fast_deep_equal_2, assertion_error_2, expectation_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expect = index_1.default;
    exports.assert = assert_3.default;
    exports.deepEqual = fast_deep_equal_2.equal;
    exports.AssertionError = assertion_error_2.default;
    exports.Expectation = expectation_2.default;
    exports.default = index_1.default;
});
define("node_modules/@ca0v/ceylon/tests/index.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("expect", function () {
        it("creates a new Expectation object", function () {
            var sut = index_2.expect(true);
            index_2.expect(sut).toExist();
            index_2.expect(sut).toBeAn(index_2.Expectation);
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/assert.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Assert", function () {
        it("does not throw when assertion passes", function () {
            index_3.assert({
                assertion: true,
                message: "This should not throw"
            });
        });
        it("throws when the assertion fails", function () {
            index_3.expect(function () {
                return index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }).toThrow();
        });
        it("throws error with correct message property", function () {
            index_3.expect(function () {
                return index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }).toThrow("This should throw");
        });
        it("throws error with showDiff set to false", function () {
            try {
                index_3.assert({
                    assertion: false,
                    message: "This should throw"
                });
            }
            catch (e) {
                index_3.expect(e["showDiff"]).toBeFalse();
            }
        });
        it("throws error with correct actual/expected/showDiff properties", function () {
            try {
                index_3.assert({
                    actual: 1,
                    assertion: false,
                    expected: 2,
                    message: "This should throw"
                });
            }
            catch (e) {
                index_3.expect(e["actual"]).toBe(1);
                index_3.expect(e["expected"]).toBe(2);
                index_3.expect(e["showDiff"]).toBeTrue();
            }
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/deep-equal.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function func1() { }
    function func2() { }
    var tests = [
        {
            description: "scalars",
            tests: [
                {
                    description: "equal numbers",
                    value1: 1,
                    value2: 1,
                    equal: true
                },
                {
                    description: "not equal numbers",
                    value1: 1,
                    value2: 2,
                    equal: false
                },
                {
                    description: "number and array are not equal",
                    value1: 1,
                    value2: [],
                    equal: false
                },
                {
                    description: "0 and null are not equal",
                    value1: 0,
                    value2: null,
                    equal: false
                },
                {
                    description: "equal strings",
                    value1: "a",
                    value2: "a",
                    equal: true
                },
                {
                    description: "not equal strings",
                    value1: "a",
                    value2: "b",
                    equal: false
                },
                {
                    description: "empty string and null are not equal",
                    value1: "",
                    value2: null,
                    equal: false
                },
                {
                    description: "null is equal to null",
                    value1: null,
                    value2: null,
                    equal: true
                },
                {
                    description: "equal booleans (true)",
                    value1: true,
                    value2: true,
                    equal: true
                },
                {
                    description: "equal booleans (false)",
                    value1: false,
                    value2: false,
                    equal: true
                },
                {
                    description: "not equal booleans",
                    value1: true,
                    value2: false,
                    equal: false
                },
                {
                    description: "1 and true are not equal",
                    value1: 1,
                    value2: true,
                    equal: false
                },
                {
                    description: "0 and false are not equal",
                    value1: 0,
                    value2: false,
                    equal: false
                },
                {
                    description: "NaN and NaN are equal",
                    value1: NaN,
                    value2: NaN,
                    equal: true
                },
                {
                    description: "0 and -0 are equal",
                    value1: 0,
                    value2: -0,
                    equal: true
                },
                {
                    description: "Infinity and Infinity are equal",
                    value1: Infinity,
                    value2: Infinity,
                    equal: true
                },
                {
                    description: "Infinity and -Infinity are not equal",
                    value1: Infinity,
                    value2: -Infinity,
                    equal: false
                }
            ]
        },
        {
            description: "objects",
            tests: [
                {
                    description: "empty objects are equal",
                    value1: {},
                    value2: {},
                    equal: true
                },
                {
                    description: 'equal objects (same properties "order")',
                    value1: { a: 1, b: "2" },
                    value2: { a: 1, b: "2" },
                    equal: true
                },
                {
                    description: 'equal objects (different properties "order")',
                    value1: { a: 1, b: "2" },
                    value2: { b: "2", a: 1 },
                    equal: true
                },
                {
                    description: "not equal objects (extra property)",
                    value1: { a: 1, b: "2" },
                    value2: { a: 1, b: "2", c: [] },
                    equal: false
                },
                {
                    description: "not equal objects (different properties)",
                    value1: { a: 1, b: "2", c: 3 },
                    value2: { a: 1, b: "2", d: 3 },
                    equal: false
                },
                {
                    description: "not equal objects (different properties)",
                    value1: { a: 1, b: "2", c: 3 },
                    value2: { a: 1, b: "2", d: 3 },
                    equal: false
                },
                {
                    description: "equal objects (same sub-properties)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ b: "c" }] },
                    equal: true
                },
                {
                    description: "not equal objects (different sub-property value)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ b: "d" }] },
                    equal: false
                },
                {
                    description: "not equal objects (different sub-property)",
                    value1: { a: [{ b: "c" }] },
                    value2: { a: [{ c: "c" }] },
                    equal: false
                },
                {
                    description: "empty array and empty object are not equal",
                    value1: {},
                    value2: [],
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #1",
                    value1: {},
                    value2: { foo: undefined },
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #2",
                    value1: { foo: undefined },
                    value2: {},
                    equal: false
                },
                {
                    description: "object with extra undefined properties are not equal #3",
                    value1: { foo: undefined },
                    value2: { bar: undefined },
                    equal: false
                },
                {
                    description: "nulls are equal",
                    value1: null,
                    value2: null,
                    equal: true
                },
                {
                    description: "null and undefined are not equal",
                    value1: null,
                    value2: undefined,
                    equal: false
                },
                {
                    description: "null and empty object are not equal",
                    value1: null,
                    value2: {},
                    equal: false
                },
                {
                    description: "undefined and empty object are not equal",
                    value1: undefined,
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "arrays",
            tests: [
                {
                    description: "two empty arrays are equal",
                    value1: [],
                    value2: [],
                    equal: true
                },
                {
                    description: "equal arrays",
                    value1: [1, 2, 3],
                    value2: [1, 2, 3],
                    equal: true
                },
                {
                    description: "not equal arrays (different item)",
                    value1: [1, 2, 3],
                    value2: [1, 2, 4],
                    equal: false
                },
                {
                    description: "not equal arrays (different length)",
                    value1: [1, 2, 3],
                    value2: [1, 2],
                    equal: false
                },
                {
                    description: "equal arrays of objects",
                    value1: [{ a: "a" }, { b: "b" }],
                    value2: [{ a: "a" }, { b: "b" }],
                    equal: true
                },
                {
                    description: "not equal arrays of objects",
                    value1: [{ a: "a" }, { b: "b" }],
                    value2: [{ a: "a" }, { b: "c" }],
                    equal: false
                },
                {
                    description: "pseudo array and equivalent array are not equal",
                    value1: { "0": 0, "1": 1, length: 2 },
                    value2: [0, 1],
                    equal: false
                }
            ]
        },
        {
            description: "Date objects",
            tests: [
                {
                    description: "equal date objects",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: new Date("2017-06-16T21:36:48.362Z"),
                    equal: true
                },
                {
                    description: "not equal date objects",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: new Date("2017-01-01T00:00:00.000Z"),
                    equal: false
                },
                {
                    description: "date and string are not equal",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: "2017-06-16T21:36:48.362Z",
                    equal: false
                },
                {
                    description: "date and object are not equal",
                    value1: new Date("2017-06-16T21:36:48.362Z"),
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "RegExp objects",
            tests: [
                {
                    description: "equal RegExp objects",
                    value1: /foo/,
                    value2: /foo/,
                    equal: true
                },
                {
                    description: "not equal RegExp objects (different pattern)",
                    value1: /foo/,
                    value2: /bar/,
                    equal: false
                },
                {
                    description: "not equal RegExp objects (different flags)",
                    value1: /foo/,
                    value2: /foo/i,
                    equal: false
                },
                {
                    description: "RegExp and string are not equal",
                    value1: /foo/,
                    value2: "foo",
                    equal: false
                },
                {
                    description: "RegExp and object are not equal",
                    value1: /foo/,
                    value2: {},
                    equal: false
                }
            ]
        },
        {
            description: "functions",
            tests: [
                {
                    description: "same function is equal",
                    value1: func1,
                    value2: func1,
                    equal: true
                },
                {
                    description: "different functions are not equal",
                    value1: func1,
                    value2: func2,
                    equal: false
                }
            ]
        },
        {
            description: "sample objects",
            tests: [
                {
                    description: "big object",
                    value1: {
                        prop1: "value1",
                        prop2: "value2",
                        prop3: "value3",
                        prop4: {
                            subProp1: "sub value1",
                            subProp2: {
                                subSubProp1: "sub sub value1",
                                subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5]
                            }
                        },
                        prop5: 1000,
                        prop6: new Date(2016, 2, 10)
                    },
                    value2: {
                        prop5: 1000,
                        prop3: "value3",
                        prop1: "value1",
                        prop2: "value2",
                        prop6: new Date("2016/03/10"),
                        prop4: {
                            subProp2: {
                                subSubProp1: "sub sub value1",
                                subSubProp2: [1, 2, { prop2: 1, prop: 2 }, 4, 5]
                            },
                            subProp1: "sub value1"
                        }
                    },
                    equal: true
                }
            ]
        }
    ];
    describe("equal", function () {
        tests.forEach(function (suite) {
            describe(suite.description, function () {
                suite.tests.forEach(function (test) {
                    it(test.description, function () {
                        index_4.expect(test.equal).toEqual(index_4.deepEqual(test.value1, test.value2));
                    });
                });
            });
        });
    });
});
define("node_modules/@ca0v/ceylon/tests/assertion-error.spec", ["require", "exports", "node_modules/@ca0v/ceylon/index"], function (require, exports, index_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("AssertionError", function () {
        it("returns an Error object", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error).toBeAn(Error);
        });
        it("sets the error.message property", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error.message).toBe("Error message");
        });
        it("sets does not set the actual, expected, or showDiff properties when unspecified", function () {
            var error = index_5.AssertionError({
                message: "Error message"
            });
            index_5.expect(error["actual"]).toNotExist();
            index_5.expect(error["expected"]).toNotExist();
            index_5.expect(error["showDiff"]).toNotExist();
        });
        it("sets the actual, expected, and showDiff properties when specified", function () {
            var error = index_5.AssertionError({
                actual: "I ate an apple",
                expected: "I ate an orange",
                message: "Error message",
                showDiff: true
            });
            index_5.expect(error["actual"]).toBe("I ate an apple");
            index_5.expect(error["expected"]).toBe("I ate an orange");
            index_5.expect(error["showDiff"]).toBeTrue();
        });
    });
});
define("node_modules/ol3-fun/tests/spec/packages", ["require", "exports", "node_modules/@ca0v/ceylon/tests/index.spec", "node_modules/@ca0v/ceylon/tests/assert.spec", "node_modules/@ca0v/ceylon/tests/deep-equal.spec", "node_modules/@ca0v/ceylon/tests/assertion-error.spec"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function slowloop(functions, interval, cycles) {
        if (interval === void 0) { interval = 1000; }
        if (cycles === void 0) { cycles = 1; }
        var d = $.Deferred();
        var index = 0;
        var cycle = 0;
        if (!functions || 0 >= cycles) {
            d.resolve();
            return d;
        }
        var h = setInterval(function () {
            if (index === functions.length) {
                index = 0;
                if (++cycle === cycles) {
                    d.resolve();
                    clearInterval(h);
                    return;
                }
            }
            try {
                d.notify({ index: index, cycle: cycle });
                functions[index++]();
            }
            catch (ex) {
                clearInterval(h);
                d.reject(ex);
            }
        }, interval);
        return d;
    }
    exports.slowloop = slowloop;
});
define("node_modules/ol3-fun/tests/base", ["require", "exports", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/@ca0v/ceylon/index"], function (require, exports, slowloop_1, index_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slowloop = slowloop_1.slowloop;
    exports.expect = index_6.expect;
    exports.assert = index_6.assert;
    exports.deepEqual = index_6.deepEqual;
    function describe(title, fn) {
        console.log(title || "undocumented test group");
        return window.describe(title, fn);
    }
    exports.describe = describe;
    function it(title, fn) {
        console.log(title || "undocumented test");
        return window.it(title, fn);
    }
    exports.it = it;
    function should(result, message) {
        console.log(message || "undocumented assertion");
        if (!result)
            throw message;
    }
    exports.should = should;
    function shouldEqual(a, b, message) {
        if (a != b) {
            var msg = "\"" + a + "\" <> \"" + b + "\"";
            message = (message ? message + ": " : "") + msg;
            console.warn(msg);
        }
        should(a == b, message);
    }
    exports.shouldEqual = shouldEqual;
    function shouldThrow(fn, message) {
        try {
            fn();
        }
        catch (ex) {
            should(!!ex, ex);
            return ex;
        }
        should(false, "expected an exception" + (message ? ": " + message : ""));
    }
    exports.shouldThrow = shouldThrow;
    function stringify(o) {
        return JSON.stringify(o, null, "\t");
    }
    exports.stringify = stringify;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return v.split(",").map(function (v) { return parse(v, type[0]); });
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b)
                .filter(function (k) { return a[k] === undefined; })
                .forEach(function (k) { return (a[k] = b[k]); });
        });
        return a;
    }
    exports.defaults = defaults;
    function debounce(func, wait, immediate) {
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return (result[i++] = [v1, v2]); }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/css", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function loadCss(options) {
        if (!options.url && !options.css)
            throw "must provide either a url or css option";
        if (options.url && options.css)
            throw "cannot provide both a url and a css";
        if (options.name && options.css)
            return cssin(options.name, options.css);
        var id = "style-" + options.name;
        var head = document.getElementsByTagName("head")[0];
        var link = document.getElementById(id);
        if (!link) {
            link = document.createElement("link");
            link.id = id;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = options.url;
            head.appendChild(link);
        }
        var dataset = link.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                link.remove();
            }
        };
    }
    exports.loadCss = loadCss;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration,
                callback: function () { return promise.resolve(); }
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            N: 1,
            S: -1,
            E: 1,
            W: -1
        };
        var latLonIndex = {
            "-": "",
            N: "lat",
            S: "lat",
            E: "lon",
            W: "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw "Degrees out of range";
        if (!inRange(minutes, 0, 60))
            throw "Minutes out of range";
        if (!inRange(seconds, 0, 60))
            throw "Seconds out of range";
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function toDegreesMinutesAndSeconds(coordinate) {
        var absolute = Math.abs(coordinate);
        var degrees = Math.floor(absolute);
        var minutesNotTruncated = (absolute - degrees) * 60;
        var minutes = Math.floor(minutesNotTruncated);
        var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
        return degrees + " " + minutes + " " + seconds;
    }
    function fromLonLatToDms(lon, lat) {
        var latitude = toDegreesMinutesAndSeconds(lat);
        var latitudeCardinal = lat >= 0 ? "N" : "S";
        var longitude = toDegreesMinutesAndSeconds(lon);
        var longitudeCardinal = lon >= 0 ? "E" : "W";
        return latitude + " " + latitudeCardinal + " " + longitude + " " + longitudeCardinal;
    }
    function fromDmsToLonLat(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw "Could not parse string";
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === "undefined") {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = "lat";
                decDeg2.latLon = "lon";
            }
            else {
                throw "Could not parse string";
            }
        }
        if (typeof decDeg2.latLon === "undefined") {
            decDeg2.latLon = decDeg1.latLon === "lat" ? "lon" : "lat";
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    function parse(value) {
        if (typeof value === "string")
            return fromDmsToLonLat(value);
        return fromLonLatToDms(value.lon, value.lat);
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/ol3-fun/is-primitive", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isPrimitive(a) {
        switch (typeof a) {
            case "boolean":
                return true;
            case "number":
                return true;
            case "object":
                return null === a;
            case "string":
                return true;
            case "symbol":
                return true;
            case "undefined":
                return true;
            default:
                throw "unknown type: " + typeof a;
        }
    }
    exports.isPrimitive = isPrimitive;
});
define("node_modules/ol3-fun/ol3-fun/is-cyclic", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_primitive_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isCyclic(a) {
        if (is_primitive_1.isPrimitive(a))
            return false;
        var test = function (o, history) {
            if (is_primitive_1.isPrimitive(o))
                return false;
            if (0 <= history.indexOf(o)) {
                return true;
            }
            return Object.keys(o).some(function (k) { return test(o[k], [o].concat(history)); });
        };
        return Object.keys(a).some(function (k) { return test(a[k], [a]); });
    }
    exports.isCyclic = isCyclic;
});
define("node_modules/ol3-fun/ol3-fun/deep-extend", ["require", "exports", "node_modules/ol3-fun/ol3-fun/is-cyclic", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, is_cyclic_1, is_primitive_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isArrayLike(o) {
        var keys = Object.keys(o);
        return keys.every(function (k) { return k === parseInt(k, 10).toString(); });
    }
    function extend(a, b, trace, history) {
        if (history === void 0) { history = []; }
        if (!b) {
            b = a;
            a = {};
        }
        var merger = new Merger(trace, history);
        return merger.deepExtend(a, b, []);
    }
    exports.extend = extend;
    function isUndefined(a) {
        return typeof a === "undefined";
    }
    function isArray(val) {
        return Array.isArray(val);
    }
    function isHash(val) {
        return !is_primitive_2.isPrimitive(val) && !canClone(val) && !isArray(val);
    }
    function canClone(val) {
        if (val instanceof Date)
            return true;
        if (val instanceof RegExp)
            return true;
        return false;
    }
    function clone(val) {
        if (val instanceof Date)
            return new Date(val.getTime());
        if (val instanceof RegExp)
            return new RegExp(val.source);
        throw "unclonable type encounted: " + typeof val;
    }
    var Merger = (function () {
        function Merger(traceItems, history) {
            this.traceItems = traceItems;
            this.history = history;
        }
        Merger.prototype.trace = function (item) {
            if (this.traceItems) {
                this.traceItems.push(item);
            }
        };
        Merger.prototype.deepExtend = function (target, source, path) {
            var _this = this;
            if (target === source)
                return target;
            if (!target || (!isHash(target) && !isArray(target))) {
                throw "first argument must be an object";
            }
            if (!source || (!isHash(source) && !isArray(source))) {
                throw "second argument must be an object";
            }
            if (typeof source === "function") {
                return target;
            }
            this.push(source);
            if (isArray(source)) {
                if (!isArray(target)) {
                    throw "attempting to merge an array into a non-array";
                }
                this.mergeArray("id", target, source, path);
                return target;
            }
            else if (isArray(target)) {
                if (!isArrayLike(source)) {
                    throw "attempting to merge a non-array into an array";
                }
            }
            Object.keys(source).forEach(function (k) { return _this.mergeChild(k, target, source[k], path.slice()); });
            return target;
        };
        Merger.prototype.cloneArray = function (val, path) {
            var _this = this;
            this.push(val);
            return val.map(function (v) {
                if (is_primitive_2.isPrimitive(v))
                    return v;
                if (isHash(v))
                    return _this.deepExtend({}, v, path);
                if (isArray(v))
                    return _this.cloneArray(v, path);
                if (canClone(v))
                    return clone(v);
                throw "unknown type encountered: " + typeof v;
            });
        };
        Merger.prototype.push = function (a) {
            if (is_primitive_2.isPrimitive(a))
                return;
            if (-1 < this.history.indexOf(a)) {
                if (is_cyclic_1.isCyclic(a)) {
                    throw "circular reference detected";
                }
            }
            else
                this.history.push(a);
        };
        Merger.prototype.mergeChild = function (key, target, sourceValue, path) {
            var targetValue = target[key];
            if (sourceValue === targetValue)
                return;
            if (is_primitive_2.isPrimitive(sourceValue)) {
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (canClone(sourceValue)) {
                sourceValue = clone(sourceValue);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (isArray(sourceValue)) {
                if (isArray(targetValue)) {
                    this.deepExtendWithKey(targetValue, sourceValue, path, key);
                    return;
                }
                sourceValue = this.cloneArray(sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            if (!isHash(sourceValue)) {
                throw "unexpected source type: " + typeof sourceValue;
            }
            if (!isHash(targetValue)) {
                var merger = new Merger(null, this.history);
                sourceValue = merger.deepExtend({}, sourceValue, path);
                path.push(key);
                this.trace({
                    path: path,
                    key: key,
                    target: target,
                    was: targetValue,
                    value: sourceValue
                });
                target[key] = sourceValue;
                return;
            }
            this.deepExtendWithKey(targetValue, sourceValue, path, key);
            return;
        };
        Merger.prototype.deepExtendWithKey = function (targetValue, sourceValue, path, key) {
            var index = path.push(key);
            this.deepExtend(targetValue, sourceValue, path);
            if (index === path.length)
                path.pop();
        };
        Merger.prototype.mergeArray = function (key, target, source, path) {
            var _this = this;
            if (!isArray(target))
                throw "target must be an array";
            if (!isArray(source))
                throw "input must be an array";
            if (!source.length)
                return target;
            var hash = {};
            target.forEach(function (item, i) {
                if (!item[key])
                    return;
                hash[item[key]] = i;
            });
            source.forEach(function (sourceItem, i) {
                var sourceKey = sourceItem[key];
                var targetIndex = hash[sourceKey];
                if (isUndefined(sourceKey)) {
                    if (isHash(target[i]) && !!target[i][key]) {
                        throw "cannot replace an identified array item with a non-identified array item";
                    }
                    _this.mergeChild(i, target, sourceItem, path.slice());
                    return;
                }
                if (isUndefined(targetIndex)) {
                    _this.mergeChild(target.length, target, sourceItem, path.slice());
                    return;
                }
                _this.mergeChild(targetIndex, target, sourceItem, path.slice());
                return;
            });
            return target;
        };
        return Merger;
    }());
});
define("node_modules/ol3-fun/ol3-fun/extensions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Extensions = (function () {
        function Extensions() {
            this.hash = new WeakMap(null);
        }
        Extensions.prototype.isExtended = function (o) {
            return this.hash.has(o);
        };
        Extensions.prototype.extend = function (o, ext) {
            var hashData = this.hash.get(o);
            if (!hashData) {
                hashData = {};
                this.hash.set(o, hashData);
            }
            ext && Object.keys(ext).forEach(function (k) { return (hashData[k] = ext[k]); });
            return hashData;
        };
        Extensions.prototype.bind = function (o1, o2) {
            if (this.isExtended(o1)) {
                if (this.isExtended(o2)) {
                    if (this.hash.get(o1) === this.hash.get(o2))
                        return;
                    throw "both objects already bound";
                }
                else {
                    this.hash.set(o2, this.extend(o1));
                }
            }
            else {
                this.hash.set(o1, this.extend(o2));
            }
        };
        return Extensions;
    }());
    exports.Extensions = Extensions;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/css", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop", "node_modules/ol3-fun/ol3-fun/deep-extend", "node_modules/ol3-fun/ol3-fun/extensions"], function (require, exports, common_2, css_1, navigation_1, parse_dms_1, slowloop_2, deep_extend_1, extensions_1) {
    "use strict";
    var index = {
        asArray: common_2.asArray,
        cssin: css_1.cssin,
        loadCss: css_1.loadCss,
        debounce: common_2.debounce,
        defaults: common_2.defaults,
        doif: common_2.doif,
        deepExtend: deep_extend_1.extend,
        getParameterByName: common_2.getParameterByName,
        getQueryParameters: common_2.getQueryParameters,
        html: common_2.html,
        mixin: common_2.mixin,
        pair: common_2.pair,
        parse: common_2.parse,
        range: common_2.range,
        shuffle: common_2.shuffle,
        toggle: common_2.toggle,
        uuid: common_2.uuid,
        slowloop: slowloop_2.slowloop,
        dms: {
            parse: parse_dms_1.parse,
            fromDms: function (dms) { return parse_dms_1.parse(dms); },
            fromLonLat: function (o) { return parse_dms_1.parse(o); }
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature
        },
        Extensions: extensions_1.Extensions
    };
    return index;
});
define("node_modules/ol3-fun/tests/spec/api", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/index"], function (require, exports, base_1, API) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_1.describe("Test Harness API", function () {
        base_1.it("full api exists", function () {
            base_1.shouldEqual([base_1.describe, base_1.it, base_1.should, base_1.shouldEqual, base_1.shouldThrow, base_1.assert, base_1.expect, base_1.slowloop, base_1.stringify].every(function (f) { return typeof f === "function"; }), true, "API functions exist");
        });
    });
    base_1.describe("API", function () {
        base_1.it("full api exists", function () {
            base_1.shouldEqual([
                API.asArray,
                API.cssin,
                API.debounce,
                API.defaults,
                API.dms.parse,
                API.doif,
                API.getParameterByName,
                API.getQueryParameters,
                API.html,
                API.mixin,
                API.navigation.zoomToFeature,
                API.pair,
                API.parse,
                API.range,
                API.shuffle,
                API.slowloop,
                API.toggle,
                API.uuid
            ].every(function (f) { return typeof f === "function"; }), true, "API functions exist");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/common", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_2, common_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sum(list) {
        return list.reduce(function (a, b) { return a + b; }, 0);
    }
    describe("asArray tests", function () {
        it("asArray", function (done) {
            if (!document)
                return;
            document.body.appendChild(document.createElement("div"));
            var list = document.getElementsByTagName("div");
            var result = common_3.asArray(list);
            base_2.should(result.length === list.length, "array size matches list size");
            done();
        });
    });
    describe("uuid tests", function () {
        it("uuid", function () {
            base_2.should(common_3.uuid().length === 36, "uuid has 36 characters");
        });
    });
    describe("pair tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.pair([], []).length, "empty result");
            base_2.should(0 === common_3.pair([1], []).length, "empty result");
            base_2.should(0 === common_3.pair([], [1]).length, "empty result");
        });
        it("ensures all combinations", function () {
            var A = [1, 3, 5], B = [7, 11, 13], result = common_3.pair(A, B);
            base_2.should(A.length * sum(B) + B.length * sum(A) === sum(result.map(function (v) { return v[0] + v[1]; })), "create product from two vectors");
        });
    });
    describe("range tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.range(0).length, "empty result");
        });
        it("size tests", function () {
            base_2.should(1 === common_3.range(1).length, "single item");
            base_2.should(10 === common_3.range(10).length, "ten items");
        });
        it("content tests", function () {
            base_2.should(45 === sum(common_3.range(10)), "range '10' contains 0..9");
        });
    });
    describe("shuffle tests", function () {
        it("empty test", function () {
            base_2.should(0 === common_3.shuffle([]).length, "empty result");
        });
        it("size tests", function () {
            base_2.should(1 === common_3.shuffle(common_3.range(1)).length, "single item");
            base_2.should(10 === common_3.shuffle(common_3.range(10)).length, "ten items");
        });
        it("content tests", function () {
            base_2.should(45 === sum(common_3.shuffle(common_3.range(10))), "range '10' contains 0..9");
        });
    });
    describe("toggle tests", function () {
        it("toggle", function () {
            var div = document.createElement("div");
            base_2.should(div.className === "", "div contains no className");
            common_3.toggle(div, "foo");
            base_2.should(div.className === "foo", "toggle adds");
            common_3.toggle(div, "foo");
            base_2.should(div.className === "", "second toggles removes");
            common_3.toggle(div, "foo", true);
            base_2.should(div.className === "foo", "forces foo to exist when it does not exist");
            common_3.toggle(div, "foo", true);
            base_2.should(div.className === "foo", "forces foo to exist when it already exists");
            common_3.toggle(div, "foo", false);
            base_2.should(div.className === "", "forces foo to not exist");
            common_3.toggle(div, "foo", false);
            base_2.should(div.className === "", "forces foo to not exist");
        });
    });
    describe("parse tests", function () {
        it("parse", function () {
            var num = 0;
            var bool = false;
            base_2.should(common_3.parse("", "").toString() === "", "empty string");
            base_2.should(common_3.parse("1", "").toString() === "1", "numeric string");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("0", bool) === false, "0 as boolean is false");
            base_2.should(common_3.parse("1", bool) === true, "1 as boolean is true");
            base_2.should(common_3.parse("false", bool) === false, "'false' as boolean is false");
            base_2.should(common_3.parse("true", bool) === true, "'true' as boolean is true");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("1", num) === 1, "numeric string as number returns number");
            base_2.should(common_3.parse("1,2,3", [num])[1] === 2, "parse into numeric array");
        });
    });
    describe("getQueryParameters tests", function () {
        it("getQueryParameters", function () {
            var options = { a: "" };
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.a, "1", "a=1 extracted");
            base_2.shouldEqual(options.b, undefined, "b not assigned");
            options = { b: "" };
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.b, "2", "b=2 extracted");
            base_2.shouldEqual(options.a, undefined, "a not assigned");
            options.a = options.b = options.c = "<null>";
            common_3.getQueryParameters(options, "foo?a=1&b=2");
            base_2.shouldEqual(options.a, "1", "a=1 extracted");
            base_2.shouldEqual(options.b, "2", "b=2 extracted");
            base_2.shouldEqual(options.c, "<null>", "c not assigned, original value untouched");
        });
    });
    describe("getParameterByName tests", function () {
        it("getParameterByName", function () {
            base_2.shouldEqual(common_3.getParameterByName("a", "foo?a=1"), "1", "a=1");
            base_2.shouldEqual(common_3.getParameterByName("b", "foo?a=1"), null, "b does not exist");
        });
    });
    describe("doif tests", function () {
        var die = function (n) {
            throw "doif callback not expected to execute: " + n;
        };
        var spawn = function () {
            var v = true;
            return function () { return (v = !v); };
        };
        it("doif false tests", function () {
            common_3.doif(undefined, die);
            common_3.doif(null, die);
        });
        it("doif empty tests", function () {
            var c = spawn();
            common_3.doif(0, c);
            base_2.shouldEqual(c(), true, "0 invokes doif");
            common_3.doif(false, c);
            base_2.shouldEqual(c(), true, "false invokes doif");
            common_3.doif({}, c);
            base_2.shouldEqual(c(), true, "{} invokes doif");
        });
        it("doif value tests", function () {
            common_3.doif(0, function (v) { return base_2.shouldEqual(v, 0, "0"); });
            common_3.doif({ a: 100 }, function (v) { return base_2.shouldEqual(v.a, 100, "a = 100"); });
        });
    });
    describe("mixin tests", function () {
        it("simple mixins", function () {
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).a, 1, "a=1");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).b, 2, "b=2");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, { b: 2 }).c, undefined, "c undefined");
            base_2.shouldEqual(common_3.mixin({ a: 1 }, {}).a, 1, "a=1");
            base_2.shouldEqual(common_3.mixin({}, { b: 2 }).b, 2, "b=2");
        });
        it("nested mixins", function () {
            var _a;
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, (_a = {}, _a["south carolina"] = { greenville: true }, _a))["south carolina"]
                .greenville, true, "greenville is in south carolina");
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, { vermont: { greenville: false } }).vermont.greenville, false, "greenville is not in vermont");
            base_2.shouldEqual(common_3.mixin({ vermont: { burlington: true } }, { vermont: { greenville: false } }).vermont.burlington, undefined, "second vermont completely wipes out 1st");
        });
    });
    describe("defaults tests", function () {
        it("defaults", function () {
            base_2.shouldEqual(common_3.defaults({ a: 1 }, { a: 2, b: 3 }).a, 1, "a = 1");
            base_2.shouldEqual(common_3.defaults({ a: 1 }, { a: 2, b: 3 }).b, 3, "b = 3");
            base_2.shouldEqual(common_3.defaults({}, { a: 2, b: 3 }).a, 2, "a = 2");
        });
    });
    describe("html tests", function () {
        it("tableless tr test", function () {
            var markup = "<tr>A<td>B</td></tr>";
            var tr = common_3.html(markup);
            base_2.should(tr.nodeValue === "AB", "setting innerHTML on a 'div' will not assign tr elements");
        });
        it("table tr test", function () {
            var markup = "<table><tbody><tr><td>Test</td></tr></tbody></table>";
            var table = common_3.html(markup);
            base_2.should(table.outerHTML === markup, "preserves tr when within a table");
        });
        it("canvas test", function () {
            var markup = "<canvas width=\"100\" height=\"100\"></canvas>";
            var canvas = common_3.html(markup);
            base_2.should(canvas.outerHTML === markup, "canvas markup preserved");
            base_2.should(!!canvas.getContext("2d"), "cnvas has 2d context");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/slowloop", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_3, common_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_3.describe("slowloop", function () {
        base_3.it("slowloop empty", function (done) {
            try {
                base_3.slowloop(null);
                base_3.should(false, "slowloop requires an array");
            }
            catch (_a) {
                done();
            }
        });
        base_3.it("slowloop with progress", function () {
            var progressCount = 0;
            return base_3.slowloop(common_4.range(7).map(function (n) { return function () { }; }), 0, 5)
                .progress(function (args) {
                console.log(args);
                progressCount++;
            })
                .then(function () {
                base_3.shouldEqual(progressCount, 7 * 5, "progress callbacks");
            });
        });
        base_3.it("slowloop with exceptions", function () {
            return base_3.slowloop([
                function () {
                    throw "exception occured in slowloop";
                }
            ])
                .then(function () { return base_3.should(false, "failure expected"); })
                .catch(function (ex) { return base_3.should(!!ex, ex); });
        });
        base_3.it("slowloop with abort", function () {
            return base_3.slowloop([
                function () {
                    base_3.should(false, "aborted from inside");
                }
            ], 10)
                .reject("aborted from outside")
                .catch(function (ex) { return base_3.shouldEqual(ex, "aborted from outside", "aborted from outside"); });
        });
        base_3.it("slowloop fast", function (done) {
            var count = 0;
            var inc = function () { return count++; };
            base_3.slowloop([inc, inc, inc], 0, 100).then(function () {
                base_3.shouldEqual(count, 300, "0 ms * 100 iterations * 3 functions => 300 invocations");
                done();
            });
        }).timeout(2000);
        base_3.it("slowloop iterations", function (done) {
            var count = 0;
            var inc = function () { return count++; };
            base_3.slowloop([inc]).then(function () {
                base_3.shouldEqual(count, 1, "defaults to a single iteration");
                base_3.slowloop([inc], 0, 2).then(function () {
                    base_3.shouldEqual(count, 3, "performs two iterations");
                    base_3.slowloop([inc], 0, 0).then(function () {
                        base_3.shouldEqual(count, 3, "performs 0 iterations");
                        done();
                    });
                });
            });
        });
    });
});
define("node_modules/ol3-fun/tests/spec/deep-extend", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/deep-extend", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_4, deep_extend_2, common_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("utils/deep-extend", function () {
        it("trivial merges", function () {
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend({}, {})), base_4.stringify({}), "empty objects");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([], [])), base_4.stringify([]), "empty arrays");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([], {})), base_4.stringify([]), "empty arrays with empty object");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([,], [, ,])), base_4.stringify([,]), "arrays with empty items");
            var o = { a: 1 };
            base_4.shouldEqual(o, deep_extend_2.extend(o, o), "merges same object");
            base_4.should(o !== deep_extend_2.extend(o), "clones when second argument not provided");
        });
        it("invalid merges", function () {
            base_4.shouldThrow(function () { return deep_extend_2.extend({}, []); }, "array->object considered an error");
            base_4.shouldThrow(function () { return deep_extend_2.extend({ a: 1 }, []); }, "{a:1} and []");
            base_4.shouldThrow(function () { return deep_extend_2.extend([], { a: 1 }); }, "[] and {a:1}");
            base_4.shouldThrow(function () { return deep_extend_2.extend(1, 2); }, "primitives");
            base_4.shouldThrow(function () { return deep_extend_2.extend(new Date(2000, 1, 1), new Date(2000, 1, 2)); }, "clonable primitives");
            var a = { a: 1 };
            var b = { b: a };
            a.b = b;
            base_4.shouldEqual(base_4.shouldThrow(function () { return deep_extend_2.extend(b); }, "b->a->b"), "circular reference detected");
        });
        it("merges with duplicate objects that might be detected as recursive", function () {
            var o = { a: { date: new Date(Date.now() - 1000), address: { street: "main" } } };
            var p = { o1: o, o2: o };
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend(p)), base_4.stringify(p), "two children pointing to the same object");
            var q = { p1: p, p2: [p], p3: [{ id: "P", value: p }] };
            var actual = base_4.stringify(deep_extend_2.extend(q, deep_extend_2.extend(p, o)));
            base_4.should(!!actual, "complex linked");
        });
        it("simple data merges", function () {
            var o = deep_extend_2.extend({ v1: 1 });
            base_4.shouldEqual(o.v1, 1, "adds v1");
            deep_extend_2.extend(o, { v1: 2 });
            base_4.shouldEqual(o.v1, 2, "updates v1");
        });
        it("simple array merges", function () {
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1], [])), base_4.stringify([1]), "[1] + []");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1], [2])), base_4.stringify([2]), "[1<-2]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([1, 2, 3], [2])), base_4.stringify([2, 2, 3]), "[1<-2,2,3]]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([2], [1, 2, 3])), base_4.stringify([1, 2, 3]), "[2<-1, 2, 3]");
            base_4.shouldEqual(base_4.stringify(deep_extend_2.extend([, , , 4], [1, 2, 3])), base_4.stringify([1, 2, 3, 4]), "array can have empty items");
            base_4.should(base_4.deepEqual(deep_extend_2.extend([1, 2, 3], { 1: 100 }), [1, 100, 3]), "array<-object");
            base_4.should(base_4.deepEqual(deep_extend_2.extend([{ id: 1 }], [{ id: 2 }]), [{ id: 1 }, { id: 2 }]), "[1] + [2] with ids");
        });
        it("preserves array ordering", function () {
            base_4.shouldEqual(deep_extend_2.extend([{ id: 1 }], [{ id: 1 }, { id: 2 }])[0].id, 1, "first item id");
            base_4.shouldEqual(deep_extend_2.extend([{ id: 2 }], [{ id: 1 }, { id: 2 }])[0].id, 2, "first item id");
            base_4.shouldEqual(deep_extend_2.extend([{ id: 1 }, { id: 3 }], [{ id: 2 }, { id: 1, v: 1 }])[0].v, 1, "first item id");
        });
        it("clones objects with primitives", function () {
            var source = { v1: { v2: { v3: 1 } } };
            var o = deep_extend_2.extend(source);
            base_4.shouldEqual(o.v1.v2.v3, 1, "properly extends {}");
            base_4.should(source.v1 !== o.v1, "properly clones objects");
        });
        it("clones dates", function () {
            var source = { date: new Date() };
            var o = deep_extend_2.extend(source);
            base_4.should(source.date !== o.date, "dates are clones");
            base_4.shouldEqual(source.date.getUTCDate(), o.date.getUTCDate(), "date values are preserved");
        });
        it("clones nested objects", function () {
            var source = { v1: { v2: { v3: 1 } } };
            var o = deep_extend_2.extend(source);
            base_4.should(source !== o, "clones source");
            base_4.shouldEqual(source.v1.v2.v3, o.v1.v2.v3, "properly extends v3");
            base_4.should(source.v1 !== o.v1, "properly clones v1");
            base_4.should(source.v1.v2 !== o.v1.v2, "properly clones v1.v2");
        });
        it("clones arrays", function () {
            var source = { v1: common_5.range(1).map(function (i) { return ({ id: i + 1, value: i }); }) };
            var o = deep_extend_2.extend(source);
            base_4.should(source !== o, "clones source");
            base_4.should(source.v1 !== o.v1, "clones v1");
            base_4.should(source.v1[0].value === o.v1[0].value, "extends v1[1].value");
            base_4.should(source.v1[0] !== o.v1[0], "clones v1[1]");
        });
        it("confirms references are preserved", function () {
            var x = { foo: { bar: "foo" }, array: [{ id: "a", value: "ax" }] };
            var y = { foo: { bar: "bar" }, array: [{ id: "a", value: "ay" }] };
            var xfoo = x.foo;
            var xarray = x.array[0];
            var z = deep_extend_2.extend(x, y);
            base_4.shouldEqual(x, z, "returns x");
            base_4.shouldEqual(xfoo, z.foo, "reference foo preserved");
            base_4.shouldEqual(xarray.value, "ay", "existing array references are preserved");
        });
        it("confirms array merge is 'id' aware", function () {
            var o1 = {
                values: [
                    {
                        id: "v1",
                        value: { v1: 1 }
                    },
                    {
                        id: "v2",
                        value: { v2: 1 }
                    },
                    {
                        id: "v9",
                        value: { v9: 1 }
                    }
                ]
            };
            var o2 = {
                values: [
                    {
                        id: "v1",
                        value: { v1: 2 }
                    },
                    {
                        id: "v9",
                        value: { v9: 2 }
                    }
                ]
            };
            var o = deep_extend_2.extend(o1);
            base_4.shouldEqual(o.values[0].value.v1, 1, "object is clone of o1, v1");
            base_4.shouldEqual(o.values[1].value.v2, 1, "object is clone of o1, v2");
            base_4.shouldEqual(o.values[2].value.v9, 1, "object is clone of o1, v9");
            deep_extend_2.extend(o, o2);
            base_4.shouldEqual(o.values[0].value.v1, 2, "merge replaces v1");
            base_4.shouldEqual(o.values[1].value.v2, 1, "merge preserves v2");
            base_4.shouldEqual(o.values[2].value.v9, 2, "merge replaces v9");
        });
        it("confirms array references are preserved", function () {
            var x = { foo: { bar: "foo" } };
            var y = { foo: { bar: "bar" } };
            var xfoo = x.foo;
            var z = deep_extend_2.extend(x, y);
            base_4.shouldEqual(x, z, "returns x");
            base_4.shouldEqual(xfoo, z.foo, "reference foo preserved");
        });
        it("confirms trace on simple array merging", function () {
            var trace = [];
            var result = deep_extend_2.extend([1, 2, 5], [, 3], trace);
            base_4.shouldEqual(base_4.stringify(result), base_4.stringify([1, 3, 5]), "confirm array extended");
            base_4.shouldEqual(trace.length, 1, "length: 2<-3");
            base_4.shouldEqual(base_4.stringify(trace[0].path), base_4.stringify([1]), "path: target[1]");
            base_4.shouldEqual(trace[0].key, 1, "key: target[*1*] was 2 and is now 3");
            base_4.shouldEqual(trace[0].was, 2, "was: target[1] was *2* and is now 3");
            base_4.shouldEqual(trace[0].value, 3, "value: target[1] was 2 and is now *3*");
        });
        it("confirms trace diff on simple array", function () {
            var trace = [];
            deep_extend_2.extend([1, 2, 5], [, 3], trace);
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ 1: 3 }), "simple array trace diff");
        });
        it("confirms trace diff on simple array against array-like object", function () {
            var trace = [];
            deep_extend_2.extend([1, 2, 5], { 1: 3 }, trace);
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ 1: 3 }), "simple array trace diff");
        });
        it("confirms trace is empty when merging duplicate objects", function () {
            var trace = [];
            deep_extend_2.extend({}, {}, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 0");
            deep_extend_2.extend({ a: 1 }, { a: 1 }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 1");
            deep_extend_2.extend({ a: 1, b: [1] }, { a: 1, b: [1] }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 2");
            deep_extend_2.extend({ a: 1, b: [1], c: {} }, { a: 1, b: [1], c: {} }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 3");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 1 } }, trace);
            base_4.shouldEqual(trace.length, 0, "no activity 4");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 3] }, (trace = []));
            base_4.shouldEqual(trace.length, 0, "no activity 5");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3]] }, (trace = []));
            base_4.shouldEqual(trace.length, 0, "no activity 6");
        });
        it("confirms trace count is 1 when exactly one change is merged", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "a:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "b:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2 } }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "d:1->2");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 30] }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4]] }, (trace = []));
            base_4.shouldEqual(trace.length, 1, "[3]->[3,4]");
        });
        it("confirms trace count is 2 when exactly two changes is merged", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1, 2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "a:1->2, b:adds 2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2, 1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "b:1->2,adds 1");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2, e: 3 } }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "c.d:1->2, c.e:added");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [10, 2, 30] }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "1->10, 3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4], 5] }, (trace = []));
            base_4.shouldEqual(trace.length, 2, "[3]->[3,4], 4 added");
        });
        it("confirms trace diff when exactly one change is made", function () {
            var trace = [];
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 2, b: [1], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: 2 }), "a:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [2], c: { d: 1 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ b: { 0: 2 } }), "b:1->2");
            deep_extend_2.extend({ a: 1, b: [1], c: { d: 1 } }, { a: 1, b: [1], c: { d: 2 } }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ c: { d: 2 } }), "d:1->2");
            deep_extend_2.extend({ a: [1, 2, 3] }, { a: [1, 2, 30] }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: 30 } }), "a[2]:3->30");
            deep_extend_2.extend({ a: [1, 2, [3]] }, { a: [1, 2, [3, 4]] }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: { 1: 4 } } }), "[3]->[3,4]");
        });
        it("confirms trace diff when exactly two changes are made", function () {
            var trace = [];
            deep_extend_2.extend({ a: [1, 2, ["3"]] }, { a: [1, 2, ["A", "B"]] }, (trace = []));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify({ a: { 2: { 0: "A", 1: "B" } } }), "a[2]:[3]<-[A,B]");
        });
        it("confirms trace content", function () {
            var trace = [];
            var target = deep_extend_2.extend({
                foo: 1,
                bar: 2
            }, {
                foo: 1,
                property: "should fire 'add' event with this object and string path to it",
                object: {
                    p1: "p1",
                    p2: 2,
                    a1: [1, 2, 3],
                    a2: [{ id: "v1", value: 1 }]
                }
            }, trace);
            base_4.shouldEqual(trace.length, 2, "property added, object added");
            base_4.shouldEqual(trace.length, trace.filter(function (t) { return t.value !== t.was; }).length, "no trivial trace elements");
            base_4.shouldEqual(trace.map(function (t) { return t.key; }).join(" "), "property object", "changes are depth first");
            var t = trace.shift();
            base_4.shouldEqual(t.key, "property", "property");
            base_4.shouldEqual(t.value, target.property, "target.property");
            t = trace.shift();
            base_4.shouldEqual(t.key, "object", "object");
            base_4.shouldEqual(t.value, target.object, "target.object");
        });
        it("generates empty diff from the trace", function () {
            var trace = [];
            var a = {
                personalInfo: {
                    email: "aliceames@email.org",
                    lastName: "Ames",
                    firstName: "Alice"
                },
                name: "name"
            };
            var b = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames",
                    email: "aliceames@email.org"
                }
            };
            var expected = {};
            deep_extend_2.extend(a, b, (trace = []));
            console.log("trace", base_4.stringify(trace));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify(expected));
        });
        it("generates a diff from the trace", function () {
            var trace = [];
            var a = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames"
                }
            };
            var b = {
                name: "name",
                personalInfo: {
                    firstName: "Alice",
                    lastName: "Ames",
                    email: "aliceames@email.org"
                }
            };
            var expected = {
                personalInfo: {
                    email: "aliceames@email.org"
                }
            };
            deep_extend_2.extend(a, b, (trace = []));
            console.log("trace", base_4.stringify(trace));
            base_4.shouldEqual(base_4.stringify(diff(trace)), base_4.stringify(expected));
        });
    });
    function forcePath(o, path) {
        var node = o;
        path.forEach(function (n) { return (node = node[n] = node[n] || {}); });
        return node;
    }
    function diff(trace) {
        var result = {};
        trace.forEach(function (t) {
            var path = t.path.slice();
            var key = t.key;
            console.assert(key === path.pop());
            forcePath(result, path)[key] = t.value;
        });
        return result;
    }
});
define("node_modules/ol3-fun/tests/spec/extensions", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/index", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_5, index_7, common_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_5.describe("data/extensions", function () {
        base_5.it("ensures the api", function () {
            var x = new index_7.Extensions();
            base_5.shouldEqual(typeof x.extend, "function", "extend method");
            base_5.shouldEqual(typeof x.bind, "function", "bind method");
            base_5.shouldEqual(typeof x.isExtended, "function", "isExtended method");
        });
        base_5.it("ensures no side-effects on the object", function () {
            var x = new index_7.Extensions();
            var o = {};
            var expected = JSON.stringify(o);
            x.extend(o, { custom: "data" });
            var actual = JSON.stringify(o);
            base_5.shouldEqual(expected, actual, "no side-effects");
        });
        base_5.it("ensures two objects can be bound to same extension data", function () {
            var x = new index_7.Extensions();
            var math = x.extend(Math, { sqrt2: Math.sqrt(2) });
            base_5.should(!!x.extend(Math).sqrt2, "Math.sqrt2");
            x.bind(Number, Math);
            base_5.shouldEqual(Math.round(math.sqrt2 * x.extend(Number).sqrt2), 2, "sqrt2*sqrt2 = 2");
        });
        base_5.it("ensures two extensions can bind data to the same object", function () {
            var ext1 = new index_7.Extensions();
            var ext2 = new index_7.Extensions();
            var o = {};
            ext1.extend(o, { ext: 1 });
            ext2.extend(o, { ext: 2 });
            base_5.shouldEqual(ext1.extend(o).ext, 1, "ext1");
            base_5.shouldEqual(ext2.extend(o).ext, 2, "ext2");
        });
        base_5.it("ensures two extended objects cannot be bound", function () {
            var x = new index_7.Extensions();
            var o = {};
            var p = {};
            x.extend(o);
            x.extend(p);
            base_5.shouldThrow(function () { return x.bind(o, p); }, "cannot bind extended objects");
        });
        base_5.it("ensures isExtended returns true iff it is extended", function () {
            var x1 = new index_7.Extensions();
            var x2 = new index_7.Extensions();
            var o = {};
            base_5.should(!x1.isExtended(o), "not extended in x1");
            x1.extend(o);
            base_5.should(x1.isExtended(o), "extended in x1");
            base_5.should(!x2.isExtended(o), "not extended in x2");
            x2.extend(o);
            base_5.should(x2.isExtended(o), "extended in x2");
        });
        base_5.it("extension references are preserved", function () {
            var x = new index_7.Extensions();
            var o = {};
            var p = x.extend(o);
            x.extend(o, { name: "P" });
            base_5.shouldEqual(p.name, "P", "extension references are preserved");
        });
        base_5.it("binds two objects to the same extension", function () {
            var x = new index_7.Extensions();
            var o1 = { id: 1 };
            var o2 = Object.create({ id: 2 });
            x.bind(o1, o2);
            x.extend(o1, { foo: "foo1" });
            base_5.shouldEqual(x.extend(o1).foo, "foo1");
            x.extend(o2, { foo: "foo2" });
            base_5.shouldEqual(x.extend(o1).foo, "foo2");
        });
        base_5.it("extension integrity testing (100 objects X 10 extensions)", function () {
            var x = common_6.range(10).map(function (n) { return new index_7.Extensions(); });
            var data = common_6.range(1000).map(function (n) { return Object.create({ id: n }); });
            data.map(function (d, i) { return x[i % 10].extend(d, { data: common_6.shuffle(common_6.range(1000)) }); });
            data.forEach(function (d, i) {
                var data = x[i % 10].extend(d).data;
                data = data.filter(function (v) { return v <= d.id; });
                x[i % 10].extend(d, { data: data });
            });
            var sums = data.map(function (d, i) {
                var ext = x[i % 10].extend(d);
                base_5.shouldEqual(ext.data.length, i + 1, "extension data has " + (i + 1) + " items");
                return ext.data.reduce(function (a, b) { return a + b; }, 0);
            });
            console.log(sums);
            base_5.shouldEqual(sums.reduce(function (a, b) { return a + b; }, 0), 166666500);
        });
        base_5.it("extensions performance testing (1 million accesses)", function () {
            var x = new index_7.Extensions();
            var data = common_6.range(500000).map(function (n) { return ({ id: n }); });
            var counter = { count: 0 };
            data.forEach(function (d) { return x.extend(d, { counter: counter }); });
            data.forEach(function (d) { return x.extend(d).counter.count++; });
            base_5.shouldEqual(counter.count, data.length, "accessed " + data.length + " items");
        }).timeout(1000);
    });
});
define("node_modules/ol3-fun/tests/spec/is-primitive", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/is-primitive"], function (require, exports, base_6, is_primitive_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_6.describe("is-primitive", function () {
        base_6.it("true tests", function () {
            ["A", 1, true, null, undefined, Symbol(0)].forEach(function (v) {
                return base_6.should(is_primitive_3.isPrimitive(v), (v && v.toString ? v.toString() : v) + " is primitive");
            });
        });
        base_6.it("false tests", function () {
            [new Date(), new RegExp(""), {}, []].forEach(function (v) {
                return base_6.should(!is_primitive_3.isPrimitive(v), (v && v.toString ? v.toString() : v) + " is primitive");
            });
        });
    });
});
define("node_modules/ol3-fun/tests/spec/is-cycle", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/is-cyclic"], function (require, exports, base_7, is_cyclic_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_7.describe("is-cycle", function () {
        base_7.it("false tests", function () {
            var a = {};
            var b = { a: a };
            base_7.should(!is_cyclic_2.isCyclic({
                a: a,
                b: b
            }), "nothing in this graph refers back to an ancestor of itself");
        });
        base_7.it("true tests", function () {
            var a = { b: "" };
            var b = { a: a };
            a.b = b;
            base_7.should(is_cyclic_2.isCyclic(b), "b->a->b");
            base_7.should(is_cyclic_2.isCyclic({ b: b }), "{}->b->a->b");
            base_7.shouldThrow(function () { return base_7.stringify(b); }, "cycles cannot be serialized");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/openlayers-test", ["require", "exports", "node_modules/ol3-fun/tests/base", "openlayers"], function (require, exports, base_8, ol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("ol/Map", function () {
        it("ol/Map", function () {
            base_8.should(!!ol.Map, "Map");
        });
    });
});
define("node_modules/ol3-fun/tests/spec/parse-dms", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/parse-dms"], function (require, exports, base_9, parse_dms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_9.describe("parse-dms", function () {
        base_9.it("parse", function () {
            var dms = parse_dms_2.parse("10 5'2\" 10");
            if (typeof dms === "number")
                throw "lat-lon expected";
            base_9.should(dms.lat === 10.08388888888889, "10 degrees 5 minutes 2 seconds");
            base_9.should(dms.lon === 10, "10 degrees 0 minutes 0 seconds");
        });
    });
});
define("node_modules/ol3-fun/ol3-fun/google-polyline", ["require", "exports"], function (require, exports) {
    "use strict";
    var PolylineEncoder = (function () {
        function PolylineEncoder() {
        }
        PolylineEncoder.prototype.encodeCoordinate = function (coordinate, factor) {
            coordinate = Math.round(coordinate * factor);
            coordinate <<= 1;
            if (coordinate < 0) {
                coordinate = ~coordinate;
            }
            var output = '';
            while (coordinate >= 0x20) {
                output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 0x3f);
                coordinate >>= 5;
            }
            output += String.fromCharCode(coordinate + 0x3f);
            return output;
        };
        PolylineEncoder.prototype.decode = function (str, precision) {
            if (precision === void 0) { precision = 5; }
            var index = 0, lat = 0, lng = 0, coordinates = [], latitude_change, longitude_change, factor = Math.pow(10, precision);
            while (index < str.length) {
                var byte = 0;
                var shift = 0;
                var result = 0;
                do {
                    byte = str.charCodeAt(index++) - 0x3f;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
                var latitude_change_1 = ((result & 1) ? ~(result >> 1) : (result >> 1));
                shift = result = 0;
                do {
                    byte = str.charCodeAt(index++) - 0x3f;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);
                longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
                lat += latitude_change_1;
                lng += longitude_change;
                coordinates.push([lat / factor, lng / factor]);
            }
            return coordinates;
        };
        PolylineEncoder.prototype.encode = function (coordinates, precision) {
            if (precision === void 0) { precision = 5; }
            if (!coordinates.length)
                return '';
            var factor = Math.pow(10, precision), output = this.encodeCoordinate(coordinates[0][0], factor) + this.encodeCoordinate(coordinates[0][1], factor);
            for (var i = 1; i < coordinates.length; i++) {
                var a = coordinates[i], b = coordinates[i - 1];
                output += this.encodeCoordinate(a[0] - b[0], factor);
                output += this.encodeCoordinate(a[1] - b[1], factor);
            }
            return output;
        };
        return PolylineEncoder;
    }());
    return PolylineEncoder;
});
define("node_modules/ol3-fun/ol3-fun/ol3-polyline", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var Polyline = ol.format.Polyline;
    var PolylineEncoder = (function () {
        function PolylineEncoder(precision, stride) {
            if (precision === void 0) { precision = 5; }
            if (stride === void 0) { stride = 2; }
            this.precision = precision;
            this.stride = stride;
        }
        PolylineEncoder.prototype.flatten = function (points) {
            var nums = new Array(points.length * this.stride);
            var i = 0;
            points.forEach(function (p) { return p.map(function (p) { return nums[i++] = p; }); });
            return nums;
        };
        PolylineEncoder.prototype.unflatten = function (nums) {
            var points = new Array(nums.length / this.stride);
            for (var i = 0; i < nums.length / this.stride; i++) {
                points[i] = nums.slice(i * this.stride, (i + 1) * this.stride);
            }
            return points;
        };
        PolylineEncoder.prototype.round = function (nums) {
            var factor = Math.pow(10, this.precision);
            return nums.map(function (n) { return Math.round(n * factor) / factor; });
        };
        PolylineEncoder.prototype.decode = function (str) {
            var nums = Polyline.decodeDeltas(str, this.stride, Math.pow(10, this.precision));
            return this.unflatten(this.round(nums));
        };
        PolylineEncoder.prototype.encode = function (points) {
            return Polyline.encodeDeltas(this.flatten(points), this.stride, Math.pow(10, this.precision));
        };
        return PolylineEncoder;
    }());
    return PolylineEncoder;
});
define("node_modules/ol3-fun/tests/spec/polyline", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/google-polyline", "node_modules/ol3-fun/ol3-fun/ol3-polyline", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_10, GooglePolylineEncoder, PolylineEncoder, common_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("GooglePolylineEncoder", function () {
        it("GooglePolylineEncoder", function () {
            base_10.should(!!GooglePolylineEncoder, "GooglePolylineEncoder");
        });
        var points = common_7.pair(common_7.range(10), common_7.range(10));
        var poly = new GooglePolylineEncoder();
        var encoded = poly.encode(points);
        var decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 533, "encoding is 533 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
    });
    describe("PolylineEncoder", function () {
        it("PolylineEncoder", function () {
            base_10.should(!!PolylineEncoder, "PolylineEncoder");
        });
        var points = common_7.pair(common_7.range(10), common_7.range(10));
        var poly = new PolylineEncoder();
        var encoded = poly.encode(points);
        var decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 533, "encoding is 533 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
        poly = new PolylineEncoder(6);
        encoded = poly.encode(points);
        decoded = poly.decode(encoded);
        base_10.shouldEqual(encoded.length, 632, "encoding is 632 characters");
        base_10.shouldEqual(base_10.stringify(decoded), base_10.stringify(points), "encode->decode");
    });
});
define("node_modules/ol3-fun/ol3-fun/snapshot", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function getStyle(feature) {
        var style = feature.getStyle();
        if (!style) {
            var styleFn = feature.getStyleFunction();
            if (styleFn) {
                style = styleFn(0);
            }
        }
        if (!style) {
            style = new ol.style.Style({
                text: new ol.style.Text({
                    text: "?"
                })
            });
        }
        if (!Array.isArray(style))
            style = [style];
        return style;
    }
    var Snapshot = (function () {
        function Snapshot() {
        }
        Snapshot.render = function (canvas, feature) {
            feature = feature.clone();
            var geom = feature.getGeometry();
            var extent = geom.getExtent();
            var _a = ol.extent.getCenter(extent), cx = _a[0], cy = _a[1];
            var _b = [ol.extent.getWidth(extent), ol.extent.getHeight(extent)], w = _b[0], h = _b[1];
            var isPoint = w === 0 || h === 0;
            var ff = 1 / (window.devicePixelRatio || 1);
            var scale = isPoint ? 1 : Math.min((ff * canvas.width) / w, (ff * canvas.height) / h);
            geom.translate(-cx, -cy);
            geom.scale(scale, -scale);
            geom.translate(Math.ceil((ff * canvas.width) / 2), Math.ceil((ff * canvas.height) / 2));
            console.log(scale, cx, cy, w, h, geom.getCoordinates());
            var vtx = ol.render.toContext(canvas.getContext("2d"));
            var styles = getStyle(feature);
            if (!Array.isArray(styles))
                styles = [styles];
            styles.forEach(function (style) { return vtx.drawFeature(feature, style); });
        };
        Snapshot.snapshot = function (feature, size) {
            if (size === void 0) { size = 128; }
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            this.render(canvas, feature);
            return canvas.toDataURL();
        };
        return Snapshot;
    }());
    return Snapshot;
});
define("node_modules/ol3-fun/tests/spec/snapshot", ["require", "exports", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/snapshot", "openlayers", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, base_11, Snapshot, ol, common_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pointData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFdUlEQVR4Xu1aXUybVRh+3hiWxiX+ZNSMECvjJxiqyaROyq5M2MWUZGyDLEZg0WzhJ2QELharjmbWGgqOOTRxTMDIGHpBpIwE40Un3ujA0EmUYkhcRpoJRObfJkJG9Ji3+1gWoP2+rudrSvq9l/2e857nPOc5/yUkeVCStx+GAIYDklwBYwgkuQGMSdAYAsYQSHIFjCGQ5AYwVgFjCBhDIMkViPsQEEKkANgFIB2AGcCjAP4AsADgOoBxIlqJV7/ETQAhRCWAlwA8D+DBCA38G8DXAD4jok/1FkJ3AYQQVgDdAAruozHfAqgloh/uo6ymIroKIIQ4DOBjAA9oYrMx6F8AVUTEeaSHLgIIITjvOwBel8jYTURNEvOFUuklQDMAh2yyAJqJ6A2ZeaULIIR4GUCfTJJrch0ion5Z+aUKIIRIA/CzyiwfK/d/AGQQES+bMYdsAc4D4OVO7/iEiF6VUYk0AYQQvMyNyiClMUc+EX2vERsWJlOAqHp/enoaY2NjmJubQ1paGgoKCpCbmxtNe3qI6JVoCmyElSKAsuz9CiBVC6GzZ8+ioaEBt2/fvgvfsmUL2tvbUVNToyUFYxaI6DGt4HA4WQLw3v47LWQ6OjpQW1sbFnru3DlUVVVpScWYZ4hoQitYTwfwjq9HjQjbPTMzE8vLy2GhJpMJS0tLaqlWvzuIqEUrWE8BGgC8p0ZkYGAApaWlajAIIVQxCuArIirSCtZTgDcBuNWInDp1CsePH1eDRSPA70S0TTVhBICsOYAH9YdqRLxeLw4ePKgGi0aAL4noBdWEcRCAW/W5GpHZ2VlkZWXJnAP4qNyhVm+k77IckKVsgVW58Cwfaanr7OzE0aNHVfMogGwiuqoVrNscwImFEDMAntBCpr+/H/X19Zifn78LT09Px5kzZ1BWVqYlBWOuE9HjWsHhcFIcoAjQCUBz162srGB0dBRXrlxBfn4+7HY7UlL4ulBzfERE1ZrRYYAyBXgOwFishKIov4uIxqPAbwiVJoDigosA9sVKSkP5QSI6oAGnCpEtwJMAflKtNTbAfwDyiGg6tjR3SksVQHEBX4XxlZhe8RoRtcpKLl0AJjY+Pt5jMpn4fICtW7ciIyMjIt+ZmZkQzmzmd5KI0U5EvO2WFnoIwHvddT3Ep8Dq6vWT9tDQEEpKSkINunbt2jqxFhYW4Ha7MTg4OB8MBrMBLEprvR5DAMD7gUDgWF5e3l2efO5vaWnB7t27UVRUhMnJSRARrFYr+vr6sH37drALcnJyYLFYQuUWFxdDYjQ3Nwuz2Uw3b96E0+l8GsBkwgvg9/uPDQ8PM+He1NTUhzweT0lhYSFaW1tx48YN8DcOm82GiooKNDY2btgmi8XyZzAYfMTv94fKOJ1OP4BnN5MAfE2Grq6uwyyA3W7/y+v1Pswu4JiamkJxcTF/DzmAY//+/di27c4B79KlS6Hfjxw5glu3bqGurg69vb1Sh63UZErPrBsCq+TZ4nwbdPr06W+6u7t/GxkZ2Xf58uWQ1VcF2Lt3L5qamrw7duw4UF5ezlvmoMvlsigO4MliaDM5YJXrFwBGXC7Xu9zjNputgj/4fL4Lq4BVAViMPXv2VFRWVl5wOBxwOBxXT548maUIsOnmgHsJP+VyuX5kB3g8nom2trZfAoFA8VoHqAjwNgDnZnLA2h477/P5Ku+dA6xW64TP59sZzgEnTpyYcLvdO7Ozs0MridPp5JtgKa9CLKQecwCfBfhMwLY/tGbd5p0Ov/AeU3rxA+Uxhd8SAwB4m8ui2QHUKa9Mbyn/KHkxTM6YDKGHADERindhQ4B4K55o9RkOSLQeiTcfwwHxVjzR6jMckGg9Em8+hgPirXii1Zf0DvgfGiXvUAsr6xQAAAAASUVORK5CYII=";
    var circleData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHzUlEQVR4XuWbaWxVRRTHf+OGS1BRUQuCuICRRoMWFTRugEgCVo2IQqEgUAmpiCIgJuoHiAmgKEowBlsXwCLuEv2g0kaNti7RaBTFjaBScYtRq1FRueZ/79z75r32tfe9PmrpPclL+96dOzPnP+fMnG0MBSVvP2AUcIn9HFig7n8GNgBPAS+C+aNA/WIK05F3EFAJ3AAckr3Pb4Hv7ec74C9gJyDcDgeOsH+PbG1aPwLLgXvANLV3/u0EwDsMuA6YBbSw2l8EC8ZLwEYg7nyF5zBgJHABcFxLfP4CrACWgZGE5EV5AuB1A24HptvlcwbXyq4NFoiv8ppU85f6AtcCE62UpLX4HXgAmAdGIpUT5QGA1x94EjgpfaQvgaVAtRXtnOYRs7FwnwbcBByV+c4HwGVgPovZmd8sRwC8CcAq4ID0QaYCa4B/chm7HW33ttKghW8mDVPAPBG385gAeHsCd9uNzvYtZm8GlsQdaxe00/TnA7cBmmJEK4HZYP5ta9AYAHh7AOuBsanOGoFxQH1b/XfQ8zPtCalTJKJHgHIwOmayUhsA+MyvBspSPWg3vwL4qYOYiztMT6AGGJETCK0A0BLzDwHSdy/urDq4ndjRvjAlNghZAMjG/FUdzFC+wz0YG4RsAGhncXY3nXrS+VbVKd/Z7oL3pLmPBadiiuaDke2SRi0A4Mns+gjYJ2hZB1zYgUdcofDYy1qh54cd7gCKwXzujpABgC/6bwCnBY22AqcAeVuaheImz34OBt4FjgnffwsYAibaxDIBuBFYHLSWuA8B3s5z8M7y2ul2TSNW54JZFs7OAcA7EXgvJfoya4VHV6A7rKPq85KmCi4A8rcvCtiVFzfQtu0KAGg72wQcHzKzAczF+mIB8I4FtDnY7+cBr3QFzh0e5F7Xht+1B/QFsy0E4C7r19tGadZUFwJCJ1p0KiiOMNeAtz+wPRXQkGRIG7oiKVL3dMjYr0CRALjGRlaAbYFkdFpTt72LolNecYsoljBTAHwYGAiiOYC0oSvTPBu48Xl8XwA4no1icZKMrkwKXSqc6JPnAPAacHZX5tzh7XVAMQT/2AslQAagYm1JIBl5UoU0AGQDPZcE7gGddM9kAiDdiBu3391xOhRQfiWSAAU4FWlNEgV7v90DXrApvSQBIJ5HhgAo4uMEfROBg/Ksl4YAPJwZQ0sABErkTAwBUB5BFnGS6D5gRgiA4p8LksR9kFRmTgiAxKE8YQAocTQhBGCd/yVZ9Kif4bLH4Js2AJokCBTsHRwC8IMtTUkSAMpt9nCdIdXp/JkQBFIuseMNyhWWS5wEUlxQ8cE0b/B6W3yVBAAU+QpyI44EvAqcmwTuraSfFQGgMpI9gkCoqt46W+FDoddENYjfhCmQnZIAJ1g+w9ZAFXrQztTfTODecEJ1AkBcyzAGkuAWq8RneAhAhQDoAcgQsGVWJwCftmvJNm3axMCByi1CU1MTlZWVNDY2smLFChYvXsyaNTK9s1NVVRX9+vVjxIhCZ6gGAJ+EA0v1e4apscAw9kl+clplRU5giPnt27dHkxczo0aNory8nLq64Ohpi3YdAIoD+jlR0Vowk9zkqJbdSkGJLSxoa6rpzydNmsSCBQuYNWtWM2aHDRsWScDkyZMZNGgQ3bt3Z/369ehZ79692bFjB0uWLKFXr16RBGzcuJHhwwORra2tbYdUKAyucLhPWv0BYLa46fEqW4cKNERx81wgWLhwIaNHj6akRACmUyYAeioRF4NFRUUUFxejlR86dCgNDQ0+APX19ZSVlVFRUeEDKunSs+nTVaKcK70DnBq+tAqM9j63VNZTwmxLKjqqUjNFiuJTNgkQYzU1NWkSsHXrVp8RARD+H44UqoB+nzZNtcEpyk8K1IfW16e/gT5gVNWdWSvsqfzcCQ31tmdmfBBa2gPGjRvHypUrKS0t9TdBqYALQCgNkiCt+ObNm+nWrVszCYg/C7elkr1KiEa0HIzMXp8ya4RkJWgv6B48VoGRdCe3KvS2TgEXAKnG6tWrY+0BmlF1dXUOKqDqcrm9UWG7Ep/9wejWRksA6DdvdHqKaHcOlqh0dry7+mPAPO/+kK1QcpEtBbdtpRUKnO5ONDvTuVsE5tZMDrIBoN9118WxRK4G7t9NEKjINOll/o106wNbUYHwkX8RSmeHc2HnTmBuJ64gUQWIqmHl7kakkrcSMFFRQAwViEDQ0ajbF2ekXlIG+fJOGD3aF3gcGOPyp2DnWFWDZRPdOBcmVGSn3JnTs0qJh3aiahIJqy5vBP6HJdn048GoMDIrxQDAPxnUTlUFkn9LXwPSNXmQ/yepkFt7Ux93EkvBxCpzjQlApBLiWK6zlM3Ss/baoADpSDraXs0rdQeVjT8VjG65xKIcAfClQVdjdXPMgVzRZJ25qsn9ONbA+TdSSbNKebQPSe8zRdLkJJJ5AOCDoOLKW6xKqDDfIVmP8iF0ebJQ4TXdB5JBM9l1aMIxpeOKcC4Ek3NcP08AIpVQ9ETScE7zFZXPITBkQOlOozbOVvcjpwuZsFppmbC6mXsykIFz0FqRXIm8jrq8qJ0AREAo0K57rVcCko4WSGU4cjMEhi5/pzkoQD8r0mJauKbdA3T701VZXeNbA+blvLh2XioQABEQcqIkq9osB7d3chnvy6vRdr8OzG+F6vs/cM4xojBcMyUAAAAASUVORK5CYII=";
    function show(data) {
        document.body.appendChild(common_8.html("<img src=\"" + data + "\" />"));
    }
    function circle(radius, points) {
        if (radius === void 0) { radius = 1; }
        if (points === void 0) { points = 36; }
        if (points < 3)
            throw "a circle must contain at least three points";
        if (radius <= 0)
            throw "a circle must have a positive radius";
        var a = 0;
        var dr = (2 * Math.PI) / (points - 1);
        var result = new Array(points);
        for (var i = 0; i < points - 1; i++) {
            result[i] = [radius * Math.sin(a), radius * Math.cos(a)];
            a += dr;
        }
        result[result.length - 1] = result[0];
        return result;
    }
    base_11.describe("Snapshot", function () {
        base_11.it("Snapshot", function () {
            base_11.should(!!Snapshot, "Snapshot");
            base_11.should(!!Snapshot.render, "Snapshot.render");
            base_11.should(!!Snapshot.snapshot, "Snapshot.snapshot");
        });
        base_11.it("Converts a point to image data", function () {
            var feature = new ol.Feature(new ol.geom.Point([0, 0]));
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({ color: "black" }),
                    stroke: new ol.style.Stroke({
                        color: "white",
                        width: 10
                    })
                }),
                text: new ol.style.Text({
                    text: "Point",
                    fill: new ol.style.Fill({
                        color: "white"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "black",
                        width: 2
                    }),
                    offsetY: 16
                })
            }));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
            if (1 === window.devicePixelRatio) {
                if (data !== pointData)
                    show(pointData);
                base_11.shouldEqual(data, pointData, "point data as expected");
            }
        });
        base_11.it("Converts a triangle to image data", function () {
            var points = circle(50, 4);
            var feature = new ol.Feature(new ol.geom.Polygon([points]));
            feature.setStyle(createStyle("Triangle"));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
        });
        base_11.it("Converts a diamond to image data", function () {
            var points = circle(50, 5);
            var feature = new ol.Feature(new ol.geom.Polygon([points]));
            feature.setStyle(createStyle("Diamond"));
            var data = Snapshot.snapshot(feature, 64);
            show(data);
        });
        base_11.it("Converts a polygon to image data", function () {
            var geom = new ol.geom.Polygon([circle(3 + 100 * Math.random())]);
            var feature = new ol.Feature(geom);
            base_11.shouldEqual(feature.getGeometry(), geom, "geom still assigned");
            feature.setStyle(createStyle("Circle"));
            var originalCoordinates = base_11.stringify(geom.getCoordinates());
            var data = Snapshot.snapshot(feature, 64);
            console.log(data);
            base_11.should(!!data, "snapshot returns data");
            show(data);
            var finalCoordinates = base_11.stringify(geom.getCoordinates());
            base_11.shouldEqual(originalCoordinates, finalCoordinates, "coordinates unchanged");
            base_11.shouldEqual(feature.getGeometry(), geom, "geom still assigned");
            if (1 === window.devicePixelRatio) {
                if (data !== pointData)
                    show(circleData);
                base_11.shouldEqual(data, circleData, "circle data as expected");
            }
        });
    });
    function createStyle(text) {
        if (text === void 0) { text = ""; }
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: "black"
            }),
            stroke: new ol.style.Stroke({
                color: "blue",
                width: 3
            }),
            text: new ol.style.Text({
                text: text,
                fill: new ol.style.Fill({
                    color: "white"
                }),
                stroke: new ol.style.Stroke({
                    color: "black",
                    width: 2
                }),
                offsetY: 16
            })
        });
    }
});
define("node_modules/ol3-fun/tests/spec/zoom-to-feature", ["require", "exports", "openlayers", "node_modules/ol3-fun/tests/base", "node_modules/ol3-fun/ol3-fun/navigation"], function (require, exports, ol, base_12, navigation_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("zoomToFeature", function () {
        it("zoomToFeature", function (done) {
            base_12.should(!!navigation_2.zoomToFeature, "zoomToFeature");
            var map = new ol.Map({
                view: new ol.View({
                    zoom: 0,
                    center: [0, 0]
                })
            });
            var feature = new ol.Feature();
            var geom = new ol.geom.Point([100, 100]);
            feature.setGeometry(geom);
            map.once("postrender", function () {
                var res = map.getView().getResolution();
                var zoom = map.getView().getZoom();
                navigation_2.zoomToFeature(map, feature, {
                    duration: 200,
                    minResolution: res / 4,
                }).then(function () {
                    var _a = map.getView().getCenter(), cx = _a[0], cy = _a[1];
                    base_12.should(map.getView().getZoom() === zoom + 2, "zoom in two because minRes is 1/4 of initial res");
                    base_12.should(cx === 100, "center-x");
                    base_12.should(cy === 100, "center-y");
                    done();
                });
            });
        });
    });
});
define("node_modules/ol3-fun/tests/index", ["require", "exports", "node_modules/ol3-fun/tests/spec/packages", "node_modules/ol3-fun/tests/spec/api", "node_modules/ol3-fun/tests/spec/common", "node_modules/ol3-fun/tests/spec/slowloop", "node_modules/ol3-fun/tests/spec/deep-extend", "node_modules/ol3-fun/tests/spec/extensions", "node_modules/ol3-fun/tests/spec/is-primitive", "node_modules/ol3-fun/tests/spec/is-cycle", "node_modules/ol3-fun/tests/spec/openlayers-test", "node_modules/ol3-fun/tests/spec/parse-dms", "node_modules/ol3-fun/tests/spec/polyline", "node_modules/ol3-fun/tests/spec/snapshot", "node_modules/ol3-fun/tests/spec/zoom-to-feature"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("tests/spec/packages", ["require", "exports", "node_modules/ol3-fun/tests/index"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ol3-input/providers/osm", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpenStreet = (function () {
        function OpenStreet() {
            this.dataType = "json";
            this.method = "GET";
            this.settings = {
                url: "//nominatim.openstreetmap.org/search/",
                params: {
                    q: "",
                    format: "json",
                    addressdetails: 1,
                    limit: 10,
                    countrycodes: "",
                    "accept-language": "en-US"
                }
            };
        }
        OpenStreet.prototype.getParameters = function (options) {
            return {
                url: this.settings.url,
                params: {
                    q: options.query,
                    format: "json",
                    addressdetails: 1,
                    limit: options.limit || this.settings.params.limit,
                    countrycodes: options.countrycodes || this.settings.params.countrycodes,
                    "accept-language": options.lang || this.settings.params["accept-language"]
                }
            };
        };
        OpenStreet.prototype.handleResponse = function (args) {
            return args.sort(function (v) { return v.importance || 1; }).map(function (result) {
                return ({
                    original: result,
                    lon: parseFloat(result.lon),
                    lat: parseFloat(result.lat),
                    address: {
                        name: result.address.neighbourhood || "",
                        road: result.address.road || "",
                        postcode: result.address.postcode,
                        city: result.address.city || result.address.town,
                        state: result.address.state,
                        country: result.address.country
                    }
                });
            });
        };
        return OpenStreet;
    }());
    exports.OpenStreet = OpenStreet;
});
define("ol3-input/ol3-input", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/index", "node_modules/ol3-fun/index", "node_modules/ol3-fun/ol3-fun/navigation", "ol3-input/providers/osm"], function (require, exports, ol, $, index_8, index_9, navigation_3, osm_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var olcss = {
        CLASS_CONTROL: 'ol-control',
        CLASS_UNSELECTABLE: 'ol-unselectable',
        CLASS_UNSUPPORTED: 'ol-unsupported',
        CLASS_HIDDEN: 'ol-hidden'
    };
    function changeHandlerFactor(input) {
        var options = input.options;
        var searchProvider = new osm_1.OpenStreet();
        var changeHandler = function (args) {
            if (!args.value)
                return;
            console.log("search", args.value);
            var searchArgs = searchProvider.getParameters({
                query: args.value,
                limit: 1,
                countrycodes: 'us',
                lang: 'en'
            });
            $.ajax({
                url: searchArgs.url,
                method: searchProvider.method || 'GET',
                data: searchArgs.params,
                dataType: searchProvider.dataType || 'json'
            }).then(function (json) {
                var results = searchProvider.handleResponse(json);
                results.some(function (r) {
                    var _a, _b;
                    console.log(r);
                    if (r.original.boundingbox) {
                        var _c = r.original.boundingbox.map(function (v) { return parseFloat(v); }), lat1 = _c[0], lat2 = _c[1], lon1 = _c[2], lon2 = _c[3];
                        _a = ol.proj.transform([lon1, lat1], "EPSG:4326", "EPSG:3857"), lon1 = _a[0], lat1 = _a[1];
                        _b = ol.proj.transform([lon2, lat2], "EPSG:4326", "EPSG:3857"), lon2 = _b[0], lat2 = _b[1];
                        var extent = [lon1, lat1, lon2, lat2];
                        var feature = new ol.Feature(new ol.geom.Polygon([[
                                ol.extent.getBottomLeft(extent),
                                ol.extent.getTopLeft(extent),
                                ol.extent.getTopRight(extent),
                                ol.extent.getBottomRight(extent),
                                ol.extent.getBottomLeft(extent)
                            ]]));
                        feature.set("text", r.original.display_name);
                        options.source && options.source.addFeature(feature);
                        navigation_3.zoomToFeature(options.map, feature);
                    }
                    else {
                        var _d = ol.proj.transform([r.lon, r.lat], "EPSG:4326", "EPSG:3857"), lon = _d[0], lat = _d[1];
                        var feature = new ol.Feature(new ol.geom.Point([lon, lat]));
                        feature.set("text", r.original.display_name);
                        options.source && options.source.addFeature(feature);
                        navigation_3.zoomToFeature(options.map, feature);
                    }
                    return true;
                });
            }).fail(function () {
                console.error("geocoder failed");
            });
        };
        return changeHandler;
    }
    var expando = {
        right: '»',
        left: '«'
    };
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(options) {
            var _this = this;
            if (options.hideButton) {
                options.canCollapse = false;
                options.autoCollapse = false;
                options.expanded = true;
            }
            _this = _super.call(this, {
                element: options.element,
                target: options.target
            }) || this;
            _this.options = options;
            _this.handlers = [];
            _this.cssin();
            if (options.provider && options.source) {
                _this.on("change", changeHandlerFactor(_this));
            }
            var button = _this.button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.title = options.placeholderText;
            options.element.appendChild(button);
            if (options.hideButton) {
                button.style.display = "none";
            }
            var input = _this.input = document.createElement('input');
            input.placeholder = options.placeholderText;
            options.element.appendChild(input);
            button.addEventListener("click", function () {
                options.expanded ? _this.collapse(options) : _this.expand(options);
            });
            if (options.autoCollapse) {
                input.addEventListener("blur", function () {
                    _this.collapse(options);
                });
                input.addEventListener("keydown", function (args) {
                    if (args.key === "Enter") {
                        button.focus();
                        _this.collapse(options);
                    }
                });
            }
            input.addEventListener("keypress", function (args) {
                if (args.key === "Enter") {
                    button.focus();
                }
            });
            if (options.autoChange) {
                input.addEventListener("keypress", index_8.debounce(function () {
                    if (options.regex && !options.regex.test(input.value))
                        return;
                    var args = {
                        type: "change",
                        value: input.value
                    };
                    options.autoSelect && _this.input.select();
                    _this.dispatchEvent(args);
                }, options.changeDelay));
            }
            input.addEventListener("change", function () {
                if (options.regex && !options.regex.test(input.value))
                    return;
                var args = {
                    type: "change",
                    value: input.value
                };
                options.autoSelect && input.select();
                if (options.autoClear) {
                    input.value = "";
                }
                _this.dispatchEvent(args);
            });
            if (options.autoSelect) {
                input.addEventListener("focus", function () {
                    input.select();
                });
            }
            options.expanded ? _this.expand(options) : _this.collapse(options);
            return _this;
        }
        Input.create = function (options) {
            if (options === void 0) { options = {}; }
            options = options || {};
            options = index_8.mixin({
                openedText: options.position && -1 < options.position.indexOf("left") ? expando.left : expando.right,
                closedText: options.position && -1 < options.position.indexOf("left") ? expando.right : expando.left,
            }, options);
            options = index_8.mixin(index_8.mixin({}, Input.DEFAULT_OPTIONS), options);
            var element = document.createElement('div');
            element.className = options.className + " " + options.position + " " + olcss.CLASS_UNSELECTABLE + " " + olcss.CLASS_CONTROL;
            var geocoderOptions = index_8.mixin({
                element: element,
                target: options.target,
                expanded: false
            }, options);
            var input = new Input(geocoderOptions);
            input.handlers.push(function () { return element.remove(); });
            if (options.map) {
                options.map.addControl(input);
            }
            return input;
        };
        Input.prototype.destroy = function () {
            this.handlers.forEach(function (h) { return h(); });
            this.setTarget(null);
        };
        Input.prototype.getValue = function () {
            return this.input.value;
        };
        Input.prototype.setValue = function (v) {
            this.input.value = v;
            this.input.dispatchEvent(new Event("change"));
        };
        Input.prototype.setPosition = function (position) {
            var _this = this;
            this.options.position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.remove(k); });
            position.split(' ')
                .forEach(function (k) { return _this.options.element.classList.add(k); });
            this.options.position = position;
        };
        Input.prototype.cssin = function () {
            var className = this.options.className;
            var positions = index_9.pair("top left right bottom".split(" "), index_9.range(24))
                .map(function (pos) { return "." + className + "." + (pos[0] + (-pos[1] || '')) + " { " + pos[0] + ":" + (0.5 + pos[1]) + "em; }"; });
            this.handlers.push(index_8.cssin(className, "\n            ." + className + " {\n                position: absolute;\n                background-color: rgba(255,255,255,.4);\n            }\n            ." + className + ".active {\n                background-color: white;\n            }\n            ." + className + ":hover {\n                background-color: white;\n            }\n            ." + className + " input[type=\"button\"] {\n                color: rgba(0,60,136,1);\n                background: transparent;\n                border: none;\n                width: 2em;\n                height: 2em;\n            }            \n            ." + className + " button {\n                min-height: 1.375em;\n                min-width: 1.375em;\n                width: auto;\n                display: inline;\n            }\n\n            ." + className + ".left button {\n                float:right;\n            }\n\n            ." + className + ".right button {\n                float:left;\n            }\n\n            ." + className + " input {\n                height: 2.175em;\n                width: 16em;\n                border: none;\n                padding: 0;\n                margin: 0;\n                margin-left: 2px;\n                margin-top: 2px;\n                vertical-align: top;\n                transition: width 0.25s;\n            }\n\n            ." + className + " input.ol-hidden {\n                width: 0;\n                margin: 0;\n            }\n            \n            " + positions.join('\n') + "\n        "));
        };
        Input.prototype.collapse = function (options) {
            if (!options.canCollapse)
                return;
            options.expanded = false;
            this.input.classList.add(olcss.CLASS_HIDDEN);
            this.button.classList.remove(olcss.CLASS_HIDDEN);
            this.button.innerHTML = options.closedText;
        };
        Input.prototype.expand = function (options) {
            options.expanded = true;
            this.input.classList.remove(olcss.CLASS_HIDDEN);
            this.button.classList.add(olcss.CLASS_HIDDEN);
            this.button.innerHTML = options.openedText;
            this.input.focus();
            options.autoSelect && this.input.select();
        };
        Input.prototype.on = function (type, cb) {
            return _super.prototype.on.call(this, type, cb);
        };
        Input.DEFAULT_OPTIONS = {
            className: 'ol-input',
            position: 'bottom left',
            expanded: false,
            autoChange: false,
            autoClear: false,
            autoCollapse: true,
            autoSelect: true,
            canCollapse: true,
            changeDelay: 2000,
            hideButton: false,
            closedText: expando.right,
            openedText: expando.left,
            provider: osm_1.OpenStreet,
            placeholderText: 'Search',
            regex: /\S{2,}/,
        };
        return Input;
    }(ol.control.Control));
    exports.Input = Input;
});
define("index", ["require", "exports", "ol3-input/ol3-input", "ol3-input/providers/osm"], function (require, exports, ol3_input_1, osm_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Input = ol3_input_1.Input;
    exports.OsmSearchProvider = osm_2.OpenStreet;
});
define("tests/spec/input", ["require", "exports", "node_modules/ol3-fun/tests/base", "index"], function (require, exports, base_13, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_13.describe("Input Tests", function () {
        base_13.it("Input", function () {
            base_13.should(!!index_10.Input, "Input");
        });
        base_13.it("OsmSearchProvider", function () {
            base_13.should(!!index_10.OsmSearchProvider, "OsmSearchProvider");
        });
        base_13.it("DEFAULT_OPTIONS", function () {
            var options = index_10.Input.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        base_13.it("options of an Input instance", function () {
            var input = index_10.Input.create();
            checkDefaultInputOptions(input.options);
        });
        base_13.it("input dom", function (done) {
            var input = index_10.Input.create({});
            var target = document.createElement("div");
            input.on("change", function (args) {
                base_13.should(args.value === "hello", "change to hello");
                done();
            });
            base_13.shouldEqual(target.innerHTML, "", "innerHTML");
            input.setValue("hello");
        });
    });
    function checkDefaultInputOptions(options) {
        base_13.should(!!options, "options");
        base_13.shouldEqual(options.autoChange, false, "autoChange");
        base_13.shouldEqual(options.autoClear, false, "autoClear");
        base_13.shouldEqual(options.autoCollapse, true, "autoCollapse");
        base_13.shouldEqual(options.autoSelect, true, "autoSelect");
        base_13.shouldEqual(options.canCollapse, true, "canCollapse");
        base_13.shouldEqual(options.changeDelay, 2000, "changeDelay");
        base_13.shouldEqual(options.className, "ol-input", "className");
        base_13.should(options.closedText.length > 0, "closedText");
        base_13.shouldEqual(options.expanded, false, "expanded");
        base_13.shouldEqual(options.hideButton, false, "hideButton");
        base_13.shouldEqual(options.map, undefined, "map");
        base_13.shouldEqual(!!options.openedText, true, "openedText");
        base_13.shouldEqual(!!options.placeholderText, true, "placeholderText");
        base_13.shouldEqual(options.position, "bottom left", "position");
        base_13.shouldEqual(!!options.provider, true, "provider");
        base_13.should(!!options.regex, "regex");
        base_13.shouldEqual(options.render, undefined, "render");
        base_13.shouldEqual(options.source, undefined, "source");
        base_13.shouldEqual(options.target, undefined, "target");
    }
});
define("tests/index", ["require", "exports", "tests/spec/packages", "tests/spec/input"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tests.max.js.map