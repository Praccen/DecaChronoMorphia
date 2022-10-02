import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import MovementComponent from "../Components/MovementComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import System from "./System.js";

export default class SpriteDirectionSystem extends System {
	constructor() {
		super([
			ComponentTypeEnum.POSITION,
			ComponentTypeEnum.MOVEMENT,
			ComponentTypeEnum.ANIMATION,
		]);
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			if (!e.isActive) {
				return;
			}
			const movementComp = e.getComponent(
				ComponentTypeEnum.MOVEMENT
			) as MovementComponent;

			const animationComp = e.getComponent(
				ComponentTypeEnum.ANIMATION
			) as AnimationComponent;

			const positionComp = e.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;

			const playerComp = e.getComponent(
				ComponentTypeEnum.PLAYER
			) as PlayerComponent;

			let playerDodge = false;
			if (playerComp) {
				playerDodge = playerComp.dodgeing;
			}

			positionComp.rotation.setValues(-30.0, 0.0, 0.0);
			animationComp.modAdvancement = { x: 2, y: 0 };
			if (movementComp.velocity.length2() <= 0.07) {
				if (!playerDodge) {
					animationComp.startingTile = { x: 2, y: 1 };
					animationComp.advanceBy = { x: 0, y: 0 };
					return;
				}
			}

			if (movementComp.accelerationDirection.z >= 0) {
				animationComp.startingTile = { x: 0, y: 1 };
				animationComp.advanceBy = { x: 1, y: 0 };

				if (movementComp.accelerationDirection.x < 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else if (movementComp.accelerationDirection.x > 0) {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			} else if (movementComp.accelerationDirection.z < 0) {
				animationComp.startingTile = { x: 0, y: 0 };
				animationComp.advanceBy = { x: 1, y: 0 };
				if (movementComp.accelerationDirection.x > 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else if (movementComp.accelerationDirection.x < 0) {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			}
			if (playerDodge) {
				animationComp.startingTile = { x: 0, y: 2 };
				animationComp.advanceBy = { x: 1, y: 0 };
				animationComp.modAdvancement = { x: 6, y: 0 };
			}
		});
	}
}
