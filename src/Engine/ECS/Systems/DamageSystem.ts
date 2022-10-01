import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class DamageSystem extends System {
	ecsManager: ECSManager;

	constructor(manager: ECSManager) {
		super([ComponentTypeEnum.DAMAGE, ComponentTypeEnum.COLLISION]);
		this.ecsManager = manager;
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			const damageComp = e.getComponent(
				ComponentTypeEnum.DAMAGE
			) as DamageComponent;
			const collisionComp = e.getComponent(
				ComponentTypeEnum.COLLISION
			) as CollisionComponent;

			if (collisionComp.currentCollisionEntities.size === 0) {
				return;
			}

			const damagedEntity = collisionComp.currentCollisionEntities.values()[0];
			console.log("damagedEntity hit!:>> ", damagedEntity);
			this.ecsManager.removeEntity(e.id);
		});
	}
}
