import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import MovementComponent from "../Components/MovementComponent.js";
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

			if (movementComp.velocity.length2() <= 0.01) {
				animationComp.startingTile = { x: 2, y: 0 };
				animationComp.advanceBy = { x: 0, y: 0 };
				positionComp.rotation.setValues(-30.0, 0.0, 0.0);
				return;
			}

			positionComp.rotation.setValues(-30.0, 0.0, 0.0);
			if (movementComp.accelerationDirection.z > 0) {
				animationComp.startingTile = { x: 0, y: 0 };
				animationComp.advanceBy = { x: 1, y: 0 };
				if (movementComp.accelerationDirection.x < 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			} else {
				animationComp.startingTile = { x: 0, y: 1 };
				animationComp.advanceBy = { x: 1, y: 0 };
				if (movementComp.accelerationDirection.x > 0) {
					positionComp.rotation.setValues(-40.0, -15.0, 5.0);
				} else {
					positionComp.rotation.setValues(-40.0, 15.0, -5.0);
				}
			}
		});
	}
}
