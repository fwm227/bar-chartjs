import {createBar, drawBar} from './bar.js';
import drawFrame from './frame.js';
import helpers from './helpers.js';
import optionManager from './option.js';
import drawTooltip from './tooltip.js';

/**
 * Throw exception
 * @param  {Object} err - exception object
 */
function throwException (err) {
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
  this.min_data = Math.min(...totalData);
  this.max_data = Math.max(...totalData);
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
  }
  else throwException(new Error('Context should be a canvas DOM'));
};

/**
 * Init option
 * @param  {Object} opt - config option
 */
BarChart.prototype.initOption = function (opt) {
  var setOption = function setOption (option, optionManager) {
    Object.keys(option).forEach(function (key) {
      if (option[key] && !helpers.isObject(option[key])) optionManager[key] = option[key];
      else if (helpers.isObject(option[key])) setOption(option[key], optionManager[key]);
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
  var bar_w =  step_len / (2 * optionManager.series.length);
  var big_step = 0, small_step = 0;

  optionManager.series.forEach(function (item, index) {
    big_step = 0;
    small_step += 1.5 * bar_w;
    // set default style
    if (!helpers.isObject(item.style)) {
      item.style = Object.create(null);
      item.style.default = optionManager.defaultBar.style.default;
      item.style.active = optionManager.defaultBar.style.select;
    }
    item.data.forEach(function (val, idx) {
      var bar = createBar(big_step + small_step + self.yAxis_left, self.areaH + self.tick[0] * self.phyScale, bar_w, -1 * val * self.phyScale, val, item.style.default, item.style.active);
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
  self.context.font = `${optionManager.yAxis.font.size} ${optionManager.yAxis.font.size}`;
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
  var self = this, isSelect = false, selInfo;
  var step_len = self.areaW / (optionManager.labels.length + 1);
  self.bars.forEach(function (bar, idx) {
    if (move_position &&
      (move_position.x > bar.x && move_position.x < (bar.x + bar.w)) && ((
      move_position.y > (bar.y + bar.h) && move_position.y < bar.y) ||
      move_position.y > bar.y && move_position.y < (bar.y + bar.h))) {
      isSelect = true;
      selInfo = {
        label_val: optionManager.labels[Math.floor((move_position.x - self.yAxis_left) / step_len)],
        data_val: bar.val
      }
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
  var tickMove = (self.max_abs_data * self.phyScale) / (optionManager.duration * 1e-3 * 60);
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
function BarChart (canvasDom, opt) {
  if (!(this instanceof BarChart)) {
    throwException(new Error('BarChart is constructor, should be involed with "new" operator!'));
  }
  this._init(canvasDom, opt);
};

export default BarChart;
