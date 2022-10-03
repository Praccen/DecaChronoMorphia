import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
import { EnemyTypesEnum } from "../../../Constants/EnemyData.js";
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
            const enemyComponent = (e.getComponent(ComponentTypeEnum.ENEMY));
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
                let xAdvance = (animComp.advanceBy.x * animComp.advancements) %
                    Math.max(animComp.modAdvancement.x, 1.0);
                let yAdvance = (animComp.advanceBy.y * animComp.advancements) %
                    Math.max(animComp.modAdvancement.y, 1.0);
                if (!animComp.invert) {
                    if (enemyComponent?.enemyType === EnemyTypesEnum.WITCH) {
                        animComp.spriteMap.setCurrentSprite(animComp.startingTile.x + xAdvance, 0.0);
                    }
                    else {
                        animComp.spriteMap.setCurrentSprite(animComp.startingTile.x + xAdvance, animComp.startingTile.y + yAdvance);
                    }
                }
                else {
                    animComp.spriteMap.setCurrentSprite(animComp.spriteMap.nrOfSprites.x - xAdvance - 1, animComp.startingTile.y + yAdvance);
                }
                let quad = graphComp.object;
                animComp.spriteMap.updateTextureMatrix(quad.textureMatrix);
            }
        }
    }
}
//# sourceMappingURL=AnimationSystem.js.map