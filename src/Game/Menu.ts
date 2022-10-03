import Rendering from "../Engine/Rendering.js";
import Button from "../Engine/GUI/Button.js";
import Checkbox from "../Engine/GUI/Checkbox.js";
import TextObject2D from "../Engine/GUI/Text/TextObject2D.js";
import Slider from "../Engine/GUI/Slider.js";
import AudioPlayer from "../Engine/Audio/AudioPlayer.js";
import Quad from "../Engine/Objects/Quad.js";

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
		let smileyTexture =
			"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/1200px-SNice.svg.png";
		rendering.loadTextureToStore(smileyTexture);
		let floorTexture =
			"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/371b6fdf-69a3-4fa2-9ff0-bd04d50f4b98/de8synv-6aad06ab-ed16-47fd-8898-d21028c571c4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM3MWI2ZmRmLTY5YTMtNGZhMi05ZmYwLWJkMDRkNTBmNGI5OFwvZGU4c3ludi02YWFkMDZhYi1lZDE2LTQ3ZmQtODg5OC1kMjEwMjhjNTcxYzQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.wa-oSVpeXEpWqfc_bexczFs33hDFvEGGAQD969J7Ugw";
		rendering.loadTextureToStore(floorTexture);
		let laserTexture =
			"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f04b32b4-58c3-4e24-a642-67320f0a66bb/ddwzap4-c0ad82e3-b949-479c-973c-11daaa55a554.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YwNGIzMmI0LTU4YzMtNGUyNC1hNjQyLTY3MzIwZjBhNjZiYlwvZGR3emFwNC1jMGFkODJlMy1iOTQ5LTQ3OWMtOTczYy0xMWRhYWE1NWE1NTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.vSK6b4_DsskmHsiVKQtXQAospMA6_WZ2BoFYrODpFKQ";
		rendering.loadTextureToStore(laserTexture);
		let boxTexture =
			"https://as2.ftcdn.net/v2/jpg/01/99/14/99/1000_F_199149981_RG8gciij11WKAQ5nKi35Xx0ovesLCRaU.jpg";
		rendering.loadTextureToStore(boxTexture);
		let fireTexture = "Assets/textures/fire.png";
		rendering.loadTextureToStore(fireTexture);

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

		this.bloomCB = this.rendering.getNewCheckbox();
		this.bloomCB.center = true;
		this.bloomCB.position.x = 0.5;
		this.bloomCB.position.y = 0.65;
		this.bloomCB.textSize = 20;
		this.bloomCB.textString = "Bloom-effect ";
		this.bloomCB.getElement().style.color = "cyan";
		this.bloomCB.getInputElement().style.accentColor = "red";

		this.fpsDisplayCB = this.rendering.getNewCheckbox();
		this.fpsDisplayCB.center = true;
		this.fpsDisplayCB.position.x = 0.5;
		this.fpsDisplayCB.position.y = 0.7;
		this.fpsDisplayCB.textSize = 20;
		this.fpsDisplayCB.textString = "Fps counter ";
		this.fpsDisplayCB.getElement().style.color = "cyan";
		this.fpsDisplayCB.getInputElement().style.accentColor = "red";
		this.fpsDisplayCB.getInputElement().checked = true;

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

		this.witch = this.rendering.getNewQuad("Assets/textures/witch_dialog_1.png");
		this.witch.modelMatrix.translate(0.0, 0.35, -1.5);
	}

	update(dt: number): boolean {
		this.rendering.useCrt = this.crtCB.getChecked();
		this.rendering.useBloom = this.bloomCB.getChecked();
		this.fpsDisplay.setHidden(!this.fpsDisplayCB.getChecked());
		this.audioPlayer.setMusicVolume(this.volumeSlider.getValue() * 0.001);
		this.audioPlayer.setSoundEffectVolume(this.volumeSlider.getValue() * 0.001);

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
