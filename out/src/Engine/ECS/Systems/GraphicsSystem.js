import System from "./System.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import { ProjectileGraphicsDirectionEnum, } from "../Components/ProjectileComponent.js";
import { WeaponTypeEnum } from "../Components/WeaponComponent.js";
export default class GraphicsSystem extends System {
    constructor() {
        super([ComponentTypeEnum.POSITION]);
        // Optional ComponentTypeEnum.GRAPHICS, ComponentTypeEnum.POINTLIGHT
    }
    update(dt) {
        for (const e of this.entities) {
            //entity is inactive, continue
            if (!e.isActive) {
                continue;
            }
            let posComp = (e.getComponent(ComponentTypeEnum.POSITION));
            let graphComp = (e.getComponent(ComponentTypeEnum.GRAPHICS));
            let projectileComp = (e.getComponent(ComponentTypeEnum.PROJECTILE));
            if (graphComp && posComp) {
                if (projectileComp) {
                    if (projectileComp.projectileGraphicsDirection ===
                        ProjectileGraphicsDirectionEnum.RIGHT) {
                        if (projectileComp.weaponType === WeaponTypeEnum.ARROW ||
                            projectileComp.weaponType === WeaponTypeEnum.MAGIC) {
                            let quad = graphComp.object;
                            quad.textureMatrix.scale(-1, 1, 1);
                            let animComp = (e.getComponent(ComponentTypeEnum.ANIMATION));
                            animComp.invert = true;
                        }
                    }
                    else if (projectileComp.projectileGraphicsDirection ===
                        ProjectileGraphicsDirectionEnum.LEFT) {
                        if (projectileComp.weaponType != WeaponTypeEnum.ARROW &&
                            projectileComp.weaponType != WeaponTypeEnum.MAGIC) {
                            let quad = graphComp.object;
                            quad.textureMatrix.scale(-1, 1, 1);
                            let animComp = (e.getComponent(ComponentTypeEnum.ANIMATION));
                            animComp.invert = true;
                        }
                    }
                    else if (projectileComp.projectileGraphicsDirection ===
                        ProjectileGraphicsDirectionEnum.DOWN) {
                    }
                    else if (projectileComp.projectileGraphicsDirection ===
                        ProjectileGraphicsDirectionEnum.UP) {
                        if (projectileComp.weaponType != WeaponTypeEnum.MAGIC) {
                            let quad = graphComp.object;
                            quad.textureMatrix.scale(1, -1, 1);
                            let animComp = (e.getComponent(ComponentTypeEnum.ANIMATION));
                            animComp.startingTile.y = 5;
                        }
                    }
                }
                posComp.calculateMatrix(graphComp.object.modelMatrix);
            }
            let pointLightComp = (e.getComponent(ComponentTypeEnum.POINTLIGHT));
            if (pointLightComp && posComp) {
                pointLightComp.pointLight.position
                    .deepAssign(posComp.position)
                    .add(pointLightComp.posOffset);
            }
        }
    }
}
//# sourceMappingURL=GraphicsSystem.js.map