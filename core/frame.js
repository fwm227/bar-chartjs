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
function drawAxis (ctx, yAxis_left, ctx_w, ctx_h) {
  ctx.beginPath();
  ctx.moveTo(yAxis_left, 0);
  ctx.lineTo(yAxis_left, ctx_h - 20.5);
  ctx.moveTo(yAxis_left, ctx_h - 20.5);
  ctx.lineTo(ctx_w, ctx_h - 20.5);
}
/**
 * Draw frame
 */
function drawFrame (ctx, tick, ctx_w, ctx_h, yAxis_left) {
  var phyStep = ctx_h / tick[3];
  drawAxis(ctx, yAxis_left, ctx_w, ctx_h);
  var area_x = ctx_w - yAxis_left;
  var area_y = ctx_h - 20;
  for (var i = 0; i <= tick[3]; i++) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText(tick[2] * i, yAxis_left - 6, area_y - i * phyStep)
    ctx.moveTo(yAxis_left - 3, area_y - i * phyStep + 0.5);
    ctx.lineTo(yAxis_left, area_y - i * phyStep + 0.5);
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(yAxis_left, area_y - i * phyStep + 0.5);
    ctx.lineTo(ctx_w, area_y - i * phyStep + 0.5);
  }
  ctx.closePath();
  ctx.stroke();
}

export default drawFrame;
