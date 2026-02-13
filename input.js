// input.js
// Owns keyboard handling; translates keys into high-level actions.

export function installInput(windowObj, onAction) {
  function onKeyDown(e) {
    const k = e.key;

    if (k === "ArrowLeft" || k === "a" || k === "A") {
      onAction({ type: "LANE_LEFT" });
    }
    if (k === "ArrowRight" || k === "d" || k === "D") {
      onAction({ type: "LANE_RIGHT" });
    }
  }

  windowObj.addEventListener("keydown", onKeyDown);

  // Return an "unsubscribe" function (good engineering habit)
  return () => windowObj.removeEventListener("keydown", onKeyDown);
}
