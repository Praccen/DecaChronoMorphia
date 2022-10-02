import { ComponentTypeEnum } from "../Components/Component.js";
import HealthComponent from "../Components/HealthComponent.js";
import ECSManager from "../ECSManager.js";
import System from "./System.js";

export default class HealthSystem extends System {
	ecsManager: ECSManager;

	constructor(manager: ECSManager) {
		super([ComponentTypeEnum.HEALTH]);
		this.ecsManager = manager;
	}

	update(dt: number): void {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const healthComp = e.getComponent(
				ComponentTypeEnum.HEALTH
			) as HealthComponent;

			if (healthComp.health <= 0) {
				this.ecsManager.removeComponent(e, ComponentTypeEnum.GRAPHICS);
				this.ecsManager.removeEntity(e.id);
			}
		});
	}
}
