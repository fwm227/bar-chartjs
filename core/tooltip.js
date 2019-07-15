import optionManager from './option.js';

/**
 * Draw tooltip
 * @param  {Object} ctx           the context of bar-chart
 * @param  {Object} move_position move-position of mouse
 * @param  {Number} idx           select index
 */
function drawTooltip (ctx, move_position, info) {
  var markRadius = optionManager.tooltip.mark.radius;
  var tooltipText = `${optionManager.tooltip.title} ${info.data_val}`;
  ctx.font = `${optionManager.tooltip.font.size}px ${optionManager.tooltip.font.family}`;
  var descWidth = ctx.measureText(tooltipText).width;
  var titleWidth = ctx.measureText(info.label_val).width;
  var width = descWidth > titleWidth ? descWidth : titleWidth;
  width += 3 * markRadius;
  var additionWidth = 12;

  var tooltipRadius = optionManager.tooltip.radius;
  var tooltipHeight = optionManager.tooltip.height;

  var moveX = move_position.x + 10;
  var moveY = move_position.y + 10;
  var points = [
    {x: moveX, y: moveY},
    {x: moveX + width + additionWidth, y: moveY},
    {x: moveX + width + additionWidth, y: moveY + tooltipHeight},
    {x: moveX, y: moveY + tooltipHeight}
  ];

  ctx.beginPath();
  ctx.fillStyle = optionManager.tooltip.style;
  ctx.lineJoin = 'round';
  ctx.moveTo(points[0].x + optionManager.tooltip.radius, points[0].y);
  ctx.arcTo(points[1].x, points[1].y, points[2].x, points[2].y, tooltipRadius);
  ctx.arcTo(points[2].x , points[2].y, points[3].x, points[3].y, tooltipRadius);
  ctx.arcTo(points[3].x, points[3].y, points[0].x, points[0].y, tooltipRadius);
  ctx.arcTo(points[0].x, points[0].y, points[1].x, points[1].y, tooltipRadius);
  ctx.fill();
  
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = optionManager.tooltip.font.style;
  ctx.fillText(info.label_val, moveX + additionWidth / 2, moveY + 0.85 * tooltipHeight / 3);
  ctx.fillText(tooltipText, moveX + additionWidth / 2 + 3 * markRadius, moveY + 2.1 * tooltipHeight / 3);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = info.style;
  ctx.arc(moveX + additionWidth / 2 + markRadius, moveY + 2 * tooltipHeight / 3, markRadius, 0, 2 * Math.PI);
  ctx.fill();
}

export default drawTooltip;
