import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class AnimationSystem extends System {
    constructor() {
        super([ComponentTypeEnum.GRAPHICS, ComponentTypeEnum.ANIMATION]);
    }
    update(dt) {
        for (const e of this.entities) {
            //entity is inactive, continue
            if (!e.isActive) {
                continue;
            }
            let graphComp = (e.getComponent(ComponentTypeEnum.GRAPHICS));
            let animComp = (e.getComponent(ComponentTypeEnum.ANIMATION));
            let projectileComp = (e.getComponent(ComponentTypeEnum.PROJECTILE));
            if (graphComp && animComp) {
                if (animComp.stopAtLast &&
                    animComp.spriteMap.currentSprite.x ==
                        animComp.spriteMap.nrOfSprites.x - 1) {
                    return;
                }
                animComp.updateTimer += dt;
                animComp.advancements += Math.floor(animComp.updateTimer / Math.max(animComp.updateInterval, 0.000001));
                animComp.updateTimer =
                    animComp.updateTimer % Math.max(animComp.updateInterval, 0.000001);
                const xAdvance = (animComp.advanceBy.x * animComp.advancements) %
                    Math.max(animComp.modAdvancement.x, 1.0);
                const yAdvance = (animComp.advanceBy.y * animComp.advancements) %
                    Math.max(animComp.modAdvancement.y, 1.0);
                animComp.spriteMap.setCurrentSprite(animComp.startingTile.x + xAdvance, animComp.startingTile.y + yAdvance);
                let quad = graphComp.object;
                animComp.spriteMap.updateTextureMatrix(quad.textureMatrix);
            }
        }
    }
}
//# sourceMappingURL=AnimationSystem.js.map