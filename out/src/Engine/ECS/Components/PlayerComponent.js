import { Component, ComponentTypeEnum } from "./Component.js";
import Vec2 from "../../Maths/Vec2.js";
export var PlayerShapeEnum;
(function (PlayerShapeEnum) {
    PlayerShapeEnum[PlayerShapeEnum["NORMIE"] = 0] = "NORMIE";
    PlayerShapeEnum[PlayerShapeEnum["TANKY"] = 1] = "TANKY";
    PlayerShapeEnum[PlayerShapeEnum["WIZ"] = 2] = "WIZ";
    PlayerShapeEnum[PlayerShapeEnum["MOUSE"] = 3] = "MOUSE";
})(PlayerShapeEnum || (PlayerShapeEnum = {}));
export default class PlayerComponent extends Component {
    player;
    inRoom;
    dodgeing;
    startDodge;
    dodgeCooldown;
    dodgeLength;
    dodgeStartingTile;
    dodgeModAdvancement;
    dodgeUpdateInterval;
    dodgeAbiltiy;
    resetAnim;
    constructor(player) {
        super(ComponentTypeEnum.PLAYER);
        this.player = player;
        this.startDodge = false;
        this.dodgeing = false;
        this.dodgeAbiltiy = true;
        this.dodgeCooldown = 2;
        this.dodgeLength = 1.6;
        this.inRoom = new Vec2({ x: 1, y: 1 });
        this.resetAnim = false;
        this.dodgeStartingTile = new Vec2({ x: 0, y: 0 });
        this.dodgeModAdvancement = new Vec2({ x: 0, y: 0 });
        this.dodgeUpdateInterval = 0.0;
    }
}
//# sourceMappingURL=PlayerComponent.js.map