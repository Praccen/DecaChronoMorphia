import AudioComponent, { AudioTypeEnum } from "../Components/AudioComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import HealthComponent from "../Components/HealthComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
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
				const audioComp = e.getComponent(
					ComponentTypeEnum.AUDIO
				) as AudioComponent;
				if (audioComp) {
					audioComp.sounds[AudioTypeEnum.DEATH].requestPlay = true;
				}

				let pComp = e.getComponent(ComponentTypeEnum.PLAYER) as PlayerComponent;
				if (pComp) {
					// This is the player dying
					pComp.player.isDead = true;
				}

				this.ecsManager.removeComponent(e, ComponentTypeEnum.GRAPHICS);
				this.ecsManager.removeEntity(e.id);
			}
		});
	}
}
