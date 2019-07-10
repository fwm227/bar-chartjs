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

  var optionManager = {
    xAxis: {
      font: {
        size: 13,
        family: 'Arial',
        style: '#333'
      },
      line: {
        style: '#333',
        width: 1
      }
    },
    yAxis: {
      font: {
        size: 13,
        family: 'Arial',
        style: '#333'
      },
      line: {
        style: '#aaa',
        width: 1
      }
    },
    bar: {
      style: {
        "default": 'rgba(16, 142, 233, 0.6)',
        select: 'rgb(16, 142, 233)'
      }
    },
    style: {
      axis: '#aaa',
      line: '#ccc'
    },
    duration: 2000,
    tooltip: {
      radius: 4,
      font: {
        size: 14,
        family: 'Arial',
        style: 'rgba(0, 0, 0, 0.6)'
      }
    },
    data: [],
    labels: []
  };

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
  /**
   * Draw bar
   */


  function drawBar(ctx, bar, isSelect) {
    if (isSelect) ctx.fillStyle = optionManager.bar.style.select;else ctx.fillStyle = optionManager.bar.style["default"];
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
  }

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
    ctx.strokeStyle = optionManager.yAxis.line.style;
    ctx.moveTo(yAxis_left, 0);
    ctx.lineTo(yAxis_left, ctx_h - 20);
    ctx.closePath();
    ctx.stroke();
  }

  function drawXAxisLabel(ctx, yAxis_left, ctx_w, ctx_h) {
    var labels = optionManager.labels;
    var x_step = (ctx_w - yAxis_left) / (labels.length + 1);
    var area_y = ctx_h - 26;
    ctx.beginPath();
    ctx.strokeStyle = optionManager.xAxis.font.style;
    ctx.textAlign = 'center';
    ctx.font = "".concat(optionManager.xAxis.font.size, "px ").concat(optionManager.xAxis.font.family);
    ctx.fillStyle = optionManager.xAxis.font.style;

    for (var i = 1; i <= labels.length; i++) {
      ctx.moveTo(yAxis_left + i * x_step, area_y);
      ctx.lineTo(yAxis_left + i * x_step, area_y + 6);
      ctx.fillText(labels[i - 1], yAxis_left + i * x_step, area_y + 20);
    }

    ctx.closePath();
    ctx.stroke();
  }

  function drawYAxisLabel(ctx, tick, yAxis_left, ctx_w, ctx_h) {
    var phyStep = (ctx_h - 40) / tick[3];
    var area_y = ctx_h - 26;
    ctx.beginPath();
    ctx.strokeStyle = optionManager.yAxis.line.style;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.font = "".concat(optionManager.yAxis.font.size, "px ").concat(optionManager.yAxis.font.family);
    ctx.fillStyle = optionManager.yAxis.font.style;

    for (var i = 0; i <= tick[3]; i++) {
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
    isObject: function isObject(target) {
      return _typeof(target) === 'object' && Object.prototype.toString.call(target) === '[object Object]';
    },

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

  function showTooltip(ctx, move_position, idx) {
    var tooltipText = "".concat(optionManager.labels[idx], ": ").concat(optionManager.data[idx]);
    ctx.font = "".concat(optionManager.tooltip.font.size, "px ").concat(optionManager.tooltip.font.family);
    var width = ctx.measureText(tooltipText).width;
    var points = [{
      x: move_position.x,
      y: move_position.y
    }, {
      x: move_position.x + width + 20,
      y: move_position.y
    }, {
      x: move_position.x + width + 20,
      y: move_position.y + 30
    }, {
      x: move_position.x,
      y: move_position.y + 30
    }];
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineJoin = 'round';
    ctx.moveTo(points[0].x + optionManager.tooltip.radius, points[0].y);
    ctx.arcTo(points[1].x, points[1].y, points[2].x, points[2].y, optionManager.tooltip.radius);
    ctx.arcTo(points[2].x, points[2].y, points[3].x, points[3].y, optionManager.tooltip.radius);
    ctx.arcTo(points[3].x, points[3].y, points[0].x, points[0].y, optionManager.tooltip.radius);
    ctx.arcTo(points[0].x, points[0].y, points[1].x, points[1].y, optionManager.tooltip.radius);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(tooltipText, move_position.x + 10, move_position.y + 15);
  }

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


  BarChart.prototype._init = function (canvasDom, option) {
    this.initContext(canvasDom);
    this.initOption(option);
    this.initData();
    this.caculateScele();
    this.initBars();
    this.initEvent(canvasDom);
    this.render();
  };

  BarChart.prototype.initEvent = function (canvasDom) {
    var self = this;
    var mouse_position = Object.create(null);
    canvasDom.addEventListener('mousemove', function () {
      mouse_position.x = event.clientX - self.boundingRect.left;
      mouse_position.y = event.clientY - self.boundingRect.top;
      clearTimeout(timer);
      var timer = setTimeout(function () {
        self.context.clearRect(0, 0, self.canvasW, self.canvasH);
        drawFrame(self);
        self.drawBars(mouse_position);
      }, 1000 / 60);
    });
  };

  BarChart.prototype.initData = function () {
    this.animQuota = 0;
    this.min_data = Math.min.apply(Math, _toConsumableArray(optionManager.data));
    this.max_data = Math.max.apply(Math, _toConsumableArray(optionManager.data));
  };
  /**
   * Init context
   * @param  {Object} ctx - context of bar-chart
   */


  BarChart.prototype.initContext = function (canvasDom) {
    this.boundingRect = canvasDom.getBoundingClientRect();

    if (canvasDom.nodeType === Node.ELEMENT_NODE && canvasDom.nodeName === 'CANVAS') {
      this.canvasW = canvasDom.width;
      this.canvasH = canvasDom.height;
      this.context = canvasDom.getContext('2d');
    } else throwException(new Error('Context should be a canvas DOM'));
  };
  /**
   * Init option
   * @param  {Object} opt - config option
   * ar-chart
   */


  BarChart.prototype.initOption = function (opt) {
    var setOption = function setOption(option) {
      Object.keys(option).forEach(function (key) {
        if (option[key] && !helpers.isObject(option[key])) optionManager[key] = option[key];else if (helpers.isObject(option[key])) setOption(option[key]);
      });
    };

    setOption(opt);
  };
  /**
   * Init data of bar-chart
   */


  BarChart.prototype.initBars = function () {
    var _this = this;

    this.bars = [];
    var bar_w = this.areaW / (optionManager.data.length + 1) / 2;
    var next_x_axis = bar_w * 1.5;
    var phyScale = (this.canvasH - 40) / this.tick[1];
    optionManager.data.forEach(function (val, index) {
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
    this.context.font = "".concat(optionManager.yAxis.font.size, " ").concat(optionManager.yAxis.font.size);
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


  BarChart.prototype.drawBars = function (move_position) {
    var isSelect = false;
    var self = this;
    self.bars.forEach(function (bar, idx) {
      if (move_position && move_position.x >= bar.x && move_position.x <= bar.x + bar.w && move_position.y <= bar.y && move_position.y >= bar.y + bar.h) isSelect = true;else isSelect = false;
      drawBar(self.context, bar, isSelect);
      if (isSelect) showTooltip(self.context, move_position, idx);
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
    this.animQuota -= 10;
    ctx.rect(0, this.canvasH, this.canvasW, this.animQuota);
    ctx.clip();
    this.drawBars();

    if (this.animQuota > -1 * this.canvasH) {
      var anim = this.animation.bind(this);
      helpers.requestAnimationFrame()(anim);
    }

    ctx.restore();
  };
  /**
   * Bar-chart constructor
   */


  function BarChart(canvasDom, opt) {
    if (!(this instanceof BarChart)) {
      throwException(new Error('BarChart is constructor, should be involed with "new" operator!'));
    }

    this._init(canvasDom, opt);
  }

  return BarChart;

}));
