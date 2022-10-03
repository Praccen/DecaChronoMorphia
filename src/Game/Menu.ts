import Rendering from "../Engine/Rendering.js";
import Button from "../Engine/GUI/Button.js";
import Checkbox from "../Engine/GUI/Checkbox.js";
import TextObject2D from "../Engine/GUI/Text/TextObject2D.js";
import Slider from "../Engine/GUI/Slider.js";
import AudioPlayer from "../Engine/Audio/AudioPlayer.js";
import Quad from "../Engine/Objects/Quad.js";
import { options } from "../main.js";

export default class Menu {
	private rendering: Rendering;
	private audioPlayer: AudioPlayer;

	private witch: Quad;
	private titleText: TextObject2D;
	private startGame: boolean;
	private startButton: Button;
	private crtCB: Checkbox;
	private bloomCB: Checkbox;
	private fpsDisplayCB: Checkbox;
	private fpsDisplay: TextObject2D;
	private volumeSlider: Slider;

	constructor(
		rendering: Rendering,
		fpsDisplay: TextObject2D,
		audioPlayer: AudioPlayer
	) {
		this.rendering = rendering;
		this.audioPlayer = audioPlayer;
		this.startGame = false;
		this.fpsDisplay = fpsDisplay;

		// Load all textures to avoid loading mid game
		let textures = [
		"black.png       ",
		"mouse_front.png   ",
		"puff.png        ",
		"tanky_spec.png",
		"buttons.png     ",
		"normy.png         ",
		"rip.png         ",
		"voxelPalette.png",
		"door.png        ",
		"normy_fron.png    ",
		"skully.png      ",
		"wall.png",
		"dryady.png      ",
		"normy_front2.png  ",
		"slime.png       ",
		"wall2.png",
		"fire.png        ",
		"normy_front3.png  ",
		"slime_spec.png  ",
		"witch_dialog_1.png",
		"knight.png      ",
		"normy_spec.png    ",
		"stone.png       ",
		"witch_dialog_2.png",
		"mouse.png       ",
		"owo.png           ",
		"stone_moss.png  ",
		"witch_sheet.png",
		"mouse_back.png  ",
		"projectiles.png   ",
		"tanky.png       ",
		"wizard.png",
		];
		for (const texFile of textures) {
			this.rendering.loadTextureToStore("Assets/textures/" + texFile);
		}



		this.titleText = this.rendering.getNew2DText();
		this.titleText.position.x = 0.5;
		this.titleText.position.y = 0.1;
		this.titleText.center = true;
		this.titleText.size = 80;
		this.titleText.textString = "Decachronomorphia";
		this.titleText.getElement().style.color = "white";

		this.startButton = this.rendering.getNewButton();
		this.startButton.position.x = 0.5;
		this.startButton.position.y = 0.46;
		this.startButton.center = true;
		this.startButton.textSize = 60;
		this.startButton.getInputElement().style.backgroundColor = "transparent";
		this.startButton.getInputElement().style.color = "white";
		this.startButton.textString = "Start";

		let self = this;
		this.startButton.onClick(function () {
			self.startGame = true;
		});

		this.crtCB = this.rendering.getNewCheckbox();
		this.crtCB.center = true;
		this.crtCB.position.x = 0.5;
		this.crtCB.position.y = 0.6;
		this.crtCB.textSize = 20;
		this.crtCB.textString = "CRT-effect ";
		this.crtCB.getElement().style.color = "cyan";
		this.crtCB.getInputElement().style.accentColor = "red";
		this.crtCB.getInputElement().checked = options.useCrt;

		this.bloomCB = this.rendering.getNewCheckbox();
		this.bloomCB.center = true;
		this.bloomCB.position.x = 0.5;
		this.bloomCB.position.y = 0.65;
		this.bloomCB.textSize = 20;
		this.bloomCB.textString = "Bloom-effect ";
		this.bloomCB.getElement().style.color = "cyan";
		this.bloomCB.getInputElement().style.accentColor = "red";
		this.bloomCB.getInputElement().checked = options.useBloom;

		this.fpsDisplayCB = this.rendering.getNewCheckbox();
		this.fpsDisplayCB.center = true;
		this.fpsDisplayCB.position.x = 0.5;
		this.fpsDisplayCB.position.y = 0.7;
		this.fpsDisplayCB.textSize = 20;
		this.fpsDisplayCB.textString = "Fps counter ";
		this.fpsDisplayCB.getElement().style.color = "cyan";
		this.fpsDisplayCB.getInputElement().style.accentColor = "red";
		this.fpsDisplayCB.getInputElement().checked = options.showFps;

		this.volumeSlider = this.rendering.getNewSlider();
		this.volumeSlider.center = true;
		this.volumeSlider.position.x = 0.5;
		this.volumeSlider.position.y = 0.75;
		this.volumeSlider.textSize = 20;
		this.volumeSlider.textString = "Volume ";
		this.volumeSlider.getElement().style.color = "cyan";
		this.volumeSlider.getInputElement().style.accentColor = "red";
		this.volumeSlider.getInputElement().min = "0";
		this.volumeSlider.getInputElement().max = "100";
		this.volumeSlider.getInputElement().value = options.volume * 1000 + "";

		this.witch = this.rendering.getNewQuad(
			"Assets/textures/witch_dialog_1.png"
		);
		this.witch.modelMatrix.translate(0.0, 0.35, -1.5);
	}

	update(dt: number): boolean {
		options.useCrt = this.crtCB.getChecked();
		this.rendering.useCrt = options.useCrt;
		options.useBloom = this.bloomCB.getChecked();
		this.rendering.useBloom = options.useBloom;
		options.showFps = this.fpsDisplayCB.getChecked();
		this.fpsDisplay.setHidden(!options.showFps);
		options.volume = this.volumeSlider.getValue() * 0.001;
		this.audioPlayer.setMusicVolume(options.volume);
		this.audioPlayer.setSoundEffectVolume(options.volume);

		if (this.startGame) {
			this.rendering.deleteQuad(this.witch);
			this.titleText.remove();
			this.startButton.remove();
			this.crtCB.remove();
			this.bloomCB.remove();
			this.fpsDisplayCB.remove();
			this.volumeSlider.remove();
			return true;
		}
		return false;
	}
}
