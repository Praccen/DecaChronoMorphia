import Rendering from "../Engine/Rendering.js";
import Button from "../Engine/GUI/Button.js";
import Checkbox from "../Engine/GUI/Checkbox.js";

export default class Menu {
	private rendering: Rendering;

	private startGame: boolean;
	private startButton: Button;
	private crtCheckbox: Checkbox;
	private bloomCheckbox: Checkbox;

	constructor(
		rendering: Rendering
	) {
		this.rendering = rendering;
		this.startGame = false;

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
		this.startButton;
		this.startButton.center = true;
		this.startButton.textString = "Start game";
		this.startButton.getElement().style.color = "cyan";
		this.startButton.getInputElement().style.accentColor = "red";

		let self = this;
		this.startButton.onClick(function() {
			self.startGame = true;
		});

		this.crtCheckbox = this.rendering.getNewCheckbox();
		this.crtCheckbox.center = true;
		this.crtCheckbox.position.x = 0.5;
		this.crtCheckbox.position.y = 0.5;
		this.crtCheckbox.textSize = 20;
		this.crtCheckbox.textString = "CRT-effect ";
		this.crtCheckbox.getElement().style.color = "cyan";
		this.crtCheckbox.getInputElement().style.accentColor = "red";

		this.bloomCheckbox = this.rendering.getNewCheckbox();
		this.bloomCheckbox.center = true;
		this.bloomCheckbox.position.x = 0.5;
		this.bloomCheckbox.position.y = 0.6;
		this.bloomCheckbox.textSize = 20;
		this.bloomCheckbox.textString = "Bloom-effect ";
		this.bloomCheckbox.getElement().style.color = "cyan";
		this.bloomCheckbox.getInputElement().style.accentColor = "red";
	}

	update(dt: number): boolean {
		this.rendering.useCrt = this.crtCheckbox.getChecked();
		this.rendering.useBloom = this.bloomCheckbox.getChecked();

		if (this.startGame) {
			this.bloomCheckbox.remove();
			this.crtCheckbox.remove();
			this.startButton.remove();
			return true;
		}
		return false; 
	}
}
