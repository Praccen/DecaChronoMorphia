import { AudioTypeEnum } from "../Components/AudioComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class DamageSystem extends System {
    ecsManager;
    constructor(manager) {
        super([ComponentTypeEnum.DAMAGE, ComponentTypeEnum.COLLISION]);
        this.ecsManager = manager;
    }
    update(dt) {
        this.entities.forEach((e) => {
            const damageComp = e.getComponent(ComponentTypeEnum.DAMAGE);
            const collisionComp = e.getComponent(ComponentTypeEnum.COLLISION);
            if (collisionComp.currentCollisionEntities.size === 0) {
                return;
            }
            const damagedEntity = collisionComp.currentCollisionEntities
                .values()
                .next();
            const damEnHealth = damagedEntity.value.getComponent(ComponentTypeEnum.HEALTH);
            const playerComp = damagedEntity.value.getComponent(ComponentTypeEnum.PLAYER);
            if (playerComp) {
                if (playerComp.dodgeing) {
                    return;
                }
                const audioComp = damagedEntity.value.getComponent(ComponentTypeEnum.AUDIO);
                if (audioComp) {
                    audioComp.sounds[AudioTypeEnum.DAMAGE].requestPlay = true;
                }
            }
            if (damEnHealth) {
                damEnHealth.health -= damageComp.damage;
            }
            let pointLightComp = e.getComponent(ComponentTypeEnum.POINTLIGHT);
            pointLightComp.pointLight.removed = true;
            this.ecsManager.removeComponent(e, ComponentTypeEnum.GRAPHICS);
            this.ecsManager.removeEntity(e.id);
        });
    }
}
//# sourceMappingURL=DamageSystem.js.map