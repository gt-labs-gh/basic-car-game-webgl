// game.js
// Owns game state and update logic (NO WebGL calls here).

export function createGame() {
  const laneX = {
    left: -0.35,
    right: 0.35,
  };

  const state = {
    targetLane: "left",
    currentX: laneX.left,

    carY: -0.6,
    carW: 0.18,
    carH: 0.28,
  };

  const laneSnapSpeed = 14.0;

  function handleAction(action) {
    if (action.type === "LANE_LEFT") state.targetLane = "left";
    if (action.type === "LANE_RIGHT") state.targetLane = "right";
  }

  function update(dt) {
    const targetX = state.targetLane === "left" ? laneX.left : laneX.right;

    // Smooth movement toward target lane
    const k = 1 - Math.exp(-laneSnapSpeed * dt);
    state.currentX = state.currentX + (targetX - state.currentX) * k;
  }

  // Expose read-only view helpers for renderer usage
  function getDrawData() {
    return {
      laneX,
      car: {
        x: state.currentX,
        y: state.carY,
        w: state.carW,
        h: state.carH,
      },
      targetLane: state.targetLane,
      currentX: state.currentX,
    };
  }

  return {
    handleAction,
    update,
    getDrawData,
  };
}
