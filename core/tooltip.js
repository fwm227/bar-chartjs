import optionManager from './option.js';

/**
 * Draw tooltip
 * @param  {Object} ctx           the context of bar-chart
 * @param  {Object} move_position move-position of mouse
 * @param  {Number} idx           select index
 */
function drawTooltip (ctx, move_position, idx) {
  var tooltipText = `${optionManager.tooltip.title}${optionManager.data[idx]}`;
  ctx.font = `${optionManager.tooltip.font.size}px ${optionManager.tooltip.font.family}`;
  var descWidth = ctx.measureText(tooltipText).width;
  var titleWidth = ctx.measureText(optionManager.labels[idx]).width;
  var width = descWidth > titleWidth ? descWidth : titleWidth;
  var additionWidth = 12;

  var moveX = move_position.x + 10;
  var moveY = move_position.y + 10;
  var points = [
    {x: moveX, y: moveY},
    {x: moveX + width + additionWidth, y: moveY},
    {x: moveX + width + additionWidth, y: moveY + optionManager.tooltip.height},
    {x: moveX, y: moveY + optionManager.tooltip.height}
  ];
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.lineJoin = 'round';
  ctx.moveTo(points[0].x + optionManager.tooltip.radius, points[0].y);
  ctx.arcTo(points[1].x, points[1].y, points[2].x, points[2].y, optionManager.tooltip.radius);
  ctx.arcTo(points[2].x , points[2].y, points[3].x, points[3].y, optionManager.tooltip.radius);
  ctx.arcTo(points[3].x, points[3].y, points[0].x, points[0].y, optionManager.tooltip.radius);
  ctx.arcTo(points[0].x, points[0].y, points[1].x, points[1].y, optionManager.tooltip.radius);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(optionManager.labels[idx], moveX + additionWidth / 2, moveY + 0.85 * optionManager.tooltip.height / 3);
  ctx.fillText(tooltipText, moveX + additionWidth / 2, moveY + 2.1 * optionManager.tooltip.height / 3);
}

export default drawTooltip;
