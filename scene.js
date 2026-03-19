export function renderScene(drawRect, game) {
  // Road background
  drawRect({
    x: 0,
    y: 0,
    w: 1.4,
    h: 1.9,
    color: [0.12, 0.12, 0.13, 1],
  });

  // Lanes
  const { laneX, car, targetLane, currentX } = game.getDrawData();

  drawRect({
    x: laneX.left,
    y: 0,
    w: 0.55,
    h: 1.8,
    color: [0.16, 0.16, 0.18, 1],
  });
  drawRect({
    x: laneX.right,
    y: 0,
    w: 0.55,
    h: 1.8,
    color: [0.16, 0.16, 0.18, 1],
  });

  // Center divider
  drawRect({
    x: 0,
    y: 0,
    w: 0.02,
    h: 1.8,
    color: [0.75, 0.75, 0.75, 0.25],
  });

  // Car shadow
  drawRect({
    x: car.x + 0.03,
    y: car.y - 0.03,
    w: car.w,
    h: car.h,
    color: [0, 0, 0, 0.35],
  });

  // Car body
  drawRect({
    x: car.x,
    y: car.y,
    w: car.w,
    h: car.h,
    color: [0.9, 0.2, 0.25, 1],
  });

  // Windshield accent
  drawRect({
    x: car.x,
    y: car.y + 0.06,
    w: car.w * 0.7,
    h: car.h * 0.25,
    color: [0.7, 0.85, 0.95, 0.9],
  });

  statusEl.textContent = `Lane: ${targetLane.toUpperCase()} (x=${currentX.toFixed(3)})`;
}