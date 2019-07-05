import {createBar, drawBar} from './bar.js';
import drawFrame from './frame.js';
import helpers from './helpers.js';

var animIdx = 0;
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
 * @param  {[type]} options - config options
 */
BarChart.prototype._init = function (content, opt) {
  this.initContext(content);
  this.initOption(opt);
  this.initAnimation();
  this.initData();
  this.caculateScele();
  this.initBars();
  this.render();
}
BarChart.prototype.initData = function () {
  this.min_data = Math.min(...this.option.data);
  this.max_data = Math.max(...this.option.data);
}
/**
 * Init animation
 */
BarChart.prototype.initAnimation = function () {
  this.requestAnimation = helpers.requestAnimationFrame();
}
/**
 * Init context
 * @param  {Object} ctx - context of bar-chart
 */
BarChart.prototype.initContext = function (content) {
  if (content.nodeType === Node.ELEMENT_NODE && content.nodeName === 'CANVAS') {
    this.canvasW = content.width;
    this.canvasH = content.height;
    this.context = content.getContext('2d');
  }
  else throwException(new Error('Context should be a canvas DOM'));
}
/**
 * Init option
 * @param  {Object} opt - config option
 * ar-chart
 */
BarChart.prototype.initOption = function (opt) {
  if (opt !== null && !Array.isArray(opt) && typeof opt === 'object') this.option = opt;
  else throwException(new Error('Option should be a object'));
}
/**
 * Init data of bar-chart
 */
BarChart.prototype.initBars = function () {
  this.bars = [];
  var bar_w = this.areaW / 2 / this.option.data.length;
  var next_x_axis = bar_w;
  var phyStep = this.canvasH / this.tick[1];
  this.option.data.forEach((val, index) => {
    var bar = createBar(next_x_axis, this.canvasH - 20.5, bar_w, -1 * val * phyStep);
    this.bars.push(bar);
    next_x_axis += (bar_w + bar_w / 2);
  })
}
/**
 * [caculateScele description]
 * @return {[type]} [description]
 */
BarChart.prototype.caculateScele = function () {
  this.tick = helpers.getTick(this.min_data >= 0 ? 0 : this.min_data, this.max_data);
  this.context.font="12px Arial";
  this.yAxis_left = parseInt(2 * this.context.measureText(this.tick[1]).width) + 0.5;
  this.areaW = this.canvasW - this.yAxis_left;
}
/**
 * Render bar-chart
 */
BarChart.prototype.render = function () {
  drawFrame(this.context, this.tick, this.canvasW, this.canvasH, this.yAxis_left);
  this.animation();
}
/**
 * Draw bar
 */
BarChart.prototype.drawBars = function () {
  this.bars.forEach((bar) => {
    drawBar(this.context, bar);
  });
}
/**
 * [animation description]
 * @return {[type]} [description]
 */
BarChart.prototype.animation = function () {
  const ctx = this.context;
  ctx.save();
  animIdx -= 10;
  ctx.rect(0, this.canvasH, this.canvasW, animIdx);
  ctx.clip();
  this.drawBars();
  ctx.restore();
  if (animIdx > -1 * this.canvasH) {
    const anim = this.animation.bind(this);
    helpers.requestAnimationFrame()(anim);
  }
}
/**
 * Bar-chart constructor
 */
function BarChart (ctx, opt) {
  if (!(this instanceof BarChart)) {
    throwException(new Error('BarChart is constructor, should be involed with "new" operator!'));
  }
  this._init(ctx, opt);
}

export default BarChart;
