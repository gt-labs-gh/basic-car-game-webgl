// main.js
// Bootstraps everything and runs the main loop.

import { createRenderer } from "./renderer.js";
import { installInput } from "./input.js";
import { createGame } from "./game.js";
import { renderScene } from "./scene.js";
import { login } from "./auth.js";


// Elements
const userNameInput = document.getElementById("userName")
const passwordInput = document.getElementById("password")
const loginBtn = document.getElementById("login-btn")
const errorMessage = document.getElementById("error-message")

const canvas = document.querySelector("#c");
const statusEl = document.querySelector("#status");
const loginView = document.getElementById("login-view");
const gameView = document.getElementById("game-view");

// Event listener
loginBtn.addEventListener("click", authenticateUser);  

// Allow pressing Enter to submit the form
passwordInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") login();
}); 

//All functions and main loop

// Show the specified view and hide others
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

async function authenticateUser() {
  try {
    const data = await login(userNameInput.value.trim(), passwordInput.value.trim()); 
    return {ok:true, user:data.user, token:data.token}; // Authentication successful
  } catch (error) {
    console.error("Authentication error:", error);
    return {ok:false, error: error.message || "Authentication failed"}; // Authentication failed
  }
}

function startGame() {
  showView("game-view"); // Show game view on successful login  
  const canvas = document.querySelector("#c");
  const statusEl = document.querySelector("#status"); 
  canvas.tabIndex = 0;
  canvas.addEventListener("click", () => canvas.focus());

  let renderer;
  try {
    renderer = createRenderer(canvas);
    statusEl.textContent = "WebGL2 OK";
  } catch (err) {
    statusEl.textContent = String(err?.message || err);
    throw err;
  }
      const game = createGame();

    // Input -> actions -> game
    installInput(window, (action) => {
      game.handleAction(action);
    });


    // ---------- Main loop ----------
    let lastT = performance.now();

    function frame(now) {
      renderer.resizeToDisplaySize();

      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      game.update(dt);

      renderer.clear(0.07, 0.07, 0.08, 1.0);
      renderScene(renderer.drawRect, game);

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
  

async function init() {
    debugger;

    showView("login-view"); // Start with the login view
   
  } 

init(); 
