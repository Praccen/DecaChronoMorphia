import Vec3 from "../../Maths/Vec3.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import System from "./System.js";
export default class EnemySystem extends System {
    ecsManager;
    rendering;
    constructor(manager, rendering) {
        super([
            ComponentTypeEnum.ENEMY,
            ComponentTypeEnum.POSITION,
            ComponentTypeEnum.MOVEMENT,
            ComponentTypeEnum.WEAPON,
        ]);
        this.ecsManager = manager;
        this.rendering = rendering;
    }
    update(dt) {
        this.entities.forEach((e) => {
            if (!e.isActive) {
                return;
            }
            const enemyComp = e.getComponent(ComponentTypeEnum.ENEMY);
            if (enemyComp.targetEntityId === undefined) {
                return;
            }
            const targetEntity = this.ecsManager.getEntity(enemyComp.targetEntityId);
            if (!targetEntity) {
                return;
            }
            const targetPositionComp = targetEntity.getComponent(ComponentTypeEnum.POSITION);
            const positionComp = e.getComponent(ComponentTypeEnum.POSITION);
            const movementComp = e.getComponent(ComponentTypeEnum.MOVEMENT);
            const weaponComp = e.getComponent(ComponentTypeEnum.WEAPON);
            const graphComp = e.getComponent(ComponentTypeEnum.GRAPHICS);
            const animComp = e.getComponent(ComponentTypeEnum.ANIMATION);
            const directionToEnemy = new Vec3({
                x: targetPositionComp.position.x,
                y: targetPositionComp.position.y,
                z: targetPositionComp.position.z,
            }).subtract(positionComp.position);
            if (graphComp && animComp) {
                let quad = graphComp.object;
                if (directionToEnemy.x < 0) {
                    quad.textureMatrix.scale(-1, 1, 1);
                }
            }
            const distanceToEnemy = directionToEnemy.length();
            if (distanceToEnemy > weaponComp.range) {
                //not within range, move closer to attack
                movementComp.accelerationDirection = directionToEnemy;
                return;
            }
            weaponComp.attackRequested = true;
            weaponComp.direction = new Vec3(directionToEnemy).normalize();
            weaponComp.position = new Vec3({
                x: weaponComp.direction.x * 1 + positionComp.position.x,
                y: 0.5,
                z: weaponComp.direction.z * 1 + positionComp.position.z,
            });
        });
    }
}
//# sourceMappingURL=EnemySystem.js.map