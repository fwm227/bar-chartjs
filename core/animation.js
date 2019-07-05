var animIdx = 0;
/**
 * Animation of bar-chart
 * @param  {Context} ctx - the context of bar-chart
 */
function animation (ctx, barChart) {
  ctx.save();
  animIdx -= 10;
  ctx.rect(0, 300, 300, animIdx);
  ctx.clip();
  barChart.drawBars();
  ctx.restore();
  if (animIdx > -1 * 300) {
    requestAnimationFrame();
  }
}

export default animation;
