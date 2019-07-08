const barInfns = ['x', 'y', 'w', 'h'];

/**
 * Create bar
 * @return {Object} item instance of bar-chart
 */
function createBar () {
  var bar = Object.create(null);
  var args = arguments;
  barInfns.forEach(function (el, idx) {
    bar[el] = args[idx];
  })
  return bar;
}
/**
 * Draw bar
 */
var idx = 0;
function drawBar (ctx, bar) {
  ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
}

export {
  drawBar,
  createBar
}
