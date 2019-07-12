/**!
 * cookie操作
 */

'use strict';

var BGUtils = require('./utils.js');

BGUtils.cookie = {

  set: function(key, value, opt) {
    if (!opt || typeof opt !== 'object') {
      opt = {};
    }
    var cookie = key + '=' + encodeURIComponent(value);

    if (opt && opt.seconds) {
      var exp = new Date();
      exp.setTime(exp.getTime() + opt.seconds * 1000);
      cookie += ';expires=' + exp.toGMTString();
    }
    if (opt && opt.path) {
      cookie += ';path=' + opt.path;
    }
    if (opt && opt.domain) {
      cookie += ';domain=' + opt.domain;
    }

    document.cookie = cookie;
  },

  get: function(key) {
    var arr,
      reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');

    if (document.cookie.match(reg)) {
      arr = document.cookie.match(reg);
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  },

  del: function(key) {
    var exp = new Date(),
      cval = BGUtils.cookie.get(key);

    exp.setTime(exp.getTime() - 1);
    if (cval != null) {
      document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString();
    }
  }
};

module.exports = BGUtils;
