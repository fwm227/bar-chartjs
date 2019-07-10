import optionManager from './option.js';

function showTooltip (ctx, move_position, idx) {
  var tooltipText = `${optionManager.labels[idx]}: ${optionManager.data[idx]}`;
  ctx.font = `${optionManager.tooltip.font.size}px ${optionManager.tooltip.font.family}`;
  var width = ctx.measureText(tooltipText).width;
  var points = [
    {x: move_position.x, y: move_position.y},
    {x: move_position.x + width + 20, y: move_position.y},
    {x: move_position.x + width + 20, y: move_position.y + 30},
    {x: move_position.x, y: move_position.y + 30}
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
  ctx.fillText(tooltipText, move_position.x + 10, move_position.y + 15);
}

export default showTooltip;
