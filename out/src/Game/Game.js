import Player from "./Player.js";
export default class Game {
    rendering;
    ecsManager;
    playerObject;
    constructor(rendering, ecsManager) {
        this.rendering = rendering;
        this.ecsManager = ecsManager;
        this.rendering.camera.setPosition(0.0, 0.0, 5.5);
        this.playerObject = new Player(this.rendering, this.ecsManager);
    }
    async init() {
        this.rendering.clearColour = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
        // ---- Lights ----
        this.rendering.getDirectionalLight().ambientMultiplier = 0.0;
        this.rendering.getDirectionalLight().colour.setValues(0.05, 0.05, 0.05);
        // ----------------
        this.playerObject.init();
    }
    update(dt) {
        this.playerObject.update(dt);
    }
}
//# sourceMappingURL=Game.js.map