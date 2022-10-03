import CollisionComponent from "../Components/CollisionComponent.js";
import { ComponentTypeEnum } from "../Components/Component.js";
import DoorComponent from "../Components/DoorComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import System from "./System.js";

export default class DoorSystem extends System {
	constructor() {
		super([
			ComponentTypeEnum.DOOR,
			ComponentTypeEnum.COLLISION,
			ComponentTypeEnum.POSITION,
		]);
	}

	update(dt: number) {
		this.entities.forEach((e) => {
			let doorComp = e.getComponent(ComponentTypeEnum.DOOR) as DoorComponent;
			const collisionComp = e.getComponent(
				ComponentTypeEnum.COLLISION
			) as CollisionComponent;
			let posComp = e.getComponent(
				ComponentTypeEnum.POSITION
			) as PositionComponent;

			if (collisionComp.currentCollisionEntities.size > 0) {
				if (!doorComp.isOpen) {
					// Ugly maths for opening door
					let [collidingEntity] = collisionComp.currentCollisionEntities;
					let collidingEntityPosComp = collidingEntity.getComponent(
						ComponentTypeEnum.POSITION
					) as PositionComponent;

					if (
						collidingEntityPosComp &&
						(posComp.position.x > collidingEntityPosComp.position.x ||
							posComp.position.z > collidingEntityPosComp.position.z)
					) {
						posComp.position.x += 0.5;
						posComp.position.z += 0.5;
					} else {
						posComp.position.x -= 0.5;
						posComp.position.z -= 0.5;
					}

					posComp.rotation.y += 90;
					doorComp.isOpen = true;
				}
			}
		});
	}
}
