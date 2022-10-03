import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class SpriteDirectionSystem extends System {
    constructor() {
        super([
            ComponentTypeEnum.POSITION,
            ComponentTypeEnum.MOVEMENT,
            ComponentTypeEnum.ANIMATION,
        ]);
    }
    update(dt) {
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const movementComp = e.getComponent(ComponentTypeEnum.MOVEMENT);
            const animationComp = e.getComponent(ComponentTypeEnum.ANIMATION);
            const positionComp = e.getComponent(ComponentTypeEnum.POSITION);
            const playerComp = e.getComponent(ComponentTypeEnum.PLAYER);
            let playerDodge = false;
            if (playerComp) {
                playerDodge = playerComp.dodgeing;
                if (!playerDodge) {
                    playerComp.resetAnim = true;
                }
            }
            positionComp.rotation.setValues(-30.0, 0.0, 0.0);
            animationComp.modAdvancement = { x: 2, y: 0 };
            animationComp.updateInterval = 0.3;
            if (movementComp.velocity.length2() <= 0.07) {
                if (!playerDodge) {
                    animationComp.startingTile = { x: 0, y: 3 };
                    return;
                }
            }
            if (movementComp.accelerationDirection.z >= 0) {
                animationComp.startingTile = { x: 0, y: 1 };
                if (movementComp.accelerationDirection.x < 0) {
                    positionComp.rotation.setValues(-40.0, -15.0, 5.0);
                }
                else if (movementComp.accelerationDirection.x > 0) {
                    positionComp.rotation.setValues(-40.0, 15.0, -5.0);
                }
            }
            else if (movementComp.accelerationDirection.z < 0) {
                animationComp.startingTile = { x: 0, y: 0 };
                if (movementComp.accelerationDirection.x > 0) {
                    positionComp.rotation.setValues(-40.0, -15.0, 5.0);
                }
                else if (movementComp.accelerationDirection.x < 0) {
                    positionComp.rotation.setValues(-40.0, 15.0, -5.0);
                }
            }
            if (playerDodge) {
                if (playerComp.resetAnim) {
                    animationComp.advancements = 0;
                    animationComp.updateTimer = 0;
                    playerComp.resetAnim = false;
                }
                animationComp.startingTile = {
                    x: playerComp.dodgeStartingTile.x,
                    y: playerComp.dodgeStartingTile.y,
                };
                animationComp.modAdvancement = {
                    x: playerComp.dodgeModAdvancement.x,
                    y: playerComp.dodgeModAdvancement.y,
                };
                animationComp.updateInterval = playerComp.dodgeUpdateInterval;
            }
        });
    }
}
//# sourceMappingURL=SpriteDirectionSystem.js.map