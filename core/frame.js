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
import optionManager from './option.js';

/**
 * Draw Axis
 * @param  {Object} ctx        context of bar-chart
 * @param  {Number} base_pos the position of line that mark zero in y-axis
 * @param  {Number} yAxis_left margin-left
 * @param  {Number} area_w     area width
 * @param  {Number} area_h     area height
 */
function drawAxis (ctx, base_pos, yAxis_left, area_w, area_h) {
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
function drawXAxisLabel (ctx, yAxis_left, area_w, area_h) {
  var labels = optionManager.labels;
  var x_step = area_w / (labels.length + 1);
  var tickLength = optionManager.xAxis.tick.length;

  ctx.beginPath();
  ctx.strokeStyle = optionManager.xAxis.font.style;
  ctx.textAlign = 'center';
  ctx.font = `${optionManager.xAxis.font.size}px ${optionManager.xAxis.font.family}`;
  ctx.fillStyle = optionManager.xAxis.font.style;
  for (var i = 1; i <= labels.length; i++) {
    var x_pos = Math.round(i * x_step);
    ctx.moveTo(yAxis_left + x_pos, area_h);
    ctx.lineTo(yAxis_left + x_pos, area_h + tickLength);
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
function drawYAxisLabel (ctx, tick, yAxis_left, phyStep, area_w, area_h) {
  var tickLength = optionManager.yAxis.tick.length;
  var yStepAcc = tick[0];
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  ctx.font = `${optionManager.yAxis.font.size}px ${optionManager.yAxis.font.family}`;
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
function drawFrame (barChart) {
  var ctx = barChart.context;
  var tick = barChart.tick;
  var phyStep = barChart.phyScale * tick[2];
  var yAxis_left = barChart.yAxis_left;
  var area_w = barChart.areaW;
  var area_h = barChart.areaH;
  var base_pos = area_h + Math.round(tick[0] * barChart.phyScale);
  drawAxis(ctx, base_pos, yAxis_left, area_w, area_h);
  drawXAxisLabel(ctx, yAxis_left, area_w, area_h);
  drawYAxisLabel(ctx, tick, yAxis_left, phyStep, area_w, area_h);
}

export default drawFrame;
