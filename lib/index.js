(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  /**
   * The construct function of bar-chart
   * @param  {object} option config param
   */
  const config = require('./config.js');
  function BarChart (ctx, option) {
    config(option);
  }

  if (window !== void 0) window.BarChart = BarChart;
  module.exports = BarChart;

}));
