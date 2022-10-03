import Player from "./Player.js";
import { MapGenerator } from "./Map/MapGenerator.js";
import { input } from "../main.js";
export default class Game {
    rendering;
    ecsManager;
    audio;
    playerObject;
    gameOverButton;
    gameOver;
    constructor(rendering, ecsManager, audio) {
        this.rendering = rendering;
        this.ecsManager = ecsManager;
        this.audio = audio;
        this.rendering.camera.setPosition(0.0, 0.0, 5.5);
        this.playerObject = new Player(this.rendering, this.ecsManager);
        this.gameOver = false;
    }
    async init() {
        this.rendering.clearColour = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
        // ---- Lights ----
        this.rendering.getDirectionalLight().ambientMultiplier = 0.0;
        this.rendering.getDirectionalLight().colour.setValues(0.05, 0.05, 0.05);
        // ----------------
        // ---- Map ----
        const mapInformation = await MapGenerator.GenerateMap(5, 5, this.ecsManager, this.rendering);
        this.ecsManager.initializeSystems(mapInformation, this.audio);
        // -------------
        this.playerObject.init();
        this.gameOverButton = this.rendering.getNewButton();
        this.gameOverButton.center = true;
        this.gameOverButton.position.x = 0.5;
        this.gameOverButton.position.y = 0.3;
        this.gameOverButton.textSize = 400;
        this.gameOverButton.textString = "    ";
        this.gameOverButton.getInputElement().style.backgroundColor = "transparent";
        this.gameOverButton.getInputElement().style.backgroundImage =
            "url(Assets/textures/rip.png";
        this.gameOverButton.getInputElement().style.backgroundSize = "100% 120%";
        this.gameOverButton.setHidden(true);
        let self = this;
        this.gameOverButton.onClick(function () {
            self.gameOver = true;
            self.gameOverButton.remove();
        });
    }
    update(dt) {
        this.playerObject.update(dt);
        if (this.playerObject.isDead) {
            this.gameOverButton.setHidden(false);
            this.playerObject.playerHPText.remove();
        }
        if (input.keys["p"] || this.gameOver) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=Game.js.map