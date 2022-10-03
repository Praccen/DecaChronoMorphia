import SpriteMap from "../../Textures/SpriteMap.js";
import { Component, ComponentTypeEnum } from "./Component.js";
export default class AnimationComponent extends Component {
    startingTile;
    advanceBy;
    modAdvancement;
    updateInterval;
    updateTimer;
    advancements;
    stopAtLast;
    spriteMap;
    constructor() {
        super(ComponentTypeEnum.ANIMATION);
        this.startingTile = { x: 0, y: 0 };
        this.advanceBy = { x: 0, y: 0 };
        this.modAdvancement = { x: 1, y: 1 };
        this.updateInterval = 1.0;
        this.updateTimer = 0.0;
        this.advancements = 0;
        this.stopAtLast = false;
        this.spriteMap = new SpriteMap();
    }
}
//# sourceMappingURL=AnimationComponent.js.map