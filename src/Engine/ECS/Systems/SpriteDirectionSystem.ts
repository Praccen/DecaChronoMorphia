import AnimationComponent from "../Components/AnimationComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import MovementComponent from "../Components/MovementComponent.js";
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

			if (movementComp.velocity.length2() <= 0.01) {
				animationComp.startingTile = { x: 2, y: 0 };
				animationComp.advanceBy = { x: 0, y: 0 };
				return;
			}

			if (movementComp.accelerationDirection.z > 0) {
				animationComp.startingTile = { x: 0, y: 0 };
				animationComp.advanceBy = { x: 1, y: 0 };
			} else {
				animationComp.startingTile = { x: 0, y: 1 };
				animationComp.advanceBy = { x: 1, y: 0 };
			}
		});
	}
}
