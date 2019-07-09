/**
 * 数据格式化
 */

'use strict';

var BGUtils = require('./utils.js');

/**
 * 大小单位转换，最多保留两位小数
 * @param  {String} size - size大小
 * @return {String} 格式化后的size大小
 */
BGUtils.sizeFormat = function(size) {
  try {
    var unit = [ '', 'KB', 'MB', 'GB', 'TB' ];
    var tmp = parseInt(size);
    if (tmp === 0 || isNaN(tmp)) {
      return '0K';
    }
    if (tmp < 1024) {
      return '小于1K';
    }
    for (var i = 0; i < unit.length - 1; i++) {
      if (tmp < 1024) {
        tmp = Math.floor((tmp + 0.005) * 100) / 100;
        return tmp + unit[i];
      }
      tmp = tmp / 1024;
    }
    tmp = Math.floor((tmp + 0.005) * 100) / 100;
    return tmp + unit[unit.length - 1];
  } catch (e) {
    return '小于1M';
  }
};

/**
 * 普通数字转换，最多保留一位小数
 * @param  {String} number - 输入数值
 * @return {String} 格式化后的数值
 */
BGUtils.numberFormat = function(number) {
  try {
    var tmp = parseInt(number);
    if (tmp === 0 || isNaN(tmp)) {
      return '0';
    }
    if (tmp < 10000) {
      return number + '';
    }
    tmp = Math.floor((tmp / 10000 + 0.05) * 10) / 10;
    if (tmp < 10000) {
      return tmp + '万';
    }
    tmp = Math.floor((tmp / 10000 + 0.05) * 10) / 10;
    return tmp + '亿';
  } catch (e) {
    return number + '';
  }
};

/**
 * 下载次数转换，最多保留一位小数
 * @param  {String} downloads - 下载次数
 * @return {String} 格式化后的下载次数
 */
BGUtils.downloadsFormat = BGUtils.numberFormat;

/**
 * 货币格式化
 * @param  {number}	money	   如 1234
 * @param  {boolen}	needPoint true or false
 * @return {string}	以三位一逗号的格式化字符串 1,234 或 1,234.00
 */
BGUtils.moneyFormat = function(money, needPoint) {
  var sign,
    cents,
    num = parseFloat(money);

  if (isNaN(num) || num === 0) {
    num = 0;
  }

  sign = (num === (num = Math.abs(num)));

  num = Math.floor(num * 100 + 0.50000000001);

  cents = num % 100;

  num = Math.floor(num / 100).toString();

  if (cents < 10) {
    cents = '0' + cents;
  }

  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }

  return needPoint ? (((sign) ? '' : '-') + num + '.' + cents) : (((sign) ? '' : '-') + num);
};

/**
 * 时间戳格式化函数
 * @param  {string} format	格式 如'Y-m-d H:i:s'
 *   Year -
 *     L: 闰年（0/1）
 *     Y: 年份（数字4位），比如：2016
 *     y: 年份（数字2位），比如：16
 *
 *   Month -
 *     F: 月份（英文全写），比如：January
 *     M: 月份（英文缩写3个字母），比如：Sep
 *     m: 月份（01 ~ 12）
 *     n: 月份（1 ~ 12）
 *     t: 该月拥有天数（28 ~ 31）
 *
 *   Week -
 *     W: 第几个星期（0~52）
 *
 *   Day -
 *     d: 日期-天（01 ~ 31）
 *     j: 日期-天（1 ~ 31）
 *     S: 日期-天的英文后缀，比如：th, nd, st, rd, st
 *     l: 星期几（英文全写），比如：Tuesday
 *     D: 星期几（英文缩写3个字母），比如：Thu
 *     w: 一周的第几天（0 ~ 6）
 *     N: 一周的第几天（1 ~ 7）
 *     z: 一年的第几天（0 ~ 365）
 *
 *   Time -
 *     a: am / pm
 *     A: AM / PM
 *     H: 小时（00 ~ 23）
 *     h: 小时（01 ~ 12）
 *     G: 小时（0 ~ 23）
 *     g: 小时（1 ~ 12）
 *     i: 分钟（00 ~ 59）
 *     s: 秒（00 ~ 59）
 *     B: 未知
 *
 *   Timezone(时区) -
 *     O: +数字，比如：正八区为 +0800
 *     P: +数字:数字，比如：正八区为 +08:00
 *
 *   other -
 *     c: Full Date/Time，比如：2006-12-31T12:13:00+08:00
 *     U: 时间戳（秒）
 *
 * @param  {int}	timestamp 要格式化的时间戳 默认为当前时间
 * @return {string}		   格式化后的时间字符串
 */
