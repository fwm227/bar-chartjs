import {createBar, drawBar} from './bar.js';
import drawFrame from './frame.js';
import helpers from './helpers.js';
import optionCtrl from './option.js';

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
BarChart.prototype._init = function (canvasDom, option) {
  this.initContext(canvasDom);
  this.initOption(option);
  this.initData();
  this.caculateScele();
  this.initBars();;
  this.initEvent(canvasDom)
  this.render();
}
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
}
BarChart.prototype.initData = function () {
  this.min_data = Math.min(...optionCtrl.data);
  this.max_data = Math.max(...optionCtrl.data);
}
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
  }
  else throwException(new Error('Context should be a canvas DOM'));
}
/**
 * Init option
 * @param  {Object} opt - config option
 * ar-chart
 */
BarChart.prototype.initOption = function (option) {
  if (option !== null && !Array.isArray(option) && typeof option === 'object') {
    Object.keys(optionCtrl).forEach(function (key, idx) {
      if (option[key]) optionCtrl[key] = option[key];
    });
  } else throwException(new Error('Option should be a object-type'));
}
/**
 * Init data of bar-chart
 */
BarChart.prototype.initBars = function () {
  this.bars = [];
  var bar_w = this.areaW / (optionCtrl.data.length + 1) / 2;
  var next_x_axis = bar_w * 1.5;
  var phyScale = (this.canvasH - 40) / this.tick[1];
  optionCtrl.data.forEach((val, index) => {
    var bar = createBar(next_x_axis + this.yAxis_left, this.canvasH - 26, bar_w, -1 * val * phyScale);
    this.bars.push(bar);
    next_x_axis += 2 * bar_w ;
  })
}
/**
 * [caculateScele description]
 * @return {[type]} [description]
 */
BarChart.prototype.caculateScele = function () {
  this.tick = helpers.getTick(this.min_data >= 0 ? 0 : this.min_data, this.max_data);
  this.context.font = `${optionCtrl.fontSize} ${optionCtrl.fontFamily}`;
  this.yAxis_left = parseInt(2 * this.context.measureText(this.tick[1]).width);
  this.areaW = this.canvasW - this.yAxis_left;
}
/**
 * Render bar-chart
 */
BarChart.prototype.render = function () {
  var ctx = this.context;
  ctx.translate(0.5, 0.5);
  drawFrame(this);
  this.animation();
}
/**
 * Draw bar
 */
BarChart.prototype.drawBars = function (move_position) {
  var isSelect = false;
  this.context.fillStyle = optionCtrl.barStyle;
  this.bars.forEach((bar) => {
    if (move_position && (move_position.x >= bar.x && move_position.x <= (bar.x + bar.w)) &&
      (move_position.y <= bar.y && move_position.y >= (bar.y + bar.h))) isSelect = true;
      else isSelect = false;
    drawBar(this.context, bar, isSelect);
  });
}
/**
 * [animation description]
 * @return {[type]} [description]
 */
BarChart.prototype.animation = function () {
  const ctx = this.context;
  ctx.clearRect(0, 0, this.canvasW, this.canvasH);
  ctx.save();
  drawFrame(this);
  animIdx -= 10;
  ctx.rect(0, this.canvasH, this.canvasW, animIdx);
  ctx.clip();
  this.drawBars();
  if (animIdx > -1 * this.canvasH) {
    const anim = this.animation.bind(this);
    helpers.requestAnimationFrame()(anim);
  }
  ctx.restore();
}
/**
 * Bar-chart constructor
 */
function BarChart (canvasDom, opt) {
  if (!(this instanceof BarChart)) {
    throwException(new Error('BarChart is constructor, should be involed with "new" operator!'));
  }
  this._init(canvasDom, opt);
}

export default BarChart;
