import Player from "./Player.js";
import { MapGenerator } from "./Map/MapGenerator.js";
export default class Game {
    rendering;
    ecsManager;
    audio;
    playerObject;
    constructor(rendering, ecsManager, audio) {
        this.rendering = rendering;
        this.ecsManager = ecsManager;
        this.audio = audio;
        this.rendering.camera.setPosition(0.0, 0.0, 5.5);
        this.playerObject = new Player(this.rendering, this.ecsManager);
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
        console.log("mapInformation :>> ", mapInformation);
        // -------------
        this.playerObject.init();
    }
    update(dt) {
        this.playerObject.update(dt);
    }
}
//# sourceMappingURL=Game.js.map