BGUtils.stampFormat2Date = function(format, timestamp) {
  timestamp = timestamp <= 9999999999 ? timestamp * 1000 : timestamp; // 兼容传进来timestamp的单位是s的情况

  var jsdate = ((timestamp) ? new Date(timestamp) : new Date());
  var pad = function(n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n;
    } else {
      return n;
    }
  };
  var txt_weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  var txt_ordin = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    21: 'st',
    22: 'nd',
    23: 'rd',
    31: 'st'
  };
  var txt_months = [ '', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  var f = {
		// Day
    d: function() {
      return pad(f.j(), 2);
    },
    D: function() {
      return f.l().substr(0, 3);
    },
    j: function() {
      return jsdate.getDate();
    },
    l: function() {
      return txt_weekdays[f.w()];
    },
    N: function() {
      return f.w() + 1;
    },
    S: function() {
      return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
    },
    w: function() {
      return jsdate.getDay();
    },
    z: function() {
      return (jsdate - new Date(jsdate.getFullYear() + '/1/1')) / 864e5 >> 0; // eslint-disable-line no-bitwise
    },

		// Week
    W: function() {
      var a = f.z(),
        b = 364 + f.L() - a;
      var nd2,
        nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() | 7) - 1;
      if (b <= 2 && ((jsdate.getDay() | 7) - 1) <= 2 - b) {
        return 1;
      } else {
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
          return BGUtils.stampFormat2Date('W', Math.round(nd2.getTime() / 1000));
        } else {
          return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); // eslint-disable-line no-bitwise
        }
      }
    },

		// Month
    F: function() {
      return txt_months[f.n()];
    },
    m: function() {
      return pad(f.n(), 2);
    },
    M: function() {
      return f.F().substr(0, 3);
    },
    n: function() {
      return jsdate.getMonth() + 1;
    },
    t: function() {
      var n;
      if ((n = jsdate.getMonth() + 1) === 2) {
        return 28 + f.L();
      } else {
        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
          return 31;
        } else {
          return 30;
        }
      }
    },

		// Year
    L: function() {
      var y = f.Y();
      return ((y % 4 === 0) && (y % 100 !== 0 || y % 400 === 0)) ? 1 : 0; // 四年一闰，百年不闰，四百年再闰
    },
		// o not supported yet
    Y: function() {
      return jsdate.getFullYear();
    },
    y: function() {
      return (jsdate.getFullYear() + '').slice(2);
    },

		// Time
    a: function() {
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A: function() {
      return f.a().toUpperCase();
    },
    B: function() {
			// peter paul koch:
      var off = (jsdate.getTimezoneOffset() + 60) * 60;
      var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
      var beat = Math.floor(theSeconds / 86.4);
      if (beat > 1000) beat -= 1000;
      if (beat < 0) beat += 1000;
      if ((String(beat)).length === 1) beat = '00' + beat;
      if ((String(beat)).length === 2) beat = '0' + beat;
      return beat;
    },
    g: function() {
      return jsdate.getHours() % 12 || 12;
    },
    G: function() {
      return jsdate.getHours();
    },
    h: function() {
      return pad(f.g(), 2);
    },
    H: function() {
      return pad(jsdate.getHours(), 2);
    },
    i: function() {
      return pad(jsdate.getMinutes(), 2);
    },
    s: function() {
      return pad(jsdate.getSeconds(), 2);
    },
		// u not supported yet

		// Timezone
		// e not supported yet
		// I not supported yet
    O: function() {
      var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
      if (jsdate.getTimezoneOffset() > 0) t = '-' + t;
      else t = '+' + t;
      return t;
    },
    P: function() {
      var O = f.O();
      return (O.substr(0, 3) + ':' + O.substr(3, 2));
    },
		// T not supported yet
		// Z not supported yet

		// Full Date/Time
    c: function() {
      return f.Y() + '-' + f.m() + '-' + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P();
    },
		// r not supported yet
    U: function() {
      return Math.round(jsdate.getTime() / 1000);
    }
  };

  return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
    var ret;

    if (t !== s) {
			// escaped
      ret = s;
    } else if (f[s]) {
			// a date function exists
      ret = f[s]();
    } else {
			// nothing special
      ret = s;
    }
    return ret;
  });
};

/**
 * 格式化app icon图片大小
 * @param {String} iconUrl - icon url
 * @param {String} size - size大小，支持50, 65, 100, 130, 195, 260，不传默认130，size服务器不支持默认130，-1 则为原图
 * @return {String} 格式化后的 icon url
 */
BGUtils.iconFormat = function(iconUrl, size) {
  var isContain = function(ele, arr) {
    for (var i = 0; i < arr.length; ++i) {
      if (ele === arr[i]) {
        return true;
      }
    }
    return false;
  };

  var postfix = '.png',
    index = -1,
    str = '',
    defaultSize = 130,
    sizeArr = [ 50, 65, 100, 130, 195, 260 ]; // 图片服务器定义的 size

  size = parseInt(size || defaultSize);
  if (!iconUrl) {
    return iconUrl;
  }
  if (size === -1) {
    return iconUrl;
  }

  if ((index = iconUrl.indexOf(postfix)) > -1) {
    str = iconUrl.substring(0, index);
  } else {
    return iconUrl;
  }

  if (!isContain(size, sizeArr)) {
    size = defaultSize;
  }
  iconUrl = str + '_' + size + 'x' + size + postfix;

  return iconUrl;
};

module.exports = BGUtils;
