import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DamageComponent from "../Components/DamageComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
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

			const damagedEntity = collisionComp.currentCollisionEntities
				.values()
				.next();
			const damEnHealth = damagedEntity.value.getComponent(
				ComponentTypeEnum.HEALTH
			) as HealthComponent;

			const playerComp = damagedEntity.value.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;
			if (playerComp) {
				if (playerComp.dodgeing) {
					return;
				}
			}

			if (damEnHealth) {
				damEnHealth.health -= damageComp.damage;
			}

			this.ecsManager.removeComponent(e, ComponentTypeEnum.GRAPHICS);
			this.ecsManager.removeEntity(e.id);
		});
	}
}
