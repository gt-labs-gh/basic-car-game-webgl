// main.js
// Bootstraps everything and runs the main loop.

import { createRenderer } from "./renderer.js";
import { installInput } from "./input.js";
import { createGame } from "./game.js";
import { renderScene } from "./scene.js";
import { GTClientSdk } from 'gtl-client-sdk';

// Elements
const userNameInput = document.getElementById("userName")
const passwordInput = document.getElementById("password")
const loginBtn = document.getElementById("login-btn")
const errorMessage = document.getElementById("error-message")

const canvas = document.querySelector("#c");
const loginView = document.getElementById("login-view");
const gameView = document.getElementById("game-view");

const clientSDK = new GTClientSdk({
  apiUrl: 'http://127.0.0.1:8800',
  socketUrl: 'http://127.0.0.1:8801',
});


// Event listener
loginBtn.addEventListener("click", authenticateUser);

//All functions and main loop

// Show the specified view and hide others
function showView(id) {
  document.querySelectorAll("[id$=-view]").forEach((v) => {
    if(v.id !== id) {
      v.classList.remove("active")
      v.style.visibility = "hidden";
    }
  });

  const el = document.getElementById(id);
  el.classList.add("active");
  el.style.visibility = "visible";
}

async function authenticateUser() {
  try {
    const token = await (async () => {
      const existingToken = sessionStorage.getItem("auth_token");
      if(!existingToken) {
        const token = await clientSDK.login(userNameInput.value.trim(), passwordInput.value.trim());

        console.log("Login successfully!")

        sessionStorage.setItem("auth_token", token);

        return token;
      }

      return existingToken;
    })();

    startGame(token);
  } catch (error) {
    console.error("Authentication error:", error);
  }
}

function startGame(token) {
  //const gameApi = new GameApi();



  //gameApi.connect(token);
  clientSDK.connect(token);
  

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
      clientSDK.notifyLaneChange(action.type);
      game.handleAction(action);
    });


      // clientSDK.buyAsset(action.type);
      // clientSDK.sellAsset(action.type);


    // ---------- Main loop ----------
    let lastT = performance.now();

    function frame(now) {
      try {
        renderer.resizeToDisplaySize();

        const dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;

        game.update(dt);

        renderer.clear(0.07, 0.07, 0.08, 1.0);
        renderScene(renderer.drawRect, game);
      } catch(err) {
        console.error("Failed to animate frame:", err);
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}


async function init() {
  showView("login-view"); // Start with the login view
}

init().catch(function(err) {
  console.error("Something went really wrong during initialization:", err);
});
