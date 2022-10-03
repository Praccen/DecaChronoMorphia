import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class PlayerSystem extends System {
    timePassed;
    constructor() {
        super([ComponentTypeEnum.PLAYER]);
        this.timePassed = 1000;
    }
    update(dt) {
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const playerComp = e.getComponent(ComponentTypeEnum.PLAYER);
            this.timePassed += dt;
            if (playerComp.startDodge && !playerComp.dodgeing) {
                if (this.timePassed > playerComp.dodgeCooldown) {
                    this.timePassed = 0;
                    playerComp.dodgeing = true;
                }
            }
            else if (playerComp.dodgeing) {
                if (this.timePassed > playerComp.dodgeLength) {
                    playerComp.dodgeing = false;
                    this.timePassed = 0;
                }
            }
            playerComp.startDodge = false;
        });
    }
}
//# sourceMappingURL=PlayerSystem.js.map