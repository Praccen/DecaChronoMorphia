import Input from "./Engine/Input/Input.js";
import Rendering from "./Engine/Rendering.js";
import Game from "./Game/Game.js";
import ECSManager from "./Engine/ECS/ECSManager.js";
import AudioPlayer from "./Engine/Audio/AudioPlayer.js";
import { SAT } from "./Engine/Maths/SAT.js";
import Menu from "./Game/Menu.js";
import TextObject2D from "./Engine/GUI/Text/TextObject2D.js";

SAT.runUnitTests();

// Globals
export let canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
let guicontainer = <HTMLElement>document.getElementById("guicontainer");
export let input = new Input();
export let options = {
	useCrt: false,
	useBloom: true,
	showFps: true,
	volume: 0.05
};
let heightByWidth = 1080 / 1920;
let widthByHeight = 1920 / 1080;

export let applicationStartTime = Date.now();

function initWebGL() {
	canvas.width = 1920;
	canvas.height = 1080;

	let gl = canvas.getContext("webgl2", { antialias: false });
	if (!gl.getExtension("EXT_color_buffer_float")) {
		alert(
			"Rendering to floating point textures is not supported on this platform"
		);
	}
	if (!gl.getExtension("OES_texture_float_linear")) {
		alert("Floating point rendering to FBO textures not supported");
	}

	if (!gl) {
		console.log("Failed to get rendering context for WebGL");
		return;
	}

	return gl;
}

function resize(gl: WebGL2RenderingContext, rendering: Rendering) {
	// Get the dimensions of the viewport
	let innerWindowSize = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	let newGameHeight;
	let newGameWidth;

	// Determine game size
	if (heightByWidth > innerWindowSize.height / innerWindowSize.width) {
		newGameHeight = innerWindowSize.height;
		newGameWidth = newGameHeight * widthByHeight;
	} else {
		newGameWidth = innerWindowSize.width;
		newGameHeight = newGameWidth * heightByWidth;
	}

	let newGameX = (innerWindowSize.width - newGameWidth) / 2;
	let newGameY = (innerWindowSize.height - newGameHeight) / 2;

	// Center the game by setting the padding of the game
	gl.canvas.style.padding = newGameY + "px " + newGameX + "px";
	guicontainer.style.padding = newGameY + "px " + newGameX + "px";

	// Resize game
	gl.canvas.style.width = newGameWidth + "px";
	gl.canvas.style.height = newGameHeight + "px";
	gl.canvas.width = newGameWidth;
	gl.canvas.height = newGameHeight;

	guicontainer.style.width = newGameWidth + "px";
	guicontainer.style.height = newGameHeight + "px";

	rendering.reportCanvasResize(newGameWidth, newGameHeight);
}

/* main */
window.onload = async () => {
	"use strict";

	let gl = initWebGL();

	let rendering: Rendering;
	let fpsDisplay: TextObject2D;
	let audio = new AudioPlayer();
	let ecsManager: ECSManager;
	let menu: Menu;
	let game: Game;
	let firstLoop: boolean;

	function init() {
		rendering = new Rendering(gl);
		if (fpsDisplay) {
			fpsDisplay.getElement().remove();
		}
		fpsDisplay = rendering.getNew2DText();
		audio.stopAll();
		ecsManager = new ECSManager(rendering);
		menu = new Menu(rendering, fpsDisplay, audio);
		game = null;
		firstLoop = true;

		fpsDisplay.position.x = 0.01;
		fpsDisplay.position.y = 0.01;
		fpsDisplay.size = 18;
		fpsDisplay.scaleWithWindow = false;
		fpsDisplay.getElement().style.color = "lime";

		resize(gl, rendering);
	}

	init();

	let lastTick = null;

	// Fixed update rate
	let minUpdateRate = 1.0 / 144.0;
	let updateTimer = 0.0;
	let updatesSinceRender = 0;

	let fpsUpdateTimer = 0.0;
	let frameCounter = 0;
	let dt = 0.0;

	function updateFrameTimers() {
		let now = Date.now();
		dt = (now - (lastTick || now)) * 0.001;
		lastTick = now;

		frameCounter++;
		fpsUpdateTimer += dt;

		if (fpsUpdateTimer > 0.5) {
			let fps = frameCounter / fpsUpdateTimer;
			fpsUpdateTimer -= 0.5;
			frameCounter = 0;
			fpsDisplay.textString = "" + Math.round(fps);
		}

		// Constant update rate
		updateTimer += dt;
		updatesSinceRender = 0;
	}

	/* Gameloop */
	function gameLoop(): boolean {
		updateFrameTimers();

		let quitGame = false;
		//Only update if update timer goes over update rate
		while (updateTimer >= minUpdateRate) {
			if (updatesSinceRender >= 20) {
				// Too many updates, throw away the rest of dt (makes the game run in slow-motion)
				updateTimer = 0;
				break;
			}

			quitGame = game.update(minUpdateRate);
			ecsManager.update(minUpdateRate);
			updateTimer -= minUpdateRate;
			updatesSinceRender++;
		}

		if (updatesSinceRender == 0) {
			// dt is faster than min update rate, allow faster updates
			quitGame = game.update(updateTimer);
			ecsManager.update(updateTimer);
			updateTimer = 0.0;
		}

		ecsManager.updateRenderingSystems(dt);

		if (!firstLoop) {
			rendering.draw();
		}

		firstLoop = false;

		return quitGame;
	}

	window.addEventListener("resize", function () {
		resize(gl, rendering);
	});

	console.log("Everything is ready.");

	async function runGame() {
		if (!gameLoop()) {
			requestAnimationFrame(runGame);
		} else {
			// Restart game
			init();
			requestAnimationFrame(menuLoop);
		}
	}

	async function menuLoop() {
		updateFrameTimers();
		if (input.mouseClicked) {
			audio.active = true;
		}

		if (!menu.update(dt)) {
			audio.playAudio("main_theme_4", true);
			rendering.draw();
			requestAnimationFrame(menuLoop);
		} else {
			audio.pauseAudio("main_theme_4");
			game = new Game(rendering, ecsManager, audio);
			await game.init();
			requestAnimationFrame(runGame);
		}
	}
	requestAnimationFrame(menuLoop);
};
