import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class HealthSystem extends System {
    ecsManager;
    constructor(manager) {
        super([ComponentTypeEnum.HEALTH]);
        this.ecsManager = manager;
    }
    update(dt) {
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const healthComp = e.getComponent(ComponentTypeEnum.HEALTH);
            if (healthComp.health <= 0) {
                this.ecsManager.removeComponent(e, ComponentTypeEnum.GRAPHICS);
                this.ecsManager.removeEntity(e.id);
            }
        });
    }
}
//# sourceMappingURL=HealthSystem.js.map