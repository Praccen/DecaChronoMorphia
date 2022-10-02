import Rendering from "../Engine/Rendering.js";
import Button from "../Engine/GUI/Button.js";
import Checkbox from "../Engine/GUI/Checkbox.js";
import TextObject2D from "../Engine/GUI/Text/TextObject2D.js";

export default class Menu {
	private rendering: Rendering;

	private startGame: boolean;
	private startButton: Button;
	private crtCB: Checkbox;
	private bloomCB: Checkbox;
	private fpsDisplayCB: Checkbox;
	private fpsDisplay: TextObject2D;

	constructor(rendering: Rendering, fpsDisplay: TextObject2D) {
		this.rendering = rendering;
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

		this.startButton = this.rendering.getNewButton();
		this.startButton.position.x = 0.5;
		this.startButton.position.y = 0.4;
		this.startButton.center = true;
		this.startButton.textSize = 120;
		this.startButton.getInputElement().style.backgroundColor = "transparent";
		this.startButton.getInputElement().style.backgroundImage =
			"url(Assets/textures/buttons.png)";
		this.startButton.getInputElement().style.backgroundPosition = "0% 0%";
		this.startButton.getInputElement().style.backgroundSize = "220% 300%";
		this.startButton.getInputElement().style.padding = "10px 10px";
		this.startButton.textString = "            ";

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
	}

	update(dt: number): boolean {
		this.rendering.useCrt = this.crtCB.getChecked();
		this.rendering.useBloom = this.bloomCB.getChecked();
		this.fpsDisplay.setHidden(!this.fpsDisplayCB.getChecked());

		if (this.startGame) {
			this.startButton.remove();
			this.crtCB.remove();
			this.bloomCB.remove();
			this.fpsDisplayCB.remove();
			return true;
		}
		return false;
	}
}
