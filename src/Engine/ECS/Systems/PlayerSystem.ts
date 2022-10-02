import { ComponentTypeEnum } from "../Components/Component.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import System from "./System.js";

export default class PlayerSystem extends System {
	private timePassed: number;

	constructor() {
		super([ComponentTypeEnum.PLAYER]);
		this.timePassed = 1000;
	}

	update(dt: number): void {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const playerComp = e.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;

			this.timePassed += dt;
			if (playerComp.startDodge && !playerComp.dodgeing) {
				if (this.timePassed > playerComp.dodgeCooldown) {
					this.timePassed = 0;
					playerComp.dodgeing = true;
				}
			} else if (playerComp.dodgeing) {
				if (this.timePassed > playerComp.dodgeLength) {
					playerComp.dodgeing = false;
					this.timePassed = 0;
				}
			}
			playerComp.startDodge = false;
		});
	}
}
