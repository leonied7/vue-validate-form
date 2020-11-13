(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueFormValidate = {}));
}(this, (function (exports) { 'use strict';

  // eslint-disable-next-line
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var email = (function (value) {
    return emailRegex.test(String(value));
  });

  var required = (function (value) {
    if (value === undefined || value === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return !!value.length;
    }

    return !!String(value).trim().length;
  });

  var minLength = (function (value, length) {
    if (value === undefined || value === null) {
      return false;
    }

    return String(value).length >= length;
  });

  var maxLength = (function (value, length) {
    if (value === undefined || value === null) {
      return length >= 0;
    }

    return String(value).length <= length;
  });

  var min = (function (value, min) {
    if (value === undefined || value === null || value === '') {
      return false;
    }

    return Number(value) >= min;
  });

  var max = (function (value, max) {
    if (value === undefined || value === null || value === '') {
      return false;
    }

    return Number(value) <= max;
  });

  var pattern = (function (value, pattern) {
    return pattern.test(String(value));
  });

  var index = {
    email: email,
    required: required,
    minLength: minLength,
    maxLength: maxLength,
    min: min,
    max: max,
    pattern: pattern
  };

  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
