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
import optionCtrl from './option.js';

function drawAxis (ctx, yAxis_left, ctx_w, ctx_h) {
  ctx.beginPath();
  ctx.strokeStyle = optionCtrl.axisStyle;
  ctx.moveTo(yAxis_left, 0);
  ctx.lineTo(yAxis_left, ctx_h - 20);
  ctx.closePath();
  ctx.stroke();
}
function drawXAxisLabel (ctx, yAxis_left, ctx_w, ctx_h) {
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
function drawYAxisLabel (ctx, tick, yAxis_left, ctx_w, ctx_h) {
  var phyStep = (ctx_h - 40) / tick[3];
  var area_x = ctx_w - yAxis_left;
  var area_y = ctx_h - 26;

  ctx.beginPath();
  ctx.strokeStyle = optionCtrl.lineStyle;
  for (var i = 0; i <= tick[3]; i++) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.font = `${optionCtrl.fontSize}px ${optionCtrl.fontFamily}`;
    ctx.fillStyle = optionCtrl.fontStyle;
    ctx.fillText(tick[2] * i, yAxis_left - 10, area_y - i * phyStep)
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
function drawFrame (chart) {
  var ctx = chart.context;
  var tick = chart.tick;
  var ctx_w = chart.canvasW;
  var ctx_h = chart.canvasH;
  var yAxis_left = chart.yAxis_left;

  drawAxis(ctx, yAxis_left, ctx_w, ctx_h);
  drawXAxisLabel(ctx, yAxis_left, ctx_w, ctx_h);
  drawYAxisLabel(ctx, tick, yAxis_left, ctx_w, ctx_h);
}

export default drawFrame;
