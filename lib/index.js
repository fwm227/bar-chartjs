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
    series: [],
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
    defaultBar: {
      // set default style of bar
      style: {
        "default": 'rgba(16, 142, 233, 0.6)',
        select: 'rgb(16, 142, 233)'
      }
    },
    duration: 500,
    tooltip: {
      title: '',
      style: 'rgba(0, 0, 0, 0.6)',
      height: 50,
      radius: 4,
      mark: {
        radius: 5
      },
      font: {
        size: 14,
        family: 'Arial',
        style: 'rgb(255, 255, 255)'
      }
    }
  };

  var barInfns = ['x', 'y', 'w', 'h', 'val', 'd_style', 'a_style'];
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
    if (isSelect) ctx.fillStyle = bar.a_style;else ctx.fillStyle = bar.d_style;
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
   * @param  {Number} base_pos the position of line that mark zero in y-axis
   * @param  {Number} yAxis_left margin-left
   * @param  {Number} area_w     area width
   * @param  {Number} area_h     area height
   */

  function drawAxis(ctx, base_pos, yAxis_left, area_w, area_h) {
    ctx.beginPath();
    ctx.strokeStyle = optionManager.yAxis.line.style;
    ctx.lineWidth = optionManager.yAxis.line.width;
    ctx.moveTo(yAxis_left, optionManager.margin.top);
    ctx.lineTo(yAxis_left, area_h);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = optionManager.xAxis.line.style;
    ctx.lineWidth = optionManager.xAxis.line.width;
    ctx.moveTo(yAxis_left, base_pos);
    ctx.lineTo(area_w + yAxis_left, base_pos);
    ctx.stroke();
  }
  /**
   * Draw label and tick of x-axis
   * @param  {Object} ctx        context of bar-chart
   * @param  {Number} yAxis_left margin-left
   * @param  {Number} area_w     area width
   * @param  {Number} area_h     area height
   */


  function drawXAxisLabel(ctx, base_pos, yAxis_left, area_w, area_h) {
    var labels = optionManager.labels;
    var x_step = area_w / (labels.length + 1);
    var tickLength = optionManager.xAxis.tick.length;
    ctx.beginPath();
    ctx.strokeStyle = optionManager.xAxis.font.style;
    ctx.textAlign = 'center';
    ctx.font = "".concat(optionManager.xAxis.font.size, "px ").concat(optionManager.xAxis.font.family);
    ctx.fillStyle = optionManager.xAxis.font.style;

    for (var i = 1; i <= labels.length; i++) {
      var x_pos = Math.round(i * x_step);
      ctx.moveTo(yAxis_left + x_pos, base_pos);
      ctx.lineTo(yAxis_left + x_pos, base_pos + tickLength);
      ctx.fillText(labels[i - 1], yAxis_left + x_pos, area_h + 20);
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
    var yStepAcc = tick[0];
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.font = "".concat(optionManager.yAxis.font.size, "px ").concat(optionManager.yAxis.font.family);
    ctx.fillStyle = optionManager.yAxis.font.style;

    for (var i = 0; i <= tick[3]; i++, yStepAcc += tick[2]) {
      ctx.beginPath();
      ctx.fillText(yStepAcc, yAxis_left - 10, Math.round(area_h - i * phyStep));
      ctx.strokeStyle = optionManager.yAxis.tick.style;
      ctx.lineWidth = optionManager.yAxis.tick.width;
      ctx.moveTo(yAxis_left - tickLength, Math.round(area_h - i * phyStep));
      ctx.lineTo(yAxis_left, Math.round(area_h - i * phyStep));
      ctx.closePath();
      ctx.stroke();
      if (i === Math.abs(tick[0]) / tick[2]) continue;
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
    var base_pos = area_h + Math.round(tick[0] * barChart.phyScale);
    drawAxis(ctx, base_pos, yAxis_left, area_w, area_h);
    drawXAxisLabel(ctx, base_pos, yAxis_left, area_w, area_h);
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

        if (parseInt(minTick / formatStep) !== minTick / formatStep) {
          if (minTick < 0) minTick = -1 * Math.ceil(Math.abs(minTick / formatStep)) * formatStep;else minTick = parseInt(minTick / formatStep) * formatStep;
        } // modify max-tick


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

  function drawTooltip(ctx, move_position, info) {
    var markRadius = optionManager.tooltip.mark.radius;
    var tooltipText = "".concat(optionManager.tooltip.title, " ").concat(info.data_val);
    ctx.font = "".concat(optionManager.tooltip.font.size, "px ").concat(optionManager.tooltip.font.family);
    var descWidth = ctx.measureText(tooltipText).width;
    var titleWidth = ctx.measureText(info.label_val).width;
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
    ctx.fillStyle = optionManager.tooltip.font.style;
    ctx.fillText(info.label_val, moveX + additionWidth / 2, moveY + 0.85 * tooltipHeight / 3);
    ctx.fillText(tooltipText, moveX + additionWidth / 2 + 3 * markRadius, moveY + 2.1 * tooltipHeight / 3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = info.style;
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
    var move_position = Object.create(null);
    canvasDom.addEventListener('mousemove', function () {
      move_position.x = event.clientX - self.boundingRect.left;
      move_position.y = event.clientY - self.boundingRect.top;
      clearTimeout(timer);
      var timer = setTimeout(function () {
        self.context.clearRect(0, 0, self.canvasW, self.canvasH);
        drawFrame(self);
        self.drawBars(move_position);
      }, 1000 / 60);
    });
  };
  /**
   * Init data
   */


  BarChart.prototype.initData = function () {
    if (optionManager.series.length > 1) this.series = true;
    this.animIdx = 0;
    var totalData = [];
    optionManager.series.forEach(function (item, idx) {
      totalData = totalData.concat(item.data);
    });
    this.min_data = Math.min.apply(Math, _toConsumableArray(totalData));
    this.max_data = Math.max.apply(Math, _toConsumableArray(totalData));
    this.max_abs_data = Math.max(Math.abs(this.min_data), Math.abs(this.max_data));
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
    var self = this;
    self.bars = [];
    self.phyScale = (self.areaH - optionManager.margin.top) / (self.tick[1] - self.tick[0]);
    var step_len = self.areaW / (optionManager.labels.length + 1);
    var bar_w = step_len / (2 * optionManager.series.length);
    var big_step = 0,
        small_step = 0;
    optionManager.series.forEach(function (item, index) {
      big_step = 0;
      small_step += 1.5 * bar_w; // set default style

      if (!helpers.isObject(item.style)) {
        item.style = Object.create(null);
        item.style["default"] = optionManager.defaultBar.style["default"];
        item.style.active = optionManager.defaultBar.style.select;
      }

      item.data.forEach(function (val, idx) {
        var bar = createBar(big_step + small_step + self.yAxis_left, self.areaH + self.tick[0] * self.phyScale, bar_w, -1 * val * self.phyScale, val, item.style["default"], item.style.active);
        self.bars.push(bar);
        big_step += step_len;
      });
    });
  };
  /**
   * Saculate scalue
   */


  BarChart.prototype.caculateScele = function () {
    var self = this;
    self.tick = helpers.getTick(self.min_data >= 0 ? 0 : self.min_data, self.max_data);
    self.context.font = "".concat(optionManager.yAxis.font.size, " ").concat(optionManager.yAxis.font.size);
    self.yAxis_left = parseInt(3 * self.context.measureText(self.tick[1]).width);
    self.areaW = self.canvasW - self.yAxis_left;
    self.areaH = self.canvasH - optionManager.margin.bottom;
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
        selInfo;
    var step_len = self.areaW / (optionManager.labels.length + 1);
    self.bars.forEach(function (bar, idx) {
      if (move_position && move_position.x > bar.x && move_position.x < bar.x + bar.w && (move_position.y > bar.y + bar.h && move_position.y < bar.y || move_position.y > bar.y && move_position.y < bar.y + bar.h)) {
        isSelect = true;
        selInfo = {
          label_val: optionManager.labels[Math.floor((move_position.x - self.yAxis_left) / step_len)],
          data_val: bar.val,
          style: bar.d_style
        };
      } else isSelect = false;

      drawBar(self.context, bar, isSelect);
    });
    if (selInfo) drawTooltip(self.context, move_position, selInfo);
  };
  /**
   * Animation
   */


  BarChart.prototype.animation = function () {
    var self = this;
    var ctx = self.context;
    var tickMove = self.max_abs_data * self.phyScale / (optionManager.duration * 1e-3 * 60);
    var baseLineH = self.canvasH + self.tick[0] * self.phyScale - optionManager.margin.bottom;
    ctx.clearRect(0, 0, self.canvasW, self.canvasH);
    ctx.save();
    drawFrame(self);
    self.animIdx -= tickMove;
    var temp = self.animIdx;
    ctx.beginPath();
    ctx.rect(0, baseLineH - temp, self.canvasW, 2 * temp);
    ctx.closePath();
    ctx.clip();
    self.drawBars();

    if (self.animIdx > -1 * self.max_abs_data * self.phyScale) {
      var anim = self.animation.bind(self);
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
