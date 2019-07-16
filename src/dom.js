/**
 * 浏览器客户端/DOM相关
 */

'use strict';

var BGUtils = require('./utils.js');

// 获取窗口尺寸
BGUtils.getWinSize = function(callback, times) {
  var winHeight = 0,
    winWidth = 0;
  times = isNaN(parseInt(times)) ? 10 : parseInt(times);

  if (window.innerWidth) {
    winWidth = window.innerWidth;
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
  }
  if (window.innerHeight) {
    winHeight = window.innerHeight;
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight;
  }
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }
  if ((times-- > 0) && (winHeight <= 0 || winWidth <= 0)) {
		// webview有可能获取到的为0，延时再取一次
    setTimeout(function() {
      BGUtils.getWinSize(callback, times);
    }, 200);
  } else {
    callback({
      height: winHeight,
      width: winWidth
    });
  }
};

module.exports = BGUtils;