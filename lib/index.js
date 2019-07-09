(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.BarChart = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var barInfns = ['x', 'y', 'w', 'h'];
  /**
   * Create bar
   * @return {Object} item instance of bar-chart
   */

  function createBar() {
    var bar = Object.create(null);
    var args = arguments;
    barInfns.forEach(function (el, idx) {
      bar[el] = args[idx];
    });
    return bar;
  }

  function drawBar(ctx, bar) {
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
  }

  var optionCtrl = {
    fontSize: 13,
    fontFamily: 'Arial',
    fontStyle: '#333',
    barStyle: 'rgba(54, 162, 235, 0.6)',
    axisStyle: '#aaa',
    lineStyle: '#ccc',
    duration: 2000,
    data: [],
    labels: []
  };

  /**
   * The design of chart-area
   * @description T1, R1, B1 and L1 are padding-top, padding-right,
   * padding-bottom and padding-left respecively in configuration. 
   * L2 is text-area of left, B2 is text-area of bottom
   * 
   *
   * ------------------------------------------------------
   * |                        T1                           |
   * |-----------------------------------------------------|
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |             Chart Area               |    |
   * | L1 | L2 |                                      | R1 |
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |                                      |    |
   * |    |    |-------------------------------------------|
   * |    |    |                 B2                        |
   * |-----------------------------------------------------|
   * |                           B1                        |
   * |-----------------------------------------------------|
   *
   */

  function drawAxis(ctx, yAxis_left, ctx_w, ctx_h) {
    ctx.beginPath();
    ctx.strokeStyle = optionCtrl.axisStyle;
    ctx.moveTo(yAxis_left, 0);
    ctx.lineTo(yAxis_left, ctx_h - 20);
    ctx.closePath();
    ctx.stroke();
  }

  function drawXAxisLabel(ctx, yAxis_left, ctx_w, ctx_h) {
    var labels = optionCtrl.labels;
    var x_step = (ctx_w - yAxis_left) / (labels.length + 1);
    var area_y = ctx_h - 26;
    ctx.beginPath();

    for (var i = 1; i <= labels.length; i++) {
      ctx.moveTo(yAxis_left + i * x_step, area_y);
      ctx.lineTo(yAxis_left + i * x_step, area_y + 6);
      ctx.fillStyle = optionCtrl.fontStyle;
      ctx.textAlign = 'center';
      ctx.fillText(labels[i - 1], yAxis_left + i * x_step, area_y + 20);
    }

    ctx.closePath();
    ctx.stroke();
  }

  function drawYAxisLabel(ctx, tick, yAxis_left, ctx_w, ctx_h) {
    var phyStep = (ctx_h - 40) / tick[3];
    var area_y = ctx_h - 26;
    ctx.beginPath();
    ctx.strokeStyle = optionCtrl.lineStyle;

    for (var i = 0; i <= tick[3]; i++) {
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      ctx.font = "".concat(optionCtrl.fontSize, "px ").concat(optionCtrl.fontFamily);
      ctx.fillStyle = optionCtrl.fontStyle;
      ctx.fillText(tick[2] * i, yAxis_left - 10, area_y - i * phyStep);
      ctx.moveTo(yAxis_left - 6, area_y - i * phyStep);
      ctx.lineTo(yAxis_left, area_y - i * phyStep);
      ctx.moveTo(yAxis_left, area_y - i * phyStep);
      ctx.lineTo(ctx_w, area_y - i * phyStep);
    }

    ctx.closePath();
    ctx.stroke();
  }
  /**
   * Draw frame, tick[0] is min-tick, tick[1] is max-ick
   * tick[2] is step-space, tick[3] is step-number
   */


  function drawFrame(chart) {
    var ctx = chart.context;
    var tick = chart.tick;
    var ctx_w = chart.canvasW;
    var ctx_h = chart.canvasH;
    var yAxis_left = chart.yAxis_left;
    drawAxis(ctx, yAxis_left, ctx_w, ctx_h);
    drawXAxisLabel(ctx, yAxis_left, ctx_w, ctx_h);
    drawYAxisLabel(ctx, tick, yAxis_left, ctx_w, ctx_h);
  }

  var helpers = {
    /**
     * Format tick
     * @param  {[type]} minTick    min tick
     * @param  {[type]} maxTick    max tick
     * @param  {[type]} stepNumber step number
     * @return {[type]}            format tick
     */
    formatTick: function formatTick() {
      var ticks = [];

      var caculateTick = function caculateTick(minTick, maxTick, stepNumber) {
        var step = (maxTick - minTick) / stepNumber;
        var log10Step = Math.log10(step);
        var tempStep;
        var formatStep;
        var extStepNum;
        var forStepNum;
        Math.pow(10, parseInt(log10Step)) === step ? tempStep = Math.pow(10, parseInt(log10Step)) : tempStep = Math.pow(10, parseInt(log10Step + 1));
        formatStep = (step / tempStep).toFixed(6); // modify step

        if (formatStep >= 0 && formatStep <= 0.1) formatStep = 0.1;else if (formatStep >= 0.100001 && formatStep <= 0.2) formatStep = 0.2;else if (formatStep >= 0.200001 && formatStep <= 0.25) formatStep = 0.25;else if (formatStep >= 0.250001 && formatStep <= 0.5) formatStep = 0.5;else formatStep = 1;
        formatStep *= tempStep; // modify min-tick

        if (parseInt(minTick / formatStep) !== minTick / formatStep) minTick = parseInt(minTick / formatStep) * formatStep; // modify max-tick

        if (parseInt(maxTick / formatStep) !== maxTick / formatStep) maxTick = (parseInt(maxTick / formatStep) + 1) * formatStep; // modify step-number

        forStepNum = (maxTick - minTick) / formatStep;

        if (stepNumber > forStepNum) {
          extStepNum = stepNumber - forStepNum;
          if (!extStepNum % 2) maxTick = maxTick + formatStep * parseInt(extStepNum / 2);else maxTick = maxTick + formatStep * parseInt(extStepNum / 2 + 1);
          minTick = minTick - formatStep * parseInt(extStepNum / 2);
        }

        ticks.push([minTick, maxTick, formatStep, stepNumber]);
      };

      return function caculateTicks(minTick, maxTick, stepNumber) {
        if (arguments.length) caculateTick(minTick, maxTick, stepNumber);else return ticks;
      };
    },
    getSuitableStep: function getSuitableStep(minTick, maxTick) {
      var caculateTicks = this.formatTick();

      for (var i = 10; i >= 5; i--) {
        caculateTicks(minTick, maxTick, i);
      }

      var ticks = caculateTicks(); // get suitable tick

      var tempMin = Number.MAX_VALUE;
      var idxTag;
      ticks.forEach(function (tick, idx) {
        if (tick[1] <= tempMin) {
          tempMin = tick[1];
          idxTag = idx;
        }
      });
      return ticks[idxTag];
    },

    /**
     * Get ticks
     * @param  {Number} minTick - min tick
     * @param  {Number} maxTick - max tick
     * @param  {Number} stepNumber - step number
     * @return {Array}            ticks of bar-chart
     */
    getTick: function getTick(minTick, maxTick) {
      return this.getSuitableStep(minTick, maxTick);
    },

    /**
     * Animation request
     * @return {Function} animatin function
     */
    requestAnimationFrame: function requestAnimationFrame() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 1000 / 60); // simulate FPS of browser
      };
    }
  };

  var animIdx = 0;
  /**
   * Throw exception
   * @param  {Object} err - exception object
   */

  function throwException(err) {
    throw err;
  }
  /**
   * Init bar-chart
   * @param  {[type]} ctx     context of bar-chart
   * @param  {[type]} options - config options
   */


  BarChart.prototype._init = function (content, option) {
    this.initContext(content);
    this.initOption(option);
    this.initAnimation();
    this.initData();
    this.caculateScele();
    this.initBars();
    this.render();
  };

  BarChart.prototype.initData = function () {
    this.min_data = Math.min.apply(Math, _toConsumableArray(optionCtrl.data));
    this.max_data = Math.max.apply(Math, _toConsumableArray(optionCtrl.data));
  };
  /**
   * Init animation
   */


  BarChart.prototype.initAnimation = function () {
    this.requestAnimation = helpers.requestAnimationFrame();
  };
  /**
   * Init context
   * @param  {Object} ctx - context of bar-chart
   */


  BarChart.prototype.initContext = function (content) {
    if (content.nodeType === Node.ELEMENT_NODE && content.nodeName === 'CANVAS') {
      this.canvasW = content.width;
      this.canvasH = content.height;
      this.context = content.getContext('2d');
    } else throwException(new Error('Context should be a canvas DOM'));
  };
  /**
   * Init option
   * @param  {Object} opt - config option
   * ar-chart
   */


  BarChart.prototype.initOption = function (option) {
    if (option !== null && !Array.isArray(option) && _typeof(option) === 'object') {
      Object.keys(optionCtrl).forEach(function (key, idx) {
        if (option[key]) optionCtrl[key] = option[key];
      });
    } else throwException(new Error('Option should be a object-type'));
  };
  /**
   * Init data of bar-chart
   */


  BarChart.prototype.initBars = function () {
    var _this = this;

    this.bars = [];
    var bar_w = this.areaW / (optionCtrl.data.length + 1) / 2;
    var next_x_axis = bar_w * 1.5;
    var phyScale = (this.canvasH - 40) / this.tick[1];
    optionCtrl.data.forEach(function (val, index) {
      var bar = createBar(next_x_axis + _this.yAxis_left, _this.canvasH - 26, bar_w, -1 * val * phyScale);

      _this.bars.push(bar);

      next_x_axis += 2 * bar_w;
    });
  };
  /**
   * [caculateScele description]
   * @return {[type]} [description]
   */


  BarChart.prototype.caculateScele = function () {
    this.tick = helpers.getTick(this.min_data >= 0 ? 0 : this.min_data, this.max_data);
    this.context.font = "".concat(optionCtrl.fontSize, " ").concat(optionCtrl.fontFamily);
    this.yAxis_left = parseInt(2 * this.context.measureText(this.tick[1]).width);
    this.areaW = this.canvasW - this.yAxis_left;
  };
  /**
   * Render bar-chart
   */


  BarChart.prototype.render = function () {
    var ctx = this.context;
    ctx.translate(0.5, 0.5);
    drawFrame(this);
    this.animation();
  };
  /**
   * Draw bar
   */


  BarChart.prototype.drawBars = function () {
    var _this2 = this;

    this.context.fillStyle = optionCtrl.barStyle;
    this.bars.forEach(function (bar) {
      drawBar(_this2.context, bar);
    });
  };
  /**
   * [animation description]
   * @return {[type]} [description]
   */


  BarChart.prototype.animation = function () {
    var ctx = this.context;
    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    ctx.save();
    drawFrame(this);
    animIdx -= 10;
    ctx.rect(0, this.canvasH, this.canvasW, animIdx);
    ctx.clip();
    this.drawBars();

    if (animIdx > -1 * this.canvasH) {
      var anim = this.animation.bind(this);
      helpers.requestAnimationFrame()(anim);
    }

    ctx.restore();
  };
  /**
   * Bar-chart constructor
   */


  function BarChart(ctx, opt) {
    if (!(this instanceof BarChart)) {
      throwException(new Error('BarChart is constructor, should be involed with "new" operator!'));
    }

    this._init(ctx, opt);
  }

  return BarChart;

}));
