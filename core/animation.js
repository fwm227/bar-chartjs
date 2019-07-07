/**
 * Animation of bar-chart
 * @param  {Context} ctx - the context of bar-chart
 */
function animation (bar) {
  ctx.save();
  ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
  ctx.restore();
  if (scale > -1) {
    requestAnimationFrame();
  }
}

export default animation;
