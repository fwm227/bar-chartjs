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
    data: [],
    labels: [],
    margin: {
      top: 30,
      bottom: 30
    },
    xAxis: {
      font: {
        size: 13,
        family: 'Arial',
        style: '#333'
      },
      line: {
        style: '#333',
        width: 1
      },
      tick: {
        style: '#333',
        width: 1,
        length: 6
      }
    },
    yAxis: {
      font: {
        size: 13,
        family: 'Arial',
        style: '#333'
      },
      line: {
        style: '#333',
        width: 1
      },
      tick: {
        style: '#333',
        width: 1,
        length: 6
      }
    },
    guideLine: {
      style: '#ccc',
      width: 1
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
    duration: 500,
    tooltip: {
      title: '',
      style: 'rgba(0, 0, 0, 0.6)',
      height: 50,
      radius: 4,
      mark: {
        radius: 5,
        style: 'rgb(16, 142, 233)'
      },
      font: {
        size: 14,
        family: 'Arial',
        style: 'rgba(0, 0, 0, 0.6)'
      }
    }
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
   * @description T1, B1 and L1 are padding-top,
   * padding-bottom and text-area respecively in configuration
   * 
   * --------------------------------------------------
   * |    |               T1                          |
   * |    |-------------------------------------------|
   * |    |                                           |
   * |    |                                           |
   * |    |                                           |
   * |    |                                           |
   * |    |                                           |
   * |    |             Chart Area                    |
   * | L1 |                                           |
   * |    |                                           |
   * |    |                                           |
   * |    |                                           |
   * |----|-------------------------------------------|
   * |                      B1                        |
   * |------------------------------------------------|
   *
   */
  /**
   * Draw Axis
   * @param  {Object} ctx        context of bar-chart
   * @param  {Number} yAxis_left margin-left
   * @param  {Number} area_w     area width
   * @param  {Number} area_h     area height
   */

  function drawAxis(ctx, yAxis_left, area_w, area_h) {
    ctx.beginPath();
    ctx.strokeStyle = optionManager.yAxis.line.style;
    ctx.lineWidth = optionManager.yAxis.line.width;
    ctx.moveTo(yAxis_left, optionManager.margin.top);
    ctx.lineTo(yAxis_left, area_h);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = optionManager.xAxis.line.style;
    ctx.lineWidth = optionManager.xAxis.line.width;
    ctx.moveTo(yAxis_left, area_h);
    ctx.lineTo(area_w + yAxis_left, area_h);
    ctx.stroke();
  }
  /**
   * Draw label and tick of x-axis
   * @param  {Object} ctx        context of bar-chart
   * @param  {Number} yAxis_left margin-left
   * @param  {Number} area_w     area width
   * @param  {Number} area_h     area height
   */


  function drawXAxisLabel(ctx, yAxis_left, area_w, area_h) {
    var labels = optionManager.labels;
    var x_step = area_w / (labels.length + 1);
    var tickLength = optionManager.xAxis.tick.length;
    ctx.beginPath();
    ctx.strokeStyle = optionManager.xAxis.font.style;
    ctx.textAlign = 'center';
    ctx.font = "".concat(optionManager.xAxis.font.size, "px ").concat(optionManager.xAxis.font.family);
    ctx.fillStyle = optionManager.xAxis.font.style;

    for (var i = 1; i <= labels.length; i++) {
      ctx.moveTo(yAxis_left + i * x_step, area_h);
      ctx.lineTo(yAxis_left + i * x_step, area_h + tickLength);
      ctx.fillText(labels[i - 1], yAxis_left + i * x_step, area_h + 20);
    }

    ctx.closePath();
    ctx.stroke();
  }
  /**
   * Draw label and tick of y-axis
   * @param  {Object} ctx        context of bar-chart
   * @param  {Array} tick        tick infomation
   * @param  {Number} yAxis_left margin-left
   * @param  {Number} phyStep    real pixel of step
   * @param  {Number} area_w     area width
   * @param  {Number} area_h     area height
   */


  function drawYAxisLabel(ctx, tick, yAxis_left, phyStep, area_w, area_h) {
    var tickLength = optionManager.yAxis.tick.length;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.font = "".concat(optionManager.yAxis.font.size, "px ").concat(optionManager.yAxis.font.family);
    ctx.fillStyle = optionManager.yAxis.font.style;

    for (var i = 0; i <= tick[3]; i++) {
      ctx.beginPath();
      ctx.fillText(tick[2] * i, yAxis_left - 10, Math.round(area_h - i * phyStep));
      ctx.strokeStyle = optionManager.yAxis.tick.style;
      ctx.lineWidth = optionManager.yAxis.tick.width;
      ctx.moveTo(yAxis_left - tickLength, Math.round(area_h - i * phyStep));
      ctx.lineTo(yAxis_left, Math.round(area_h - i * phyStep));
      ctx.closePath();
      ctx.stroke();
      if (i === 0) continue;
      ctx.beginPath();
      ctx.strokeStyle = optionManager.guideLine.style;
      ctx.lineWidth = optionManager.guideLine.width;
      ctx.moveTo(yAxis_left, Math.round(area_h - i * phyStep));
      ctx.lineTo(area_w + yAxis_left, Math.round(area_h - i * phyStep));
      ctx.closePath();
      ctx.stroke();
    }
  }
  /**
   * Draw frame, tick[0] is min-tick, tick[1] is max-ick
   * tick[2] is step-space, tick[3] is step-number
   * @param  {Object} barChart the instance of bar-chart
   */


  function drawFrame(barChart) {
    var ctx = barChart.context;
    var tick = barChart.tick;
    var phyStep = barChart.phyScale * tick[2];
    var yAxis_left = barChart.yAxis_left;
    var area_w = barChart.areaW;
    var area_h = barChart.areaH;
    drawAxis(ctx, yAxis_left, area_w, area_h);
    drawXAxisLabel(ctx, yAxis_left, area_w, area_h);
    drawYAxisLabel(ctx, tick, yAxis_left, phyStep, area_w, area_h);
  }

  var helpers = {
    /**
     * Check whether is object
     * @param  {Target}  target check target
     * @return {Boolean}        return result
     */
    isObject: function isObject(target) {
      return _typeof(target) === 'object' && Object.prototype.toString.call(target) === '[object Object]';
    },

    /**
     * Format tick
     * @param  {Number} minTick    min tick
     * @param  {Number} maxTick    max tick
     * @param  {Number} stepNumber step number
     * @return {Tick}              tick formatted
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

    /**
     * Get suitable step
     * @param  {Number} minTick min tick
     * @param  {Number} maxTick max tick
     * @return {Array}         suitable tick
     */
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
     * Get tick
     * @param  {Number} minTick - min tick
     * @param  {Number} maxTick - max tick
     * @param  {Number} stepNumber - step number
     * @return {Array}            tick of bar-chart
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

  /**
   * Draw tooltip
   * @param  {Object} ctx           the context of bar-chart
   * @param  {Object} move_position move-position of mouse
   * @param  {Number} idx           select index
   */

  function drawTooltip(ctx, move_position, idx) {
    var markRadius = optionManager.tooltip.mark.radius;
    var tooltipText = "".concat(optionManager.tooltip.title).concat(optionManager.data[idx]);
    ctx.font = "".concat(optionManager.tooltip.font.size, "px ").concat(optionManager.tooltip.font.family);
    var descWidth = ctx.measureText(tooltipText).width;
    var titleWidth = ctx.measureText(optionManager.labels[idx]).width;
    var width = descWidth > titleWidth ? descWidth : titleWidth;
    width += 3 * markRadius;
    var additionWidth = 12;
    var tooltipRadius = optionManager.tooltip.radius;
    var tooltipHeight = optionManager.tooltip.height;
    var moveX = move_position.x + 10;
    var moveY = move_position.y + 10;
    var points = [{
      x: moveX,
      y: moveY
    }, {
      x: moveX + width + additionWidth,
      y: moveY
    }, {
      x: moveX + width + additionWidth,
      y: moveY + tooltipHeight
    }, {
      x: moveX,
      y: moveY + tooltipHeight
    }];
    ctx.beginPath();
    ctx.fillStyle = optionManager.tooltip.style;
    ctx.lineJoin = 'round';
    ctx.moveTo(points[0].x + optionManager.tooltip.radius, points[0].y);
    ctx.arcTo(points[1].x, points[1].y, points[2].x, points[2].y, tooltipRadius);
    ctx.arcTo(points[2].x, points[2].y, points[3].x, points[3].y, tooltipRadius);
    ctx.arcTo(points[3].x, points[3].y, points[0].x, points[0].y, tooltipRadius);
    ctx.arcTo(points[0].x, points[0].y, points[1].x, points[1].y, tooltipRadius);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(optionManager.labels[idx], moveX + additionWidth / 2, moveY + 0.85 * tooltipHeight / 3);
    ctx.fillText(tooltipText, moveX + additionWidth / 2 + 3 * markRadius, moveY + 2.1 * tooltipHeight / 3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = optionManager.tooltip.mark.style;
    ctx.arc(moveX + additionWidth / 2 + markRadius, moveY + 2 * tooltipHeight / 3, markRadius, 0, 2 * Math.PI);
    ctx.fill();
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
   * @param  {[type]} options config options
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
  /**
   * Init event
   * @param  {Dom} canvasDom canvas dom
   */


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
  /**
   * Init data
   */


  BarChart.prototype.initData = function () {
    this.animQuota = 0;
    this.min_data = Math.min.apply(Math, _toConsumableArray(optionManager.data));
    this.max_data = Math.max.apply(Math, _toConsumableArray(optionManager.data));
  };
  /**
   * Init context
   * @param  {Object} ctx context of bar-chart
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
   */


  BarChart.prototype.initOption = function (opt) {
    var setOption = function setOption(option, optionManager) {
      Object.keys(option).forEach(function (key) {
        if (option[key] && !helpers.isObject(option[key])) optionManager[key] = option[key];else if (helpers.isObject(option[key])) setOption(option[key], optionManager[key]);
      });
    };

    setOption(opt, optionManager);
  };
  /**
   * Init data of bar-chart
   */


  BarChart.prototype.initBars = function () {
    var _this = this;

    this.bars = [];
    this.phyScale = (this.areaH - optionManager.margin.top) / this.tick[1];
    var bar_w = this.areaW / (optionManager.data.length + 1) / 2;
    var next_x_axis = bar_w * 1.5;
    optionManager.data.forEach(function (val, index) {
      var bar = createBar(next_x_axis + _this.yAxis_left, _this.areaH, bar_w, -1 * val * _this.phyScale);

      _this.bars.push(bar);

      next_x_axis += 2 * bar_w;
    });
  };
  /**
   * Saculate scalue
   */


  BarChart.prototype.caculateScele = function () {
    this.tick = helpers.getTick(this.min_data >= 0 ? 0 : this.min_data, this.max_data);
    this.context.font = "".concat(optionManager.yAxis.font.size, " ").concat(optionManager.yAxis.font.size);
    this.yAxis_left = parseInt(2 * this.context.measureText(this.tick[1]).width);
    this.areaW = this.canvasW - this.yAxis_left;
    this.areaH = this.canvasH - optionManager.margin.bottom;
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
    var self = this,
        isSelect = false,
        selIdx = -1;
    self.bars.forEach(function (bar, idx) {
      if (move_position && move_position.x >= bar.x && move_position.x <= bar.x + bar.w && move_position.y <= bar.y && move_position.y >= bar.y + bar.h) selIdx = idx;
      drawBar(self.context, bar, isSelect);
    });

    if (~selIdx) {
      drawTooltip(self.context, move_position, selIdx);
    }
  };
  /**
   * Animation
   */


  BarChart.prototype.animation = function () {
    var ctx = this.context;
    var tickMove = this.max_data * this.phyScale / (optionManager.duration * 1e-3 * 60);
    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    ctx.save();
    drawFrame(this);
    this.animQuota -= tickMove;
    ctx.rect(0, this.canvasH - optionManager.margin.bottom, this.canvasW, this.animQuota);
    ctx.clip();
    this.drawBars();

    if (this.animQuota > -1 * this.max_data * this.phyScale) {
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
